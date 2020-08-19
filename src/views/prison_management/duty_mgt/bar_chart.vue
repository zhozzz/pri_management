<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 16:03:03
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-03 10:28:48
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
    // 数据
    dataList: {
      type: Object,
      default: () => {}
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
  watch: {
    dataList: {
      deep: true,
      handler(val) {
        this.setOption()
      }
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOption()
    },
    setOption() {
      if (this.dataList.length == 0) {
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
            trigger: 'axis',
            formatter: '{b}: {c}人'
          },
          color: ['#0368CA', '#74D2FF', '#F8B72B', '#EB5D1E'],

          grid: { containLabel: true },
          legend: {
            data: ['警察值班', '辅警值班', '警察备勤', '辅警备勤'],
            textStyle: {
              color: color()
            }
          },
          xAxis: {
            data: this.dataList.dateList,
            axisLabel: {
              textStyle: {
                color: color()
              }
            },
            axisLine: {
              lineStyle: {
                color: color()
              }
            }
          },
          yAxis: {
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: color()
              }
            },
            axisLabel: {
              textStyle: {
                color: color()
              }
            }
          },

          series: [
            {
              name: '警察值班',
              type: 'bar',
              stack: '总量',
              data: this.dataList.dutyPoliceCount
            },
            {
              name: '辅警值班',
              type: 'bar',
              stack: '总量',
              data: this.dataList.dutyAuxCount
            },
            {
              name: '警察备勤',
              type: 'bar',
              stack: '总量',
              data: this.dataList.prePoliceCount
            },
            {
              name: '辅警备勤',
              type: 'bar',
              stack: '总量',
              data: this.dataList.preAuxCount
            }
          ]
        })
      }
    }
  }
}
</script>
