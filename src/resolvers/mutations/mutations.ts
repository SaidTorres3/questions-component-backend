import { CreateFullQuestionMutation } from "./createFullQuestion";
import { CreatePostedAnswerMutation } from "./createPostedAnswers"

export const Mutations = [
  CreateFullQuestionMutation,
  CreatePostedAnswerMutation
] as const