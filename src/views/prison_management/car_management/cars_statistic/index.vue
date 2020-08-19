<!--
 * @Description:外来车辆 数据屏统计
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:02:19
 -->
<template>
  <dept-layout v-model="changePrisonId">
    <menuTree :menuList="['监狱管理','AB门管理','外来车辆管理']">
      <tab slot="heade_btn" name="外来车辆管理" :left="true" pathName="car_management_check_in" />
      <headIcon :list="headIconList" v-loading="panelLoading"></headIcon>
      <el-row :gutter="10">
        <el-col :span="24" v-if="changePrisonId!=1">
          <div class="yn_charts" v-loading="panelLoading">
            <h3>停留车辆数量-时间变化</h3>
            <line-chart :chart-data="lineChartData" />
          </div>
        </el-col>
        <el-col :span="24" v-else>
          <div class="yn_charts" v-loading="panelLoading">
            <h3>各监狱已入车辆概况</h3>
            <p v-if="overTatol>0">
              <span class="title">{{ overTatol}}所监狱</span>
              车辆停放已超时
            </p>
            <bar-chart :chart-data="prisonBarData" :dimensions="['deptName','已停车辆数量','超时车辆数量']" />
          </div>
        </el-col>
        <el-col :span="24">
          <div class="yn_charts" v-loading="panelLoading">
            <h3>停放时长</h3>
            <el-form ref="form" inline class="yn_form" label-width="8rem">
              <el-form-item label="时间范围:">
                <el-date-picker
                  v-model="formData"
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
            <bar-chart
              v-if="changePrisonId==1"
              :chart-data="barChartData"
              :dimensions="['deptName','平均时长','最短时长','最大时长']"
            />
            <bar-chart v-else :chart-data="barChartData" />
          </div>
        </el-col>
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import LineChart from './line_chart'
import BarChart from './bar_chart'
import deptLayout from '@/components/deptLayout/index.vue'
import { getOutsideCarStatisticalData, getStayTimeForPeriod } from './service'
import formatDate from '@/utils/date.js'
import { getPrisonId } from '@/utils'
import tab from '@/components/tab/index.vue'
import headIcon from '@/components/head_icon'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    LineChart,
    BarChart,
    deptLayout,
    tab,
    headIcon,
    menuTree
  },
  data() {
    let tempStart = new Date()
    let start = new Date(tempStart.getFullYear(), tempStart.getMonth(), '01')
    return {
      panelLoading: false,
      barLoading: false,
      btntoggle: false,
      lineChartData: {
        actualData: [],
        actualKey: []
      },
      headIconList: [
        {
          url: require('@/assets/index/car1.png'),
          info: '当前停留车辆数',
          text: 0
          //   isRouter: true,
          //   routerString: 'car_management_check_in',
          //   params: { isOverTime: 'false' }
        },
        {
          url: require('@/assets/index/car2.png'),
          info: '当前阈值预警数',
          text: 0
          //   isRouter: true,
          //   routerString: 'car_management_check_in',
          //   params: {}
        },
        {
          url: require('@/assets/index/car3.png'),
          info: '当前超时车辆数',
          text: 0
          //   isRouter: true,
          //   routerString: 'car_management_check_in',
          //   params: { isOverTime: 'true' }
        },
        {
          url: require('@/assets/index/car4.png'),
          info: '停留时长阈值',
          text: 0
          //   isRouter: true,
          //   routerString: 'car_management_check_in',
          //   params: {}
        }
      ],
      barChartData: [],
      prisonBarData: [],
      formData: [start, new Date()],
      changePrisonId: getPrisonId(),
      overTatol: 0
    }
  },
  methods: {
    timeChange(type) {
      this.btntoggle = type
      const end = new Date()
      let start = new Date()
      if (type) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      } else {
        start = new Date(start.getFullYear(), start.getMonth(), '01')
      }
      this.formData = [start, end]
      this.getStayTimeForPeriod([start, end])
    },
    pickerChange(val) {
      this.getStayTimeForPeriod(val)
    },
    getStayTimeForPeriod(val) {
      let [start, end] = val
      this.barLoading = true
      getStayTimeForPeriod({
        startDate: formatDate(start, 'yyyy-MM-dd'),
        endDate: formatDate(end, 'yyyy-MM-dd'),
        prisonId: this.changePrisonId
      }).then(
        res => {
          if (this.changePrisonId != 1) {
            this.barChartData = res.map(item => {
              return {
                date: item.date,
                平均时长: item.value.aver,
                最短时长: item.value.min,
                最大时长: item.value.max
              }
            })
          } else {
            this.barChartData = res.map(item => {
              return {
                deptName: item.deptName,
                平均时长: item.avgTime,
                最短时长: item.shortTime,
                最大时长: item.longTime
              }
            })
          }
          this.barLoading = false
        },
        () => {
          this.barLoading = false
        }
      )
    },
    getChartData() {
      let that = this
      that.panelLoading = true
      getOutsideCarStatisticalData({ prisonId: this.changePrisonId }).then(
        res => {
          this.$set(this.headIconList[0], 'text', res.nowStayData.inPrison)
          this.$set(this.headIconList[1], 'text', res.nowStayData.warn)
          this.$set(this.headIconList[2], 'text', res.nowStayData.error)
          this.$set(this.headIconList[3], 'text', res.nowStayData.thresholdTime)
          if (that.changePrisonId == 1) {
            that.prisonBarData = res.nowStorageData.map(item => {
              that.overTatol += item.overCars
              return {
                deptName: item.deptName,
                已停车辆数量: item.inCars,
                超时车辆数量: item.overCars
              }
            })
          } else {
            let lineChartData = { actualData: [], actualKey: [] }
            res.nowStorageData.forEach(item => {
              lineChartData.actualData.push(item.value)
              lineChartData.actualKey.push(item.storageTime)
            })
            that.lineChartData = lineChartData
          }
          that.panelLoading = false
        },
        () => {
          that.panelLoading = false
        }
      )
      that.getStayTimeForPeriod(that.formData)
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
