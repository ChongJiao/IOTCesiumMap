<template>
    <div>
      <el-form size="small" v-show="!connectFlag" ref="userValidateForm" style="border: 0.1rem solid #66ccee; padding: 0.2rem">
        <el-tag>用户登陆</el-tag>
        <el-form-item
          prop="userJID"
          label="JID号">
          <el-input placeholder="请输入用户名JID"
                    v-model="userJid"
                    clearable></el-input>
        </el-form-item>

        <el-form-item
          prop="userJID"
          label="密码">
          <el-input placeholder="请输入用户密码"
                    v-model="userPassword"
                    type="password"
                    clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="connecting()">登陆</el-button>
          <el-button @click="resetForm('userValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row style="width: 100%">
        <el-tag>用户状态</el-tag>
        {{connectCode}}
      </el-row>
      <div></div>
      <el-table
        :data="SatelliteData"
        style="width: 100%"
        max-height="250">
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="url"
          label="地址"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="60">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="MakeTask(scope.$index, SatelliteData)"
              type="text"
              size="small">
              处理任务
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-container class="Task" v-show="taskSendFlag">
        <el-row id="flow" style="width: 100%; margin: auto; padding-left: 1rem; padding-right: 1rem">
          <el-steps :active="taskActiveCode" simple>
            <el-step title="发起请求" icon="el-icon-edit"></el-step>
            <el-step title="数据预处理" icon="el-icon-s-tools"></el-step>
            <el-step title="图像增强" icon = "el-icon-picture-outline"></el-step>
            <el-step title="影像生成" icon = "el-icon-cloudy"></el-step>
            <el-step title="目标识别" icon = "el-icon-picture"></el-step>
          </el-steps>
        </el-row>
      </el-container>
    </div>
</template>

<script>
import Strophe from 'strophe.js'
String.format = function (src) {
  if (arguments.length === 0) return null

  var args = Array.prototype.slice.call(arguments, 1)

  return src.replace(/\{(\d+)\}/g, function (m, i) {
    return args[i]
  })
}
export default {
  name: 'UserXmpp',

  methods: {
    connecting () {
      if (this.userJid === '' || this.userPassword === '') {
        return false
      } else {
        console.log(this.userJid)
        console.log(this.userPassword)
        console.log(this.BOSH_SERVER)
        this.conn = new Strophe.Strophe.Connection(this.BOSH_SERVER)
        this.conn.connect(this.userJid, this.userPassword, this.onConnected)
      }
    },
    onConnected (status) {
      console.log('onConnection Function')
      console.log(status)
      if (status === Strophe.Strophe.Status.CONNFAIL) {
        this.connectCode = '连接失败'
        this.connectFlag = false
      } else if (status === Strophe.Strophe.Status.AUTHFAIL) {
        this.connectCode = '登陆失败'
        this.connectFlag = false
      } else if (status === Strophe.Strophe.Status.CONNECTED) {
        this.connectCode = '连接成功，可以开始聊天'
        this.connectFlag = true

        // 当接收到<message>节，调用onMessage回调函数
        this.conn.addHandler(this.onMessage, null, 'message', null, null, null)

        // 首先要发送一个<presence>给服务器（initial presence）
        this.conn.send(Strophe.$pres().tree())
      }
    },
    onMessage (msg) {
      // 解析出<message>的from、type属性，以及body子元素
      let fromJid = msg.getAttribute('from')
      let toJid = msg.getAttribute('to')
      let type = msg.getAttribute('type')
      let elems = msg.getElementsByTagName('body')

      if (type === 'chat' && elems.length > 0) {
        let msgContent = Strophe.Strophe.getText(elems[0])
        msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')
        if (this.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          console.log(replyJson)
          switch (replyJson['type']) {
            case 'satellite':
              this.SatelliteData = JSON.parse(replyJson['data'])
              break
            case 'finished':
              let resultsUrlList = JSON.parse(replyJson['content'])
              for (let key in resultsUrlList) {
                console.log(resultsUrlList[key])
              }
              this.taskSendFlag = false
              break
            case 'status' :
              this.taskActiveCode = replyJson['status'] + 1
              this.taskSendFlag = true
              console.log('activate code')
              console.log(this.taskActiveCode)
              break
            case 'taskId':
              this.processTaskId = replyJson['taskId']
              console.log('task Id is')
              console.log(this.processTaskId)
              break
          }
        } else {
          console.log(fromJid + ' send message to ' + toJid + ' and the message content is ' + msgContent)
        }
      }
      return true
    },
    GetDataUrlSource (toJid) {
      let msgContent = '{\'type\': \'satellite\'}'
      this.SendMessage(toJid, msgContent)
    },
    GetTaskStatus () {
      if (this.taskSendFlag) {
        console.log('obtain task id')
        let msgContent = '{\'type\': \'queryTask\', \'taskId\': {0}}'
        msgContent = String.format(msgContent, this.processTaskId)
        console.log(msgContent)
        this.SendMessage(this.serverJid, msgContent)
      }
    },
    MakeTask (index, data) {
      // Test pass
      let taskFlowStr = '['
      for (let v in this.taskFlowList) {
        taskFlowStr += '"' + this.taskFlowList[v] + '"' + ','
      }
      taskFlowStr = taskFlowStr.substr(0, taskFlowStr.length - 1) + ']'
      console.log(taskFlowStr)
      console.log(data[index].url)
      let msgContent = '{"type": "newTask", "url":"{0}", "content": {1}}'
      msgContent = String.format(msgContent, data[index].url, taskFlowStr)
      console.log('send message is' + msgContent)
      this.SendMessage(this.serverJid, msgContent)
      this.taskSendFlag = true
      setInterval(this.GetTaskStatus, 5000)
    },
    SendMessage (toJid, message) {
      if (this.connectFlag) {
        let msg = Strophe.$msg({
          to: toJid,
          from: this.userJid,
          type: 'chat'
        }).c('body', message)
        this.conn.send(msg.tree())
      }
    },
    isJsonStr (str) {
      try {
        if (typeof JSON.parse(str) === 'object') {
          return true
        }
      } catch (e) {
        console.log(e)
      }
      return false
    },
    resetForm (formName) {
      console.log('reset')
      this.$refs[formName].resetFields()
    }
  },
  data () {
    return {
      conn: null,
      connectFlag: false,
      processTaskId: 0,
      taskSendFlag: false,
      taskLoading: true,
      taskActiveCode: 1,
      connectCode: '未连接',
      userJid: '',
      userPassword: '',
      serverJid: 'admin@desktop-98tu7o0',
      BOSH_SERVER: 'http://localhost:7070/http-bind/',
      SatelliteData: [{name: '高分一号', url: 'https://t127.0.0.1:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806'}],
      taskFlowList: ['fileserver@desktop-98tu7o0', 'imgenhance@desktop-98tu7o0', 'fileserver@desktop-98tu7o0']
    }
  }
}
</script>

<style scoped>
.Task{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;background: rgba(0, 0, 0, 0.5);
}
</style>
