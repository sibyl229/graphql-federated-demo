const { RESTDataSource } = require('apollo-datasource-rest');

class PhenotypeAnnotationAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://elasticsearch:9200/phenotype_annotation/';
  }

  async getAnnotationsByVariation(id) {
    const data = await this.post(`/_search`, {
      "query": {
	"term": {
	  "primaryGeneticEntityIDs.keyword": {
            "value": id,
	  }
	}
      }
    });
    return data.hits.hits.map(({_source}) => _source);
  }

  getId(doc) {
    const {annotationId: id} =  doc;
    return id;
  }

  getPhenotypeTerm(doc) {
    const {phenotypeStatement: name, phenotypeTermIdentifiers } = doc;
    const [phenotypeTermId] = phenotypeTermIdentifiers;
    return {
      id: phenotypeTermId.termId,
      name: name,
    };
  }

  getVariation(doc) {
    const { primaryGeneticEntityIDs } = doc;
    const [primaryId] = primaryGeneticEntityIDs;
    return {
      id: primaryId,
    };
  }

}

module.exports = PhenotypeAnnotationAPI;
