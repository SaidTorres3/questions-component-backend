import { Ctx, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Posted_Answer } from "../../entities/posted_answer";
import { Question } from "../../entities/question";

@ObjectType()
class GetStatsPayload {
  @Field(type => Int)
  averageScore: number
}

@Resolver()
export class GetStatsQuery {
  @Query(type => GetStatsPayload)
  async getStats(
    @Ctx() connection: Connection
  ): Promise<GetStatsPayload> {
    const postedAnswers = await connection.manager.find(Posted_Answer)

    const scores = postedAnswers.map((postedAnswer) => {
      console.log(postedAnswer.answer.value)
      if (typeof postedAnswer.answer.value === 'number') {
        const numberOfAnswersInQuestion = postedAnswer.answer.question.answers.length
        const score = postedAnswer.answer.value / numberOfAnswersInQuestion
        return score
      }
      return -1
    }).filter(postedAnswers => postedAnswers >= 0)

    let avgScore = 0;
    for (const score of scores) {
      avgScore += score
    }
    avgScore = avgScore / scores.length

    return {
      averageScore: avgScore
    }
  }
}