import { Mutations } from "./mutations/mutations";
import { Queries } from "./queries/queries";

export const Resolvers = [
  ...Mutations,
  ...Queries
] as const