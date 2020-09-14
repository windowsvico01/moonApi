const router = require('express').Router();
const urlencodedParser = require('body-parser').urlencoded({ extended: false });

// const { routeCreator } = require('../utils/tools');
const Notes = require('../services/notes');

const ADD_NOTES = '/addNotes'; // 注册


const routeCreator = (route, callback, method = 'post') => {
  router[method](route, urlencodedParser, async (req, res) => {
    const data = await callback(req, res);
    res.status(data.status).send(data.data);
  })
}

routeCreator(ADD_NOTES, Notes.addNotes);

module.exports = router;