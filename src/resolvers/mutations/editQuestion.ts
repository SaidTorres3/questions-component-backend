import GraphQLJSON from "graphql-type-json";
import { Args, ArgsType, Ctx, Field, Float, ID, InputType, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";

@InputType()
abstract class EditAnswerInput {
  @Field(type => ID)
  uuid: string;
  @Field(type => String)
  es: string;
  @Field(type => String)
  en: string;
}

@InputType()
class EditQuestionInput {
  @Field(type => ID)
  uuid: string;

  @Field(type => String, { nullable: true })
  imgUrl: string;

  @Field(type => String)
  es: string;

  @Field(type => String)
  en: string;

  @Field(type => [EditAnswerInput])
  answers: EditAnswerInput[]
}

@ArgsType()
class EditQuestionArgs {
  @Field(type => EditQuestionInput, { nullable: true })
  input: EditQuestionInput;
}

@ObjectType()
class EditQuestionPayload {
  @Field(type => ID, { nullable: false })
  questionUuid!: string;
}

@Resolver()
export class EditQuestionMutation {
  @Mutation(type => EditQuestionPayload, { nullable: false })
  async editQuestion(
    @Args() { input }: EditQuestionArgs,
    @Ctx() connection: Connection
  ): Promise<EditQuestionPayload> {
    let question = await connection.manager.findOneOrFail(Question, { where: { uuid: input.uuid } })
    input.imgUrl ? question.imgUrl = input.imgUrl : undefined
    input.es ? question.es = input.es : undefined
    input.en ? question.en = input.en : undefined

    for (const questionAnswer of input.answers) {
      const answer = await connection.manager.findOneOrFail(Answer, { where: { uuid: questionAnswer.uuid } })
      answer.es ? answer.es = questionAnswer.es : undefined
      answer.en ? answer.en = questionAnswer.en : undefined
      await connection.manager.save(answer)
    }
    await connection.manager.save(question)

    return { questionUuid: question.uuid }
  }
}
