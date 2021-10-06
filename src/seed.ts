import { Connection } from "typeorm"
import { Answer } from "./entities/answer"
import { CreateQuestionMutation } from "./resolvers/mutations/createQuestion"
import { CreatePostedAnswerMutation } from "./resolvers/mutations/createPostedAnswers"

export const Seed = async (connection: Connection) => {
  const question_creator = new CreateQuestionMutation()
  const question_uuid = await question_creator.createQuestion({
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

  let answer = await connection.manager.findOne(Answer, { where: { question: question_uuid.createdUuid }, relations: ["question"] })

  const postedAnswerCreator = new CreatePostedAnswerMutation()
  postedAnswerCreator.createPostedAnswers({
    input: {
      answersUuid: [answer!.uuid]
    }
  }, connection)
}