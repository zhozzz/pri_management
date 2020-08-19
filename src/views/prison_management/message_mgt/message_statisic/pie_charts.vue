<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 16:03:03
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-07 16:21:46
 -->

<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts' // echarts theme
import color from '@/utils/echarts_color'
import resize from '@/utils/mixins/resize.js'
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
    tipName: {
      type: String,
      default: '数量'
    },
    dataList: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    initChart() {
      let that = this
      this.chart = echarts.init(this.$el)
      this.setOption()
      this.chart.on('legendselectchanged', function(params) {
        if (params.name === '上级领导') {
          that.$emit('selLeader')
        }
      })
      this.chart.on('click', function(params) {
        if (params.name === '上级领导') {
          that.$emit('selLeader')
        }
      })
    },
    setOption() {
      let dataList = this.dataList
      let subText = ''
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
            title: { subtext: subText },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              left: '10',
              bottom: '20',
              data: this.dataList,
              orient: 'vertical',
              textStyle: {
                color: color()
              },
              formatter: function(name) {
                let total = 0
                let value = 0
                dataList.forEach(item => {
                  total += Number(item.value)
                  item.name == name ? (value = item.value) : ''
                })
                if (total == 0) {
                  return name
                } else {
                  return (
                    name +
                    ' ' +
                    value +
                    '条 ' +
                    ((value / total) * 100).toFixed(2) +
                    '%'
                  )
                }
              }
            },
            color: ['#036DCF', '#86D7FF'],
            series: [
              {
                name: this.tipName,
                type: 'pie',
                roseType: 'radius',
                radius: ['35%', '50%'],
                center: ['60%', '40%'],
                data: this.chartData,
                animationEasing: 'cubicInOut',
                animationDuration: 1000
              }
            ]
          })
        }
      }
    }
  },
  watch: {
    chartData: {
      handler(val, old) {
        this.chartData = val
        this.setOption()
      },
      deep: true
    },
    dataList: {
      handler(val, old) {
        this.dataList = val
        this.setOption()
      },
      deep: true
    }
  }
}
</script>
