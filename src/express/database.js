const jsORM = require('js-hibernate')
// const Dateformat = require('dateformat')
const util = require('util')
const mysqlConf = {
  host: '127.0.0.1',
  user: 'root',
  password: '311296daifei',
  database: 'iottask',
  port: '3306'
}

class HibernateSqlMap {
  constructor () {
    this.session = jsORM.session(mysqlConf)
  }

  initTableMap () {
    // columnMap(object-name-property, table-name-property, optional-property-config)
    // 为了方便，表map映射值的值都与数据库中一致
    this.userMap = this.session.tableMap('user2net')
      // .columnMap('userId', 'userId', {isAutoIncrement: true})
      .columnMap('userCode', 'userCode')
      .columnMap('status', 'status')
      .columnMap('longitude', 'longitude')
      .columnMap('latitude', 'latitude')
      .columnMap('position', 'position')

    this.resourceMap = this.session.tableMap('resource')
      .columnMap('resourceId', 'resourceId')
      .columnMap('resourceName', 'resourceName')
      .columnMap('fatherCode', 'fatherCode')
      .columnMap('resourceLevel', 'resourceLevel')
      .columnMap('status', 'status')
      .columnMap('userCode', 'userCode')
      .columnMap('updateTime', 'updateTime')
      .columnMap('url', 'url')
      .columnMap('taskId', 'taskId')

    this.taskMap = this.session.tableMap('task')
      .columnMap('taskId', 'taskId')
      .columnMap('userCode', 'userCode')
      .columnMap('title', 'title')
      .columnMap('type', 'type')
      .columnMap('status', 'status')
      .columnMap('latitude', 'latitude')
      .columnMap('longitude', 'longitude')
      .columnMap('width', 'width')
      .columnMap('beginTime', 'beginTime')
      .columnMap('endTime', 'endTime')
      .columnMap('period', 'period')
      .columnMap('captureArea', 'captureArea')
      .columnMap('address', 'address')
      .columnMap('updateTime', 'updateTime')

    this.satellitedataset = this.session.tableMap('satellitedataset')
      .columnMap('id', 'id')
      .columnMap('satellite', 'satellite')
      .columnMap('position', 'position')
      .columnMap('url', 'url')
      .columnMap('pos', 'pos')
      .columnMap('text', 'text')

    this.taskflow = this.session.tableMap('taskflow')
      .columnMap('id', 'id')
      .columnMap('satelliteId', 'satelliteId')
      .columnMap('status', 'status')
      .columnMap('iot', 'iot')
    /***
     这里添加表格的MAP
     ***/
  }

  // !!
  setUserStatus (data) {
    let hibernateSql = this
    let table = hibernateSql.userMap.table
    let sql = "update %s set %s = %d where %s = '%s'"
    sql = util.format(sql, table,
      hibernateSql.userMap.status.columnName, data['status'],
      hibernateSql.userMap.userCode.columnName, data['userCode'][0])
    console.log(sql)
    let p = new Promise(function (resolve, reject) {
      let sqlRes = hibernateSql.session.executeSql(sql)
      sqlRes.then(function (result) {
        resolve(result)
      }
      ).catch(function (error) {
        reject(new Error('-1'))
        console.log(error.stack())
      })
    })
    return p
  }

  // 查询用户入网状态信息
  selectUserStatus (userCode) {
    let hibernateSql = this
    let p = new Promise(function (resolve, reject) {
      let user = hibernateSql.session.query(hibernateSql.userMap).where(
        hibernateSql.userMap.userCode.Equal(userCode)
      )
      user.then(function (result) {
        resolve(result)
      }).catch(function (error) {
        reject(new Error('error'))
        console.log(error.stack())
      })
    })
    return p
  }

  // 修改用户入网状态,将userId和status都封装在data中
  // s

  // 查询某个用户的订阅资源列表
  selectUserRecord (userCode) {
    let hibernateSql = this
    let p = new Promise(function (resolve, reject) {
      let sqlRes = hibernateSql.session.query(hibernateSql.resourceMap).where(
        hibernateSql.resourceMap.userCode.Equal(userCode)
          .And()
          .status.Equal(1)
      )
      sqlRes.then(function (result) {
        resolve(result)
      }).catch(function (error) {
        reject(new Error('-1'))
        console.log(error.stack())
      })
    })
    return p
  }

  // 添加用户订阅资源信息
  insertUserResource (data, userCode) {
    data = JSON.parse(data)
    let hibernateSql = this

    let table = hibernateSql.resourceMap.table
    let sql = 'insert into %s (%s, %s, %s, %s, %s, %s, %s, %s, %s) values'
    sql = util.format(sql, table,
      hibernateSql.resourceMap.resourceId.columnName,
      hibernateSql.resourceMap.resourceName.columnName,
      hibernateSql.resourceMap.resourceLevel.columnName,
      hibernateSql.resourceMap.fatherCode.columnName,
      hibernateSql.resourceMap.status.columnName,
      hibernateSql.resourceMap.userCode.columnName,
      hibernateSql.resourceMap.updateTime.columnName,
      hibernateSql.resourceMap.url.columnName,
      hibernateSql.resourceMap.taskId.columnName)
    let p = new Promise(function (resolve, reject) {
      for (let i in data) {
        data[i].userCode = userCode
        data[i].status = 1
        let tmp = "(%d, '%s', %d, %d, %d, '%s', '%s', '%s', '%d'),"
        var taskId = -1
        if (data[i].taskId === undefined) {
          taskId = -1
        } else {
          taskId = data[i].taskId
        }
        tmp = util.format(tmp, data[i].resourceId, data[i].resourceName, data[i].resourceLevel,
          data[i].fatherCode, data[i].status, data[i].userCode, data[i].updateTime, data[i].url, taskId)
        sql += tmp
      }
      sql = sql.substr(0, sql.length - 1)
      console.log(sql)
      hibernateSql.session.executeSql(sql).then(function (result) {
        resolve(result)
      }).catch(function (error) {
        reject(new Error('-1'))
        console.log('Error' + error)
      })
    })

    return p
  }

  // 修改用户的订阅资源状态信息
  // 将将resourceId和status都封装在data中
  deleteUserResource (data, userCode) {
    data = JSON.parse(data)
    let hibernateSql = this
    let table = hibernateSql.resourceMap.table
    let sql = "delete from %s where %s = '%s' and %s in (%s)"
    let tmp = ''
    for (let i in data) {
      tmp += data[i].resourceId.toString() + ','
    }
    tmp = tmp.substr(0, tmp.length - 1)
    sql = util.format(sql, table,
      hibernateSql.resourceMap.userCode.columnName,
      userCode,
      hibernateSql.resourceMap.resourceId.columnName, tmp)
    console.log(sql)
    let p = new Promise(function (resolve, reject) {
      hibernateSql.session.executeSql(sql).then(function (result) {
        resolve(result)
      }).catch(function (error) {
        reject(new Error('-1'))
        console.log('Error' + error)
      })
    })
    return p
  }

  // 更新资源信息
  updateResource (resourceId, taskId, url) {
    let p = new Promise((resolve, reject) => {
      let sql = "update %s set %s = %d, %s='%s' where %s = %d"
      sql = util.format(sql,
        this.resourceMap.table,
        this.resourceMap.taskId.columnName, taskId,
        this.resourceMap.url.columnName, url,
        this.resourceMap.resourceId.columnName, resourceId)
      console.log('update resource is ' + sql)
      let update = this.session.executeSql(sql)
      update.then(function (result) {
        resolve(result)
      }).catch(function (error) {
        console.log('error: ' + error)
        reject(new Error('-1'))
      })
    })
    return p
  }

  // 添加任务
  insertTask (data, userCode) {
    data = JSON.parse(data)
    data.userCode = userCode
    let hibernateSql = this
    let p = new Promise(function (resolve, reject) {
      hibernateSql.taskMap.Insert(data).then(function (result) {
        resolve(result)
      }).catch(function (error) {
        console.log(error)
        reject(new Error('-1'))
      })
    })
    return p
  }

  // 修改任务状态,将taskId和status都封装在data中
  updateTaskStatus (data) {
    data = JSON.parse(data)
    let hibernateSql = this
    let table = hibernateSql.taskMap.table
    let sql = "update %s set %s = %d, %s='%s' where %s = %d"
    sql = util.format(sql, table,
      hibernateSql.taskMap.status.columnName, data['status'],
      hibernateSql.taskMap.address.columnName, data['address'],
      hibernateSql.taskMap.taskId.columnName, data['taskId'])
    console.log(sql)
    let p = new Promise(function (resolve, reject) {
      let update = hibernateSql.session.executeSql(sql)
      update.then(function (result) {
        resolve(result)
      }).catch(function (error) {
        console.log('error: ' + error)
        reject(new Error('-1'))
      })
    })
    return p
  }

  // 查询用户任务信息
  queryTask (userCode) {
    let hibernateSql = this
    let p = new Promise(function (resolve, reject) {
      hibernateSql.session.query(hibernateSql.taskMap).where(
        hibernateSql.taskMap.userCode.Equal(userCode)
      ).then((results) => {
        resolve(results)
      }).catch((reason) => {
        reject(new Error('-1'))
      })
    })
    return p
  }

  // 查询所有卫星数据源内容：satelliteData
  selectAllSatelliteData () {
    let hibernateSql = this
    let p = new Promise(function (resolve, reject) {
      var sql = 'select * from `satellitedataset`'
      var query = hibernateSql.session.executeSql(sql)
      query.then(function (result) {
        resolve(result)
      }).catch(function (error) {
        reject(new Error('-1'))
        console.log(error.stack())
      })
    })
    return p
  }

  // 查询当前在执行的任务信息：taskflow
  selectAllTaskflow () {
    let hibernateSql = this
    let p = new Promise(function (resolve, reject) {
      hibernateSql.session.query(hibernateSql.taskflow).where(
        hibernateSql.taskflow.status.Equal(0)
      ).then((results) => {
        resolve(results)
      }).catch((reason) => {
        reject(new Error('-1'))
      })
    })
    return p
  }
}

module.exports = HibernateSqlMap
