import {
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { Connection } from "typeorm";
import { User, UserType } from "../../entities/user";
import * as bcrypt from "bcryptjs";
import jtw from "jsonwebtoken";
require("dotenv").config();

@InputType()
class LoginUserInput {
  @Field((type) => String)
  username: string;
  @Field((type) => String)
  password: string;
}

@ArgsType()
class LoginUserArgs {
  @Field((type) => LoginUserInput, { nullable: true })
  input: LoginUserInput;
}

@ObjectType()
class LoginUserPayload {
  @Field((type) => ID, { nullable: false })
  token!: string;
}

@Resolver()
export class LoginUserMutation {
  @Mutation((type) => LoginUserPayload, { nullable: false })
  async LoginUser(
    @Args() { input }: LoginUserArgs,
    @Ctx() connection: Connection
  ): Promise<LoginUserPayload> {
    const user = await connection.manager.findOne(User, {
      where: { username: input.username },
    });

    if (!user) {
      return { token: "" };
    }

    const isCorrectPassword = await bcrypt.compare(
      input.password,
      user.password
    );

    let token: string;
    isCorrectPassword
      ? (token = generateToken({ userUuid: user.uuid, userType: user.type }))
      : (token = "");

    return {
      token,
    };
  }
}

const generateToken = (opts: {
  userUuid: string;
  userType: string;
}): string => {
  if (!process.env.SECRET) {
    console.error(
      "No secret found, please, add a SECRET in the .env file. E.g. SECRET=mysecret"
    );
    return "";
  }
  const token = jtw.sign({ userUuid: opts.userUuid }, process.env.SECRET, {
    expiresIn: opts.userType === UserType.pollster ? "2y" : "30m",
  });
  return token;
};
