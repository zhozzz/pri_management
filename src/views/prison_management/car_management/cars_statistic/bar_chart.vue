<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-13 10:24:21
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
    chartData: {
      type: Array,
      default: () => []
    },
    dimensions: {
      type: Array,
      default: () => ['date', '平均时长', '最短时长', '最大时长']
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
      if (data.length) {
        this.chart.hideLoading()
        this.chart.setOption({
          //   backgroundColor: '#FBFCFF',
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
            top: '10%',
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            itemWidth: 16,
            itemHeight: 16,
            itemGap: 20,
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
              axisTick: {
                alignWithLabel: true,
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: color()
                },
                interval: 0,
                rotate: 40
              }
            }
          ],
          yAxis: [
            {
              axisTick: {
                alignWithLabel: true,
                show: false
              },
              textStyle: {
                color: color() // 更改坐标轴文字颜色
              },
              axisLine: {
                lineStyle: {
                  color: color()
                }
              }
            }
          ],
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
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
