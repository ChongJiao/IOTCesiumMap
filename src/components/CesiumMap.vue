<template>
  <div class="viewer">
    <vc-viewer @ready="ready">
      <vc-layer-imagery :alpha="alpha" :imageryProvider="imageryProvider" :brightness="brightness" :contrast="contrast">
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
      <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast" v-if="showTileMap">
        <vc-provider-imagery-tile-mapservice
          :url="tileUrl4"
          @readyPromise="imageryReady"
        ></vc-provider-imagery-tile-mapservice>
      </vc-layer-imagery>
    </vc-viewer>
  </div>
</template>
<script>
export default {
  name: 'CesiumMap',
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
      bmKey: 'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-'
    }
  },
  methods: {
    ready (cesiumInstance) {
      const { Cesium, viewer } = cesiumInstance

      viewer.cesiumWidget.creditContainer.style.display = 'none'
      this.imageryProvider = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.streets'
      })
      this.viewer = viewer
    },
    imageryReady (imageryProvider) {
      this.viewer.camera.flyTo({ destination: imageryProvider.rectangle })
    }
  }
}
</script>
<style scoped>
  .viewer {
    background-image: url("http://127.0.0.1:8000/static/assets/mapBack.png");
    width: 100%;
  }
</style>
