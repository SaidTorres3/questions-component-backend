import { ApolloServer } from 'apollo-server'

import typeDefs from './definitions/full_question'
import resolvers from './resolvers/queries/resolvers'

const server = new ApolloServer({ typeDefs, resolvers, });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});