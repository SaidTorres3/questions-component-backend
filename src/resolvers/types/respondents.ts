import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Connection } from "typeorm";
import { Posted_Answer } from "../../entities/posted_answer";
import { Respondent } from "../../entities/respondent";

@Resolver((of) => Respondent)
export class Respondent_Resolver implements ResolverInterface<Respondent> {
  @FieldResolver()
  async posted_answers(
    @Root() root: Respondent,
    @Ctx() connection: Connection
  ) {
    const posted_answers = await connection.manager.find(Posted_Answer, {
      where: { respondent: root },
      relations: ["respondent"],
    });
    return posted_answers;
  }
}
