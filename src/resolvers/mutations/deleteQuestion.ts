import {
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../../index";
import { Answer } from "../../entities/answer";
import { Posted_Answer } from "../../entities/posted_answer";
import { Question } from "../../entities/question";
import autorizate from "../autorizate";
import { UserType } from "../../entities/user";

@InputType()
class DeleteQuestionInput {
  @Field((type) => ID)
  questionUuid: string;
}

@ArgsType()
class DeleteQuestionArgs {
  @Field((type) => DeleteQuestionInput)
  input: DeleteQuestionInput;
}

@ObjectType()
class DeleteQuestionPayload {
  @Field((type) => ID)
  deletedUuid: string;
}

@Resolver()
export class DeleteQuestionMutation {
  @Mutation((type) => DeleteQuestionPayload)
  async deleteQuestion(
    @Ctx() context: Context,
    @Args() { input }: DeleteQuestionArgs
  ): Promise<DeleteQuestionPayload> {
    const autorizationValidation = await autorizate({ context });
    if (!autorizationValidation || autorizationValidation !== UserType.admin) {
      throw new Error("Unauthorized");
    }

    const question = await context.connection.manager.findOneOrFail(Question, {
      where: { uuid: input.questionUuid },
      relations: ["answers", "posted_answers"],
    });

    await context.connection.manager.remove(
      Posted_Answer,
      question.posted_answers
    );
    await context.connection.manager.remove(Answer, question.answers);
    await context.connection.manager.remove(Question, question);

    return {
      deletedUuid: question.uuid,
    };
  }
}
