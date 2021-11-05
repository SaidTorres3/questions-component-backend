import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Respondent } from "../../entities/respondent";

@ObjectType()
class GetRespondentsPayload {
  @Field(() => [Respondent])
  respondents: Respondent[];
}

@Resolver()
export class GetRespondents {
  @Query(type => GetRespondentsPayload)
  async getRespondents(
    @Ctx() connection: Connection
  ): Promise<GetRespondentsPayload> {
    const respondents = await connection.manager.find(Respondent);
    return {
      respondents
    };
  }
}