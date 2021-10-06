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
      let posted_answer = new Posted_Answer()
      const answer = await connection.manager.findOne(Answer, { where: { uuid: answerUuid }, relations: ["question"] })
      if (answer) {
        posted_answer.answer = answer
        posted_answer.question = answer.question
        posted_answer.respondent = respondent
        posted_answer = await connection.manager.save(posted_answer)
        if (respondent.posted_answers) {
          respondent.posted_answers.push(posted_answer)
        } else {
          respondent.posted_answers = [posted_answer]
        }
        await connection.manager.save(Respondent, respondent)
      }
    }
    

    return {
      response: "Answers posted sucessfully!"
    };
  }
}
