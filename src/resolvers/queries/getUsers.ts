import {
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Maybe,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
} from "type-graphql";
import { Context } from "./../../index"
import { User } from "../../entities/user";
import { PaginatedPayload, PaginationArgs } from "./args/pagination";
import { SortInput } from "./args/sort";

@ObjectType()
class GetUsersPayload extends PaginatedPayload(User) {}

enum GetUsersSortBy {
  createdAt = "users.createdAt",
  id = "users.id",
}
registerEnumType(GetUsersSortBy, { name: "GetUsersSortBy" });

@InputType()
class GetUsersSortInput extends SortInput(GetUsersSortBy) {}

@InputType()
class GetUsersFilterInput {
  @Field((type) => String, { nullable: true })
  nameSearch: Maybe<string>;
}
@ArgsType()
class GetUsersArgs {
  @Field((type) => GetUsersSortInput, { nullable: true })
  sort: Maybe<GetUsersSortInput>;

  @Field((type) => GetUsersFilterInput, { nullable: true })
  filter: Maybe<GetUsersFilterInput>;
}

@Resolver()
export class GetUsers {
  @Query((type) => GetUsersPayload)
  async getUsers(
    @Ctx() context: Context,
    @Args() { skip, take }: PaginationArgs,
    @Args() { sort, filter }: GetUsersArgs
  ): Promise<GetUsersPayload> {
    const [users, total] = await context.connection.manager.findAndCount(User, {
      order: {
        createdAt: sort
          ? sort.by === GetUsersSortBy.createdAt
            ? sort.direction
            : undefined
          : undefined,
        id: sort
          ? sort.by === GetUsersSortBy.id
            ? sort.direction
            : undefined
          : undefined,
      },
      take,
      skip,
    });

    return {
      items: users,
      hasMore: skip + take < total,
      skip,
      take,
      total,
    };
  }
}
