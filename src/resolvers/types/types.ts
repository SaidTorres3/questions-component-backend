import { Answer_Resolver } from "./answer";
import { Question_Resolver } from "./question";
import { Posted_Answers_Resolver } from "./posted_answer";
import { Respondent_Resolver } from "./respondents";

export const Types = [
  Question_Resolver,
  Posted_Answers_Resolver,
  Answer_Resolver,
  Respondent_Resolver,
];
