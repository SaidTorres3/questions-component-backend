import "reflect-metadata";
import { ApolloServer } from 'apollo-server'

import typeDefs from './definitions/full_question'
import resolvers from './resolvers/queries/resolvers'

const server = new ApolloServer({ typeDefs, resolvers, });

import { createConnection } from "typeorm";
import { Full_Question } from "./entity/full_question";
import { Question } from "./entity/question";
import { Answer } from "./entity/answer";

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
  let full_question = new Full_Question()
  full_question.imgUrl = "https://images.trvl-media.com/hotels/54000000/53720000/53714500/53714404/1316f078_z.jpg"
  const fullQuestion = await connection.manager.save(full_question)
  
  let question = new Question()
  question.full_question = fullQuestion.uuid
  
  question.es = "¿Cómo calificaría su experiencia en Hotel Palmeras? 🏨🌴"
  question.en = "How would you rate your experience in Hotel Palmeras ? 🏨🌴"
  await connection.manager.save(question)

  let answer = new Answer()
  answer.full_question = fullQuestion.uuid
  answer.value = JSON.stringify(5)
  answer.es = "Muy Buena 😀"
  answer.en = "Awesome 😀"
  await connection.manager.save(answer)

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });

}).catch(error => console.log(error));