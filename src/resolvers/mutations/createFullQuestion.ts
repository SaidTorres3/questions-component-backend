import GraphQLJSON from "graphql-type-json";
import { Args, ArgsType, Ctx, Field, Float, ID, InputType, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Full_Question } from "../../entities/full_question";
import { Question } from "../../entities/question";

@InputType()
abstract class AnswerInterface {
  @Field(type => GraphQLJSON)
  value: any;
  @Field(type => String)
  es: string;
  @Field(type => String)
  en: string;
}

@InputType()
abstract class QuestionInterface {
  @Field(type => String)
  es: string
  @Field(type => String)
  en: string
}

@InputType()
class CreateFullQuestionInput {
  @Field(type => String, { nullable: true })
  imgUrl: string;

  @Field(type => QuestionInterface)
  questionParams: QuestionInterface

  @Field(type => [AnswerInterface])
  answersParams: AnswerInterface[]
}

@ArgsType()
class CreateFullQuestionArgs {
  @Field(type => CreateFullQuestionInput, { nullable: true })
  input: CreateFullQuestionInput;
}

@ObjectType()
class CreateFullQuestionPayload {
  @Field(type => ID, { nullable: false })
  createdUuid!: string;
}

@Resolver()
export class CreateFullQuestionMutation {
  @Mutation(type => CreateFullQuestionPayload, { nullable: false })
  async createFullQuestion(
    @Args() { input }: CreateFullQuestionArgs,
    @Ctx() connection: Connection
  ): Promise<CreateFullQuestionPayload> {
    let full_question = new Full_Question()
    if (input.imgUrl) {
      full_question.imgUrl = input.imgUrl
    }
    const fullQuestion = await connection.manager.save(full_question)

    let question = new Question()
    question.full_question = fullQuestion.uuid

    question.es = input.questionParams.es
    question.en = input.questionParams.en
    await connection.manager.save(question)

    input.answersParams.map(async (answerParams)=>{
      let answer = new Answer()
      answer.full_question = fullQuestion.uuid
      answer.value = answerParams.value
      answer.es = answerParams.es
      answer.en = answerParams.en
      await connection.manager.save(answer)
    })

    return {
      createdUuid: fullQuestion.uuid,
    };
  }
}
