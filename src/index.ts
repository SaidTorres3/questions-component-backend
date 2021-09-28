import "reflect-metadata";
import { ApolloServer } from 'apollo-server'
import { buildSchema } from "type-graphql";

import { createConnection } from "typeorm";
import { Full_Question } from "./entity/full_question";
import { Question } from "./entity/question";
import { Answer } from "./entity/answer";

import { Resolvers } from "./resolvers/resolvers";

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  charset: "utf8mb4",
  database: "questions_component",
  dropSchema: true,
  entities: [
    Full_Question,
    Question,
    Answer
  ],
  synchronize: true,
  logging: false
}).then(async connection => {
  const schema = await buildSchema({
    resolvers: Resolvers,
  });

  const server = new ApolloServer({ schema, context: connection });
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });

}).catch(error => console.log(error));