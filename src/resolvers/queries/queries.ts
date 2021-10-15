import { GetQuestionQuery } from "./getQuestion";
import { GetQuestionsQuery } from "./getQuestions";
import { GetStatsQuery } from "./getStats";

export const Queries = [
  GetQuestionsQuery,
  GetQuestionQuery,
  GetStatsQuery
] as const