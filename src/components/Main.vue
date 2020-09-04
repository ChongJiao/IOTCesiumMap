<template>
    <div class="body">
      <router-view></router-view>
    </div>
</template>

<script>
import CesiumMap from './CesiumMap'
String.format = function (src) {
  if (arguments.length === 0) return null

  var args = Array.prototype.slice.call(arguments, 1)

  return src.replace(/\{(\d+)\}/g, function (m, i) {
    return args[i]
  })
}
export default {
  components: {CesiumMap},
  name: 'Main'
}
</script>

<style scoped>
  .body {
    position: absolute;
    width: 100%;
  }
</style>
