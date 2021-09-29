import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Full_Question } from "../../entities/full_question";

@ObjectType()
class GetFullQuestionsPayload {
  @Field(type => [Full_Question])
  questions: Full_Question[];
}

@Resolver()
export class GetFullQuestionsQuery {
  @Query(type => GetFullQuestionsPayload)
  async getFullQuestions(
    @Ctx() connection: Connection
  ): Promise<GetFullQuestionsPayload> {

    const full_questions = await connection.manager.find(Full_Question)
    return {
      questions: full_questions
    }
  }
}