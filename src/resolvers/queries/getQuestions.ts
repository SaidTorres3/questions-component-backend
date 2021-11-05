import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Question } from "../../entities/question";

@ObjectType()
class GetQuestionsPayload {
  @Field(type => [Question])
  questions: Question[];
}

@Resolver()
export class GetQuestionsQuery {
  @Query(type => GetQuestionsPayload)
  async getQuestions(
    @Ctx() connection: Connection
  ): Promise<GetQuestionsPayload> {
    const questions = await connection.manager.find(Question)
    return {
      questions
    }
  }
}