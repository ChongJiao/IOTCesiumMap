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
        <img src="../../assets/logo.png" style="height: 80%"/>
      </el-menu-item>
      <el-menu-item index="1" v-on:click="dealAllRequest('21101')">{{NetStatus}}</el-menu-item>
      <el-submenu index="2">
        <template slot="title">用户</template>
        <el-menu-item index="2-1">
          名称: {{this.userName}}
        </el-menu-item>
        <el-menu-item index="2-2">
          位置: {{this.posName}}
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">资源中心</template>
        <el-menu-item index="3-1" @click="openWindow($event, 0)">资源列表</el-menu-item>
        <el-menu-item index="3-2" @click="openWindow($event, 1)">订阅列表</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">任务中心</template>
        <el-menu-item index="4-1" @click="openWindow($event, 2)">任务列表</el-menu-item>
        <el-menu-item index="4-2" @click="openWindow($event, 3)">任务生成</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">信息展示</template>
        <el-menu-item index="5-1" @click="logFlag = !logFlag">日志窗口</el-menu-item>
        <el-menu-item index="5-2" @click="statisticFlag = !statisticFlag">信息统计</el-menu-item>
      </el-submenu>
      <el-menu-item index="7" @click="test">
        测试
      </el-menu-item>
      <el-menu-item index="6" @click="Logout" style="float: right">
        登出
      </el-menu-item>
    </el-menu>
<!--      <div class="title">中国航天技术研究院-天基用户端</div>-->
    <div class="toolBox" v-if="showFlag[3]">
      <el-button id="draw" icon="el-icon-thumb" v-on:click="toggle('handlerPolygon')">绘制</el-button>
      <el-button type="warning" icon="el-icon-search" v-on:click="MakeTask">生成</el-button>
      <el-button type="danger" icon="el-icon-close" v-on:click="closeWindow(3)">关闭</el-button>
    </div>
  </div>
  <div class="viewer"
       v-loading="fullLoading"
       element-loading-text="执行中，请稍后"
       element-loading-spinner="el-icon-loading">
    <vc-viewer ref="viewer" @ready="ready" :shouldAnimate="true" :orderIndependentTranslucency="false" :timeline="true" :animation="true">
<!--      <vc-layer-imagery :alpha="alpha" :imageryProvider="imageryProvider" :brightness="brightness" :contrast="contrast">-->
<!--      </vc-layer-imagery>-->
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast">
        <vc-provider-imagery-tile-mapservice
          :url="baseMapUrl" :flipXY="false"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl"
          @readyPromise="imageryReady"
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
    <el-button style="margin-top: 1vh" :class="this.selectSubResource.length > 0 ? 'select' : 'deselect'" v-on:click="dealAllRequest('21104', 1)">订阅</el-button>
    <el-button style="margin-top: 1vh" type="success" v-on:click="dealAllRequest('21103')">资源获取</el-button>
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
      <el-table-column align="center"
                       prop="url"
                       style="border-style:solid;border-width:5px;"
                       label="资源结果"
                       min-width="30%">
        <template slot-scope="scope">
          <div v-if="scope.row.url === null">
            <el-button type="text" size="small">暂无结果</el-button>
          </div>
          <div v-else>
            <a :href="scope.row.url + '?download=true'">下载结果</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="margin-top: 1vh" :class="this.selectUnSubResource.length > 0 ? 'select' : 'deselect'" v-on:click="dealAllRequest('21104', 0)">取消订阅</el-button>
  </div>
<!--任务列表-->
  <div class = "info-window" v-if="showFlag[2]">
    <el-button icon="el-icon-error" size ="small" type="danger" class="close-info-window" @click="closeWindow(2)">关闭</el-button>
    <TaskContent v-on:workOnMap="ViewMapResults">
    </TaskContent>
  </div>
<!--  任务信息表格-->
  <div class = "info-window" v-if="showTaskDetailTable">
    <el-form :model="taskForm" label-width="calc(100px + .5vw)">
      <el-form-item label="采集名称">
        <el-input v-model="taskForm.title"></el-input>
      </el-form-item>
      <el-form-item label="中心经度">
        <el-input v-model="taskForm.longitude"></el-input>
      </el-form-item>
      <el-form-item label="中心纬度">
        <el-input v-model="taskForm.latitude"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="taskForm.type" placeholder="请选择" style="float: left;width: 30%">
          <el-option
                v-for="item in taskTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
        </el-select>
        <el-form-item label="采集幅宽" style="float:right; width: 60%">
          <el-input v-model="taskForm.width"></el-input>
        </el-form-item>
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
        <el-button type="primary" @click="dealAllRequest('21106')">立即创建</el-button>
        <el-button @click="closeTaskTable">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
<!--  资源统计栏-->
  <Statistics v-if="statisticFlag" class="resourceS" describe-text="资 源 " status-text="订 阅 " :finished-number = subResource.length
              :total-number = "resourceItems.length + subResource.length" :content=subResource></Statistics>
  <Statistics v-if="statisticFlag" class="taskS" describe-text="任 务 " status-text="完 成 " :finished-number = taskStatistic.finishedNumber
              :total-number = taskStatistic.totalNumber :content=taskStatistic.data></Statistics>
  <!--  日志窗口-->
  <Log ref="log" v-if="logFlag"></Log>
</div>
</template>
<script>

import Strophe from 'strophe.js'
import TaskContent from './TaskContent'
import czml from './czml'
import Statistics from './Statistics'
import Log from './Log'
export default {
  name: 'CesiumMap',
  components: {Statistics, TaskContent, Log},
  // 状态信息添加在本地
  mounted () {
    if (!this.$xmpp.connFlag) {
      console.log('not login')
      let name = this.$xmpp.getCookie('userCode')
      let password = this.$xmpp.getCookie('password')
      let domain = this.$xmpp.getCookie('domain')
      let ip = this.$xmpp.getCookie('ip')
      if (name !== null && password !== null && domain !== null) {
        this.$xmpp.BOSH_SERVER = 'http://' + ip + ':7070/http-bind/'
        this.$xmpp.httpServer = 'http://' + ip + ':8000/GFData/'
        this.$xmpp.initial()
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
  data () {
    return {
      logFlag: false,
      statisticFlag: false,
      fullLoading: false,
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
      resourceItems: [],
      tileUrl: 'http://192.168.1.6:7000/GFData/tileData/GF1_PMS1_E120.5_N22.7_20200205_L1A0004599309',
      baseMapUrl: 'http://192.168.1.120:3000/BaseMap',
      showTileMap: false,
      taskList: [],
      NetStatus: '申请入网',
      subResource: [],
      selectSubResource: [],
      selectUnSubResource: [],
      taskForm: {
        title: '',
        latitude: '',
        longitude: '',
        type: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        width: ''
      },
      taskTypeOption: [{
        value: '1',
        label: '用户初级任务'
      }, {
        value: '2',
        label: '用户高级任务'
      }, {
        value: '3',
        label: '系统初级任务'
      }, {
        value: '4',
        label: '系统高级任务'
      }],
      taskStatistic: {
        totalNumber: 9,
        finishedNumber: 5,
        data: []
      },
      posName: ''
    }
  },
  methods: {
    getNowDate () {
      let a = new Date()
      let year = a.getFullYear()
      let month = a.getMonth() + 1
      let date = a.getDate()
      let hour = a.getHours()
      let minutes = a.getMinutes()
      let second = a.getSeconds()
      let timeString = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second
      return timeString
    },
    init () {
      // 初始化相关内容
      // TODO 从数据库中获取订阅的资源列表到 变量 subResource（list）
      let base = this
      // 获取用户入网状态 passed
      this.$http.getUserNetStatus(this.$xmpp.userCode).then(result => {
        let status = result['status']
        if (status === 1) {
          base.NetStatus = '申请退网'
        } else {
          base.NetStatus = '申请入网'
        }
        this.$xmpp.virtualPosLng = result['longitude']
        this.$xmpp.virtualPosLat = result['latitude']
        this.posName = result['position']
        console.log('用户信息初始化结束')
      }).catch((reason) => {
        base.NetStatus = '用户异常'
        console.log(reason)
        return false
      })
      // 获取订阅资源列表 pass
      this.$http.getUserSubResourceList(this.$xmpp.userCode).then((result) => {
        this.subResource = result
      }).catch((reason) => {
        console.log(reason)
      })
      base.messageHandler = base.$xmpp.conn.addHandler(base.onMessage, null, 'message', null, null, null)

      this.queryAllTask()

      // 初始化任务表格信息
      let nowDate = new Date()
      let year = nowDate.getFullYear()
      let month = nowDate.getMonth() + 1
      let date = nowDate.getDate()

      this.taskForm.startDate = year + '-' + month + '-' + date
      this.taskForm.startTime = nowDate

      let endDate = new Date(nowDate.getTime() + 60 * 60 * 1000)
      year = endDate.getFullYear()
      month = endDate.getMonth() + 1
      date = endDate.getDate()
      this.taskForm.endDate = year + '-' + month + '-' + date
      this.taskForm.endTime = endDate
    },
    ViewMapResults (url, type) {
      // 可视化结果
      console.log(url)
      this.tileUrl = url
      this.showTileMap = false
      this.showTileMap = true
    },
    ready (cesiumInstance) {
      console.log('ready......')
      const {Cesium, viewer} = cesiumInstance
      // this.imageryProvider = new Cesium.MapboxImageryProvider({
      //   mapId: 'mapbox.streets'
      // })
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      viewer.scene.globe.depthTestAgainstTerrain = true
      this.Cesium = Cesium
      this.viewer = viewer
      let userPos = this.Cesium.Cartesian3.fromDegrees(121.30, 25.03, 0)
      console.log(userPos, '22222222222222')
      let base = this
      // setTimeout(function () {
      //   const date = new Date()
      //   console.log(date.toLocaleDateString(), 'lllll')
      //   base.viewer.clock.currentTime = Cesium.JulianDate.fromDate(date).clone()
      //
      //   console.log(new Date(base.viewer.clock.currentTime).toLocaleDateString(), 'Viewer.clock.currentTime')
      // }, 10000)

      // let userPos = this.Cesium.Cartesian3.fromDegrees(121.30, 25.03, 0)
      // console.log(userPos)

      czml.init(Cesium, viewer)

      setTimeout(function () {
        if (base.NetStatus === '申请退网') {
          // 如果用户状态是在网的话，应该主动首先向管控发送请求，判断是否在线，而不是等管控广播。。。。。，
          let starName = base.getNeareastStar()
          base.$xmpp.RequestReSource(starName)
        }
      }, 2000)
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
      let width = (maxLng - minLng) * 110 * 1000 * Math.cos((Math.abs(centerLat) / 180) * Math.PI)
      width = parseInt(width)
      // console.log(width)
      this.taskForm.width = width
      this.taskForm.latitude = centerLat
      this.taskForm.longitude = centerLng
      this.showTaskDetailTable = true
    },
    closeTaskTable () {
      console.log(this.taskForm)
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
      let startName = this.getNeareastStar()

      czml.GetNearestStarList(beginTime, endTime, this.taskForm.latitude, this.taskForm.longitude).then((startList) => {
        let nearNodeListStr = JSON.stringify(startList)
        if (nearNodeListStr.length > 0) {
          nearNodeListStr = nearNodeListStr.substr(1, nearNodeListStr.length - 2)
        }
        console.log(nearNodeListStr, 'nodeListStr')
        this.$xmpp.RequestTask(this.taskForm.title, this.taskForm.latitude, this.taskForm.longitude, this.taskForm.width,
          beginTime, endTime, this.taskForm.type, JSON.stringify(this.posList), startName, nearNodeListStr)
        this.showTaskDetailTable = false
        this.clear()
        this.fullLoading = true
      }).catch((reason) => {
        console.log(reason)
        this.$message('任务创建失败')
      })
    },
    // cesium加载瓦片触发函数
    imageryReady (imageryProvider) {
      // this.viewer.camera.flyTo({destination: imageryProvider.rectangle})
    },
    makeLogInfo (content) {
      if (this.$refs.log !== undefined) {
        this.$refs.log.addLogInfo(content)
      }
    },
    // 资源请求
    // 所有跟管控请求相关的入口信息
    dealAllRequest (typeid, val) {
      if (this.$xmpp.gkStatus === false) {
        this.$message('管控中心不在线，无法操作')
      } else {
        switch (typeid) {
          case '21103':
            this.makeLogInfo('用户' + this.$xmpp.userCode + '查询所有资源')
            let starName = this.getNeareastStar()
            this.$xmpp.RequestReSource(starName)
            break
          case '21101':
            this.makeLogInfo('用户' + this.$xmpp.userCode + '入、退网请求')
            this.requestInOutNet()
            break
          case '21104':
            this.makeLogInfo('用户' + this.$xmpp.userCode + '资源操作')
            if (val === 1) { this.requestSub() } else { this.requestUnSub() }
            break
          case '21106':
            this.makeLogInfo('用户' + this.$xmpp.userCode + '新建任务')
            this.regionTaskMake()
            break
          default:
            break
        }
      }
    },
    // 获取当前CZML最近卫星，用于入网
    getNeareastStar () {
      let allData = czml.GetAllSatellite()
      // let pos = parseInt(Math.random() * (this.$xmpp.virtualPosition.length - 1), 10)

      console.log(this.$xmpp.virtualPosLng)
      console.log(this.$xmpp.virtualPosLat)
      let userPos = this.Cesium.Cartesian3.fromDegrees(this.$xmpp.virtualPosLng, this.$xmpp.virtualPosLat, 0)

      let minDis = Number.MAX_VALUE
      let starName = null
      for (let key in allData) {
        if (key === 'G1' || key === 'G2' || key === 'G3' || key === 'G4' || key === 'G5') {
          continue
        }
        let data = allData[key]
        const position = data[0].position.getValue(this.viewer.clock.currentTime)
        const distance = this.Cesium.Cartesian3.distance(position, userPos)
        if (minDis > distance) {
          minDis = distance
          starName = key
        }
      }
      console.log('min distance is')
      console.log(minDis)
      if (minDis / 1000 > 3000) {
        let s1 = allData['G3']
        let s2 = allData['G5']
        const p1 = s1[0].position.getValue(this.viewer.clock.currentTime)
        const p2 = s2[0].position.getValue(this.viewer.clock.currentTime)
        const d1 = this.Cesium.Cartesian3.distance(p1, userPos)
        const d2 = this.Cesium.Cartesian3.distance(p2, userPos)
        if (d1 < d2) {
          starName = 'G3'
        } else {
          starName = 'G5'
        }
      }
      console.log(starName)
      return starName
    },
    // 入网退网请求
    requestInOutNet () {
      let starName = this.getNeareastStar()
      // let latitude = this.$xmpp.virtualPosition[this.$xmpp.virtualIndex][1]
      // let longitude = this.$xmpp.virtualPosition[this.$xmpp.virtualIndex][0]
      if (this.NetStatus === '申请入网') {
        this.$xmpp.RequestInOrOutToNet(1, this.$xmpp.virtualPosLat, this.$xmpp.virtualPosLng, starName)
      } else {
        this.$xmpp.RequestInOrOutToNet(0, this.$xmpp.virtualPosLat, this.$xmpp.virtualPosLng, starName)
      }
    },
    // 资源订阅请求
    requestSub () {
      if (this.selectSubResource.length > 0) {
        let items = []
        for (let i in this.selectSubResource) {
          items.push(this.selectSubResource[i].resourceId)
        }
        let starName = this.getNeareastStar()
        this.$xmpp.ResourceSubUnSub(1, items, starName)
      }
    },
    // 资源退订请求
    requestUnSub () {
      if (this.selectUnSubResource.length > 0) {
        let items = []
        for (let i in this.selectUnSubResource) {
          items.push(this.selectUnSubResource[i].resourceId)
        }
        let starName = this.getNeareastStar()
        this.$xmpp.ResourceSubUnSub(0, items, starName)
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
      if (index === 3) {
        this.$refs.handlerPolygon.clear()
        this.viewer.entities.removeAll()
        this.viewer.scene.requestRender()
      }
      this.$set(this.showFlag, index, false)
    },
    // 入网退网协议 pass
    handleRequestInOrOutNet (replyJson) {
      // TODO 数据库做相应更新
      let requestType = replyJson['requesttype']
      let result = replyJson['result']
      if (requestType === 1) {
        if (result === 1) {
          this.$http.setUserStatus(this.$xmpp.userCode, 1).then(result => {
            if (result === 'success') {
              this.$message('入网成功')
              this.makeLogInfo('管控响应用户入网消息，用户入网成功')
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
              this.makeLogInfo('管控响应用户退网消息，用户退网成功')
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
          // Fixed 在数据库中插入订阅的资源信息 selectSubResource pass
          if (this.selectSubResource.length > 0) {
            let base = this
            this.$http.setResourceSubscribe(this.selectSubResource, this.$xmpp.userCode, 'new').then((result) => {
              this.$message('订阅成功')
              this.makeLogInfo('管控响应用户订阅资源，用户资源订阅成功')
              // 更新页面订阅内容
              base.subResource = base.subResource.concat(base.selectSubResource)
              let resource = []
              base.resourceItems.forEach((a) => {
                let c = base.selectSubResource.findIndex(b => a === b)
                if (c <= -1) resource.push(a)
              })
              base.resourceItems = resource
              this.selectSubResource = []
            }).catch((reason) => {
              this.$message('订阅失败')
              console.log(reason)
            })
          }
        } else {
          // TODO 数据库中需要添加订阅，这里是管控订阅成功，但是数据库新增失败
          this.$message('订阅失败')
        }
      } else {
        if (result === 1) {
          // Fixed 在数据库中删除相应的 selectUnSubResource
          let base = this
          if (this.selectUnSubResource.length > 0) {
            this.$http.setResourceSubscribe(this.selectUnSubResource, this.$xmpp.userCode, 'delete').then((result) => {
              base.$message('退订成功')
              this.makeLogInfo('管控响应用户退订资源，用户资源退订成功')
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
              this.selectUnSubResource = []
            }).catch((reason) => {
              // TODO 数据库中需要删除，这里是管控退订成功，但是数据库删除失败
              base.$message('退订失败')
            })
          }
        } else { alert('退订失败') }
      }
    },
    // 资源查询协议 pass
    handleRequestResource (replyJson) {
      this.resourceItems = []
      if (this.$xmpp.gkStatus === false) {
        this.$xmpp.gkStatus = true
      }
      this.makeLogInfo('管控响应用户查询资源，用户资源查询成功')
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
          // TODO add updateTime
          obj.updateTime = this.getNowDate()
          let find = false
          for (let i in this.subResource) {
            if (this.subResource[i].resourceId === parseInt(data[0])) {
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
      this.fullLoading = false
      this.makeLogInfo('管控响应用户新建任务，用户新建任务成功')
      let taskId = replyJson['taskid']
      let result = replyJson['result']
      if (result === 1) {
        this.$message('创建任务成功')
        // TODO 页面中进行更新任务列表
        // Fixed 完成任务新建测试
        console.log(this.taskForm)
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
        data.captureArea = replyJson['capturearea']
        data.taskId = taskId
        data.status = '0'
        // TODO add Time
        data.updateTime = this.getNowDate()
        console.log('taks data is' + JSON.stringify(data))
        this.$http.dealTask(data, this.$xmpp.userCode, 'new').then((result) => {
          this.$message('任务创建成功')
        }).catch((reason) => {
          this.$message('任务创建失败')
        })
        this.taskList.push(taskId)
        // TODO 新建任务到数据库中
      } else {
        let memo = replyJson['memo']
        this.$message('创建任务失败:' + memo)
      }
    },
    // 任务完成响应
    handleTaskFinished (replyJson) {
      this.makeLogInfo('管控响应用户任务完成，用户任务执行完毕')
      let taskid = replyJson['taskid']
      let address = replyJson['address']
      // this.$message('success task is ' + taskid)
      // this.$message('the address is ' + address)
      let starName = this.getNeareastStar()
      this.$xmpp.replyFinished(taskid, address, starName)
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
      this.ViewMapResults(address)
    },
    // 状态轮询响应
    handleStatus (replyJson) {
      console.log('状态查询')
      let starName = this.getNeareastStar()
      this.$xmpp.replyStatus(starName)
      this.makeLogInfo('管控查询用户状态，用户状态上传更新')
    },
    // 请求接收确认报文
    handleCheckStatus (replyJson) {
      let result = replyJson['result']
      if (result === 0) {
        this.$message(replyJson['error'])
      }
      this.fullLoading = false
    },
    handleBroadcast (replyJson) {
      if (this.$xmpp.gkStatus === false) { this.$message(replyJson['data'] + ' 管控上线') }
      this.$xmpp.gkStatus = true
      this.makeLogInfo('接收系统广播')
      let speed = parseInt(replyJson['speed'])
      czml.changeSpeed(speed)
    },
    onMessage (msg) {
      let fromJid = msg.getAttribute('from')
      let index = fromJid.indexOf('/')
      fromJid = fromJid.substr(0, index)
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
                console.log('Finished Task')
                this.handleTaskFinished(replyJson)
                break
              case '12114':
                this.handleStatus()
                break
              case '1202':
                this.handleCheckStatus(replyJson)
                break
              case '1200':
                this.handleBroadcast(replyJson)
                break
              // TODO 订阅资源任务,运行结果推送
              default:
                break
            }
          }
        }
      }
      return true
    },
    // 表格选择
    handleSubSelectChange (val) {
      this.selectSubResource = val
    },
    // 表格取消选择
    handleUnSubSelectChange (val) {
      this.selectUnSubResource = val
    },
    // 连接回调函数
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
          this.$xmpp.gkName = this.$xmpp.gkBaseName + '@' + domain
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
    getDealStarNodeList (startDateStr, endDateStr, posLat, posLng) {
      // const startDate = new Date(startDateStr)
      // const endDate = new Date(endDateStr)
      // console.log(startDate, 'startDate')
      // console.log(endDate, 'endDate')
      // var timeSecondDiff = (endDate.getTime() - startDate.getTime()) / 1000
      // let allData = czml.GetAllSatellite()
      // allData = Object.values(allData)
      // // console.log(allData, 'satellite name')
      // let userPos = this.Cesium.Cartesian3.fromDegrees(posLng, posLat, 0)
      // console.log(userPos, 'userPos')
      // const DISTANCE = 800 * 1000
      // const nearPos = []
      // var minDis = Number.MAX_VALUE
      // timeSecondDiff = parseInt((timeSecondDiff / 60)) * 60
      // // for (var i = 0; i < timeSecondDiff; i += 60) {
      // // const tmpDate = new Date(startDate.getTime() + 720 * 1000)
      // // const setDate = new Date(2020, 5, 27, tmpDate.getHours(), tmpDate.getMinutes(), tmpDate.getSeconds())
      // const setDate = new Date(2020, 5, 27, 13, 32, 50)
      // console.log(setDate, 'setDate')
      // this.viewer.clock.currentTime = this.Cesium.JulianDate.fromDate(setDate).clone()
      //
      // setTimeout(() => {
      //   for (let satellite of allData) {
      //     // console.log(satellite[0].id, 'star id')
      //     if (satellite[0].id === 'Satellite/jinG1' || satellite[0].id === 'Satellite/jinG2' || satellite[0].id === 'Satellite/jinG3' || satellite[0].id === 'Satellite/jinG4' || satellite[0].id === 'Satellite/jinG5') {
      //       continue
      //     }
      //     const starPos = satellite[0].position.getValue(this.viewer.clock.currentTime)
      //     if (satellite[0].id === 'Satellite/jinA311') {
      //       console.log(starPos, 'starPos')
      //     }
      //     const distance = this.Cesium.Cartesian3.distance(starPos, userPos)
      //     console.log(distance, distance < DISTANCE, 'distance')
      //     if (distance < minDis) {
      //       minDis = distance
      //       console.log(minDis, 'push minDis')
      //     }
      //     if (distance < DISTANCE) {
      //       nearPos.push(satellite[0].id)
      //       console.log(nearPos, 'push')
      //     }
      //   }
      // }, 400)
      // // }
      // return nearPos
    },
    test () {
      // const date = new Date()
      // const nowDate = new Date(2020, 5, 30, 8, 0, 0)
      // // console.log(date.toLocaleDateString(), 'lllll')
      // this.viewer.clock.currentTime = this.Cesium.JulianDate.fromDate(nowDate).clone()
      // console.log(new Date(this.viewer.clock.currentTime).toLocaleDateString(), 'Viewer.clock.currentTime')

      // let allData = czml.GetAllSatellite()
      // let data = allData['A11']
      //
      // const nowDate = new Date(2020, 5, 27, 10, 0, 0)
      // // const positionA11 = data[0].position.getValue(this.Cesium.JulianDate.fromDate(nowDate))
      //
      // this.viewer.clock.currentTime = this.Cesium.JulianDate.fromDate(nowDate).clone()
      // setTimeout(() => {
      //   const positionA11 = data[0].position.getValue(this.viewer.clock.currentTime)
      //   console.log(positionA11, 'positionA11')
      // }, 0)
      // this.getDealStarNodeList('2020-11-2 11:40:00', '2020-11-2 12:40:00', '30', '121.30')
      // czml.GetNearestStarList('2020-11-2 00:00:00', '2020-11-2 2:00:00', '25', '121.30')
    },
    Logout () {
      // Fixed 退网
      if (this.NetStatus === '申请退网') {
        this.dealAllRequest('21101')
      }
      // Set TimeOut in disconnect
      let base = this
      setTimeout(function () {
        base.$xmpp.disconnect('user disconnect')
      }, 1000)
    },
    queryAllTask () {
      // 获取所有已经创建的任务信息
      this.$http.dealTask({}, this.$xmpp.userCode, 'all').then((result) => {
        this.taskStatistic.data = result.data
        this.taskStatistic.totalNumber = result.data.length
        let finishedNumber = 0
        for (let index in this.taskStatistic.data) {
          if (this.taskStatistic.data[index].status === 1) {
            finishedNumber += 1
          }
        }
        this.taskStatistic.finishedNumber = finishedNumber
      }).catch((reason) => {
        this.$message('获取任务列表失败')
        console.log(reason)
      })
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
    border-radius: 0.5vh;
    display: inline-block;
    background-color: transparent;
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
    background-color: #0088ff;
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
  .resourceS{
    background-color: white;
    opacity: 0.8;
    z-index: 16;
    position: absolute;
    padding: 1vw;
    top:10vh;
    left:2vw;
    width: 40vh;
    height: 90vh;
    display: inline-block;
    border-radius: 1rem;
    border: 0.3rem solid rgba(116, 116, 116, 255);

    color: #000000;
    font-family: 'Righteous', cursive;
    font-size: 2rem;
    font-weight: 800;
    text-transform: uppercase;
  }
  .taskS{
    background-color: white;
    opacity: 0.8;
    z-index: 16;
    position: absolute;
    padding: 1vw;
    top:10vh;
    right:2vw;
    width: 40vh;
    height: 90vh;
    display: inline-block;
    border-radius: 1rem;
    border: 0.3rem solid rgba(116, 116, 116, 255);

    color: #000000;
    font-family: 'Righteous', cursive;
    font-size: 2rem;
    font-weight: 800;
    text-transform: uppercase;
  }

</style>
<style>
  /*.el-form-item__label {*/
  /*  font-size: calc(12px + .5vw);*/
  /*  color: #CCCCFF;*/
  /*  font-family: Serif;*/
  /*}*/
</style>
