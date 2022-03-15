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
import { Connection } from "typeorm";
import { User } from "../../entities/user";

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
    @Ctx() connection: Connection,
    @Args() { input }: GetUserArgs
  ): Promise<GetUserPayload> {
    const user = await connection.manager.findOneOrFail(User, {
      where: { uuid: input.userUuid },
    });
    return {
      user,
    };
  }
}
