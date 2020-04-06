<template>
  <el-container class="main">
    <el-aside width="280px" style="padding-top: 10px;padding-right: 10px">
      <UserXmpp></UserXmpp>
    </el-aside>
    <el-main style="padding: 0">
      <CesiumMap></CesiumMap>
    </el-main>
  </el-container>
</template>

<script>
import UserXmpp from './UserXmpp'
import CesiumMap from './CesiumMap'
export default {
  components: {UserXmpp, CesiumMap},
  name: 'Main'
}
</script>

<style scoped>
</style>
