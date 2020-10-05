<template>
  <div>
    <DataCenter @viewPosOnEarth="jumpToMap" style="width: 48vw;margin-left: 2vw"></DataCenter>
    <DataCesium :hierarchy=regionPos style="width: 48vw;margin-right: 2vw"></DataCesium>
  </div>
</template>

<script>
import DataCesium from './DataCesium'
import DataCenter from './DataCenter'
export default {
  name: 'DataMain',
  components: {DataCenter, DataCesium},
  data () {
    return {
      regionPos: []
    }
  },
  methods: {
    jumpToMap (data) {
      this.regionPos = []
      this.regionPos.push({'lat': data.pos[0], 'lng': data.pos[1]})
      this.regionPos.push({'lat': data.pos[2], 'lng': data.pos[3]})
      this.regionPos.push({'lat': data.pos[4], 'lng': data.pos[5]})
      this.regionPos.push({'lat': data.pos[6], 'lng': data.pos[7]})
    }
  }
}
</script>

<style scoped>

</style>
