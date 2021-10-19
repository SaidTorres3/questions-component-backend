import { Ctx, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Posted_Answer } from "../../entities/posted_answer";
import { Question } from "../../entities/question";
import { Respondent } from "../../entities/respondent";

@ObjectType()
class GetStatsPayload {
  @Field(type => Int)
  monthlyAverageScore: number
  @Field(type => Int)
  averageScore: number
  @Field(type => Int)
  questionsAmount: number
  @Field(type => Int)
  respondentsAmount: number
}

@Resolver()
export class GetStatsQuery {
  @Query(type => GetStatsPayload)
  async getStats(
    @Ctx() connection: Connection
  ): Promise<GetStatsPayload> {
    const postedAnswers = await connection.manager.find(Posted_Answer, { relations: ["answer"] })
    const respondentsAmount = await connection.manager.count(Respondent)
    const questionsAmount = await connection.manager.count(Question)
    let monthlyScores: number[] = [];
    const today = new Date()

    let scores = await Promise.all(
      postedAnswers.map(async (postedAnswer) => {
        const answer = await connection.manager.findOneOrFail(Answer, { where: { uuid: postedAnswer.answer.uuid }, relations: ["question"] })
        if (typeof answer.value === 'number') {
          const [answers, numberOfAnswersInQuestion] = await connection.manager.findAndCount(Answer, { where: { question: answer.question } })
          const score = answer.value / numberOfAnswersInQuestion
          const timeDiff = today.getTime() - postedAnswer.createdAt.getTime()
          const daysDiff = timeDiff / (1000 * 3600 * 24)
          if(daysDiff <= 30) {
            monthlyScores.push(score)
          }

          return score
        }
        return -1
      })
    )

    scores = scores.filter(score => score >= 0)

    let averageScore = 0;
    for (const score of scores) {
      averageScore += score
    }
    
    let monthlyAverageScore = 0;
    for (const monthlyScore of monthlyScores) {
      monthlyAverageScore += monthlyScore
    }

    averageScore = (averageScore / scores.length) * 100
    monthlyAverageScore = (monthlyAverageScore / monthlyScores.length) * 100
    return {
      monthlyAverageScore,
      averageScore,
      questionsAmount,
      respondentsAmount
    }
  }
}