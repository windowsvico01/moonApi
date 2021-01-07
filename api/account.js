const router = require('express').Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

// const { routeCreator } = require('../utils/tools');
const Account = require('../services/account');

const ADD_RECORD = '/addRecord'; // 新增
const GET_RECORDS = '/getRecords'; // 新增

const routeCreator = (route, callback, method = 'post') => {
  router[method](route, urlencodedParser, async (req, res) => {
    const data = await callback(req, res);
    res.status(data.status).send(data.data);
  })
}

routeCreator(ADD_RECORD, Account.addRecord);
routeCreator(GET_RECORDS, Account.getRecords);

module.exports = router;