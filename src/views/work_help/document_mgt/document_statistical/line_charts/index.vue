<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 16:03:03
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 17:36:02
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
      default: '300px'
    },
    // 类型
    dataList: {
      type: Array,
      default: () => ['省局', '其他']
    },
    chartData: {
      type: Object,
      default: () => {}
    },
    // 数据
    prisonData: {
      type: Array,
      default: () => []
    },
    centerData: {
      type: Array,
      default: () => []
    },
    // 时间
    dateList: {
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
      this.chart = echarts.init(this.$el)
      this.setOption()
    },
    setOption() {
      let centerList = []
      let prisonList = []
      this.dateList.forEach(item => {
        centerList.push({ day: item, value: 0 })
        prisonList.push({ day: item, value: 0 })
      })
      this.chartData.centerData.forEach(item => {
        centerList.forEach(obj => {
          item.creatDay == obj.day ? (obj.value = item.countNum) : ''
        })
      })
      this.chartData.prisonData.forEach(item => {
        prisonList.forEach(obj => {
          item.creatDay == obj.day ? (obj.value = item.countNum) : ''
        })
      })
      if (
        this.chartData.centerData.length === 0 &&
        this.chartData.prisonData.length === 0
      ) {
        if (this.chart) {
          this.chart.clear()

          this.chart.showLoading({
            text: '暂无数据',
            color: 'transparent',
            textColor: color(),
            maskColor: 'transparent'
          })
        }
      } else {
        this.chart.hideLoading()

        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}号 : {c}条'
          },

          yAxis: {
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            }
          },
          xAxis: {
            data: this.dateList,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            },
            axisLabel: {
              color: color(),
              margin: '12'
            }
          },
          legend: {
            right: 0,
            top: 10,
            data: ['省局', '其他监狱'],
            orient: 'vertical',
            textStyle: {
              color: color()
            }
          },
          color: ['#0368CA', '#17CABF'],
          series: [
            {
              name: '省局',
              type: 'line',
              data: centerList,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#0368CA' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#fff' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            {
              name: '其他监狱',
              type: 'line',
              data: prisonList,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#17CABF' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#fff' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
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
      handler(val, old) {
        this.chartData = val
        this.setOption()
      },
      deep: true
    }
    // centerData: {
    //   handler (val, old) {
    //     this.centerData = val
    //     this.setOption()
    //   },
    //   deep: true
    // }
    // dateList: {
    //   handler(val, old) {
    //     this.dataList = val;
    //     this.setOption();
    //   },
    //   deep: true
    // }
  }
}
</script>
