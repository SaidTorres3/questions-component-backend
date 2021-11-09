import { GetQuestionQuery } from "./getQuestion";
import { GetQuestionsQuery } from "./getQuestions";
import { GetQuestionStatsQuery } from "./getQuestionStats";
import { GetRespondent } from "./getRespondent";
import { GetRespondents } from "./getRespondents";
import { GetStatsQuery } from "./getStats";

export const Queries = [
  GetQuestionsQuery,
  GetQuestionQuery,
  GetStatsQuery,
  GetQuestionStatsQuery,
  GetRespondents,
  GetRespondent
] as const