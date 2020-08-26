const jsORM = require('js-hibernate')
// const Dateformat = require('dateformat')
const util = require('util')
const mysqlConf = {
  host: 'localhost',
  user: 'root',
  password: '311296daifei',
  database: 'xmpp',
  port: '3306'
}

class HibernateSqlMap {
  constructor () {
    this.session = jsORM.session(mysqlConf)
  }

  initTableMap () {
    // columnMap(object-name-property, table-name-property, optional-property-config)
    // 为了方便，表map映射值的值都与数据库中一致
    this.userMap = this.session.tableMap('usertonet')
      // .columnMap('userId', 'userId', {isAutoIncrement: true})
      .columnMap('usercode', 'usercode')
      .columnMap('status', 'status')
      .columnMap('longitude', 'longitude')
      .columnMap('latitude', 'latitude')

    this.recordMap = this.session.tableMap('record')
      .columnMap('resourceId', 'resourceId')
      .columnMap('resourceName', 'resourceName')
      .columnMap('fathercode', 'fathercode')
      .columnMap('level', 'level')
      .columnMap('status', 'status')
      .columnMap('usercode', 'usercode')
      .columnMap('updatetime', 'updatetime')

    this.taskMap = this.session.tableMap('task')
      .columnMap('taskId', 'taskId')
      .columnMap('usercode', 'usercode')
      .columnMap('address', 'address')
      .columnMap('status', 'status')

    /***
     这里添加表格的MAP
     ***/
  }

  //!!
  changeUserStatus(data)
  {
    let hibernateSqlMap=this
    let table=hibernateSqlMap.userMap.table
    let sql="select * from %s where %s = \'%s\'"
    console.log(data)
    let usercode=data['usercode']
    let status=data['status']
    sql=util.format(sql,table,hibernateSqlMap.userMap.usercode.columnName,usercode[0])
    console.log(sql)
    let judgeUserInOut=hibernateSqlMap.session.executeSql(sql)
    console.log(judgeUserInOut)
    //console.log(result.length)
    judgeUserInOut.then(
     function(result) {
       console.log(result.length)
        if(result.length===0)
        {
          hibernateSqlMap.userMap.Insert(data).then(function (result) {
            console.log('insert user')
          }).catch(function (error) {
            console.log('Error' + error)
          })
        }
        else
        {
          let update_sql = 'update %s set %s = %d where %s = \'%s\''
          update_sql = util.format(update_sql, table, hibernateSqlMap.userMap.status.columnName, status[0], hibernateSqlMap.userMap.usercode.columnName, usercode[0])
          console.log(update_sql)
          let update = hibernateSqlMap.session.executeSql(update_sql)
          update.then(function (result) {
            console.log(result)
          }).catch(function (error) {
            console.log('error: ' + error)
          })
        }
      }
    ).catch(function(error) {
      console.log('error: ' + error)
    })
  }

  // 添加用户入网状态
  // insertNewUser (data) {
  //   let hibernateSql = this
  //   hibernateSql.userMap.Insert(data).then(function (result) {
  //     console.log('insert user')
  //   }).catch(function (error) {
  //     console.log('Error' + error)
  //   })
  // }

  // 查询用户入网状态信息
  selectUserStatus (userId, callback) {
    let hibernateSql = this
    let user = hibernateSql.session.query(hibernateSql.userMap).where(
      hibernateSql.userMap.userId.Equal(userId)
    )
    user.then(function (result) {
      callback(result)
    }).catch(function (error) {
      callback('error')
    })
  }

  // 修改用户入网状态,将userId和status都封装在data中
  // s

  // 查询某个用户的订阅资源列表
  selectUserRecord (usercode, callback) {
    let hibernateSql = this
    let user = hibernateSql.session.query(hibernateSql.recordMap).where(
      hibernateSql.recordMap.userId.Equal(usercode)
    )
    user.then(function (result) {
      callback(result)
    }).catch(function (error) {
      callback('error')
    })
  }

  // 添加用户订阅资源信息
  insertUserRecord (data) {
    let hibernateSql = this
    hibernateSql.recordMap.Insert(data).then(function (result) {
      console.log('insert resource')
    }).catch(function (error) {
      console.log('Error' + error)
    })
  }

  // 修改用户的订阅资源状态信息
  // 将将resourceId和status都封装在data中
  updateUserRecordStatus (data) {
    let hibernateSql = this
    let table = hibernateSql.recordMap.table

    let sql = 'update %s set %s = %d where %s = %d'
    sql = util.format(sql, table, hibernateSql.userMap.status.columnName, data['status'], hibernateSql.recordMap.resourceId.columnName, data['resourceId'])
    console.log(sql)
    let update = hibernateSql.session.executeSql(sql)
    update.then(function (result) {
      console.log(result)
    }).catch(function (error) {
      console.log('error: ' + error)
    })
  }

  // 添加任务
  insertTask (data) {
    let hibernateSql = this
    hibernateSql.taskMap.Insert(data).then(function (result) {
      console.log('insert task')
    }).catch(function (error) {
      console.log('Error' + error)
    })
  }

  // 修改任务状态,将taskId和status都封装在data中
  updateTaskStatus (data) {
    let hibernateSql = this
    let table = hibernateSql.taskMap.table

    let sql = 'update %s set %s = %d where %s = %d'
    sql = util.format(sql, table, hibernateSql.taskMap.status.columnName, data['status'], hibernateSql.taskMap.taskId.columnName, data['taskId'])
    console.log(sql)
    let update = hibernateSql.session.executeSql(sql)
    update.then(function (result) {
      console.log(result)
    }).catch(function (error) {
      console.log('error: ' + error)
    })
  }

  // 查询任务信息
  selectTask (taskId, callback) {
    let hibernateSql = this
    let user = hibernateSql.session.query(hibernateSql.taskMap).where(
      hibernateSql.taskMap.taskId.Equal(taskId)
    )
    user.then(function (result) {
      callback(result)
    }).catch(function (error) {
      callback('error')
    })
  }
}

module.exports = HibernateSqlMap