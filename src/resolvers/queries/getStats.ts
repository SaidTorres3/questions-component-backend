import { Ctx, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Posted_Answer } from "../../entities/posted_answer";
import { Question } from "../../entities/question";
import { Respondent } from "../../entities/respondent";

@ObjectType()
class SelectedAnswersChart {
  @Field(type => [String])
  labels: string[];
  @Field(type => [Int])
  count: number[];
  @Field(type => Int)
  hightestCount: number;
}

@ObjectType()
class MonthlyAnswersChart {
  @Field(type => [Int])
  monthlyCount: number[];
  @Field(type => Int)
  hightestCount: number;  
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
  @Field(type => SelectedAnswersChart)
  selectedAnswersChart: SelectedAnswersChart
  @Field(type => MonthlyAnswersChart)
  monthlyAnswersChart: MonthlyAnswersChart
}

@Resolver()
export class GetStatsQuery {
  @Query(type => GetStatsPayload)
  async getStats(
    @Ctx() connection: Connection
  ): Promise<GetStatsPayload> {
    const postedAnswers = await connection.manager.find(Posted_Answer, { relations: ["answer"] })
    const [respondents, respondentsAmount] = await connection.manager.findAndCount(Respondent)
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
    if(averageScore) {
      averageScore = (averageScore / scores.length) * 100
    }

    let monthlyAverageScore = 0;
    for (const monthlyScore of monthlyScores) {
      monthlyAverageScore += monthlyScore
    }
    if(monthlyAverageScore) {
      monthlyAverageScore = (monthlyAverageScore / monthlyScores.length) * 100
    }

    const getSelectedValues = (numericValues: number[]) => {
      // sort numericValues in ascending order
      numericValues.sort((a, b) => a - b)
      const selectedValues: SelectedAnswersChart = { labels: [], count: [], hightestCount: 0 }
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
        selectedValues.labels.push(label.toString())
        selectedValues.count.push(count)
      }
      selectedValues.hightestCount = getHighestValue(selectedValues.count)
      return selectedValues
    }
    const selectedAnswersChart = getSelectedValues(numericValues)

    // function that recibes respondents and returns an array of counts for each month of the year
    const getMonthlyCounts = (respondents: Respondent[]): MonthlyAnswersChart => {
      const monthlyCount: number[] = []
      const today = new Date()
      const currentYear = today.getFullYear()
      for (let i = 0; i < 12; i++) {
        let count = 0
        for (let j = 0; j < respondents.length; j++) {
          const answer = respondents[j]
          const answerDate = answer.createdAt
          const answerMonth = answerDate.getMonth()
          const answerYear = answerDate.getFullYear()
          if (answerMonth === i && answerYear === currentYear) {
            count++
          }
        }
        monthlyCount.push(count)
      }
      const hightestCount = getHighestValue(monthlyCount)

      return { monthlyCount, hightestCount }
    }
    const monthlyAnswersChart = getMonthlyCounts(respondents)

    return {
      monthlyAverageScore: Math.round(monthlyAverageScore),
      averageScore: Math.round(averageScore),
      questionsAmount: Math.round(questionsAmount),
      respondentsAmount: Math.round(respondentsAmount),
      selectedAnswersChart,
      monthlyAnswersChart
    }
  }
}

const getHighestValue = (array: number[]) => {
  let highestValue = 0
  for (let i = 0; i < array.length; i++) {
    if (array[i] > highestValue) {
      highestValue = array[i]
    }
  }
  return highestValue
}