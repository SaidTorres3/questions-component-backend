import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Context } from "../../index"
import { Posted_Answer } from "../../entities/posted_answer";
import { Respondent } from "../../entities/respondent";
import { User } from "../../entities/user";

@Resolver((of) => Respondent)
export class Respondent_Resolver implements ResolverInterface<Respondent> {
  @FieldResolver()
  async posted_answers(
    @Root() root: Respondent,
    @Ctx() context: Context
  ) {
    const posted_answers = await context.connection.manager.find(Posted_Answer, {
      where: { respondent: root },
      relations: ["respondent"],
    });
    return posted_answers;
  }

  async user(
    @Root() root: Respondent,
    @Ctx() context: Context
  ) {
    const user = await context.connection.manager.findOneOrFail(User, {
      where: { uuid: root.user.uuid },
      relations: ["respondents"],
    });
    return user;
  }
}
