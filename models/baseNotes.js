const db = require('../utils/db');
const Base = require('./base');
const moment = require('moment');

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
      type: 1, // 1: 留言
      author_uid: '',
      author_avatar: '',
      create_time: cTime,
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
    console.log(insertParams);
    return await this.insertInfo(this.table, insertParams);
  }
}

module.exports = BaseNotes;