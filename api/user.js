const router = require('express').Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

const User = require('../services/user');
// const { routeCreator } = require('../utils/tools');

const SIGN_UP = '/signUp'; // 注册
const SIGN_IN = '/signIn'; // 登录
const BIND = '/bind'; // 绑定
const GET_USER_INFO = '/getUserInfo'; // 获取用户信息
const GET_USER_INFO_BY_UID = '/getUserInfoByUid'; // 通过UID获取用户信息

const routeCreator = (route, callback, method = 'post') => {
  router[method](route, urlencodedParser, async (req, res) => {
    const data = await callback(req, res);
    res.status(data.status).send(data.data);
  })
}

routeCreator(GET_USER_INFO, User.getUserInfo);
routeCreator(GET_USER_INFO_BY_UID, User.getUserInfoByUid);
routeCreator(BIND, User.bind);
routeCreator(SIGN_IN, User.signIn);
routeCreator(SIGN_UP, User.signUp);

module.exports = router;