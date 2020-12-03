const jwt = require('jsonwebtoken');
const { tokenConfig } = require('./config');
const urlencodedParser = require('body-parser').urlencoded({ extended: false });
const decodeToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, tokenConfig.key, (err, decode) => {
    // 1002 过期  1003 无效
    const res = { code: 1002 };
    if (err) {
      res.err = err;
      reject(res);
    } else {
      res.code = 1000;
      res.data = decode;
      resolve(res)
    }
  })
})

const getToken = (params, time) => {
  return jwt.sign(params, tokenConfig.key, {
    expiresIn: time || tokenConfig.expires
});
}

const getTokenFromReq = (req) => {
  let token = '';
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers && req.headers.token) {
    token = req.headers.token;
  } else { token = '' };
  return token;
}

// const routeCreator = (router, route, callback, method = 'post') => {
//   router[method](route, urlencodedParser, async (req, res) => {
//     const data = await callback(req, res);
//     res.status(data.status).send(data.data);
//   })
// }


module.exports = {
  getToken,
  decodeToken,
  getTokenFromReq,
}
