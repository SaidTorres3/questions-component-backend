import GraphQLJSON from "graphql-type-json";
import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Float,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { Connection } from "typeorm";
import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";

@InputType()
abstract class CreateAnswerInput {
  @Field((type) => GraphQLJSON)
  value: any;
  @Field((type) => String)
  es: string;
  @Field((type) => String)
  en: string;
}

@InputType()
class CreateQuestionInput {
  @Field((type) => String, { nullable: true })
  imgUrl: string;

  @Field((type) => String)
  es: string;

  @Field((type) => String)
  en: string;

  @Field((type) => [CreateAnswerInput])
  answers: CreateAnswerInput[];
}

@ArgsType()
class CreateQuestionArgs {
  @Field((type) => CreateQuestionInput, { nullable: true })
  input: CreateQuestionInput;
}

@ObjectType()
class CreateQuestionPayload {
  @Field((type) => ID, { nullable: false })
  createdUuid!: string;
}

@Resolver()
export class CreateQuestionMutation {
  @Mutation((type) => CreateQuestionPayload, { nullable: false })
  async createQuestion(
    @Args() { input }: CreateQuestionArgs,
    @Ctx() connection: Connection
  ): Promise<CreateQuestionPayload> {
    let question = new Question();
    if (input.imgUrl) {
      question.imgUrl = input.imgUrl;
    }
    question.es = input.es;
    question.en = input.en;

    const filled_question = await connection.manager.save(question);

    for (const answerParams of input.answers) {
      let answer = new Answer();
      answer.question = filled_question;
      answer.value = answerParams.value;
      answer.es = answerParams.es;
      answer.en = answerParams.en;
      await connection.manager.save(answer);
    }

    return { createdUuid: filled_question.uuid };
  }
}
