<!--
 * @Description:外来人员 数据统计
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-23 15:33:08
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:07:04
 -->

<template>
  <dept-layout v-model="changePrisonId">
    <menuTree :menuList="['监狱管理','AB门管理','警察进出管理']">
      <tab slot="heade_btn" name="警察进出详情" :left="true" pathName="police_access_control_query" />

      <!-- <div class="yn-chart-title">
        <div class="el-alert__content">
          <span class="title">警察进出数据统计</span>
          <router-link :to="{name:'police_access_control_query',query:{prisonId:changePrisonId}}">警察进出详情</router-link>
        </div>
      </div>-->
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="yn_charts">
            <h3>
              <span class="title">{{changePrisonId==1?'全省各监狱':'警察进出'}}AB门次数统计</span>
            </h3>
            <bar-chart v-loading="tableLoading" :chart-data="barChartData" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>进出男女人数占比</h3>
            <pei-chart v-loading="tableLoading" :chart-data="peiChartData" />
          </div>
        </el-col>
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import deptLayout from '@/components/deptLayout/index.vue'
import { pickerOptions } from '@/utils/picker_option_config.js'
import BarChart from './bar_chart'
import PeiChart from './pie-chart'
import { getPoliceAccessControlSummary } from './service'
import { getPrisonId } from '@/utils'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    BarChart,
    PeiChart,
    deptLayout,
    tab,
    menuTree
  },
  data() {
    return {
      tableLoading: false,
      changePrisonId: getPrisonId(),
      barChartData: {
        xAxis: [],
        yAxis: []
      },
      peiChartData: [],
      prisonId: ''
    }
  },
  methods: {
    getChartData() {
      // this.tableLoading = true
      // getPoliceAccessControlSummary({ prisonId: this.changePrisonId }).then(
      //   res => {
      //     this.barChartData = {
      //       xAxis: res.barXAxisData,
      //       yAxis: res.barYAxisData
      //     }
      //     if (res.pieData) {
      //       this.peiChartData = []
      //       for (let item in res.pieData) {
      //         this.peiChartData.push({ value: res.pieData[item], name: item })
      //       }
      //     }
      //     this.tableLoading = false
      //   },
      //   err => {
      //     this.tableLoading = false
      //   }
      // )
    }
  },
  watch: {
    changePrisonId() {
      this.getChartData()
    }
  },
  mounted() {
    this.getChartData()
  }
}
</script>
