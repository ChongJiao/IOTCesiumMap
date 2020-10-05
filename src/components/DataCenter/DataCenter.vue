<template>
  <div>
        <h1 style="align-content: center;margin-top: 2vh">数据源中心</h1>
        <el-table
          :row-class-name="tableRowStyle"
          height="90vh"
          :data="tableData"
          style="font-size: 1vw"
          >
          <el-table-column align="center"
                           prop="id"
                           label="序号"
                           min-width="5%">
          </el-table-column>
          <el-table-column align="center"
                           style="border-style:solid;border-width:5px;"
                           label="卫星"
                           min-width="5%">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>名称: {{ scope.row.satellite }}</p>
                <p>描述: {{ scope.row.text }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag style="font-size: 1vw">{{ scope.row.satellite }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           prop="position"
                           label="位置"
                           min-width="10%">
          </el-table-column>
          <el-table-column align="center"
                           label="源图像"
                           min-width="10%">
            <template slot-scope="scope">
              <img :src="scope.row.url" style="width: 3vw"/>
              <el-link :href=scope.row.url type="primary" style="font-size: 1vw">查看</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="操作"
                           min-width="10%">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary"
                           @click="jumpToMap(scope.$index, scope.row)">查看位置</el-button>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="运行"
                           prop="runningContent"
                           min-width="10%">
          </el-table-column>
        </el-table>
  </div>
</template>

<script>
import DataCesium from './DataCesium'
export default {
  name: 'DataCenter',
  components: {DataCesium},
  data () {
    return {
      tableData: [],
      clickIndex: -1,
      runningIndexList: {}
    }
  },
  mounted () {
    this.getAllSatellite()
    this.getAllRunningData()
  },
  destroyed () {
    console.log('Task destroyed')
  },
  methods: {
    jumpToMap (index, row) {
      this.$emit('viewPosOnEarth', row)
      this.clickIndex = index
    },
    toImageDetail (index, row) {
      console.log(index, row)
      window.open(row['url'])
    },
    tableRowStyle ({row, rowIndex}) {
      if (this.runningIndexList[rowIndex + 1] === 1) {
        return 'runningTask-row'
      }
      if (rowIndex === this.clickIndex) {
        return 'showMap-row'
      }
      return ''
    },
    getAllSatellite () {
      this.$http.getAllSatellite().then(result => {
        let data = result.data
        if (data.type === 'error') {
          this.$message('数据库错误')
          return
        }
        for (let index in data) {
          data[index].url = 'http://192.168.1.121:8000/GFData/srcData/' + data[index].url + '/' + data[index].url + '.jpg'
          let pos = JSON.parse(data[index].pos)
          data[index].pos = pos
          data[index].runningContent = '物联端未执行'
          this.tableData.push(data[index])
        }
      }).catch((reason) => {
        console.log(reason)
      })
    },
    getAllRunningData () {
      this.$http.getAllTaskflow().then(result => {
        let data = result.data
        if (data.type === 'error') {
          this.$message('数据库错误')
          return
        }
        this.runningIndexList = {}
        for (let index in data) {
          this.runningIndexList[data[index].satelliteId] = 1
        }

        let base = this
        Object.keys(this.runningIndexList).forEach(function (key) {
          base.tableData[key - 1].runningContent = 'iot_001;iot_002;iot_003;iot_004'
        })
      })
    }
  }
}
</script>
<style>
  .el-table .runningTask-row {
    background: red;
  }

  .el-table .showMap-row {
    background: #41c7ff;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: rgba(0, 0, 0, 0) !important;
  }
</style>
