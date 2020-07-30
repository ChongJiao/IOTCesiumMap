<template>
  <div class="Tbody">
    <div class="TaskWindow">
      <!-- 数据的名称-->
<!--      <div class="return">-->
      <div class="head">
        <img src="../assets/return2.png" class="head-image" v-on:click="jumpToAllData()">
        <!--      </div>-->
        <el-tag class="head-tag">
            {{dataName}}
        </el-tag>
      </div>
      <!-- 处理流程-->
      <div class="process-group">
        <div :class="processStatus[0] === '正在处理' ? 'step-doing' : 'step'" id="step1">
          <img src="../assets/preProcess.png" class="processIcon">
          <span :class="showTaskDetail[0] ? 'after-process': 'pre-process'">数据预处理</span>
          <el-link type="primary" class="tag-link" v-on:click="showInformation(0)" v-show="showTaskDetail[0]">{{processStatus[0]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[1] === '正在处理' ? 'step-doing' : 'step'" id="step2">
          <img src="../assets/sharpening.png" class="processIcon">
          <span :class="showTaskDetail[1] ? 'after-process': 'pre-process'">图像融合</span>
          <el-link type="primary" class="tag-link" v-on:click="showInformation(1)"  v-show="showTaskDetail[1]">{{processStatus[1]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[2] === '正在处理' ? 'step-doing' : 'step'" id="step3">
          <img src="../assets/imgProcess.png" class="processIcon">
          <span :class="showTaskDetail[2] ? 'after-process': 'pre-process'">图像处理</span>
          <el-link type="primary" class="tag-link" v-on:click="showInformation(2)" v-show="showTaskDetail[2]">{{processStatus[2]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[3] === '正在处理' ? 'step-doing' : 'step'" id="step4">
          <img src="../assets/imgEnhence.png" class="processIcon">
          <span :class="showTaskDetail[3] ? 'after-process': 'pre-process'">图像增强</span>
          <el-link type="primary" class="tag-link" v-on:click="showInformation(3)" v-show="showTaskDetail[3]">{{processStatus[3]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[4] === '正在处理' ? 'step-doing' : 'step'" id="step5">
          <img src="../assets/object.png" class="processIcon">
          <span :class="showTaskDetail[4] ? 'after-process': 'pre-process'">目标识别</span>
          <el-link type="primary" class="tag-link" v-on:click="showInformation(4)" v-show="showTaskDetail[4]">{{processStatus[4]}}</el-link>
        </div>
      </div>
      <el-divider></el-divider>
      <Stage1 :stageShowOne="stageOne" :allData="allInitData"></Stage1>
      <Stage2 :stageShowTwo="stageTwo" :allData="allInitData"></Stage2>
      <Stage3 :stageShowThree="stageThree" :allData="allInitData"></Stage3>
      <Stage4 :stageShowFour="stageFour" :allData="allInitData"></Stage4>
      <Stage5 :stageShowFive="stageFive" :allData="allInitData"></Stage5>
    </div>
  </div>
</template>

<script>
import left from './Left.vue'
import Stage1 from './Stage1'
import Stage2 from './Stage2'
import Stage3 from './Stage3'
import Stage4 from './Stage4'
import Stage5 from './Stage5'
import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
export default {
  name: 'TaskDetail',
  components: {left, Stage1, Stage2, Stage3, Stage4, Stage5},
  data () {
    return {
      dataName: '',
      showTaskDetail: [false, false, false, false, false],
      processStatus: ['未处理', '未处理', '未处理', '未处理', '未处理'],
      taskId: 0,
      stageOne: false,
      stageTwo: false,
      stageThree: false,
      stageFour: false,
      stageFive: false,
      // 存放初始的所有阶段信息
      allInitData: []
    }
  },
  mounted () {
    let base = this
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
        // 初始化，发送请求
        base.initTask()
        // 接收消息
        base.messageHandler = myStropheConn.myStropheConn.conn.addHandler(base.onMessage, null, 'message', null, null, null)
      }
    }, 2000)
    console.log('taskDetail mounted')
    // 想从上一个界面获取任务id,可以通过路由的形式获取
    this.taskId = this.$route.query.id
    console.log(this.taskId)
  },
  destroyed () {
    console.log('Task destroyed')
    myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)
  },
  methods: {
    testMessage (msg) {
      console.log('Task Message')
      let fromJid = msg.getAttribute('from')
      let toJid = msg.getAttribute('to')
      let type = msg.getAttribute('type')
      let elems = msg.getElementsByTagName('body')
      if (type === 'chat' && elems.length > 0) {
        let msgContent = Strophe.Strophe.getText(elems[0])
        msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')
        console.log(fromJid + ' send message to ' + toJid + ' and the message content is ' + msgContent)
      }
      return true
    },
    initTask () {
      let msgContent = '{\'type\': \'singleQueryTask\', \'taskId\': {0}, \'userJID\': \'{1}\'}'
      msgContent = String.format(msgContent, this.taskId, myStropheConn.myStropheConn.userJID)
      myStropheConn.myStropheConn.SendMessage(msgContent)
    },
    onMessage (msg) {
      // 解析出<message>的from、type属性，以及body子元素
      // let fromJid = msg.getAttribute('from')
      // let toJid = msg.getAttribute('to')
      let type = msg.getAttribute('type')
      let elems = msg.getElementsByTagName('body')

      if (type === 'chat' && elems.length > 0) {
        let msgContent = Strophe.Strophe.getText(elems[0])
        msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')
        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          console.log(replyJson)
          switch (replyJson['type']) {
            case 'singleTaskList':
              this.dataName = replyJson['name']
              let data = replyJson['data']
              let len = data.length
              console.log(len)
              if (len < 1) {
                return false
              }
              for (let i = 0; i < len; i++) {
                this.allInitData.push(data[i])
                if (data[i]['progress'] === 100) {
                  this.showTaskDetail[i] = true
                  this.processStatus[i] = '处理完'
                } else {
                  this.showTaskDetail[i] = true
                  this.processStatus[i] = '正在处理'
                }
              }
              break
            // 阶段过程接收
            case 'stageProcess':
              if (this.taskId === replyJson['taskId']) {
                let stageId = replyJson['stageId']
                // 如果是该阶段刚开始，初始时没有
                if (stageId > this.allInitData.length) {
                  let temp = {}
                  temp['stageId'] = replyJson['stageId'] - 1
                  temp['progress'] = replyJson['progress']
                  temp['url'] = replyJson['url']
                  this.allInitData.push(temp)
                } else {
                  let progress = replyJson['progress']
                  // 文档中阶段从1开始，而页面中为了方便从阶段编号从0开始
                  if (stageId - 1 >= 0) {
                    this.allInitData[stageId - 1]['progress'] = progress
                  }
                }
              }
              break
            // 阶段结束接收
            case 'stageFinished':
              if (this.taskId === replyJson['taskId']) {
                let stageId = replyJson['stageId']
                this.processStatus[stageId - 1] = '处理完'
                // 该阶段处理完，默认处理下一个阶段
                if (stageId <= 4) {
                  this.showTaskDetail[stageId] = true
                  this.processStatus[stageId] = '正在处理'
                }
                this.$forceUpdate()
                if (stageId - 1 >= 0) {
                  this.allInitData[stageId - 1]['progress'] = 100
                }
                this.allInitData[stageId - 1]['url'] = replyJson['url']
              }
              break
            default:
              break
          }
        }
      }
      return true
    },
    showInformation (index) {
      switch (index) {
        case 0:
          this.stageOne = !this.stageOne
          break
        case 1:
          this.stageTwo = !this.stageTwo
          break
        case 2:
          this.stageThree = !this.stageThree
          break
        case 3:
          this.stageFour = !this.stageFour
          break
        case 4:
          this.stageFive = !this.stageFive
          break
        default:
          break
      }
    },
    jumpToAllData () {
      this.$router.push({path: '/ProcessShow'})
    }
  }
}
</script>

<style scoped>
  .Tbody{
    margin-left: 10vw;
    width: 90vw;
  }
  .TaskWindow{
    width: 85vw;
    height: 92vh;
    border: solid;
    border-radius: 1vw;
    margin: 4vh auto;
  }
  .return{
    /*margin-left: 10vw;*/
  }

  .head{
    margin-top: 1vh;
    height: 4vh;
  }
  .head-image{
    margin-left: 1vw;
    float: left;
    width: 4vh;
    height: 4vh;
  }
  .head-tag{
    width: 15vw;
    text-align: center;
    font-size:2.5vw;
    color: #2f2f2f;
    background-color: dodgerblue;
    /*color: aliceblue;*/
    font-family: 华光黑体_CNKI;
    border-radius: 20px
  }

  .process-group{
    height: 10vh;
    margin-top: 3vh;
    padding: 5px;
    display: flex;
    justify-content: space-around;
  }
  .step{
    height: 10vh;
    width: 12vw;
    border-radius: 5px;
    border: solid;
    box-shadow: 8px 8px 5px #888888;
    display: inline-block;
  }
  .step-doing
  {
    height: 10vh;
    width: 12vw;
    border-radius: 5px;
    border: red solid;
    box-shadow: 8px 8px 5px #888888;
    display: inline-block;
  }
  .processIcon{
    width: 4vw;
    height: 4vw;
    display: block;
    float: left;
    padding: 0.4vw
  }
  .pre-process{
    /*margin-top: -50px;*/
    margin-top: 2vh;
    margin-left: 3vw;
    display: block;
    color: crimson;
  }
  .after-process{
    text-align: center;
    margin-top: 2vh;
    margin-left: 3vw;
    display: block;
    color: cornflowerblue;
  }
  .tag-link{
    /*margin-left: 1vw;*/
    /*font-size: small*/
    font-size: 1.3vw;
    font-family: 华光隶书_CNKI;
  }
</style>
