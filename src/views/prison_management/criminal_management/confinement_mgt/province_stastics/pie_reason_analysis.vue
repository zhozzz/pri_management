<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 14:17:09
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
    chartName: {
      type: String,
      default: '统计图'
    },
    height: {
      type: String,
      default: '300px'
    },
    pieReasonData: {
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
      this.chart = echarts.init(this.$el)
      this.setOption(this.pieReasonData)
    },
    setOption (data) {
      if (data.length == 0) {
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
            formatter: '{b} <br/>{c}人 ({d}%)' // 模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
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
            data: data,
            orient: 'vertical',
            formatter: function (name) {
              let total = 0
              let value = ''
              data.forEach(item => {
                item.name == name ? (value = Number(item.value)) : ''
                total += Number(item.value)
              })

              if (total === 0) {
                return name + '  0%'
              } else {
                return name + '  ' + ((value / total) * 100).toFixed(2) + '%'
              }
            },
            textStyle: {
              color: color()
            }
          },
          color: [
            '#46B9FE',
            '#0368C8',
            '#139BEA',
            '#F8B72B',
            '#435EDE',
            '#77D2FF',
            '#036ACD'
          ],
          series: [
            {
              name: '人数',
              type: 'pie',
              stack: 'vistors',
              data: data,
              animationDuration,
              center: ['30%', '50%'],
              radius: ['30%', '50%']
            }
          ]
        })
      }
    }
  },
  watch: {
    pieReasonData: {
      deep: true,
      handler (val) {
        this.setOption(val)
      }
    }
  }
}
</script>
