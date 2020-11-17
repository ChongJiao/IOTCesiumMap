<template>
  <div>
    <p style="color: #e5f2fe">任务列表</p>
    <el-table
      :row-style="{width:'100%'}"
      :data="taskContent"
      height="350"
      border>
      <el-table-column align="center"
                       prop="taskId"
                       label="序号"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="title"
                       style="border-style:solid;border-width:5px;"
                       label="标题"
                       min-width="15%">
      </el-table-column>
      <el-table-column align="center"
                       style="border-style:solid;border-width:5px;"
                       label="经纬度"
                       min-width="15%">
        <template slot-scope="scope">
          <div>
            ({{scope.row.longitude}}, {{scope.row.latitude}})
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       prop="width"
                       style="border-style:solid;border-width:5px;"
                       label="幅宽"
                       min-width="10%">
      </el-table-column>
      <el-table-column align="center"
                       prop="beginTime"
                       style="border-style:solid;border-width:5px;"
                       label="开始时间"
                       min-width="15%">
      </el-table-column>
      <el-table-column align="center"
                       prop="endTime"
                       style="border-style:solid;border-width:5px;"
                       label="结束时间"
                       min-width="15%">
      </el-table-column>
      <el-table-column align="center"
                       prop="type"
                       style="border-style:solid;border-width:5px;"
                       label="类型"
                       min-width="10%">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 1 || scope.row.type === 3">
            初级任务
          </div>
          <div v-else>
            高级任务
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       prop="status"
                       style="border-style:solid;border-width:5px;"
                       label="状态"
                       min-width="10%">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">
            <div v-if="scope.row.type === 2 || scope.row.type === 4">
              <el-button @click="handleViewRes(scope.row)" type="text" size="small">查看结果</el-button>
              <br>
              <el-button @click="handleLinkDownload(scope.row)" type="text" size="small">下载结果</el-button>
            </div>
            <div v-else>
              <el-button @click="handleLinkDownload(scope.row)" type="text" size="small">下载图像</el-button>
            </div>
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
          title: '台海作战任务',
          type: 1,
          latitude: '32.356',
          longitude: '125.678',
          width: '400m',
          beginTime: '2020-8-22 12:20:20',
          endTime: '2020-8-22 15:30:30',
          status: 1,
          address: 'http://192.168.1.6:7000/GFData/tileData/GF1_PMS1_E120.5_N22.7_20200205_L1A0004599309'
        }
      ]
    }
  },
  mounted () {
    // 获取所有已经创建的任务信息
    this.$http.dealTask({}, this.$xmpp.userCode, 'all').then((result) => {
      this.taskContent = result.data
      for (let index in this.taskContent) {
        let latitude = this.taskContent[index].latitude
        console.log(latitude)
        let longitude = this.taskContent[index].longitude
        this.taskContent[index].latitude = latitude.match(/^\d+(?:\.\d{0,4})?/)[0]
        this.taskContent[index].longitude = longitude.match(/^\d+(?:\.\d{0,4})?/)[0]
      }
    }).catch((reason) => {
      this.$message('获取任务列表失败')
      console.log(reason)
    })
  },
  methods: {
    handleViewRes (row) {
      this.$emit('workOnMap', row.address, row.type)
    },
    handleLinkDownload (row) {
      // TODO downloadImageFromLowStar
      this.$emit('sendDownloadImage', row.taskId, row.address)
      if (row.type === 1 || row.type === 3) {
        let a = document.createElement('a')
        let address = row.address
        let newUrl = address + '?download=true'
        a.href = newUrl
        a.click()
      } else {
        let a = document.createElement('a')
        let address = row.address
        let index = address.indexOf('/GFData')
        let mainUrl = address.substr(0, index)
        let subUrl = address.substr(index, address.length)
        let newUrl = mainUrl + '/-/zip' + subUrl
        a.href = newUrl
        a.click()
      }
    }
  }
}
</script>

<style scoped>

</style>
