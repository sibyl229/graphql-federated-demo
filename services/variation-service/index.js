const { ApolloServer, gql } = require('apollo-server');
const VariationAPI = require('./VariationAPI');

// The GraphQL schema
const typeDefs = gql`
  type Query {
    getVariation(id: String!): Variation
  }

  type Variation {
    id: String!
    name: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getVariation: (parent, { id }, { dataSources }) => {
      return dataSources.variationAPI.getVariation(id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    variationAPI: new VariationAPI()
  })
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
