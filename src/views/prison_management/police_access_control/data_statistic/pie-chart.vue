<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-23 17:04:46
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-06 16:42:43
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
      if (val.length) {
        this.chart.hideLoading()
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
            textStyle: {
              color: 'black'
            }
          },
          legend: [
            {
              orient: 'vertical',
              left: '80%',
              top: '30%',
              data: ['女'],
              textStyle: {
                color: color()
              }
            },
            {
              orient: 'vertical',
              left: '80%',
              top: '46%',
              data: ['男'],
              textStyle: {
                color: color()
              }
            }
          ],
          color: ['#ED7038', '#56CAFF'],
          // graphic: [
          //   {
          //     type: 'text',
          //     left: '24%',
          //     top: '40%',
          //     style: {
          //       fill: '#686868',
          //       text: '监狱男女',
          //       font: '16px Microsoft YaHei'
          //     }
          //   }
          // ],
          series: [
            {
              name: '女',
              type: 'pie',
              roseType: 'radius',
              radius: [60, 80],
              center: ['35%', 'center'],
              data: val,
              animationEasing: 'cubicInOut',
              animationDuration: 2000,
              labelLine: {
                normal: {
                  length: 20,
                  length2: 50
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
