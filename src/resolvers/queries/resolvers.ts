import { GraphQLJSON } from "graphql-type-json";
import * as data from '../../questions.json'
import MariaDB from 'mariadb'

const database = MariaDB.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  connectionLimit: 50
})

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getQuestions: async () => {
      return data.questions
    }
  },
  Mutation: {
    createQuestion: async (parent: any, { texto }: { texto: string }): Promise<String> => {
      const dataBaseConection = await database.getConnection()
      await dataBaseConection.query("use questions_component")
      const response = await dataBaseConection.query("SELECT * FROM answer") as any[]
      console.log(response.pop())
      let defaultValue = "Default value"
      if (texto) defaultValue = texto
      return defaultValue
    }
  }
};

export default resolvers