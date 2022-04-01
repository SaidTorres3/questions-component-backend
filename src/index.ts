import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { Connection, createConnection } from "typeorm";
import { Entities } from "./entities/entities";
import { Resolvers } from "./resolvers/resolvers";
import { Seed } from "./seed";
// import express from "express";
// import { express as voyagerMiddleware } from "graphql-voyager/middleware";

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
  logging: false,
})
  .then(async (connection) => {
    const schema = await buildSchema({
      resolvers: Resolvers,
    });

    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        const token = req.headers.authorization
        return {
          token,
          connection,
        }
      },
    });

    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });

    Seed({
      connection,
      token: "",
    });
  })
  .catch((error) => console.log(error));

export interface Context {
  token: string;
  connection: Connection;
}

// const app = express();
// app.use("/voyager", voyagerMiddleware({ endpointUrl: "http://192.168.1.90:4000/" }));
// app.listen(4001, () => {
//   console.log("server started on port 4000");
// });
