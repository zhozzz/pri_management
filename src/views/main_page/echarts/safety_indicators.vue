<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 18:00:37
 * @LastEditors: fylih
 * @LastEditTime: 2019-09-06 18:05:41
 -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts"; // echarts theme
import resize from "@/utils/mixins/resize.js";

const animationDuration = 2000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    },
    chartData: {
      type: Object,
      default: () => {
        return { xAxis: [], yAxis: [] };
      }
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOption(this.chartData);
    },
    setOption({ xAxis, yAxis }) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
         legend: {
          orient: "horizontal",
          x: "center",
          y: "18%",
          itemWidth: 12, // 设置图例图形的宽
          itemHeight: 12, // 设置图例图形的高
          itemGap: 10,
          textStyle: {
            color: "#f1f1f1" // 图例文字颜色
          }
        },
        grid: {
          top: "25%",
          left: "6%",
          right: "4%",
          bottom: "4%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: "#305490"
              }
            },

            axisLabel: {
              interval: 0, // 强制文字产生间隔
              rotate: 25, // 文字逆时针旋转45°
              textStyle: {
                fontSize: 11,
                color: "#f1f1f1"
              },
              axisTick: {
                show: false
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            splitLine: { show: true, lineStyle: { type: "solid", color: "#305490"} },
            axisLine: {
              lineStyle: {
                color: "#305490"
              }
            }
          }
        ],
        series: [
          {
            name: "预警值",
            type: "bar",
            barWidth: 12,
            stack: "预警值",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(221,92,117,1)" },
                  { offset: 1, color: "rgba(221,92,117,0)" }
                ])
              }
            },
            data: yAxis
          },
          {
            name: "当前值",
            type: "bar",
            barWidth: 12,
            stack: "当前值",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(67,211,255,1)" },
                  { offset: 1, color: "rgba(67,211,255,0)" }
                ])
              }
            },
            data: yAxis
          },
          {
            name: "阀值",
            type: "bar",
            barWidth: 12,
            stack: "阀值",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(255,157,11,1)" },
                  { offset: 1, color: "rgba(255,157,11,0)" }
                ])
              }
            },
            data: yAxis
          }
        ]
      });
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOption(val);
      }
    }
  }
};
</script>
