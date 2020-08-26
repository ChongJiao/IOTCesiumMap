import Strophe from 'strophe.js' //从管控中获取的
class StropheConn {
  connFlag = false
  conn = null
  // userJID = 'wz@127.0.0.1'
  // userPassword = '123456'
  userJID = 'user_001@desktop-98tu7o0'
  userCode = 'user_001'
  userLongitude='88'
  userLatitude='86'
  userPassword = 'user_001'
  BOSH_SERVER = 'http://127.0.0.1:7070/http-bind/'
  httpServer ='http://127.0.0.1:8000/GFData/'
  serverDirPath = ['srcData', 'imgSrcData', 'imgEnData', 'tileData', 'tileDeData']
  gkName = 'guankong@desktop-98tu7o0'
  setUserJid (user) {
    this.userJID = user
  }
  initial () {
    console.log('initial')
    this.conn = new Strophe.Strophe.Connection(this.BOSH_SERVER)
  }
  // 断线是否重连
  normalConnnected () {
    this.conn.connect(this.userJID, this.userPassword, onConnected)
  }
  isJsonStr (str) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('json parse error')
      return false
    }
  }
  // 查询区域
  queryRegion (positions) {
    var posList = []
    for (var key in positions) {
      for (var d in positions[key]) {
        posList.push(positions[key][d])
      }
    }
    let pos = JSON.stringify(posList)
    let dict = {}
    dict['type'] = 'queryRegion'
    dict['pos'] = pos
    let msgContent = JSON.stringify(dict)
    this.SendMessage(msgContent)
  }
  // 获取所有的卫星影像地址
  ObtainDataUrlSource () {
    let msgContent = '{\'type\': \'satellite\'}'
    this.SendMessage(msgContent)
  }
  // 获取这个用户的所有任务内容
  ObtainAllTaskContent () {
    let msgContent = '{\'type\': \'queryTask\'}'
    this.SendMessage(msgContent)
  }
  // TODO 查询当前任务的状态，这个功能需不需要呢？
  ObtainTaskStatus (taskID) {
    if (this.taskSendFlag) {
      console.log('obtain task id')
      let msgContent = '{\'type\': \'queryStatus\', \'taskId\': {0}}'
      msgContent = String.format(msgContent, taskID)
      console.log(msgContent)
      this.SendMessage(msgContent)
    }
  }
  // 构建任务
  MakeTask (url, id) {
    let taskFlowStr = '['
    for (let v in this.taskFlowList) {
      taskFlowStr += '"' + this.taskFlowList[v] + '"' + ','
    }
    taskFlowStr = taskFlowStr.substr(0, taskFlowStr.length - 1) + ']'
    let msgContent = '{"type": "newTask", "url":"{0}", "satelliteId":"{1}","content": {2}}'
    msgContent = String.format(msgContent, url, parseInt(id), taskFlowStr)
    console.log('send message is' + msgContent)
    this.SendMessage(msgContent)
  }
  RandomValue (minVal, maxVal) {
    return Math.random() * (maxVal - minVal) + minVal
  }
  // 入退网申请 pass
  RequestInOrOutToNet (requestType) {
    let msgContent = '{"typeid": 21101, "usercode":"{0}", "requesttype": {1}, "latitude": {2}, "longitude": {3}}'
    let latitude = this.RandomValue(0, 90)
    let longitude = this.RandomValue(0, 180)
    msgContent = String.format(msgContent, this.userCode, requestType, latitude, longitude)
    this.SendMessage(msgContent)  //从这里发送消息给管控，然后管控回复消息给用户处理
  }
  // 资源订阅查询协议 pass
  RequestReSource () {
    let msgContent = '{"typeid": 21103, "usercode":"{0}", "type": "query", "key": ""}'
    msgContent = String.format(msgContent, this.userCode)
    this.SendMessage(msgContent)
  }
  // 资源订阅/退订请求 pass
  ResourceSubUnSub (requestType, itemList) {
    let msgContent = '{"typeid": 21104, "usercode":"{0}", "requesttype": {1}, "resource": {2}}'
    msgContent = String.format(msgContent, this.userCode, requestType, JSON.stringify(itemList))
    this.SendMessage(msgContent)
  }
  replyFinished (taskid, address) {
    let msgContent = '{"typeid": 21107, "nodecode":"{0}", "taskid": {1}, "date": "{2}", "result": {3}, "address": "{4}"}'
    msgContent = String.format(msgContent, this.userCode, taskid, this.getDate(), 1, address)
    this.SendMessage(msgContent)
  }
  replyStatus () {
    let msgContent = '{"typeid": 21215, "usercode":"{0}", "latitude": "{1}", "longitude": "{2}"}'
    let latitude = this.RandomValue(0, 90)
    let longitude = this.RandomValue(0, 180)
    msgContent = String.format(msgContent, this.userCode, latitude, longitude)
    this.SendMessage(msgContent)
  }
  getDate () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    return String(year) + '-' + String(month) + '-' + String(day)
  }
  onMessage (msg) {
    // TODO 全局的消息回调函数，但仅处理部分消息接口: 包括任务状态监听，各节点状态监听等
    let type = msg.getAttribute('type')
    let elems = msg.getElementsByTagName('body')
    if (type === 'chat' && elems.length > 0) {
      let msgContent = Strophe.Strophe.getText(elems[0])
      msgContent = msgContent.replace(/&apos;/g, '"')
      msgContent = msgContent.replace(/&quot;/g, '"')
      console.log(msgContent)
      if (myStropheConn.isJsonStr(msgContent)) {
        // TODO 具体状态消息处理, 消息实体储存在该类中，以供其他组件调用
      }
      // console.log(fromJid + ' send message to ' + toJid + ' and the message content is ' + msgContent)
    }
    return true
  }
  // 消息传输统一放这里好了
  SendMessage (message) {
    if (this.connFlag) {
      let msg = Strophe.$msg({
        to: this.gkName,
        from: this.userJID,
        type: 'chat'
      }).c('body', message)
      console.log('send is ' + msg)
      console.log(msg.tree())
      this.conn.send(msg.tree())
    }
  }
}
let myStropheConn = new StropheConn()
function onConnected (status) {
  console.log('connected function')
  switch (status) {
    case Strophe.Strophe.Status.CONNFAIL:
      myStropheConn.connectCode = '连接失败'
      myStropheConn.connFlag = false
      console.log('连接失败')
      break
    case Strophe.Strophe.Status.AUTHFAIL:
      myStropheConn.connectCode = '登陆失败'
      myStropheConn.connFlag = false
      console.log('登陆失败')
      break
    case Strophe.Strophe.Status.CONNECTED:
      myStropheConn.connectCode = '已登陆'
      myStropheConn.connFlag = true
      console.log('已登陆')
      this.addHandler(myStropheConn.onMessage, null, 'message', null, null, null)
      // 首先要发送一个<presence>给服务器（initial presence）
      this.send(Strophe.$pres().tree())
      break
    case Strophe.Strophe.Status.CONNECTING:
      console.log('正在登陆')
      break
    case Strophe.Strophe.Status.DISCONNECTING:
      console.log('正在登出....')
      break
    case Strophe.Strophe.Status.DISCONNECTED:
      // TODO 跳转出登陆界面
      alert('已退出登陆，请重新登陆')
      // myStropheConn.conn.connect(myStropheConn.userJID, myStropheConn.userPassword, onConnected)
      break
    default:
      myStropheConn.connectCode = '自动登陆失败'
      myStropheConn.connFlag = false
      console.log('自动登陆失败')
      break
  }
}
// console.log('run one')
myStropheConn.initial()

export default {
  myStropheConn
}
