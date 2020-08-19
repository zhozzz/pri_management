<!--
 * @Description:危险品 数据屏统计
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:04:41
 -->
<template>
  <dept-layout v-model="changePrisonId">
    <menuTree :menuList="['监狱管理','AB门管理','危险品管理']">
      <tab slot="heade_btn" name="危险品详情" :left="true" pathName="hazmat_management_check_in" />
      <div class>
        <!-- <div class="yn-chart-title">
        <div class="el-alert__content">
          <span class="title">危险品数据统计</span>
          <router-link
            :to="{name:'hazmat_management_check_in',query:{prisonId:changePrisonId}}"
          >危险品详情</router-link>
        </div>
        </div>-->
        <div class="title-query-bar">
          <el-form ref="form" inline class="yn_form" label-width="6rem">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="goodsInStartTime"
                class="yn_ipt"
                type="daterange"
                :clearable="false"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-button type="primary" class="yn_btn" @click="getChartData">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="yn_charts">
              <h3>危险物品总数和停留时长统计分析</h3>
              <bar-chart v-loading="dataLoading" :chart-data="barChartData" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="yn_charts">
              <h3>危险物品类种类统计分析</h3>
              <pei-chart v-loading="dataLoading" :chart-data="peiChartData" />
            </div>
          </el-col>
        </el-row>
      </div>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import BarChart from './bar_chart'
import PeiChart from './pie-chart'
import { getGoodsSummary } from './service'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
// import { pickerOptions } from '@/utils/picker_option_config'
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
      pickerOptions: pickerOptions,
      dataLoading: false,
      changePrisonId: getPrisonId(),
      peiChartData: [],
      barChartData: [],
      goodsInStartTime: [],
      searchDate: {
        start: '',
        end: ''
      }
    }
  },
  methods: {
    getChartData() {
      let that = this
      if (that.goodsInStartTime[0]) {
        that.searchDate.start = that.goodsInStartTime[0]
      }
      if (that.goodsInStartTime[1]) {
        that.searchDate.end = that.goodsInStartTime[1]
      }
      that.dataLoading = true
      getGoodsSummary({
        ...that.searchDate,
        prisonId: this.changePrisonId
      }).then(
        res => {
          this.peiChartData = res.pieData.map(item => {
            return { value: item.goodsNum, name: item.goodsTypeName }
          })
          this.barChartData = res.barData.map(item => {
            return {
              总数量: item.goodsNum,
              超时时间: item.overTime,
              name: item.goodsName
            }
          })
          that.dataLoading = false
        },
        err => {
          that.dataLoading = false
        }
      )
    }
  },
  mounted() {
    this.getChartData()
  },
  watch: {
    changePrisonId() {
      this.getChartData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
