<template>
  <div>
    <p style="color: #e5f2fe">任务列表</p>
    <el-table
      :row-style="{width:'100%'}"
      :data="taskContent"
      height="250"
      border>
      <el-table-column align="center"
                       prop="taskId"
                       label="序号"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="longitude"
                       style="border-style:solid;border-width:5px;"
                       label="中心经度"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="latitude"
                       style="border-style:solid;border-width:5px;"
                       label="中心维度"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="width"
                       style="border-style:solid;border-width:5px;"
                       label="幅宽"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="period"
                       style="border-style:solid;border-width:5px;"
                       label="周期"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="beginTime"
                       style="border-style:solid;border-width:5px;"
                       label="开始时间"
                       min-width="20%">
      </el-table-column>
      <el-table-column align="center"
                       prop="endTime"
                       style="border-style:solid;border-width:5px;"
                       label="结束时间"
                       min-width="20%">
      </el-table-column>
      <el-table-column align="center"
                       prop="status"
                       style="border-style:solid;border-width:5px;"
                       label="状态"
                       min-width="10%">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">
            <el-button @click="handleViewRes(scope.row)" type="text" size="small">查看结果</el-button>
          </div>
          <vue-loading v-if="scope.row.status === 0" type="spiningDubbles" color="#d9544e" :size="{ width: '50%' }" >
            执行中
          </vue-loading>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TaskContent',
  data () {
    return {
      taskContent: [
        {
          taskId: '1',
          latitude: '32.356',
          longitude: '125.678',
          width: '400m',
          beginTime: '2020-8-22 12:20:20',
          endTime: '2020-8-22 15:30:30',
          period: '1',
          status: 1,
          address: 'https://182.412.423.12:8000/Gdasdw'
        }
      ]
    }
  },
  mounted () {
    // 获取所有已经创建的任务信息
    this.$http.dealTask({}, this.$xmpp.userCode, 'all').then((result) => {
      this.taskContent = result.data
    }).catch((reason) => {
      this.$message('获取任务列表失败')
      console.log(reason)
    })
  },
  methods: {
    handleViewRes (row) {
      this.$emit('workOnMap', row.address)
    }
  }
}
</script>

<style scoped>

</style>
