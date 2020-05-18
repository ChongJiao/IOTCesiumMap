<template>
  <div class="modal-bg" v-show="show">
    <div class="modal-container">
      <div class="modal-header">
        <h1>{{ title }}</h1>
      </div>
      <div class="modal-main">

        <div>
          <el-table
            :data="data"
            style="width: 100%"
            max-height="500">
            <el-table-column
              prop="id"
              label="序号"
              width="200">
            </el-table-column>
            <el-table-column
              prop="status0"
              label="结果1"
              width="200">
              <template slot-scope="scope">
                <a :href="scope.row['status0']" target="_blank">显示</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="status1"
              label="结果2"
              width="200">
              <template slot-scope="scope">
                <a :href="scope.row['status1']" target="_blank">显示</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="status2"
              label="结果3"
              width="200">
              <template slot-scope="scope">
                <a :href="scope.row['status2']" target="_blank">显示</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="status3"
              label="结果4"
              width="200">
              <template slot-scope="scope">
                <a :href="scope.row['status3']" target="_blank">显示</a>
              </template>
            </el-table-column>
            <el-table-column
              label="执行"
              width="120">
              <template slot-scope="scope">
                <el-button @click="showTile(scope.$index)"
                           type="text">
                  显示结果
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
    },
    showTile: function (index) {
      console.log(this.data[index])
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
  width: 50vw;
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
