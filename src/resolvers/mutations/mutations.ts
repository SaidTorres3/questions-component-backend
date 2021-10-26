import { CreateQuestionMutation } from "./createQuestion";
import { CreatePostedAnswerMutation } from "./createPostedAnswers"
import { EditQuestionMutation } from "./editQuestion";

export const Mutations = [
  CreateQuestionMutation,
  CreatePostedAnswerMutation,
  EditQuestionMutation
] as const