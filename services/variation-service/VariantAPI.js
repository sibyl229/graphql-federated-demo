const { RESTDataSource } = require('apollo-datasource-rest');

class VariantAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://elasticsearch:9200/variant/';
  }

  async getVariantsByVariation(variationId) {
    const data = await this.post('/_search/', {
      query: {
	term: {
	  'alleleId.keyword': variationId,
	}
      }
    });
    return data.hits.hits.map(({_source}) => _source);
  }

  getHgvs(doc) {
    return doc.variantId;
  }

}

module.exports = VariantAPI;
