import {
  Args,
  ArgsType,
  createUnionType,
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
class LoginUserPayloadSuccess {
  @Field((type) => ID, { nullable: false })
  token!: string;

  @Field((type) => User)
  user!: User;
}

@ObjectType()
class LoginUserPayloadFail {
  @Field((type) => String)
  message!: string;
}

const LoginUserPayload = createUnionType({
  name: "LoginUserPayload",
  types: () => [LoginUserPayloadSuccess, LoginUserPayloadFail]
})

@Resolver()
export class LoginUserMutation {
  @Mutation((type) => LoginUserPayload, { nullable: true })
  async LoginUser(
    @Args() { input }: LoginUserArgs,
    @Ctx() connection: Connection
  ): Promise<typeof LoginUserPayload> {
    const user = await connection.manager.findOne(User, {
      where: { username: input.username },
    });

    const failMsg = new LoginUserPayloadFail()
    failMsg.message = "Couldn't log in"

    if (!user) {
      return failMsg
    }

    const isCorrectPassword = await bcrypt.compare(
      input.password,
      user.password
    );

    if (!isCorrectPassword) {
      return failMsg
    }

    let token: string;
    isCorrectPassword
      ? (token = generateToken({ userUuid: user.uuid, userType: user.type }))
      : (token = "");

    const successMsg = new LoginUserPayloadSuccess()
    successMsg.token = token
    successMsg.user = user

    return successMsg
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
    expiresIn: opts.userType === UserType.pollster ? "2y" : "45m",
  });
  return token;
};
