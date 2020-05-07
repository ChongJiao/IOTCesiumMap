<template>
  <div class="modal-bg" v-show="show">
    <div class="modal-container">
      <div class="modal-header">
        <h1>{{ title }}</h1>
      </div>
      <div class="modal-main">
        <div v-for="(item, i) in data" >
          <el-row :gutter="20" style="border-bottom: 3px solid #0088ff">
            <el-col :span="3">
              <p>名称</p>
              <p>任务{{item.id}}</p>
            </el-col>
            <el-col :span="5" v-for="itemStatus in data[i].data">
              <p>状态{{itemStatus.status}}</p>
              <a :href = itemStatus.url>结果</a>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="modal-footer">
        <el-button v-on:click="closed" type="danger" size="medium">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Window',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
    closed: function () {
      this.$emit('closed')
    }
  }}
</script>

<style scoped>
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,.5);
  z-index: 10;
}
.modal-container {
  width: 60vw;
  background: #fff;
  border-radius: 3vw;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.modal-header {
  height: 4vw;
  background: #409EFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
}
.modal-main {
  padding-left:2rem;
  padding-right:2rem;
   /*padding: 1vw 10vw;*/
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5vw;
  border-top: 1px solid #ddd;
}
</style>
