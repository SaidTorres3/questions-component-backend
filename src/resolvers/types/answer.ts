import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";

@Resolver(of => Answer)
export class Answer_Resolver implements ResolverInterface<Answer> {
  @FieldResolver()
  async question(
    @Root() root: Answer,
    @Ctx() connection: Connection
  ) {
    const question = await connection.manager.findOneOrFail(Question, { where: { uuid: root.question.uuid } })
    return question
  }
}