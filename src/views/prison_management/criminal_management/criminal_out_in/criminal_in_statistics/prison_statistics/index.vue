<!--
 * @Description: 地方入监
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-02 15:54:47
 -->
<template>
  <div>
    <headIcon :list="headIconList">
      <el-button class="yn_btn" type="primary" @click.stop="checkIn">新犯入监</el-button>
      <el-button class="yn_btn" type="primary" @click.stop="checkOut">罪犯返监</el-button>
    </headIcon>

    <el-row>
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
            value-format="yyyy-MM-dd hh:mm:ss"
          ></el-date-picker>
          <el-button type="primary" class="yn_btn" @click="getLine">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="10">
      <!-- <el-col :span="12">
        <div class="yn_charts">
          <h3>{{prisonName}}入监罪犯分管等级分析</h3>
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
                @change="getPie"
                value-format="yyyy-MM-dd hh:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <pie-type-chart
            v-loading="pieLoading"
            :dataList="pieTypeData"
            :chartData="pieTypeData"
            :height="'300px'"
          ></pie-type-chart>
        </div>
      </el-col>-->
      <el-col :span="12">
        <div class="yn_charts">
          <h3>{{prisonName}}入监人数趋势</h3>
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
                  @change="getLine"
                  value-format="yyyy-MM-dd hh:mm:ss"
                ></el-date-picker>
                <el-button type="primary" class="yn_btn" @click="getLine">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>-->
          <line-analysis v-loading="lineLoading" :lineReasonData="lineReasonData"></line-analysis>
        </div>
      </el-col>
    </el-row>
    <check-in-dialog
      :checkInVisible="checkInVisible"
      :handleCloseCheckIn="handleCloseCheckIn"
      @addSuc="getInData();getChartData()"
    ></check-in-dialog>
    <criminalBack
      :prisonId="sonPrisonId"
      :deptId="sonDeptId"
      :checkOutVisible="checkOutVisible"
      :handleCloseCheckOut="handleCloseCheckOut"
    />
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import pieTypeChart from '@/components/pie_charts/pie_charts'
import lineAnalysis from '../province_statistics/line_analysis'
import { getPrisonId, getDeptId } from '@/utils'
import checkInDialog from './check_in_dialog'
import criminalBack from './criminal_back'
import { formatDate, getPreMonth, getYearAndMonthAndDay } from '@/utils/date'
import headIcon from '@/components/head_icon'
export default {
  components: {
    pieTypeChart,
    lineAnalysis,
    checkInDialog,
    headIcon,
    criminalBack
  },
  data() {
    return {
      pickerOptions: pickerOptions,
      checkInVisible: false,
      checkOutVisible: false,
      loginPrisonId: getPrisonId(),
      pieLoading: false,
      lineLoading: false,
      pieTypeData: [],
      pieTotal: 0,
      sonDeptId: '',
      sonPrisonId: '',
      lineReasonData: {
        xAxis: [],
        yAxis: []
      },
      headIconList: [
        {
          url: require('@/assets/index/crimal_sucess.png'),
          info: '今日入监',
          text: null,
          isRouter: true,
          routerString: 'criminal_manegement',
          params: {
            datePicker: [new Date(), new Date()]
          }
        },
        {
          url: require('@/assets/index/crimal_primary.png'),
          info: '罪犯总数',
          text: null,
          isRouter: true,
          routerString: 'criminal_manegement',
          params: {}
        }
      ],
      formData1: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ],
      formData2: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ]
    }
  },
  props: ['prisonId', 'prisonName', 'deptId'],
  methods: {
    // 获得入监人数和增减比
    getInData() {
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalInOut/queryCriminalInAddAndTotalPrison/' +
            this.prisonId
        )
        .then(response => {
          this.$set(this.headIconList[0], 'text', response.todayAddPrison)
          this.$set(this.headIconList[1], 'text', response.prisonAllPrison)
          this.todayAdd = response.todayAddPrison
          this.total = response.prisonAllPrison
        })
        .catch(error => {
          console.log(error)
        })
    },
    checkOut() {
      this.checkOutVisible = true
    },
    handleCloseCheckOut() {
      this.checkOutVisible = false
      this.getLine(this.formData2)
    },
    // 打开入监模态框
    checkIn() {
      this.checkInVisible = true
    },
    // 关闭入监模态框
    handleCloseCheckIn() {
      this.checkInVisible = false
      this.getLine(this.formData2)
    },
    // 查询
    getPie(val) {
      if (val) {
        let params = {
          beginDay: val[0],
          endDay: val[1],
          prisonId: this.prisonId
        }
        this.pieLoading = true
        this.axios
          .post(
            this._global.businessUrl + '/criminalInOut/queryCriminalInPrison',
            params
          )
          .then(response => {
            this.pieTypeData = response.types
            this.pieTotal = 0
            this.pieTypeData.forEach(el => {
              // 入监总数
              this.pieTotal += parseInt(el.value)
            })
            this.pieLoading = false
          })
          .catch(error => {
            this.pieLoading = false
            console.log(error)
          })
      }
    },
    getLine(val) {
      if (val) {
        let temp = []
        temp[0] = formatDate(new Date(this.formData2[0]), 'yyyy-MM-dd')
        temp[1] = formatDate(new Date(this.formData2[1]), 'yyyy-MM-dd')
        let dayList = getYearAndMonthAndDay(temp[0], temp[1])
        let params = {
          beginDay: this.formData2[0],
          endDay: this.formData2[1],
          prisonId: this.prisonId
        }
        this.lineLoading = true
        this.axios
          .post(
            this._global.businessUrl + '/criminalInOut/queryCriminalInPrison',
            params
          )
          .then(res => {
            this.lineReasonData = {
              xAxis: dayList,
              // eslint-disable-next-line no-return-assign
              yAxis: dayList.map(item => (item = 0))
            }
            res.trends.forEach((el, i) => {
              dayList.forEach((item, j) => {
                if (el.name === item) {
                  this.lineReasonData.yAxis[j] = el.value
                }
              })
            })
            this.lineLoading = false
          })
          .catch(error => {
            this.lineLoading = false
            console.log(error)
          })
      }
    }
  },
  created() {
    // this.getPie(this.formData1)
    this.getLine(this.formData2)
    this.getInData()
    this.sonPrisonId = this.prisonId
    this.sonDeptId = this.deptId
  },
  watch: {
    prisonId(val) {
      //   this.getPie(this.formData1)
      this.getLine(this.formData2)
      this.sonDeptId = val
      this.sonPrisonId = val
      this.getInData()
    }
  }
}
</script>
<style lang="less" scoped>
.slot_btn {
  .yn_btn {
    display: block;
    margin: 10px 0;
  }
}
</style>
