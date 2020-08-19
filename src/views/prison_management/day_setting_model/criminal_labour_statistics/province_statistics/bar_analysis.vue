<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 14:40:28
 -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts' // echarts theme
import color from '@/utils/echarts_color'
import resize from '@/utils/mixins/resize.js'

const animationDuration = 2000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    haveMark: {
      type: Boolean,
      default: true
    },
    chartName: {
      type: String,
      default: '统计图'
    },
    height: {
      type: String,
      default: '300px'
    },
    labelType: {
      type: String,
      default: '小时'
    },
    barAnalysisData: {
      type: Object,
      default: () => {
        return { xAxis: [], yAxis: [] }
      }
    },
    date: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chart: null,
      newDate: ''
    }
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
      this.setOption(this.barAnalysisData)
    },
    setOption ({ xAxis, yAxis }) {
      let that = this
      let arr = []
      let mark = null
      if (this.haveMark) {
        mark = {
          silent: true,
          data: [
            {
              name: '劳动时长警戒线',
              yAxis: 8
            }
          ],
          label: {
            show: false
          },
          lineStyle: {
            color: 'red'
          }
        }
      }
      xAxis.forEach((item, i) => {
        arr.push({
          name: item,
          type: 'bar',
          data: [{ value: yAxis[i] }],
          barWidth: '1%',
          barGap: '210%',

          markLine: mark
        })
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            return params.seriesName + ':' + params.value + that.labelType
          }
          //    '{a}:{c}小时'
        },
        grid: {
          top: '45%',
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              name: this.chartName,
              iconStyle: { borderColor: '#43D3FF' }
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: [{ value: this.date.substring(0, 10) }],
            axisTick: {
              alignWithLabel: false
            },
            axisLabel: {
              interval: 0, // 强制文字产生间隔
              // rotate: 90, // 文字逆时针旋转45°
              textStyle: {
                fontSize: 14
              }
              // formatter: function (value) {
              //   return value.split('').join('\n')
              // }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            minInterval: 1
          }
        ],
        legend: {
          data: xAxis,
          //   type: 'scroll',
          top: 5,
          textStyle: {
            color: color()
          }
        },
        series: arr
      })
    }
  },
  watch: {
    barAnalysisData: {
      deep: true,
      handler (val) {
        this.setOption(val)
      }
    }
  }
}
</script>
