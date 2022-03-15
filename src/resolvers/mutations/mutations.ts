import { CreateQuestionMutation } from "./createQuestion";
import { CreatePostedAnswerMutation } from "./createPostedAnswers";
import { EditQuestionMutation } from "./editQuestion";
import { DeleteQuestionMutation } from "./deleteQuestion";
import { CreateUserMutation } from "./createUser";
import { LoginUserMutation } from "./loginUser";

export const Mutations = [
  CreateQuestionMutation,
  CreatePostedAnswerMutation,
  EditQuestionMutation,
  DeleteQuestionMutation,
  CreateUserMutation,
  LoginUserMutation
] as const;
