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

@Resolver((of) => Question)
export class Question_Resolver implements ResolverInterface<Question> {
  @FieldResolver()
  async answers(@Root() root: Question, @Ctx() context: Context) {
    const answers = await context.connection.manager.find(Answer, {
      where: { question: root },
    });
    return answers;
  }

  @FieldResolver()
  async posted_answers(@Root() root: Question, @Ctx() context: Context) {
    const posted_answers = await context.connection.manager.find(Posted_Answer, {
      where: { question: root },
    });
    return posted_answers;
  }
}
