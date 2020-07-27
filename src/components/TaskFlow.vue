<template>
  <div class="Tbody">
  <div class="title">任务列表</div>
  <div v-for="(data, index) in taskSource" :key="index">
        <ProcessShowItem :task_id="data.task_id" :url0="data.url0" :url1="data.url1":url2="data.url2" :url3="data.url3">
        </ProcessShowItem>
     </div>
  <!--  <div class="title">任务列表</div>
    <ProcessShowItem class="item"></ProcessShowItem>-->
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
//import FlowItem from './FlowItem'
import ProcessShowItem from './ProcessShowItem'
export default {
  name: 'ProcessShow',
  components: {ProcessShowItem},
   mounted () {
    console.log('Cesium mounted')
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
      }
    }, 2000)
    this.messageHandler = myStropheConn.myStropheConn.conn.addHandler(this.onMessage, null, 'message', null, null, null)
  },
  destroyed () {
    console.log('Cesium destroyed')
    myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)
  },
  data () {
    return {
      tasks_len:0,
      taskSource: [{'task_id':"1",'url0':require("../assets/GF1_preProcess.png"),'url1':require("../assets/GF1_preProcess.png"),'url2':require("../assets/GF1_result.png"),'url3':require("../assets/GF1_result.png")}]
    }
  },
  methods: {
   onMessage (msg) {
      console.log('all tasks process got')
      let type=msg.getAttribute('type')
      let elems=msg.getElementsByTagName('body')
      if(type==='chat'&&elems.length>0)
      {
       let msgContent=Strophe.getText(elems[0])
       msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')
        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          switch (replyJson['type']) {
           case 'TaskList':
              console.log(JSON.parse(replyJson['tasks']))
              let tasks=JSON.parse(replyJson['tasks'])
              tasks_len=tasks.length
              for (let index in tasks) {
                  let task_data = tasks[index]
                  let data=task_data['data']
                  let tmp = {}
                  tmp['id'] = task_data['id']
                  for (let index_step in data)
                  {
                     tmp['taskStatus'+index_step]=data[index_step]['taskStatus']
                     tmp['url'+index_step]=data[index_step]['url']
                  }

                  this.taskSource.push(tmp)
              }

              break
          }
      }
      }
      return true
    }
  }
}
</script>

<style scoped>
  .Tbody{
    margin-left: 10vw;
    width: 90vw;
  }
  .title{
    width: 80vw;
    font-family: 华光黑体_CNKI;
    font-size: 3vw;
  }
  .item{
    margin: auto;
    width: 80vw;
    border-radius: 5px;
    border: solid;
  }
</style>
