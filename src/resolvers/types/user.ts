import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Connection } from "typeorm";
import { User } from "../../entities/user";
import { Respondent } from "../../entities/respondent";

@Resolver((of) => User)
export class User_Resolver implements ResolverInterface<User> {
  @FieldResolver()
  async respondents(@Root() root: User, @Ctx() connection: Connection) {
    const respondent = await connection.manager.find(Respondent, {
      where: { user: root },
    });
    return respondent;
  }
}
