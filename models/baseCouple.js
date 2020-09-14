const db = require('../utils/db');
const Base = require('./base');
const moment = require('moment');

class BaseCouple extends Base {
  constructor() {
    super();
    this.state = {
      from: 'Couple',
    }
    this.table = 'couple';
  }
  async insertNewCouple(key, members) {
    const params = {
      couple_key: key,
      start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      level: 0,
      banner_url: '',
      keywords: '',
      sign_words: '',
      members
    };
    return await this.insertInfo(this.table, params);
  }
}

module.exports = BaseCouple;