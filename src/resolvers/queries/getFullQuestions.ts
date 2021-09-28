import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Connection } from "typeorm";
import { Full_Question } from "../../entity/full_question";
import * as data from '../../questions.json'

@ObjectType()
class GetFullQuestionsPayload {
  @Field(type => [Full_Question])
  questions!: Full_Question[];
}

@Resolver()
export class GetFullQuestionsQuery {
  @Query(type => GetFullQuestionsPayload)
  async getFullQuestions(
    @Ctx() connection: Connection
  ): Promise<GetFullQuestionsPayload> {
    return {
      questions: [{
        "id": 1,
        "uuid": "1",
        "imgUrl": "https://images.trvl-media.com/hotels/54000000/53720000/53714500/53714404/1316f078_z.jpg",
        "question": {
          "id": 1,
          "full_question": "1",
          "es": "¿Cómo calificaría su experiencia en Hotel Palmeras? 🏨🌴",
          "en": "How would you rate your experience in Hotel Palmeras? 🏨🌴"
        },
        "answers": [
          {
            "id": 1,
            "full_question": "1",
            "value": JSON.stringify(5),
            "es": "Muy Buena 😀",
            "en": "Awesome 😀"
          },
          {
            "id": 2,
            "full_question": "1",
            "value": JSON.stringify(4),
            "es": "Buena 😊",
            "en": "Good 😊"
          },
          {
            "id": 3,
            "full_question": "1",
            "value": JSON.stringify(3),
            "es": "Regular 😐",
            "en": "Regular 😐"
          },
          {
            "id": 4,
            "full_question": "1",
            "value": JSON.stringify(2),
            "es": "Mala 😕",
            "en": "Bad 😕"
          },
          {
            "id": 5,
            "full_question": "1",
            "value": JSON.stringify(1),
            "es": "Muy mala 😠",
            "en": "Very bad 😠"
          }
        ]
      }]}
  }
}