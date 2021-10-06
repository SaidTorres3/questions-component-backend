import { CreateQuestionMutation } from "./createQuestion";
import { CreatePostedAnswerMutation } from "./createPostedAnswers"

export const Mutations = [
  CreateQuestionMutation,
  CreatePostedAnswerMutation
] as const