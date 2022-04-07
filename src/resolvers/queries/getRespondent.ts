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
import autorizate from "../autorizate";
import { UserType } from "../../entities/user";

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
    const autorizationValidation = await autorizate({ context });
    if (!autorizationValidation || autorizationValidation !== UserType.admin) {
      throw new Error("Unauthorized");
    }

    const respondent = await context.connection.manager.findOneOrFail(
      Respondent,
      {
        where: { uuid: input.respondentUuid },
      }
    );
    return {
      respondent,
    };
  }
}
