import axios from 'axios' //本文件从数据库获取相关信息
axios.defaults.timeout = 8000
axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.withCredentials = false

class HttpPort {
  http = axios
  // 获取用户状态信息
  getUserNetStatus (userId) {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.get('/status', {
        params: {
          userId: userId
        }
      }).then(res => {
        let status = res.data['status']
        if (status == null) {
          reject(new Error('null'))
        } else {
          resolve(status)
        }
      })
    })
    return p
  }
  // 设定用户状态
  setUserStatus (userId, status) {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.get('/setStatus', {
        params: {
          userId: userId,
          status: status
        }
      }).then(res => {
        let result = res.data['res']
        if (result === 0) {
          reject(new Error('error'))
        } else {
          resolve('success')
        }
      })
    })
    return p
  }
  // 获取用户订阅资源列表
  getUserSubResourceList (userId) {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.get('/resource', {
        params: {
          userId: userId
        }
      }).then(res => {
        let data = res.data
        resolve(data)
      })
    })
    return p
  }
  // 资源订阅\取阅同步
  setResourceSubscribe (formData, type) {
    let base = this
    let url = '/resourceOp?type={0}'
    url = String.format(url, type)
    let p = new Promise(function (resolve, reject) {
      base.http.post(url, formData)
        .then(res => {
          if (res.data.status === 1) {
            resolve('success')
          } else {
            reject(new Error('error'))
          }
        })
    })
    return p
  }
  // 任务添加
  addUserTask (formData) {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.post('task?type=add', formData)
        .then(res => {
          if (res.data.status === 1) {
            resolve('success')
          } else {
            reject(new Error('error'))
          }
        })
    })
    return p
  }
  // 任务完成状态更新
  setUserTaskStatus (taskId, status) {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.get('task', {
        params: {
          taskId: taskId,
          status: status
        }
      }).then(res => {
        let status = res.data.status
        if (status === 1) {
          resolve('success')
        } else {
          reject(new Error('error'))
        }
      })
    })
    return p
  }
}
let myHttp = new HttpPort()
export {
  myHttp
}
