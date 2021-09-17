import { gql } from "apollo-server";

const typeDefs = gql`
  scalar JSON

  type Question {
    es: String!,
    en: String!
  }

  type Answer {
    value: JSON!,
    es: String!,
    en: String!
  }

  type FullQuestion {
    id: Int!,
    img: String,
    question: Question!,
    answers: [Answer]!
  }

  type Query {
    getQuestions: [FullQuestion]
  }

  type Mutation {
    createQuestion(texto: String): String
  }
`;

export default typeDefs