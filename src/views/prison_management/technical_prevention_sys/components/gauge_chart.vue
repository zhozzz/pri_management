<!--
 * @Description:故障率仪表盘
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-02 17:26:01
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-08 14:32:42
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
      this.setOption()
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
    setOption () {
      this.chart.setOption({
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            roseType: 'radius',
            animationEasing: 'cubicInOut',
            animationDuration: 2000,
            name: '设备故障率',
            type: 'gauge',
            detail: { formatter: '{value}%' },
            data: [{ value: 0, name: '总故障率' }]
          }
        ]
      })
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
