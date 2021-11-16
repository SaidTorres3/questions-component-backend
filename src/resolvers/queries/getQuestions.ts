import { Args, ArgsType, Ctx, Field, InputType, Maybe, ObjectType, Query, registerEnumType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Question } from "../../entities/question";
import { PaginatedPayload, PaginationArgs } from "./args/pagination";
import { SortInput } from "./args/sort";

enum GetQuestionsSortBy {
  createdAt = "questions.createdAt",
}
registerEnumType(GetQuestionsSortBy, { name: "GetQuestionsSortBy" })

@InputType()
class GetQuestionsSortInput extends SortInput(GetQuestionsSortBy) { }

@InputType()
class GetQuestionsFilterInput {
  @Field(type => String, { nullable: true })
  nameSearch: Maybe<string>;
}

@ArgsType()
class GetQuestionsArgs {
  @Field(type => GetQuestionsSortInput, { nullable: true })
  sort: Maybe<GetQuestionsSortInput>;

  @Field(type => GetQuestionsFilterInput, { nullable: true })
  filter: Maybe<GetQuestionsFilterInput>;
}

@ObjectType()
class GetQuestionsPayload extends PaginatedPayload(Question) { }

@Resolver()
export class GetQuestionsQuery {
  @Query(type => GetQuestionsPayload)
  async getQuestions(
    @Ctx() connection: Connection,
    @Args() { skip, take }: PaginationArgs,
    @Args() { sort, filter }: GetQuestionsArgs,
  ): Promise<GetQuestionsPayload> {
    const [items, total] = await connection.manager.findAndCount(Question, { take: take, skip: skip, order: { createdAt: sort?.direction } });

    return {
      items,
      total,
      skip,
      take,
      hasMore: (skip + take) < total,
    }
  }
}