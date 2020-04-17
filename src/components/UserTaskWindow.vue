<template>
  <div class="modal-bg" v-show="show">
    <div class="modal-container">
      <div class="modal-header">
        {{ title }}
      </div>
      <div class="modal-main">
        <div v-for="(item, i) in data" >
          <el-row :gutter="20">
            <el-col :span="3">
              <p>任务</p>
              <p>{{item.id}}</p>
            </el-col>
            <el-col :span="5" v-for="itemStatus in data[i].data">
              <p>状态{{itemStatus.status}}</p>
              <a :href = itemStatus.url>结果</a>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="modal-footer">
        <el-button v-on:click="closed" variant="danger">关闭</el-button>
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
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 10;
}
.modal-container {
  width: 80vw;
  background: #fff;
  border-radius: 3vw;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.modal-header {
  height: 10vw;
  background: #409EFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
}
.modal-main {
   /*padding: 1vw 10vw;*/
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10vw;
  border-top: 1px solid #ddd;
}
</style>
