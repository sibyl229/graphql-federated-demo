const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const PhenotypeOntologyAPI = require('./PhenotypeOntologyAPI');
// ({
//   id: 'WBPhenotype:0002254',
//   name: '3 prime target RNA uridylation reduced'
// })

const typeDefs = gql`
  type Query {
    getPhenotypeOntologyTerm(id: String!): PhenotypeOntology
  }

  type PhenotypeOntology @key(fields: "id") {
    id: ID!
    name: String
  }


`;

const resolvers = {
  Query: {
    getPhenotypeOntologyTerm(parent, args, { dataSources }) {
      return dataSources.phenotypeOntologyAPI.getPhenotypeOntologyTerm(args.id);
    }
  },
  PhenotypeOntology: {
    __resolveReference(reference, { dataSources }) {
      return dataSources.phenotypeOntologyAPI.getPhenotypeOntologyTerm(reference.id);
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  dataSources: () => ({
    phenotypeOntologyAPI: new PhenotypeOntologyAPI(),
  })
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
