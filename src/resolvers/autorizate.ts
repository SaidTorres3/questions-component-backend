import { Context } from "..";
import { UserType } from "../entities/user";
import {
  ValidadeTokenMutation,
  ValidadeTokenPayloadFail,
} from "./mutations/validadeToken";

const autorizate = async (args: AutorizateOptions): Promise<UserType|undefined> => {
  const tokenValidator = new ValidadeTokenMutation();
  const tokenValidationResult = await tokenValidator.validadeToken(
    {
      input: {
        token: args.context.token,
      },
    },
    args.context
  );

  if(tokenValidationResult instanceof ValidadeTokenPayloadFail) {
    return undefined
  }

  return tokenValidationResult.user.type
};

export default autorizate;

interface AutorizateOptions {
  context: Context;
}
