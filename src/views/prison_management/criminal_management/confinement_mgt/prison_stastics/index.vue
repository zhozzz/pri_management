<!--
 * @Description: 禁闭隔离统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-17 11:18:50
 -->
<template>
  <div class="province_statistic">
    <headIcon :list="headIconList"></headIcon>
    <el-form ref="form" class="yn_form" inline label-width="4rem">
      <el-form-item label="日期:">
        <el-date-picker
          class="yn_ipt"
          v-model="formData2"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
        <el-button type="primary" class="yn_btn" @click="getPie1">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="yn_charts">
          <h3>{{prisonName}}禁闭/隔离罪犯分管等级分析</h3>
          <!-- <el-form ref="form" class="yn_form" inline label-width="4rem">
            <el-form-item label="日期:">
              <el-date-picker
                class="yn_ipt"
                v-model="formData2"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getPie1"
                value-format="yyyy-MM-dd hh:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-form>-->
          <pie-type-chart :pieTypeData="pieTypeData"></pie-type-chart>
        </div>
      </el-col>
      <!-- <el-col :span="12">
        <div class="yn_charts">
          <h3>{{prisonName}}禁闭/隔离原因分析</h3>
         
          <pie-reason-chart :pieReasonData="pieReasonData"></pie-reason-chart>
        </div>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import pieTypeChart from '../province_stastics/pie_type_analysis'
import pieReasonChart from '../province_stastics/pie_reason_analysis'
import { getPrisonId } from '@/utils'
import { formatDate, getPreMonth, getYearAndMonthAndDay } from '@/utils/date'
import headIcon from '@/components/head_icon'
export default {
  components: {
    pieTypeChart,
    pieReasonChart,
    headIcon
  },
  props: ['prisonId', 'prisonName'],
  data() {
    return {
      pickerOptions: pickerOptions,
      pieLoading1: false,
      pieLoading2: false,
      loginPrisonId: getPrisonId(),
      formData3: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ],
      formData2: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ],
      pieTypeData: [],
      pieReasonData: [],
      headIconList: [
        {
          url: require('@/assets/index/crimal_primary.png'),
          info: '今日新增',
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
  mounted() {
    this.getInData()
    this.getPie1()
    // this.getPie1(this.formData2)
    // this.getPie2(this.formData3)
  },
  methods: {
    // 获得隔离人数和增减比
    getInData() {
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalIsolation/queryCriminalOutAddAndTotalPrison/' +
            this.prisonId
        )
        .then(response => {
          this.todayAdd = response.todayAddPrison
          this.$set(this.headIconList[0], 'text', response.todayAddPrison)
          this.$set(this.headIconList[1], 'text', response.totalPrison)
        })
        .catch(() => {})
    },
    getPie1(val) {
      let params = {
        beginDay: this.formData2[0],
        endDay: this.formData2[1],
        prisonId: this.prisonId
      }
      this.pieLoading1 = true

      this.pieLoading2 = true

      this.axios
        .post(
          this._global.businessUrl + '/criminalIsolation/queryPrisonStatics',
          params
        )
        .then(response => {
          this.pieTypeData = response.types
          this.pieLoading1 = false

          this.pieReasonData = response.reasons
          this.pieLoading2 = false
        })
        .catch(() => {
          this.pieLoading1 = false
        })
    },
    getPie2(val) {
      let params = {
        beginDay: val[0],
        endDay: val[1],
        prisonId: this.prisonId
      }
      this.pieLoading2 = true
      this.axios
        .post(
          this._global.businessUrl + '/criminalIsolation/queryPrisonStatics',
          params
        )
        .then(response => {
          this.pieReasonData = response.reasons
          this.pieLoading2 = false
        })
        .catch(() => {
          this.pieLoading2 = false
        })
    }
  },
  watch: {
    prisonId() {
      this.getInData()
      this.getPie1(this.formData2)
      //   this.getPie2(this.formData3)
    }
  }
}
</script>
<style lang="less" scoped>
.header_card {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  .el-card {
    width: 15rem !important;
    line-height: 1rem;
    font-size: 1.1rem;
  }
}
.select-data-picker {
  .date-picker {
    width: 100%;
  }
}
.chart_title {
  display: table;
  margin: 0 auto;
  font-weight: bold;
}
.chart-wrapper {
  width: 100%;
  border: 1px solid #cddded;
  border-radius: 2px;
  background: rgba(251, 252, 255, 1);
  box-sizing: border-box;
  margin-bottom: 10px;
  padding-left: 20px;
  padding-top: 0px;
}
</style>
