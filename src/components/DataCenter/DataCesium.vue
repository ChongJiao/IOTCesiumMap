<template>
  <div class="viewer">
    <vc-viewer ref="viewer" @ready="ready" :shouldAnimate="true" :orderIndependentTranslucency="false">
    </vc-viewer>
  </div>
</template>

<script>

export default {
  name: 'DataCesium',
  methods: {
    ready (cesiumInstance) {
      console.log('ready......')
      const {Cesium, viewer} = cesiumInstance
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      viewer.scene.globe.depthTestAgainstTerrain = true

      this.Cesium = Cesium
      this.viewer = viewer
    }
  }
}
</script>

<style scoped>
.viewer {
  position: absolute;
  top: 10vh;
  left: 10vw;
  width: 80vw;
  height: 80vh;
  z-index: 12;
}
</style>
