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
      <el-button id="draw" size="small" icon="el-icon-thumb" style="padding: 0.5vw; margin-left: 0.5vw" v-on:click="regionDraw()">绘制</el-button>
      <el-button type="primary" size="small" icon="el-icon-search" style="padding: 0.5vw; margin-left: 0.5vw" v-on:click="regionSearch">搜索</el-button>
    </div>
  </div>
  </div>
</template>
<script>
import top from './top'
import left from './left'

export default {
  name: 'CesiumMap',
  components: {top, left},
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
  data () {
    return {
      alpha: 1,
      brightness: 1,
      contrast: 1,
      imageryProvider: {},
      bmKey: 'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-',
      Cesium: null
    }
  },
  methods: {
    ready (cesiumInstance) {
      const { Cesium, viewer } = cesiumInstance

      viewer.cesiumWidget.creditContainer.style.display = 'none'
      this.imageryProvider = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.streets'
      })
      this.Cesium = Cesium
      // this.tooltip = new Cesium.createTooltip(viewer.cesiumWidget.container)
      this.viewer = viewer
      viewer.scene.globe.depthTestAgainstTerrain = true

      this.PolygonsPoints = []
      this.cursorPoint = null
      this.currentLine = null
      this.currentLinePoints = []

      this.eventInit()
    },
    imageryReady (imageryProvider) {
      this.viewer.camera.flyTo({ destination: imageryProvider.rectangle })
    },
    eventInit () {
      let eventHandler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(this.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      // this.viewer.scene.screenSpaceCameraController.enableTilt = false
      // left click function
      let cm = this
      let ellipsoid = this.viewer.scene.globe.ellipsoid
      eventHandler.setInputAction(function (event) {
        if (!cm.Cesium.Entity.supportsPolylinesOnTerrain(cm.viewer.scene)) {
          console.log('This browser does not support polylines on terrain.')
        } else {
          if (cm.drawFlag) {
            let earthPosition = cm.viewer.camera.pickEllipsoid(event.position, ellipsoid)
            cm.addPoint(earthPosition)
            if (cm.cursorPoint !== null) {
              cm.PolygonsPoints.pop()
              cm.cursorPoint = null
            }
            cm.PolygonsPoints.push(earthPosition)

            if (cm.currentLinePoints.length === 0) {
              cm.currentLinePoints.push(earthPosition)
              cm.currentLine = cm.addLineEntity()
            } else {
              cm.currentLinePoints = []
              cm.currentLinePoints.push(earthPosition)
              cm.currentLine = cm.addLineEntity()
            }
          }
        }
      }, cm.Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // move event
      eventHandler.setInputAction(function (event) {
        if (cm.drawFlag) {
          let newPosition = cm.viewer.camera.pickEllipsoid(event.endPosition)
          if (cm.Cesium.defined(newPosition)) {
            if (cm.cursorPoint === null) {
              cm.cursorPoint = cm.addPoint(newPosition)
              cm.currentLinePoints.push(newPosition)
              cm.PolygonsPoints.push(newPosition)
            } else {
              cm.PolygonsPoints.pop()
              cm.PolygonsPoints.push(newPosition)
              cm.currentLinePoints.pop()
              cm.currentLinePoints.push(newPosition)
              console.log('-----------------------')
              console.log(cm.PolygonsPoints.length)
              console.log(cm.currentLinePoints.length)
              // console.log(cm.cursorPoint)
              // cm.polygonShape.polygon.hierarchy.setValue(cm.PolygonsPoints)
              console.log()
              cm.cursorPoint.position.setValue(newPosition)
              if (cm.currentLine !== null) {
                // console.log(cm.currentLine.polyline.positions)
                cm.currentLine.polyline.positions.setValue(cm.currentLinePoints)
              }
              console.log('!!!!!!!!!!!!!!!!!!!!!!!')
              // cm.currentLine.position.setValue(cm.currentLinePoints)
              // cm.polygonShape.position.setValue(cm.PolygonsPoints)
            }
          }
        }
      }, cm.Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // right event
      eventHandler.setInputAction(function (event) {
        if (cm.drawFlag) {
          cm.completeShape()
        }
      }, cm.Cesium.ScreenSpaceEventType.RIGHT_CLICK)
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
      console.log('add line')
      let cm = this
      let line = this.viewer.entities.add({
        polyline: {
          positions: [],
          clampToGround: true,
          width: 3,
          material: new cm.Cesium.PolylineOutlineMaterialProperty({
            color: cm.Cesium.Color.ORANGE,
            outlineWidth: 1,
            outlineColor: cm.Cesium.Color.BLACK
          })
        }
      })
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
          color: cm.Cesium.Color.YELLOW,
          pixelSize: 5,
          heightReference: cm.Cesium.HeightReference.RELATIVE_TO_GROUND
        }
      })

      return point
    },
    clear () {
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
    padding: 0.5vw;
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
</style>
