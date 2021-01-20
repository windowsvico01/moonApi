const db = require('../utils/db');
const BaseCouple = require('../models/baseCouple');
const baseCouple = new BaseCouple();
const BaseUser = require('../models/baseUser');
const baseUser = new BaseUser();
const { to } = require('../utils/tools');

module.exports = {
  insertNewCouple: async (key, members) => {
    return await to(baseCouple.insertNewCouple(key, members));
  },
  getCoupleInfo: async (req) => {
    const { couple_key, uid } = req.body;
    const res = { status: 404, data: { code: -1 } };
    if (!couple_key) {
      res.data.code = 3001;
      res.data.msg = 'couple_key参数缺失';
      return res;
    }
    const coupleInfo = await to(baseCouple.getCoupleInfo(couple_key));
    if (coupleInfo.code*1 === 1000) {
      if (coupleInfo.data.length > 0) { // 有couple
        let uidArr = coupleInfo.data[0].members;
        let targetUid = '';
        let targetUserInfo = {};
        if (uidArr) {  uidArr = uidArr.split(',') }
        if (uidArr.length === 2) {
          uidArr.splice(uidArr.indexOf(uid), 1);
          targetUid = uidArr[0]
        }
        if (targetUid) {
          targetUserInfo = await to(baseUser.getUserInfoByUid(targetUid));
        }
        const tUserInfo = targetUserInfo.data[0];
        if (targetUserInfo.code === 1000) {
          res.status = 200;
          res.data.code = 1000;
          res.data.data = Object.assign(coupleInfo.data[0], { t_user: tUserInfo });
        }
      } else {
        res.status = 200;
        res.data.code = 3001;
        res.data.msg = "未绑定对方"
      }
    }
    return res;
  },
  editCoupleInfo: async (req) => {
    const { start_time, sign_words, banner_url, uid } = req.body;
    const res = { status: 404, data: { code: -1 } };
    if (!uid) {
      res.data.code = 3001;
      res.data.msg = 'uid参数缺失';
      return res;
    }
    const userInfo = await to(baseUser.getUserInfoByUid(uid));
    if (userInfo.code !== 1000) {
      res.data.code = 3001;
      res.data.msg = '获取用户信息失败';
    }
    const { couple_key } = userInfo.data[0];
    const params = { start_time, sign_words, banner_url };
    const updateRes = await to(baseCouple.updateCoupleInfo(couple_key, params));
    if (updateRes.code === 1000) {
      res.status = 200;
      res.data.code = 1000;
      res.data.data = { result: '修改成功' };
    } else {
      res.data.code = 3001;
      res.data.msg = '修改失败';
    }
    return res;
  }
} 