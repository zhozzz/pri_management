<!--
 * @Description: 禁闭隔离统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-17 11:18:36
 -->
<template>
  <div class="province_statistic">
    <headIcon :list="headIconList"></headIcon>
    <el-form ref="form" class="yn_form" inline label-width="4rem">
      <el-form-item label="日期:">
        <el-date-picker
          class="yn_ipt"
          v-model="formData1"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
        <el-button type="primary" class="yn_btn" @click="getBar">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="yn_charts">
          <h3>全省禁闭/隔离人数分析</h3>
          <!-- <el-form ref="form" class="yn_form" inline label-width="4rem">
            <el-form-item label="日期:">
              <el-date-picker
                class="yn_ipt"
                v-model="formData1"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getBar"
                value-format="yyyy-MM-dd hh:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-form>-->
          <number-analysis v-loading="barLoading" chartName="禁闭/隔离人数分析" :chartData="barChartData"></number-analysis>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts">
          <h3>全省禁闭/隔离犯罪类型分析</h3>
          <!-- <el-row>
            <el-form ref="form" class="yn_form" inline label-width="4rem">
              <el-form-item label="日期:">
                <el-date-picker
                  class="yn_ipt"
                  v-model="formData2"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getPie1"
                  value-format="yyyy-MM-dd hh:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </el-row>-->
          <pie-type-chart v-loading="pieLoading1" :pieTypeData="pieTypeData"></pie-type-chart>
        </div>
      </el-col>
      <!-- <el-col :span="12">
        <div class="yn_charts">
          <h3>全省禁闭/隔离原因分析</h3>
          <el-row>
            <el-form ref="form" class="yn_form" inline label-width="4rem">
              <el-form-item label="日期:">
                <el-date-picker
                  class="yn_ipt"
                  v-model="formData3"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getPie2"
                  value-format="yyyy-MM-dd hh:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </el-row>
          <pie-reason-chart v-loading="pieLoading2" :pieReasonData="pieReasonData"></pie-reason-chart>
        </div>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import numberAnalysis from './number_analysis'
import pieTypeChart from './pie_type_analysis'
import pieReasonChart from './pie_reason_analysis'
import { formatDate, getPreMonth, getYearAndMonthAndDay } from '@/utils/date'
import headIcon from '@/components/head_icon'

export default {
  components: {
    numberAnalysis,
    pieTypeChart,
    pieReasonChart,
    headIcon
  },
  data() {
    return {
      pickerOptions: pickerOptions,
      barLoading: false,
      pieLoading1: false,
      pieLoading2: false,
      formData1: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ],
      formData2: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ],
      formData3: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ],
      pieTypeData: [],
      pieReasonData: [],
      barChartData: {
        xAxis: [],
        yAxis: []
      },
      headIconList: [
        {
          url: require('@/assets/index/crimal_primary.png'),
          info: '本省今日新增',
          text: null,
          isRouter: true,
          routerString: 'confinement_mgt',
          params: {
            datePicker: [
              formatDate(new Date(), 'yyyy-MM-dd ') + '00:00:00',
              formatDate(new Date(), 'yyyy-MM-dd ') + '23:59:59'
            ]
          }
        },
        {
          url: require('@/assets/index/crimal_err.png'),
          info: '总禁闭隔离人数',
          text: null,
          isRouter: true,
          routerString: 'confinement_mgt',
          params: {}
        }
      ]
    }
  },
  created() {
    this.getInData()
    this.getBar()
    // this.getBar(this.formData1)
    // this.getPie1(this.formData2)
    // this.getPie2(this.formData3)
  },
  methods: {
    // 获得隔离人数和增减比
    getInData() {
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalIsolation/queryIsolationAddAndTotalProvince'
        )
        .then(response => {
          this.$set(this.headIconList[0], 'text', response.todayAddProvince)
          this.$set(this.headIconList[1], 'text', response.totalProvince)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获得图形数据
    getBar(val) {
      let params = {
        beginDay: this.formData1[0],
        endDay: this.formData1[1]
      }
      this.barLoading = true

      this.pieLoading1 = true

      this.pieLoading2 = true

      this.axios
        .post(
          this._global.businessUrl + '/criminalIsolation/queryProvinceStatics',
          params
        )
        .then(response => {
          this.barChartData = {
            xAxis: [],
            yAxis: []
          }
          response.ColumnDiagram.forEach((el, i) => {
            this.barChartData.xAxis.push(el.prisonName)
            this.barChartData.yAxis.push(el.zfCount)
          })
          this.barLoading = false

          this.pieTypeData = response.types
          this.pieLoading1 = false

          this.pieReasonData = response.reasons
          this.pieLoading2 = false
        })
        .catch(error => {
          this.barLoading = false
          console.log(error)
        })
    },
    getPie1(val) {
      let params = {
        beginDay: val[0],
        endDay: val[1]
      }
      this.pieLoading1 = true
      this.axios
        .post(
          this._global.businessUrl + '/criminalIsolation/queryProvinceStatics',
          params
        )
        .then(response => {
          this.pieTypeData = response.types
          this.pieLoading1 = false
        })
        .catch(error => {
          this.pieLoading1 = false
          console.log(error)
        })
    },
    getPie2(val) {
      let params = {
        beginDay: val[0],
        endDay: val[1]
      }
      this.pieLoading2 = true
      this.axios
        .post(
          this._global.businessUrl + '/criminalIsolation/queryProvinceStatics',
          params
        )
        .then(response => {
          this.pieReasonData = response.reasons
          this.pieLoading2 = false
        })
        .catch(error => {
          this.pieLoading2 = false
          console.log(error)
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
