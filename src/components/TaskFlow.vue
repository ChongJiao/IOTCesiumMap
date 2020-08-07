<template>
  <div class="Tbody">
  <div class="title">任务列表</div>
  <div v-for="(data, index) in taskSource" :key="index">
  <ProcessShowItem :processShowItem="data" :task_state="data.tasksStatus">

        <!--<ProcessShowItem :task_id="data.task_id" :task_name="data.task_name" :processProgress0="data.processProgress0" :processProgress1="data.processProgress1" :
        //processProgress2="data.processProgress2" :processProgress3="data.processProgress3" :url0="data.url0" :url1="data.url1":url2="data.url2" :url3="data.url3">-->
        </ProcessShowItem>
     </div>
  <!--  <div class="title">任务列表</div>
    <ProcessShowItem class="item"></ProcessShowItem>-->
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
// import FlowItem from './FlowItem'
import ProcessShowItem from './ProcessShowItem'
export default {
  name: 'ProcessShow',
  components: {ProcessShowItem},
  mounted () {
    console.log('Cesium mounted')
    let replyJson = {
      'type': 'taskList',
      'data':
        [
          {
            'id': '1',
            'name': 'GF1',
            'position': '武汉',
            'taskStatus':
              [
                {
                  'processId': '1',
                  'processProgress': '100',
                  'url': 'http://192.168.100.125:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg'
                },
                {
                  'processId': '2',
                  'processProgress': '100',
                  'url': 'http://192.168.100.125:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg'
                },
                {
                  'processId': '3',
                  'processProgress': '100',
                  'url': 'http://192.168.100.125:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg'
                },
                {
                  'processId': '4',
                  'processProgress': '100',
                  'url': 'http://192.168.100.125:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg'
                }
              ]
          }
        ]
    }
    let replyJsonProcessed = {
      "type": "stageProcess",
      "taskId": 1,
      "stageId": 5,
      "process": "88"
    }
    let replyJsonFinished = {
      "type": "stageFinished",
      "taskId": 1,
      "stageId": 5,
      "url": "http://192.168.100.125:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg"
    }
    // console.log(replyJson)
    replyJson=replyJson
    switch (replyJson['type']) {
      case 'taskList':
     //   console.log(replyJson['data'])
        let tasks = replyJson['data']
      //  console.log(tasks)
        this.tasks_len = tasks.length
      //  console.log(this.tasks_len)
        for (let index in tasks) {
          // eslint-disable-next-line camelcase
          let task_data = tasks[index]
          //console.log(index)
          let tmp = {}
          tmp['id'] = task_data['id']
          tmp['name'] = task_data['name']
          tmp['position'] = task_data['position']
          let taskStatus = task_data['taskStatus']
         // console.log(taskStatus)
          tmp['tasksStatus'] = []
          // eslint-disable-next-line camelcase
          for (let index_step in taskStatus) {
            let singleTaskStatus = {}
           // console.log(index_step)
            // let processId=taskStatus[index_step]['processId']
            // processId-=1
            // singleTaskStatus[processId.toString()]=processId.toString()//不同的阶段
            // eslint-disable-next-line camelcase
            singleTaskStatus['processProgress'] = taskStatus[index_step]['processProgress']
            //console.log(singleTaskStatus['processProgress'])
            // eslint-disable-next-line camelcase
            singleTaskStatus['url'] = taskStatus[index_step]['url']
            //console.log(singleTaskStatus['url'])
            // if(singleTaskStatus['processProgress'+processId.toString()]=="100")
            // {

            // }
            tmp['tasksStatus'].push(singleTaskStatus)
          }

          // tmp['taskStatus']=taskStatus
          this.taskSource.push(tmp)
        }
       // console.log(this.taskSource)
        break
      default:
        break
    }
    replyJson=replyJsonProcessed
    console.log(replyJson)
    switch (replyJson['type']) {
      case 'stageProcess':
        console.log(replyJson)
        let taskId = replyJsonProcessed['taskId']
        let stageId = replyJsonProcessed['stageId']
        console.log(this.taskSource[taskId - 1]['tasksStatus'].length)
        console.log(stageId)
       // console.log(this.taskSource[taskId - 1]['tasksStatus'].length)
        if (stageId > this.taskSource[taskId - 1]['tasksStatus'].length) {
          console.log("dhfduifh")
          let temp = this.taskSource[taskId - 1]['tasksStatus']
          let singleTaskStatus = {}
          // singleTaskStatus['processId'+processId.toString()]=processId.toString()//不同的阶段
          singleTaskStatus['processProgress'] = replyJson['process']
          //  singleTaskStatus['url'] = replyJson['url']
          temp.push(singleTaskStatus)
          this.taskSource[taskId - 1]['tasksStatus'] = temp
        } else {
         // this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['processProgress'] = replyJson['process']
          //this.$set(this.showStageDetail, index, !this.showStageDetail[index])
          let tmp = this.taskSource[taskId - 1]
          tmp['tasksStatus'][stageId - 1]['processProgress'] = replyJson['process']
          console.log(temp)
          this.$set(this.taskSource, taskId - 1, tmp)
          console.log(this.taskSource)

          // this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['url'] = replyJson['url']
        }
        console.log(this.taskSource)
        break
      default:
        break
    }
    replyJson=replyJsonFinished
    switch (replyJson['type']) {
      case 'stageFinished':
        let taskFinishedId = replyJson['taskId']
        let stageFinishedId = replyJson['stageId']
        console.log(this.taskSource)
        console.log(taskFinishedId)
        console.log(stageFinishedId)
        console.log(this.taskSource[taskFinishedId - 1]['tasksStatus'].length)
        if (stageFinishedId > this.taskSource[taskFinishedId - 1]['tasksStatus'].length) {
          let temp = this.taskSource[taskFinishedId - 1]['tasksStatus']
          let singleTaskStatus = {}
          singleTaskStatus['processProgress'] = '100'
          singleTaskStatus['url'] = replyJson['url']
          temp.push(singleTaskStatus)
          this.taskSource[taskFinishedId - 1]['tasksStatus'] = temp
        } else {
          console.log("?????????????????")

        //  console.log(this.taskSource)
          let tmp_finish=this.taskSource[taskFinishedId-1]
        //   console.log(tmp_finish)
          tmp_finish['tasksStatus'][stageFinishedId-1]['processProgress']='100'
          // console.log(taskFinishedId)
          this.$set(this.taskSource,taskFinishedId-1,tmp_finish)
          console.log(this.taskSource)
          // this.taskSource[taskFinishedId - 1]['tasksStatus'][stageFinishedId - 1]['processProgress'] = '100'
          // this.taskSource[taskFinishedId - 1]['tasksStatus'][stageFinishedId - 1]['url'] = replyJson['url']
        }
        break
    }
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
      }
    }, 2000)
    this.messageHandler = myStropheConn.myStropheConn.conn.addHandler(this.onMessage, null, 'message', null, null, null)
    this.initQuery()
  },
  destroyed () {
    console.log('Cesium destroyed')
    myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)
  },
  data () {
    return {
      tasks_len: 0,

      taskSource: []// [{'task_id': '1', 'url0': require('../assets/GF1_preProcess.png'), 'url1': require('../assets/GF1_preProcess.png'), 'url2': require('../assets/GF1_result.png'), 'url3': require('../assets/GF1_result.png')}]
    }
  },
  methods: {

    initQuery () {
      let msgContent = '{\'type\':\'queryTask\',\'userJID\':\'{0}\'}'
      msgContent = String.format(msgContent, myStropheConn.myStropheConn.userJID)
      myStropheConn.myStropheConn.SendMessage(msgContent)
    },
    onMessage (msg) {
      console.log('all tasks process got')
      let type = msg.getAttribute('type')
      let elems = msg.getElementsByTagName('body')
      if (type === 'chat' && elems.length > 0) {
        let msgContent = Strophe.getText(elems[0])
        msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')
        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          switch (replyJson['type']) {
            case 'taskList':
              console.log(JSON.parse(replyJson['data']))
              let tasks = JSON.parse(replyJson['data'])
              this.tasks_len = tasks.length
              console.log(this.tasks_len)
              for (let index in tasks) {
                // eslint-disable-next-line camelcase
                let task_data = tasks[index]
                let tmp = {}
                tmp['id'] = task_data['id']
                tmp['name'] = task_data['name']
                tmp['position'] = task_data['position']
                let taskStatus = task_data['taskStatus']
                tmp['tasksStatus'] = []
                // eslint-disable-next-line camelcase
                for (let index_step in taskStatus) {
                  let singleTaskStatus = {}

                  // let processId=taskStatus[index_step]['processId']
                  // processId-=1
                  // singleTaskStatus[processId.toString()]=processId.toString()//不同的阶段
                  singleTaskStatus['processProgress'] = taskStatus[index_step]['processProgress']
                  singleTaskStatus['url'] = taskStatus[index_step]['url']
                  // if(singleTaskStatus['processProgress'+processId.toString()]=="100")
                  // {

                  // }
                  tmp['tasksStatus'].push(singleTaskStatus)
                }

                // tmp['taskStatus']=taskStatus
                this.taskSource.push(tmp)
              }
              break
            case 'stageProcess':
              console.log(replyJson)
              let taskId = replyJsonProcessed['taskId']
              let stageId = replyJsonProcessed['stageId']
              console.log(this.taskSource[taskId - 1]['tasksStatus'].length)
              console.log(stageId)
              if (stageId > this.taskSource[taskId - 1]['tasksStatus'].length) {
                console.log(taskId)
                let temp = this.taskSource[taskId - 1]['tasksStatus']
                let singleTaskStatus = {}
                // singleTaskStatus['processId'+processId.toString()]=processId.toString()//不同的阶段
                singleTaskStatus['processProgress'] = replyJson['process']
                //  singleTaskStatus['url'] = replyJson['url']
                temp.push(singleTaskStatus)
                this.taskSource[taskId - 1]['tasksStatus'] = temp
              } else {
                this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['processProgress'] = replyJson['process']
                // this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['url'] = replyJson['url']
              }
              break
            case 'stageFinished':
              let taskFinishedId = replyJson['taskId']
              let stageFinishedId = replyJson['stageId']
              if (stageFinishedId > this.taskSource[taskFinishedId - 1].length) {
                let temp = this.taskSource[taskFinishedId - 1]['tasksStatus']
                let singleTaskStatus = {}
                singleTaskStatus['processProgress'] = '100'
                singleTaskStatus['url'] = replyJson['url']
                temp.push(singleTaskStatus)
                this.taskSource[taskFinishedId - 1]['tasksStatus'] = temp
              } else {
                console.log("888")
                this.taskSource[taskFinishedId - 1]['tasksStatus'][stageFinishedId - 1]['processProgress'] = '100'
                this.taskSource[taskFinishedId - 1]['tasksStatus'][stageFinishedId - 1]['url'] = replyJson['url']
              }
              break
            default:
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
