const db = require('../utils/db');
const moment = require('moment');
const hash1 = require('hash.js')
const BaseUser = require('../models/baseUser');
const baseUser = new BaseUser();
const Couple = require('./couple');
console.log(baseUser);
module.exports = {
  createUser: async (params) => {
    const addSql = 'INSERT INTO user(uid, couple_key, username, account, wx_id, create_time, token) VALUES(0,?,?,?,?,?,?)';
    return await db.queryAsync(addSql, params);
  },
  getUserInfoByKey: async (key) => {
    const getSql = `SELECT uid, couple_key, username, account FROM user WHERE couple_key='${key}'`;
    return await db.queryAsync(getSql);
  },
  getUserInfoByToken: async (token) => {
    const getSql = `SELECT uid, couple_key, username, account FROM user WHERE token='${token}'`;
    return await db.queryAsync(getSql);
  },
  getUserInfoByWxId: async (wxId) => {
    const getSql = `SELECT uid, couple_key, username, account FROM user WHERE wx_id='${wxId}'`;
    return await db.queryAsync(getSql);
  },
  // getUserInfoByUid: async (uid) => {
  //   const getSql = `SELECT uid, couple_key, username, account FROM user WHERE uid='${uid}'`;
  //   return await db.queryAsync(getSql);
  // },
  // bindUserByKey: async (key, uid) => {
  //   const updateSql = `UPDATE user SET couple_key = ? WHERE uid=${uid}`;
  //   const params = [key];
  //   return await db.queryAsync(updateSql, params);
  // },
  setTargetKey: async (from , to) => {
    const updateSql = `UPDATE user SET target_uid = ? WHERE uid=${from}`;
    const params = [to];
    return await db.queryAsync(updateSql, params);
  },
  updateUserToken: async (uid, token) => {
    const updateSql = `UPDATE user SET token = ? WHERE uid=${uid}`;
    const params = [token];
    return await db.queryAsync(updateSql, params);
  },
  // insertNewCouple: async (params) => {
  //   const addSql = 'INSERT INTO couple(couple_key, start_time, level, banner_url, keywords, sign_words, members) VALUES(?,?,?,?,?,?,?)';
  //   return await db.queryAsync(addSql, params);
  // },
  bind: async (req) => {
    const res = { status: 404, data: { code: -1 } };
    const { key, uid } = req.body;
    if (!key || !uid) {
      res.data.code = 3001;
      res.data.msg = 'uid参数缺失';
      return res;
    };
    const tUser = await baseUser.getUserInfoByKey(key);
    if (tUser.code !== 1000) {
      res.data.code = tUser.code;
      res.data.msg = '获取用户信息错误';
      return res;
    };
    if (tUser.data.length > 1) {
      res.status = 200;
      res.data = { code: -1, msg: '已存在2人' }; 
      return res;
    };
    const bindRes = await baseUser.bindUserByKey(key, uid);
    if (bindRes.code !== 1000) {
      res.data = baseUser.getError(3001);
      return res;
    };
    const targetUid = tUser.data[0].uid;
    const fromTargetRes = await baseUser.setTargetUid(uid, targetUid);
    if (fromTargetRes.code !== 1000) {
      res.data = baseUser.getError(3001);
      return res;
    };
    const toTargetRes = await baseUser.setTargetUid(targetUid, uid);
    if (toTargetRes.code !== 1000) {
      res.data = baseUser.getError(3001);
      return res;
    };
    const addRes = await Couple.insertNewCouple(key, `${targetUid},${uid}`);
    if (addRes.code === 1000) {
      res.status = 200;
      res.data.code = 1000;
      res.data.data = { result: '绑定成功' };
    }
    return res;
  },
  getUserInfoByUid: async (req) => {
    const { uid } = req.body;
    const res = { status: 404, data: { code: -1 } };
    if (!uid) {
      res.data.code = 3001;
      res.data.msg = 'uid参数缺失';
      return res;
    }
    const userInfo = await baseUser.getUserInfoByUid(uid);
    if (userInfo.code === 1000) {
      res.status = 200;
      res.data.code = 1000;
      res.data.data = userInfo.data[0];
    }
    return res;
  },
  getUserInfo: async (req) => {
    const { token } = req.cookies;
    const res = { status: 404, data: { code: -1 } };
    if (!token) {
      res.data.code = 3001;
      res.data.msg = 'token缺失用户未登录'
      return res;
    }
    const tokenInfo = await baseUser.decodeToken(token);
    if (tokenInfo.code === 1002) {
      res.data = tokenInfo;
      return res;
    }
    const data = await baseUser.getUserInfoByToken(token);
    if (data.code === 1000) {
      data.data = data.data[0];
      res.data = data;
      res.status = 200;
    }
    return res;
  },
  signIn: async (req, resolve) => {
    const { wxId } = req.body;
    const res = { status: 404, data: { code: -1 } };
    if (!wxId) {
      res.data.code = 3001;
      res.data.msg = '缺少wxId'
      return res;
    }
    const userInfo = await baseUser.getUserInfoByWxId(wxId);
    if (userInfo.code !== 1000) {
      res.data = { code: 1001, msg: '用户未注册' };
      return;
    }
    const curTimer = moment().valueOf();
    const token = baseUser.getToken({
      signTime: curTimer,
      account: userInfo.data[0].account
    });
    const result = await baseUser.updateUserToken(userInfo.data[0].uid, token);
    if (result.code !== 1000) {
      res.data.msg = '登录失败';
      return res;
    }
    res.status = 200;
    res.data.code = '1000';
    res.data.data = userInfo.data[0];
    res.data.data.token = token;
    resolve.cookie('token', token);
    // res.cookie('token', token, { domain: 'www.moonlt.cn' });
    return res;
  },
  signUp: async (req, resolve) => {
    const { account, wxId, username } = req.body;
    const res = { status: 404, data: { code: -1 } };
    if (!account || !wxId) {
      res.data.code = 3001;
      res.data.msg = '缺少wxId'
      return res;
    };
    const curTimer = moment().valueOf();
    const token = baseUser.getToken({
      signTime: curTimer,
      account: account,
    });
    const tCoupleKey = hash1.sha256().update(account + curTimer).digest('hex').slice(-40, -20).toUpperCase();
    const addParams = {
      couple_key: tCoupleKey,
      username: username || '用户' + account,
      account,
      wx_id: wxId,
      create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      token
    };
    const result = await baseUser.insertUser(addParams);
    if (result.code !== 1000) {
      res.data = {
        'code': -1,
        'msg': '注册失败'
      };
      return res;
    }
    resolve.cookie('token', token);
    res.status = 200;
    res.data.code = '1000';
    res.data.data = { result: '注册成功！' };
    res.data.data.token = token;
    return res;
  }
} 