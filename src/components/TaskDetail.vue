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
          <el-link type="primary" class="tag-link" @click="showInformation(0)" v-show="showTaskDetail[0]">{{processStatus[0]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[1] === '正在处理' ? 'step-doing' : 'step'" id="step2">
          <img src="../assets/sharpening.png" class="processIcon">
          <span :class="showTaskDetail[1] ? 'after-process': 'pre-process'">图像融合</span>
          <el-link type="primary" class="tag-link" @click="showInformation(1)"  v-show="showTaskDetail[1]">{{processStatus[1]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[2] === '正在处理' ? 'step-doing' : 'step'" id="step3">
          <img src="../assets/imgProcess.png" class="processIcon">
          <span :class="showTaskDetail[2] ? 'after-process': 'pre-process'">图像增强</span>
          <el-link type="primary" class="tag-link" @click="showInformation(2)" v-show="showTaskDetail[2]">{{processStatus[2]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[3] === '正在处理' ? 'step-doing' : 'step'" id="step4">
          <img src="../assets/imgEnhence.png" class="processIcon">
          <span :class="showTaskDetail[3] ? 'after-process': 'pre-process'">图像瓦片切分</span>
          <el-link type="primary" class="tag-link" @click="showInformation(3)" v-show="showTaskDetail[3]">{{processStatus[3]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div :class="processStatus[4] === '正在处理' ? 'step-doing' : 'step'" id="step5">
          <img src="../assets/object.png" class="processIcon">
          <span :class="showTaskDetail[4] ? 'after-process': 'pre-process'">目标识别</span>
          <el-link type="primary" class="tag-link" @click="showInformation(4)" v-show="showTaskDetail[4]">{{processStatus[4]}}</el-link>
        </div>
      </div>
      <el-divider></el-divider>
      <Stage1 v-if="showStageDetail[0]" :allData="allInitData" :stageUrl="url"></Stage1>
      <Stage2 v-if="showStageDetail[1]" :allData="allInitData" :stageUrl="url"></Stage2>
      <Stage3 v-if="showStageDetail[2]" :allData="allInitData" :stageUrl="url"></Stage3>
      <Stage4 v-if="showStageDetail[3]" :allData="allInitData" :stageUrl="url"></Stage4>
      <Stage5 v-if="showStageDetail[4]" :allData="allInitData"></Stage5>
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
      processStatus: ['未理中', '未处理', '未处理', '未处理', '未处理'],
      showStageDetail: [false, false, false, false, false],
      taskId: 0,
      url: 'GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806',
      // 存放初始的所有阶段信息
      allInitData: []
    }
  },
  mounted () {
    // 数据测试部分
    let base = this
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
        setTimeout(function () {
          base.messageHandler = myStropheConn.myStropheConn.conn.addHandler(base.onMessage, null, 'message', null, null, null)
          base.initTask()
        }, 2000)
      } else {
        base.messageHandler = myStropheConn.myStropheConn.conn.addHandler(base.onMessage, null, 'message', null, null, null)
        base.initTask()
      }
    }, 2000)

    // 想从上一个界面获取任务id,可以通过路由的形式获取

    let params = this.$route.params
    if (Object.keys(params).length === 0) {
      if (this.$route.path !== '/ProcessShow') {
        this.$router.push({path: '/ProcessShow'})
      }
    } else {
      this.taskId = params.id
      this.url = params.url
      this.dataName = params.name
      console.log('id is ' + this.taskId)
      console.log('url is ' + this.url)
    }
  },
  destroyed () {
    console.log('Task destroyed')
    if (myStropheConn.myStropheConn.conn != null) {
      myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)
    }
  },
  methods: {
    initTask () {
      let msgContent = '{\'type\': \'singleQueryTask\', \'taskId\': {0}, \'userJID\': \'{1}\'}'
      msgContent = String.format(msgContent, this.taskId, myStropheConn.myStropheConn.userJID)
      myStropheConn.myStropheConn.SendMessage(msgContent)
    },
    onMessage (msg) {
      let type = msg.getAttribute('type')
      let elems = msg.getElementsByTagName('body')

      if (type === 'chat' && elems.length > 0) {
        let msgContent = Strophe.Strophe.getText(elems[0])
        msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')
        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          console.log('replyJson')
          console.log(replyJson)
          switch (replyJson['type']) {
            case 'singleTaskList':
              this.dataName = replyJson['name']
              let data = replyJson['data']
              let len = data.length
              if (len < 1) {
                return false
              }
              for (let i = 0; i < len; i++) {
                this.$set(this.showTaskDetail, i, true)
                data[i]['progress'] = parseInt(data[i]['progress'])
                this.allInitData.push(data[i])
                console.log(this.allInitData)
                if (data[i]['progress'] === 100) {
                  this.processStatus[i] = '处理完'
                } else {
                  this.processStatus[i] = '正在处理'
                }
              }
              break
            // 阶段过程接收
            case 'stageProcess':
              console.log('TaskDetail stageProcess')
              console.log(replyJson)
              if (this.taskId === replyJson['taskId']) {
                let stageId = replyJson['stageId']
                // 如果是该阶段刚开始，初始时没有
                if (stageId > this.allInitData.length) {
                  let temp = {}
                  temp['stageId'] = replyJson['stageId'] - 1
                  temp['progress'] = parseInt(replyJson['progress'])
                  temp['url'] = replyJson['url']
                  console.log('push temp is')
                  console.log(temp)
                  this.allInitData.push(temp)
                } else {
                  let progress = replyJson['progress']
                  // 文档中阶段从1开始，而页面中为了方便从阶段编号从0开始
                  console.log('update progress is ')
                  console.log(progress)
                  this.allInitData[stageId - 1]['progress'] = parseInt(progress)
                }
              }
              break
            // 阶段结束接收
            case 'stageFinished':
              console.log('stageFinished')
              if (this.taskId === replyJson['taskId']) {
                let stageId = replyJson['stageId']
                this.processStatus[stageId - 1] = '处理完'
                // 该阶段处理完，默认处理下一个阶段
                if (stageId <= 4) {
                  this.$set(this.showTaskDetail, stageId, true)
                  this.processStatus[stageId] = '正在处理'
                }
                if (stageId > this.allInitData) {
                  let temp = {}
                  temp['stageId'] = replyJson['stageId'] - 1
                  temp['progress'] = parseInt(replyJson['progress'])
                  temp['url'] = replyJson['url']
                  this.allInitData.push(temp)
                }
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
      for (let i in this.showStageDetail) {
        if (this.showStageDetail[i]) {
          if (index === parseInt(i)) {
            break
          } else {
            return
          }
        }
      }
      this.$set(this.showStageDetail, index, !this.showStageDetail[index])
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
