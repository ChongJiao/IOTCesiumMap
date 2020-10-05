<template>
  <div class="viewer">
    <h1 style="align-content: center;margin-top: 2vh">地图可视化</h1>
    <vc-viewer ref="viewer" @ready="ready" :shouldAnimate="true" :orderIndependentTranslucency="false">
      <vc-layer-imagery>
        <vc-provider-imagery-tile-mapservice
          :url="baseMapUrl"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
      <vc-entity :polygon.sync="polygon" v-if="show">
        <vc-graphics-polygon ref="polygon1" :hierarchy="hierarchy" :material="material"></vc-graphics-polygon>
      </vc-entity>
    </vc-viewer>
  </div>
</template>

<script>

export default {
  name: 'DataCesium',
  props: {
    hierarchy: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      show: false,
      polygon: {},
      material: 'red',
      baseMapUrl: 'http://192.168.1.121:8000/BaseMap'
    }
  },
  watch: {
    hierarchy (newVal, oldVal) {
      this.initRectangle()
    }
  },
  methods: {
    ready (cesiumInstance) {
      console.log('ready......')
      const {Cesium, viewer} = cesiumInstance
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      viewer.scene.globe.depthTestAgainstTerrain = true

      this.Cesium = Cesium
      this.viewer = viewer
      this.initRectangle()
    },
    initRectangle () {
      if (this.hierarchy.length > 0) {
        this.material = this.Cesium.Color.RED.withAlpha(0.5)
        let CArray = []
        for (let index in this.hierarchy) {
          let data = this.hierarchy[index]

          var cartographic = this.Cesium.Cartographic.fromDegrees(data.lng, data.lat, 0)
          CArray.push(cartographic)
        }
        console.log(CArray)
        const destination = this.Cesium.Rectangle.fromCartographicArray(CArray)

        this.viewer.camera.flyTo({destination: destination})
        this.show = true
      }
    }
  }
}
</script>

<style scoped>
.viewer {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 90vh;
  z-index: 12;
}
</style>
