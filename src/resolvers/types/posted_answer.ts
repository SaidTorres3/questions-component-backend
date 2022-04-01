import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Context } from "./../../index"
import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";
import { Posted_Answer } from "../../entities/posted_answer";
import { Respondent } from "../../entities/respondent";

@Resolver((of) => Posted_Answer)
export class Posted_Answers_Resolver
  implements ResolverInterface<Posted_Answer> {
  @FieldResolver()
  async answer(@Root() root: Posted_Answer, @Ctx() context: Context) {
    const answer = await context.connection.manager.findOneOrFail(Answer, {
      where: { uuid: root.answerUuid },
    });
    return answer;
  }

  @FieldResolver()
  async respondent(@Root() root: Posted_Answer, @Ctx() context: Context) {
    const respondent = await context.connection.manager.findOneOrFail(Respondent, {
      where: { uuid: root.respondentUuid },
    });
    return respondent;
  }

  @FieldResolver()
  async question(@Root() root: Posted_Answer, @Ctx() context: Context) {
    const question = await context.connection.manager.findOneOrFail(Question, {
      where: { uuid: root.questionUuid },
    });
    return question;
  }
}
