const express = require('express')
// let app=express()
// app.listen(3000)
const router = express.Router()
// app.use(router)
const multiparty = require('multiparty')

const HibernateSqlMap = require('./database')
let hibernateModel = new HibernateSqlMap()
hibernateModel.initTableMap()

// 设定用户入网状态
router.post('/setStatus', function (req, res) {
  let responseJson = {'res': -1}
  console.log(responseJson)
  console.log('收到入网信息')
  let form = new multiparty.Form()
  form.parse(req, function (err, postJson, files) {
    if (err) {
      console.log(err.stack())
    }
    console.log(postJson)

    hibernateModel.setUserStatus(postJson).then((result) => {
      responseJson.res = 1
      res.send(responseJson)
    }).catch((reason) => {
      if (reason.message === ' -1 ') {
        res.send(responseJson)
      } else {
        responseJson.res = 0
        res.send(responseJson)
      }
    })
  })
})

// 获取用户入网状态
router.get('/getStatus', function (req, res) {
  console.log('get user status')
  let usercode = req.query['userCode']
  // console.log(userId)
  hibernateModel.selectUserStatus(usercode).then((result) => {
    if (result.length > 0) {
      res.send({'status': result[0]['status']})
    } else {
      res.send({'type': 'error'})
    }
  }).catch((reason) => {
    res.send({'type': 'error'})
    console.log(reason)
  })
  hibernateModel.selectUserStatus(usercode, function (result) {
    if (result === 'error' || result === null) {
      res.send({'status': 0})
    } else {
      console.log(result)
      res.send({'type': 'error'})
    }
  })
})

// 获取用户订阅资源列表 pass
router.get('/resource', function (req, res) {
  console.log('get resource')
  let userCode = req.query['userCode']
  hibernateModel.selectUserRecord(userCode).then((result) => {
    res.send(result)
  }).catch((reason) => {
    res.send({'type': 'error'})
    console.log(reason)
  })
})

// 用户第一次订阅资源时，为插入数据，接口为/resource?type=new
// 用户修改订阅资源状态时，为修改数据，再次订阅或者取消订阅，接口为/resource?type=delete
router.post('/resourceOp', function (req, res) {
  let type = req.query['type']
  // 新建用户订阅信息
  if (type === 'new') {
    console.log('new resource')
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      if (err) {
        console.log(err.stack())
      }
      hibernateModel.insertUserResource(postJson.resource, postJson.userCode[0]).then((result) => {
        res.send({'type': 'success'})
      }).catch((reason) => {
        console.log(reason)
        res.send({'type': 'error'})
      })
    })
  }
  // 修改用户订阅资源信息状态
  if (type === 'delete') {
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      if (err) {
        console.log(err.stack())
      }
      hibernateModel.deleteUserResource(postJson.resource, postJson.userCode[0]).then((result) => {
        res.send({'type': 'success'})
      }).catch((reason) => {
        console.log(reason)
        res.send({'type': 'error'})
      })
    })
  }
})

// 添加任务，接口为/task?type=new
// 修改任务状态，接口为/task?type=update
router.post('/task', function (req, res) {
  let type = req.query['type']
  // 新建任务
  if (type === 'new') {
    console.log('new task')
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      if (err) {
        console.log(err.stack())
      }
      hibernateModel.insertTask(postJson.data, postJson.userCode[0]).then((result) => {
        res.send({'type': 'success'})
      }).catch((reason) => {
        res.send({'type': 'error'})
      })
    })
  }
  // 修改任务状态, 表示已完成
  if (type === 'update') {
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      if (err) {
        console.log(err)
      }
      hibernateModel.updateTaskStatus(postJson.data).then((result) => {
        res.send({'type': 'success'})
      }).catch((result) => {
        res.send({'type': 'error'})
      })
    })
  }
  // 获取某个用户的所有任务内容
  if (type === 'all') {
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      if (err) {
        console.log(err)
      }
      hibernateModel.queryTask(postJson.userCode[0]).then((result) => {
        let r = {}
        r.type = 'success'
        r.data = result
        res.send(r)
      }).catch((reason) => {
        res.send({'type': 'error'})
      })
    })
  }
})

// TODO 查询任务信息，接口为/task?taskId=1
router.get('/task', function (req, res) {
  console.log('get task')
  let taskId = req.query['taskId']
  // console.log(taskId)
  hibernateModel.selectTask(taskId, function (result) {
    if (result === 'error' || result === null) {
      res.send({'status': 0})
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

// 查询所有卫星数据
router.get('/satelliteData', function (req, res) {
  console.log('get all Data')
  // console.log(taskId)
  hibernateModel.selectAllSatelliteData().then((result) => {
    res.send(result)
  }).catch((reason) => {
    console.log(reason)
    res.send({'type': 'error'})
  })
})

// 查询所有正在运行的任务-卫星数据
router.get('/taskflow', function (req, res) {
  hibernateModel.selectAllTaskflow().then((result) => {
    res.send(result)
  }).catch((reason) => {
    res.send({'type': 'error'})
  })
})

module.exports = router
