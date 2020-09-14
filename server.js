const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multipart = require('connect-multiparty');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const user = require('./api/user.js');
const notes = require('./api/notes.js');
const https = require("https");
const fs = require("fs");
const env = process.argv[2] || 'dev';


app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(cookieParser('123456'));
app.use(urlencodedParser);

// 路由node_modules
app.use('/', express.static('public'));
app.use('/static', express.static('node_modules'));
app.use(multipart());

app.use('/user', user);
app.use('/notes', notes);

server.setTimeout(10*1000);
server.listen(80, () => {
  console.log('服务器正在监听80端口');
})
if (env === 'product') {
  const httpsOption = {
    key : fs.readFileSync("./https/2_www.moonlt.cn.key"), 
    cert: fs.readFileSync("./https/1_www.moonlt.cn_bundle.pem")
  }
  https.createServer(httpsOption, app).listen(443, function() {
    console.log('https监听443端口')
  });
}







