<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-17 11:41:35
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
    height: {
      type: String / Function,
      default: '300px'
    },
    lineData: {
      type: Object,
      default: () => {
        return { xAxis: [], yAxis: [] }
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption(this.lineData)
    },
    setOption({ xAxis, yAxis }) {
      this.chart.setOption({
        grid: {
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['去年', '今年'],
          textStyle: {
            color: ['#fff']
          }
        },
        series: [
          {
            name: '去年',
            stack: '总量',
            type: 'line',
            smooth: false,
            data: yAxis.lastYear,
            itemStyle: {
              color: '#ED7038'
            }
          },
          {
            name: '今年',
            type: 'line',
            smooth: false,
            stack: '总量',
            data: yAxis.thisYear,
            itemStyle: {
              color: '#43B9FF'
            }
          }
        ]
      })
    }
  },
  watch: {
    lineData: {
      deep: true,
      handler(val) {
        this.setOption(val)
      }
    }
  }
}
</script>
