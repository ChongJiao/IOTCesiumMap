<template>
  <div class="body">
    <div class = "head">{{describeText}}数 据 统 计</div>
    <el-row :gutter="20" style="margin-bottom: 2vh; text-align: left">
      <el-col :span="16"><div class="grid-content bg-purple">{{describeText}} 总 数</div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple number">{{totalNumber}}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 2vh; text-align: left">
      <el-col :span="16"><div class="grid-content bg-purple">已 {{statusText}}</div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple number">{{finishedNumber}}</div></el-col>
    </el-row>
    <el-row :gutter="20" style="text-align: left">
      <el-col :span="16"><div class="grid-content bg-purple">未 {{statusText}}</div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple number">{{totalNumber - finishedNumber}}</div></el-col>
    </el-row>

    <v-chart ref="chart1" :options="trHisOptions" :autoresize="true" class="myEchart"></v-chart>
    <v-chart ref="chart2" :options="orgOptions" :autoresize="true" class="myEchart"></v-chart>

  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

export default {
  name: 'Statistics',
  components: {
    'v-chart': ECharts
  },
  props: {
    totalNumber: {
      type: Number,
      require: true,
      default: 10
    },
    finishedNumber: {
      type: Number,
      require: true,
      default: 2
    },
    describeText: {
      type: String,
      require: true,
      default: '资源'
    },
    statusText: {
      type: String,
      require: true,
      default: '订阅'
    },
    content: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      orgOptions: {},
      trHisOptions: {},
      numberValList: [],
      timeValList: []
    }
  },
  mounted () {
    let timeCount = {}
    for (let i in this.content) {
      let date = new Date(this.content[i].updateTime)
      let year = date.getFullYear()
      let nowDate = new Date()
      let nowYear = nowDate.getFullYear()
      if (nowYear > year) { continue }
      let month = date.getMonth() + 1
      let day = date.getDate()
      let timeStr = month + '-' + day
      if (timeCount[timeStr] === undefined) {
        timeCount[timeStr] = 1
      } else {
        timeCount[timeStr] += 1
      }
    }
    for (const [key, val] of Object.entries(timeCount)) {
      this.timeValList.push(key)
      this.numberValList.push(val)
    }

    this.orgOptions = {
      title: {
        show: true,
        text: this.describeText + '记录'
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '15%',
        top: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          name: '时间',
          boundaryGap: true,
          data: this.timeValList
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: '个数',
          max: 15,
          min: 0,
          boundaryGap: [0.2, 0.2]
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{b} 日 {a} : {c}'
      },
      series: [
        {
          name: this.describeText + '数 量',
          type: 'line',
          data: this.numberValList
        }
      ]
    }
    this.trHisOptions = {
      title: {
        show: true,
        text: this.describeText + this.statusText + '统计'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [
            {value: this.totalNumber - this.finishedNumber, name: '未' + this.statusText},
            {value: this.finishedNumber, name: '已' + this.statusText}
          ],
          roseType: 'angle',
          itemStyle: {
            normal: {
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      tooltip: {
        trigger: 'item',
        formatter: this.describeText + '数 <br/>{b} : {c}'
      }
    }
  }
}
</script>

<style scoped>
.head{
  color: #d54d7b;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 2.2rem;
  font-weight: normal;
  text-align: center;
  text-shadow: 0 1px 1px #fff;
}
.number{
  color: white;
  font-family: 'Rouge Script', cursive;
  font-size: 2rem;
  font-weight: normal;
  text-shadow: 2px 2px 4px #082b34;
}
.myEchart{
  width: 30vh;
  height: 30vh;
  opacity: 1;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2vh;
}
</style>
