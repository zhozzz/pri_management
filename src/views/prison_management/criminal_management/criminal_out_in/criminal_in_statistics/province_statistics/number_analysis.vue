<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:39:47
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
    chartName: {
      type: String,
      default: '统计图'
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
      this.setOption(this.chartData)
    },
    setOption ({ xAxis, yAxis }) {
      let sub = ''
      if (yAxis.length === 0) {
        sub = '此时段暂无数据'
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {
              iconStyle: { borderColor: '#43D3FF' }
            }
          }
        },
        title: {
          subtext: sub,
          subtextStyle: {
            align: 'right',
            fontSize: '15',
            fontWeight: 'bolder'
          }
        },
        grid: {
          top: 10,
          left: '6%',
          right: '3%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0, // 强制文字产生间隔
              rotate: 45, // 文字逆时针旋转45°
              textStyle: {
                fontSize: 13
              },
              color: color()
            },
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            }
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            stack: 'vistors',
            data: yAxis,
            animationDuration,
            barWidth: '28%',
            itemStyle: {
              color: '#43B9FF'
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
