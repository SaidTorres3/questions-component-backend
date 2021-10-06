import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";
import { Posted_Answer } from "../../entities/posted_answer";
import { Respondent } from "../../entities/respondent";

@Resolver(of => Posted_Answer)
export class Posted_Answers_Resolver implements ResolverInterface<Posted_Answer> {
  @FieldResolver()
  async answer(
    @Root() root: Posted_Answer,
    @Ctx() connection: Connection
  ) {
    const answer = await connection.manager.findOneOrFail(Answer, { where: { uuid: root.answerUuid } })
    return answer
  }

  @FieldResolver()
  async respondent(
    @Root() root: Posted_Answer,
    @Ctx() connection: Connection
  ) {
    const respondent = await connection.manager.findOneOrFail(Respondent, { where: { uuid: root.respondentUuid } })
    return respondent
  }

  @FieldResolver()
  async question(
    @Root() root: Posted_Answer,
    @Ctx() connection: Connection
  ) {
    const question = await connection.manager.findOneOrFail(Question, { where: { uuid: root.questionUuid } })
    return question
  }
}