<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 14:27:52
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
      type: String,
      default: '300px'
    },
    chartName: {
      type: String,
      default: '统计图'
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
      this.chart = echarts.init(this.$el)
      this.setOption(this.chartData)
    },
    setOption ({ xAxis, yAxis }) {
      if (yAxis.length == 0) {
        this.chart.clear()
        this.chart.showLoading({
          text: '暂无数据',
          color: 'transparent',
          textColor: color(),
          maskColor: 'transparent'
        })
      } else {
        this.chart.hideLoading()
        this.chart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            feature: {
              saveAsImage: {
                name: this.chartName,
                iconStyle: { borderColor: '#43D3FF' }
              }
            }
          },
          color: ['#3FC9F5'],

          grid: {
            top: 20,
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
                alignWithLabel: true
              },
              axisLabel: {
                interval: 0, // 强制文字产生间隔
                rotate: 45, // 文字逆时针旋转45°
                textStyle: {
                  fontSize: 14
                },
                color: color()
              },
              axisLine: {
                lineStyle: {
                  color: color()
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              minInterval: 1,
              axisLabel: {
                interval: 0, // 强制文字产生间隔

                textStyle: {
                  fontSize: 14
                },
                color: color()
              },
              axisLine: {
                lineStyle: {
                  color: color()
                }
              }
            }
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              barWidth: '30%',
              data: yAxis,
              animationDuration
            }
          ]
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
