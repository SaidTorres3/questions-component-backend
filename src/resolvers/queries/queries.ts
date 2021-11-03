import { GetQuestionQuery } from "./getQuestion";
import { GetQuestionsQuery } from "./getQuestions";
import { GetQuestionStatsQuery } from "./getQuestionStats";
import { GetStatsQuery } from "./getStats";

export const Queries = [
  GetQuestionsQuery,
  GetQuestionQuery,
  GetStatsQuery,
  GetQuestionStatsQuery
] as const