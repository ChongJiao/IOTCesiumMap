<template>
<div>
  <div class="viewer">
    <vc-viewer ref="viewer" @ready="ready">
      <vc-layer-imagery :alpha="alpha" :imageryProvider="imageryProvider" :brightness="brightness" :contrast="contrast">
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl0"
          @readyPromise="imageryReady"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl1"
          @readyPromise="imageryReady"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl2"
          @readyPromise="imageryReady"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl3"
          @readyPromise="imageryReady"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
<!--      <vc-handler-draw-polygon-->
<!--        :clampToGround="true"-->
<!--        ref="handlerPolygon"-->
<!--        @activeEvt="activeEvt"-->
<!--        @movingEvt="movingEvt"-->
<!--        @drawEvt="drawEvt"-->
<!--      ></vc-handler-draw-polygon>-->
    </vc-viewer>
    <div class="toolBox" >
      <div id = "polygon" class= "toolDeSelect">
        <img class = "toolIcon" src="../assets/tool_Polygon.png">
      </div>
        <el-button id="draw" icon="el-icon-thumb" v-on:click="toggle('handlerPolygon')" style="margin-top: 2%; margin-left:0.2vw">绘制</el-button>
        <el-button type="primary" icon="el-icon-delete" v-on:click="clear">清除</el-button>
        <el-button type="danger" icon="el-icon-search" v-on:click="regionSearch" style="margin-right: 0.5vw">搜索</el-button>
    </div>
    <div class="rightList">
      <el-tag class="head-tag">
        查询列表
      </el-tag>
      <div v-for="(data, index) in dataSource" :key="index">
        <RightItem :image-url="data.url" :name="data.name" :position="data.pos">
        </RightItem>
      </div>
    </div>
  </div>
  </div>
</template>
<script>

import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
import RightItem from './RightItem'

export default {
  name: 'CesiumMap',
  components: {RightItem},

  mounted () {
    console.log('Cesium mounted')
    let base = this
    setTimeout(function () {
      if (!myStropheConn.myStropheConn.connFlag) {
        console.log('not login')
        myStropheConn.myStropheConn.connecting()
      } else {
        base.messageHandler = myStropheConn.myStropheConn.conn.addHandler(base.onMessage, null, 'message', null, null, null)
      }
    }, 2000)

    let type = self.$route.params.type
    if (type === 'results') {
      // 在地图中显示结果
      let url = self.$route.params.url
      let tileData = myStropheConn.myStropheConn.tileData
      this.tileUrl0 = myStropheConn.myStropheConn.httpServer + tileData + '/' + url + '-pansharpen-' + '0'
      this.tileUrl1 = myStropheConn.myStropheConn.httpServer + tileData + '/' + url + '-pansharpen-' + '1'
      this.tileUrl2 = myStropheConn.myStropheConn.httpServer + tileData + '/' + url + '-pansharpen-' + '2'
      this.tileUrl3 = myStropheConn.myStropheConn.httpServer + tileData + '/' + url + '-pansharpen-' + '3'
      this.showTileMap = true
    }
  },
  destroyed () {
    console.log('Cesium destroyed')
    myStropheConn.myStropheConn.conn.deleteHandler(this.messageHandler)
  },
  data () {
    return {
      alpha: 1,
      brightness: 1,
      contrast: 1,
      imageryProvider: {},
      bmKey: 'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-',
      Cesium: null,
      viewer: null,
      dataSource: [],
      tileUrl0: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl1: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl2: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      tileUrl3: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0',
      showTileMap: false
    }
  },
  methods: {
    ready (cesiumInstance) {
      // Main界面中的四张图片
      const { Cesium, viewer } = cesiumInstance

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

      // let replyData = '{\n' +
      //   '    "data":"[' +
      //   '{\\"pos\\":\\"[30.6552,113.672,30.5877,114.045,30.2668,113.966,30.3343,113.594]\\",\\"id\\":1,\\"satellite\\":\\"GF1\\",\\"position\\":\\"武汉\\",\\"url\\":\\"http://localhost:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806\\"},' +
      //   '{\\"pos\\":\\"[31.0873,114.363,31.0424,114.599,30.8455,114.548,30.8903,114.313]\\",\\"id\\":2,\\"satellite\\":\\"GF2\\",\\"position\\":\\"武汉\\",\\"url\\":\\"http://localhost:8000/GFData/srcData/GF2_PMS2_E114.5_N31.0_20190331_L1A0003916014\\"},' +
      //   '{\\"pos\\":\\"[30.5655,112.5932,30.6110,117.9872,25.1890,117.2408,25.1615,112.1658]\\",\\"id\\":3,\\"satellite\\":\\"GF4\\",\\"position\\":\\"南昌、长沙\\",\\"url\\":\\"http://localhost:8000/GFData/srcData/GF4_PMS_E114.8_N27.0_20200427_L1A0000296438\\"},' +
      //   '{\\"pos\\":\\"[30.5289,112.5504,30.5817,117.9426,25.1614,117.2021,25.1274,112.1290]\\",\\"id\\":4,\\"satellite\\":\\"GF4\\",\\"position\\":\\"南昌、长沙\\",\\"url\\":\\"http://localhost:8000/GFData/srcData/GF4_PMS_E114.8_N27.0_20200513_L1A0000299090\\"}' +
      //   ']",\n' +
      //   '    "type":"region"\n' +
      //   '}'
      // let replyJson = JSON.parse(replyData)
      // let data = JSON.parse(replyJson['data'])
      // this.addRegionResults(data)
    },
    toggle (type) {
      this.$refs[type].drawing = !this.$refs[type].drawing

      let div = document.getElementById('draw')
      let i = div.getElementsByTagName('i')[0]
      let span = div.getElementsByTagName('span')[0]

      let name = span.innerText
      if (name === '绘制') {
        span.innerText = '停止'
        i.className = 'el-icon-circle-close'
        let pol = document.getElementById('polygon')
        pol.className = 'toolSelect'
        // 新增shape 实体
        // this.polygonShape = this.addPolygonEntity()
      } else {
        span.innerText = '绘制'
        i.className = 'el-icon-thumb'
        let pol = document.getElementById('polygon')
        pol.className = 'toolDeSelect'
      }
    },
    clear () {
      console.log('clear')
      this.$refs.handlerPolygon.clear()
      this.viewer.entities.removeAll()
      this.viewer.scene.requestRender()
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
    imageryReady (imageryProvider) {
      this.viewer.camera.flyTo({ destination: imageryProvider.rectangle })
    },
    onMessage (msg) {
      console.log('Cesium Message')
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
          console.log(replyJson)
          switch (replyJson['type']) {
            case 'region':
              // TODO show region
              console.log(JSON.parse(replyJson['data']))
              let data = JSON.parse(replyJson['data'])
              this.addRegionResults(data)
              break
            default:
              break
          }
        }
      }
      return true
    },
    regionSearch () {
      // 查找区域
      let positions = this.$refs.handlerPolygon.polylines[0].positions
      let latlngPoses = []
      for (let index in positions) {
        let pos = this.Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions[index])
        let lng = this.Cesium.Math.toDegrees(pos.longitude)
        let lat = this.Cesium.Math.toDegrees(pos.latitude)
        latlngPoses.push(lat)
        latlngPoses.push(lng)
      }
      // queryRegion
      let msgContent = '{\'type\': \'queryRegion\', \'pos\': \'{0}\'}'
      msgContent = String.format(msgContent, '[' + latlngPoses.toString() + ']')
      myStropheConn.myStropheConn.SendMessage(msgContent)
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
    }
  }
}
</script>
<style scoped>
  .viewer {
    position: absolute;
    top:0;
    left:0;
    width: 100vw;
    height: 100vh;
    z-index: 12;
  }
  .toolBox {
    position: absolute;
    border-radius: 0.5vh;
    top: 1vh;
    right: 3vw;
    display: inline-block;
    background-color: #2f2f2f;
    z-index: 15;
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
    max-width: 20vw;
    position: absolute;
    padding: 0.5vw;
    border-radius: 0.5vh;
    top: 10vh;
    right: 3vw;
    z-index: 15;
    background-color: #dfebee;
    display: list-item;
    list-style: none;
  }
</style>
