<!--
 * @Description: 劳动统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-03 17:28:26
 -->
<template>
  <div>
    <el-row :gutter="10">
      <el-form ref="form" class="yn_form" inline label-width="4rem">
        <el-form-item label="日期:">
          <el-date-picker
            v-model="barFormDate"
            :clearable="false"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="yn_ipt"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="yn_btn" @click="getBar">查询</el-button>
        </el-form-item>
      </el-form>

      <el-col :span="24">
        <div class="yn_charts">
          <h3>各监狱重大活动数量统计</h3>

          <number-analysis v-loading="barLoading" :chartData="barChartData"></number-analysis>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="yn_charts">
          <h3>各监狱引入狱外人员数量统计</h3>

          <number-analysis v-loading="piePositionLoading" unit="人" :chartData="areaData"></number-analysis>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts">
          <h3>活动类型分布</h3>
          <!-- <el-row>
            <el-form ref="form" class="yn_form" inline label-width="4rem">
              <el-form-item label="日期:">
                <el-date-picker
                  v-model="pieFormDate"
                  :clearable="false"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  class="yn_ipt"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="yn_btn" @click="getPie">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>-->
          <pie-type-chart
            v-loading="pieLoading"
            :dataList="pieTypeData"
            :chartData="pieTypeData"
            :height="'300px'"
            :centerTitle="['总计','次']"
          ></pie-type-chart>
        </div>
      </el-col>
      <!-- <el-col :span="12">
        <div class="yn_charts">
          <h3>活动地点分布</h3>
          <el-row>
            <el-form ref="form" class="yn_form" inline label-width="4rem">
              <el-form-item label="日期:">
                <el-date-picker
                  v-model="piePositionFormDate"
                  :clearable="false"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  class="yn_ipt"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="yn_btn" @click="getPiePosition">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <pie-type-chart
            v-loading="piePositionLoading"
            :dataList="piePositionTypeData"
            :chartData="piePositionTypeData"
            :height="'300px'"
          ></pie-type-chart>
        </div>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import { getBar, getPie, getArea } from './service'
import numberAnalysis from './number_analysis'
import pieTypeChart from '@/components/pie_charts/pie_charts'
import { getPrisonId } from '@/utils'
import { formatDate, getPreMonth, getYearAndMonthAndDay } from '@/utils/date'
export default {
  components: {
    pieTypeChart,
    numberAnalysis
  },
  data () {
    return {
      pickerOptions: pickerOptions,

      params: {
        eventDepartment: getPrisonId(),
        statisticType: null,
        searchFromDate: '',
        searchToDate: ''
      },
      barLoading: false,
      pieLoading: false,
      piePositionLoading: false,
      barFormDate: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ],
      //   pieFormDate: [
      //     getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
      //     formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      //   ],
      //   piePositionFormDate: [
      //     getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
      //     formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      //   ],
      barChartData: {},
      areaData: {},
      pieTypeData: [],
      piePositionTypeData: []
    }
  },
  props: ['prisonId', 'prisonName'],
  created () {
    console.log(this.prisonId)

    this.getBar()
    // this.getPie()
    // this.getPiePosition()
  },
  methods: {
    // 查询
    getBar () {
      this.barLoading = true
      this.piePositionLoading = true
      this.pieLoading = true

      this.params.statisticType = 1
      this.params.searchFromDate = this.barFormDate[0]
      this.params.searchToDate = this.barFormDate[1]
      getBar(this.params).then(res => {
        let xAxis = []
        let yAxis = []
        res.forEach(el => {
          xAxis.push(el.eventDepartmentName)
          yAxis.push(el.totleNum)
        })
        this.$set(this.barChartData, 'xAxis', xAxis)
        this.$set(this.barChartData, 'yAxis', yAxis)
        this.barLoading = false
      })
      this.params.statisticType = 2
      getPie(this.params).then(res => {
        this.pieTypeData = res.map(item => {
          return { name: item.eventTypeName, value: item.totleNum }
        })
        this.pieLoading = false
      })
      let str =
        this.barFormDate[0] + '/' + this.barFormDate[1] + '/' + this.prisonId
      console.log(str)

      getArea(str).then(res => {
        let xArr = []
        let yArr = []
        res.forEach(el => {
          xArr.push(el.name)
          yArr.push(el.result)
        })
        this.$set(this.areaData, 'xAxis', xArr)
        this.$set(this.areaData, 'yAxis', yArr)

        this.piePositionLoading = false
      })
    }
    // getPie () {
    //   this.pieLoading = true
    //   this.params.statisticType = 2
    //   this.params.searchFromDate = this.pieFormDate[0]
    //   this.params.searchToDate = this.pieFormDate[1]
    //   getPie(this.params).then(res => {
    //     this.pieTypeData = res.map(item => {
    //       return { name: item.eventTypeName, value: item.totleNum }
    //     })
    //     this.pieLoading = false
    //   })
    // },
    // getPiePosition () {
    //   this.piePositionLoading = true
    //   this.params.statisticType = 3
    //   this.params.searchFromDate = this.piePositionFormDate[0]
    //   this.params.searchToDate = this.piePositionFormDate[1]
    //   getPie(this.params).then(res => {
    //     this.piePositionTypeData = res.map(item => {
    //       return { name: item.eventPositionName, value: item.totleNum }
    //     })
    //     this.piePositionLoading = false
    //   })
    // }
  },
  watch: {
    prisonId () {
      this.getBar()
      //   this.getPie()
      //   this.getPiePosition()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
