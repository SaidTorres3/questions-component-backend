import { Args, ArgsType, Ctx, Field, Float, ID, InputType, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entity/answer";
import { Full_Question } from "../../entity/full_question";
import { Question } from "../../entity/question";

@InputType()
class CreateFullQuestionInput {
  @Field(type => String, { nullable: true })
  imgUrl: string;
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
    full_question.imgUrl = input.imgUrl
    const fullQuestion = await connection.manager.save(full_question)

    let question = new Question()
    question.full_question = fullQuestion.uuid

    question.es = "¿Cómo calificaría su experiencia en Hotel Palmeras? 🏨🌴"
    question.en = "How would you rate your experience in Hotel Palmeras? 🏨🌴"
    await connection.manager.save(question)

    let answer = new Answer()
    answer.full_question = fullQuestion.uuid
    answer.value = JSON.stringify(5)
    answer.es = "Muy Buena 😀"
    answer.en = "Awesome 😀"
    await connection.manager.save(answer)

    return {
      createdUuid: fullQuestion.uuid,
    };
  }
}
