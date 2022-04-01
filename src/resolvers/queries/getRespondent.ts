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
import { Respondent } from "../../entities/respondent";

@InputType()
class GetRespondentInput {
  @Field((of) => ID)
  respondentUuid: string;
}

@ArgsType()
class GetRespondentArgs {
  @Field((of) => GetRespondentInput)
  input: GetRespondentInput;
}

@ObjectType()
class GetRespondentPayload {
  @Field((of) => Respondent)
  respondent: Respondent;
}

@Resolver()
export class GetRespondent {
  @Query((type) => GetRespondentPayload)
  async getRespondent(
    @Ctx() context: Context,
    @Args() { input }: GetRespondentArgs
  ): Promise<GetRespondentPayload> {
    const respondent = await context.connection.manager.findOneOrFail(Respondent, {
      where: { uuid: input.respondentUuid },
    });
    return {
      respondent,
    };
  }
}
