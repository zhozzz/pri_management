<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-23 17:04:46
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-06 16:41:56
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
      this.chart = echarts.init(this.$el, '')
    },
    setOption (val = []) {
      let legend = val.map(item => item.name)
      if (val.length) {
        this.chart.hideLoading()
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
            textStyle: {
              color: color()
            }
          },
          color: ['#139CEA', '#0368C8', '#77D2FF', '#3DB9FE', '#495EDE'],

          legend: {
            orient: 'vertical',
            left: '70%',
            top: '24%',
            itemGap: 24,
            data: legend,
            textStyle: {
              color: color()
            }
          },
          graphic: [
            {
              type: 'text',
              left: '5%',
              top: '5%',
              style: {
                fill: color(),
                text: '危险物品种类',
                font: '16px Microsoft YaHei'
              }
            }
          ],
          series: [
            {
              name: '',
              type: 'pie',
              roseType: 'radius',
              radius: [60, 80],
              center: ['35%', '44%'],
              data: val,
              animationEasing: 'cubicInOut',
              animationDuration: 2000,
              labelLine: {
                normal: {
                  length: 10,
                  length2: 40
                }
              },
              label: {
                normal: {
                  position: 'outside',
                  formatter: ' {b}：{c} \n\n',
                  borderWidth: 20,
                  borderRadius: 4,
                  padding: [0, -50]
                }
              }
            }
          ]
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
    chartData (val) {
      this.setOption(val)
    }
  }
}
</script>
