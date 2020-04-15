const { RESTDataSource } = require('apollo-datasource-rest');

class VariationAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://elasticsearch:9200/allele/';
  }

  async getVariation(id) {
    const data = await this.post('/_search/', {
      query: {
	bool: {
	  should: [
	    { term: { 'primaryId.keyword': id, } },
	    { term: { 'symbol.keyword': id, } },
	  ],
	},
      },
    });
    const [variation] = data.hits.hits;
    return variation && {
      ...variation._source,
      id: variation._source.primaryId,
    };
  }

  getId(doc) {
    const { primaryId } = doc;
    return primaryId;
  }

  getSymbol(doc) {
    const { symbol } = doc;
    return symbol;
  }

  getSynonyms(doc) {
    const { synonyms } = doc;
    return synonyms;
  }
}

module.exports = VariationAPI;
