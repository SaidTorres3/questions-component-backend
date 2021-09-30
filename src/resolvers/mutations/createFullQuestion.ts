import GraphQLJSON from "graphql-type-json";
import { Args, ArgsType, Ctx, Field, Float, ID, InputType, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Full_Question } from "../../entities/full_question";
import { Question } from "../../entities/question";
import { createFullQuestion } from "../../repository/full_question/create";

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
    const full_question_uuid = await createFullQuestion(connection, input)
    return { createdUuid: full_question_uuid }
  }
}
