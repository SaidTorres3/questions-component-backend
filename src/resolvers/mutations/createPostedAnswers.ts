import {
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Posted_Answer } from "../../entities/posted_answer";
import { Respondent } from "../../entities/respondent";
import { User } from "../../entities/user";

@InputType()
class CreatePostedAnswerInput {
  @Field((type) => [ID])
  answersUuid: string[];

  @Field((type) => ID)
  userUuid: string;
}

@ArgsType()
class CreatePostedAnswerArgs {
  @Field((type) => CreatePostedAnswerInput, { nullable: true })
  input: CreatePostedAnswerInput;
}

@ObjectType()
class CreatePostedAnswerPayload {
  @Field((type) => ID)
  respondentUuid!: string;
}

@Resolver()
export class CreatePostedAnswerMutation {
  @Mutation((type) => CreatePostedAnswerPayload, { nullable: false })
  async createPostedAnswers(
    @Args() { input }: CreatePostedAnswerArgs,
    @Ctx() connection: Connection
  ): Promise<CreatePostedAnswerPayload> {
    let respondent = new Respondent();
    respondent = await connection.manager.save(Respondent, respondent);
    const scoreList: number[] = [];

    for (const answerUuid of input.answersUuid) {
      let posted_answer = new Posted_Answer();
      const answer = await connection.manager.findOneOrFail(Answer, {
        where: { uuid: answerUuid },
        relations: ["question"],
      });
      if (answer) {
        if (typeof answer.value === "number") {
          scoreList.push(answer.value);
        }
        posted_answer.answer = answer;
        posted_answer.question = answer.question;
        posted_answer.respondent = respondent;
        posted_answer = await connection.manager.save(posted_answer);
        if (respondent.posted_answers) {
          respondent.posted_answers.push(posted_answer);
        } else {
          respondent.posted_answers = [posted_answer];
        }
        await connection.manager.save(Respondent, respondent);
      }
    }

    respondent.avgScore =
      scoreList.reduce((a, b) => a + b, 0) / scoreList.length || undefined;
    respondent.user = await connection.manager.findOneOrFail(User, {
      where: { uuid: input.userUuid },
    });
    await connection.manager.save(Respondent, respondent);

    return {
      respondentUuid: respondent.uuid,
    };
  }
}
