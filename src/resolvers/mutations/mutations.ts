import { CreateQuestionMutation } from "./createQuestion";
import { CreatePostedAnswerMutation } from "./createPostedAnswers"
import { EditQuestionMutation } from "./editQuestion";
import { DeleteQuestionMutation } from "./deleteQuestion";

export const Mutations = [
  CreateQuestionMutation,
  CreatePostedAnswerMutation,
  EditQuestionMutation,
  DeleteQuestionMutation
] as const