import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Full_Question } from "../../entities/full_question";
import { Question } from "../../entities/question";


@Resolver(of => Full_Question)
export class Full_Question_Resolver implements ResolverInterface<Full_Question> {
  @FieldResolver()
  async answers(
    @Root() root: Full_Question,
    @Ctx() connection: Connection
  ) {
    const answers = await connection.manager.find(Answer, { where: { full_question: root } })
    return answers
  }

  @FieldResolver()
  async question(
    @Root() root: Full_Question,
    @Ctx() connection: Connection
  ) {
    const question = await connection.manager.findOne(Question, { where: { full_question: root } })
    return question!
  }
}