const { RESTDataSource } = require('apollo-datasource-rest');

class VariationAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://wormbase-search-ws275.us-east-1.elasticbeanstalk.com/integration';
  }

  async getVariation(id) {
    return this.get(`/search-exact?class=variation&q=${id}`);
  }
}

module.exports = VariationAPI;
