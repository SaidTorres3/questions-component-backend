import { Args, ArgsType, Ctx, Field, ID, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Posted_Answer } from "../../entities/posted_answer";
import { Respondent } from "../../entities/respondent";

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

    let respondent = new Respondent()
    respondent = await connection.manager.save(Respondent, respondent)

    for (const answerUuid of input.answersUuid) {
      const answer_to_post = new Posted_Answer()
      const answer = await connection.manager.findOne(Answer, { where: { uuid: answerUuid }, relations: ["full_question"] })
      if (answer) {
        answer_to_post.answer = answer
        answer_to_post.full_question = answer.full_question
        answer_to_post.respondent = respondent
        await connection.manager.save(answer_to_post)
      }
    }

    return {
      response: "Answers posted sucessfully!"
    };
  }
}
