<!--
 * @Description: 罪犯劳动统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-02 17:25:05
 -->
<template>
  <!-- <router-link :to="{name:'criminal_in_province_statistics'}">省局入监统计</router-link> -->
  <div>
    <el-row :gutter="10">
      <el-form ref="form" class="yn_form" inline label-width="4rem">
        <el-form-item label="日期:">
          <!-- <el-date-picker
            class="yn_ipt"
            v-model="formData"
            type="daterange"
            :clearable="false"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="pickerChange"
            value-format="yyyy-MM-dd"
          ></el-date-picker>-->
          <el-date-picker
            class="yn_ipt"
            v-model="formData"
            type="date"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="pickerChange"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="yn_btn" @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <headIcon :list="headIconList"></headIcon>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="yn_charts">
          <h3>{{prisonName}}劳动出工比例</h3>
          <!-- <pie-type-chart
            v-loading="chartsLoading"
            :dataList="pieWorkData"
            :chartData="pieWorkData"
            :height="'20rem'"
          ></pie-type-chart>-->
          <bar-analysis
            :haveMark="false"
            labelType="%"
            v-loading="chartsLoading"
            :barAnalysisData="pieWorkData"
            :date="formData"
          ></bar-analysis>
        </div>
      </el-col>

      <el-col :span="24">
        <div class="yn_charts">
          <h3>{{prisonName}}劳动时长统计</h3>

          <bar-analysis v-loading="chartsLoading" :barAnalysisData="barNumberData" :date="formData"></bar-analysis>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts">
          <h3>{{prisonName}}劳动类型占比</h3>
          <pie-type-chart
            v-loading="chartsLoading"
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
import { pickerOptions } from '@/utils/picker_option_config.js'
import pieTypeChart from '@/components/pie_charts/pie_charts'
import { getPrisonId } from '@/utils'
import formatDate from '@/utils/date'
import barAnalysis from '../province_statistics/bar_analysis'
import headIcon from '@/components/head_icon'
export default {
  components: {
    pieTypeChart,
    barAnalysis,
    headIcon
  },
  data () {
    return {
      pickerOptions: pickerOptions,
      chartsLoading: false,
      loginPrisonId: getPrisonId(),
      //   formData: [
      //     formatDate(new Date(), 'yyyy-MM-dd'),
      //     formatDate(new Date(), 'yyyy-MM-dd')
      //   ],
      formData: formatDate(new Date(), 'yyyy-MM-dd'),
      pieTypeData: [],
      //   pieWorkData: [],
      pieWorkData: { xAxis: [], yAxis: [] },
      barNumberData: { xAxis: [], yAxis: [] },
      headIconList: [
        {
          url: require('@/assets/index/waiting_info.png'),
          info: '累计时长',
          text: null,
          isRouter: true,
          routerString: 'criminal_labour',
          params: {}
        },
        {
          url: require('@/assets/index/waiting_yellow.png'),
          info: '平均劳动时长',
          text: null,
          isRouter: true,
          routerString: 'criminal_labour',
          params: {}
        }
      ]
    }
  },
  props: ['prisonId', 'prisonName'],
  created () {
    this.queryData()
  },
  methods: {
    pickerChange (val) {},
    // 查询
    queryData () {
      this.chartsLoading = true
      // 劳动类型饼图数据
      this.axios
        .get(
          this._global.businessUrl +
            '/labour/laborTypeStatistics/' +
            this.formData +
            '/' +
            this.prisonId
        )
        .then(res => {
          console.log(res)
          this.chartsLoading = false
          this.pieTypeData = []

          this.pieTypeData = res.map(item => {
            return {
              name: item.name,
              value: item.result
            }
          })
        })
      // 出工占比
      this.axios
        .get(
          this._global.businessUrl +
            '/labour/prisonWorkRateStatistics/' +
            this.formData +
            '/' +
            this.prisonId
        )
        .then(res => {
          this.pieWorkData = { xAxis: [], yAxis: [] }
          console.log(res)
          res.forEach(el => {
            this.pieWorkData.xAxis.push(el.name)
            this.pieWorkData.yAxis.push(el.result * 100)
          })
          //   this.pieWorkData = res.map(item => {
          //     return {
          //       name: item.name,
          //       value: item.laboringCount
          //     }
          //   })
        })
      // 柱状图数据
      this.axios
        .get(
          this._global.businessUrl +
            '/labour/laborTimeStatistics/' +
            this.formData +
            '/' +
            this.prisonId
        )
        .then(res => {
          this.barNumberData = { xAxis: [], yAxis: [] }
          res.forEach(el => {
            this.barNumberData.xAxis.push(el.name)
            this.barNumberData.yAxis.push((el.result / 60).toFixed(2))
          })
        })
      // 卡片数据
      this.axios
        .get(
          this._global.businessUrl +
            '/labour/prisonStatistics/' +
            this.prisonId +
            '/' +
            this.formData +
            '/' +
            this.formData
        )
        .then(res => {
          if (res.totalTime == null) {
            res.totalTime = 0
          }
          if (res.averageTime == null) {
            res.averageTime = 0
          }
          this.$set(this.headIconList[0], 'text', res.totalTime)
          this.$set(this.headIconList[1], 'text', res.averageTime)
        })
        .catch(error => {
          this.chartsLoading = false
          console.log(error)
        })
    }
  },
  watch: {
    prisonId () {
      this.queryData()
    }
  }
}
</script>
