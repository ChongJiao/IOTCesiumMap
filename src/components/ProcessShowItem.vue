<template>
  <div id="body">
<!--    <top></top>-->
<!--    <left></left>-->
<!--    <div class="return">-->
<!--      <img v-bind src="../assets/return2.png" style="width: 30px; height: 30px;">-->
<!--    </div>-->
    <div class="main">
      <div class="gaofenDiv">{{progressShowItem.name}}</div>
      <div class="col-10">
            <el-progress:text-inside="true":stroke-width="26" :percentage="this.progress"></el-progress>
       </div>
      <div class="outerDiv">
        <div class="div1">
          <div class="imgDiv"><img :src="progressShowItem.tasksStatus[0].url" class="imgStyle"></div>
          <span class="nameSpan">数据预处理</span>
        </div>
        <img src="../assets/fengefu.png" style="width: 10px;">
        <div class="div1">
          <div class="imgDiv">
            <div style="transform:rotate(30deg)"><img :src="progressShowItem.tasksStatus[1].url" class="imgStyle">
            </div>
          </div>
          <span class="nameSpan" >几何矫正与融合</span>
        </div>
        <img src="../assets/fengefu.png" style="width: 10px;">
        <div class="div1">
          <div class="imgDiv">
            <div style="transform:rotate(30deg)"><img :src="progressShowItem.tasksStatus[2].url" class="imgStyle"></div></div>
          <span class="nameSpan">图像增强去云去雾</span>
        </div>
        <img src="../assets/fengefu.png" style="width: 10px;">
        <div class="div1">
          <div class="imgDiv">
            <div style="transform:rotate(30deg)"><img :src="progressShowItem.tasksStatus[3].url" class="imgStyle"></div></div>
          <span class="nameSpan">图像目标识别</span>
        </div>
        <div style="width: 15%">
          <img :src="button_finished" style="margin-top:20px;width: 70px;height: 35px">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import top from './top.vue'
//import left from './left.vue'
export default {
  name: 'ProcessShowItem',
  props:
    [progressShowItem],
    /*task_id:{
      type:String,
      default:''
    },
    url0:{
      type:String,
      default:''
    },
    url1:{
      type:String,
      default:''
    },
    url2:{
      type:String,
      default:''
    },
    url3:{
      type:String,
      default:''
    },
    processProgress0:
    {
    type:String,
      default:''
    },
    processProgress1:
    {
    type:String,
      default:''
    },
    processProgress2:
    {
    type:String,
      default:''
    },
    processProgress3:
    {
    type:String,
      default:''
    }*/
  mounted ()
  {
    let len=progressShowItem.tasksStatus.length
    this.progress=progressShowItem.taskStatus[len-1].processProgress
  },
 // components: {top, left},
  data () {
    return {
      progress: 0,
      button_finished:require("../assets/yiwancheng.png")
      // dataName: '高分1号',
      // dataProcessNote: '对原始图像进行预处理等',
      // // dataProcessNote: "正在进行几何矫正，请稍后。。。",
      // information: false
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .main{
    border: solid 1px;
    border-color: gray;
  }
  .return{
    margin-left: -65%;
    margin-top: -5vh;
  }
  #header{
    height: 2vh;
  }
  .gaofenDiv{
    margin-top:5px;
    margin-left:5px ;
    background-image: url(../assets/gaofen.png);
    background-position:left;
    background-repeat:no-repeat;
    color: white;
    padding-left:20px;
    text-align: left;
    font-weight: bold;

  }
  .outerDiv{
    padding: 0 5px 5px 5px;
    display: flex;
    justify-content: space-around;
  }
  .div1{
    width: 20%;
    //overflow: auto;
    border: solid 1px grey;
    display: inline-block;
  }
  .imgDiv{
    border-bottom: solid 1px grey;
    width: 50px;
    margin:10px;
    /*transform:rotate(30deg)*/
  }
  .imgStyle{
    width: 50px;
    height: 50px;
    display: block;
    margin-bottom: 10px;
  }
  .nameSpan{
    margin-top: -50px;
    margin-left: 70px;
    display: block;
    font-size: 14px;
  }
</style>

