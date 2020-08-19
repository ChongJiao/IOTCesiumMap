<template>
  <div id="body">
    <!--    <top></top>-->
    <!--    <left></left>-->
    <!--    <div class="return">-->
    <!--      <img v-bind src="../assets/return2.png" style="width: 30px; height: 30px;">-->
    <!--    </div>-->
    <div class="main">
      <div class="div-name">
        <div style="text-align: left;font-family: 华光黑体_CNKI;font-size:1vw">名称:{{processData.name}}</div>
        <div style="display:flex;align-items:stretch;">
          <div style="height:inherit;font-family: 华光黑体_CNKI; font-size: 1vw">进度:</div>
          <div style="height:inherit;width: 40vw;">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="this.progress"></el-progress>
          </div>
        </div>
      </div>
      <div class="outerDiv">
        <div :class="this.runStatus[0] === 0 ? 'innerNotRun' : this.runStatus[0] === 1 ? 'innerRun' : 'innerFinished'">
          <div class="nameSpan">步骤1: 对数据预处理</div>
          <div class="imgDiv">
            <img :src="url[0]" class="imgStyle" v-if="!initialImageShow[0]">
            <vue-loading type="bubbles" color="#d9544e" class="imgStyle" :size="{ width: '50%' }" v-if="initialImageShow[0]">
            </vue-loading>
          </div>        </div>
        <div style="width:0.5%"></div>
        <div :class="this.runStatus[1] === 0 ? 'innerNotRun' : this.runStatus[1] === 1 ? 'innerRun' : 'innerFinished'">
          <div class="nameSpan">步骤2: 图像矫正与融合</div>
          <div class="imgDiv">
            <img :src="url[1]" class="imgStyle" v-if="!initialImageShow[1]">
            <vue-loading type="bubbles" color="#d9544e" class="imgStyle" :size="{ width: '50%' }" v-if="initialImageShow[1]">
            </vue-loading>
          </div>
        </div>
        <div style="width:0.5%"></div>
        <div :class="this.runStatus[2] === 0 ? 'innerNotRun' : this.runStatus[2] === 1 ? 'innerRun' : 'innerFinished'">
          <div class="nameSpan">步骤3: 图像增强去云去雾</div>          <div class="imgDiv">
          <img :src="url[2]" class="imgStyle" v-if="!initialImageShow[2]">
          <vue-loading type="bubbles" color="#d9544e" class="imgStyle" :size="{ width: '50%' }" v-if="initialImageShow[2]">
          </vue-loading>
        </div>
        </div>
        <div style="width:0.5%"></div>
        <div :class="this.runStatus[3] === 0 ? 'innerNotRun' : this.runStatus[3] === 1 ? 'innerRun' : 'innerFinished'">
          <div class="nameSpan">步骤4：对图像瓦片切分</div>
          <div class="imgDiv">
            <img :src="url[3]" class="imgStyle" v-if="!initialImageShow[3]">
            <vue-loading type="bubbles" color="#d9544e" class="imgStyle" :size="{ width: '50%' }" v-if="initialImageShow[3]">
            </vue-loading>
          </div>
        </div>
        <div style="width:0.5%"></div>
        <div :class="this.runStatus[4] === 0 ? 'innerNotRun' : this.runStatus[4] === 1 ? 'innerRun' : 'innerFinished'">
          <div class="nameSpan">步骤5：图像目标识别 </div>
          <div class="imgDiv">
            <img :src="url[4]" class="imgStyle" v-if="!initialImageShow[4]">
            <vue-loading type="bubbles" color="#d9544e" class="imgStyle" :size="{ width: '50%'}" v-if="initialImageShow[4]">
            </vue-loading>
          </div>
        </div>
        <el-button type="primary" v-if="complete" @click="jumpToTaskDetail">已完成</el-button>
        <el-button type="process" v-if="!complete" @click="jumpToTaskDetail">进行中</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import myStropheConn from '../api/Xmpp'
export default {
  name: 'ProcessShowItem',
  props: ['processData'],
  mounted () {
    this.handleChangeData()
  },
  // components: {top, left},
  data () {
    return {
      progress: 0,
      url: ['../assets/initial.png', '../assets/initial.png', '../assets/initial.png', '../assets/initial.png', '../assets/initial.png'],
      initialImageShow: [true, true, true, true, true],
      runStatus: [0, 0, 0, 0, 0],
      button_finished: require('../assets/yiwancheng.png'),
      complete: false
      // dataName: '高分1号',
      // dataProcessNote: '对原始图像进行预处理等',
      // // dataProcessNote: "正在进行几何矫正，请稍后。。。",
      // information: false
    }
  },
  watch: {
    processData: {
      handler (nv, ov) {
        this.handleChangeData()
      },
      deep: true
    }
  },
  methods: {
    handleChangeData () {
      console.log(this.processData)
      let len = this.processData.taskStatus.length
      let index = 0
      console.log('initial data')
      while (index < len) {
        let url = this.processData.taskStatus[index].url
        let processProgress = this.processData.taskStatus[index].processProgress
        let resUrl = this.setData(index, parseInt(processProgress), url)
        console.log(resUrl)
        this.$set(this.url, index, resUrl)
        this.$set(this.initialImageShow, index, false)
        index += 1
      }
      console.log(this.processData.taskStatus[len - 1])
      this.progress = parseInt(this.processData.taskStatus[len - 1].processProgress)
      console.log(this.progress)
      if (this.progress === 100 && len === 5) {
        console.log('complete')
        this.complete = true
      }
    },
    setData (index, progress, url) {
      let baseServer = myStropheConn.myStropheConn.httpServer
      let baseDir = myStropheConn.myStropheConn.serverDirPath[index]
      let resUrl = null
      switch (index) {
        case 0:
          if (progress < 100) {
            resUrl = baseServer + baseDir + '/' + url + '/' + url + '.jpg'
            this.runStatus[index] = 1
          } else {
            resUrl = baseServer + baseDir + '/' + url + '/' + url + '-MSS2.png'
            this.runStatus[index] = 2
          }
          break
        case 1:
          if (progress < 100) {
            let preDir = myStropheConn.myStropheConn.serverDirPath[index - 1]
            resUrl = baseServer + preDir + '/' + url + '/' + url + '-MSS2.png'
            this.runStatus[index] = 1
          } else {
            resUrl = baseServer + baseDir + '/' + url + '/' + url + '-pansharpen-0-g-r.png'
            this.runStatus[index] = 2
          }
          break
        case 2:
          if (progress < 100) {
            let preDir = myStropheConn.myStropheConn.serverDirPath[index - 1]
            resUrl = baseServer + preDir + '/' + url + '/' + url + '-pansharpen-0-g-r.png'
            this.runStatus[index] = 1
          } else {
            resUrl = baseServer + baseDir + '/' + url + '/' + url + '-imgen-0-g-r.png'
            this.runStatus[index] = 2
          }
          break
        case 3:
          if (progress < 100) {
            let preDir = myStropheConn.myStropheConn.serverDirPath[index - 1]
            resUrl = baseServer + preDir + '/' + url + '/' + url + '-imgen-0-g-r.png'
            this.runStatus[index] = 1
          } else {
            resUrl = baseServer + baseDir + '/Finished.jpg'
            this.runStatus[index] = 2
          }
          break
        case 4:
          if (progress < 100) {
            let preDir = myStropheConn.myStropheConn.serverDirPath[index - 1]
            resUrl = baseServer + preDir + '/Finished.jpg'
            this.runStatus[index] = 1
          } else {
            resUrl = baseServer + baseDir + '/Finished.jpg'
            this.runStatus[index] = 2
          }
          break
      }
      return resUrl
    },
    jumpToTaskDetail () {
      this.$router.push({
        name: 'TaskDetail',
        params: {
          id: this.processData.id,
          url: this.processData.taskStatus[0].url,
          name: this.processData.name
        }
      })
    }
  }
}
</script>

<style scoped>
  .main{
    width: 85vw;
    margin-top: 0.5vw;
    border: 0.1vw solid CadetBlue;
    border-radius: 0.5vw;
    display: inline-block;
  }
  .div-name{
    width: 80vw;
    margin-top:0.5vw;
    margin-left:0.5vw ;
    margin-bottom: 0.5vw;
  }
  .outerDiv{
    padding: 0 0.1vw 0.5vw 0.5vw;
    display: flex;
    /*justify-content: space-around;*/
  }
  .el-button--primary
  {
    color:OliveDrab;
    background-color:LemonChiffon;
    border: 0.3vw solid white;
    font-size: 0.8vw;
  }
  .el-button--process
  {
    color:IndianRed;
    background-color:Bisque;
    border: 0.3vw solid white;
    font-size: 0.8vw;
  }
  .innerNotRun{
    background-color:AliceBlue;
    width: 20%;
    /*height: 8vw;*/
    border: solid 2px CadetBlue;
    border-radius: 0.5vw;
    padding: 0.1vw;
    position: relative;
  }
  .innerRun {
    background-color: PeachPuff;
    width: 20%;
    border: solid 2px CadetBlue;
    border-radius: 0.5vw;
    padding: 0.1vw;
    position: relative;
  }
  .innerFinished{
    background-color: Honeydew;
    width: 20%;
    border: solid 2px CadetBlue;
    border-radius: 0.5vw;
    padding: 0.1vw;
    position: relative;
  }
  .nameSpan{
    width: 40%;
    margin-left: 1vw;
    margin-top: 0.5vw;
    text-align: left;
    font-size: 1vw;
    float:left;
  }
  .imgDiv{
  margin-left: 10%;
    width: 40%;
    float: left;
    display: inline-block;
  }
  .imgStyle{
  margin: auto;
    border-bottom: solid 1px CadetBlue;
    width: 50%;
    display: block;
  }
</style>
