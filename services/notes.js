const db = require('../utils/db');
const BaseNotes = require('../models/baseNotes');
const baseNotes = new BaseNotes();
const User = require('./user');
module.exports = {
  addNotes: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } }
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { uid, couple_key, avatar, username } = UserInfo.data.data;
    const { type = 1, title = '', content = '', cover = '', skin = '' } = req.body;
    if (!title) {
      result.data.code = 3001;
      result.data.msg = 'token缺失用户未登录'
      return result;
    }
    const insertParams = {
      author_uid: uid,
      couple_key,
      author_name: username,
      author_avatar: avatar,
      is_finish: [1].indexOf(type) !== -1 ? true : false,
      title,
      content,
      cover,
      skin,
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
  },
} 