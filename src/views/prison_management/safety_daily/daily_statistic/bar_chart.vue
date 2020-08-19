<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:41:18
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
      type: Array,
      default: () => {
        return []
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
    },
    setOption (data) {
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
          color: ['#26A9FA', '#F6C215'],
          dataset: {
            dimensions: ['prisonName', '按时上报', '超时上报'],
            source: data
          },
          xAxis: {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#DBDBDB'
              }
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
          },
          yAxis: {
            minInterval: 1
          },
          series: [
            {
              type: 'bar',
              barMaxWidth: '20px'
            },
            {
              type: 'bar',
              barMaxWidth: '20px'
            }
          ]
        })
      } else {
        this.chrat.clear()
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
        this.setOption(val)
      }
    }
  }
}
</script>
