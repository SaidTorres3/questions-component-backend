import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Context } from "./../../index";
import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";

@Resolver((of) => Answer)
export class Answer_Resolver implements ResolverInterface<Answer> {
  @FieldResolver()
  async question(@Root() root: Answer, @Ctx() context: Context) {
    const question = await context.connection.manager.findOneOrFail(Question, {
      where: { uuid: root.question.uuid },
    });
    return question;
  }
}
