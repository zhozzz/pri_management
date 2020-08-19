<!--
 * @Description: 监狱 异常统计
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-03 14:09:19
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-08 14:32:20
 -->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="yn_charts">
          <h3>各监狱设备故障总趋势</h3>
          <line-chart></line-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts">
          <h3>总故障率占比</h3>
          <gauge-chart></gauge-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts">
          <h3>故障设备占比分析</h3>
          <pie-chart></pie-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import gaugeChart from '../components/gauge_chart'
import pieChart from '../components/pie_chart'
import barChart from '../components/bar_chart'
import lineChart from '../components/line_chart'
export default {
  components: { gaugeChart, pieChart, barChart, lineChart },
  data () {
    return {
      activeName: 'data',
      bindData: {},
      queryData: {},
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: [{}]
      }
    }
  },
  methods: {
    reset () {
      this.bindData = {}
      this.queryData = {}
      this.tableData.pageNum = 1
      this.getAllPrisonInfo()
    },
    query () {
      this.queryData = this.bindData
      this.getAllPrisonInfo()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
