<template>
  <div class="RightItem">
    <img class="image" src="../assets/GF1_result.png">
    <div class="content">
      <div class="name">{{name}}</div>
      <div class="position">{{position}}</div>
    </div>
    <div class="button">
      <el-button type="primary" style="padding: 0.5vw; margin-left: 0.5vw;margin-top: 2vh;" icon="el-icon-s-operation" @click="newTask">处理</el-button>
    </div>
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'
export default {
  name: 'RightItem',
  props: {
    imageUrl: {
      type: String,
      default: 'Test.png'
    },
    name: {
      type: String,
      default: '高分一号'
    },
    position: {
      type: String,
      default: '武汉'
    }
  },
  methods: {
    newTask () {
      if (myStropheConn.myStropheConn.taskLength === 0) {
        myStropheConn.myStropheConn.MakeTask(this.imageUrl)
      } else {
        alert('请等待处理完当前任务')
      }
    }
  }
}
</script>

<style scoped>
  .RightItem{
    /*margin: 0.5vw;*/
    display: inline-block;
    /*width: 100%;*/
    /*display: table-cell;*/
  }
  .image{
    margin-top: 0.5vh;
    width: 5vw;
    float: left;
    display: table-cell;
  }
  .content{
    width: 8vw;
    float: left;
    display: table-cell;
  }
  .name{
    font-size: 1.5vw;
  }
  .position{
    text-align: center;
    font-size: 1vw;
  }
  .button{
    width: 4vw;
    display: table-cell;
  }
</style>
