<template>
  <div class="detail">
      <div class="container" style="width: 50%;margin-left: 0">
        <div class="row align-items-center">
          <div class="col-2" style="padding: 0;">
            <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
          </div>
          <div class="col-10">
            <b-card-text class="text-left" style="color:#F56C6C">图像目标识别</b-card-text>
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
        <div v-if="!complete" >
          <vue-loading type="spiningDubbles" color="#d9544e" :size="{ width: '20vw', height: '20vw' }">
          </vue-loading>
          <p style="font-size: 2vw">目标识别正在进行，请稍后......</p>
        </div>
        <div v-if="complete" >
          <p style="font-size: 1.5vw">已完成识别，请在地图中查看结果</p>
          <el-button @click="jumpToRes" type="primary">点击查看</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'

export default {
  name: 'Stage5',
  props: ['allData'],
  mounted () {
    this.baseUrl = myStropheConn.myStropheConn.httpServer + myStropheConn.myStropheConn.serverDirPath[4]
  },
  methods: {
    jumpToRes () {
      this.$router.push({
        name: 'CesiumMap',
        params: {
          type: 1,
          url: this.resUrl
        }
      })
    }
  },
  data () {
    return {
      stageShow: this.stageShowFive,
      stageData: this.allData,
      progress: 0,
      resUrl: '',
      complete: true
    }
  },
  watch: {
    stageShowFive (val) {
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
        if (len >= 5) {
          this.progress = this.stageData[4]['progress']
          let url = this.stageData[4]['url']
          this.startCompleteUrl = this.baseUrl + '/' + url + '.png'
          if (this.stageData[4]['progress'] === 100) {
            this.complete = true
            this.resUrl = url
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

</style>
