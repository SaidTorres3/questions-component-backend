import { Connection } from "typeorm"
import { Answer } from "../../entities/answer"
import { Full_Question } from "../../entities/full_question"
import { Question } from "../../entities/question"

export const createFullQuestion = async (connection: Connection, input: {
  imgUrl?: string,
  questionParams: {
    es: string,
    en: string
  },
  answersParams: {
    value: any,
    es: string,
    en: string
  }[]
}): Promise<Full_Question['uuid']> => {
  let full_question = new Full_Question()
  if (input.imgUrl) {
    full_question.imgUrl = input.imgUrl
  }
  const fullQuestion = await connection.manager.save(full_question)
  
  let question = new Question()
  question.full_question = fullQuestion
  
  question.es = input.questionParams.es
  question.en = input.questionParams.en
  await connection.manager.save(question)
  
  for (const answerParams of input.answersParams) {
    let answer = new Answer()
    answer.full_question = fullQuestion
    answer.value = answerParams.value
    answer.es = answerParams.es
    answer.en = answerParams.en
    await connection.manager.save(answer)
  }

  return fullQuestion.uuid
}