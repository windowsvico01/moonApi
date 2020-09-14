const db = require('../utils/db');
const BaseCouple = require('../models/baseCouple');
const baseCouple = new BaseCouple();
module.exports = {
  insertNewCouple: async (req, res) => {
    return await baseCouple.insertNewCouple(key, members);
  },
} 