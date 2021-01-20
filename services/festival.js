const BaseFestival = require('../models/baseFestival');
const BaseNotes = require('../models/baseNotes');
const baseFestival = new BaseFestival();
const baseNotes = new BaseNotes();
const User = require('./user');
const moment = require('moment');
const Lunar = require('../utils/lunar');
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}
module.exports = {
  addFestival: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } };
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { uid, couple_key } = UserInfo.data.data;
    const { name, content, bk_image = '', date_type, date_solar, date_lunar, cus_style } = req.body;
    if (!name || !content || !date_type ) {
      result.data.code = 3001;
      result.data.msg = '入参缺失'
      return result;
    }
    const insertParams = {
      couple_key,
      create_uid: uid,
      name,
      content,
      bk_image,
      date_type,
      date_solar,
      date_lunar,
      cus_style
    }
    const insertRes = await baseFestival.insertNewFestival(insertParams);
    if (insertRes.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '新建失败';
      return result;
    }
    result.status = 200;
    result.data.code = 1000;
    result.data.data = { result: '添加成功' };
    return result;
  },
  getTodayFestival: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } };
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { couple_key } = UserInfo.data.data;
    const curTime = moment().format('YYYY-MM-DD');
    const timeArr = curTime.split('-');
    const lunarObj = Lunar.solar2lunar(timeArr[0], timeArr[1], timeArr[2]);
    const dateSolar = `${PrefixInteger(timeArr[1], 2)}-${PrefixInteger(timeArr[2], 2)}`; // 阳历 月日
    const dateLunar = `${PrefixInteger(lunarObj.lMonth, 2)}-${PrefixInteger(lunarObj.lDay, 2)}`; // 阴历 月日
    const listLunar = await baseFestival.getLunarFestival({couple_key, date_lunar: dateLunar});
    const listSolar = await baseFestival.getSolarFestival({couple_key, date_solar: dateSolar});
    if (listLunar.code !== 1000 || listSolar.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '查询失败';
      return result;
    }
    result.status = 200;
    result.data = {
      code: 1000,
      data: listLunar.data.concat(listSolar.data)
    }
    return result;
  },
  getFestivalById: async (req, res) => {
    const result = { status: 404, data: { code: -1 } };
    const { id } = req.body;
    if ( !id ) {
      result.data.code = 3001;
      result.data.msg = 'id参数缺失';
      return result;
    }
    const fesRes = await baseFestival.getFestival({id});
    if (fesRes.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '获取失败';
      return result;
    }
    result.status = 200;
    result.data.code = 1000;
    result.data.data = fesRes.data[0];
    return result;
  },
  getFestivalList: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } };
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { couple_key } = UserInfo.data.data;
    const fesRes = await baseFestival.getFestivalList({couple_key});
    if (fesRes.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '获取失败';
      return result;
    }
    result.status = 200;
    result.data.code = 1000;
    result.data.data = fesRes.data;
    return result;
  },
  updateFesStatus: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } };
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { uid, couple_key } = UserInfo.data.data;
    const { id, name, content, bk_image, cus_style } = req.body;
    if (!id) {
      result.data.code = 3001;
      result.data.msg = '参数缺失';
      return result;
    };
    const fesRes = await baseFestival.getFestival({id}); // 获取节日信息
    if (fesRes.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '获取失败';
      return result;
    }
    const { create_uid, receive_time } = fesRes.data[0];
    const currentTime = moment().format('YYYY-MM-DD');
    if ( receive_time !== currentTime && create_uid*1 !== uid*1 ) { // 接收人触发，并且当天未触发过需要添加消息
      const updateFesRes = await baseFestival.updateFestival(id, uid, currentTime);
      if (updateFesRes.code !== 1000) { // 更新成功，添加消息
        result.data.code = 3001;
        result.data.msg = '更新状态失败';
        return result;
      }
      const insertParams = {
        type: 3,
        author_uid: uid,
        couple_key,
        is_finish: true,
        title: `今天是${name}`,
        content,
        cover: bk_image,
        skin: cus_style,
      }
      const insertRes = await baseNotes.insertNewNote(insertParams);
      if (insertRes.code !== 1000) {
        result.data.code = 3001;
        result.data.msg = '新建失败';
        return result;
      }
      result.status = 200;
      result.data.code = 1000;
      result.data.data = { result: '新建成功' };
      return result;

    }
    result.status = 200;
    result.data.code = 1000;
    result.data.data = { result: '不是接收人不作更新' };
    return result;
  }
} 