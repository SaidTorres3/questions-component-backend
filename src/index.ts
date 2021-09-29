import "reflect-metadata";
import { ApolloServer } from 'apollo-server'
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Entities } from "./entities/entities";
import { Resolvers } from "./resolvers/resolvers";
import { CreateFullQuestionMutation } from "./resolvers/mutations/createFullQuestion";

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

  const newQuestion = new CreateFullQuestionMutation()
  newQuestion.createFullQuestion({
    input: {
      imgUrl: "https://images.trvl-media.com/hotels/54000000/53720000/53714500/53714404/1316f078_z.jpg",
      questionParams: {
        es: "¿Cómo calificaría su experiencia en Hotel Palmeras? 🏨🌴",
        en: "How would you rate your experience in Hotel Palmeras? 🏨🌴"
      },
      answersParams: [
        {
          "value": 5,
          "es": "Muy Buena 😀",
          "en": "Awesome 😀"
        },
        {
          "value": 4,
          "es": "Buena 😊",
          "en": "Good 😊"
        },
        {
          "value": 3,
          "es": "Regular 😐",
          "en": "Regular 😐"
        },
        {
          "value": 2,
          "es": "Mala 😕",
          "en": "Bad 😕"
        },
        {
          "value": 1,
          "es": "Muy mala 😠",
          "en": "Very bad 😠"
        }
      ]
    }
  }, connection)

}).catch(error => console.log(error));