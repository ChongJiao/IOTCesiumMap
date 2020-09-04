<template>
  <div class="Dbody">
    <h1 style="align-content: center;margin-top: 2vh">数据源中心</h1>
    <el-table
      :row-style="{height:'5vh'}"
      :cell-style="{padding:'0.5vw'}"
      :data="tableData"
      border
      style="width: 80vw;margin-left: 5vw;font-size: 1vw">
      <el-table-column align="center"
                       prop="id"
                       label="序号"
                       width="100">
      </el-table-column>
      <el-table-column align="center"
                       style="border-style:solid;border-width:5px;"
                       label="卫星"
                       width="100">
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
                       width="160">
      </el-table-column>
      <el-table-column align="center"
                       label="角点经纬度"
                       width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos1[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos1[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="角点经纬度"
                       width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos2[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos2[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="角点经纬度"
                       width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos3[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos3[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="角点经纬度"
                       width="180">
        <template slot-scope="scope">
          <div style="font-size: 0.8vw">纬度:{{scope.row.pos4[0]}}</div>
          <div style="font-size: 0.8vw">经度:{{scope.row.pos4[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="源图像"
                       width="150">
        <template slot-scope="scope">
          <img :src="scope.row.url" style="width: 3vw"/>
          <!--          <el-link :href=scope.row.url type="primary" style="font-size: 1vw">查看</el-link>-->
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作" width="300">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary"
                       @click="jumpToMap(scope.$index, scope.row)">地图位置</el-button>
            <el-button type="warning"
                       @click="newTask(scope.$index, scope.row)">图像处理</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'DataCenter',
  data () {
    return {
      tableData: [
        {
          id: '1',
          satellite: 'GF1',
          text: '中国高分一号卫星',
          pos1: [30.6552, 113.672],
          pos2: [30.5877, 114.045],
          pos3: [30.2668, 113.966],
          pos4: [30.3343, 113.594],
          url: 'http://192.168.1.121:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg',
          position: '武汉'
        },
        {
          id: '1',
          satellite: 'GF1',
          text: '中国高分一号卫星',
          pos1: [30.6552, 113.672],
          pos2: [30.5877, 114.045],
          pos3: [30.2668, 113.966],
          pos4: [30.3343, 113.594],
          url: 'http://192.168.1.121:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg',
          position: '武汉'
        },
        {
          id: '1',
          satellite: 'GF1',
          text: '中国高分一号卫星',
          pos1: [30.6552, 113.672],
          pos2: [30.5877, 114.045],
          pos3: [30.2668, 113.966],
          pos4: [30.3343, 113.594],
          url: 'http://192.168.1.121:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg',
          position: '武汉'
        }, {
          id: '1',
          satellite: 'GF1',
          text: '中国高分一号卫星',
          pos1: [30.6552, 113.672],
          pos2: [30.5877, 114.045],
          pos3: [30.2668, 113.966],
          pos4: [30.3343, 113.594],
          url: 'http://192.168.1.121:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg',
          position: '武汉'
        }, {
          id: '1',
          satellite: 'GF1',
          text: '中国高分一号卫星',
          pos1: [30.6552, 113.672],
          pos2: [30.5877, 114.045],
          pos3: [30.2668, 113.966],
          pos4: [30.3343, 113.594],
          url: 'http://192.168.1.121:8000/GFData/srcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.jpg',
          position: '武汉'
        }
      ]
    }
  },
  mounted () {
    // this.$http.getAllSatellite().then(result => {
    //   for (let i in result) {
    //     result[i].url = 'http://192.168.1.121:8000/GFData/srcData' + result[i].url + '/' + result[i].url + ',jpg'
    //     this.tableData.push(result[i])
    //   }
    //
    // }).catch((reason) => {
    //   console.log(reason)
    // })
  },
  destroyed () {
    console.log('Task destroyed')
  },
  methods: {
    initData () {
    },
    onMessage (msg) {
    },
    jumpToMap (index, row) {
      console.log(index, row)
    },
    toImageDetail (index, row) {
      console.log(index, row)
      window.open(row['url'])
    }
  }
}
</script>
<style scoped>
  .Dbody{
    margin: auto;
    width: 95vw;
  }
</style>
