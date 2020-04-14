const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const VariantAPI = require('./VariantAPI');
const VariationAPI = require('./VariationAPI');

// The GraphQL schema
const typeDefs = gql`
  type Query {
    getVariation(id: String!): Variation
  }

  type Variation @key(fields: "id") {
    id: ID!
    name: String
    variants: [Variant]!
  }

  type Variant @key(fields: "hgvs") {
    hgvs: ID!
    assembly: String
    chromosome: String
    start: Int!
    end: Int!
    genomicReferenceSequence: String
    genomicVariantSequence: String
  }

`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getVariation: (parent, { id }, { dataSources }) => {
      return dataSources.variationAPI.getVariation(id);
    },
  },
  Variation: {
    id: (parent, args, { dataSources }) => dataSources.variationAPI.getId(parent),
    name: (parent, args, { dataSources }) => dataSources.variationAPI.getSymbol(parent),
    synonyms: (parent, args, { dataSources }) => dataSources.variationAPI.getSynonyms(parent),
    variants: (parent, args, { dataSources }) => dataSources.variantAPI.getVariantsByVariation(parent.id),
    __resolveReference: ({ id }, { dataSources}) => {
      return dataSources.variationAPI.getVariation(id)
    },
  },
  Variant: {
    hgvs: (parent, args, { dataSources }) => dataSources.variantAPI.getHgvs(parent),
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{
    typeDefs,
    resolvers,
  }]),
  dataSources: () => ({
    variationAPI: new VariationAPI(),
    variantAPI: new VariantAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
