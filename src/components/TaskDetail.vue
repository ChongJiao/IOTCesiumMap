<template>
  <div class="Tbody">
    <div class="TaskWindow">
      <!-- 数据的名称-->
<!--      <div class="return">-->
      <div class="head">
        <img src="../assets/return2.png" class="head-image">
        <!--      </div>-->
        <el-tag class="head-tag">
            {{dataName}}
        </el-tag>
      </div>
      <!-- 处理流程-->
      <div class="process-group">
        <div class="step" id="step1">
          <img src="../assets/preProcess.png" class="processIcon">
          <span :class="showTaskDetail[0] ? 'after-process': 'pre-process'">数据预处理</span>
          <el-link type="primary" class="tag-link" v-on:click="showInformation" v-show="showTaskDetail[0]">{{processStatus[0]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step-doing" id="step2">
          <img src="../assets/sharpening.png" class="processIcon">
          <span :class="showTaskDetail[1] ? 'after-process': 'pre-process'">图像融合</span>
          <el-link type="primary" class="tag-link" v-on:click="showDoingInfomation"  v-show="showTaskDetail[1]">{{processStatus[1]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step" id="step3">
          <img src="../assets/imgProcess.png" class="processIcon">
          <span :class="showTaskDetail[2] ? 'after-process': 'pre-process'">图像处理</span>
          <el-link type="primary" class="tag-link" v-show="showTaskDetail[2]">{{processStatus[2]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step" id="step4">
          <img src="../assets/imgEnhence.png" class="processIcon">
          <span :class="showTaskDetail[3] ? 'after-process': 'pre-process'">图像增强</span>
          <el-link type="primary" class="tag-link" v-show="showTaskDetail[3]">{{processStatus[3]}}</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step" id="step5">
          <img src="../assets/object.png" class="processIcon">
          <span :class="showTaskDetail[4] ? 'after-process': 'pre-process'">目标识别</span>
          <el-link type="primary" class="tag-link" v-show="showTaskDetail[4]">{{processStatus[4]}}</el-link>
        </div>
      </div>
      <el-divider></el-divider>
      <div v-show="overInfo">
        <div class="container" style="width: 50%;margin-left: 0">
          <div class="row align-items-center">
            <div class="col-2" style="padding: 0;">
              <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
            </div>
            <div class="col-10">
              <b-card-text class="text-left" style="color:#F56C6C">{{dataProcessNote}}</b-card-text>
            </div>
          </div>
          <div class="row align-items-center" style="margin-top: 1vh;margin-bottom: 1vh">
            <div class="col-2 " style="padding: 0;">
              <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">进度：</el-button>
            </div>
            <div class="col-10">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="100"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div v-if="doingInfo">
        <div class="container" style="width: 50%;margin-left: 0">
          <div class="row align-items-center">
            <div class="col-2" style="padding: 0;">
              <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
            </div>
            <div class="col-10">
              <b-card-text class="text-left" style="color:#F56C6C">对图像进行矫正和融合</b-card-text>
            </div>
          </div>
          <div class="row align-items-center" style="margin-top: 1vh;margin-bottom: 1vh">
            <div class="col-2 " style="padding: 0;">
              <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">进度：</el-button>
            </div>
            <div class="col-10">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="25"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div v-show="overInfo">
        <!--显示图片 -->
        <div class="showImage">
  <!--        可以找到图片地址，但是显示不出来，因为太大？？？-->
  <!--        <img src="http://localhost:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-MSS2-0.tiff" style="width: 250px; height: 250px">-->
          <img src="../assets/GF1_preProcess.png" style="width: 25vw; height: 25vw">
          <img src="../assets/jiantou.png" style="width: 5vw; height: 5vw">
          <img src="../assets/GF1_result.png" style="width: 25vw; height: 25vw">
        </div>
      </div>
      <div v-show="doingInfo">
        <div class="showImage">
          <!--        可以找到图片地址，但是显示不出来，因为太大？？？-->
          <!--        <img src="http://localhost:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-MSS2-0.tiff" style="width: 250px; height: 250px">-->
          <img src="../assets/GF1_preProcess.png" style="width: 25vw; height: 25vw">
          <img src="../assets/jiantou.png" style="width: 5vw; height: 5vw">
          <el-progress type="circle" :percentage="25"></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import left from './left.vue'
import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
export default {
  name: 'TaskDetail',
  components: {left},
  data () {
    return {
      dataName: '高分1号',
      dataProcessNote: '对原始图像进行预处理等',
      // dataProcessNote: "正在进行几何矫正，请稍后。。。",
      overInfo: false,
      doingInfo: false,
      taskSteps: 0,
      showTaskDetail: [true, true, false, false, false],
      processStatus: ['处理完', '正在处理', '未处理', '未处理', '未处理'],
      resultUrlList: []
    }
  },
  mounted () {
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
      }
    }, 2000)
    console.log('task mounted')
    this.messageHandler = myStropheConn.myStropheConn.conn.addHandler(this.onMessage, null, 'message', null, null, null)
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
        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          console.log(replyJson)
          switch (replyJson['type']) {
            case 'status':
              // 可以查询到当前数据已经处理到第几步（0为预处理，1为融合等）了,上面界面进行相应处理
              let taskSteps = replyJson['status']
              console.log(taskSteps)
              for (let key in taskSteps) {
                // 已处理完以及正在处理的可以展示出详情链接
                this.showTaskDetail[taskSteps[key]] = true
              }
              break
          }
        } else {
          console.log(fromJid + ' send message to ' + toJid + ' and the message content is ' + msgContent)
        }
      }
    },
    showInformation: function () {
      this.overInfo = !this.overInfo
    },
    showDoingInfomation: function () {
      this.doingInfo = !this.doingInfo
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
    width: 10vw;
    text-align: center;
    font-size:1.5vw;
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
