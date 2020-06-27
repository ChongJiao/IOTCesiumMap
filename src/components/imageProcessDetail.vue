<template>
  <div id="body">
    <top></top>
    <left></left>
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
          <span style="margin-top: -50px; margin-left: 40px; display: block; color: cornflowerblue">数据预处理</span><br>
          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small" v-on:click="showInformation">详情</el-link>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/sharpening.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block; color: crimson">图像融合</span><br>
          <!--          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small">详情</el-link>-->
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/imgProcess.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block; color: crimson">图像处理</span><br>
          <!--          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small">详情</el-link>-->
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/imgEnhence.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block; color: crimson">图像增强</span><br>
          <!--          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small">详情</el-link>-->
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 40px;">
        <div class="step1">
          <img src="../assets/object.png" style="width: 50px; height: 50px; display: block; padding: 10px">
          <span style="margin-top: -50px; margin-left: 40px; display: block; color: crimson">目标识别</span><br>
          <!--          <el-link type="primary" style="margin-top: -40px; margin-left: 30px; font-size: small">详情</el-link>-->
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
export default {
  name: 'imageProcessDetail',
  components: {top, left},
  data () {
    return {
      dataName: '高分1号',
      dataProcessNote: '对原始图像进行预处理等',
      // dataProcessNote: "正在进行几何矫正，请稍后。。。",
      information: false
    }
  },
  methods: {
    showInformation: function () {
      this.information = true
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
    margin-top: -5vh;
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
</style>
