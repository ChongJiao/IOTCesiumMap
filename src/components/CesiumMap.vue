<template>
<div>
  <div class="viewer">
    <vc-viewer @ready="ready">
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
    </vc-viewer>
    <div class="toolBox" >
      <div id = "polygon" class= "toolDeSelect">
        <img class = "toolIcon" src="../assets/tool_Polygon.png">
      </div>
        <el-button id="draw" icon="el-icon-thumb" v-on:click="regionDraw()" style="margin-top: 2%; margin-left:0.2vw">绘制</el-button>
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
    // setTimeout(function () {
    //   if (!myStropheConn.myStropheConn.connFlag) {
    //     console.log('not login')
    //     myStropheConn.myStropheConn.connecting()
    //   }
    // }, 2000)
    // this.messageHandler = myStropheConn.myStropheConn.conn.addHandler(this.onMessage, null, 'message', null, null, null)
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
      viewer.scene.globe.depthTestAgainstTerrain = true
      this.PolygonsPoints = []
      this.LineList = []
      this.cursorPoint = null
      this.currentLine = null
      this.currentLinePoints = []

      this.eventInit()
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
          switch (replyJson['type']) {
            case 'region':
              // TODO show region
              console.log(replyJson['data'])
              break
            default:
              break
          }
        }
      }
      return true
    },
    eventInit () {
      let cm = this
      let ellipsoid = this.viewer.scene.globe.ellipsoid
      let eventHandler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(this.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      eventHandler.setInputAction(function (event) {
        if (!cm.Cesium.Entity.supportsPolylinesOnTerrain(cm.viewer.scene)) {
          console.log('This browser does not support polylines on terrain.')
        } else {
          if (cm.drawFlag) {
            let earthPosition = cm.viewer.camera.pickEllipsoid(event.position, ellipsoid)
            cm.addPoint(earthPosition)
            cm.cursorPoint = cm.addPoint(earthPosition)
            console.log('click')
            if (cm.PolygonsPoints.length === 0) {
              cm.LineList.push(cm.addLineEntity())
              cm.LineList.push(cm.addLineEntity())
            } else {
              cm.LineList[0].polyline.positions.setValue([cm.PolygonsPoints[0], earthPosition])
              cm.LineList.push(cm.addLineEntity())
            }
            cm.PolygonsPoints.push(earthPosition)
          }
        }
      }, cm.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.viewer.canvas.addEventListener('mousemove', function (event) {
        if (cm.drawFlag) {
          let position = new cm.Cesium.Cartesian2(event.x, event.y)
          let pickedObject = cm.viewer.scene.pick(position)
          if (!cm.Cesium.defined(pickedObject)) {
            // let newPosition = cm.viewer.camera.pickEllipsoid(position)
            let newPosition = cm.viewer.scene.pickPosition(new cm.Cesium.Cartesian2(event.x, event.y))
            if (cm.PolygonsPoints.length > 0) {
              console.log('-----------------------')
              let p1 = cm.PolygonsPoints[cm.PolygonsPoints.length - 1]
              console.log(cm.PolygonsPoints.length)
              cm.LineList[0].polyline.positions.setValue([cm.PolygonsPoints[0], newPosition])
              cm.LineList[cm.LineList.length - 1].polyline.positions.setValue([p1, newPosition])
              if (cm.cursorPoint !== null) {
                cm.cursorPoint.position.setValue(newPosition)
              }
              cm.viewer.scene.requestRender()
              console.log('!!!!!!!!!!!!!!!!!!!!!!!')
            }
          }
        }
      })
      this.viewer.canvas.addEventListener('contextmenu', function (event) {
        cm.drawFlag = false
      })
    },
    regionDraw () {
      // 绘制
      let div = document.getElementById('draw')
      let i = div.getElementsByTagName('i')[0]
      let span = div.getElementsByTagName('span')[0]

      let name = span.innerText
      if (name === '绘制') {
        span.innerText = '取消'
        i.className = 'el-icon-circle-close'
        this.drawFlag = true
        let pol = document.getElementById('polygon')
        pol.className = 'toolSelect'
        // 新增shape 实体
        // this.polygonShape = this.addPolygonEntity()
      } else {
        span.innerText = '绘制'
        i.className = 'el-icon-thumb'
        this.drawFlag = false
        let pol = document.getElementById('polygon')
        pol.className = 'toolDeSelect'
      }
    },
    regionSearch () {
      // 查找区域
    },
    addPolygonEntity () {
      console.log('add polygon')
      let shape = this.viewer.entities.add({
        polygon: {
          hierarchy: [],
          material: new this.Cesium.ColorMaterialProperty(this.Cesium.Color.YELLOW.withAlpha(0.4))
        }
      })
      return shape
    },
    addLineEntity () {
      let cm = this
      let line = this.viewer.entities.add({
        polyline: {
          positions: [],
          clampToGround: true,
          width: 3,
          material: cm.Cesium.Color.ORANGE
        }
      })
      this.viewer.scene.requestRender()
      return line
    },
    addPoint (position) {
      // position = this.Cesium.Ellipsoid.WGS84.cartesianToCartographic(position)
      // let lon = this.Cesium.Math.toDegrees(position.longitude)
      // let lat = this.Cesium.Math.toDegrees(position.latitude)
      let cm = this
      let point = this.viewer.entities.add({
        position: position,
        point: {
          pixelSize: 10,
          color: cm.Cesium.Color.YELLOW
        }
      })

      return point
    },
    clear () {
      this.viewer.entities.removeAll()
    },
    getPolylines () {
      let entities = this.viewer.entities._entities._array
      let pool = []

      for (let i = 0; i < entities.length; i++) {
        if (entities[i].fromDrawingTool) {
          pool.push(entities[i])
        }
      }
      return pool
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
    /*padding: 0.5vw;*/
    border-radius: 0.5vh;
    top: 10vh;
    right: 3vw;
    z-index: 15;
    background-color: #dfebee;
    display: list-item;
  }
</style>
