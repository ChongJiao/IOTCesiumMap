<template>
  <div class="Tbody">
    <div class="title">任务列表</div>
    <div v-for="(data, index) in taskListContent" :key="index">
      <ProcessShowItem :processData="data">
      </ProcessShowItem>
    </div>
  <!--  <div class="title">任务列表</div>
    <ProcessShowItem class="item"></ProcessShowItem>-->
  </div>
</template>

<script>
import myStropheConn from '../api/Xmpp'
import Strophe from 'strophe.js'
// import FlowItem from './FlowItem'
import ProcessShowItem from './ProcessShowItem'
export default {
  name: 'ProcessShow',
  components: {ProcessShowItem},
  mounted () {
    // this.runIndex = 2
    // setInterval(function () {
    //   let progress = parseInt(base.taskListContent[1].taskStatus[base.runIndex].processProgress) + 10
    //   if (progress >= 100) {
    //     progress = 100
    //     if (base.taskListContent[1].taskStatus.length < 5) {
    //       base.taskListContent[1].taskStatus.push(base.taskListContent[1].taskStatus[2])
    //       base.runIndex += 1
    //       base.taskListContent[1].taskStatus[base.runIndex].processProgress = '10'
    //       base.taskListContent[1].taskStatus[base.runIndex - 1].processProgress = progress.toString()
    //     }taskStatus
    //   }
    //   base.taskListContent[1].taskStatus[base.runIndex].processProgress = progress.toString()
    // }, 5000)
    let base = this
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
        setTimeout(function () {
          base.messageHandler = myStropheConn.myStropheConn.conn.addHandler(base.onMessage, null, 'message', null, null, null)
          base.initQuery()
        }, 2000)
      } else {
        base.messageHandler = myStropheConn.myStropheConn.conn.addHandler(base.onMessage, null, 'message', null, null, null)
        base.initQuery()
      }
    }, 2000)
  },
  destroyed () {
    console.log('Cesium destroyed')
    myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)
  },
  data () {
    return {
      tasks_len: 0,
      taskListContent: []
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
        console.log(elems)
        let msgContent = Strophe.Strophe.getText(elems[0])
        msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')

        console.log(typeof msgContent)
        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          console.log(replyJson)
          switch (replyJson['type']) {
            case 'taskList':
              let tasks = replyJson['data']
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
                tmp['taskStatus'] = []
                for (let indexStep in taskStatus) {
                  let singleTaskStatus = {}
                  singleTaskStatus['processProgress'] = taskStatus[indexStep]['processProgress']
                  singleTaskStatus['url'] = taskStatus[indexStep]['url']
                  tmp['taskStatus'].push(singleTaskStatus)
                }
                this.taskListContent.push(tmp)
              }
              break
            case 'stageProcess':
              console.log('stageProcess')
              console.log(replyJson)
              let taskId = replyJson['taskId']
              let stageId = replyJson['stageId']
              if (stageId > this.taskListContent[taskId - 1]['taskStatus'].length) {
                let temp = this.taskListContent[taskId - 1]['taskStatus']
                let singleTaskStatus = {}
singleTaskStatus['processProgress'] = replyJson['progress']

                temp.push(singleTaskStatus)
                this.taskListContent[taskId - 1]['taskStatus'] = temp
              } else {
 				 this.taskListContent[taskId - 1].taskStatus[taskId - 1].url = replyJson['url']
              }
              console.log(this.taskListContent)
              break
            case 'stageFinished':
              console.log('stageFinished')
              console.log(replyJson)
              let taskFinishedId = replyJson['taskId']
              let stageFinishedId = replyJson['stageId']
              console.log(this.taskListContent)
              console.log(taskFinishedId)
              console.log(stageFinishedId)
              console.log(this.taskListContent[taskFinishedId - 1]['taskStatus'].length)
              if (stageFinishedId > this.taskListContent[taskFinishedId - 1]['taskStatus'].length) {
                let temp = this.taskListContent[taskFinishedId - 1]['taskStatus']
                let singleTaskStatus = {}
                singleTaskStatus['processProgress'] = '100'
                singleTaskStatus['url'] = replyJson['url']
                temp.push(singleTaskStatus)
                this.taskListContent[taskFinishedId - 1]['taskStatus'] = temp
              } else {
                let a = parseInt(this.taskListContent[taskFinishedId - 1].taskStatus[stageFinishedId - 1].processProgress)
                a += 1
                this.taskListContent[taskFinishedId - 1].taskStatus[stageFinishedId - 1].processProgress = a.toString()
                this.taskListContent[taskFinishedId - 1]['taskStatus'][stageFinishedId - 1]['url'] = replyJson['url']
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
