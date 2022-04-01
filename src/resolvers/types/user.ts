import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Context } from "./../../index"
import { User } from "../../entities/user";
import { Respondent } from "../../entities/respondent";

@Resolver((of) => User)
export class User_Resolver implements ResolverInterface<User> {
  @FieldResolver()
  async respondents(@Root() root: User, @Ctx() context: Context) {
    const respondents = await context.connection.manager.find(Respondent, {
      where: { user: { uuid: root.uuid } },
    });
    return respondents;
  }
}
