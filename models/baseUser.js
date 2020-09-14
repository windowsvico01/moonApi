const db = require('../utils/db');
const Base = require('./base');

class BaseUser extends Base {
  constructor() {
    super();
    this.state = {
      from: 'baseUser',
    }
    this.table = 'user';
  }
  async getUserInfoByUid (uid) {
    const params = { uid };
    const cols = 'uid, couple_key, username, account';
    return await this.getInfo(this.table, cols, params);
  }
  async getUserInfoByToken (token) {
    const params = { token };
    const cols = 'uid, couple_key, username, avatar, account';
    return await this.getInfo(this.table, cols, params);
  }
  async getUserInfoByKey (key) {
    const params = { couple_key: key };
    const cols = 'uid, couple_key, username, avatar, account';
    return await this.getInfo(this.table, cols, params);
  }
  async getUserInfoByWxId (wxId) {
    const params = { wx_id: wxId };
    const cols = 'uid, couple_key, username, avatar, account';
    return await this.getInfo(this.table, cols, params);
  }
  async bindUserByKey (key, uid) {
    const items = { couple_key: key };
    const params = { uid };
    return await this.updateInfo(this.table, items, params);
  }
  async setTargetUid (from, to) {
    const items = { target_uid: from };
    const params = { uid: to };
    return await this.updateInfo(this.table, items, params);
  }
  async updateUserToken (uid, token) {
    const items = { token };
    const params = { uid };
    return await this.updateInfo(this.table, items, params);
  }
  async insertUser(insertParams) {
    const params = {
      uid: { noSet: true },
      couple_key: '',
      account: '',
      token: '',
      wx_id: '',
      username: '',
      create_time: '',
    };
    return await this.insertInfo(this.table, Object.assign(params, insertParams));
  }
}

module.exports = BaseUser;