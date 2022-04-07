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
import jtw from "jsonwebtoken";
import { features } from "process";
require("dotenv").config();

@InputType()
class ValidadeTokenInput {
  @Field((type) => String)
  token: string;
}

@ArgsType()
class ValidadeTokenArgs {
  @Field((type) => ValidadeTokenInput, { nullable: true })
  input: ValidadeTokenInput;
}

@ObjectType()
export class ValidadeTokenPayloadSuccess {
  @Field((type) => User)
  user!: User;
}

@ObjectType()
export class ValidadeTokenPayloadFail {
  @Field((type) => String)
  message!: string;
}

const ValidadeTokenPayload = createUnionType({
  name: "ValidadeTokenPayload",
  types: () => [ValidadeTokenPayloadSuccess, ValidadeTokenPayloadFail],
});

@Resolver()
export class ValidadeTokenMutation {
  @Mutation((type) => ValidadeTokenPayload, { nullable: true })
  async validadeToken(
    @Args() { input }: ValidadeTokenArgs,
    @Ctx() context: Context
  ): Promise<typeof ValidadeTokenPayload> {
    const fail_msg = new ValidadeTokenPayloadFail();
    fail_msg.message = "Error msg";

    if (!process.env.SECRET) {
      console.error(
        "No secret found, please, add a SECRET in the .env file. E.g. SECRET=mysecret"
      );
      return fail_msg;
    }

    const decoded_password = jtw.decode(input.token, { json: true }) as TokenResponse;
    if (!decoded_password) {
      return fail_msg;
    }

    const user = await context.connection.manager.findOne(User, {
      where: { uuid: decoded_password.userUuid },
    });
    
    if (!user) {
      return fail_msg;
    }

    const success = new ValidadeTokenPayloadSuccess();
    success.user = user;
    return success;
  }
}

interface TokenResponse {
  userUuid: string;
  userType: UserType;
}
