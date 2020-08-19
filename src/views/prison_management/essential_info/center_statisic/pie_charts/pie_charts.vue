<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 16:03:03
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-12 09:46:45
 -->

<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts' // echarts theme
import resize from '@/utils/mixins/resize.js'
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
    titleName: {
      type: String
    },
    height: {
      type: String,
      default: '30rem'
    },
    tipName: {
      type: String,
      default: '类型'
    },
    dataList: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    },
    radius: {
      type: Array / String,
      default: () => ['50%', '70%']
    },
    roseType: {
      type: String / Boolean,
      default: 'radius'
    },
    centerTitle: {
      type: Array,
      default: () => ['总计', '人'] // 名字，单位
    },
    showTotalNum: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  created () {
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
      this.setOption()
    },
    setOption () {
      let dataList = this.dataList
      let chartData = []

      let centerTitle = this.centerTitle
      let showTotalNum = this.showTotalNum
      let subText = ''
      let pieTotal = 0

      this.chartData.forEach((item, i) => {
        pieTotal += Number(item.value)
        if (item.value != 0) {
          chartData.push(item)
        }
      })

      if (chartData.length == 0) {
        this.chart.clear()
        this.chart.showLoading({
          text: '暂无数据',
          color: 'transparent',
          textColor: color(),
          maskColor: 'transparent'
        })
      } else {
        this.chart.hideLoading()

        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            right: '10',
            bottom: '10',
            data: dataList,
            orient: 'vertical',
            textStyle: {
              color: color()
            },
            formatter: function (name) {
              let total = 0
              let value = ''
              chartData.forEach(item => {
                item.name == name ? (value = Number(item.value)) : ''
                total += Number(item.value)
              })
              return (
                name +
                ' ' +
                value +
                '人' +
                ((value / total) * 100).toFixed(2) +
                '%'
              )
            }
          },
          color: [
            '#0480F4',
            '#69A3EE',
            '#C9E4FC',
            '#193B71',
            '#D0F1F4',
            '#7CC9DA'
          ],
          title: { text: this.titleName, subtext: subText },
          series: [
            {
              name: this.tipName,
              type: 'pie',
              roseType: this.roseType,
              radius: this.radius,
              center: ['30%', '50%'],
              data: chartData,
              animationEasing: 'cubicInOut',
              animationDuration: 1000,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: argument => {
                    var html
                    if (showTotalNum) {
                      html =
                        this.centerTitle[0] +
                        '\r\n\r\n' +
                        pieTotal +
                        this.centerTitle[1]
                    } else if (chartData.length > 1) {
                      html =
                        this.centerTitle[0] +
                        '\r\n\r\n' +
                        '1:' +
                        (chartData[1].value / chartData[0].value).toFixed(2) +
                        this.centerTitle[1]
                    }
                    return html
                  },
                  textStyle: {
                    fontSize: 14,
                    color: color()
                  }
                }
              }
            }
          ]
        })
      }
    }
  },
  watch: {
    chartData: {
      handler (val, old) {
        this.chartData = val
        this.setOption()
      },
      deep: true
    },
    dataList: {
      handler (val, old) {
        this.dataList = val
        this.setOption()
      },
      deep: true
    }
  }
}
</script>
