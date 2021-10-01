import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Full_Question } from "../../entities/full_question";
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
  async full_question(
    @Root() root: Posted_Answer,
    @Ctx() connection: Connection
  ) {
    const full_question = await connection.manager.findOneOrFail(Full_Question, { where: { uuid: root.full_questionUuid } })
    return full_question
  }
}