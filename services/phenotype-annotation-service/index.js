const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const PhenotypeAnnotationAPI = require('./PhenotypeAnnotationAPI');

const typeDefs = gql`
  type Query {
    getPhenotypeAnnotationByVariation(variationId: String!): [PhenotypeAnnotation]
    getPhenotypeAnnotationByPhenotypeTerm(phenotypeTermId: String!): [PhenotypeAnnotation]
  }

  type PhenotypeOntologyTerm {
    id: ID!
    name: String
  }

  type PhenotypeAnnotation {
    id: ID!
    phenotype: PhenotypeOntologyTerm!
    variation: Variation!
  }

  extend type Variation @key(fields: "id") {
    id: ID! @external
    phenotypeAnnotations: [PhenotypeAnnotation!]
  }

`;

const resolvers = {
  Query: {
    getPhenotypeAnnotationByVariation: (parent, { variationId }, { dataSources }) => {
      return dataSources.phenotypeAnnotationAPI.getAnnotationsByVariation(variationId);
    },
    getPhenotypeAnnotationByPhenotypeTerm: (parent, { phenotypeTermId }, { dataSources }) => {
      return dataSources.phenotypeAnnotationAPI.getAnnotationsByPhenotypeTerm(phenotypeTermId);
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
    phenotypeAnnotations: (variation, args, { dataSources }) => {
      return dataSources.phenotypeAnnotationAPI.getAnnotationsByVariation(variation.id);
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  dataSources: () => ({
    phenotypeAnnotationAPI: new PhenotypeAnnotationAPI(),
  })
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
