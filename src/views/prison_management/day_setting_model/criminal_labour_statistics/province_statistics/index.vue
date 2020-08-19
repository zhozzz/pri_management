<!--
 * @Description: 劳动统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-05 14:41:25
 -->
<template>
  <div>
    <el-row :gutter="10">
      <el-row>
        <el-form ref="form" class="yn_form" inline label-width="4rem">
          <el-form-item label="日期:">
            <el-date-picker
              v-model="formData"
              :clearable="false"
              type="date"
              @change="pickerChange"
              value-format="yyyy-MM-dd"
              class="yn_ipt"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="yn_btn" @click="getLine">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!-- <el-col :span="24">
        <div class="yn_charts">
          <h3>劳动数量统计</h3>
          <el-form ref="form"
                   class="yn_form"
                   inline
                   label-width="4rem">
            <el-form-item label="日期:">
              <el-date-picker v-model="formData1"
                              type="month"
                              :clearable="false"
                              @change="pickerChange"
                              value-format="yyyy-MM-dd"
                              class="yn_ipt"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         class="yn_btn"
                         @click="getBar">查询</el-button>
            </el-form-item>
          </el-form>
          <bar-analysis v-loading="chartsLoading1"
                        :barAnalysisData="barNumberData"
                        :date="formData1"></bar-analysis>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="yn_charts">
          <h3>劳动时间统计（小时）</h3>
          <el-row>
            <el-form ref="form"
                     class="yn_form"
                     inline
                     label-width="4rem">
              <el-form-item label="日期:">
                <el-date-picker v-model="formData2"
                                :clearable="false"
                                type="month"
                                @change="pickerChange"
                                value-format="yyyy-MM-dd"
                                class="yn_ipt"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           class="yn_btn"
                           @click="getBar2">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <bar-analysis v-loading="chartsLoading2"
                        :barAnalysisData="barTimeData"
                        :date="formData2"></bar-analysis>
        </div>
      </el-col>-->

      <el-col :span="24">
        <div class="yn_charts">
          <h3>劳动出工比例</h3>
          <!-- <pie-type-chart
            v-loading="chartsLoading3"
            :dataList="barNumberData"
            :chartData="barNumberData"
            :height="'20rem'"
          ></pie-type-chart>-->
          <bar-analysis
            labelType="%"
            :haveMark="false"
            chartName="劳动出工比例统计图"
            v-loading="chartsLoading3"
            :barAnalysisData="barNumberData"
            :date="formData"
          ></bar-analysis>
        </div>
      </el-col>

      <el-col :span="24">
        <div class="yn_charts">
          <h3>劳动时长统计</h3>

          <bar-analysis
            chartName="劳动时长比例统计图"
            v-loading="chartsLoading1"
            :barAnalysisData="barTimeData"
            :date="formData"
          ></bar-analysis>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts">
          <h3>劳动类型占比</h3>

          <pie-type-chart
            v-loading="chartsLoading3"
            :dataList="pieTypeData"
            :chartData="pieTypeData"
            :height="'20rem'"
          ></pie-type-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pieTypeChart from '@/components/pie_charts/pie_charts'
import barAnalysis from './bar_analysis'
import { getPrisonId } from '@/utils'
import formatDate from '@/utils/date'
export default {
  components: {
    pieTypeChart,
    barAnalysis
  },
  data () {
    return {
      chartsLoading1: false,
      chartsLoading2: false,
      chartsLoading3: false,
      loginPrisonId: getPrisonId(),
      formData: formatDate(new Date(), 'yyyy-MM-dd'),
      formData1: formatDate(new Date(), 'yyyy-MM-dd'),
      formData2: formatDate(new Date(), 'yyyy-MM-dd'),
      formData3: formatDate(new Date(), 'yyyy-MM-dd'),
      pieTypeData: [],
      barNumberData: {
        xAxis: [],
        yAxis: []
      },
      //   barNumberData: [],
      barTimeData: {
        xAxis: [],
        yAxis: []
      }
    }
  },
  props: ['prisonId', 'prisonName'],
  created () {
    // this.getBar()
    // this.getBar2()
    this.getLine()
  },
  methods: {
    pickerChange (val) {},
    getLine () {
      this.chartsLoading1 = true
      this.chartsLoading2 = true
      this.chartsLoading3 = true
      // 出工比例
      this.axios
        .get(
          this._global.businessUrl +
            '/labour/provinceWorkRateStatistics/' +
            this.formData
        )
        .then(res => {
          console.log(res)
          this.chartsLoading1 = false
          //   this.barNumberData = []
          this.barNumberData = { xAxis: [], yAxis: [] }
          res.forEach(el => {
            this.barNumberData.xAxis.push(el.name)
            this.barNumberData.yAxis.push(el.result * 100)
          })
          //   res.map(item => {
          //     if (item.result > 0) {
          //       this.barNumberData.push({
          //         name: item.name,
          //         value: item.laboringCount
          //       })
          //     }
          //   })
        })
        .catch(err => {
          this.chartsLoading1 = false
          console.log(err)
        })
      // 事务类型
      this.axios
        .get(
          this._global.businessUrl +
            '/labour/laborTypeStatistics/' +
            this.formData +
            '/' +
            '1'
        )
        .then(res => {
          this.chartsLoading2 = false
          this.pieTypeData = []

          this.pieTypeData = res.map(item => {
            return {
              name: item.name,
              value: item.result
            }
          })
        })
        .catch(err => {
          this.chartsLoading2 = false
          console.log(err)
        })
      // 时长
      this.axios
        .get(
          this._global.businessUrl +
            '/labour/provinceLaborTimeStatistics/' +
            this.formData
        )
        .then(res => {
          this.chartsLoading3 = false
          this.barTimeData = { xAxis: [], yAxis: [] }
          res.forEach(el => {
            this.barTimeData.xAxis.push(el.name)
            this.barTimeData.yAxis.push((el.result / 60).toFixed(2))
          })
        })
        .catch(err => {
          this.chartsLoading3 = false

          console.log(err)
        })
    }
    // 查询
    // getBar () {
    //   this.chartsLoading1 = true
    //   this.barNumberData.xAxis = []
    //   this.barNumberData.yAxis = []
    //   this.axios
    //     .get(
    //       this._global.businessUrl +
    //         '/labour/provincialCounts/' +
    //         this.formData1
    //     )
    //     .then(
    //       res => {
    //         res.forEach(el => {
    //           this.barNumberData.xAxis.push(el.deptName)
    //           this.barNumberData.yAxis.push(el.result)
    //         })
    //         this.chartsLoading1 = false
    //       },
    //       () => {
    //         this.chartsLoading1 = false
    //       }
    //     )
    // },
    // getBar2 () {
    //   this.chartsLoading2 = true
    //   this.barTimeData.xAxis = []
    //   this.barTimeData.yAxis = []
    //   this.axios
    //     .get(
    //       this._global.businessUrl + '/labour/provincialTime/' + this.formData2
    //     )
    //     .then(
    //       res => {
    //         res.forEach(el => {
    //           this.barTimeData.xAxis.push(el.deptName)
    //           this.barTimeData.yAxis.push(el.result)
    //         })
    //         this.chartsLoading2 = false
    //       },
    //       () => {
    //         this.chartsLoading2 = false
    //       }
    //     )
    // },
    // getLine () {
    //   this.chartsLoading3 = true
    //   this.axios
    //     .get(
    //       this._global.businessUrl +
    //         '/labour/provincialProjects/' +
    //         this.formData3
    //     )
    //     .then(
    //       res => {
    //         this.pieTypeData = res.map(item => {
    //           return { name: item.name, value: item.result }
    //         })
    //         this.chartsLoading3 = false
    //       },
    //       () => {
    //         this.chartsLoading3 = false
    //       }
    //     )
    // }
  },
  watch: {
    prisonId () {
      this.getChartData()
    }
  }
}
</script>
