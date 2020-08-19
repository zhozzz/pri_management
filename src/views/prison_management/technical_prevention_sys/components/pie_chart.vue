<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-23 17:04:46
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-08 14:32:56
 -->
<template>
  <div :class="className"
       :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts' // echarts theme
import resize from '@/utils/mixins/resize'
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
    setOption (val = []) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '0',
          data: ['正常', '危险', '超标']
        },
        series: [
          {
            name: '故障设备占比',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: val,
            animationEasing: 'cubicInOut',
            animationDuration: 2000
          }
        ]
      })
    }
  },
  watch: {
    chartData (val) {
      this.setOption(val)
    }
  }
}
</script>
