<!--
 * @Description: 入监统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-04 15:12:36
 -->
<template>
  <div>
    <!-- <router-link :to="{name:'criminal_in_prison_statistics'}">地方入监统计</router-link> -->
    <headIcon :list="headIconList"></headIcon>
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
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
        <el-button type="primary" class="yn_btn" @click="getBar">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="18">
        <div class="yn_charts">
          <h3>全省犯人入监</h3>
          <!-- <el-form ref="form" class="yn_form" inline label-width="4rem">
            <el-form-item label="日期:">
              <el-date-picker
                class="yn_ipt"
                v-model="formData3"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd hh:mm:ss"
              ></el-date-picker>
              <el-button type="primary" class="yn_btn" @click="getBar">查询</el-button>
            </el-form-item>
          </el-form>-->
          <number-analysis v-loading="barLoading" :chartData="barChartData"></number-analysis>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="yn_charts in-ranking">
          <h3>犯人入监排名</h3>
          <ul>
            <li
              v-for="(item,i) of inRankingList"
              :key="i"
              @click="jumpToPrison(item.id,item.prisonName)"
            >
              <p>
                <!-- <img
                  v-if="i===0"
                  :src="require('@/assets/index/cup_1.gif')"
                  style="height:20px;width:25px;vertical-align:middle"
                />
                <img
                  v-if="i===1"
                  :src="require('@/assets/index/cup_2.png')"
                  style="height:20px;width:25px;vertical-align:middle"
                />
                <img
                  v-if="i===2"
                  :src="require('@/assets/index/cup_3.png')"
                  style="height:20px;width:25px;vertical-align:middle"
                />-->
                <!-- <span v-if="i>2" class="ranking_num" :class="{ranking_num_grey:i>2}">{{i+1}}</span> -->
                <!-- <span class="ranking_num_grey">{{i+1}}</span> -->
                <span>{{item.name}}</span>
              </p>
              <p>
                <span>{{item.num}}</span>
                <i class="el-icon-arrow-right"></i>
              </p>
            </li>
          </ul>
        </div>
      </el-col>
      <!-- <el-col :span="12">
        <div class="yn_charts">
          <h3>全省入监罪犯分管等级分析</h3>
          <el-row>
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
          </el-row>
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
          <h3>全省入监人数趋势</h3>
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
              </el-form-item>
            </el-form>
          </el-row>-->
          <line-analysis v-loading="lineLoading" :lineReasonData="lineReasonData"></line-analysis>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import numberAnalysis from './number_analysis'
import pieTypeChart from '@/components/pie_charts/pie_charts'
import lineAnalysis from './line_analysis'
import timeSelect from '@/components/time_select'
import { formatDate, getPreMonth, getYearAndMonthAndDay } from '@/utils/date'
import headIcon from '@/components/head_icon'
export default {
  components: {
    numberAnalysis,
    pieTypeChart,
    lineAnalysis,
    timeSelect,
    headIcon
  },
  data () {
    return {
      pickerOptions: pickerOptions,
      barLoading: false,
      pieLoading: false,
      lineLoading: false,
      barChartData: {
        xAxis: [],
        yAxis: []
      },
      pieTypeData: [],
      // 入监总人数
      pieTotal: 0,
      lineReasonData: {
        xAxis: [],
        yAxis: []
      },
      inRankingList: [],
      headIconList: [
        {
          url: require('@/assets/index/crimal_sucess.png'),
          info: '本省今日入监',
          text: null,
          isRouter: true,
          routerString: 'criminal_manegement',
          params: {
            datePicker: [new Date(), new Date()]
          }
        },
        {
          url: require('@/assets/index/crimal_primary.png'),
          info: '罪犯总人数',
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
      ],
      formData3: [
        getPreMonth(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')),
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      ]
    }
  },
  mounted () {
    this.getInData()
    // this.getLine(this.formData1)
    // this.getPie(this.formData2)
    this.getBar(this.formData3)
  },
  methods: {
    // 获得入监人数和增减比
    getInData () {
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalInOut/queryCriminalInAddAndTotalProvince'
        )
        .then(response => {
          this.$set(this.headIconList[0], 'text', response.todayAdd)
          this.$set(this.headIconList[1], 'text', response.total)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 数组对象排序
    creatCompare (propertyName) {
      return function (obj1, obj2) {
        var value1 = parseFloat(obj1[propertyName])
        var value2 = parseFloat(obj2[propertyName])
        if (value1 < value2) {
          return 1
        } else if (value1 > value2) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 查询
    getBar (val) {
      if (this.formData3) {
        let params = {}
        params.beginDay = this.formData3[0]
        params.endDay = this.formData3[1]
        this.barLoading = true

        this.axios
          .post(
            this._global.businessUrl + '/criminalInOut/queryCriminalInProvince',
            params
          )
          .then(res => {
            this.barChartData = {
              xAxis: [],
              yAxis: []
            }
            this.inRankingList = []
            res.columnDiagram.forEach((el, i) => {
              this.barChartData.xAxis.push(el.prisonName)
              this.barChartData.yAxis.push(el.zfCount)
              let obj = {
                name: el.prisonName,
                num: el.zfCount,
                id: el.deptId,
                prisonName: el.prisonName
              }
              this.inRankingList.push(obj)
            })
            // 排序
            // this.inRankingList.sort(this.creatCompare('num'))
            console.log(this.inRankingList)
            this.barLoading = false
          })
          .catch(() => {
            this.barLoading = false
          })

        let temp = []
        temp[0] = formatDate(new Date(this.formData3[0]), 'yyyy-MM-dd')
        temp[1] = formatDate(new Date(this.formData3[1]), 'yyyy-MM-dd')
        let dayList = getYearAndMonthAndDay(temp[0], temp[1])
        let params2 = {
          beginDay: this.formData3[0],
          endDay: this.formData3[1]
        }
        this.lineLoading = true
        this.axios
          .post(
            this._global.businessUrl + '/criminalInOut/queryCriminalInProvince',
            params2
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
    },
    getPie (val) {
      if (val) {
        let params = {
          beginDay: val[0],
          endDay: val[1]
        }
        this.pieLoading = true
        this.axios
          .post(
            this._global.businessUrl + '/criminalInOut/queryCriminalInProvince',
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
    getLine (val) {
      if (val) {
        let temp = []
        temp[0] = formatDate(new Date(val[0]), 'yyyy-MM-dd')
        temp[1] = formatDate(new Date(val[1]), 'yyyy-MM-dd')
        let dayList = getYearAndMonthAndDay(temp[0], temp[1])
        let params = {
          beginDay: val[0],
          endDay: val[1]
        }
        this.lineLoading = true
        this.axios
          .post(
            this._global.businessUrl + '/criminalInOut/queryCriminalInProvince',
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
    },
    jumpToPrison (id, prisonName) {
      this.$emit('getRankingPrisonId', id, prisonName)
    }
  }
}
</script>
<style lang="less" scoped>
.standard {
  .in-ranking {
    padding: 0 20px;
    li {
      margin: 0;
      padding: 0;
    }
    ul {
      height: 25rem;
      overflow-y: scroll;
      padding-left: 10px;
      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        p {
          margin: 5px 0;
          .ranking_num {
            display: inline-block;
            width: 25px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            // background: #314659;
            border-radius: 50%;
          }
          .ranking_num_grey {
            background: #f0f2f5;
          }
        }
      }
    }
  }
}
.technology {
  .in-ranking {
    padding: 0 20px;
    li {
      margin: 0;
      padding: 0;
    }
    ul {
      height: 25rem;
      overflow-y: scroll;
      padding-left: 10px;
      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        p {
          margin: 5px 0;
          .ranking_num {
            display: inline-block;
            width: 25px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
          }
          .ranking_num_grey {
            background: #15448b;
          }
        }
      }
    }
  }
}
</style>
