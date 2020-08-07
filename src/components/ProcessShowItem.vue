<template>
  <div id="body">
<!--    <top></top>-->
<!--    <left></left>-->
<!--    <div class="return">-->
<!--      <img v-bind src="../assets/return2.png" style="width: 30px; height: 30px;">-->
<!--    </div>-->
    <div class="main">
      <div class="gaofenDiv">{{processShowItem.name}}</div>
      <div class="col-3" tyle="margin-top: 19vh;margin-bottom: 10vh">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="this.progress"></el-progress>
       </div>
      <div class="outerDiv">
        <div class="div1">
          <div class="imgDiv"><img :src="url[0]" class="imgStyle"></div>
          <span class="nameSpan">数据预处理</span>
        </div>
        <img src="../assets/fengefu.png" style="width: 10px;">
        <div class="div1">
          <div class="imgDiv">
            <div style="transform:rotate(30deg)"><img :src="url[1]" class="imgStyle">
            </div>
          </div>
          <span class="nameSpan" >几何矫正与融合</span>
        </div>
        <img src="../assets/fengefu.png" style="width: 10px;">
        <div class="div1">
          <div class="imgDiv">
            <div style="transform:rotate(30deg)"><img :src="url[2]" class="imgStyle"></div></div>
          <span class="nameSpan">图像增强去云去雾</span>
        </div>
        <img src="../assets/fengefu.png" style="width: 10px;">
        <div class="div1">
          <div class="imgDiv">
            <div style="transform:rotate(30deg)"><img :src="url[3]" class="imgStyle"></div></div>
          <span class="nameSpan">图像目标识别</span>
        </div>
        <div class="div1">
          <div class="imgDiv">
            <div style="transform:rotate(30deg)"><img :src="url[4]" class="imgStyle"></div></div>
          <span class="nameSpan">图像目标识别</span>
        </div>
        <div style="width: 15%">
          <img v-if="complete" src="../assets/yiwancheng.png" sstyle="margin-top:20px;width: 70px;height: 35px">
        </div>
        <div style="width: 15%">
          <img v-if="!complete"  src="../assets/jinxingzhong.png" style="margin-top:40vm;width: 8vm;height: 4vm">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import top from './top.vue'
// import left from './left.vue'
export default {
  name: 'ProcessShowItem',
  props:
    ['processShowItem','task_state'],
  /* task_id:{
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
    } */
  mounted () {
    let len = this.processShowItem.tasksStatus.length
    for (let index in this.processShowItem.tasksStatus) {
      this.url[index] = this.processShowItem.tasksStatus[index].url
    }
    //  console.log(len+"edghfjsdgfdj")
    console.log(this.processShowItem.tasksStatus[len - 1].url)
    // console.log(this.processShowItem.tasksStatus[len-1].processProgress)

    this.progress = parseInt(this.processShowItem.tasksStatus[len - 1].processProgress)
    // console.log('5786586')
    // console.log(this.progress)
  },
  // components: {top, left},
  data () {
    return {
      progress: 0,
      one_task_state:this.task_state,
      url: ['', '', '', '', ''],
      button_finished: require('../assets/yiwancheng.png'),
      complete: false
      // dataName: '高分1号',
      // dataProcessNote: '对原始图像进行预处理等',
      // // dataProcessNote: "正在进行几何矫正，请稍后。。。",
      // information: false
    }
  },
  watch:{
  task_state:{
  handler(nv,ov)
  {
    let len_single_task=this.task_state.length
    console.log("666")
   console.log("666")
    for(let i=0;i<len_single_task;i++)
    {
      this.url[i]=this.task_state[i].url
      // this.startCompleteUrl = this.baseUrl + '/' + url + '.png'
      // if (this.stageData[4]['progress'] === 100) {
      //   this.complete = true
      //   // 去掉-g，相当于去掉最后两个字符
      //   this.finishedCompleteUrl = this.baseUrl + '/' + url.substring(0, url.length - 2) + '.png'
      // } else {
      //   this.complete = false
      // }
    }
    console.log("666")
    this.progress=parseInt(this.task_state[len_single_task-1].progress)
    console.log(this.progress)
    if(len_single_task>=5&&this.progress===100)this.complete=true
  },
  deep:true
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
