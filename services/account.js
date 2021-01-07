const BaseAccount = require('../models/baseAccount');
const BaseUser = require('../models/baseUser');
const baseAccount = new BaseAccount();
const baseUser = new BaseUser();
const User = require('./user');
module.exports = {
  addRecord: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } };
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { uid, couple_key } = UserInfo.data.data;
    const { type = 1, amount = 0, source = '', good_type_first, good_type_second, good_id, good_name, note, cover, degree } = req.body;
    if (!good_id && !amount ) {
      result.data.code = 3001;
      result.data.msg = '入参缺失'
      return result;
    }
    const insertParams = {
      type,
      author_uid: uid,
      couple_key,
      amount,
      source,
      good_type_first,
      good_type_second,
      good_id,
      good_name,
      note,
      cover,
      degree
    }
    const insertRes = await baseAccount.insertNewRecord(insertParams);
    if (insertRes.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '新建失败';
      return result;
    }
    result.status = 200;
    result.data.code = 1000;
    result.data.data = { result: '记录成功' };
    return result;
  },
  getRecords: async (req, res) => {
    // const UserInfo = await User.getUserInfo(req);
    // const result = { status: 404, data: { code: -1 } }
    // if (UserInfo.status !== 200) {
    //   result.data.code = 1003;
    //   result.data.msg = 'token无效';
    //   return result;
    // }
    const { type, couple_key, uid, create_time } = req.body;
    const searchParams = {
      create_time,
      type,
      couple_key,
      uid,
    }
    const listRes = await baseAccount.getRecords(searchParams);
    if (listRes.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '查询失败';
      return result;
    }
    result.status = 200;
    result.data = listRes;
    return result;
  },
  // updateNoteStatus: async (req, res) => {
  //   const UserInfo = await User.getUserInfo(req);
  //   const result = { status: 404, data: { code: -1 } };
  //   if (UserInfo.status !== 200) {
  //     result.data.code = 1003;
  //     result.data.msg = 'token无效';
  //     return result;
  //   }
  //   const { is_finish, id } = req.body;
  //   if (!is_finish || !id) {
  //     result.data.code = 3001;
  //     result.data.msg = '参数缺失';
  //     return result;
  //   };
  //   const updateRes = await baseNotes.updateStatus(id, is_finish);
  //   if (updateRes.code === 1000) {
  //     result.status = 200;
  //     result.data.code = 1000;
  //     result.data.data = { result: '状态修改成功' };
  //   }
  //   return result;
  // }
} 