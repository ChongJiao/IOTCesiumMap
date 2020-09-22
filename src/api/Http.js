import axios from 'axios' // 本文件从数据库获取相关信息
axios.defaults.timeout = 80000
axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.withCredentials = false

class HttpPort {
  http = axios
  // 获取用户状态信息 pass
  getUserNetStatus (userCode) {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.get('/getStatus', {
        params: {
          userCode: userCode
        }
      }).then(res => {
        console.log(res)
        let type = res.data['type']
        if (type === 'error') {
          reject(new Error('null'))
        } else {
          let status = res.data['status']
          resolve(status)
        }
      })
    })
    return p
  }
  // 获取所有卫星数据内容
  getAllSatellite () {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.get('/satelliteData').then(res => {
        resolve(res)
      })
    })
    return p
  }
  // 设定用户状态 pass
  setUserStatus (usercode, status, longitude, latitude) {
    let base = this
    var formData = new FormData()
    formData.append('userCode', usercode)
    formData.append('status', status)
    formData.append('latitude', latitude)
    formData.append('longitude', longitude)

    let p = new Promise(function (resolve, reject) {
      base.http.post('/setStatus', formData).then(res => {
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
  // 获取用户订阅资源列表 pass
  getUserSubResourceList (userCode) {
    let base = this
    let p = new Promise(function (resolve, reject) {
      base.http.get('/resource', {
        params: {
          userCode: userCode
        }
      }).then(res => {
        let type = res.data.type
        if (type === 'error') {
          reject(new Error('0'))
        } else {
          console.log('get')
          resolve(res.data)
        }
      })
    })
    return p
  }
  // 资源订阅\取阅同步 pass
  setResourceSubscribe (data, userCode, type) {
    console.log(JSON.stringify(data))
    console.log('over')
    let formData = new FormData()
    formData.append('resource', JSON.stringify(data))
    formData.append('userCode', userCode)
    let base = this
    let url = '/resourceOp?type={0}'
    url = String.format(url, type)
    let p = new Promise(function (resolve, reject) {
      base.http.post(url, formData)
        .then(res => {
          if (res.data.type === 'success') {
            resolve('success')
          } else {
            reject(new Error('error'))
          }
        })
    })
    return p
  }
  // 任务添加,状态更新
  dealTask (data, userCode, type) {
    let base = this
    let url = '/task?type={0}'
    url = String.format(url, type)
    let formData = new FormData()
    formData.append('data', JSON.stringify(data))
    formData.append('userCode', userCode)
    let p = new Promise(function (resolve, reject) {
      base.http.post(url, formData)
        .then(res => {
          if (res.data.type === 'success') {
            resolve(res.data)
          } else {
            reject(new Error('error'))
          }
        })
    })
    return p
  }
}
let myHttp = new HttpPort()

export default {
  myHttp
}
