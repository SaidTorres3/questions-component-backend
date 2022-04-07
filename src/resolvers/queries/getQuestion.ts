import {
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "./../../index";
import { Question } from "../../entities/question";
import autorizate from "../autorizate";
import { UserType } from "../../entities/user";

@InputType()
class GetQuestionInput {
  @Field((type) => ID)
  questionUuid: string;
}

@ArgsType()
class CreateQuestionArgs {
  @Field((type) => GetQuestionInput)
  input: GetQuestionInput;
}

@ObjectType()
class GetQuestionPayload {
  @Field((type) => Question)
  question: Question;
}

@Resolver()
export class GetQuestionQuery {
  @Query((type) => GetQuestionPayload)
  async getQuestion(
    @Ctx() context: Context,
    @Args() { input }: CreateQuestionArgs
  ): Promise<GetQuestionPayload> {
    const autorizationValidation = await autorizate({ context });
    if (!autorizationValidation || autorizationValidation !== UserType.admin) {
      throw new Error("Unauthorized");
    }
    const question = await context.connection.manager.findOneOrFail(Question, {
      where: { uuid: input.questionUuid },
    });
    return {
      question,
    };
  }
}
