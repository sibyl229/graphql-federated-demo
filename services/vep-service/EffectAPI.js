const { RESTDataSource } = require('apollo-datasource-rest');

class EffectAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://elasticsearch:9200/vep/';
  }

  async getEffects(hgvs) {
    const data = await this.post('/_search/', {
      query: {
	term: {
	  'Uploaded_variation.keyword': hgvs,
	}
      }
    });
    return data.hits.hits.map(({_id, _source}) => ({
      ..._source,
      hgvs: _source.Uploaded_variation,
      id: _id,
    }));
  }

}

module.exports = EffectAPI;
