<template>
  <div class="hello">
    <h1>处理节点状态实时显示</h1>
    <v-chart ref="chart1" :options="orgOptions" :autoresize="true" class="myEchart"></v-chart>
    <v-chart ref="chart2" :options="preHisOptions" :autoresize="true" class="myEchart"></v-chart>
    <v-chart ref="chart2" :options="cfHisOptions" :autoresize="true" class="myEchart"></v-chart>
    <v-chart ref="chart2" :options="enHisOptions" :autoresize="true" class="myEchart"></v-chart>
    <v-chart ref="chart2" :options="trHisOptions" :autoresize="true" class="myEchart"></v-chart>
    <v-chart ref="chart2" :options="clHisOptions" :autoresize="true" class="myEchart"></v-chart>
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
  name: 'NodesChart',
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      orgOptions: {},
      preHisOptions: {},
      cfHisOptions: {},
      enHisOptions: {},
      trHisOptions: {},
      clHisOptions: {}
    }
  },
  mounted () {
    this.orgOptions = {
      title: {
        show: true,
        text: '任务运行效率统计',
        x: 'center',
        y: 'bottom',
        textAlign: 'center'
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '15%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false// 隐藏x坐标轴刻度
        },
        // x轴字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: '#42436A',
            fontSize: '12'
          },
          rotate: '30' // 字体倾斜角度
        },
        // x轴颜色
        axisLine: {
          lineStyle: {
            color: '#e4e4e4'
          }
        },
        data: ['周一', '周二', '周三', '周四', '周五']
      },
      yAxis: {
        type: 'value',
        minInterval: 1, // 只显示整数
        axisLine: {
          show: false// 隐藏y坐标轴
        },
        // y轴字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: '#9495ab',
            fontSize: '12'
          }
        },
        // 网格样式
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e4e4e4',
            width: 1,
            type: 'solid'
          }
        },
        axisTick: {
          show: false// 隐藏y坐标轴刻度
        },
        data: ['周一', '周二', '周三', '周四', '周五']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{a} {b} : {c}'
      },
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: 12, // 柱体宽度
          itemStyle: {
            normal: {
              // 柱体圆角
              barBorderRadius: [10, 10, 0, 0],
              // 柱体颜色渐变
              color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#6A88FF'
              }, {
                offset: 1,
                color: '#3787FF'
              }])
            }
          },
          data: [20, 35, 18, 36, 47]
        },
        {
          name: '',
          type: 'bar',
          barWidth: 12, // 柱体宽度
          itemStyle: {
            normal: {
              // 柱体圆角
              barBorderRadius: [10, 10, 0, 0],
              // 柱体颜色渐变
              color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#6A88FF'
              }, {
                offset: 1,
                color: '#3787FF'
              }])
            }
          },
          data: [18, 27, 32, 44, 46]
        },
        {
          name: '',
          type: 'bar',
          barWidth: 12, // 柱体宽度
          itemStyle: {
            normal: {
              // 柱体圆角
              barBorderRadius: [10, 10, 0, 0],
              // 柱体颜色渐变
              color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#6A88FF'
              }, {
                offset: 1,
                color: '#3787FF'
              }])
            }
          },
          data: [25, 31, 32, 52, 61]
        },
        {
          name: '',
          type: 'bar',
          barWidth: 12, // 柱体宽度
          itemStyle: {
            normal: {
              // 柱体圆角
              barBorderRadius: [10, 10, 0, 0],
              // 柱体颜色渐变
              color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#FFCA41'
              }, {
                offset: 1,
                color: '#FBAD54'
              }])
            }
          },
          data: [18, 27, 16, 53, 55]
        }
      ]
    }
    this.preHisOptions = {
      title: {
        show: true,
        text: '数据预处理cpu',
        x: 'center',
        y: 'bottom',
        textAlign: 'center'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [
            {value: 76, name: '未使用'},
            {value: 24, name: '已使用'}
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
        formatter: '使用率 <br/>{b} : {c}'
      }
    }
    this.cfHisOptions = {
      title: {
        show: true,
        text: '数据融合矫正节点cpu',
        x: 'center',
        y: 'bottom',
        textAlign: 'center'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [
            {value: 60, name: '未使用'},
            {value: 40, name: '已使用'}
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
        formatter: '使用率 <br/>{b} : {c}'
      }
    }
    this.enHisOptions = {
      title: {
        show: true,
        text: '图像增强节点cpu',
        x: 'center',
        y: 'bottom',
        textAlign: 'center'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [
            {value: 56, name: '未使用'},
            {value: 44, name: '已使用'}
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
        formatter: '使用率 <br/>{b} : {c}'
      }
    }
    this.trHisOptions = {
      title: {
        show: true,
        text: '目标识别节点cpu',
        x: 'center',
        y: 'bottom',
        textAlign: 'center'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [
            {value: 45, name: '未使用'},
            {value: 55, name: '已使用'}
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
        formatter: '使用率 <br/>{b} : {c}'
      }
    }
    this.clHisOptions = {
      title: {
        show: true,
        text: '小电脑组网cpu',
        x: 'center',
        y: 'bottom',
        textAlign: 'center'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [
            {value: 45, name: '电脑1号'},
            {value: 55, name: '电脑2号'},
            {value: 45, name: '电脑3号'},
            {value: 55, name: '电脑3号'}
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
        formatter: '剩余使用 <br/>{b} : {c}'
      }
    }
  }
}
</script>

<style scoped>
  .hello {
    margin-left: 10vw;
    width: 90vw;
    height: 100vh;
  }
  .myEchart{
    width: 30vw;
    height: 45vh;
    float: left;
  }
</style>
