<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:40:31
 -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts' // echarts theme
import resize from '@/utils/mixins/resize.js'
import color from '@/utils/echarts_color'

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
    chartName: {
      type: String,
      default: '统计图'
    },
    height: {
      type: String,
      default: '300px'
    },
    lineReasonData: {
      type: Object,
      default: () => {
        return { xAxis: [], yAxis: [] }
      }
    }
  },
  data () {
    return {
      chart: null
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
      //   this.setOption(this.lineReasonData)
    },
    setOption ({ xAxis, yAxis }) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLine: {
            lineStyle: {
              color: color()
            }
          },
          axisLabel: { color: color() }
        },
        color: ['#036DCF', '#86D7FF'],

        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: color()
            }
          },
          axisLabel: { interval: 0, color: color() }
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          feature: { saveAsImage: { name: this.chartName } }
        },
        legend: {
          data: ['当前年度', '去年统计'],
          textStyle: {
            color: color()
          }
        },
        series: [
          {
            name: '当前年度',
            type: 'line',
            smooth: false,
            data: yAxis.rate,
            label: {
              show: true,
              formatter: ' {c}%'
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#98D87D'
                  },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ])
              }
            },
            itemStyle: {
              color: '#98D87D'
            }
          },
          {
            name: '去年统计',
            type: 'line',
            smooth: false,
            data: yAxis.yearRate,
            label: {
              show: true,
              formatter: ' {c}%'
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#49A9EE'
                  },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ])
              }
            },
            itemStyle: {
              color: '#49A9EE'
            }
          }
        ]
      })
    }
  },
  watch: {
    lineReasonData: {
      deep: true,
      handler (val) {
        if (this.chart !== null) {
          this.setOption(val)
        }
      }
    }
  }
}
</script>
