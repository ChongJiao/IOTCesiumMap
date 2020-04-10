<template>
  <div class="viewer">
    <vc-viewer @ready="ready">
      <vc-layer-imagery :alpha="alpha" :imageryProvider="imageryProvider" :brightness="brightness" :contrast="contrast">
      </vc-layer-imagery>
<!--      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast">-->
<!--        <vc-provider-imagery-tile-mapservice-->
<!--          :url="url"-->
<!--          @readyPromise="imageryReady"-->
<!--        ></vc-provider-imagery-tile-mapservice>-->
<!--      </vc-layer-imagery>-->
    </vc-viewer>
  </div>
</template>
<script>
export default {
  name: 'CesiumMap',
  props: {
    url: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806'
  },
  data () {
    return {
      alpha: 1,
      brightness: 1,
      contrast: 1,
      imageryProvider: {},
      bmKey: 'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-'
    }
  },
  methods: {
    ready (cesiumInstance) {
      const { Cesium, viewer } = cesiumInstance
      // this.imageryProvider = new Cesium.TileMapServiceImageryProvider({
      //   url: 'http://localhost:8000/GFData/test/testtile4326',
      //   fileExtension: 'png',
      //   maximumLevel: 4
      // })

      this.imageryProvider = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.streets'
      })

      // image tile地图可以正常加载
      // this.imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
      //   url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      // })
      this.viewer = viewer
    },
    // layerAdded () {
    //   if (this.$refs.layerText.imageryLayer) {
    //     const { viewer } = this.cesiumInstance
    //     viewer.imageryLayers.raiseToTop(this.$refs.layerText.imageryLayer)
    //   }
    // }
    imageryReady (imageryProvider) {
      this.viewer.camera.flyTo({ destination: imageryProvider.rectangle })
    }
  }
}
</script>
<style>
  .viewer {
    width: 100%;
  }
</style>
