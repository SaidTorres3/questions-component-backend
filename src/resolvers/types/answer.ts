import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Full_Question } from "../../entities/full_question";

@Resolver(of => Answer)
export class Answer_Resolver implements ResolverInterface<Answer> {
  @FieldResolver()
  async full_question(
    @Root() root: Answer,
    @Ctx() connection: Connection
  ) {
    console.log( root )
    const full_question = await connection.manager.findOneOrFail(Full_Question, { where: { uuid: root.full_question.uuid } })
    return full_question
  }
}