<template>
  <div class="log">
    <h3> 消息记录 </h3>
    <el-divider></el-divider>
    <div class="log-content" id="log-tag">
      <div v-for="(item, i) in infoList" :key="i">
        <el-button style="border: none;padding: 0" type="small">[{{item.type}}]</el-button>
        <el-button style="border: none;padding: 0" type="small">{{item.date}}</el-button>
        <el-button style="border: none" type="small">{{item.content}}</el-button>
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
      var dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      var obj = {}
      obj['type'] = '日志信息'
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
  padding: 2vh;
  position: absolute;
  z-index: 14;
  background-color: white;
  opacity: 0.8;
  top: 67vh;
  left: 30vw;
  width: 40vw;
  display: inline-block;
  border-radius: 1rem;
}
  .log-content{
    margin-left: 1vw;
    text-align: left;
    overflow:scroll;
    height: 20vh;
  }
</style>
