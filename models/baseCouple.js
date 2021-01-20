const db = require('../utils/db');
const Base = require('./base');
const moment = require('moment');
const { to } = require('../utils/tools');

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
    return await to(this.insertInfo(this.table, params));
  }
  async getCoupleInfo(key) {
    const params = { couple_key: key }
    const cols = '*';
    return await this.getInfo(this.table, cols, params);
  }
  async updateCoupleInfo(code, params = {}) {
    const rules = { couple_key: code };
    const items = { };
    Object.keys(params).forEach((key) => {
      if (!!params[key]) {
        items[key] = params[key];
      }
    })
    return await to(this.updateInfo(this.table, items, rules));
  }
}

module.exports = BaseCouple;