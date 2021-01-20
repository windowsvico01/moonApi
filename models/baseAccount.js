const db = require('../utils/db');
const Base = require('./base');
const moment = require('moment');
const { to } = require('../utils/tools');

class BaseAccount extends Base {
  constructor() {
    super();
    this.state = {
      from: 'Account',
    }
    this.table = 'account_records';
  }
  async insertNewRecord(tParams) {
    const cTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const params = {
      id: { noSet: true },
      couple_key: '',
      create_uid: '',
      create_time: cTime,
      type: 1, // 1: 支出 2: 收入
      amount: 0,
      source: 1,
      good_type_first: 1,
      good_type_second: 2,
      good_id: '',
      good_name: '',
      note: '',
      cover: '',
      degree: 1
    };
    const insertParams = Object.assign(params, tParams);
    return await to(this.insertInfo(this.table, insertParams));
  }
  async getRecords(params) {
    const { type, couple_key, uid,  create_time } = params;
    const tParams = { create_time };
    if (type) tParams.type = type;
    if (couple_key) tParams.couple_key = couple_key;
    if (uid) tParams.uid = uid;
    const orderBy = { key: 'create_time', sort: 'DESC' };
    const cols = '*';
    return await to(this.getInfo(this.table, cols, tParams, 'AND', orderBy, 1, 99));
  }
  // async updateStatus(id, is_finish) {
  //   const params = { id };
  //   const cTime = moment().format('YYYY-MM-DD HH:mm:ss')
  //   const items = { is_finish, finish_time: cTime };
  //   return await this.updateInfo(this.table, items, params);
  // }
}

module.exports = BaseAccount;