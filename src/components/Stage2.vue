<template>
  <div class="detail">
      <div class="container" style="width: 50%;margin-left: 0">
        <div class="row align-items-center">
          <div class="col-2" style="padding: 0;">
            <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
          </div>
          <div class="col-10">
            <b-card-text class="text-left" style="color:#F56C6C">对图像进行矫正与融合</b-card-text>
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
        <div style="float:left;">
          <img id = "start" :src="originalImageUrl" style="width: 25vw; height: 25vw; float: left">
        </div>
        <div style="float:left;">
          <img src="../assets/jiantou.png" style="width: 5vw; height: 5vw;margin-left: 3vw;margin-right: 3vw;margin-top: 10vw">
        </div>
        <div style="width: 30vw; height: 30vw; float:left; position:relative;">
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="finishedImageUrl0" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[0]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[0]">
            </vue-loading>
<!--            <p style="margin: 0">子任务1</p>-->
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="finishedImageUrl1" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[1]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[1]">
            </vue-loading>
<!--            <p style="margin: 0">子任务2</p>-->
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
          <img :src="finishedImageUrl2" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[2]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[2]">
            </vue-loading>
<!--            <p style="margin: 0">子任务3</p>-->
          </div>
          <div style="float: left; width: 12.5vw; height: 14vw;">
            <img :src="finishedImageUrl3" style="width: 12vw; height: 12vw; border: solid #4c43ff 2px" v-if="!initialImageShow[3]">
            <vue-loading type="bubbles" color="#d9544e" :size="{ width: '12vw', height: '12vw' }" style="border: solid #4c43ff 2px" v-if="initialImageShow[3]">
            </vue-loading>
<!--            <p style="margin: 0">子任务4</p>-->
          </div>
        </div>
<!--        </div>-->
      </div>
  </div>
</template>

<script>
import myStropheConn from '../api/Xmpp'
export default {
  name: 'Stage2',
  props: {
    allData: {
      type: Array,
      require: true
    },
    stageUrl: {
      type: String,
      require: true
    }
  },
  mounted () {
    this.baseUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[1]
    this.preUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[0]
    console.log(this)
    this.originalImageUrl = this.preUrl + '/' + this.stageUrl + '/' + this.stageUrl + '-MSS2.png'
    this.dealData()
    let base = this
    this.timer = setInterval(function () {
      base.loadMergeImage(base.stageUrl)
    }, 5000)
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    dealData () {
      let len = this.allData.length
      if (len >= 2) {
        this.progress = this.allData[1]['progress']
      }
    },
    loadMergeImage (url) {
      this.runInPromise(url, '0')
      this.runInPromise(url, '1')
      this.runInPromise(url, '2')
      this.runInPromise(url, '3')
    },
    runInPromise (url, index) {
      let base = this
      this.loadImage(base, url, 'pansharpen', index, true).then(
        result => base.setImagePath(base, url, 'pansharpen', index, true),
        function (error) {
          console.log(error)
          base.loadImage(base, url, 'pansharpen-r', index).then(
            result => base.setImagePath(base, url, 'pansharpen-r', index),
            function (error) {
              console.log(error)
              base.loadImage(base, url, 'MSS2-r', index).then(
                result => base.setImagePath(base, url, 'MSS2-r', index),
                function (error) {
                  console.log('set ' + index + ' to be true')
                  console.log(parseInt(index))
                  base.$set(base.initialImageShow, parseInt(index), true)
                  console.log(error)
                }
              )
            }
          )
        }
      )
    },
    setImagePath (base, url, stage, index, finalRes) {
      console.log('set image')
      let urlImage = base.baseUrl + '/' + url + '/' + url + '-' + stage + '-' + index + '.png'
      if (finalRes) {
        urlImage = base.baseUrl + '/' + url + '/' + url + '-' + stage + '-' + index + '-g-r.png'
      }
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
    loadImage (base, url, stage, index, finalRes = false) {
      let p = new Promise(function (resolve, reject) {
        let urlPath = base.baseUrl + '/' + url + '/' + url + '-' + stage + '-' + index + '.png'
        if (finalRes) {
          urlPath = base.baseUrl + '/' + url + '/' + url + '-' + stage + '-' + index + '-g-r.png'
        }
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
  data () {
    return {
      progress: 0,
      originalImageUrl: '',
      finishedImageUrl0: '',
      finishedImageUrl1: '',
      finishedImageUrl2: '',
      finishedImageUrl3: '',
      complete: false,
      initialImageShow: [false, false, false, false]
    }
  },
  watch: {
    // 监听数据变化
    allData: {
      handler (nv, ov) {
        console.log('handle data')
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
