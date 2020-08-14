<template>
  <div class="RightItem">
    <div class="content">
      <div class="position">{{id}}</div>
      <div class="position">{{name}}</div>
      <div class="position">{{level}}</div>
      <div class="position">{{fathercode}}</div>
    </div>
<!--    <div class="button">-->
<!--      <el-button type="primary" style="padding: 0.5vw; margin-left: 0.5vw;margin-top: 2vh;" icon="el-icon-s-operation" @click="newTask">处理</el-button>-->
<!--    </div>-->
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'
export default {
  name: 'RightItem',
  props: {
    id: {
      type: String,
      default: '1'
    },
    name: {
      type: String,
      default: '武汉资源'
    },
    level: {
      type: String,
      default: '2'
    },
    fathercode: {
      type: String,
      default: '1'
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
  .content{
    width: 8vw;
    float: left;
    display: inline-block;
  }
  .position{
    text-align: center;
    font-size: 1vw;
    float: left;
    padding: 0.1vw;
  }
</style>
