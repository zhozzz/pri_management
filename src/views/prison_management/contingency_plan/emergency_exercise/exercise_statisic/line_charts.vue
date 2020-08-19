<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 17:22:00
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:35:20
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
      type: Array,
      required: true,
      default: () => {
        ;[]
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
    setOptions (data) {
      if (data.length) {
        let dateList = []
        let result = []
        data.forEach(item => {
          dateList.push(item.name)
          result.push(item.result)
        })
        this.chart.hideLoading()
        this.chart.setOption({
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
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
            data: dateList,
            boundaryGap: true,
            axisTick: {
              show: false
            },
            textStyle: {
              color: '#C2C2C2' // 更改坐标轴文字颜色
            },
            axisLine: {
              lineStyle: {
                color: '#DBDBDB'
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
              color: '#C2C2C2' // 更改坐标轴文字颜色
            },
            axisLine: {
              lineStyle: {
                color: '#DBDBDB'
              }
            }
          },

          series: [
            {
              name: '演练次数',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#3888fa',
                  lineStyle: {
                    color: '#3888fa',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              data: result,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }
          ]
        })
      } else {
        this.chart.clear()
        this.chart.showLoading({
          text: '暂无数据',
          color: 'transparent',
          textColor: color,
          maskColor: 'transparent'
        })
      }
    }
  }
}
</script>
