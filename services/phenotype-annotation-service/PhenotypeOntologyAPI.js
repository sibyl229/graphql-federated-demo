const { RESTDataSource } = require('apollo-datasource-rest');

class PhenotypeOntologyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://wormbase-search-ws275.us-east-1.elasticbeanstalk.com/integration';
  }

  async getPhenotypeOntologyTerm(id) {
    const data = await this.get(`/search-exact?class=phenotype&q=${id}`);
    return {
      id: data.id,
      name: data.label,
    };

  }
}

module.exports = PhenotypeOntologyAPI;
