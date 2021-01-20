const mysql = require('mysql');
const db = {};
const env = process.argv[2] || 'dev';
const { mysqlConfig: { baseConfig, proConfig, devConfig } } = require('./config');
db.connect = () => mysql.createConnection(Object.assign(baseConfig, env === 'product' ? proConfig : devConfig));
db.query = (sqlStr, sqlParams, cb) => {
  if (!sqlStr) return;
  const connection = db.connect();
  connection.query(sqlStr, sqlParams, (err, res) => {
    if (err) {
      console.log(err);
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
  console.log(sqlStr);
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
}).catch((e) => {
  console.log(e)
  reject({ code: 3001, msg: '获取信息失败'})
})

module.exports = db;
