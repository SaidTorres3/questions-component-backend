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
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Posted_Answer } from "../../entities/posted_answer";
import { Question } from "../../entities/question";

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
    @Ctx() connection: Connection,
    @Args() { input }: DeleteQuestionArgs
  ): Promise<DeleteQuestionPayload> {
    const question = await connection.manager.findOneOrFail(Question, {
      where: { uuid: input.questionUuid },
      relations: ["answers", "posted_answers"],
    });

    await connection.manager.remove(Posted_Answer, question.posted_answers);
    await connection.manager.remove(Answer, question.answers);
    await connection.manager.remove(Question, question);

    return {
      deletedUuid: question.uuid,
    };
  }
}

// why doesnt apper in graphql playground? R:
