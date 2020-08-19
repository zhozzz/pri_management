<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 14:42:22
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
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['警察人数', '罪犯人数'],
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
        series: [
          {
            name: '警察人数',
            stack: '总量',
            type: 'line',
            smooth: false,
            data: yAxis.police,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#ED7038'
                  },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ])
              }
            },
            itemStyle: {
              color: '#ED7038'
            }
          },
          {
            name: '罪犯人数',
            type: 'line',
            smooth: false,
            stack: '总量',
            data: yAxis.criminal,
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
