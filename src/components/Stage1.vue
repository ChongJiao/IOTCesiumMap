<template>
  <div class="detail">
    <div v-if="stageShow">
    <div class="container" style="width: 50%;margin-left: 0">
      <div class="row align-items-center">
        <div class="col-2" style="padding: 0;">
          <el-button type="primary" plain style="padding: 0.5vh;border: none; margin-left: 1vh">说明：</el-button>
        </div>
        <div class="col-10">
          <b-card-text class="text-left" style="color:#F56C6C">对图像进行预处理</b-card-text>
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
      <img id = "start" :src="this.startCompleteUrl" style="width: 25vw; height: 25vw">
      <img src="../assets/jiantou.png" style="width: 5vw; height: 5vw">
      <img v-if="complete" id="end" :src="this.finishedCompleteUrl" style="width: 25vw; height: 25vw">
      <el-progress v-if="!complete" type="circle" :percentage="this.progress"></el-progress>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stage1',
  props: ['allData', 'stageShowOne'],
  mounted () {
  },
  data () {
    return {
      stageShow: this.stageShowOne,
      stageData: this.allData,
      progress: 0,
      baseUrl: 'http://127.0.0.1:8000/GFData',
      startCompleteUrl: '',
      finishedCompleteUrl: '',
      complete: false
    }
  },
  watch: {
    stageShowOne (val) {
      this.stageShow = val
    },
    // 深度监听数据变化，实时更新
    allData: {
      handler (nv, ov) {
        for (let i = 0; i < this.allData.length; i++) {
          this.stageData[i] = this.allData[i]
          // console.log(this.stageData[i])
        }
        let len = this.stageData.length
        if (len >= 1) {
          this.progress = this.stageData[0]['progress']
          let url = this.stageData[0]['url']
          this.startCompleteUrl = this.baseUrl + '/' + url + '.png'
          if (this.stageData[0]['progress'] === 100) {
            this.complete = true
            // 去掉-g，相当于去掉最后两个字符
            this.finishedCompleteUrl = this.baseUrl + '/' + url.substring(0, url.length - 2) + '.png'
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
