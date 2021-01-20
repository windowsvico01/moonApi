const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const { to } = require('../utils/tools');


/**
 * 获取临时秘钥
 * @param {string} uid - required - '用户id'
 * @param {string} permission - nullable - '菜单权限'
 * @param {string} username - nullable - '用户昵称'
 * @param {string} head_image - nullable - '用户头像'
 */
// 配置参数
const config = {
  secretId: 'AKIDwhBaw3phFXszD5OAMM6sWCKEGQCds458',
  secretKey: '4tSo56vUvFKCjCPOE2oRpcKn1zyrUUI1',
  // proxy: process.env.Proxy,
  // durationSeconds: 1800,
  // bucket: 'moon-api-1301529976',
  // region: 'ap-beijing',
  // allowPrefix: 'MOONLT/*',
  // // 密钥的权限列表
  // allowActions: [
  //     // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
  //     // 简单上传
  //     'name/cos:PutObject',
  //     'name/cos:PostObject',
  //     // 分片上传
  //     'name/cos:InitiateMultipartUpload',
  //     'name/cos:ListMultipartUploads',
  //     'name/cos:ListParts',
  //     'name/cos:UploadPart',
  //     'name/cos:CompleteMultipartUpload'
  // ],
};

const cos = new COS({
  SecretId: 'AKIDwhBaw3phFXszD5OAMM6sWCKEGQCds458',
  SecretKey: '4tSo56vUvFKCjCPOE2oRpcKn1zyrUUI1'
});
const upload = (req) => new Promise((resolve, rejects) => {
  cos.putObject({
    Bucket: 'moon-api-1301529976', /* 必须 */
    Region: 'ap-beijing',    /* 必须 */
    Key: req.files.file.originalFilename,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: fs.createReadStream(req.files.file.path), // 上传文件对象
    onProgress: function(progressData) {
        // console.log(JSON.stringify(progressData));
    }
  }, function(err, data) {
      if (!err) {
        const result = {
          'code': 1000,
          'url': `http://${data.Location}`,
          'msg': '图片上传成功',
        };
        resolve(Object.assign(result, data));
      }
  });
}).catch((e) => {  
  const data = {
    'code': 3001,
    'msg': '图片上传失败',
  };
  reject(data);
});
module.exports = {
  uploadImage: async (req, res) => {
    const result = { status: 404, data: { code: -1 } };
    const uploadRes = await to(upload(req));
    if (uploadRes.code === 1000) {
      result.status = 200;
      result.data = uploadRes;
      return result;
    } else {
      result.data = uploadRes;
      return result;
    }
  },
} 
