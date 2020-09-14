module.exports = {
  mysqlConfig: {
    baseConfig: {
      host: 'localhost',
      user: 'root',
    },
    proConfig: {
      password: '104Yangpu',
      port: '3306',
      database: 'moonApi'
    },
    devConfig: {
      password: '104Yangpu',
      port: '3306',
      database: 'moonApi'
    }
  },
  tokenConfig: {
    key: '104yangpu',
    expires: 60*60*24, // token默认过期时间
  },
  errMsg: {
    code: 3001,
    msg: '参数缺失'
  }
}