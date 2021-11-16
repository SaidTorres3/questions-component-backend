import { Connection } from "typeorm"
import { Answer } from "./entities/answer"
import { CreateQuestionMutation } from "./resolvers/mutations/createQuestion"
import { CreatePostedAnswerMutation } from "./resolvers/mutations/createPostedAnswers"
import { Respondent } from "./entities/respondent"
import { Posted_Answer } from "./entities/posted_answer"

export const Seed = async (connection: Connection) => {
  // for loop 3 times
  for (let i = 0; i < 10; i++) {
    const question_creator = new CreateQuestionMutation()
    const question_uuid = await question_creator.createQuestion({
      input: {
        imgUrl: "https://images.trvl-media.com/hotels/54000000/53720000/53714500/53714404/1316f078_z.jpg",
        es: "¿Cómo calificaría su experiencia en Hotel Palmeras? 🏨🌴",
        en: "How would you rate your experience in Hotel Palmeras? 🏨🌴",
        answers: [
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

    let answer = await connection.manager.findOneOrFail(Answer, { where: { value: 2 }, relations: ["question"] })

    const postedAnswerCreator = new CreatePostedAnswerMutation()
    const postedAnswerPayload = await postedAnswerCreator.createPostedAnswers({
      input: {
        answersUuid: [answer.uuid]
      }
    }, connection)

    const June6th = new Date("2021-06-03T10:00:00.000Z")
    const respondent = await connection.manager.findOneOrFail(Respondent, { where: { uuid: postedAnswerPayload.respondentUuid } })
    const posted_answers = await connection.manager.find(Posted_Answer, { where: { respondent: postedAnswerPayload.respondentUuid }, relations: ["respondent"] })
    respondent.createdAt = June6th
    for (let posted_answer of posted_answers) {
      posted_answer.createdAt = June6th
      await connection.manager.save(Posted_Answer, posted_answer)
    }

    await connection.manager.save(Respondent, respondent)
  }
}