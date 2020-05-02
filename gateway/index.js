const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");

// Initialize an ApolloGateway instance and pass it an array of implementing
// service names and URLs
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'Variation', url: 'http://variation-service:4000' },
    { name: 'PhenotypeAnnotation', url: 'http://phenotype-annotation-service:4000' },
    { name: 'vep', url: 'http://vep-service:4000' },
    // more services
  ],
});

gateway.serviceHealthCheck().catch(() => {
  console.log(error);
  console.log('Terminted due to failed service health check.');
  process.exit(1);
})

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,

  // Disable subscriptions (not currently supported with ApolloGateway)
  subscriptions: false,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
