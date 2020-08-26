<template>
<div>
  <div class="menu">
    <el-menu
      default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="0">
        <img src="../assets/logo.png" style="height: 80%"/>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">用户中心</template>
        <el-menu-item index="1">
          用户名: {{this.$xmpp.userJID}}
        </el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">资源中心</template>
        <el-menu-item index="2-1" @click="showResource">资源列表</el-menu-item>
        <el-menu-item index="2-2" @click="showSubResource">订阅列表</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">任务中心</template>
        <el-menu-item index="3-1" @click="showTask">任务列表</el-menu-item>
        <el-menu-item index="3-2" @click="generateTask">任务生成</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" v-on:click="requestInOutNet">{{NetStatus}}</el-menu-item>
    </el-menu>
    <div class="toolBox" v-if="showTaskTools">
<!--      <div id = "polygon" class= "toolDeSelect">-->
<!--        <img class = "toolIcon" src="../assets/tool_Polygon.png">-->
<!--      </div>-->
      <el-button id="draw" icon="el-icon-thumb" v-on:click="toggle('handlerPolygon')">绘制</el-button>
<!--      <el-button type="primary" icon="el-icon-delete" v-on:click="clear">清除</el-button>-->
      <el-button type="danger" icon="el-icon-search" v-on:click="MakeTask">生成</el-button>
    </div>
  </div>
  <div class="viewer">
    <vc-viewer ref="viewer" @ready="ready">
<!--      <vc-layer-imagery :alpha="alpha" :imageryProvider="imageryProvider" :brightness="brightness" :contrast="contrast">-->
<!--      </vc-layer-imagery>-->
<!--      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast">-->
<!--        <vc-provider-imagery-tile-mapservice-->
<!--          :url="baseMapUrl"-->
<!--        ></vc-provider-imagery-tile-mapservice>-->
<!--      </vc-layer-imagery>-->
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl0"
          @readyPromise="imageryReady"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl1"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl2"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl3"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-handler-draw-polygon
        :clampToGround="true"
        ref="handlerPolygon"
        @activeEvt="activeEvt"
        @movingEvt="movingEvt"
        @drawEvt="drawEvt"
      ></vc-handler-draw-polygon>
    </vc-viewer>
  </div>
<!--  资源列表-->
  <div class = "info-window" v-if="resourceTableShow">
    <p style="color: #e5f2fe">资源列表</p>
    <el-table
      :row-style="{width:'100%'}"
      :data="resourceItems"
      border
      @selection-change="handleSubSelectChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center"
                       prop="id"
                       label="序号"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="name"
                       style="border-style:solid;border-width:5px;"
                       label="资源名称"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="level"
                       style="border-style:solid;border-width:5px;"
                       label="级别"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="fathercode"
                       style="border-style:solid;border-width:5px;"
                       label="父编号"
                       min-width="30%">
      </el-table-column>
    </el-table>
    <el-button style="margin-top: 1vh" :class="this.selectSubResource.length > 0 ? 'select' : 'deselect'" v-on:click="requestSub">订阅</el-button>
    <el-button style="margin-top: 1vh" type="success" v-on:click="requestSource">资源获取</el-button>
  </div>
<!--订阅列表-->
  <div class = "info-window" v-if="subResourceTableShow">
    <p style="color: #e5f2fe">订阅列表</p>
    <el-table
      :row-style="{width:'100%'}"
      :data="subResource"
      border
      @selection-change="handleUnSubSelectChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center"
                       prop="id"
                       label="序号"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="name"
                       style="border-style:solid;border-width:5px;"
                       label="资源名称"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="level"
                       style="border-style:solid;border-width:5px;"
                       label="级别"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="fathercode"
                       style="border-style:solid;border-width:5px;"
                       label="父编号"
                       min-width="30%">
      </el-table-column>
    </el-table>
    <el-button style="margin-top: 1vh" :class="this.selectUnSubResource.length > 0 ? 'select' : 'deselect'" v-on:click="requestUnSub">取消订阅</el-button>
  </div>
<!--任务列表-->
  <div class = "info-window" v-if="showTaskTable">
    <TaskContent v-on:workOnMap="ViewMapResults"></TaskContent>
  </div>
<!--  任务信息表格-->
  <div class = "info-window" v-if="showTaskDetailTable">
    <el-form ref="taskForm" :model="taskForm" label-width="calc(100px + .5vw)">
      <el-form-item label="中心经度" class="label-item">
        <el-input v-model="taskForm.lng"></el-input>
      </el-form-item>
      <el-form-item label="中心纬度">
        <el-input v-model="taskForm.lat"></el-input>
      </el-form-item>
      <el-form-item label="采集幅宽">
        <el-input v-model="taskForm.width"></el-input>
      </el-form-item>
      <el-form-item label="采集周期">
        <el-input v-model="taskForm.period"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="taskForm.startDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="taskForm.endDate" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="taskForm.startDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="taskForm.endDate" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="regionTaskMake">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>

import Strophe from 'strophe.js'
import RightItem from './RightItem'
import TaskContent from './TaskContent'

export default {
  name: 'CesiumMap',
  components: {TaskContent, RightItem},
  // 状态信息添加在本地
  mounted () {
    // TODO 从数据库中获取订阅的资源列表到 变量 subResource（list）
    console.log('Cesium mounted')
    console.log(this.$xmpp)
    let base = this
    setTimeout(function () {
      if (!base.$xmpp.connFlag) {
        console.log('not login')
        // base.$xmpp.normalConnnected()
        setTimeout(function () {
          base.messageHandler = base.$xmpp.conn.addHandler(base.onMessage, null, 'message', null, null, null)
          // myStropheConn.myStropheConn.RequestInOrOutToNet(1)
        }, 2000)
      } else {
        console.log('has login')
        base.messageHandler = base.$xmpp.conn.addHandler(base.onMessage, null, 'message', null, null, null)
        // myStropheConn.myStropheConn.RequestInOrOutToNet(1)
      }
    }, 2000)

    // 获取路由参数
    console.log('路由参数为')
    let type = this.$route.params.type
    if (type === 'result') {
      // 在地图中显示结果
      let url = this.$route.params.url
      let tileData = this.$xmpp.serverDirPath[3]
      this.tileUrl0 = this.$xmpp.httpServer + tileData + '/' + url + '/' + url + '-tiles-' + '0'
      this.tileUrl1 = this.$xmpp.httpServer + tileData + '/' + url + '/' + url + '-tiles-' + '1'
      this.tileUrl2 = this.$xmpp.httpServer + tileData + '/' + url + '/' + url + '-tiles-' + '2'
      this.tileUrl3 = this.$xmpp.httpServer + tileData + '/' + url + '/' + url + '-tiles-' + '3'
      console.log('展示瓦片地图为' + this.tileUrl0 + ' ' + this.tileUrl1 + ' ' + this.tileUrl2 + ' ' + this.tileUrl3)
      this.showTileMap = true
    }
  },
  destroyed () {
    console.log('Cesium destroyed')
    if (this.$xmpp.conn != null) this.$xmpp.conn.deleteHandler(this.messageHandler)
  },
  data () {
    return {
      showTaskTable: false,
      showTaskDetailTable: false,
      showTaskTools: false,
      alpha: 1,
      brightness: 1,
      contrast: 1,
      imageryProvider: {},
      bmKey: 'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-',
      Cesium: null,
      viewer: null,
      resourceItems: [],
      tileUrl0: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl1: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl2: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl3: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      baseMapUrl: 'http://192.168.100.125:8000/BaseMap',
      showTileMap: false,
      taskList: [],
      NetStatus: '申请入网',
      resourceTableShow: false,
      subResourceTableShow: false,
      subResource: [],
      selectSubResource: [],
      selectUnSubResource: [],
      taskForm: {
        lat: '',
        lng: '',
        width: '',
        startDate: '',
        endDate: '',
        period: '',
        desc: ''
      }
    }
  },
  methods: {
    logout () {

    },
    handleOpen () {
      this.isCollapse = !this.isCollapse
    },
    ViewMapResults (url) {
      // 可视化结果
      console.log(url)
    },
    ready (cesiumInstance) {
      const {Cesium, viewer} = cesiumInstance
      viewer.scene.requestRenderMode = true
      // viewer.scene.maximumRenderTimeChange = Infinity
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      viewer.scene.globe.depthTestAgainstTerrain = true
      this.imageryProvider = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.streets'
      })
      this.Cesium = Cesium
      // this.tooltip = new Cesium.createTooltip(viewer.cesiumWidget.container)
      this.viewer = viewer
    },
    toggle (type) {
      this.$refs[type].drawing = !this.$refs[type].drawing

      let div = document.getElementById('draw')
      let i = div.getElementsByTagName('i')[0]
      let span = div.getElementsByTagName('span')[0]

      let name = span.innerText
      if (name === '绘制') {
        span.innerText = '取消'
        i.className = 'el-icon-circle-close'
        // let pol = document.getElementById('polygon')
        // pol.className = 'toolSelect'
        // 新增shape 实体
        // this.polygonShape = this.addPolygonEntity()
      } else {
        this.$refs.handlerPolygon.clear()
        this.viewer.entities.removeAll()
        this.viewer.scene.requestRender()

        span.innerText = '绘制'
        i.className = 'el-icon-thumb'
        let pol = document.getElementById('polygon')
        pol.className = 'toolDeSelect'
      }
    },
    clear () {
      this.$refs.handlerPolygon.clear()
      this.viewer.entities.removeAll()
      this.viewer.scene.requestRender()
      // this.$refs['handlerPolygon'].drawing = !this.$refs['handlerPolygon'].drawing
    },
    activeEvt (_) {
      this[_.type] = _.isActive
    },
    movingEvt (windowPosition) {
      // this.tooltip.showAt(windowPosition, '<p>左键绘制, 右键结束绘制.</p>')
    },
    drawEvt (result) {
      // result.finished && this.tooltip.setVisible(false)
      // console.log(result)
    },
    MakeTask () {
      // this.regionTaskMake()
      this.showTaskDetailTable = true
    },
    regionTaskMake (beginTime = ' ', endTime = ' ', period = 1) {
      // 采集需求
      // let positions = this.$refs.handlerPolygon.polylines[0].positions
      // let centerLng = 0
      // let centerLat = 0
      // let posList = []
      // for (let index in positions) {
      //   let pos = this.Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions[index])
      //   let lng = this.Cesium.Math.toDegrees(pos.longitude)
      //   let lat = this.Cesium.Math.toDegrees(pos.latitude)
      //   centerLat += lat
      //   centerLng += lng
      //   posList.push([lat, lng])
      // }
      // centerLat /= positions.length
      // centerLng /= positions.length
      beginTime = ''
      endTime = ''
      let centerLat = '33.2333'
      let centerLng = '92.456'
      let msgContent = '{"typeid": 21106, "usercode":"{0}", ' +
        '"latitude": "{1}", "longitude": "{2}", ' +
        '"width": "{3}", ' +
        '"begintime": "{4}", "endtime": "{5}",' +
        '"period": {6}, "capturearea": "{7}"}'
      msgContent = String.format(msgContent,
        this.$xmpp.userCode, centerLat, centerLng, 4000,
        beginTime, endTime, period, JSON.stringify([30.6552, 113.672, 30.5877, 114.045, 30.2668, 113.966, 30.3343, 113.594]))
      console.log(msgContent)
      this.$xmpp.SendMessage(msgContent)
      this.showTaskDetailTable = false
      this.clear()
    },
    // cesium加载瓦片触发函数
    imageryReady (imageryProvider) {
      this.viewer.camera.flyTo({destination: imageryProvider.rectangle})
    },
    // 资源请求
    requestSource () {
      this.$xmpp.RequestReSource()
    },
    // 入网退网请求
    requestInOutNet () {
      if (this.NetStatus === '入网') {
        this.$xmpp.RequestInOrOutToNet(1)
      } else {
        this.$xmpp.RequestInOrOutToNet(0)
      }
    },
    // 资源订阅请求
    requestSub () {
      if (this.selectSubResource.length > 0) {
        let items = []
        for (let i in this.selectSubResource) {
          items.push(this.selectSubResource[i].id)
        }
        this.$xmpp.ResourceSubUnSub(1, items)
        // TODO 将items的信息插入数据库
      }
    },
    // 资源退订请求
    requestUnSub () {
      if (this.selectUnSubResource.length > 0) {
        let items = []
        for (let i in this.selectUnSubResource) {
          items.push(this.selectUnSubResource[i].id)
        }
        this.$xmpp.ResourceSubUnSub(0, items)
      }
    },
    // 显示
    generateTask () {
      this.showTaskTools = !this.showTaskTools
    },
    // 展示任务列表
    showTask () {
      this.showTaskTable = !this.showTaskTable
    },
    // 资源列表展示
    showResource () {
      this.resourceTableShow = !this.resourceTableShow
    },
    // 订阅列表展示
    showSubResource () {
      this.subResourceTableShow = !this.subResourceTableShow
    },
    // 入网退网协议 pass
    handleRequestInOrOutNet (replyJson) {
      // TODO 数据库做相应更新
      let requestType = replyJson['requesttype']
      let result = replyJson['result']
      if (requestType === 1) {
        if (result === 1) {
          alert('入网成功！！！')
          this.NetStatus = '退网'
        } else {
          alert('入网失败，请重新入网')
        }
      } else {
        if (result === 1) {
          alert('退网成功！！！')
          this.NetStatus = '入网'
        } else {
          alert('退网失败，请重新入网')
        }
      }
    },
    // 资源订阅/退订协议 pass
    handleSubUnSubRequest (replyJson) {
      let requesttype = replyJson['requesttype']
      let result = replyJson['result']
      if (requesttype === 1) {
        if (result === 1) {
          alert('订阅成功')
          this.resourceTableShow = false
          this.subResource = this.selectSubResource
          console.log('sub resource is')
          console.log(this.subResource)
        } else {
          alert('订阅失败')
        }
      } else {
        if (result === 1) {
          alert('退订成功')
          // TODO 在数据库中删除相应的selectUnSubResource
          for (let i in this.selectUnSubResource) {
            let id = this.selectUnSubResource[i].id
            console.log(id)
            for (let j in this.subResource) {
              console.log(this.subResource[j].id)
              if (id === this.subResource[j].id) {
                console.log('remove')
                this.subResource.splice(j, 1)
                break
              }
            }
          }
        } else { alert('退订失败') }
      }
    },
    // 资源查询协议 pass
    handleRequestResource (replyJson) {
      // let usercode = replyJson['usercode']
      console.log(replyJson)
      let type = replyJson['type']
      this.items = []
      if (type === 'result') {
        let resourcelist = replyJson['resourcelist']
        for (let i in resourcelist) {
          let content = resourcelist[i]
          let data = content.split(',')
          let obj = Object()
          obj.id = data[0]
          obj.name = data[1]
          obj.level = data[2]
          obj.fathercode = data[3]
          console.log(obj)
          this.resourceItems.push(obj)
        }
      }
    },
    // 新建处理任务响应  pass
    handleMakeTask (replyJson) {
      let taskId = replyJson['taskid']
      let result = replyJson['result']
      if (result === 1) {
        alert('创建任务成功')
        // TODO 页面中进行更新任务列表
        this.clear()
        this.taskList.push(taskId)
        // TODO 新建任务到数据库中
      } else {
        alert('创建任务失败')
      }
    },
    handleTaskFinished (replyJson) {
      let taskid = replyJson['taskid']
      let address = replyJson['address']
      alert('success task is ' + taskid)
      alert('the address is ' + address)
      this.$xmpp.replyFinished(taskid, address)
    },
    handleStatus (replyJson) {
      console.log('状态查询')
      this.$xmpp.replyStatus()
    },
    handleCheckStatus (replyJson) {
      let result = replyJson['result']
      if (result === 0) {
        this.NetStatus = '入网'
      }
    },
    onMessage (msg) {
      console.log('Cesium Message')
      let fromJid = msg.getAttribute('from')
      let index = fromJid.indexOf('/')
      fromJid = fromJid.substr(0, index)
      console.log(fromJid)
      if (fromJid !== this.$xmpp.gkName) {
        console.log('发送方非管控中心，无法读取数据')
      } else {
        let type = msg.getAttribute('type')
        let elems = msg.getElementsByTagName('body')
        if (type === 'chat' && elems.length > 0) {
          let msgContent = Strophe.Strophe.getText(elems[0])
          msgContent = msgContent.replace(/&apos;/g, '"')
          msgContent = msgContent.replace(/&quot;/g, '"')
          if (this.$xmpp.isJsonStr(msgContent)) {
            let replyJson = JSON.parse(msgContent)
            console.log(replyJson)
            let typeId = replyJson['typeid']
            switch (typeId) {
              case '12202':
                this.handleRequestInOrOutNet(replyJson)
                break
              case '21103':
                this.handleRequestResource(replyJson)
                break
              case '12205':
                this.handleSubUnSubRequest(replyJson)
                break
              case '12207':
                this.handleMakeTask(replyJson)
                break
              case '12211':
                this.handleTaskFinished(replyJson)
                break
              case '12114':
                this.handleStatus()
                break
              case '1202':
                this.handleCheckStatus(replyJson)
                break
              default:
                break
            }
          }
        }
      }
      return true
    },
    addRegionResults: function (dataJson) {
      // let addShape = null
      for (let index in dataJson) {
        let data = dataJson[index]
        let pos = data['pos']
        pos = pos.substr(1, pos.length - 1)

        let tmp = {}
        tmp['url'] = data['url']
        tmp['name'] = data['satellite']
        tmp['pos'] = data['position']
        this.dataSource.push(tmp)
        let positionCartesians = []
        pos = pos.split(',')
        for (let i = 0; i < pos.length; i += 2) {
          let lat = parseFloat(pos[i])
          let lng = parseFloat(pos[i + 1])
          let pt = this.Cesium.Cartesian3.fromDegrees(lng, lat, 0)
          positionCartesians.push(pt)
        }
        console.log(positionCartesians)
        this.viewer.entities.add({
          polygon: {
            hierarchy: positionCartesians,
            material: new this.Cesium.ColorMaterialProperty(this.Cesium.Color.YELLOW.withAlpha(0.4))
          }
        })
      }
      // if (addShape != null) {
      //   this.viewer.camera.flyTo({addShape})
      // }
    },
    handleSubSelectChange (val) {
      this.selectSubResource = val
    },
    handleUnSubSelectChange (val) {
      this.selectUnSubResource = val
    }
  }
}
</script>
<style scoped>
  .menu{
    width:100%;
    position:absolute;
    top:0;
    z-index:15;
  }
  .viewer {
    position: absolute;
    top:0;
    left:0;
    width: 100vw;
    height: 100vh;
    z-index: 12;
  }
  .toolBox {
    padding: 0.2vw;
    float: right;
    border-radius: 0.5vh;
    display: inline-block;
    background-color: #2f2f2f;
  }
  .toolSelect{
    float:left;
    width: 3vw;
    height: 3vw;
    filter:brightness(100%);
  }
  .toolDeSelect{
    width: 3vw;
    height: 3vw;
    float: left;
    filter:brightness(70%);
  }
  .toolIcon {
    width: 3vw;
    height: 3vw;
  }
  .rightList{
    width: 5vw;
    position: absolute;
    border-radius: 0.5vh;
    right: 3vw;
    z-index: 15;
    background-color: #dfebee;
    list-style: none;
    font-size: 1vw;
  }
  .re1{
    top: 10vh;
  }
  .re2{
    top: 15vh
  }
  .info-window{
    z-index: 20;
    position: absolute;
    padding: 1vw;
    top:20vh;
    width: 60vw;
    left: 20vw;
    display: inline-block;
    background-color: #336699;
  }
  .task{
    z-index: 20;
    position: absolute;
    padding: 1vw;
    top:20vw;
    width:80vw;
    left: 10vw;
    display: inline-block;
    background-color: #336699;
  }
  .select{
    background-color: orange;
  }
  .deselect{
    background-color: #999999;
  }
</style>
<style>
  .label-item,.el-form-item__label {
    font-size: calc(12px + .5vw);
    color: #CCCCFF;
    font-family: Serif;
  }
</style>
