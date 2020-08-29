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
        <el-menu-item index="1-1">
          用户名: {{this.userName}}
        </el-menu-item>
        <el-menu-item index="1-2">
          域名: {{this.userDomain}}
        </el-menu-item>
        <el-menu-item index="1-3" @click="Logout">
          登出
        </el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">资源中心</template>
        <el-menu-item index="2-1" @click="openWindow($event, 0)">资源列表</el-menu-item>
        <el-menu-item index="2-2" @click="openWindow($event, 1)">订阅列表</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">任务中心</template>
        <el-menu-item index="3-1" @click="openWindow($event, 2)">任务列表</el-menu-item>
        <el-menu-item index="3-2" @click="openWindow($event, 3)">任务生成</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" v-on:click="requestInOutNet">{{NetStatus}}</el-menu-item>
    </el-menu>
    <div class="toolBox" v-if="showFlag[3]">
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
  <div class = "info-window" v-if="showFlag[0]">
    <el-button icon="el-icon-error" size ="small" type="danger" class="close-info-window" @click="closeWindow(0)">关闭</el-button>
    <p style="color: #e5f2fe;">资源列表</p>
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
                       prop="resourceId"
                       label="序号"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="resourceName"
                       style="border-style:solid;border-width:5px;"
                       label="资源名称"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="resourceLevel"
                       style="border-style:solid;border-width:5px;"
                       label="级别"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="fatherCode"
                       style="border-style:solid;border-width:5px;"
                       label="父编号"
                       min-width="30%">
      </el-table-column>
    </el-table>
    <el-button style="margin-top: 1vh" :class="this.selectSubResource.length > 0 ? 'select' : 'deselect'" v-on:click="requestSub">订阅</el-button>
    <el-button style="margin-top: 1vh" type="success" v-on:click="requestSource">资源获取</el-button>
  </div>
<!--订阅列表-->
  <div class = "info-window" v-if="showFlag[1]">
    <el-button icon="el-icon-error" size ="small" type="danger" class="close-info-window" @click="closeWindow(1)">关闭</el-button>
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
                       prop="resourceId"
                       label="序号"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="resourceName"
                       style="border-style:solid;border-width:5px;"
                       label="资源名称"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="resourceLevel"
                       style="border-style:solid;border-width:5px;"
                       label="级别"
                       min-width="30%">
      </el-table-column>
      <el-table-column align="center"
                       prop="fatherCode"
                       style="border-style:solid;border-width:5px;"
                       label="父编号"
                       min-width="30%">
      </el-table-column>
    </el-table>
    <el-button style="margin-top: 1vh" :class="this.selectUnSubResource.length > 0 ? 'select' : 'deselect'" v-on:click="requestUnSub">取消订阅</el-button>
  </div>
<!--任务列表-->
  <div class = "info-window" v-if="showFlag[2]">
    <el-button icon="el-icon-error" size ="small" type="danger" class="close-info-window" @click="closeWindow(2)">关闭</el-button>
    <TaskContent v-on:workOnMap="ViewMapResults">
    </TaskContent>
  </div>
<!--  任务信息表格-->
  <div class = "info-window" v-if="showTaskDetailTable">
    <el-form ref="taskForm" :model="taskForm" label-width="calc(100px + .5vw)">
      <el-form-item label="中心经度" class="label-item">
        <el-input v-model="taskForm.longitude"></el-input>
      </el-form-item>
      <el-form-item label="中心纬度">
        <el-input v-model="taskForm.latitude"></el-input>
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
          <el-time-picker placeholder="选择时间" v-model="taskForm.startTime" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="taskForm.endDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="taskForm.endTime" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="regionTaskMake">立即创建</el-button>
        <el-button @click="closeTaskTable">取消</el-button>
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
    if (!this.$xmpp.connFlag) {
      console.log('not login')
      let name = this.$xmpp.getCookie('userCode')
      let password = this.$xmpp.getCookie('password')
      let domain = this.$xmpp.getCookie('domain')
      if (name !== null && password !== null && domain !== null) {
        this.$xmpp.conn.connect(name + '@' + domain, password, this.connectedCallback)
      } else {
        this.$router.push({name: 'Login'})
      }
    } else {
      this.userName = this.$xmpp.userCode
      this.userDomain = this.$xmpp.domain
      console.log('has login')
      this.init()
    }
  },
  // destroyed () {
  //   console.log('Cesium destroyed')
  //   if (this.$xmpp.conn != null && this.messageHandler !== undefined) {
  //     this.$xmpp.conn.deleteHandler(this.messageHandler)
  //     console.log('delete message handler')
  //   }
  // },
  data () {
    return {
      userName: '',
      userDomain: '',
      showFlag: [false, false, false, false],
      showTaskDetailTable: false,
      alpha: 1,
      brightness: 1,
      contrast: 1,
      imageryProvider: {},
      bmKey: 'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-',
      Cesium: null,
      viewer: null,
      resourceItems: [{
        resourceId: '3',
        resourceName: '黄石',
        resourceLevel: '0',
        fatherCode: '2'
      }, {
        resourceId: '4',
        resourceName: '大冶',
        resourceLevel: '0',
        fatherCode: '2'
      },
      {
        resourceId: '5',
        resourceName: '西安',
        resourceLevel: '0',
        fatherCode: '2'
      }],
      tileUrl0: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl1: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl2: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl3: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      baseMapUrl: 'http://192.168.100.125:8000/BaseMap',
      showTileMap: false,
      taskList: [],
      NetStatus: '申请入网',
      subResource: [],
      selectSubResource: [],
      selectUnSubResource: [],
      taskForm: {
        latitude: '',
        longitude: '',
        width: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        period: '',
        desc: ''
      }
    }
  },
  methods: {
    init () {
      // 初始化相关内容
      // TODO 从数据库中获取订阅的资源列表到 变量 subResource（list）
      let base = this
      // 获取用户入网状态 passed
      this.$http.getUserNetStatus(this.$xmpp.userCode).then(result => {
        if (result === 1) {
          base.NetStatus = '申请退网'
        } else {
          base.NetStatus = '申请入网'
        }
      }).catch((reason) => {
        base.NetStatus = '用户异常'
        console.log(reason)
      })
      // 获取订阅资源列表 pass
      this.$http.getUserSubResourceList(this.$xmpp.userCode).then((result) => {
        console.log(result)
        this.subResource = result
      }).catch((reason) => {
        console.log(reason)
      })
      base.messageHandler = base.$xmpp.conn.addHandler(base.onMessage, null, 'message', null, null, null)

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
      } else {
        this.$refs.handlerPolygon.clear()
        this.viewer.entities.removeAll()
        this.viewer.scene.requestRender()
        span.innerText = '绘制'
        i.className = 'el-icon-thumb'
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
      // TODO 获得中心经纬度以及幅宽
      let t = this.$refs.handlerPolygon.polylines[0].positions
      let positions = JSON.parse(JSON.stringify(t))
      positions = positions.splice(0, positions.length - 1)
      if (positions.length <= 2) {
        this.$message('请绘制正确矩形')
        return
      }
      console.log('position length ' + positions.length)
      let centerLng = 0
      let centerLat = 0
      this.posList = []
      let maxLng = -180
      let minLng = 180
      for (let index in positions) {
        let pos = this.Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions[index])
        let lng = this.Cesium.Math.toDegrees(pos.longitude)
        let lat = this.Cesium.Math.toDegrees(pos.latitude)
        maxLng = maxLng > lng ? maxLng : lng
        minLng = minLng < lng ? minLng : lng
        centerLat += lat
        centerLng += lng
        this.posList.push(lat)
        this.posList.push(lng)
      }
      centerLat /= positions.length
      centerLng /= positions.length
      // console.log('max lng ' + maxLng)
      // console.log('min lng ' + minLng)
      // console.log('centerLat ' + Math.abs(centerLat))
      // console.log('centerLat ' + Math.abs(centerLat))
      let width = (maxLng - minLng) * 110 * 1000 * Math.cos((Math.abs(centerLat) / 180) * Math.PI)
      width = parseInt(width)
      // console.log(width)
      this.taskForm.width = width
      this.taskForm.latitude = centerLat
      this.taskForm.longitude = centerLng
      this.showTaskDetailTable = true
    },
    closeTaskTable () {
      this.showTaskDetailTable = false
    },
    getTimeFormat (date, time) {
      let timeFormat = '{0}-{1}-{2} {3}:{4}:{5}'
      let timeString = String.format(timeFormat, date.getFullYear(), date.getMonth() + 1, date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds())
      return timeString
    },
    regionTaskMake () {
      // 采集需求 XMPP部分
      let date = new Date(this.taskForm.startDate)
      let time = new Date(this.taskForm.startTime)
      let beginTime = this.getTimeFormat(date, time)
      date = new Date(this.taskForm.endDate)
      time = new Date(this.taskForm.endTime)
      let endTime = this.getTimeFormat(date, time)
      let msgContent = '{"typeid": 21106, "usercode":"{0}", ' +
        '"latitude": "{1}", "longitude": "{2}", ' +
        '"width": "{3}", ' +
        '"begintime": "{4}", "endtime": "{5}",' +
        '"period": {6}, "capturearea": "{7}"}'
      msgContent = String.format(msgContent,
        this.$xmpp.userCode, this.taskForm.lat, this.taskForm.lng, this.taskForm.width,
        beginTime, endTime, this.taskForm.period, JSON.stringify(this.posList))
      console.log(msgContent)
      this.$xmpp.SendMessage(msgContent)
      this.showTaskDetailTable = false
      this.clear()

      // http 测试 pass, 需要在消息的handle中添加
      // let date = new Date(this.taskForm.startDate)
      // let time = new Date(this.taskForm.startTime)
      // let beginTime = this.getTimeFormat(date, time)
      // date = new Date(this.taskForm.endDate)
      // time = new Date(this.taskForm.endTime)
      // let endTime = this.getTimeFormat(date, time)
      // let data = JSON.parse(JSON.stringify(this.taskForm))
      // delete data.startDate
      // delete data.startTime
      // delete data.endDate
      // delete data.endTime
      // data.beginTime = beginTime
      // data.endTime = endTime
      // data.captureArea = 'test test test'
      // data.taskId = '3'
      // data.status = '0'
      // this.$http.dealTask(data, this.$xmpp.userCode, 'new').then((result) => {
      //   this.$message('任务创建成功')
      // }).catch((reason) => {
      //   this.$message('任务创建失败')
      // })
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

        // let base = this
        // this.$http.setResourceSubscribe(this.selectSubResource, this.$xmpp.userCode, 'new').then((result) => {
        //   this.$message('订阅成功')
        //   // 更新页面订阅内容
        //   base.subResource = base.subResource.concat(base.selectSubResource)
        //   console.log(base.subResource)
        //   console.log(result)
        // }).catch((reason) => {
        //   this.$message('订阅失败')
        //   console.log(reason)
        // })
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

        // let base = this
        // this.$http.setResourceSubscribe(this.selectUnSubResource, this.$xmpp.userCode, 'delete').then((result) => {
        //   base.$message('退订成功')
        //   for (let i in base.selectUnSubResource) {
        //     let resourceId = base.selectUnSubResource[i].resourceId
        //     console.log(resourceId)
        //     for (let j in base.subResource) {
        //       console.log(base.subResource[j].resourceId)
        //       if (resourceId === base.subResource[j].resourceId) {
        //         console.log('remove')
        //         base.subResource.splice(j, 1)
        //         break
        //       }
        //     }
        //   }
        // }).catch((reason) => {
        //   // TODO 数据库中需要删除，这里是管控退订成功，但是数据库删除失败
        //   base.$message('退订失败')
        // })
      }
    },
    // 显示变量；0 为资源列表，1表示订阅列表，2表示任务列表，3表示任务工具
    openWindow (dom, index) {
      console.log(dom.$el)
      for (let i in this.showFlag) {
        if (this.showFlag[i] && i !== index.toString()) {
          console.log(dom.$el.classList)
          dom.$el.classList.remove('active')
          console.log(dom.$el.classList)
          this.$message('请先关闭当前窗口')
          return
        }
      }
      this.$set(this.showFlag, index, true)
    },
    // 关闭所有列表窗口
    closeWindow (index) {
      this.$set(this.showFlag, index, false)
    },
    // 入网退网协议 pass
    handleRequestInOrOutNet (replyJson) {
      // TODO 数据库做相应更新
      let requestType = replyJson['requesttype']
      let result = replyJson['result']
      if (requestType === 1) {
        if (result === 1) {
          this.$http.setUserStatus(this.$xmpp.userCode, 1, this.$xmpp.userLongitude, this.$xmpp.userLatitude).then(result => {
            if (result === 'success') {
              this.$message('入网成功')
            }
            console.log(result)
          }).catch((reason) => {
            this.$message('本地入网记录失败！！！')
            console.log(reason)
          })
          this.NetStatus = '申请退网'
        } else {
          this.$message('管控入网失败，请重新入网')
        }
      } else {
        if (result === 1) {
          this.$http.setUserStatus(this.$xmpp.userCode, 0, this.$xmpp.userLongitude, this.$xmpp.userLatitude).then(result => {
            if (result === 'success') {
              this.$message('退网成功')
            }
            console.log(result)
          }).catch((reason) => {
            this.$message('本地退网失败！！！')
            console.log(reason)
          })
          this.NetStatus = '申请入网'
        } else {
          this.$message('管控退网失败，请重新退网')
        }
      }
    },
    // 资源订阅/退订协议 pass
    handleSubUnSubRequest (replyJson) {
      let requesttype = replyJson['requesttype']
      let result = replyJson['result']
      if (requesttype === 1) {
        if (result === 1) {
          this.$message('订阅成功')
          this.resourceTableShow = false
          console.log('sub resource is')
          console.log(this.subResource)
          // Fixed 在数据库中插入订阅的资源信息 selectSubResource pass
          let base = this
          this.$http.setResourceSubscribe(this.selectSubResource, this.$xmpp.userCode, 'new').then((result) => {
            this.$message('订阅成功')
            // 更新页面订阅内容
            base.subResource = base.subResource.concat(base.selectSubResource)
            console.log(base.subResource)
            console.log(result)
          }).catch((reason) => {
            this.$message('订阅失败')
            console.log(reason)
          })
        } else {
          // TODO 数据库中需要添加订阅，这里是管控订阅成功，但是数据库新增失败
          this.$message('订阅失败')
        }
      } else {
        if (result === 1) {
          // Fixed 在数据库中删除相应的 selectUnSubResource
          let base = this
          this.$http.setResourceSubscribe(this.selectUnSubResource, this.$xmpp.userCode, 'delete').then((result) => {
            base.$message('退订成功')
            for (let i in base.selectUnSubResource) {
              let resourceId = base.selectUnSubResource[i].resourceId
              console.log(resourceId)
              for (let j in base.subResource) {
                console.log(base.subResource[j].resourceId)
                if (resourceId === base.subResource[j].resourceId) {
                  console.log('remove')
                  base.subResource.splice(j, 1)
                  break
                }
              }
            }
          }).catch((reason) => {
            // TODO 数据库中需要删除，这里是管控退订成功，但是数据库删除失败
            base.$message('退订失败')
          })
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
          obj.resourceId = data[0]
          obj.resourceName = data[1]
          obj.resourceLevel = data[2]
          obj.fatherCode = data[3]
          console.log(obj)
          let find = false
          for (let i in this.subResource) {
            if (this.subResource[i].resourceId === data[0]) {
              find = true
              break
            }
          }
          if (!find) {
            this.resourceItems.push(obj)
          }
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
        // Fixed 完成任务新建测试
        let date = new Date(this.taskForm.startDate)
        let time = new Date(this.taskForm.startTime)
        let beginTime = this.getTimeFormat(date, time)
        date = new Date(this.taskForm.endDate)
        time = new Date(this.taskForm.endTime)
        let endTime = this.getTimeFormat(date, time)
        let data = JSON.parse(JSON.stringify(this.taskForm))
        delete data.startDate
        delete data.startTime
        delete data.endDate
        delete data.endTime
        data.beginTime = beginTime
        data.endTime = endTime
        data.captureArea = 'test test test'
        data.taskId = '3'
        data.status = '0'
        this.$http.dealTask(data, this.$xmpp.userCode, 'new').then((result) => {
          this.$message('任务创建成功')
        }).catch((reason) => {
          this.$message('任务创建失败')
        })
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
      // test passed
      let data = {}
      data.taskId = taskid
      data.status = '1'
      data.address = address
      this.$http.dealTask(data, this.$xmpp.userCode, 'update').then((result) => {
        this.$message('任务状态更新成功')
      }).catch((reason) => {
        this.$message('任务状态更新失败')
      })
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
            switch (typeId) { /// /收到管控回复的消息的有关处理
              case '12202':
                this.handleRequestInOrOutNet(replyJson) // 入网退网
                break
              case '21103':
                this.handleRequestResource(replyJson) // 显示所有资源
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
    },
    connectedCallback (status) {
      // 通过cookie缓存登陆
      console.log('connected function')
      console.log(status)
      switch (status) {
        case Strophe.Strophe.Status.CONNECTED:
          this.$message('登陆成功')
          this.$xmpp.connFlag = true
          // 首先要发送一个<presence>给服务器（initial presence）
          this.$xmpp.conn.send(Strophe.$pres().tree())

          let name = this.$xmpp.getCookie('userCode')
          let password = this.$xmpp.getCookie('password')
          let domain = this.$xmpp.getCookie('domain')
          this.userName = name
          this.userDomain = domain
          this.$xmpp.userCode = name
          this.$xmpp.password = password
          this.$xmpp.domain = domain
          console.log(this.$xmpp.userCode)
          this.init()
          break
        case Strophe.Strophe.Status.CONNECTING:
          console.log('正在登陆')
          break
        case Strophe.Strophe.Status.DISCONNECTING:
          this.$message('正在登出')
          break
        case Strophe.Strophe.Status.DISCONNECTED:
          this.$message('登出成功')
          this.$xmpp.connFlag = false
          this.$xmpp.delCookie('userCode')
          this.$xmpp.delCookie('password')
          this.$xmpp.delCookie('domain')
          this.$router.push({name: 'Login'})
          break
        default:
          this.$xmpp.connFlag = false
          this.$message('登陆失败')
          this.$router.push({name: 'Login'})
          break
      }
    },
    Logout () {
      this.$xmpp.disconnect('user disconnect')
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
  .close-info-window
  {
    position: absolute;
    right:1vw;
    top: 1vw;
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
