
const db = require('../utils/db');
const jwt = require('jsonwebtoken');
const request = require('request');
const { tokenConfig } = require('../utils/config');
const isInt = (str) => {
  if (!str) return false;
  str = str + '';
  const req = /^[0-9]*$/;
  return str.match(req);
}
const deleteNull = (params) => {
  const final = {};
  Object.keys(params).forEach(key => {
    if (isInt(params[key]) || params[key]) final[key] = params[key];
  })
  return final;
}
class Base {
  constructor() {
    this.state = {
      from: 'base',
    }
  }
  async requestOpenInfo (code) {
    return new Promise(function(resolve, reject) {
      request(`https://api.weixin.qq.com/sns/jscode2session?appid=wx30ba2c0a7c24d48f&secret=0237042dce1141ff98bebcad08aaaa3c&js_code=${code}&grant_type=authorization_code`,
      function (error, response, body) {
        console.log(response);
        console.log(error);
        if (!error && response.statusCode == 200) {
          // 请求成功的处理逻辑
          resolve({ code: 1000, data: body });
        }
        reject({ code: 3001})
      });
    })
  }
  /**
   * @type default: 'AND'  |  'OR'
   * @orderBy Object { key: required, sort: ASC }
   * @page
   * @limit
   */
  async getInfo (table, cols = '*', params, type = 'AND', orderBy, page, limit = 10) {
    if (!table || !cols || !this.isObject(params)) return this.getError();
    let paramsStr = '';
    const finalParams = deleteNull(params);
    Object.keys(finalParams).forEach((key, index) => {
      if (index === 0) {
        if (isInt(finalParams[key])) paramsStr = `${key}=${finalParams[key]}`;
        else paramsStr = `${key}='${finalParams[key]}'`;
      } else {
        if (isInt(finalParams[key])) paramsStr += ` ${type} ${key}=${finalParams[key]}`;
        else paramsStr += ` ${type} ${key}='${finalParams[key]}'`;
      }
    })
    let getSql = `SELECT ${cols} FROM ${table}`;
    if (paramsStr) { // 搜索
      getSql = `${getSql} WHERE ${paramsStr}`;
    }
    if (orderBy) { // 排序
      getSql = `${getSql} ORDER BY ${orderBy.key} ${orderBy.sort}`;
    }
    if (page) { // 分页
      getSql = `${getSql} LIMIT ${(page - 1) * limit},${limit};`;
    }
    return await db.queryAsync(getSql);
  }
  async updateInfo(table, items, params, type = 'AND') {
    if (!table || !items || !this.isObject(params) || !this.isObject(items)) return this.getError();
    let paramsStr = '';
    let setStr = '';
    let setArr = [];
    Object.keys(params).forEach((key, index) => {
      if (index === 0) {
        paramsStr = `${key}='${params[key]}'`;
      } else {
        paramsStr = `${type} ${key}='${params[key]}'`;
      }
      if (index === 0) {
        if (isInt(params[key])) paramsStr = `${key}=${params[key]}`;
        else paramsStr = `${key}='${params[key]}'`;
      } else {
        if (isInt(params[key])) paramsStr = `${type} ${key}=${params[key]}`;
        else paramsStr = `${type} ${key}='${params[key]}'`;
      }
    })
    Object.keys(items).forEach((key, index) => {
      if (index === 0) {
        setStr = `${key} = ?`;
      } else {
        setStr = `${setStr},${key} = ?`;
      }
      setArr.push(items[key]);
    })
    const updateSql = `UPDATE ${table} SET ${setStr} WHERE ${paramsStr}`;
    return await db.queryAsync(updateSql, setArr);
  }
  async insertInfo(table, params) {
    let insertArr = [];
    let valuesArr = [];
    const pushArr = [];
    Object.keys(params).forEach(key => {
      insertArr.push(key);
      if (params[key] && params[key].noSet) {
        valuesArr.push(0);
      } else {
        valuesArr.push('?');
        pushArr.push(params[key])
      }
    })
    const insertSql = `INSERT INTO ${table}(${insertArr.join(',')}) VALUES(${valuesArr.join(',')})`;
    return await db.queryAsync(insertSql, pushArr);
  }
  deleteInfo() {

  }
  decodeToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, tokenConfig.key, (err, decode) => {
        let res = this.getError(1002);
        if (err) {
          res.err = err;
          reject(res);
        } else {
          res = this.getResult(decode);
          resolve(res)
        }
      })
    })
  }
  getToken(params, time)  {
    return jwt.sign(params, tokenConfig.key, {
      expiresIn: time || tokenConfig.expires
  });
  }
  isObject(obj) {
    if (!obj) return false;
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  getResult(data) {
    return { from: this.state.from, code: 1000, data };
  }
  getError(code) {
    const _errorMsg = { from: this.state.from, code };
    switch(code) {
      case 1001:
        _errorMsg.msg = '无权限访问';
        break;
      case 1002:
        _errorMsg.msg = 'token过期';
        break;
      case 1003:
        _errorMsg.msg = 'token无效';
        break;
      case 2001:
        _errorMsg.msg = '用户未登录';
        break;
      case 2002:
        _errorMsg.msg = '用户信息错误';
        break;
      case 2003:
        _errorMsg.msg = '用户不存在';
        break;
      case 3001:
        _errorMsg.msg = '参数缺失';
        break;
      case 3001:
        _errorMsg.msg = '业务错误';
        break;
      default:
        _errorMsg.code = -1;
        _errorMsg.msg = '默认错误';
        break;
    }
    return _errorMsg;
  }
}

module.exports = Base;