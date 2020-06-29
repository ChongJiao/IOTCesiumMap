<template>
    <div class="body">
      <div class="login" v-show="!connectFlag">
        <div class = "login-body">
          <el-form size="small" ref="userValidateForm">
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
        </div>
      </div>
<!--      <div style="position:fixed; left:1rem; top:1rem; z-index: 9;">-->
<!--        <el-row>-->
<!--          <el-button style="margin-right: 1rem" type="success">用户名称：{{userJid}}</el-button>-->
<!--          <el-button style="margin-right: 1rem" type="success">登陆状态：{{connectCode}}</el-button>-->
<!--        </el-row>-->
<!--      </div>-->
<!--      <div style="position:fixed; left:2rem; top:4rem; z-index: 7;">-->
<!--        <el-row style="right:1rem">-->
<!--          <el-button v-on:click="showTaskWindow" type="danger">已处理卫星列表</el-button>-->
<!--        </el-row>-->
<!--      </div>-->
<!--      <div style="position:fixed; right:1rem; top:1rem; z-index: 8;">-->
<!--                <el-table-->
<!--                  :data="SatelliteData"-->
<!--                  style="width: 100%"-->
<!--                  max-height="250">-->
<!--                  <el-table-column-->
<!--                    prop="satellite"-->
<!--                    label="影像名称"-->
<!--                    width="120">-->
<!--                  </el-table-column>-->
<!--                  <el-table-column-->
<!--                    prop="position"-->
<!--                    label="位置"-->
<!--                    width="120">-->
<!--                  </el-table-column>-->
<!--                  <el-table-column-->
<!--                    label="执行"-->
<!--                    width="120">-->
<!--                    <template slot-scope="scope">-->
<!--                      <el-button @click="MakeTask(scope.$index)"-->
<!--                      type="text">-->
<!--                      处理任务-->
<!--                      </el-button>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                </el-table>-->
<!--      </div>-->
<!--      <div style="position:fixed; left:1rem; top:10rem; z-index: 8;">-->
<!--        <el-button style="margin-right: 1rem" type="success" @click="TestTile()">测试</el-button>-->
<!--      </div>-->
      <el-container class="Task" v-show="taskSendFlag">
        <el-row id="flow" style="width: 100%; margin: auto; padding-left: 1rem; padding-right: 1rem">
          <el-steps :active="taskActiveCode" simple>
            <el-step title="发起请求" icon="el-icon-edit" ></el-step>
            <el-step title="数据预处理" icon="el-icon-s-tools"></el-step>
            <el-step title="图像增强" icon = "el-icon-picture-outline"></el-step>
            <el-step title="影像生成" icon = "el-icon-cloudy"></el-step>
            <el-step title="目标识别" icon = "el-icon-picture"></el-step>
          </el-steps>
        </el-row>
      </el-container>
      <div style="width: 100%"><CesiumMap :tileUrl="tileUrl" :showTileMap = "tileShow"></CesiumMap></div>
      <Window :show="WindowPopUpShow" :title="WindowPopUpTitle" :data="taskData" @closed="closeTasksWindow">
      </Window>
    </div>
</template>

<script>
import Strophe from 'strophe.js'
import CesiumMap from './CesiumMap'
import Window from './UserTaskWindow'
String.format = function (src) {
  if (arguments.length === 0) return null

  var args = Array.prototype.slice.call(arguments, 1)

  return src.replace(/\{(\d+)\}/g, function (m, i) {
    return args[i]
  })
}
export default {
  components: {CesiumMap, Window},
  name: 'UserXmpp',

  mounted () {
    console.log('自动登陆')
    this.connecting()
  },
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
        this.connectCode = '已登陆'
        this.connectFlag = true

        // 当接收到<message>节
        this.conn.addHandler(this.onMessage, null, 'message', null, null, null)

        // 首先要发送一个<presence>给服务器（initial presence）
        this.conn.send(Strophe.$pres().tree())

        // 获取所有地理信息数据
        this.ObtainDataUrlSource()
        // 发送成功即获取当前用户的所有已处理任务
        this.ObtainAllTaskContent()
      } else {
        this.connectCode = '自动登陆失败'
        this.connectFlag = false
      }
      console.log(this.connectCode)
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
              console.log(replyJson)
              this.SatelliteData = JSON.parse(replyJson['data'])
              console.log('SatelliteData is ')
              console.log(this.SatelliteData)
              break
            case 'finished':
              let resultsUrlList = JSON.parse(replyJson['content'])
              for (let key in resultsUrlList) {
                console.log(resultsUrlList[key])
              }
              if (resultsUrlList.length <= 2) {
                console.log('error finished')
              } else {
                this.tileUrl = resultsUrlList[resultsUrlList.length - 1]
                this.tileShow = true
                console.log('Can show tile and Url and it is ' + this.tileUrl)
              }
              this.taskSendFlag = false
              this.taskActiveCode = 1
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
            case 'taskList':
              let contents = replyJson['tasks']
              let jsonContent = JSON.parse(contents)
              if (this.taskData.length > 0) { this.taskData = [] }
              this.taskData = jsonContent
              if (this.taskData[this.taskData.length - 1].length <= 3) {
                this.processTaskId = this.taskData[this.taskData.length - 1]['id']
                this.taskSendFlag = true
                setInterval(this.ObtainTaskStatus, 5000)
              }
              console.log(this.taskData)
          }
        } else {
          console.log(fromJid + ' send message to ' + toJid + ' and the message content is ' + msgContent)
        }
      }
      return true
    },
    ObtainDataUrlSource () {
      let msgContent = '{\'type\': \'satellite\'}'
      this.SendMessage(this.serverJid, msgContent)
    },
    ObtainAllTaskContent () {
      let msgContent = '{\'type\': \'queryTask\'}'
      this.SendMessage(this.serverJid, msgContent)
    },
    ObtainTaskStatus () {
      if (this.taskSendFlag) {
        console.log('obtain task id')
        let msgContent = '{\'type\': \'queryStatus\', \'taskId\': {0}}'
        msgContent = String.format(msgContent, this.processTaskId)
        console.log(msgContent)
        this.SendMessage(this.serverJid, msgContent)
      }
    },
    TestTile () {
      this.tileUrl = 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806'
      this.tileShow = true
    },
    MakeTask (index) {
      let taskFlowStr = '['
      for (let v in this.taskFlowList) {
        taskFlowStr += '"' + this.taskFlowList[v] + '"' + ','
      }
      taskFlowStr = taskFlowStr.substr(0, taskFlowStr.length - 1) + ']'
      console.log(taskFlowStr)
      console.log(this.SatelliteData[index])
      let msgContent = '{"type": "newTask", "url":"{0}", "content": {1}}'
      msgContent = String.format(msgContent, this.SatelliteData[index].url, taskFlowStr)
      console.log('send message is' + msgContent)
      this.SendMessage(this.serverJid, msgContent)
      this.taskSendFlag = true
      setInterval(this.ObtainTaskStatus, 5000)
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
    },
    showTaskWindow: function () {
      this.WindowPopUpShow = true
    },
    closeTasksWindow: function () {
      this.WindowPopUpShow = false
    }
  },
  data () {
    return {
      conn: null,
      connectFlag: true,
      processTaskId: 0,
      taskSendFlag: false,
      taskActiveCode: 1,
      connectCode: '未连接',
      userJid: 'wz@127.0.0.1',
      userPassword: '123456',
      serverJid: 'admin@127.0.0.1',
      BOSH_SERVER: 'http://127.0.0.1:7070/http-bind/',
      SatelliteData: [],
      taskData: [{id: 1,
        data: [{'status': 0, 'url': 'http://127.0.0.1:8000/GFData/imgSrcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.png'}, {'status': 1, 'url': 'imgEnData/test.png'},
          {'status': 2, 'url': 'imgTailData/test.png'}, {'status': 3, 'url': 'imgDeTailData/test.png'}]}],
      taskFlowList: ['fileserver@desktop-98tu7o0', 'imgenhance@desktop-98tu7o0', 'fileserver@desktop-98tu7o0'],
      tileUrl: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806',
      tileShow: true,
      WindowPopUpTitle: '已完成任务列表',
      WindowPopUpShow: false,
      WindowContent: ''
    }
  }
}
</script>

<style scoped>
  .body{
    width: 100%;
  }
  .login{
    position: fixed;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.7);
  }
  .login-body{
    width: 25rem;
    margin-top: 15rem;
    margin-left: auto;
    margin-right: auto;
    padding: 0.5rem;
    background-color: #21abe5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); border-radius: 1rem
  }
  .Task{
    position: fixed;
    z-index: 11;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
