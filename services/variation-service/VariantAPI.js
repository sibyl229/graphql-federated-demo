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

  async getVariantByHgvs(hgvs) {
    const data = await this.post('/_search/', {
      query: {
	term: {
	  'variantId.keyword': hgvs,
	}
      }
    });
    return data.hits.hits.map(({_source}) => _source)[0];
  }


  getHgvs(doc) {
    return doc.variantId;
  }

}

module.exports = VariantAPI;
