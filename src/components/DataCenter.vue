<template>
  <div class="Dbody">
    <h1 style="align-content: center;margin-top: 2vh">数据源中心</h1>
    <el-table
      :row-style="{height:'5vh'}"
      :cell-style="{padding:'0.5vw'}"
      :data="tableData"
      border
      style="width: 80vw;margin-left: 5vw;font-size: 1vw">
      <el-table-column align="center"
        prop="id"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column align="center"
        style="border-style:solid;border-width:5px;"
        label="卫星"
        width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>名称: {{ scope.row.satellite }}</p>
            <p>描述: {{ scope.row.text }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag style="font-size: 1vw">{{ scope.row.satellite }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center"
        prop="position"
        label="位置"
        width="160">
      </el-table-column>
      <el-table-column align="center"
        label="角点经纬度"
        width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos1[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos1[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="角点经纬度"
        width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos2[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos2[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="角点经纬度"
        width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos3[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos3[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="角点经纬度"
        width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos4[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos4[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="源图像"
        width="150">
        <template slot-scope="scope">
          <img :src="scope.row.url" style="width: 3vw" @click="toImageDetail(scope.$index, scope.row)"/>
<!--          <el-link :href=scope.row.url type="primary" style="font-size: 1vw">查看</el-link>-->
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="操作" width="300">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary"
                       @click="jumpToMap(scope.$index, scope.row)">地图位置</el-button>
            <el-button type="warning"
                       @click="newTask(scope.$index, scope.row)">图像处理</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
export default {
  name: 'DataCenter',
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    let base = this
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
      } else {
        base.initData()
        base.messageHandler = myStropheConn.myStropheConn.conn.addHandler(base.onMessage, null, 'message', null, null, null)
      }
    }, 2000)
    console.log('dataCenter mounted')
  },
  destroyed () {
    console.log('Task destroyed')
    myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)
  },
  methods: {
    initData () {
      let msgContent = '{\'type\': \'querySatellite\', \'userJID\': \'{0}\'}'
      msgContent = String.format(msgContent, myStropheConn.myStropheConn.userJID)
      myStropheConn.myStropheConn.SendMessage(msgContent)
    },
    onMessage (msg) {
      // 解析出<message>的from、type属性，以及body子元素
      // let fromJid = msg.getAttribute('from')
      // let toJid = msg.getAttribute('to')
      let type = msg.getAttribute('type')
      let elems = msg.getElementsByTagName('body')

      if (type === 'chat' && elems.length > 0) {
        let msgContent = Strophe.Strophe.getText(elems[0])
        msgContent = msgContent.replace(/&apos;/g, '"')
        msgContent = msgContent.replace(/&quot;/g, '"')
        if (myStropheConn.myStropheConn.isJsonStr(msgContent)) {
          let replyJson = JSON.parse(msgContent)
          if (replyJson['type'] && replyJson['type'] === 'satellite') {
            let dataList = replyJson['data']
            this.tableData = []
            for (let d in dataList) {
              let data = dataList[d]
              let posString = data['pos']
              posString = posString.slice(1, posString.length - 1)
              let posArray = posString.split(',')
              data['pos1'] = posArray.slice(0, 2)
              data['pos2'] = posArray.slice(2, 4)
              data['pos3'] = posArray.slice(4, 6)
              data['pos4'] = posArray.slice(6, 8)
              let srcData = myStropheConn.myStropheConn.srcData
              data['url'] = myStropheConn.myStropheConn.httpServer + srcData + '/' + data['url'] + '/' + data['url'] + '.jpg'
              this.tableData.push(data)
            }
          }
        }
      }
    },
    jumpToMap (index, row) {
      console.log(index, row)
    },
    newTask (index, row) {
      console.log(index, row)
      if (myStropheConn.myStropheConn.taskLength === 0) {
        myStropheConn.myStropheConn.MakeTask(this.imageUrl)
      } else {
        alert('请等待处理完当前任务')
      }
    },
    toImageDetail (index, row) {
      console.log(index, row)
      window.open(row['url'])
    }
  }

}
</script>
<style scoped>
.Dbody{
  margin-left: 10vw;
  width: 90vw;
}
</style>
