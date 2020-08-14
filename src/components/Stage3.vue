<template>
  <div class="detail">
      <div class="container" style="width: 50%;margin-left: 0">
        <div class="row align-items-center">
          <div class="col-2" style="padding: 0;">
            <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
          </div>
          <div class="col-10">
            <b-card-text class="text-left" style="color:#F56C6C">对图像进行增强处理</b-card-text>
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
            <img :src="originalImageUrl0" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px">
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="originalImageUrl1" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px">
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;margin-right: 2vw">
            <img :src="originalImageUrl2" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px">
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="originalImageUrl3" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px">
          </div>
        </div>
        <div style="float:left;">
          <img src="../assets/jiantou.png" style="width: 5vw; height: 5vw;margin-left: 3vw;margin-right: 3vw;margin-top: 10vw">
        </div>
        <div style="width: 30vw; height: 25vw; float:left; position:relative;">
          <div style="float: left; width: 12.5vw; height: 14vw;margin-right: 2vw">
            <img :src="finishedImageUrl0" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[0]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[0]">
            </vue-loading>
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="finishedImageUrl1" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[1]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[1]">
            </vue-loading>
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;margin-right: 2vw">
            <img :src="finishedImageUrl2" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[2]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[2]">
            </vue-loading>
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="finishedImageUrl3" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[3]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[3]">
            </vue-loading>
          </div>
        </div>
        <!--        </div>-->
      </div>
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'

export default {
  name: 'Stage3',
  props: [
    'allData',
    'stageUrl'
  ],
  mounted () {
    this.baseUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[2]
    this.preUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[1]
    console.log(this.baseUrl)
    console.log(this.preUrl)
    console.log(this.allData)
    this.originalImageUrl0 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-pansharpen-0-g-r.png'
    this.originalImageUrl1 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-pansharpen-1-g-r.png'
    this.originalImageUrl2 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-pansharpen-2-g-r.png'
    this.originalImageUrl3 = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-pansharpen-3-g-r.png'

    this.dealData()

    let base = this
    this.timer = setInterval(function () {
      base.loadEnhanceImage(base.stageUrl)
    }, 5000)
  },
  destroyed () {
    clearInterval(this.timer)
  },
  data () {
    return {
      stageShow: this.stageShowThree,
      stageData: this.allData,
      progress: 0,
      originalImageUrl0: '',
      originalImageUrl1: '',
      originalImageUrl2: '',
      originalImageUrl3: '',
      finishedImageUrl0: '',
      finishedImageUrl1: '',
      finishedImageUrl2: '',
      finishedImageUrl3: '',
      complete: false,
      initialImageShow: [false, false, false, false]
    }
  },
  methods: {
    dealData () {
      let len = this.allData.length
      if (len >= 3) {
        this.progress = parseInt(this.allData[2]['progress'])
      }
    },
    loadEnhanceImage (url) {
      this.runInPromise(url, '0')
      this.runInPromise(url, '1')
      this.runInPromise(url, '2')
      this.runInPromise(url, '3')
    },
    runInPromise (url, index) {
      let base = this
      this.loadImage(base, url, 'imgen', index).then(
        result => base.setImagePath(base, url, 'imgen', index),
        function (error) {
          base.$set(base.initialImageShow, parseInt(index), true)
          console.log(error)
        }
      )
    },
    setImagePath (base, url, stage, index) {
      let urlImage = base.baseUrl + '/' + url + '/' + url + '-' + stage + '-' + index + '-g-r.png'
      base.$set(base.initialImageShow, parseInt(index), false)
      switch (index) {
        case '0':
          base.finishedImageUrl0 = urlImage
          break
        case '1':
          base.finishedImageUrl1 = urlImage
          break
        case '2':
          base.finishedImageUrl2 = urlImage
          break
        case '3':
          base.finishedImageUrl3 = urlImage
          break
      }
    },
    loadImage (base, url, stage, index) {
      let p = new Promise(function (resolve, reject) {
        let urlPath = base.baseUrl + '/' + url + '/' + url + '-' + stage + '-' + index + '-g-r.png'
        let imgObj = new Image()
        imgObj.onload = function () {
          if (this.complete === true) {
            resolve()
          }
        }
        imgObj.onerror = function () {
          console.log('load fail')
          reject(new Error())
        }
        imgObj.src = urlPath
      })
      return p
    }
  },
  watch: {
    stageShowThree (val) {
      this.stageShow = val
    },
    // 监听数据变化
    allData: {
      handler (nv, ov) {
        this.dealData()
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
