const mysql = require('mysql');
const db = {};
const env = process.argv[2] || 'dev';
const log4js = require('./logger');
const logger = log4js.getLogger();
const { mysqlConfig: { baseConfig, proConfig, devConfig } } = require('./config');
db.connect = () => mysql.createConnection(Object.assign(baseConfig, env === 'product' ? proConfig : devConfig));
db.query = (sqlStr, sqlParams, cb) => {
  if (!sqlStr) return;
  const connection = db.connect();
  connection.query(sqlStr, sqlParams, (err, res) => {
    if (err) {
      logger.warn(JSON.stringify(err));
      return
    }
    cb(err, res);
  })
  connection.end(err => {
    if (err) {
      console.log(err);
      return
    }
  })
}
db.queryAsync = (sqlStr, sqlParams) => new Promise((resolve, reject) => {
  logger.info(sqlStr);
  if (!sqlStr) reject({ code: '3001' });
  const connection = db.connect();
  connection.query(sqlStr, sqlParams, (err, res) => {
    if (err) {
      reject({ code: 3002, err })
      return
    }
    resolve({ code: 1000, data: res });
    connection.end(err => {
      if (err) {
        console.log(err);
        return
      }
    })
  })
})

module.exports = db;
