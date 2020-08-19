<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 11:46:54
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
    centerTitle: {
      type: String
    },
    pieTotal: {
      type: Number
    },
    pieTypeData: {
      type: Array
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
      this.setOption(this.pieTypeData)
    },
    setOption (data) {
      this.chart.setOption({
        tooltip: {
          formatter: '{b} <br/>{c}人 ({d}%)' // 模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          orient: 'vertical',
          //   top: "middle",
          bottom: 20,
          right: '10',
          data: data,
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
            // 显示指示线
            name: '百分比',
            type: 'pie',
            radius: ['50%', '70%'], // 饼图的半径大小
            center: ['30%', '50%'],
            data: data // 此处传入两遍数组为关键处,百分比和指示线文字为两张饼图,叠加在一起显示效果
          },
          {
            name: '百分比',
            type: 'pie',
            data: data,
            center: ['30%', '50%'],
            radius: ['50%', '70%'],
            normal: {
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)'
              },
              labelLine: { show: true }
            },
            label: {
              normal: {
                show: true,
                position: 'center',
                formatter: argument => {
                  var html
                  html = this.centerTitle + '\r\n\r\n' + this.pieTotal + '名'
                  return html
                },
                textStyle: {
                  fontSize: 15,
                  color: '#39CCCC'
                }
              }
            }
          }
        ]
      })
    }
  },
  watch: {
    pieTypeData: {
      deep: true,
      handler (val) {
        this.setOption(val)
      }
    }
  }
}
</script>
