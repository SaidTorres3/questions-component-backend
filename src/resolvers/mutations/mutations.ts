import { CreateQuestionMutation } from "./createQuestion";
import { CreatePostedAnswerMutation } from "./createPostedAnswers";
import { EditQuestionMutation } from "./editQuestion";
import { DeleteQuestionMutation } from "./deleteQuestion";
import { CreateUserMutation } from "./createUser";
import { LoginUserMutation } from "./loginUser";
import { ValidadeTokenMutation } from "./validadeToken";
import { DeleteRespondentMutation } from "./deleteRespondent";
import { ChangeUserPasswordMutation } from "./changeUserPassword";

export const Mutations = [
  CreateQuestionMutation,
  CreatePostedAnswerMutation,
  EditQuestionMutation,
  DeleteQuestionMutation,
  CreateUserMutation,
  LoginUserMutation,
  ValidadeTokenMutation,
  DeleteRespondentMutation,
  ChangeUserPasswordMutation
] as const;
