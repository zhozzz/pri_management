<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 14:32:46
 -->

<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','监狱动态','应急预案演练']">
      <tab slot="heade_btn" name="应急演练管理" :left="true" pathName="exercise_mgt" />

      <headIcon :list="headIconList"></headIcon>

      <el-row :gutter="10">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}}开展情况</h3>
            <el-form ref="form" class="yn_form" inline label-width="4rem">
              <el-form-item label="日期:">
                <el-date-picker
                  class="yn_ipt yn_date_picker"
                  v-model="countDate"
                  type="daterange"
                  unlink-panels
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                  value-format="yyyy-MM-dd"
                  @change="getCountsByProvincial"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <barCharts :chartData="countsList" v-loading="countLoading" />
          </div>
        </el-col>
        <el-col :span="24" v-if="prisonId==1">
          <div class="yn_charts">
            <h3>{{prisonName}}开展满意率（%）</h3>
            <el-row>
              <el-form ref="form" class="yn_form" inline label-width="4rem">
                <el-form-item label="日期:">
                  <el-date-picker
                    class="yn_ipt yn_date_picker"
                    v-model="satisfyDate"
                    type="daterange"
                    unlink-panels
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getSatisfactionByProvincial"
                    align="right"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </el-row>
            <barCharts
              :chartData="satisfyList"
              v-loading="satisfyLoading"
              :dimensions="['prison', '满意率']"
            />
          </div>
        </el-col>
        <el-col :span="24" v-if="prisonId!=1">
          <div class="yn_charts">
            <h3>{{prisonName}}各月演练变化图</h3>
            <el-row>
              <el-form ref="form" class="yn_form" inline label-width="4rem">
                <el-form-item label="日期:">
                  <el-date-picker
                    class="yn_ipt"
                    v-model="year"
                    type="year"
                    @change="getMonthData"
                    align="right"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </el-row>
            <lineCharts :chartData="monthList" v-loading="monthLoading" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>参与次数情况</h3>
            <el-row>
              <el-form ref="form" class="yn_form" inline label-width="4rem">
                <el-form-item label="日期:">
                  <el-date-picker
                    class="yn_ipt yn_date_picker"
                    v-model="date"
                    type="daterange"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    align="right"
                    @change="getTypeData"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </el-row>
            <PieChart
              :chartData="pieList"
              v-loading="typeLoading"
              :dataList="pieList"
              :centerTitle="['总计','次']"
            />
          </div>
        </el-col>
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import PieChart from '@/components/pie_charts/pie_charts.vue'
import deptLayout from '@/components/deptLayout/index.vue'
import timeSelect from '@/components/time_select/index.vue'
import tab from '@/components/tab/index.vue'
import barCharts from './bar_charts.vue'
import lineCharts from './line_charts.vue'
import headIcon from '@/components/head_icon'
import menuTree from '@/components/menu_tree/'
import { formatDate } from '@/utils/date'

import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import {
  getCardsStatistics,
  getCountsByProvincial,
  getSatisfactionByProvincial,
  getTypeData,
  getCountsByPrison,
  getMonthData
} from './service.js'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

let days = new Date()
let year = days.getFullYear()
let mounth = days.getMonth() + 1
if (mounth < 10) {
  mounth = '0' + mounth
}
let day = days.getDate()
if (day < 10) {
  day = '0' + day
}
let today = year + '-' + mounth + '-' + day

let yestarday = year + '-' + mounth + '-' + '01'

export default {
  data() {
    return {
      date: [yestarday, today], // 时间
      countDate: [yestarday, today],
      satisfyDate: [yestarday, today],
      year: today,
      prisonId: getPrisonId(),
      isCenter: getDeptType() == '指挥中心' || getDeptType() == '监狱',
      prisonName: '各监狱',
      cardData: {},
      countsList: [],
      satisfyList: [],
      pieList: [],
      monthList: [],
      typeLoading: true,
      countLoading: true,
      satisfyLoading: true,
      monthLoading: true,
      headIconList: [
        {
          url: require('@/assets/other/exercise.png'),
          info: '开展应急演练次数',
          text: 0,
          isRouter: true,
          routerString: 'exercise_mgt',
          params: {}
        },
        // {
        //   url: require('@/assets/other/exercise_success.png'),
        //   info: '满足开展预期次数',
        //   text: 0,
        //   isRouter: true,
        //   routerString: 'exercise_mgt',
        //   params: { effect: 2 }
        // },
        {
          url: require('@/assets/other/exercise_error.png'),
          info: '不满足开展预期次数',
          text: 0,
          isRouter: true,
          routerString: 'exercise_mgt',
          params: { effect: 0 }
        }
      ]
    }
  },
  components: {
    PieChart,
    deptLayout,
    timeSelect,
    tab,
    barCharts,
    headIcon,
    lineCharts,
    menuTree
  },
  created() {
    this.getCardsStatistics()
    this.getCountsByProvincial()
    this.getTypeData()
    if (this.prisonId == 1) {
      this.getSatisfactionByProvincial()
    } else {
      this.getMonthData()
      this.prisonName = '本监狱'
    }
  },
  methods: {
    // 卡片数据
    getCardsStatistics() {
      this.headIconList = [
        {
          url: require('@/assets/other/exercise.png'),
          info: '开展应急演练次数',
          text: 0,
          isRouter: true,
          routerString: 'exercise_mgt',
          params: {}
        },
        {
          url: require('@/assets/other/exercise_error.png'),
          info: '不满足开展预期次数',
          text: 0,
          isRouter: true,
          routerString: 'exercise_mgt',
          params: { effect: 0 }
        }
      ]
      getCardsStatistics(this.prisonId).then(res => {
        this.cardData = res
        this.$set(this.headIconList[0], 'text', res.total)
        this.$set(this.headIconList[1], 'text', res.unSatisfy)
        // this.$set(this.headIconList[2], 'text', res.unCompleted)

        if (this.prisonId != 1) {
          this.headIconList.push({
            url: require('@/assets/index/files.png'),
            info: '未完成演练任务数',
            text: res.unCompleted,
            isRouter: true,
            routerString: 'exercise_mgt',
            params: { openDialog: true }
          })
        }

        if (this.isCenter) {
          this.headIconList.push({
            url: require('@/assets/index/crimal_err.png'),
            info: '已下达未完成演练数',
            text: res.undoneFromMyReleased,
            isRouter: true,
            routerString: 'exercise_mgt',
            params: { openDialog: true }
          })
        }
      })
    },
    // 开展次数统计图
    getCountsByProvincial() {
      this.countLoading = true
      if (this.prisonId == 1) {
        getCountsByProvincial(this.countDate).then(res => {
          this.countLoading = false
          this.countsList = res.map(item => {
            return {
              prison: item.deptName,
              总共开展演练次数: item.result,
              不满足预期演练次数: item.result2
            }
          })
        })
      } else {
        let params = [...this.countDate, this.prisonId]

        getCountsByPrison(params).then(res => {
          this.countLoading = false

          this.countsList = res.map(item => {
            return {
              prison: item.deptName,
              总共开展演练次数: item.result,
              不满足预期演练次数: item.result2
            }
          })
        })
      }
    },
    // 满意率统计图
    getSatisfactionByProvincial() {
      this.satisfyLoading = true

      getSatisfactionByProvincial(this.satisfyDate).then(res => {
        this.satisfyList = res.map(item => {
          return {
            prison: item.deptName,
            满意率: (parseFloat(item.title) * 100).toFixed(2)
          }
        })
        this.satisfyLoading = false
      })
    },
    // 类型统计图
    getTypeData() {
      let params = [...this.date, this.prisonId]
      this.typeLoading = true
      getTypeData(params).then(res => {
        this.pieList = res.map(item => {
          return {
            name: item.name,
            value: item.result
          }
        })
        this.typeLoading = false
      })
    },
    // 年份数据
    getMonthData() {
      let params = [
        formatDate(new Date(this.year), 'yyyy-MM-dd'),
        this.prisonId
      ]
      this.monthLoading = true
      getMonthData(params).then(res => {
        this.monthList = []
        for (let index = 0; index < 12; index++) {
          this.monthList.push({ code: null, name: index, result: 0 })
        }
        this.monthList.forEach(item => {
          res.forEach(obj => {
            obj.name == item.name ? (item.result = obj.result) : ''
          })
        })
        this.monthLoading = false
      })
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.prisonName = val.departName
      this.date = [yestarday, today] // 时间
      this.countDate = [yestarday, today]
      this.satisfyDate = [yestarday, today]
      this.year = today
      this.countsList = []
      this.satisfyList = []
      this.monthList = []
      this.pieList = []
      this.getCardsStatistics()
      this.getCountsByProvincial()
      this.getTypeData()
      if (this.prisonId == 1) {
        this.getSatisfactionByProvincial()
      } else {
        this.getMonthData()
      }
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  watch: {
    prisonId: function() {
      if (this.prisonId == 1) {
        this.prisonName = '全省各监狱'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
