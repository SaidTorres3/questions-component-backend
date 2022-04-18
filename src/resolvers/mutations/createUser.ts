import {
  Args,
  ArgsType,
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
import autorizate from "../autorizate";
import { hashPassword } from "../../utils/hashPassword";

@InputType()
class CreateUserInput {
  @Field((type) => String)
  username: string;
  @Field((type) => String)
  password: string;
  @Field((type) => String)
  type: UserType;
}

@ArgsType()
class CreateUserArgs {
  @Field((type) => CreateUserInput, { nullable: true })
  input: CreateUserInput;
}

@ObjectType()
class CreateUserPayload {
  @Field((type) => ID, { nullable: false })
  createdUuid!: string;
}

@Resolver()
export class CreateUserMutation {
  @Mutation((type) => CreateUserPayload, { nullable: false })
  async createUser(
    @Args() { input }: CreateUserArgs,
    @Ctx() context: Context
  ): Promise<CreateUserPayload> {
    const autorizationValidation = await autorizate({ context });
    if (!autorizationValidation || autorizationValidation !== UserType.admin) {
      throw new Error("Unauthorized");
    }

    let user = new User();
    user.username = input.username;
    user.type = input.type;

    const password = await hashPassword(input.password);
    user.password = password;

    const filled_User = await context.connection.manager.save(user);

    return { createdUuid: filled_User.uuid };
  }
}