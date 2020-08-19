<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-06 17:23:04
 * @LastEditors: fylih
 * @LastEditTime: 2019-10-15 11:27:25
 -->
<!--
 * @Description:
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: fylih
 * @LastEditTime: 2019-09-06 17:32:12
 -->
<template>
  <div :class="className"
       :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'; // echarts theme
import resize from '@/utils/mixins/resize.js';

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
    pieData: {
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

      this.setOption(this.pieData)
    },
    setOption (data) {
      data.forEach((item, i) => {
        if (item == undefined) {
          data.splice(i, 1)
        }
      })
      this.chart.setOption({
        tooltip: {
          formatter: '{b} <br/>{c}人 ({d}%)' // 模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。
        },
        // legend: {
        //   orient: "horizontal",
        //   x: "70%",
        //   y: "center",
        //   itemWidth: 12, // 设置图例图形的宽
        //   itemHeight: 12, // 设置图例图形的高
        //   itemGap: 10,
        //   textStyle: {
        //     color: "#f1f1f1" // 图例文字颜色
        //   }
        // },
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            radius: ['20%', '40%'],
            center: ['50%', '55%'],
            type: 'pie',
            stack: 'vistors',
            data: data,
            animationDuration,
            labelLine: {
              normal: {
                length: 10, // 设置延长线的长度
                length2: 40 // 设置第二段延长线的长度
              }
            },
            label: {
              normal: {
                fontSize: 13,
                formatter: '{b}：{c}',
                borderWidth: 10,
                borderRadius: 0,
                padding: [5, -5]
                // textStyle: { color: '#f1f1f1' }
              }
            }
          }
        ]
      })
    }
  },
  watch: {
    pieData: {
      deep: true,
      handler (val) {
        this.setOption(val)
      }
    }
  }
}
</script>
