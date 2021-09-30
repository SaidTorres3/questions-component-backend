import { Connection } from "typeorm"
import { Answer } from "./entities/answer"
import { createFullQuestion } from "./repository/full_question/create"
import { CreatePostedAnswerMutation } from "./resolvers/mutations/createPostedAnswers"

export const Seed = async (connection: Connection) => {
  const full_question_uuid = await createFullQuestion(connection, {
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
  })

  let answer = await connection.manager.findOne(Answer, { where: { full_question: full_question_uuid }, relations: ["full_question"] })

  const ñ = new CreatePostedAnswerMutation()
  ñ.createPostedAnswers({
    input: {
      answersUuid: [answer!.uuid]
    }
  }, connection)
}