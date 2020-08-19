<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-23 17:04:46
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-06 15:04:50
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
      this.chart = echarts.init(this.$el)
    },
    setOption (val = []) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            color: 'black'
          }
        },
        color: ['#139CEA', '#0368C8', '#77D2FF', '#3DB9FE', '#495EDE'],
        legend: {
          right: '0',
          bottom: '20%',
          orient: 'vertical',
          data: val.map(item => item.issue),
          textStyle: {
            color: color()
          }
        },
        series: [
          {
            name: '来访事由',
            type: 'pie',
            roseType: 'radius',
            radius: ['45%', '65%'],
            center: ['30%', '50%'],
            data: val.map(item => {
              return { value: item.num, name: item.issue }
            }),
            animationEasing: 'cubicInOut',
            animationDuration: 2000
          }
        ]
      })
    }
  },
  watch: {
    // chartData: {
    //   deep: true,
    //   handler (val) {
    //     this.setOption(val)
    //   }
    // },
    chartData (val) {
      this.setOption(val)
    }
  }
}
</script>
