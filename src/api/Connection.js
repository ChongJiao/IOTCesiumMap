import Strophe from 'strophe.js'
class StropheConn {
  connFlag = false
  conn = null
  userJID = 'wz@127.0.0.1'
  userPassword = '123456'
  BOSH_SERVER = 'http://127.0.0.1:7070/http-bind/'
  controlJID = 'admin@127.0.0.1'
  setUserJid (user) {
    this.userJID = user
  }
  connecting () {
    console.log('connecting')
    this.conn = new Strophe.Strophe.Connection(this.BOSH_SERVER)
    this.conn.connect(this.userJID, this.userPassword, onConnected)
  }
  isJsonStr (str) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true
      }
    } catch (e) {
      return false
    }
    return false
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
  onMessage (msg) {
    // TODO 全局的消息回调函数，但仅处理部分消息接口: 包括任务状态监听，各节点状态监听等
    // console.log('global message')
    // let fromJid = msg.getAttribute('from')
    // let toJid = msg.getAttribute('to')
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
        to: this.controlJID,
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
  if (status === Strophe.Strophe.Status.CONNFAIL) {
    myStropheConn.connectCode = '连接失败'
    myStropheConn.connFlag = false
  } else if (status === Strophe.Strophe.Status.AUTHFAIL) {
    myStropheConn.connectCode = '登陆失败'
    myStropheConn.connFlag = false
  } else if (status === Strophe.Strophe.Status.CONNECTED) {
    myStropheConn.connectCode = '已登陆'
    myStropheConn.connFlag = true
    console.log('已登陆')
    this.addHandler(myStropheConn.onMessage, null, 'message', null, null, null)
    // 首先要发送一个<presence>给服务器（initial presence）
    this.send(Strophe.$pres().tree())
  } else if (status === Strophe.Strophe.Status.CONNECTING) {
    console.log('正在登陆')
  } else {
    myStropheConn.connectCode = '自动登陆失败'
    myStropheConn.connFlag = false
  }
}
console.log('run one')
// myStropheConn.connecting()

export default {
  myStropheConn
}
