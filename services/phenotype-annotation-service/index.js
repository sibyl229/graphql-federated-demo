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
    getPhenotypeAnnotationByPhenotype(phenotypeId: String!): [PhenotypeAnnotation!]
    getPhenotypeAnnotationByVariation(variationId: String!): [PhenotypeAnnotation!]
  }

  type PhenotypeOntology {
    id: ID!
    name: String
  }

  type PhenotypeAnnotation {
    id: ID!
    phenotype: PhenotypeOntology!
    variation: Variation!
  }

  extend type Variation @key(fields: "id") {
    id: ID! @external
    phenotypeAnnotations: [PhenotypeAnnotation!]
  }

`;

const resolvers = {
  Query: {
    getPhenotypeOntologyTerm: (parent, { id }, { dataSources }) => {
      return { id };
    },
    getPhenotypeAnnotationByPhenotype: (parent, args, { dataSources }) => {
      return [{
        id: 1,
      }]
    }
  },
  PhenotypeOntology: {
    name: async ({id}, args, { dataSources }) => {
      const { name } = await dataSources.phenotypeOntologyAPI.getPhenotypeOntologyTerm(id);
      return name;
    },
  },
  PhenotypeAnnotation: {
    phenotype: (parent, args, { dataSources }) => {
      return dataSources.phenotypeOntologyAPI.getPhenotypeOntologyTerm('WBPhenotype:0000007');
    },
    variation: () => {
      return {__typename: 'Variation', id: 'WBVar00142951'};
    },
  },
  Variation: {

  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  dataSources: () => ({
    phenotypeOntologyAPI: new PhenotypeOntologyAPI(),
  })
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
