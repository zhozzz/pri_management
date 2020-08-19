<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:45:21
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
    lineReasonData: {
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
      this.setOption(this.lineReasonData)
    },
    setOption ({ xAxis, yAxis }) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: xAxis
        },
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
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '入监人数',
            type: 'line',
            stack: '总量',
            data: yAxis,
            smooth: false,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#43B9FF'
                  },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ])
              }
            },
            itemStyle: {
              color: '#43B9FF'
            }
          }
        ]
      })
    }
  },
  watch: {
    lineReasonData: {
      deep: true,
      handler (val) {
        this.setOption(val)
      }
    }
  }
}
</script>
