<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-06 15:04:27
 -->
<template>
  <div :class="className"
       :style="{height:height,width:width}" />
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
      type: String,
      default: '300px'
    },
    chartData: {
      type: Array,
      default: () => {
        return []
      }
    },
    dimensions: {
      type: Array,
      default: () => []
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
      this.chart = echarts.init(this.$el)
    },
    setOption (data) {
      if (data.length) {
        let dimensions = this.dimensions
        let series = []

        for (let index = 1; index < dimensions.length; index++) {
          series.push({
            type: 'bar'
          })
        }
        this.chart.hideLoading()
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
              color: 'black'
            }
          },
          grid: {
            top: 30,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            left: 'center',
            top: 0,
            textStyle: {
              color: color()
            }
          },
          color: ['#43D3FF', '#036DCF', '#F17037'],
          dataset: {
            dimensions: dimensions,
            source: data
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 0, // 强制文字产生间隔
              rotate: 60, // 文字逆时针旋转45°
              color: '#333',
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            }
          },
          yAxis: {
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            }
          },
          series: series
        })
      } else {
        this.chart.showLoading({
          text: '暂无数据',
          color: '#ffffff',
          textColor: '#8a8e91',
          maskColor: '#fbfcff'
        })
      }
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
