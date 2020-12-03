const router = require('express').Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

// const { routeCreator } = require('../utils/tools');
const Notes = require('../services/notes');

const ADD_NOTES = '/addNotes'; // 新增
const GET_NOTES = '/getNotes'; // 获取列表
const UPDATE_NOTE_STATUS = '/updateNoteStatus'; // 修改状态

const routeCreator = (route, callback, method = 'post') => {
  router[method](route, urlencodedParser, async (req, res) => {
    const data = await callback(req, res);
    res.status(data.status).send(data.data);
  })
}

routeCreator(ADD_NOTES, Notes.addNotes);
routeCreator(GET_NOTES, Notes.getNotes);
routeCreator(UPDATE_NOTE_STATUS, Notes.updateNoteStatus);

module.exports = router;