<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-06 16:42:08
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
      this.chart = echarts.init(this.$el, 'macarons')
    },
    setOption (chartData) {
      if (chartData.length) {
        this.chart.hideLoading()
        this.chart.setOption({
          noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
              effect: {
                n: 0
              }
            }
          },
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
            left: 'center',
            top: '0',
            itemWidth: 16, // 设置宽度
            itemHeight: 16, // 设置高度
            itemGap: 40, // 设置间距
            textStyle: {
              color: color()
            }
          },
          color: ['#86D7FF', '#F8B72B'],
          dataset: {
            dimensions: ['name', '总数量', '超时时间'],
            source: chartData
          },
          xAxis: {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
              show: false
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
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#DBDBDB'
              }
            }
          },
          series: [{ type: 'bar' }, { type: 'bar' }]
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
