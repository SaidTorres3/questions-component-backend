import { Args, ArgsType, Ctx, Field, InputType, Maybe, ObjectType, Query, registerEnumType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Respondent } from "../../entities/respondent";
import { PaginatedPayload, PaginationArgs } from "./args/pagination";
import { SortInput } from "./args/sort";

@ObjectType()
class GetRespondentsPayload extends PaginatedPayload(Respondent) { }

enum GetRespondentsSortBy {
  createdAt = "respondents.createdAt",
  id = "respondents.id",
}
registerEnumType(GetRespondentsSortBy, { name: "GetRespondentsSortBy" })

@InputType()
class GetRespondentsSortInput extends SortInput(GetRespondentsSortBy) { }

@InputType()
class GetRespondentsFilterInput {
  @Field(type => String, { nullable: true })
  nameSearch: Maybe<string>;
}
@ArgsType()
class GetRespondentsArgs {
  @Field(type => GetRespondentsSortInput, { nullable: true })
  sort: Maybe<GetRespondentsSortInput>;

  @Field(type => GetRespondentsFilterInput, { nullable: true })
  filter: Maybe<GetRespondentsFilterInput>;
}

@Resolver()
export class GetRespondents {
  @Query(type => GetRespondentsPayload)
  async getRespondents(
    @Ctx() connection: Connection,
    @Args() { skip, take }: PaginationArgs,
    @Args() { sort, filter }: GetRespondentsArgs,
  ): Promise<GetRespondentsPayload> {
    const [respondents, total] = await connection.manager.findAndCount(Respondent, { order: {
      createdAt: sort ? (sort.by === GetRespondentsSortBy.createdAt ? sort.direction : undefined) : (undefined),
      id: sort ? (sort.by === GetRespondentsSortBy.id ? sort.direction : undefined) : (undefined)
    }, take, skip });

    return {
      items: respondents,
      hasMore: (skip + take) < total,
      skip,
      take,
      total
    };
  }
}