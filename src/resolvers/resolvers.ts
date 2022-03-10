import { Mutations } from "./mutations/mutations";
import { Queries } from "./queries/queries";
import { Types } from "./types/types";

export const Resolvers = [...Mutations, ...Queries, ...Types] as const;
