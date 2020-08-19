<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:38:34
 -->

<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯住院']">
      <tab slot="heade_btn" name="罪犯住院管理" :left="true" pathName="criminal_hospitalization" />
      <!-- <el-row v-show="prisonId!=1"> -->
      <el-form ref="form" class="yn_form" inline label-width="4rem">
        <el-form-item label="日期:">
          <el-date-picker
            class="yn_ipt"
            v-model="date"
            :clearable="false"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-button type="primary" class="yn_btn" @click="getAllData">查询</el-button>
        </el-form-item>
      </el-form>
      <headIcon v-show="prisonId!=1" :list="headIconList"></headIcon>

      <!-- 柱状图 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}}住院情况</h3>
            <!-- <timeSelect @setTime="timeSet" :noDefault="false" v-show="prisonId==1" /> -->
            <div id="bar_main" v-loading="barLoading"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>住院人数分布</h3>
            <!-- <timeSelect @setTime="numTimeSet" /> -->
            <PieChart
              :chartData="numPieList"
              class="pie_one"
              :dataList="numPieList"
              :radius="['40%','60%']"
              :roseType="false"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>住院类型</h3>
            <!-- <timeSelect @setTime="typeTimeSet" /> -->
            <PieChart
              :chartData="typesList"
              class="pie_one"
              :dataList="typesList"
              v-loading="typeLoading"
              :radius="['40%','60%']"
              :roseType="false"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>住院原因</h3>
            <!-- <timeSelect @setTime="reasonTimeSet" /> -->
            <PieChart
              :chartData="reasonList"
              class="pie_two"
              tipName="原因"
              v-loading="reasonLoading"
              :dataList="reasonList"
              :radius="['40%','60%']"
              :roseType="false"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>住院罪犯年龄分布</h3>
            <!-- <timeSelect @setTime="ageTimeSet" /> -->
            <PieChart
              :chartData="ageList"
              :radius="['40%','60%']"
              class="pie_two"
              v-loading="ageLoading"
              :dataList="ageList"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>住院罪犯类型分布</h3>
            <!-- <timeSelect @setTime="ageTimeSet" /> -->
            <PieChart
              :chartData="criTypeList"
              v-loading="criTypeLoading"
              class="pie_two"
              :dataList="criTypeList"
            />
          </div>
        </el-col>
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}}年度住院情况</h3>
            <el-form ref="form" class="yn_form" inline label-width="7rem">
              <el-form-item label="选择年份:">
                <el-date-picker
                  :clearable="false"
                  class="yn_ipt"
                  v-model="year"
                  type="year"
                  placeholder="选择年"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn btn_pad" type="primary" @click="searchyear">查询</el-button>
              </el-form-item>
            </el-form>
            <div id="year_main"></div>
          </div>
        </el-col>
      </el-row>
      <!-- 饼图 -->
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import PieChart from '@/components/pie_charts/pie_charts.vue'
import deptLayout from '@/components/deptLayout/index.vue'
import timeSelect from '@/components/time_select/index.vue'
import tab from '@/components/tab/index.vue'
import headIcon from '@/components/head_icon'
import color from '@/utils/echarts_color'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree/'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

let days = new Date()
let year = days.getFullYear()
let mounth = days.getMonth() + 1
if (mounth < 10) {
  mounth = '0' + mounth
}
let day = days.getDate()
if (day < 10) {
  day = '0' + day
}
let today = year + '-' + mounth + '-' + day
let yestarday = year + '-' + mounth + '-' + '01'

export default {
  data() {
    return {
      pickerOptions: pickerOptions,
      date: [yestarday, today], // 时间
      typeDate: [yestarday, today], // 时间
      reasonDate: [yestarday, today], // 时间
      year: today,
      prisonName: '全省各监狱',
      qeuryParams: {},
      prisonId: getPrisonId(),
      barLoading: false,
      typeLoading: false,
      reasonLoading: false,
      yearLoading: false,
      prisonList: [],
      numlist: [],
      typesList: [],
      reasonList: [],
      mounthList: [],
      mounths: [
        { name: '1月', value: 0 },
        { name: '2月', value: 0 },
        { name: '3月', value: 0 },
        { name: '4月', value: 0 },
        { name: '5月', value: 0 },
        { name: '6月', value: 0 },
        { name: '7月', value: 0 },
        { name: '8月', value: 0 },
        { name: '9月', value: 0 },
        { name: '10月', value: 0 },
        { name: '11月', value: 0 },
        { name: '12月', value: 0 }
      ],
      ageDate: [yestarday, today],
      ageList: [],
      ageLoading: false,
      criTypeDate: [yestarday, today],
      criTypeList: [],
      criTypeLoading: false,
      numLoading: false,
      numPieList: [],
      numdate: [yestarday, today],
      headIconList: [
        {
          url: require('@/assets/index/crimal_primary.png'),
          info: '住院罪犯总数',
          text: null,
          isRouter: true,
          routerString: 'criminal_hospitalization',
          params: {}
        },
        {
          url: require('@/assets/index/crimal_err.png'),
          info: '异常罪犯数',
          text: 0,
          isRouter: true,
          routerString: 'criminal_hospitalization',
          params: {}
        }
      ]
    }
  },
  components: {
    PieChart,
    deptLayout,
    timeSelect,
    tab,
    headIcon,
    menuTree
  },
  created() {
    this.getAllData()
    this.getYearData()
    if (this.prisonId != 1) {
      this.prisonName = '监狱'
    }
  },
  methods: {
    selcetTime(date) {
      let year = date.getFullYear()
      let mounth = date.getMonth() + 1
      if (mounth < 10) {
        mounth = '0' + mounth
      }
      let day = date.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return year + '-' + mounth + '-' + day
    },
    timeSet(val) {
      if (val) {
        this.date[0] = this.selcetTime(new Date(val[0]))
        this.date[1] = this.selcetTime(new Date(val[1]))
        this.getAllData()
      } else {
        this.date = []
      }
    },
    numTimeSet(val) {
      if (val) {
        this.numdate[0] = this.selcetTime(new Date(val[0]))
        this.numdate[1] = this.selcetTime(new Date(val[1]))
        this.getNumData()
      } else {
        this.date = []
      }
    },
    typeTimeSet(val) {
      if (val) {
        this.typeDate[0] = this.selcetTime(new Date(val[0]))
        this.typeDate[1] = this.selcetTime(new Date(val[1]))
        this.getTypeData()
      } else {
        this.typeDate = []
      }
    },
    reasonTimeSet(val) {
      if (val) {
        this.reasonDate[0] = this.selcetTime(new Date(val[0]))
        this.reasonDate[1] = this.selcetTime(new Date(val[1]))
        this.getReasonData()
      } else {
        this.reasonDate = []
      }
    },
    ageTimeSet(val) {
      if (val) {
        this.ageDate[0] = this.selcetTime(new Date(val[0]))
        this.ageDate[1] = this.selcetTime(new Date(val[1]))

        this.getAgeData()
      } else {
        this.ageDate = []
      }
    },
    criTypeTimeSet(val) {
      if (val) {
        this.criTypeDate[0] = this.selcetTime(new Date(val[0]))
        this.criTypeDate[1] = this.selcetTime(new Date(val[1]))
        this.getcriTypeData()
      } else {
        this.criTypeDate = []
      }
    },
    getcriTypeData() {
      this.criTypeList = []
      this.criTypeLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/statistics/' +
            this.prisonId +
            '/' +
            this.criTypeDate[0] +
            '/' +
            this.criTypeDate[1] +
            '/' +
            this.year
        )
        .then(response => {
          if (response.criminalTypes.length > 0) {
            response.criminalTypes.forEach(item => {
              if (item.result != 0) {
                this.criTypeList.push({ name: item.name, value: item.result })
              }
            })
          }
          this.criTypeLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAgeData() {
      this.ageList = []
      this.ageLoading = true

      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/statistics/' +
            this.prisonId +
            '/' +
            this.ageDate[0] +
            '/' +
            this.ageDate[1] +
            '/' +
            this.year
        )
        .then(response => {
          if (response.ageGroups.length > 0) {
            response.ageGroups.forEach(item => {
              if (item.result != 0) {
                this.ageList.push({ name: item.name, value: item.result })
              }
            })
          }
          this.ageLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getNumData() {
      this.numLoading = true
      this.numPieList = []
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/statistics/' +
            this.prisonId +
            '/' +
            this.numdate[0] +
            '/' +
            this.numdate[1] +
            '/' +
            this.year
        )
        .then(response => {
          if (this.prisonId == 1) {
            response.eachPrisonCounts.forEach(item => {
              if (item.result != 0) {
                this.numPieList.push({
                  name: item.deptName,
                  value: item.result
                })
              }
            })
          } else {
            response.eachAreaCounts.forEach(item => {
              if (item.result != 0) {
                this.numPieList.push({
                  name: item.deptName,
                  value: item.result
                })
              }
            })
          }

          this.numLoading = false
        })
    },
    getAllData() {
      this.prisonList = []
      this.numlist = []
      this.barLoading = true

      this.criTypeList = []
      this.criTypeLoading = true

      this.ageList = []
      this.ageLoading = true

      this.numLoading = true
      this.numPieList = []

      this.reasonList = []
      this.reasonLoading = true

      this.typesList = []
      this.typeLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/statistics/' +
            this.prisonId +
            '/' +
            this.date[0] +
            '/' +
            this.date[1] +
            '/' +
            this.year
        )
        .then(response => {
          this.$set(this.headIconList[0], 'text', response.total)
          let prisonList = []
          let numlist = []
          if (this.prisonId == 1) {
            response.eachPrisonCounts.forEach(item => {
              prisonList.push(item.deptName)
              numlist.push(item.result)
            })
          } else {
            response.eachAreaCounts.forEach(item => {
              prisonList.push(item.deptName)
              numlist.push(item.result)
            })
          }
          this.prisonList = prisonList
          this.numlist = numlist
          this.drawLine()
          this.barLoading = false

          // getAgeData

          if (response.ageGroups.length > 0) {
            response.ageGroups.forEach(item => {
              if (item.result != 0) {
                this.ageList.push({ name: item.name, value: item.result })
              }
            })
          }
          this.ageLoading = false
          // getcriTypeData
          if (response.criminalTypes.length > 0) {
            response.criminalTypes.forEach(item => {
              if (item.result != 0) {
                this.criTypeList.push({ name: item.name, value: item.result })
              }
            })
          }
          this.criTypeLoading = false
          // getReasonData
          response.reasons.forEach(item => {
            this.reasonList.push({ name: item.name, value: item.result })
          })
          this.reasonLoading = false
          // getTypeData
          response.types.forEach(item => {
            this.typesList.push({ name: item.name, value: item.result })
          })
          this.typeLoading = false
          // getNumData
          if (this.prisonId == 1) {
            response.eachPrisonCounts.forEach(item => {
              if (item.result != 0) {
                this.numPieList.push({
                  name: item.deptName,
                  value: item.result
                })
              }
            })
          } else {
            response.eachAreaCounts.forEach(item => {
              if (item.result != 0) {
                this.numPieList.push({
                  name: item.deptName,
                  value: item.result
                })
              }
            })
          }

          this.numLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getReasonData() {
      this.reasonList = []
      this.reasonLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/statistics/' +
            this.prisonId +
            '/' +
            this.reasonDate[0] +
            '/' +
            this.reasonDate[1] +
            '/' +
            this.year
        )
        .then(response => {
          response.reasons.forEach(item => {
            this.reasonList.push({ name: item.name, value: item.result })
          })
          this.reasonLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTypeData() {
      this.typesList = []
      this.typeLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/statistics/' +
            this.prisonId +
            '/' +
            this.typeDate[0] +
            '/' +
            this.typeDate[1] +
            '/' +
            this.year
        )
        .then(response => {
          response.types.forEach(item => {
            this.typesList.push({ name: item.name, value: item.result })
          })
          this.typeLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getYearData() {
      this.mounthList = []
      this.yearLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/statistics/' +
            this.prisonId +
            '/' +
            this.date[0] +
            '/' +
            this.date[1] +
            '/' +
            this.year
        )
        .then(response => {
          this.mounthList = response.eachMonthCounts

          this.yearLine()
          this.yearLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 柱状图
    drawLine() {
      let myChart = echarts.init(document.getElementById('bar_main'))
      myChart.setOption({
        tooltip: {},
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        color: ['#036DCF'],
        toolbox: {
          feature: {
            saveAsImage: {
              name: '住院情况统计图',
              iconStyle: { borderColor: '#43D3FF' }
            }
          }
        },
        xAxis: {
          data: this.prisonList,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0, // 强制文字产生间隔
            rotate: 60, // 文字逆时针旋转45°
            textStyle: {
              fontSize: 14,
              color: color()
            },
            color: color()
            // formatter: function(value) {
            //   return value.split("").join("\n");
            // }
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },

        yAxis: {
          minInterval: 1,
          axisLabel: {
            color: color()
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        series: [
          {
            name: '罪犯数量',
            type: 'bar',
            data: this.numlist,
            barMaxWidth: '20px'
          }
        ]
      })
    },

    // 折线图
    yearLine() {
      let yearChart = echarts.init(document.getElementById('year_main'))
      this.mounths = [
        { name: '1月', value: 0 },
        { name: '2月', value: 0 },
        { name: '3月', value: 0 },
        { name: '4月', value: 0 },
        { name: '5月', value: 0 },
        { name: '6月', value: 0 },
        { name: '7月', value: 0 },
        { name: '8月', value: 0 },
        { name: '9月', value: 0 },
        { name: '10月', value: 0 },
        { name: '11月', value: 0 },
        { name: '12月', value: 0 }
      ]

      if (this.mounthList.length > 0) {
        this.mounthList.forEach(item => {
          this.mounths.forEach(num => {
            item.month == num.name ? (num.value = item.result) : ''
          })
        })
      }

      yearChart.setOption({
        tooltip: { trigger: 'axis' },
        color: ['#86D7FF'],
        toolbox: {
          feature: {
            saveAsImage: {
              name: '年度住院情况分析图',
              iconStyle: { borderColor: '#43D3FF' }
            }
          }
        },
        xAxis: {
          type: 'category',
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
          ],
          axisLine: {
            lineStyle: {
              color: color()
            }
          },
          axisLabel: {
            color: color()
          }
        },
        yAxis: {
          axisLabel: {
            color: color(),
            margin: '12'
          },
          axisLine: {
            lineStyle: {
              color: color()
            }
          }
        },
        series: [
          {
            name: '罪犯数量',
            type: 'line',
            data: this.mounths,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#86D7FF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        ]
      })
    },

    searchyear() {
      if (typeof this.year === 'object') {
        let year = new Date(this.year).getFullYear()
        this.year = year + '-01-01'
      }
      this.getYearData()
    },

    nodeClick(val) {
      console.log(val)
      this.prisonId = val.id
      this.prisonName = val.departName
      sessionStorage.setItem('prisonID', this.prisonId)
    }
  },

  watch: {
    prisonId: function() {
      if (this.prisonId == 1) {
        this.prisonName = '全省各监狱'
      }
      this.getAllData()
      //   this.timeSet(this.date)

      //   this.getReasonData()
      //   this.getTypeData()
      //   this.getYearData()
      //   this.getAgeData()
      //   this.getNumData()
    }
  }
}
</script>
<style lang="less" scoped>
.time_box {
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem;
  .title {
    text-align: right;
    font-size: 1.4rem;
  }
}

.yn_date_picker {
  font-size: 1.2rem !important;
  border: 1px solid rgb(153, 151, 151);
}
.el-date-editor .el-range-separator {
  width: 10% !important;
  font-size: 1.2rem;
}
.charts_title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0.5rem 0;
}
.moudel_box {
  background: #fbfcff;
  width: 100%;
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  box-sizing: border-box;
  padding: 1rem;
  margin: 0.5rem 0;
}
#bar_main {
  width: 100%;
  height: 300px;
}
#year_main {
  width: 100%;
  height: 300px;
}
.pie_card {
  background: #fbfcff;
  width: 99%;
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  box-sizing: border-box;
  padding: 1rem;
  margin: 0.5rem 0;
}
.card_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0.5rem 0;
}
</style>
