import { Ctx, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
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
    const postedAnswers = await connection.manager.find(Posted_Answer, {relations: ["answer"]})

    let scores = await Promise.all(
      postedAnswers.map(async (postedAnswer) => {
        const answer = await connection.manager.findOneOrFail(Answer, { where: { uuid: postedAnswer.answer.uuid }, relations: ["question"] })
        if (typeof answer.value === 'number') {
          const [answers, numberOfAnswersInQuestion] = await connection.manager.findAndCount(Answer, { where: { question: answer.question } })
          const score = answer.value / numberOfAnswersInQuestion
          return score
        }
        return -1
      })
    )

    scores = scores.filter(score => score >= 0)

    let avgScore = 0;
    for (const score of scores) {
      avgScore += score
    }
    avgScore = (avgScore / scores.length) * 100

    return {
      averageScore: avgScore
    }
  }
}