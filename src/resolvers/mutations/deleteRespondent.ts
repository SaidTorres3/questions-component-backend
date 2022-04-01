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
import { Respondent } from "../../entities/respondent";

@InputType()
class DeleteRespondentInput {
  @Field((type) => ID)
  respondentUuid: string;
}

@ArgsType()
class DeleteRespondentArgs {
  @Field((type) => DeleteRespondentInput)
  input: DeleteRespondentInput;
}

@ObjectType()
class DeleteRespondentPayload {
  @Field((type) => ID)
  deletedUuid: string;
}

@Resolver()
export class DeleteRespondentMutation {
  @Mutation((type) => DeleteRespondentPayload)
  async deleteRespondent(
    @Ctx() context: Context,
    @Args() { input }: DeleteRespondentArgs
  ): Promise<DeleteRespondentPayload> {
    const respondent = await context.connection.manager.findOneOrFail(Respondent, {
      where: { uuid: input.respondentUuid },
      relations: ["posted_answers"],
    });

    for(const posted_answer of respondent.posted_answers) {
      await context.connection.manager.remove(posted_answer);
    }
    
    await context.connection.manager.remove(Respondent, respondent);

    return {
      deletedUuid: respondent.uuid,
    };
  }
}