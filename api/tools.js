const router = require('express').Router();
const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const UPLOAD_IMAGE = '/uploadImage'; // 上传图片

const cos = new COS({
  SecretId: 'AKIDwhBaw3phFXszD5OAMM6sWCKEGQCds458',
  SecretKey: '4tSo56vUvFKCjCPOE2oRpcKn1zyrUUI1'
});

router.post(UPLOAD_IMAGE, (req, res) => {
  cos.putObject({
    Bucket: 'moon-api-1301529976', /* 必须 */
    Region: 'ap-beijing',    /* 必须 */
    Key: req.files.file.originalFilename,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: fs.createReadStream(req.files.file.path), // 上传文件对象
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
    }
}, function(err, data) {
    if (!err) {
      res.send({
        'code': '0',
        'url': `http://${data.Location}`,
        'msg': '图片上传成功',
      });
    }
});
})

module.exports = router;