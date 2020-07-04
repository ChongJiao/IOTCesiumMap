<template>
<div>
  <div class="viewer">
    <vc-viewer ref="viewer" @ready="ready">
      <vc-layer-imagery :alpha="alpha" :imageryProvider="imageryProvider" :brightness="brightness" :contrast="contrast">
      </vc-layer-imagery>
<!--      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">-->
<!--        <vc-provider-imagery-tile-mapservice-->
<!--          :url="tileUrl1"-->
<!--          @readyPromise="imageryReady"-->
<!--        ></vc-provider-imagery-tile-mapservice>-->
<!--      </vc-layer-imagery>-->
<!--      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">-->
<!--        <vc-provider-imagery-tile-mapservice-->
<!--          :url="tileUrl2"-->
<!--          @readyPromise="imageryReady"-->
<!--        ></vc-provider-imagery-tile-mapservice>-->
<!--      </vc-layer-imagery>-->
<!--      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">-->
<!--        <vc-provider-imagery-tile-mapservice-->
<!--          :url="tileUrl3"-->
<!--          @readyPromise="imageryReady"-->
<!--        ></vc-provider-imagery-tile-mapservice>-->
<!--      </vc-layer-imagery>-->
<!--      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">-->
<!--        <vc-provider-imagery-tile-mapservice-->
<!--          :url="tileUrl4"-->
<!--          @readyPromise="imageryReady"-->
<!--        ></vc-provider-imagery-tile-mapservice>-->
<!--      </vc-layer-imagery>-->
      <vc-handler-draw-polygon
        :clampToGround="true"
        ref="handlerPolygon"
        @activeEvt="activeEvt"
        @movingEvt="movingEvt"
        @drawEvt="drawEvt"
      ></vc-handler-draw-polygon>
    </vc-viewer>
    <div class="toolBox" >
      <div id = "polygon" class= "toolDeSelect">
        <img class = "toolIcon" src="../assets/tool_Polygon.png">
      </div>
        <el-button id="draw" icon="el-icon-thumb" v-on:click="toggle('handlerPolygon')" style="margin-top: 2%; margin-left:0.2vw">绘制</el-button>
        <el-button type="primary" icon="el-icon-delete" v-on:click="clear">清除</el-button>
        <el-button type="danger" icon="el-icon-search" v-on:click="regionSearch">搜索</el-button>
    </div>
    <div class="rightList">
<!--      <RightItem image-url="test.png" name="高分一号" position="位置在武汉汉阳地区">-->
<!--      </RightItem>-->
<!--      <RightItem image-url="test.png" name="高分二号" position="武汉">-->
<!--      </RightItem>-->
      <div v-for="(data, index) in dataSource" :key="index">
        <RightItem :image-url="data.url" :name="data.name" :position="data.pos">
        </RightItem>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import left from './left'

import myStropheConn from '../api/Connection'
import Strophe from 'strophe.js'
import RightItem from './RightItem'
// import cesiumDrawViewer from 'cesium-draw'

export default {
  name: 'CesiumMap',
  components: {RightItem, left},
  props: {
    tileUrl: {
      type: String,
      default: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806'
    },
    tileUrl1: {
      type: String,
      default: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-0'
    },
    tileUrl2: {
      type: String,
      default: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-1'
    },
    tileUrl3: {
      type: String,
      default: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-2'
    },
    tileUrl4: {
      type: String,
      default: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806-pansharpen-3'
    },
    showTileMap: {
      type: Boolean,
      default: false
    }
  },
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
      alpha: 1,
      brightness: 1,
      contrast: 1,
      imageryProvider: {},
      bmKey: 'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-',
      Cesium: null,
      viewer: null,
      dataSource: []
    }
  },
  methods: {
    ready (cesiumInstance) {
      const { Cesium, viewer } = cesiumInstance

      viewer.scene.requestRenderMode = true
      viewer.scene.maximumRenderTimeChange = Infinity
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      viewer.scene.globe.depthTestAgainstTerrain = true
      this.imageryProvider = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.streets'
      })
      this.Cesium = Cesium
      // this.tooltip = new Cesium.createTooltip(viewer.cesiumWidget.container)
      this.viewer = viewer

      let replyData = '{\n' +
        '    "data":"[{\\"pos\\":\\"[30.6552,113.672,30.5877,114.045,30.2668,113.966,30.3343,113.594]\\",\\"id\\":1,\\"satellite\\":\\"GF1\\",\\"position\\":\\"武汉\\",\\"url\\":\\"http://localhost:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806\\"},{\\"pos\\":\\"[31.0873,114.363,31.0424,114.599,30.8455,114.548,30.8903,114.313]\\",\\"id\\":2,\\"satellite\\":\\"GF2\\",\\"position\\":\\"武汉\\",\\"url\\":\\"http://localhost:8000/GFData/srcData/GF2_PMS2_E114.5_N31.0_20190331_L1A0003916014\\"}]",\n' +
        '    "type":"region"\n' +
        '}'
      let replyJson = JSON.parse(replyData)
      let data = JSON.parse(replyJson['data'])
      this.addRegionResults(data)
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
    // imageryReady (imageryProvider) {
    //   this.viewer.camera.flyTo({ destination: imageryProvider.rectangle })
    // },
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
    right: 5vw;
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
  }
</style>
