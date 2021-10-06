import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";
import { Posted_Answer } from "../../entities/posted_answer";

@Resolver(of => Question)
export class Question_Resolver implements ResolverInterface<Question> {
  @FieldResolver()
  async answers(
    @Root() root: Question,
    @Ctx() connection: Connection
  ) {
    const answers = await connection.manager.find(Answer, { where: { question: root } })
    return answers
  }

  @FieldResolver()
  async posted_answers(
    @Root() root: Question,
    @Ctx() connection: Connection
  ) {
    const posted_answers = await connection.manager.find(Posted_Answer, { where: { question: root }})
    return posted_answers
  }
}