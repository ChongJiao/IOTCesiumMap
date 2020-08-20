// 搭建express服务入口文件
// 开启服务首先需要进入该目录下运行node index.js
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const iotApi = require('./iotApi')

const app = express()

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next()
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extend: false}))

// 后端api路由
app.use(iotApi)
// 监听3000端口
app.listen(3000)
console.log('success listen at port:3000')
