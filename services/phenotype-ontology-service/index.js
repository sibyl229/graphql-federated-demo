const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const axios = require('axios');

const getPhenotypeTerm = (id) => {
  return axios.get('http://wormbase-search-ws275.us-east-1.elasticbeanstalk.com/integration/search-exact', {
    params: {
      class: 'phenotype',
      q: id
    }
  }).then(response => {
    const {id, label: name} = response.data;
    return {
      id: id,
      name: name,
      type: 'phenotype'
    };
  }).catch(error => {
    console.log(error);
  })
}

// ({
//   id: 'WBPhenotype:0002254',
//   name: '3 prime target RNA uridylation reduced'
// })

const typeDefs = gql`
  type Query {
    get(id: String!): PhenotypeOntology
  }

  type PhenotypeOntology @key(fields: "id") {
    id: ID!
    name: String
    type: String!
  }
`;

const resolvers = {
  Query: {
    get(parent, args) {
      const { id } = args;
      return getPhenotypeTerm(id);
    }
  },
  User: {
    __resolveReference({id}){
      return getPhenotypeTerm(id)
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
