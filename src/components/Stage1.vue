<template>
  <div class="detail">
    <div class="container" style="width: 50%;margin-left: 0">
        <div class="row align-items-center">
          <div class="col-2" style="padding: 0;">
            <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
          </div>
          <div class="col-10">
            <b-card-text class="text-left" style="color:#F56C6C">对图像数据进行预处理</b-card-text>
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
      <img id = "start" :src="originalImageUrl" style="width: 25vw; height: 25vw">
      <img src="../assets/jiantou.png" style="width: 5vw; height: 5vw">
      <img v-if="complete" id="end" :src="finishedImageUrl" style="width: 25vw; height: 25vw">
      <el-progress v-if="!complete" type="circle" :percentage="this.progress"></el-progress>
    </div>
  </div>
</template>

<script>
import myStropheConn from '../api/Xmpp'
export default {
  name: 'Stage1',
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
  data () {
    return {
      progress: 0,
      originalImageUrl: '',
      finishedImageUrl: '',
      complete: false,
      stropheConn: null
    }
  },
  mounted () {
    this.baseUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[0]
    this.originalImageUrl = this.baseUrl + '/' + this.stageUrl + '/' + this.stageUrl + '.jpg'
    this.dealData()
  },
  methods: {
    dealData () {
      let len = this.allData.length
      if (len >= 1) {
        this.progress = this.allData[0]['progress']
        let url = this.allData[0]['url']
        if (this.allData[0]['progress'] === 100) {
          this.complete = true
          // 去掉-g，相当于去掉最后两个字符
          this.finishedImageUrl = this.baseUrl + '/' + url + '/' + url + '-MSS2.png'
        } else {
          this.complete = false
        }
      }
    }
  },
  watch: {
    // 深度监听数据变化，实时更新
    allData: {
      handler (nv, ov) {
        console.log('handelData')
        this.dealData()
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
