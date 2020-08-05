<!--<template>-->
<!--  <div class="Tbody">-->
<!--    <div class="title">任务列表</div>-->
<!--    <div v-for="(data, index) in taskSource" :key="index">-->
<!--&lt;!&ndash;      <ProcessShowItem :processShowItem="data">&ndash;&gt;-->
<!--&lt;!&ndash;        <ProcessShowItem :task_id="data.task_id" :task_name="data.task_name" :processProgress0="data.processProgress0" :processProgress1="data.processProgress1" :&ndash;&gt;-->
<!--&lt;!&ndash;        processProgress2="data.processProgress2" :processProgress3="data.processProgress3" :url0="data.url0" :url1="data.url1":url2="data.url2" :url3="data.url3">&ndash;&gt;-->
<!--&lt;!&ndash;          &ndash;&gt;-->
<!--&lt;!&ndash;        </ProcessShowItem>&ndash;&gt;-->
<!--    </div>-->
<!--  &lt;!&ndash;  <div class="title">任务列表</div>-->
<!--    <ProcessShowItem class="item"></ProcessShowItem>&ndash;&gt;-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import myStropheConn from '../api/Connection'-->
<!--import Strophe from 'strophe.js'-->
<!--import ProcessShowItem from './ProcessShowItem'-->
<!--export default {-->
<!--  name: 'ProcessShow',-->
<!--  components: {ProcessShowItem},-->
<!--  mounted () {-->
<!--    console.log('Cesium mounted')-->
<!--    setTimeout(function () {-->
<!--      if (!myStropheConn.myStropheConn.connFlag) {-->
<!--        console.log('not login')-->
<!--        myStropheConn.myStropheConn.connecting()-->
<!--      }-->
<!--    }, 2000)-->
<!--    this.messageHandler = myStropheConn.myStropheConn.conn.addHandler(this.onMessage, null, 'message', null, null, null)-->
<!--    this.initQuery()-->
<!--  },-->
<!--  destroyed () {-->
<!--    console.log('Cesium destroyed')-->
<!--    myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)-->
<!--  },-->
<!--  data () {-->
<!--    return {-->
<!--      tasks_len: 0,-->
<!--      taskSource: [{'task_id': '1', 'url0': require('../assets/GF1_preProcess.png'), 'url1': require('../assets/GF1_preProcess.png'), 'url2': require('../assets/GF1_result.png'), 'url3': require('../assets/GF1_result.png')}]-->
<!--    }-->
<!--  },-->
<!--  methods: {-->

<!--    initQuery () {-->
<!--      let msgContent = '{\'type\':\'queryTask\',\'userJID\':\'{0}\'}'-->
<!--      msgContent = String.format(msgContent, myStropheConn.myStropheConn.userJID)-->
<!--      myStropheConn.myStropheConn.SendMessage(msgContent)-->
<!--    },-->
<!--    onMessage (msg) {-->
<!--      console.log('all tasks process got')-->
<!--      let type = msg.getAttribute('type')-->
<!--      let elems = msg.getElementsByTagName('body')-->
<!--      if (type === 'chat' && elems.length > 0) {-->
<!--        let msgContent = Strophe.getText(elems[0])-->
<!--        msgContent = msgContent.replace(/&apos;/g, '"')-->
<!--        msgContent = msgContent.replace(/&quot;/g, '"')-->
<!--        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {-->
<!--          let replyJson = JSON.parse(msgContent)-->
<!--          switch (replyJson['type']) {-->
<!--            case 'taskList':-->
<!--              console.log(JSON.parse(replyJson['data']))-->
<!--              let tasks = JSON.parse(replyJson['data'])-->
<!--              tasks_len = tasks.length-->
<!--              for (let index in tasks) {-->
<!--                let task_data = tasks[index]-->
<!--                let tmp = {}-->
<!--                tmp['id'] = task_data['id']-->
<!--                tmp['name'] = task_data['name']-->
<!--                tmp['position'] = task_data['position']-->
<!--                let taskStatus = task_data['taskStatus']-->
<!--                tmp['tasksStatus'] = []-->
<!--                for (let index_step in taskStatus) {-->
<!--                  let singleTaskStatus = {}-->

<!--                  // let processId=taskStatus[index_step]['processId']-->
<!--                  // processId-=1-->
<!--                  // singleTaskStatus[processId.toString()]=processId.toString()//不同的阶段-->
<!--                  singleTaskStatus['processProgress'] = taskStatus[index_step]['processProgress']-->
<!--                  singleTaskStatus['url'] = taskStatus[index_step]['url']-->
<!--                  // if(singleTaskStatus['processProgress'+processId.toString()]=="100")-->
<!--                  // {-->

<!--                  // }-->
<!--                  tmp['tasksStatus'].push(singleTaskStatus)-->
<!--                }-->

<!--                // tmp['taskStatus']=taskStatus-->
<!--                this.taskSource.push(tmp)-->
<!--              }-->
<!--              break-->
<!--            case 'stageProcess':-->
<!--              let taskId = replyJson['taskId']-->
<!--              let stageId = replyJson['stageId']-->
<!--              if (stageId > taskSource.length) {-->
<!--                let temp = this.taskSource[taskId - 1]['tasksStatus']-->
<!--                singleTaskStatus = {}-->
<!--                // singleTaskStatus['processId'+processId.toString()]=processId.toString()//不同的阶段-->
<!--                singleTaskStatus['processProgress'] = replyJson['process']-->
<!--                singleTaskStatus['url'] = replyJson['url']-->
<!--                temp.push(singleTaskStatus)-->
<!--              } else {-->
<!--                taskSource[taskId - 1]['tasksStatus'][stageId - 1]['processProgress'] = replyJson['process']-->
<!--                taskSource[taskId - 1]['tasksStatus'][stageId - 1]['url'] = replyJson['url']-->
<!--              }-->
<!--              break-->
<!--            case 'stageFinished':-->
<!--              let taskFinishedId = replyJson['taskId']-->
<!--              let stageFinishedId = replyJson['stageId']-->
<!--              if (stageId > taskSource.length) {-->
<!--                temp = this.taskSource[taskId - 1]['tasksStatus']-->
<!--                singleTaskStatus = {}-->
<!--                singleTaskStatus['processProgress'] = '100'-->
<!--                singleTaskStatus['url'] = replyJson['url']-->
<!--                temp.push(singleTaskStatus)-->
<!--                temp.push(singleTaskStatus)-->
<!--              } else {-->
<!--                taskSource[taskId - 1]['tasksStatus'][stageId - 1]['processProgress'] = replyJson['100']-->
<!--                taskSource[taskId - 1]['tasksStatus'][stageId - 1]['url'] = replyJson['url']-->
<!--              }-->
<!--              break-->
<!--            default:-->
<!--              break-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--      return true-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--  .Tbody{-->
<!--    margin-left: 10vw;-->
<!--    width: 90vw;-->
<!--  }-->
<!--  .title{-->
<!--    width: 80vw;-->
<!--    font-family: 华光黑体_CNKI;-->
<!--    font-size: 3vw;-->
<!--  }-->
<!--  .item{-->
<!--    margin: auto;-->
<!--    width: 80vw;-->
<!--    border-radius: 5px;-->
<!--    border: solid;-->
<!--  }-->
<!--</style>-->
