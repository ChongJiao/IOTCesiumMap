<template>
  <div class="top">
    <div class="header">天 基 物 联 用 户 端</div>
  </div>
</template>

<script>
export default {
  name: 'top'
}
</script>

<style scoped>
  .top{
    position: relative;
    background: lightslategray;
    width: 100%;
    margin-top: 0;
    height: 5vh;
    z-index: 15;
  }
  .header{
    /*position: relative;*/
    position: absolute;
    display: inline-block;
    color: white;
    top:0.5vh;
    left: 3vw;
  }
  .header::before{
    content: ''; /*用伪元素来生成一个矩形*/
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    /*transform: scaleY(1.5) scaleX(2.0) perspective(.5em) rotateX(-5deg);*/
    /*transform-origin: top;*/
    /*box-shadow: 5px 5px 5px #888888;*/
  }
</style>
