<template>
  <div class="Tbody">
  <div class="title">任务列表</div>
  <div v-for="(data, index) in taskSource" :key="index">
  <ProcessShowItem :processShowItem="data">

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
                  'url': '../assets/GF1_preProcess'
                },
                {
                  'processId': '3',
                  'processProgress': '100',
                  'url': '../assets/GF1_preProcess'
                },
                {
                  'processId': '4',
                  'processProgress': '100',
                  'url': '../assets/GF1_preProcess'
                }
              ]
          }
        ]
    }
    // console.log(replyJson)

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
      case 'stageProcess':
        let taskId = replyJson['taskId']
        let stageId = replyJson['stageId']
        if (stageId > this.taskSource.length) {
          let temp = this.taskSource[taskId - 1]['tasksStatus']
          let singleTaskStatus = {}
          // singleTaskStatus['processId'+processId.toString()]=processId.toString()//不同的阶段
          singleTaskStatus['processProgress'] = replyJson['process']
          singleTaskStatus['url'] = replyJson['url']
          temp.push(singleTaskStatus)
          this.taskSource[taskId - 1]['tasksStatus'] = temp
        } else {
          this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['processProgress'] = replyJson['process']
          this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['url'] = replyJson['url']
        }
        break
      case 'stageFinished':
        let taskFinishedId = replyJson['taskId']
        let stageFinishedId = replyJson['stageId']
        if (stageFinishedId > this.taskSource.length) {
          let temp = this.taskSource[taskFinishedId - 1]['tasksStatus']
          let singleTaskStatus = {}
          singleTaskStatus['processProgress'] = '100'
          singleTaskStatus['url'] = replyJson['url']
          temp.push(singleTaskStatus)
          this.taskSource[taskFinishedId - 1]['tasksStatus'] = temp
        } else {
          this.taskSource[taskFinishedId - 1]['tasksStatus'][stageFinishedId - 1]['processProgress'] = replyJson['100']
          this.taskSource[taskFinishedId - 1]['tasksStatus'][stageFinishedId - 1]['url'] = replyJson['url']
        }
        break
      default:
        break
    }
    // setTimeout(function () {
    //   if (!myStropheConn.myStropheConn.connFlag) {
    //     console.log('not login')
    //     myStropheConn.myStropheConn.connecting()
    //   }
    // }, 2000)
    // this.messageHandler = myStropheConn.myStropheConn.conn.addHandler(this.onMessage, null, 'message', null, null, null)
    // this.initQuery()
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
          // let replyJson = JSON.parse(msgContent)
          let replyJson = [{
            'type': 'taskList',
            'data':
              [
                {
                  'id': '1(代表任务的id)',
                  'name': 'GF1（代表处理的数据名称）',
                  'position': '武汉(代表影像位置)',
                  'taskStatus(备注：每个任务默认都是5个阶段,这里处理了几个阶段就返回几个，但是前端的显示中默认显示5个)':
                    [
                      {
                        'processId': '1（处理的阶段id）',
                        'processProgress': '100(100表示处理结束，0-100表示正在处理，)',
                        'url': '图像url地址（例如：imgSrcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-MSS2-0-g,默认传回的是原始的图片地址，如果progress是100的话，新的图片地址需要去掉-g)'
                      },
                      {
                        'processId': '2（处理的阶段id）',
                        'processProgress': '100(100表示处理结束，0-100表示正在处理，)',
                        'url': '图像url地址（例如：imgSrcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-MSS2-0-g,默认传回的是原始的图片地址，如果progress是100的话，新的图片地址需要去掉-g)'
                      },
                      {
                        '其他阶段信息,和上面一致，如果该阶段还没开始处理，则默认不传任何信息': ''
                      }
                    ]
                },
                {
                  '第二个任务内容，和上面的内容一致': ''
                }
              ]
          }]
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
              let taskId = replyJson['taskId']
              let stageId = replyJson['stageId']
              if (stageId > this.taskSource.length) {
                let temp = this.taskSource[taskId - 1]['tasksStatus']
                let singleTaskStatus = {}
                // singleTaskStatus['processId'+processId.toString()]=processId.toString()//不同的阶段
                singleTaskStatus['processProgress'] = replyJson['process']
                singleTaskStatus['url'] = replyJson['url']
                temp.push(singleTaskStatus)
                this.taskSource[taskId - 1]['tasksStatus'] = temp
              } else {
                this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['processProgress'] = replyJson['process']
                this.taskSource[taskId - 1]['tasksStatus'][stageId - 1]['url'] = replyJson['url']
              }
              break
            case 'stageFinished':
              let taskFinishedId = replyJson['taskId']
              let stageFinishedId = replyJson['stageId']
              if (stageFinishedId > this.taskSource.length) {
                let temp = this.taskSource[taskFinishedId - 1]['tasksStatus']
                let singleTaskStatus = {}
                singleTaskStatus['processProgress'] = '100'
                singleTaskStatus['url'] = replyJson['url']
                temp.push(singleTaskStatus)
                this.taskSource[taskFinishedId - 1]['tasksStatus'] = temp
              } else {
                this.taskSource[taskFinishedId - 1]['tasksStatus'][stageFinishedId - 1]['processProgress'] = replyJson['100']
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
