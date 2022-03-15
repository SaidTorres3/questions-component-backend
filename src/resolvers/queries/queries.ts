import { GetQuestionQuery } from "./getQuestion";
import { GetQuestionsQuery } from "./getQuestions";
import { GetQuestionStatsQuery } from "./getQuestionStats";
import { GetRespondent } from "./getRespondent";
import { GetRespondents } from "./getRespondents";
import { GetStatsQuery } from "./getStats";
import { GetUser } from "./getUser";
import { GetUsers } from "./getUsers";

export const Queries = [
  GetQuestionsQuery,
  GetQuestionQuery,
  GetStatsQuery,
  GetQuestionStatsQuery,
  GetRespondents,
  GetRespondent,
  GetUser,
  GetUsers
] as const;
