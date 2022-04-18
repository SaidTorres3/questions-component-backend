import {
  Args,
  ArgsType,
  createUnionType,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { Context } from "./../../index";
import { User, UserType } from "../../entities/user";
import * as bcrypt from "bcryptjs";
import autorizate from "../autorizate";
import { hashPassword } from "../../utils/hashPassword";
require("dotenv").config();

@InputType()
class ChangeUserPasswordInput {
  @Field((type) => String)
  userUuid: string;

  @Field((type) => String)
  actualPassword: string;

  @Field((type) => String)
  newPassword: string;
}

@ArgsType()
class ChangeUserPasswordArgs {
  @Field((type) => ChangeUserPasswordInput, { nullable: true })
  input: ChangeUserPasswordInput;
}

@ObjectType()
export class ChangeUserPasswordPayloadSuccess {
  @Field((type) => User)
  user!: User;
}

@ObjectType()
export class ChangeUserPasswordPayloadFail {
  @Field((type) => String)
  message!: string;
}

const ChangeUserPasswordPayload = createUnionType({
  name: "ChangeUserPasswordPayload",
  types: () => [
    ChangeUserPasswordPayloadSuccess,
    ChangeUserPasswordPayloadFail,
  ],
});

@Resolver()
export class ChangeUserPasswordMutation {
  @Mutation((type) => ChangeUserPasswordPayload, { nullable: true })
  async changeUserPassword(
    @Args() { input }: ChangeUserPasswordArgs,
    @Ctx() context: Context
  ): Promise<typeof ChangeUserPasswordPayload> {
    const autorizationValidation = await autorizate({ context });
    if (!autorizationValidation || autorizationValidation !== UserType.admin) {
      throw new Error("Unauthorized");
    }

    const fail_msg = new ChangeUserPasswordPayloadFail();
    fail_msg.message = "Old password is wrong";

    const user = await context.connection.manager.findOneOrFail(User, {
      where: { uuid: input.userUuid },
    });

    const doesActualPasswordCorrect = await bcrypt.compare(input.actualPassword, user.password);
    if (!doesActualPasswordCorrect) {
      return fail_msg;
    }

    const newPassword = await hashPassword(input.newPassword);
    user.password = newPassword;

    await context.connection.manager.save(user);
    const userPayload = new ChangeUserPasswordPayloadSuccess();
    userPayload.user = user;

    return userPayload;
  }
}
