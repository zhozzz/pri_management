<!--
 * @Description: 休息统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-14 10:44:44
 -->
<template>
  <div>
    <headIcon :list="headIconList"></headIcon>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="yn_charts">
            <h3>{{prisonName}}休息天数/月</h3>
            <el-row>
              <el-form ref="form" class="yn_form" inline label-width="4rem">
                <el-form-item label="日期:">
                  <el-date-picker
                    v-model="formData1"
                    :clearable="false"
                    type="month"
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
            <line-analysis v-loading="lineLoading" :lineReasonData="lineDaysData"></line-analysis>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>{{prisonName}}警察/罪犯人数占比</h3>
            <el-row>
              <el-form ref="form" class="yn_form" inline label-width="4rem">
                <el-form-item label="日期:">
                  <el-date-picker
                    v-model="formData2"
                    :clearable="false"
                    type="month"
                    @change="pickerChange"
                    value-format="yyyy-MM-dd"
                    class="yn_ipt"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="yn_btn" @click="getPie">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <pie-type-chart
              v-loading="pieLoading"
              :dataList="pieTypeData"
              :chartData="pieTypeData"
              :height="'300px'"
            ></pie-type-chart>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import lineAnalysis from '../../criminal_study_statistics/province_statistics/line_analysis'
import pieTypeChart from '@/components/pie_charts/pie_charts'
import { getPrisonId } from '@/utils'
import { formatDate, getPreMonth, getYearAndMonthAndDay } from '@/utils/date'
import headIcon from '@/components/head_icon'

export default {
  components: {
    pieTypeChart,
    lineAnalysis,
    headIcon
  },
  props: ['prisonId', 'prisonName'],
  data () {
    return {
      images: {
        timeLang: require('@/assets/index/people.png')
      },
      pieLoading: false,
      lineLoading: false,
      pieTypeData: [],
      lineDaysData: {
        xAxis: [],
        yAxis: []
      },
      formData1: formatDate(new Date(), 'yyyy-MM-dd'),
      formData2: formatDate(new Date(), 'yyyy-MM-dd'),
      headIconList: [
        {
          url: require('@/assets/index/crimal_sucess.png'),
          info: '今日休息罪犯数',
          text: 0,
          isRouter: true,
          routerString: 'criminal_rest',
          params: {
            datePicker: [
              formatDate(new Date(), 'yyyy-MM-dd ') + '00:00:00',
              formatDate(new Date(), 'yyyy-MM-dd ') + '23:59:59'
            ]
          }
        },
        {
          url: require('@/assets/index/crimal_primary.png'),
          info: '今日监督警察数',
          text: 0,
          isRouter: true,
          routerString: 'criminal_rest',
          params: {
            datePicker: [
              formatDate(new Date(), 'yyyy-MM-dd ') + '00:00:00',
              formatDate(new Date(), 'yyyy-MM-dd ') + '23:59:59'
            ]
          }
        }
      ]
    }
  },
  created () {
    this.getLine(this.formData1)
    this.getPie(this.formData2)
  },
  methods: {
    pickerChange (val) {},
    // 查询
    getLine (val) {
      this.LineLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/rest/queryCriminalRestPrison/' +
            this.prisonId +
            '/' +
            this.formData1
        )
        .then(
          res => {
            this.lineDaysData.xAxis = res.countsByDay.map(item =>
              formatDate(new Date(item.title), 'yyyy-MM-dd')
            )
            this.lineDaysData.yAxis = {}
            this.lineDaysData.yAxis.criminal = res.countsByDay.map(
              item => item.result
            )
            this.lineDaysData.yAxis.police = res.countsByDay.map(
              item => item.result2
            )
            this.$set(this.headIconList[0], 'text', res.studyCriminalCounts)
            this.$set(this.headIconList[1], 'text', res.studyPoliceCounts)
            this.LineLoading = false
          },
          () => {
            this.LineLoading = false
          }
        )
    },
    getPie (val) {
      this.PieLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/rest/queryCriminalRestPrison/' +
            this.prisonId +
            '/' +
            this.formData2
        )
        .then(
          res => {
            let list = [
              {
                name: '罪犯人数',
                value: res.criminalCountsInMonth
              },
              {
                name: '警察人数',
                value: res.policeCountsInMonth
              }
            ]
            this.pieTypeData = list
            this.PieLoading = false
          },
          () => {
            this.PieLoading = false
          }
        )
    }
  },
  watch: {
    prisonId (val) {
      this.getLine(this.formData1)
      this.getPie(this.formData2)
    }
  }
}
</script>
