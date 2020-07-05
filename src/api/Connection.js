import Strophe from 'strophe.js'
class StropheConn {
  connFlag = false
  conn = null
  userJID = 'wz@127.0.0.1'
  userPassword = '123456'
  BOSH_SERVER = 'http://127.0.0.1:7070/http-bind/'
  setUserJid (user) {
    this.userJID = user
  }
  connecting () {
    console.log('connecting')
    this.conn = new Strophe.Strophe.Connection(this.BOSH_SERVER)
    this.conn.connect(this.userJID, this.userPassword, onConnected)
  }
}
let myStropheConn = new StropheConn()
function onConnected (status) {
  console.log('connected function')
  console.log(status)
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
myStropheConn.connecting()

export default {
  myStropheConn
}
