<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 16:03:03
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-12 11:56:59
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
      default: '20rem'
    },
    // 数据
    dataList: {
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
  watch: {
    dataList: {
      deep: true,
      handler(val) {
        this.initChart()
      }
    },
    width(val) {
      //   console.log(val)
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOption()
    },
    setOption() {
      let dataList = []
      this.dataList.forEach(item => {
        dataList.push(item.name)
      })
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
            trigger: 'axis',
            formatter: '{b}: {c}人'
          },
          color: ['#2B8BEF'],
          grid: { containLabel: true },
          title: {
            text: '上报数据7日变化图',
            textStyle: {
              color: color()
            }
          },

          xAxis: {
            data: dataList,
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
          toolbox: {
            feature: {
              saveAsImage: {
                name: '上报数据七日变化图'
              }
            },
            iconStyle: {
              borderColor: '#43D3FF'
            }
          },
          series: [
            {
              type: 'line',
              data: this.dataList
            }
          ]
        })
      }
    }
  }
}
</script>
