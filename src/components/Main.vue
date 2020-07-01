<template>
  <div>
    <left></left>
    <router-view></router-view>
  </div>
</template>

<script>
import left from './left'
import top from './top'
export default {
  components: {left, top},
  name: 'Main'
}
</script>

<style scoped>
</style>
