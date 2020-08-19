<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-06 15:54:24
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
    },
    setOption ({ xAxis, yAxis }) {
      if (xAxis.length) {
        this.chart.hideLoading()
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
              color: color()
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: xAxis,
              axisTick: {
                alignWithLabel: true,
                show: false
              },
              axisLine: {
                lineStyle: {
                  // color: "#6C6D6D",
                }
              },
              axisLabel: {
                textStyle: {
                  color: color()
                },
                interval: 0, // 强制文字产生间隔
                rotate: 60 // 文字逆时针旋转45°
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false
              }
            }
          ],

          series: [
            {
              name: '访问次数',
              type: 'bar',
              stack: 'vistors',
              data: yAxis,
              animationDuration,
              barWidth: 12,
              barGap: '10%' /* 多个并排柱子设置柱子之间的间距 */,
              barCategoryGap: '10%',
              itemStyle: {
                normal: {
                  color: color()
                }
              }
            }
          ]
        })
      } else {
        this.chart.clear()
        this.chart.showLoading({
          text: 'transparent',
          color: color(),
          textColor: color(),
          maskColor: 'transparent'
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
