<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:47:35
 -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts' // echarts theme
import resize from '@/utils/mixins/resize.js'

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
    chartName: {
      type: String,
      default: '统计图'
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
        yAxis: {
          type: 'value'
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
            type: 'bar',
            data: yAxis
          },
          {
            type: 'bar',
            data: yAxis
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
