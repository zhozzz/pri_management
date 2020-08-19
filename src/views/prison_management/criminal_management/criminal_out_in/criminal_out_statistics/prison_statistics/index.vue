<!--
 * @Description: 禁闭隔离统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-04 15:30:27
 -->
<template>
  <div>
    <headIcon :list="headIconList"></headIcon>
    <el-form ref="form" class="yn_form" inline label-width="4rem">
      <el-form-item label="日期:">
        <el-date-picker
          class="yn_ipt yn_date_picker"
          v-model="formData"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
        <el-button type="primary" class="yn_btn" @click="getChartData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="yn_charts">
          <h3>{{prisonName}}离监类型人数分析</h3>
          <!-- <el-form ref="form" class="yn_form" inline label-width="4rem">
            <el-form-item label="日期:">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="formData"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                :clearable="false"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="pickerChange"
                value-format="yyyy-MM-dd hh:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-form>-->
          <pie-type-chart
            v-loading="loading"
            :centerTitle="'离监罪犯'"
            :pieTotal="pieTotal"
            :pieTypeData="pieTypeData"
          ></pie-type-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import pieTypeChart from '../../criminal_in_statistics/province_statistics/pie_type_analysis'
import { getPrisonId } from '@/utils'
import timeSelect from '@/components/time_select/index.vue'
import headIcon from '@/components/head_icon'
import formatDate from '@/utils/date'
let today = new Date().getTime()
let yesterday = today - 24 * 3600 * 1000
export default {
  components: {
    pieTypeChart,
    timeSelect,
    headIcon
  },
  props: ['prisonId', 'prisonName'],
  data () {
    // let tempStart = new Date()
    // let start = new Date(tempStart.getFullYear(), tempStart.getMonth(), '01')
    return {
      pickerOptions: pickerOptions,
      loading: false,
      loginPrisonId: getPrisonId(),
      formData: [],
      pieTypeData: [],
      headIconList: [
        {
          url: require('@/assets/index/crimal_sucess.png'),
          info: '今日离监',
          text: null,
          isRouter: true,
          routerString: 'criminal_check_out',
          params: {
            datePicker: [
              formatDate(new Date(), 'yyyy-MM-dd ') + '00:00:00',
              formatDate(new Date(), 'yyyy-MM-dd ') + '23:59:59'
            ]
          }
        },
        {
          url: require('@/assets/index/crimal_err.png'),
          info: '离监总人数',
          text: null,
          isRouter: true,
          routerString: 'criminal_check_out',
          params: {}
        }
      ],
      pieTotal: 0
    }
  },
  methods: {
    pickerChange (val) {
      this.formData = []
      if (val) {
        val.forEach(item => {
          let day = this.selectDate(new Date(item))
          this.formData.push(day)
        })

        this.getChartData()
      }
    },
    selectDate (date) {
      let year = date.getFullYear()
      let mounth = date.getMonth() + 1
      if (mounth < 10) {
        mounth = '0' + mounth
      }
      let day = date.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return year + '-' + mounth + '-' + day + ' 00:00:00'
    },
    // 获得入监人数和增减比
    getInData () {
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalInOut/queryCriminalOutAddAndTotalPrison/' +
            this.prisonId
        )
        .then(response => {
          this.$set(this.headIconList[0], 'text', response.todayAddPrison)
          this.$set(this.headIconList[1], 'text', response.totalPrison)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 查询
    queryData () {
      this.getChartData()
    },
    // 获取图形数据
    getChartData () {
      let params = {
        beginDay: null,
        endDay: null,
        prisonId: this.prisonId
      }
      if (this.formData && this.formData.length > 0) {
        params.beginDay = this.formData[0]
        params.endDay = this.formData[1]
      }
      this.loading = true
      this.axios
        .post(
          this._global.businessUrl + '/criminalInOut/queryCriminalOutPrison',
          params
        )
        .then(response => {
          this.pieTypeData = response.types
          this.pieTotal = 0
          this.pieTypeData.forEach(el => {
            // 离监总数
            this.pieTotal += parseInt(el.value)
          })
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    }
  },
  created () {
    this.formData[0] = this.selectDate(new Date(yesterday))
    this.formData[1] = this.selectDate(new Date(today))
    this.getInData()
    this.getChartData()
  },
  watch: {
    prisonId () {
      this.getInData()
      this.getChartData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
