<template>
  <div>
    <div class="item-main">
      <div class="title">
          <div class="head-tag">
            {{dataName}}
          </div>
<!--          <el-link type="primary" class="tag-link">正在处理,点击查看详情</el-link>-->
<!--        从总列表跳转到详细界面，测试以下-->
        <el-link type="primary" class="tag-link" v-on:click="jumpToDetail()">正在处理,点击查看详情</el-link>
      </div>
      <div class="process-group">
        <div class="step-down">
          <img src="../assets/GF1_result.png" class="processIcon">
          <span class="after-process">数据预处理</span>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step-doing">
          <img src="../assets/GF1_preProcess.png" class="processIcon">
          <span class="pre-process">图像融合</span>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step-wait">
          <img src="../assets/GF1_preProcess.png" class="processIcon">
          <span class="pre-process">图像处理</span>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step-wait">
          <img src="../assets/GF1_preProcess.png" class="processIcon">
          <span class="pre-process">图像增强</span>
        </div>
        <img src="../assets/xiaojiantou.png" style="width: 3vw;">
        <div class="step-wait">
          <img src="../assets/GF1_preProcess.png" class="processIcon">
          <span class="pre-process">目标识别</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlowItem',
  data () {
    return {
      dataName: '高分一号'
    }
  },
  methods: {
    jumpToDetail () {
      this.$router.push({path: '/TaskDetail', query: {id: 1}})
    }
  }
}
</script>

<style scoped>
  .item-main{
    display: list-item;
    list-style: none;
    padding: 1vw;
  }
  .title{
    display: flex;
    width: 100%;
    margin-left: 1%;
  }
  .head-tag{
    width: 10vw;
    text-align: center;
    font-size:1.5vw;
    color: #2f2f2f;
    background-color: dodgerblue;
    /*color: aliceblue;*/
    font-family: 华光黑体_CNKI;
    border-radius: 1vw
  }
  .process-group{
    height: 10vh;
    padding: 5px;
    display: flex;
    justify-content: space-around;
  }
  .step-down{
    height: 10vh;
    width: 12vw;
    border-radius: 5px;
    border: solid #1a63f6;
    box-shadow: 8px 8px 5px #888888;
    display: inline-block;
    filter:brightness(100%);
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
  .step-wait{
    height: 10vh;
    width: 12vw;
    border-radius: 5px;
    border: solid;
    box-shadow: 8px 8px 5px #888888;
    display: inline-block;
    filter:brightness(10%);
  }
  .processIcon{
    width: 4vw;
    height: 4vw;
    display: block;
    float: left;
    padding: 0.4vw;
  }
  .pre-process{
    /*margin-top: -50px;*/
    margin-top: 2vh;
    margin-left: 3vw;
    display: block;
    color: crimson;
    font-family: 华光黑体_CNKI;
    font-size: 1.5vw;
  }
  .after-process{
    text-align: center;
    margin-top: 2vh;
    margin-left: 3vw;
    display: block;
    color: cornflowerblue;
    font-family: 华光黑体_CNKI;
    font-size: 1.5vw;
  }
  .tag-link{
    /*margin-left: 1vw;*/
    /*font-size: small*/
    margin-left: 1vw;
    font-size: 1.3vw;
    font-family: 华光隶书_CNKI;
  }
</style>
