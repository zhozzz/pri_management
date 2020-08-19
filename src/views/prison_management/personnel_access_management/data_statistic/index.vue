<!--
 * @Description:外来人员 数据统计
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-23 15:33:08
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:03:41
 -->

<template>
  <dept-layout v-model="changePrisonId">
    <menuTree :menuList="['监狱管理','AB门管理','外来人员管理']">
      <tab
        slot="heade_btn"
        name="外来人员管理"
        :left="true"
        pathName="personnel_access_management_check_in"
      />
      <!-- <div class="yn-chart-title">
        <div class="el-alert__content">
          <span class="title">外来人员数据统计</span>
          <router-link :to="{name:'personnel_access_management_check_in',query:{prisonId:changePrisonId}}">外来人员详情</router-link>
        </div>
      </div>-->
      <headIcon :list="headIconList" v-loading="panelLoading"></headIcon>
      <el-row :gutter="10">
        <el-col :span="24" v-if="changePrisonId==1">
          <div class="yn_charts" v-loading="barChartLoading">
            <h3>当前各监狱人员停留情况</h3>
            <p v-if="overTatol>0">
              <span class="title">{{ overTatol}}所监狱</span>
              人员停留已超时
            </p>
            <bar-chart :chart-data="barChartData" :dimensions="['deptName', '目前停留人数','超时人数']" />
          </div>
        </el-col>
        <el-col :span="12" v-if="changePrisonId!=1">
          <div class="yn_charts" v-loading="barChartLoading">
            <h3>停留时长</h3>
            <el-form ref="form" inline label-width="80px" class="yn_form">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="causeFormData"
                  type="daterange"
                  class="yn_ipt"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="pickerChange"
                  align="right"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <bar-chart :chart-data="barChartData" :dimensions="[ 'date', '平均时长', '最短时长', '最大时长']" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts" v-loading="peiChartLoading">
            <h3>来访事由</h3>
            <el-form ref="form" inline label-width="80px" class="yn_form">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="timeFormData"
                  type="daterange"
                  class="yn_ipt"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="pickerChangeIssue"
                  align="right"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <pei-chart :chart-data="peiChartData" />
          </div>
        </el-col>
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import BarChart from './bar_chart'
import PeiChart from './pie-chart'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import {
  getTodayStatisticalData,
  getStayTimeForPeriod,
  getIssueStatisticalDataForPeriod
} from './service'
import headIcon from '@/components/head_icon'
import { formatDate } from '@/utils/date'
import tab from '@/components/tab/index.vue'
import timeSelect from '@/components/time_select/index.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    BarChart,
    PeiChart,
    deptLayout,
    tab,
    timeSelect,
    headIcon,
    menuTree
  },
  data() {
    let tempStart = new Date()
    let start = new Date(tempStart.getFullYear(), tempStart.getMonth(), '01')
    return {
      changePrisonId: getPrisonId(),
      leftBtntoggle: 2,
      rightBtntoggle: 2,
      panelLoading: false,
      barChartLoading: false,
      peiChartLoading: false,
      headIconList: [
        {
          url: require('@/assets/index/people1.png'),
          info: '今日来访总人数',
          text: 0
        },
        {
          url: require('@/assets/index/people2.png'),
          info: '当前阈值预警人数',
          text: 0
        },
        {
          url: require('@/assets/index/people3.png'),
          info: '当前超阈值人员数',
          text: 0
        },
        {
          url: require('@/assets/index/car4.png'),
          info: '停留时长阈值',
          text: 0
        }
      ],
      barChartData: [],
      peiChartData: [],
      causeFormData: [start, new Date()],
      timeFormData: [start, new Date()],
      overTatol: 0 // 超时总数
    }
  },
  methods: {
    pickerChange(val) {
      this.getStayTimeForPeriod(val)
    },
    getStayTimeForPeriod(val) {
      let [start, end] = val
      this.barChartLoading = true
      getStayTimeForPeriod({
        startDate: formatDate(start, 'yyyy-MM-dd'),
        endDate: formatDate(end, 'yyyy-MM-dd'),
        prisonId: this.changePrisonId
      }).then(res => {
        this.barChartData = res.map(item => {
          return {
            date: item.date,
            平均时长: item.value.aver,
            最短时长: item.value.min,
            最大时长: item.value.max
          }
        })
        this.barChartLoading = false
      })
    },
    pickerChangeIssue(val) {
      this.getIssueStatisticalDataForPeriod(val)
    },
    getIssueStatisticalDataForPeriod(val) {
      let [start, end] = val
      this.peiChartLoading = true
      getIssueStatisticalDataForPeriod({
        startDate: formatDate(start, 'yyyy-MM-dd'),
        endDate: formatDate(end, 'yyyy-MM-dd'),
        prisonId: this.changePrisonId
      }).then(res => {
        res.forEach(item => {
          // eslint-disable-next-line no-unused-expressions
          item.num > 0 ? this.peiChartData.push(item) : ''
        })
        //   this.peiChartData = res;
        this.peiChartLoading = false
      })
    },
    getChartData() {
      let that = this
      this.panelLoading = true
      this.barChartLoading = true
      getTodayStatisticalData({ prisonId: this.changePrisonId }).then(
        res => {
          this.$set(this.headIconList[0], 'text', res.nowStayData.allComePrison)
          this.$set(this.headIconList[1], 'text', res.nowStayData.warn)
          this.$set(this.headIconList[2], 'text', res.nowStayData.error)
          this.$set(this.headIconList[3], 'text', res.nowStayData.thresholdTime)
          that.panelLoading = false
          if (that.changePrisonId == 1) {
            that.barChartData = res.resultList.map(item => {
              return {
                deptName: item.deptName,
                目前停留人数: item.inPerson,
                超时人数: item.overTimePerson
              }
            })

            that.barChartLoading = false
          }
        },
        () => {
          that.panelLoading = false
        }
      )
      if (this.changePrisonId !== 1) {
        that.getStayTimeForPeriod(that.causeFormData)
      }
      that.getIssueStatisticalDataForPeriod(that.timeFormData)
    }
  },
  mounted() {
    this.getChartData()
  },
  watch: {
    changePrisonId() {
      this.getChartData()
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  }
}
</script>

<style lang="less" scoped>
</style>
