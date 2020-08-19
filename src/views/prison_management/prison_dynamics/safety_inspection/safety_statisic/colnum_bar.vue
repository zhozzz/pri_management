<!--
 * @Description: 隐患排查管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-11 16:51:49

 -->
<template>
  <div class="chart" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts' // echarts theme
import color from '@/utils/echarts_color'
import resize from '@/utils/mixins/resize.js'
export default {
  mixins: [resize],

  name: 'colnum_bar',
  props: {
    chartData: {
      type: Object,
      default: () => {
        return { xAxis: [], yAxis: [] }
      }
    },
    chartName: {
      type: String,
      default: '统计'
    },
    width: {
      type: String,
      default: '100%'
    },

    height: {
      type: String,
      default: '60rem'
    }
  },
  data () {
    return { chart: null }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')
    },
    setOption ({ xAxis, yAxis }) {
      //   let arr = []
      //   xAxis.forEach((item, i) => {
      //     arr.push({
      //       name: item,
      //       type: 'bar',
      //       data: [{ value: yAxis[i] }]
      //     })
      //   })

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#036DCF', '#86D7FF'],

        grid: {
          top: '10%',
          left: '2%',
          right: '5%',
          bottom: '2%',
          containLabel: true
        },
        toolbox: {
          feature: { saveAsImage: { name: this.chartName } }
        },
        xAxis: [
          {
            type: 'value',
            axisTick: {
              alignWithLabel: false
            },
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: color()
              }
            },
            axisLabel: {
              interval: 0, // 强制文字产生间隔
              // rotate: 90, // 文字逆时针旋转45°
              textStyle: {
                fontSize: 14
              },
              color: color()
              // formatter: function (value) {
              //   return value.split('').join('\n')
              // }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            data: xAxis,
            axisLabel: { interval: 0, color: color() },
            axisLine: {
              lineStyle: {
                color: color()
              }
            }
          }
        ],
        // legend: {
        //   data: xAxis,
        //   top: 5,
        //   textStyle: {
        //     color: color()
        //   }
        // },
        series: [
          {
            name: '总数',
            type: 'bar',
            data: yAxis,
            label: {
              show: true,
              position: 'insideRight',
              formatter: data => {
                let str = data.value
                if (str !== 0) {
                  let total = 0
                  this.chartData.yAxis.map(item => {
                    total += item
                  })
                  str =
                    str + '(占全省的' + ((str / total) * 100).toFixed(2) + '%)'
                } else {
                  str = ''
                }
                return str
              }
            }
          }
        ]
      })
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.setOption(val)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.technology {
}
</style>
