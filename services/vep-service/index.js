const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const EffectAPI = require('./EffectAPI');

// The GraphQL schema
const typeDefs = gql`

  type Effect {
    id: ID!
    hgvs: String
    Feature: String
    Amino_acids: String
    Codons: String
    STRAND: String
    Consequence: String
  }

  extend type Variant @key(fields: "hgvs") {
    hgvs: ID! @external
    effects: [Effect]!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Variant: {
    effects: (variant, args, { dataSources }) => dataSources.effectAPI.getEffects(variant.hgvs),
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{
    typeDefs,
    resolvers,
  }]),
  dataSources: () => ({
    effectAPI: new EffectAPI(),
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
