const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const mockGet = (id) => ({
  id: 'WBPhenotype:0002254',
  name: '3 prime target RNA uridylation reduced'
})

const typeDefs = gql`
  type Query {
    get(id: String): PhenotypeOntology
  }

  type PhenotypeOntology @key(fields: "id") {
    id: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    get() {
      return mockGet(1);
    }
  },
  User: {
    __resolveReference({id}){
      return mockGet(id)
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
