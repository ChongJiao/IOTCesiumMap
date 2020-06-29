<template>
  <div id="left">
    <div class="icons">
      <img ref="img1" src="../assets/earth_white.png" style="width: 50px; height: 50px" v-on:click="jumpToMap">
      <span style="color: white">地图</span>
    </div>
    <div class="icons">
      <img id="img2" src="../assets/user_white.png" style="width: 50px; height: 50px">
      <span style="color: white">用户</span>
    </div>
    <div class="icons">
      <img id="img3" src="../assets/console_yellow.png" style="width: 45px; height: 45px" v-on:click="jumpToDetail">
      <span style="color: white">控制台</span>
    </div>
    <!--  <el-container style="height: 100vh; border: 1px solid #eee">-->
    <!--    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">-->
    <!--      <el-menu :default-openeds="['1', '3']">-->
    <!--        <el-submenu index="1">-->
    <!--          <template slot="title"><i class="el-icon-message"></i>地图</template>-->
    <!--        </el-submenu>-->
    <!--        <el-submenu index="2">-->
    <!--          <template slot="title"><i class="el-icon-menu"></i>用户</template>-->
    <!--        </el-submenu>-->
    <!--        <el-submenu index="3">-->
    <!--          <template slot="title"><i class="el-icon-setting" v-on:click="jumpProcess"></i>控制台</template>-->
    <!--        </el-submenu>-->
    <!--      </el-menu>-->
    <!--    </el-aside>-->
    <!--  </el-container>-->
  </div>
</template>

<script>
export default {
  name: 'left',
  data () {
    return {
    }
  },
  methods: {
    jumpToMap () {
      this.$router.push({path: '/'})
    },
    jumpToDetail () {
      this.$router.push(
        {path: '/imageProcessDetail'}
      )
    }

  }
}
</script>

<style scoped>
  #left{
    position: absolute;
    margin-top: 8vh;
    background: lightslategray;
    width: 5vw;
    height: 50vh;
    border-radius: 5px;
    z-index: 15;
  }
  .icons{
    margin-top: 15px;
  }

</style>
