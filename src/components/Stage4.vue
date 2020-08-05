<template>
  <div class="detail">
      <div class="container" style="width: 50%;margin-left: 0">
        <div class="row align-items-center">
          <div class="col-2" style="padding: 0;">
            <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
          </div>
          <div class="col-10">
            <b-card-text class="text-left" style="color:#F56C6C">图像瓦片切分等</b-card-text>
          </div>
        </div>
        <div class="row align-items-center" style="margin-top: 1vh;margin-bottom: 1vh">
          <div class="col-2 " style="padding: 0;">
            <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">进度：</el-button>
          </div>
          <div class="col-10">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="this.progress"></el-progress>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <!--显示图片 -->
      <div class="showImage">
        <div style="width: 30vw; height: 25vw; float:left; position:relative;">
          <div style="float: left; width: 12.5vw; height: 14vw;margin-right: 2vw">
            <img :src="originalImageUrl0" style="width: 12.5vw; height: 12.5vw; border: solid #4c43ff 2px">
            <p>子任务1</p>
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="originalImageUrl1" style="width: 12.5vw; height: 12.5vw; border: solid #4c43ff 2px">
            <p>子任务2</p>
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;margin-right: 2vw">
            <img :src="originalImageUrl2" style="width: 12.5vw; height: 12.5vw; border: solid #4c43ff 2px">
            <p>子任务3</p>
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="originalImageUrl3" style="width: 12.5vw; height: 12.5vw; border: solid #4c43ff 2px">
            <p>子任务4</p>
          </div>
        </div>
        <div style="float:left;">
          <img src="../assets/jiantou.png" style="width: 5vw; height: 5vw;margin-left: 3vw;margin-right: 3vw;margin-top: 10vw">
        </div>
        <div style="width: 30vw; height: 25vw; float:left; position:relative;">
          <div v-if="complete">
            <img id="end" :src="finishedImageUrl" style="width: 23vw; height: 23vw">
            <p style="font-size: 2vw">切片完成</p>
          </div>
          <vue-loading v-if="!complete" type="bubbles" color="#d9544e" :size="{ width: '25vw', height: '25vw' }" style="border: solid #4c43ff 2px">
          </vue-loading>
        </div>
      </div>
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'

export default {
  name: 'Stage4',
  props: ['allData', 'stageUrl'],
  mounted () {
    this.baseUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[3]
    this.preUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[2]
    console.log(this.baseUrl)
    console.log(this.preUrl)
    this.progress = this.allData[2]['progress']
    this.originalImageUrl0 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-imgen-0-g-r.png'
    this.originalImageUrl1 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-imgen-1-g-r.png'
    this.originalImageUrl2 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-imgen-2-g-r.png'
    this.originalImageUrl3 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-imgen-3-g-r.png'
    this.finishedImageUrl = this.baseUrl + '/' + 'Finished.jpg'
  },
  data () {
    return {
      stageShow: this.stageShowFour,
      stageData: this.allData,
      progress: 0,
      baseUrl: 'http://127.0.0.1:8000/GFData',
      originalImageUrl0: '',
      originalImageUrl1: '',
      originalImageUrl2: '',
      originalImageUrl3: '',
      finishedImageUrl: '',
      complete: true
    }
  },
  watch: {
    stageShowFour (val) {
      this.stageShow = val
    },
    // 监听数据变化
    allData: {
      handler (nv, ov) {
        for (let i = 0; i < this.allData.length; i++) {
          this.stageData[i] = this.allData[i]
          // console.log(this.stageData[i])
        }
        let len = this.stageData.length
        if (len >= 4) {
          this.progress = this.stageData[3]['progress']
          if (this.stageData[3]['progress'] === 100) {
            this.complete = true
            this.finishedImageUrl = this.baseUrl + '/' + 'Finished.jpg'
          } else {
            this.complete = false
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .showImage{
    display: inline-block;
  }
</style>
