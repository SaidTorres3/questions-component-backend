import {
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../../index";
import { Posted_Answer } from "../../entities/posted_answer";
import { Question } from "../../entities/question";

@InputType()
class GetQuestionStatsInput {
  @Field((type) => ID)
  questionUuid: string;
}

@ArgsType()
class GetQuestionStatsArgs {
  @Field((type) => GetQuestionStatsInput)
  input: GetQuestionStatsInput;
}

@ObjectType()
class GetQuestionStatsSelectedAnswersChart {
  @Field((type) => [String])
  labels: string[];
  @Field((type) => [Int])
  count: number[];
  @Field((type) => Int)
  hightestCount: number;
  @Field((type) => Boolean)
  allNumericValues: boolean;
}

@ObjectType()
class GetQuestionStatsPayload {
  @Field((type) => GetQuestionStatsSelectedAnswersChart)
  selectedAnswersChart: GetQuestionStatsSelectedAnswersChart;
}

@Resolver()
export class GetQuestionStatsQuery {
  @Query((type) => GetQuestionStatsPayload)
  async getQuestionStats(
    @Args() { input }: GetQuestionStatsArgs,
    @Ctx() context: Context
  ): Promise<GetQuestionStatsPayload> {
    const question: Question = await context.connection.manager.findOneOrFail(
      Question,
      { where: { uuid: input.questionUuid }, relations: ["answers"] }
    );
    const answers = question.answers;

    let areAllAnswersValueNumeric = true;
    for (let answer of answers) {
      if (!(typeof answer.value === "number")) {
        areAllAnswersValueNumeric = false;
      }
    }

    const posted_answers = await context.connection.manager.find(Posted_Answer, {
      where: { question: question },
      relations: ["question", "answer"],
    });

    const getSelectedValues = (numericValues: number[]) => {
      // sort numericValues in ascending order
      numericValues.sort((a, b) => a - b);
      const selectedValues: GetQuestionStatsSelectedAnswersChart = {
        labels: [],
        count: [],
        hightestCount: 0,
        allNumericValues: areAllAnswersValueNumeric,
      };
      // return unique values of numericValues and their counts
      for (let i = 0; i < numericValues.length; i++) {
        let label = numericValues[i];
        let count = 1;
        for (let j = i + 1; j < numericValues.length; j++) {
          if (numericValues[j] === label) {
            count++;
            numericValues.splice(j, 1);
            j--;
          }
        }
        selectedValues.labels.push(label.toString());
        selectedValues.count.push(count);
      }
      selectedValues.hightestCount = getHighestValue(selectedValues.count);
      return selectedValues;
    };
    const selectedAnswersChart = getSelectedValues(
      posted_answers.map((posted_answer) => posted_answer.answer.value)
    );
    return { selectedAnswersChart };
  }
}

const getHighestValue = (array: number[]) => {
  let highestValue = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] > highestValue) {
      highestValue = array[i];
    }
  }
  return highestValue;
};
