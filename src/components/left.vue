<template>
  <div id="left">
<!--    <div class="title">-->
<!--      <img src="../assets/title.png" style="width: 8vw">-->
<!--    </div>-->
    <div class="center">
      <div id="earth"  class="iconsSelect" v-on:click="jumpToMap">
        <img src="../assets/earth_white.png" class="menu">
        <span class="iconFont">地 图</span>
      </div>
      <div id="user" class="iconsDeSelect" v-on:click="jumpToUser">
        <img src="../assets/user_white.png" class="menu">
        <span class="iconFont">用 户</span>
      </div>
      <div id="task" class="iconsDeSelect" v-on:click="jumpToTask">
        <img src="../assets/task_white.png" class="menu">
        <span class="iconFont">任务台</span>
      </div>
      <div id="node" class="iconsDeSelect" v-on:click="jumpToNode">
        <img src="../assets/console_white.png" class="menu">
        <span class="iconFont">处理点</span>
      </div>
    </div>
    <div class="bottom">
      <img src="../assets/logo.png" style="width: 6vw;">
    </div>
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
      this.setMenuClass('earth', 'user', 'task', 'node')
      if (this.$route.path !== '/CesiumMap') {
        this.$router.push({path: '/CesiumMap'})
      }
    },
    jumpToUser () {
      this.setMenuClass('user', 'task', 'earth')
      if (this.$route.path !== '/UserCenter') {
        this.$router.push({path: '/UserCenter'})
      }
    },
    jumpToNode () {
      this.setMenuClass('node', 'user', 'earth', 'task')
      if (this.$route.path !== '/Charts') {
        this.$router.push({path: '/Charts'})
      }
    },
    jumpToTask () {
      this.setMenuClass('task', 'user', 'earth', 'node')
      if (this.$route.path !== '/TaskDetail') {
        this.$router.push({path: '/TaskDetail'})
      }
    },
    setMenuClass (name1, name2, name3, name4) {
      let imgDiv = document.getElementById(name1)
      imgDiv.className = 'iconsSelect'

      imgDiv = document.getElementById(name2)
      imgDiv.className = 'iconsDeSelect'

      imgDiv = document.getElementById(name3)
      imgDiv.className = 'iconsDeSelect'

      imgDiv = document.getElementById(name4)
      imgDiv.className = 'iconsDeSelect'
    }
  }
}
</script>

<style scoped>
  #left{
    position: absolute;
    background: #2f2f2f;
    width: 10vw;
    height: 100vh;
    z-index: 15;
  }
  .title{
    margin-top: 3vh;
    margin-bottom: 5vh;
    padding-bottom: 2vh;
    border-bottom: #f2c048 0.05rem solid;
  }
  .center{
    width:100%;
    height: auto;
    display:inline-block;
    margin-top: 12vh
  }
  .iconsSelect{
    padding: 0.5vw;
    width: 100%;
    float: left;
    clear: both;
    background-color: #526f82;
    filter:brightness(100%);
  }
  .iconsDeSelect
  {
    padding: 0.5vw;
    width: 100%;
    float: left;
    filter:brightness(70%);
  }
  .iconsSelect:hover{
    background-color: #526f82;
  }
  .iconsDeSelect:hover{
    background-color: #526f82;
  }
  .iconFont{
    color: white;
    font-family: 黑体;
    font-size: 1.6vw;
    float: right
  }
  .menu{
    float: left;
    width: 2vw; height: 2vw;
  }
  .bottom{
    margin-top: 18vh;
  }

</style>
