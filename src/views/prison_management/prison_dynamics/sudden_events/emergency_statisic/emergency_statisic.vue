<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:26:38
 -->

<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','监狱动态','监狱突发事件']">
      <tab slot="heade_btn" name="突发事件管理" :left="true" pathName="sudden_events" />
      <!-- <headIcon :list="iconList" /> -->
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}}突发事件数量统计</h3>
            <timeSelect @setTime="getChartData" :prisonId="prisonId" />
            <barChart :chartData="barChartData" v-loading="barLoading" :rotate="prisonId==1?60:0" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>报警类型占比</h3>
            <timeSelect @setTime="getalarmPieData" :prisonId="prisonId" />
            <PieChart
              :chartData="alarmTypeData"
              :dataList="alarmTypeData"
              :centerTitle="['总计','次']"
              v-loading="alarmTypeLoading"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>事件类型占比</h3>
            <timeSelect @setTime="getEventPieData" :prisonId="prisonId" />
            <PieChart
              :chartData="eventTypeData"
              :dataList="eventTypeData"
              v-loading="eventTypeLoading"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>警情级别占比</h3>
            <timeSelect @setTime="getLevelPieData" :prisonId="prisonId" />
            <PieChart :chartData="levelData" v-loading="levelLoading" :dataList="levelData" />
          </div>
        </el-col>
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import PieChart from './pie_charts.vue'
import barChart from './bar_charts.vue'
import deptLayout from '@/components/deptLayout/index.vue'
import timeSelect from '@/components/time_select/index.vue'
import tab from '@/components/tab/index.vue'
import headIcon from '@/components/head_icon/index.vue'
import menuTree from '@/components/menu_tree/'

import { getPrisonId } from '@/utils'
import {
  getChartData,
  getChartTypeData,
  getChartEventData,
  getChartLevelData,
  getChartMonthData
} from '../service.js'
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
today = new Date(today).getTime()
yestarday = new Date(yestarday).getTime()
export default {
  data() {
    return {
      barDate: [yestarday, today], // 时间
      cardData: {},
      prisonId: getPrisonId(),
      prisonName: '本监狱',
      iconList: [
        {
          text: '1',
          info: '手动报警',
          url: require('@/assets/index/crimal_sucess.png')
        },
        { text: '', info: '', url: '' }
      ],
      barChartData: [],
      barLoading: true,
      alarmTypeData: [],
      alarmTypeLoading: true,
      eventTypeData: [],
      eventTypeLoading: true,
      levelData: [],
      levelLoading: true,
      levelList: [
        { name: '轻微', value: 1 },
        { name: '较低', value: 2 },
        { name: '中等', value: 3 },
        { name: '较高', value: 4 },
        { name: '严重', value: 5 }
      ]
    }
  },
  components: {
    deptLayout,
    timeSelect,
    tab,
    headIcon,
    barChart,
    PieChart,
    menuTree
  },
  created() {
    // this.getChartData();

    if (this.prisonId == 1) {
      this.prisonName = '全省各监狱'
    }
  },
  methods: {
    nodeClick(val) {
      this.prisonId = val.id
      if (this.prisonId == 1) {
        this.prisonName = '全省各监狱'
      } else {
        this.prisonName = val.departName
      }
    },
    getChartData(val) {
      this.barLoading = true
      let params = {}
      params.emPrisonId = this.prisonId
      params.startTime = val[0]
      params.endTime = val[1]
      this.barChartData = []
      if (this.prisonId == 1) {
        getChartData(params).then(res => {
          this.barLoading = false
          this.barChartData = res.AllPrisonEmergencyEventCount.map(item => {
            return {
              prison: item.deptName,
              突发事件数: item.countNum
            }
          })
        })
      } else {
        getChartMonthData(params).then(res => {
          this.barLoading = false
          let monthList = [
            { name: '1', value: 0 },
            { name: '2', value: 0 },
            { name: '3', value: 0 },
            { name: '4', value: 0 },
            { name: '5', value: 0 },
            { name: '6', value: 0 },
            { name: '7', value: 0 },
            { name: '8', value: 0 },
            { name: '9', value: 0 },
            { name: '10', value: 0 },
            { name: '11', value: 0 },
            { name: '12', value: 0 }
          ]
          res.MonthCount.map(item => {
            monthList.map(obj => {
              item.creatMouth == obj.name ? (obj.value = item.countNum) : ''
            })
          })
          this.barChartData = monthList.map(item => {
            return {
              prison: item.name + '月',
              突发事件数: item.value
            }
          })
        })
      }
    },
    getalarmPieData(val) {
      this.alarmTypeLoading = true

      let params = {}
      params.emPrisonId = this.prisonId
      params.startTime = val[0]
      params.endTime = val[1]
      this.alarmTypeData = []
      getChartTypeData(params).then(res => {
        this.alarmTypeLoading = false

        for (const key in res) {
          if (res[key] > 0) {
            this.alarmTypeData.push({ name: key, value: res[key] })
          }
        }
      })
    },
    getEventPieData(val) {
      this.eventTypeLoading = true

      let params = {}
      params.emPrisonId = this.prisonId
      params.startTime = val[0]
      params.endTime = val[1]
      this.eventTypeData = []
      getChartEventData(params).then(res => {
        this.eventTypeLoading = false
        let arr = []
        if (this.prisonId == 1) {
          arr = res.getAllEmergencyEventsCountByAlarmEvent
        } else {
          arr = res.getEmergencyEventsCountByAlarmEvent
        }
        this.eventTypeData = arr.map(item => {
          return {
            name: item.alarmEvent,
            value: item.countNum
          }
        })
      })
    },
    getLevelPieData(val) {
      this.levelLoading = true

      let params = {}
      params.emPrisonId = this.prisonId
      params.startTime = val[0]
      params.endTime = val[1]
      this.levelData = []
      getChartLevelData(params).then(res => {
        this.levelLoading = false
        let arr = []
        if (this.prisonId == 1) {
          arr = res.getAllEmergencyEventsCountByAlarmLevel
        } else {
          arr = res.getEmergencyEventsCountByAlarmLevel
        }
        this.levelData = arr.map(item => {
          let str
          this.levelList.map(obj => {
            obj.value == item.alarmLevel ? (str = obj.name) : ''
          })
          return {
            name: str,
            value: item.countNum
          }
        })
      })
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
