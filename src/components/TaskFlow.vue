<template>
  <div class="Tbody">
    <div class="title">任务列表</div>
    <FlowItem class="item"></FlowItem>
  </div>
</template>

<script>
import FlowItem from './FlowItem'
export default {
  name: 'ProcessShow',
  components: {FlowItem},
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .Tbody{
    margin-left: 10vw;
    width: 90vw;
  }
  .title{
    width: 80vw;
    font-family: 华光黑体_CNKI;
    font-size: 3vw;
  }
  .item{
    margin: auto;
    width: 80vw;
    border-radius: 5px;
    border: solid;
  }
</style>
