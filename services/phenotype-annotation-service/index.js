const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const PhenotypeOntologyAPI = require('./PhenotypeOntologyAPI');
const PhenotypeAnnotationAPI = require('./PhenotypeAnnotationAPI');
// ({
//   id: 'WBPhenotype:0002254',
//   name: '3 prime target RNA uridylation reduced'
// })

const typeDefs = gql`
  type Query {
    getPhenotypeOntologyTerm(id: String!): PhenotypeOntology
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
    getPhenotypeAnnotationByVariation: (parent, { variationId }, { dataSources }) => {
      return dataSources.phenotypeAnnotationAPI.getAnnotationsByVariation(variationId);
    }
  },
  PhenotypeOntology: {
    name: async ({id}, args, { dataSources }) => {
      const { name } = await dataSources.phenotypeOntologyAPI.getPhenotypeOntologyTerm(id);
      return name;
    },
  },
  PhenotypeAnnotation: {
    id: (parent, args, { dataSources }) => {
      return dataSources.phenotypeAnnotationAPI.getId(parent);
    },
    phenotype: (parent, args, { dataSources }) => {
      return dataSources.phenotypeAnnotationAPI.getPhenotypeTerm(parent);
    },
    variation: (parent, args, { dataSources }) => {
      const { id } = dataSources.phenotypeAnnotationAPI.getVariation(parent);
      return { __typename: 'Variation', id: id };
    },
  },
  Variation: {

  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  dataSources: () => ({
    phenotypeOntologyAPI: new PhenotypeOntologyAPI(),
    phenotypeAnnotationAPI: new PhenotypeAnnotationAPI(),
  })
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
