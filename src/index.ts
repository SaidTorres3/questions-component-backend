import "reflect-metadata";
import { ApolloServer } from 'apollo-server'
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Entities } from "./entities/entities";
import { Resolvers } from "./resolvers/resolvers";
import { Seed } from "./seed";

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  charset: "utf8mb4",
  database: "questions_component",
  dropSchema: true,
  entities: Entities,
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

  Seed(connection)
}).catch(error => console.log(error));