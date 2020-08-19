<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 16:03:03
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:39:36
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
    chartName: {
      type: String,
      default: '统计图'
    },
    height: {
      type: String,
      default: '300px'
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
      default: () => ['总计', '次'] // 名字，单位
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
      let chartData = this.chartData
      let centerTitle = this.centerTitle
      let subText = ''
      let pieTotal = 0
      chartData.forEach(item => {
        pieTotal += Number(item.value)
      })
      if (this.chart != null) {
        if (dataList.length == 0) {
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
            toolbox: {
              feature: {
                saveAsImage: {
                  name: this.chartName,
                  iconStyle: { borderColor: '#43D3FF' }
                }
              }
            },
            legend: {
              right: '10',
              bottom: '10',
              data: this.dataList,
              orient: 'vertical',
              formatter: function (name) {
                let total = 0
                let value = ''
                chartData.forEach(item => {
                  item.name == name ? (value = Number(item.value)) : ''
                  total += Number(item.value)
                })
                return (
                  name +
                  '  ' +
                  value +
                  centerTitle[1] +
                  ((value / total) * 100).toFixed(2) +
                  '%'
                )
              },
              textStyle: {
                color: color()
              }
            },
            color: ['#74D2FF', '#0368CA', '#3CB9FE', '#F8B72B', '#EB5D1E'],
            title: { text: this.titleName, subtext: subText },
            series: [
              {
                name: this.tipName,
                type: 'pie',
                // roseType: this.roseType,
                // radius: this.radius,
                center: ['40%', '45%'],
                data: this.chartData,
                animationEasing: 'cubicInOut',
                animationDuration: 1000
                // label: {
                //   normal: {
                //     show: true,
                //     position: "center",
                //     formatter: argument => {
                //       var html;

                //       html =
                //         this.centerTitle[0] +
                //         "\r\n\r\n" +
                //         pieTotal +
                //         this.centerTitle[1];
                //       return html;
                //     },
                //     textStyle: {
                //       fontSize: 15,
                //       color: "#39CCCC"
                //     }
                //   }
                // }
              }
            ]
          })
        }
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
