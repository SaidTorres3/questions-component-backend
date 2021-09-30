import { Args, ArgsType, Ctx, Field, ID, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { PostedAnswer } from "../../entities/posted_answer";

@InputType()
class CreatePostedAnswerInput {
  @Field(type => [ID], { nullable: true })
  answersUuid: string[];
}

@ArgsType()
class CreatePostedAnswerArgs {
  @Field(type => CreatePostedAnswerInput, { nullable: true })
  input: CreatePostedAnswerInput;
}

@ObjectType()
class CreatePostedAnswerPayload {
  @Field(type => String)
  response!: string;
}

@Resolver()
export class CreatePostedAnswerMutation {
  @Mutation(type => CreatePostedAnswerPayload, { nullable: false })
  async createPostedAnswers(
    @Args() { input }: CreatePostedAnswerArgs,
    @Ctx() connection: Connection
  ): Promise<CreatePostedAnswerPayload> {
    for (const answerUuid of input.answersUuid) {
      const answer_to_post = new PostedAnswer()

      const answer = await connection.manager.findOne(Answer, { where: { uuid: answerUuid }, relations: ["full_question"] })
      if (answer) {
        answer_to_post.answer = answer.uuid
        answer_to_post.full_question = answer.full_question
        await connection.manager.save(answer_to_post)
      }
    }

    return {
      response: "Answers posted sucessfully!"
    };
  }
}
