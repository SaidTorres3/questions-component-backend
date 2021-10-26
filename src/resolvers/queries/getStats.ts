import { Ctx, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Posted_Answer } from "../../entities/posted_answer";
import { Question } from "../../entities/question";
import { Respondent } from "../../entities/respondent";

@ObjectType()
class SelectedAnswersChart {
  @Field(type => Int)
  label: number;
  @Field(type => Int)
  count: number;
}

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
  @Field(type => [SelectedAnswersChart])
  selectedAnswersChart: SelectedAnswersChart[]
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
    const today = new Date()

    const numericValues: number[] = []
    const scores: number[] = []
    const monthlyScores: number[] = [];

    for (let postedAnswer of postedAnswers) {
      const answer = await connection.manager.findOneOrFail(Answer, { where: { uuid: postedAnswer.answer.uuid }, relations: ["question"] })
      if (typeof answer.value === 'number') {
        const numberOfAnswersInQuestion = await connection.manager.count(Answer, { where: { question: answer.question } })
        numericValues.push(answer.value)
        const score = answer.value / numberOfAnswersInQuestion
        if (score >= 0) {
          scores.push(score)
          const timeDiff = today.getTime() - postedAnswer.createdAt.getTime()
          const daysDiff = timeDiff / (1000 * 3600 * 24)
          if (daysDiff <= 30) {
            monthlyScores.push(score)
          }
        }
      }
    }

    let averageScore = 0;
    for (const score of scores) {
      averageScore += score
    }
    averageScore = (averageScore / scores.length) * 100

    let monthlyAverageScore = 0;
    for (const monthlyScore of monthlyScores) {
      monthlyAverageScore += monthlyScore
    }
    monthlyAverageScore = (monthlyAverageScore / monthlyScores.length) * 100

    const getSelectedValues = (numericValues: number[]) => {
      // sort numericValues in ascending order
      numericValues.sort((a, b) => a - b)
      const selectedValues: SelectedAnswersChart[] = []
      // return unique values of numericValues and their counts
      for (let i = 0; i < numericValues.length; i++) {
        let label = numericValues[i]
        let count = 1
        for (let j = i + 1; j < numericValues.length; j++) {
          if (numericValues[j] === label) {
            count++
            numericValues.splice(j, 1)
            j--
          }
        }
        selectedValues.push({ label, count })
      }

      return selectedValues
    }
    const selectedAnswersChart = getSelectedValues(numericValues)
    console.log(selectedAnswersChart)

    return {
      monthlyAverageScore: Math.round(monthlyAverageScore),
      averageScore: Math.round(averageScore),
      questionsAmount: Math.round(questionsAmount),
      respondentsAmount: Math.round(respondentsAmount),
      selectedAnswersChart
    }
  }
}