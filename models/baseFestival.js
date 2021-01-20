const db = require('../utils/db');
const Base = require('./base');
const moment = require('moment');
const { to } = require('../utils/tools');

class BaseFestival extends Base {
  constructor() {
    super();
    this.state = {
      from: 'Festival',
    }
    this.table = 'festival_list';
  }
  async insertNewFestival(tParams) {
    const cTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const params = {
      id: { noSet: true },
      couple_key: '',
      create_uid: '',
      target_uid: '',
      create_time: cTime,
      name: '',
      date_type: 1,
      date_solar: '',
      date_lunar: '',
      content: '',
      cus_style: '',
      bk_image: ''
    };
    const insertParams = Object.assign(params, tParams);
    return await to(this.insertInfo(this.table, insertParams));
  }
  async getLunarFestival(params) {
    const { couple_key, date_lunar } = params;
    const orderBy = { key: 'create_time', sort: 'DESC' };
    const cols = '*';
    return await this.getInfo(this.table, cols, { couple_key, date_lunar }, 'AND', orderBy);
  }
  async getSolarFestival(params) {
    const { couple_key, date_solar } = params;
    const orderBy = { key: 'create_time', sort: 'DESC' };
    const cols = '*';
    return await to(this.getInfo(this.table, cols, { couple_key, date_solar }, 'AND', orderBy));
  }
  async getFestival(params) {
    const { id } = params;
    const cols = '*';
    return await to(this.getInfo(this.table, cols, { id }));
  }
  async getFestivalList(params) {
    const { couple_key } = params;
    const cols = '*';
    return await to(this.getInfo(this.table, cols, { couple_key }));
  }
  async updateFestival(id, receive_uid) {
    const params = { id };
    const cTime = moment().format('YYYY-MM-DD');
    const items = { receive_uid, receive_time: cTime };
    return await to(this.updateInfo(this.table, items, params));
  }
}

module.exports = BaseFestival;