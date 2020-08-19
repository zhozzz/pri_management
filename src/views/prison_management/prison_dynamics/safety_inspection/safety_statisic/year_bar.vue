<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-13 10:05:26
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
      default: '40rem'
    },
    chartName: {
      type: String,
      default: '统计'
    },
    chartData: {
      type: Array,
      default: () => []
    },
    dimensions: {
      type: Array,
      default: () => ['prison', '排查数', '整改数']
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
    setOption (data) {
      let that = this
      let series = []

      for (let index = 1; index < that.dimensions.length; index++) {
        series.push({
          type: 'bar',
          label: {
            show: true,
            position: 'top'
          }
        })
      }
      if (data.length) {
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
          toolbox: {
            feature: { saveAsImage: { name: this.chartName } }
          },
          grid: {
            top: '8%',
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            left: 'center',
            top: '1%',
            textStyle: {
              color: color()
            }
          },
          color: ['#43D3FF', '#F17037', '#036DCF'],
          dataset: {
            dimensions: that.dimensions,
            source: data
          },
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: color()
                }
              },
              textStyle: {
                color: color() // 更改坐标轴文字颜色
              },
              minInterval: 1,
              axisTick: {
                alignWithLabel: true,
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: color()
                },
                color: color()
              }
            }
          ],
          yAxis: [
            {
              type: 'value',

              axisTick: {
                alignWithLabel: true,
                show: false
              },
              textStyle: {
                color: color() // 更改坐标轴文字颜色
              },
              axisLabel: { interval: 0, color: color() },
              minInterval: 1,

              axisLine: {
                lineStyle: {
                  color: color()
                }
              }
            }
          ],
          series: series
        })
      } else {
        this.chart.clear()
        this.chart.showLoading({
          text: '暂无数据',
          color: 'transparent',
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
        if (this.chart !== null) {
          this.setOption(val)
        }
      }
    }
  }
}
</script>
