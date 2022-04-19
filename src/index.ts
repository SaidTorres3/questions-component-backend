import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { Connection, createConnection } from "typeorm";
import { Entities } from "./entities/entities";
import { Resolvers } from "./resolvers/resolvers";
import { Seed } from "./seed";
import { User, UserType } from "./entities/user";
import { hashSync } from "bcryptjs";
import {
  LoginUserMutation,
  LoginUserPayloadSuccess,
} from "./resolvers/mutations/loginUser";
// import express from "express";
// import { express as voyagerMiddleware } from "graphql-voyager/middleware";

createConnection({
  type: (process.env.DB_TYPE as any) || "mysql",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) || 3306 : 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "questions_component",
  charset: "utf8mb4",
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
        const token = req.headers.authorization;
        return {
          token,
          connection,
        };
      },
    });

    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });

    const token = await generateAdmin(connection);
    if (!token) {
      throw new Error("Couldn't generate admin token");
    }
    Seed({
      connection,
      token,
    });
  })
  .catch((error) => console.log(error));

const generateAdmin = async (
  connection: Connection
): Promise<string | undefined> => {
  const admin = new User();
  admin.username = "admin";
  admin.type = UserType.admin;
  admin.password = hashSync("admin", 10);
  await connection.manager.save(User, admin);

  const userLogger = new LoginUserMutation();
  const adminToken = await userLogger.loginUser(
    {
      input: {
        password: "admin",
        username: "admin",
      },
    },
    { connection: connection, token: "" }
  );
  if (adminToken instanceof LoginUserPayloadSuccess) {
    return adminToken.token;
  }
  return undefined;
};

export interface Context {
  token: string;
  connection: Connection;
}

// const app = express();
// app.use("/voyager", voyagerMiddleware({ endpointUrl: "http://192.168.1.90:4000/" }));
// app.listen(4001, () => {
//   console.log("server started on port 4000");
// });
