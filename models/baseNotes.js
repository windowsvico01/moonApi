const db = require('../utils/db');
const Base = require('./base');
const moment = require('moment');
const { to } = require('../utils/tools');

class BaseNotes extends Base {
  constructor() {
    super();
    this.state = {
      from: 'Notes',
    }
    this.table = 'notes';
  }
  async insertNewNote(p) {
    // const cTimer = moment.valueOf();
    const cTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const params = {
      id: { noSet: true },
      couple_key: '',
      type: 1, // 1: 留言 2: 心愿
      author_uid: '',
      author_avatar: '',
      create_time: cTime,
      finish_time: cTime,
      // create_time: cTimer,
      is_finish: '',
      // finish_time: '',
      // finish_timer: '',
      title: '',
      content: '',
      cover: '',
      skin: ''
    };
    const insertParams = Object.assign(params, p);
    return await to(this.insertInfo(this.table, insertParams));
  }
  async getNotes(params) {
    const { type = '', page = 1, limit = 10, couple_key } = params;
    const orderBy = { key: 'create_time', sort: 'DESC' };
    const cols = '*';
    return await to(this.getInfo(this.table, cols, { type, couple_key }, 'AND', orderBy, page, limit));
  }
  async updateStatus(id, is_finish) {
    const params = { id };
    const cTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const items = { is_finish, finish_time: cTime };
    return await to(this.updateInfo(this.table, items, params));
  }
}

module.exports = BaseNotes;