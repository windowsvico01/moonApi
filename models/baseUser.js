const db = require('../utils/db');
const Base = require('./base');
const { to } = require('../utils/tools');

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
    const cols = 'uid, couple_key, username, account, avatar, gender';
    return await to(this.getInfo(this.table, cols, params));
  }
  async getUserInfoByToken (token) {
    const params = { token };
    const cols = 'uid, couple_key, username, account, avatar, gender';
    return await to(this.getInfo(this.table, cols, params));
  }
  async getUserInfoByKey (key) {
    const params = { couple_key: key };
    const cols = 'uid, couple_key, username, account, avatar, gender';
    return await to(this.getInfo(this.table, cols, params));
  }
  async getUserInfoByWxId (wxId) {
    const params = { wx_id: wxId };
    const cols = 'uid, couple_key, username, account, avatar, gender';
    return await to(this.getInfo(this.table, cols, params));
  }
  async bindUserByKey (key, uid) {
    const items = { couple_key: key };
    const params = { uid };
    return await to(this.updateInfo(this.table, items, params));
  }
  async setTargetUid (uid, targetUid, coupleKey) {
    const params = { uid };
    const items = { target_uid: targetUid, couple_key: coupleKey };
    return await to(this.updateInfo(this.table, items, params));
  }
  async updateUserToken (uid, token) {
    const items = { token };
    const params = { uid };
    return await to(this.updateInfo(this.table, items, params));
  }
  async updateUserInfo (uid, obj) {
    const params = { uid };
    const items = obj;
    return await to(this.updateInfo(this.table, items, params));
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
    return await to(this.insertInfo(this.table, Object.assign(params, insertParams)));
  }
}

module.exports = BaseUser;