<template>
  <div>
    <p style="color: #e5f2fe">任务列表</p>
    <el-table
      :row-style="{width:'100%'}"
      :data="taskContent"
      border>
      <el-table-column align="center"
                       prop="id"
                       label="序号"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="lng"
                       style="border-style:solid;border-width:5px;"
                       label="中心经度"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="lat"
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
                       prop="startTime"
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
          <div v-if="scope.row.status === '1'">
            <el-button @click="handleViewRes(scope.row)" type="text" size="small">查看结果</el-button>
          </div>
          <div v-if="scope.row.status === '0'" v-loading="true" style="width: 80%;height: 100%; margin: auto">
            执行中，请稍后
          </div>
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
          id: '1',
          lat: '32.356',
          lng: '125.678',
          width: '400m',
          startTime: '2020-8-22 12:20:20',
          endTime: '2020-8-22 15:30:30',
          period: '1',
          status: '1',
          url: 'https://182.412.423.12:8000/Gdasdw'
        }
      ]
    }
  },
  methods: {
    handleViewRes (row) {
      this.$emit('workOnMap', row.url)
    }
  }
}
</script>

<style scoped>

</style>
