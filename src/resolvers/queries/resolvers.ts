import { GraphQLJSON } from "graphql-type-json";
import * as data from '../../questions.json'

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getQuestions: async () => {
      return data.questions
    }
  },
  Mutation: {
    createQuestion: async ({ texto }: { texto: string }) => {
      let defaultValue = "Default value"
      if (texto) defaultValue = texto
      return defaultValue
    }
  }
};

export default resolvers