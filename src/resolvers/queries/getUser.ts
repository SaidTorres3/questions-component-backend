import {
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../../index";
import { User, UserType } from "../../entities/user";
import autorizate from "../autorizate";

@InputType()
class GetUserInput {
  @Field((of) => ID)
  userUuid: string;
}

@ArgsType()
class GetUserArgs {
  @Field((of) => GetUserInput)
  input: GetUserInput;
}

@ObjectType()
class GetUserPayload {
  @Field((of) => User)
  user: User;
}

@Resolver()
export class GetUser {
  @Query((type) => GetUserPayload)
  async getUser(
    @Ctx() context: Context,
    @Args() { input }: GetUserArgs
  ): Promise<GetUserPayload> {
    const autorizationValidation = await autorizate({ context });
    if (!autorizationValidation || autorizationValidation !== UserType.admin) {
      throw new Error("Unauthorized");
    }

    const user = await context.connection.manager.findOneOrFail(User, {
      where: { uuid: input.userUuid },
    });

    return {
      user,
    };
  }
}
