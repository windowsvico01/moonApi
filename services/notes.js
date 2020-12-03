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
      result.data.msg = '请输入标题'
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
  getNotes: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } }
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { type, page = 1, limit = 10 } = req.body;
    const { couple_key } = UserInfo.data.data;
    const searchParams = {
      couple_key,
      page,
      limit
    }
    if (type || type !== '') searchParams.type = type;
    // const listRes = 
    const listRes = await baseNotes.getNotes(searchParams);
    if (listRes.code !== 1000) {
      result.data.code = 3001;
      result.data.msg = '查询失败';
      return result;
    }
    result.status = 200;
    result.data = listRes;
    return result;
  },
  updateNoteStatus: async (req, res) => {
    const UserInfo = await User.getUserInfo(req);
    const result = { status: 404, data: { code: -1 } };
    if (UserInfo.status !== 200) {
      result.data.code = 1003;
      result.data.msg = 'token无效';
      return result;
    }
    const { is_finish, id } = req.body;
    if (!is_finish || !id) {
      result.data.code = 3001;
      result.data.msg = '参数缺失';
      return result;
    };
    const updateRes = await baseNotes.updateStatus(id, is_finish);
    if (updateRes.code === 1000) {
      result.status = 200;
      result.data.code = 1000;
      result.data.data = { result: '状态修改成功' };
    }
    return result;
  }
} 