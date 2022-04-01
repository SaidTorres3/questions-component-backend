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
    const question = await context.connection.manager.findOneOrFail(Question, {
      where: { uuid: input.questionUuid },
    });
    return {
      question,
    };
  }
}
