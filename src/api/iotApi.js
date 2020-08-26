const express = require('express')
// let app=express()
// app.listen(3000)
const router = express.Router()
// app.use(router)
const multiparty = require('multiparty')

const HibernateSqlMap = require('./database')
let hibernateModel = new HibernateSqlMap()
hibernateModel.initTableMap()

// 测试
// router.get('/abc', function (req, res) {
//   res.send('Hello World')
//   console.log('123')
// })

// 插入用户入网状态信息
// 插入新的用户,接口为/user?type=new
// 更新用户的入网状态,接口为/user?type=update
// router.get('/setStatus',function(req,res))
// {
//     let userId=res.query['userId']
//     let status=res.query['status']
//     let
// }
router.post('/setStatus', function (req, res) {
  let responseJson = {'res': 0}
  console.log(responseJson)
  console.log("收到入网信息没呀")
  let form=new multiparty.Form()
  form.parse(req, function (err, postJson, files) {
    console.log(postJson)
    if (postJson.length === 0) {
      res.send(responseJson)
    } else {
      hibernateModel.changeUserStatus(postJson)
      responseJson['res'] = 1
      res.send(responseJson)
    }
  })
  //let type = req.query['type']
  // 新建用户状态
  // if (type === 'new') {
  //   console.log('new user')
  //   // 以表单的方式post
  //   let form = new multiparty.Form()
  //   form.parse(req, function (err, postJson) {
  //     console.log(postJson)
  //     if (postJson.length === 0) {
  //       res.send(responseJson)
  //     } else {
  //       hibernateModel.insertNewUser(postJson)
  //       responseJson['res'] = 1
  //       res.send(responseJson)
  //     }
  //   })
  // }
  // if (type === 'update') {
  //   let form = new multiparty.Form()
  //   form.parse(req, function (err, postJson) {
  //     console.log(postJson)
  //     if (postJson.length === 0) {
  //       res.send(responseJson)
  //     } else {
  //       hibernateModel.updateUserStatus(postJson)
  //       responseJson['res'] = 1
  //       res.send(responseJson)
  //     }
  //   })
  // }
})

// 查询用户状态信息,主要就是查看是否入网，需要传入userId
// 接口为/user?userId=1    !!!修改
router.get('/status', function (req, res) {
  console.log('get user')
  let usercode = req.query['usercode']
  // console.log(userId)
  hibernateModel.selectUserStatus(usercode, function (result) {
    if (result === 'error' || result === null) {
      res.send({'status': 0})
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

// 获取某个用户的订阅资源列表
// 接口为/resource?userId=1
router.get('/resource', function (req, res) {
  console.log('get resource')
  let usercode = req.query['usercode']
  console.log(usercode)
  hibernateModel.selectUserRecord(usercode, function (result) {
    if (result === 'error' || result === null) {
      res.send({'status': 0})
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

// 用户第一次订阅资源时，为插入数据，接口为/resource?type=new
// 用户修改订阅资源状态时，为修改数据，再次订阅或者取消订阅，接口为/resource?type=update
// 其中post的数据应该都存放于表单中，而不应放入路径参数中
router.post('/resourceOp', function (req, res) {
  let responseJson = {'status': 0}
  let type = req.query['type']
  // 新建用户订阅信息
  if (type === 'new') {
    console.log('new resource')
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      console.log(postJson)
      if (postJson.length === 0) {
        res.send(responseJson)
      } else {
        hibernateModel.insertUserRecord(postJson)
        responseJson['status'] = 1
        res.send(responseJson)
      }
    })
  }
  // 修改用户订阅资源信息状态
  if (type === 'update') {
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      console.log(postJson)
      if (postJson.length === 0) {
        res.send(responseJson)
      } else {
        hibernateModel.updateUserRecordStatus(postJson)
        responseJson['status'] = 1
        res.send(responseJson)
      }
    })
  }
})

// 添加任务，接口为/task?type=new
// 修改任务状态，接口为/task?type=update
router.post('/task', function (req, res) {
  let responseJson = {'status': 0}
  let type = req.query['type']
  // 新建任务
  if (type === 'add') {
    console.log('new task')
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      console.log(postJson)
      if (postJson.length === 0) {
        res.send(responseJson)
      } else {
        hibernateModel.insertTask(postJson)
        responseJson['status'] = 1
        res.send(responseJson)
      }
    })
  }
  // 修改任务状态
  if (type === 'update') {
    let form = new multiparty.Form()
    form.parse(req, function (err, postJson) {
      console.log(postJson)
      if (postJson.length === 0) {
        res.send(responseJson)
      } else {
        hibernateModel.updateTaskStatus(postJson)
        responseJson['status'] = 1
        res.send(responseJson)
      }
    })
  }
})

// 查询任务信息，接口为/task?taskId=1
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

module.exports = router
