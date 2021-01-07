const router = require('express').Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

// const { routeCreator } = require('../utils/tools');
const Festival = require('../services/festival');

const ADD_FESTIVAL = '/addFestival'; // 新增
const GET_TD_FESTIVAL = '/getTdFestival'; // 新增
const GET_FESTIVAL_BY_ID = '/getFestivalById'; // 通过id获取
const UPDATE_FES_STATUS = '/updateFesStatus'; // 更新状态
const GET_FESTIVAL_LIST = '/getFestivalList'; // 获取列表

const routeCreator = (route, callback, method = 'post') => {
  router[method](route, urlencodedParser, async (req, res) => {
    const data = await callback(req, res);
    res.status(data.status).send(data.data);
  })
}

routeCreator(ADD_FESTIVAL, Festival.addFestival);
routeCreator(GET_TD_FESTIVAL, Festival.getTodayFestival);
routeCreator(GET_FESTIVAL_BY_ID, Festival.getFestivalById);
routeCreator(UPDATE_FES_STATUS, Festival.updateFesStatus);
routeCreator(GET_FESTIVAL_LIST, Festival.getFestivalList);

module.exports = router;