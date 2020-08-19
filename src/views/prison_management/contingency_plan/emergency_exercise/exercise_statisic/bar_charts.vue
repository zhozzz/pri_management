<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:35:12
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
      default: () => ['prison', '总共开展演练次数', '不满足预期演练次数']
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
    },
    setOption(data) {
      let that = this
      let series = []

      for (let index = 1; index < that.dimensions.length; index++) {
        series.push({ type: 'bar' })
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
          toolbox: {
            feature: {
              saveAsImage: {
                name: this.chartName,
                iconStyle: { borderColor: '#43D3FF' }
              }
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
                  color: '#DBDBDB'
                }
              },
              textStyle: {
                color: '#C2C2C2' // 更改坐标轴文字颜色
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
                rotate: 60
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
                color: '#C2C2C2' // 更改坐标轴文字颜色
              },
              axisLine: {
                lineStyle: {
                  color: '#DBDBDB'
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
      handler(val) {
        this.setOption(val)
      }
    }
  }
}
</script>
