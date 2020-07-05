<template>
  <div id="body">
    <div class="return">
      <img src="../assets/return2.png" style="width: 30px; height: 30px;">
    </div>
    <div class="main">
      <!-- 数据的名称-->
      <div id="header">
        <el-tag style="width: 200px;text-align: center; background-color: dodgerblue; color: aliceblue; border-radius: 20px">
          {{dataName}}
        </el-tag>
      </div>

      <!-- 处理流程-->
      <div class="process-group">
        <div class="step1">
          <img src="../assets/preProcess.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block;" :class="showTaskDetail[0] ? 'after-process': 'pre-process'">数据预处理</span><br>
          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small" v-on:click="showInformation" v-show="showTaskDetail[0]">详情</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/sharpening.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block;" :class="showTaskDetail[1] ? 'after-process': 'pre-process'">图像融合</span><br>
          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small" v-show="showTaskDetail[1]">详情</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/imgProcess.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block;" :class="showTaskDetail[2] ? 'after-process': 'pre-process'">图像处理</span><br>
          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small" v-show="showTaskDetail[2]">详情</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/imgEnhence.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block;" :class="showTaskDetail[3] ? 'after-process': 'pre-process'">图像增强</span><br>
          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small" v-show="showTaskDetail[3]">详情</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/object.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block;" :class="showTaskDetail[4] ? 'after-process': 'pre-process'">目标识别</span><br>
          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small" v-show="showTaskDetail[4]">详情</el-link>
        </div>
      </div>
      <el-divider v-show="information"></el-divider>

      <!--      说明-->
      <div class="container" style="width: 50%;margin-left: 0" v-show="information">
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
      <el-divider v-show="information"></el-divider>

      <!--显示图片 -->
      <div class="showImage" v-show="information">
<!--        可以找到图片地址，但是显示不出来，因为太大？？？-->
<!--        <img src="http://localhost:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-MSS2-0.tiff" style="width: 250px; height: 250px">-->
        <img src="../assets/GF1_preProcess.png" style="width: 250px; height: 250px">
        <img src="../assets/jiantou.png" style="width: 50px; height: 50px">
        <img src="../assets/GF1_result.png" style="width: 250px; height: 250px">
<!--        <el-progress type="circle" :percentage="25"></el-progress>-->
      </div>
    </div>
  </div>
</template>

<script>
import top from './top.vue'
import left from './left.vue'
import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
export default {
  name: 'TaskDetail',
  components: {top, left},
  data () {
    return {
      dataName: '高分1号',
      dataProcessNote: '对原始图像进行预处理等',
      // dataProcessNote: "正在进行几何矫正，请稍后。。。",
      information: false,
      taskSteps: 0,
      showTaskDetail: [true, false, false, false, false],
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
        if (this.isJsonStr(msgContent)) {
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
      if (this.information) {
        this.information = false
      } else {
        this.information = true
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
    }
  }
}
</script>

<style scoped>
  .main{
    width: 80vw;
    height: 88vh;
    margin-left: 15%;
    margin-top: 1vh;
    border: solid;
    border-radius: 10px;
  }
  .return{
    margin-left: -65%;
  }

  #header{
    height: 2vh;
  }

  .process-group{
    height: 10vh;
    margin-top: 3vh;
    padding: 5px;
    display: flex;
    justify-content: space-around;
  }
  .step1{
    height: 10vh;
    width: 150px;
    border-radius: 5px;
    border: solid;
    box-shadow: 8px 8px 5px #888888;
    display: inline-block;
  }
  .pre-process{
    color: crimson;
  }
  .after-process{
    color: cornflowerblue;
  }
</style>
