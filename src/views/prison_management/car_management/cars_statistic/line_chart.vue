<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 17:22:00
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-13 10:24:54
 -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts' // echarts theme
import resize from '@/utils/mixins/resize.js'
import color from '@/utils/echarts_color'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true,
      default: () => {
        return { actualData: [] }
      }
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        console.log(val)

        this.setOptions(val)
      }
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
      // this.setOptions(this.chartData)
    },
    setOptions ({ actualKey, actualData } = {}) {
      if (actualKey.length) {
        this.chart.hideLoading()
        this.chart.setOption({
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            padding: [5, 10],
            textStyle: {
              color: color()
            }
          },
          xAxis: {
            data: actualKey,
            boundaryGap: true,
            axisTick: {
              show: false
            },
            textStyle: {
              color: color() // 更改坐标轴文字颜色
            },
            axisLine: {
              lineStyle: {
                color: color()
              }
            },
            axisLabel: {
              textStyle: {
                color: color()
              }
            }
          },
          yAxis: {
            axisTick: {
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
          },
          legend: {
            data: ['expected', 'actual'],
            textStyle: {
              color: color()
            }
          },
          series: [
            {
              name: '车辆数量',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: color(),
                  lineStyle: {
                    color: color(),
                    width: 2
                  },
                  areaStyle: {
                    color: color()
                  }
                }
              },
              data: actualData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
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
  }
}
</script>
