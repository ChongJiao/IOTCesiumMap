<template>
  <div class="log">
    <h3> 消息日志 </h3>
    <el-divider></el-divider>
    <div class="log-content" id="log-tag">
      <div v-for="(item, i) in infoList" :key="i">
        <div class="content-row">
          <div class="msg-date">{{item.date}}</div>
          <div class="msg-content">{{item.content}}</div>
<!--        <el-button style="border: none;padding: 0" type="small">[{{item.type}}]</el-button>-->
<!--        <el-button style="border: none;padding: 0" type="small">{{item.date}}</el-button>-->
<!--        <el-button style="border: none" type="small">{{item.content}}</el-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Log',
  data () {
    return {
      infoList: []
    }
  },
  mounted () {
  },
  methods: {
    addLogInfo (content) {
      let date = new Date()
      let month = date.getMonth() + 1
      var dateStr = date.getFullYear() + '-' + month + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      var obj = {}
      obj['date'] = dateStr
      obj['content'] = content
      this.infoList.push(obj)
      setTimeout(function () {
        let div = document.getElementById('log-tag')
        div.scrollTop = div.scrollHeight
      }, 500)
    }
  }
}
</script>

<style scoped>
.log{
  color: #ffffff;
  padding: 2vh;
  position: absolute;
  z-index: 14;
  background-color: transparent;
  top: 67vh;
  left: 30vw;
  width: 40vw;
  display: inline-block;
  border-radius: 1rem ;
}

.log-content{
  margin-left: 1vw;
  text-align: left;
  overflow:scroll;
  height: 20vh;
}
.content-row {
  font-size: 1.5rem;
}
.msg-date{
  width: 40%;
  float: left;
}
.msg-content{
  width: 60%;
  float: left;
  color: #ff4d51;
}
::-webkit-scrollbar-track-piece {
  border-radius: 2px;
}

::-webkit-scrollbar-track-piece:hover {
  background-color: #fff;
  border-radius: 2px;
}

::-webkit-scrollbar {
  width: 0.1rem;
  height:0;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #00f5f5;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #ccc;
}
</style>
