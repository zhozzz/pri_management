<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-09-07 11:39:21
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:44:40
 -->

<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯死亡']">
      <tab slot="heade_btn" name="罪犯死亡管理" :left="true" pathName="criminal_dead" />
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
      <!-- <timeSelect @setTime="timeSet" style="width:400px" v-if="prisonId!=1" /> -->
      <headIcon v-if="prisonId!=1" :list="headIconList"></headIcon>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}}死亡罪犯情况</h3>
            <!-- <timeSelect @setTime="timeSet" v-if="prisonId==1" :noDefault="false" /> -->
            <div id="bar_main" style="height:300px" v-loading="barLoading"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>死亡罪犯数量—{{prisonId==1?'监狱':'监区'}} 分布</h3>
            <!-- <timeSelect @setTime="pieTimeSet" :defaultTime="2" /> -->
            <PieChart
              :chartData="pieList"
              v-loading="pieLoading"
              :radius="['40%','60%']"
              class="pie_one"
              :dataList="pieList"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>死亡罪犯年龄分布</h3>
            <!-- <timeSelect @setTime="ageTimeSet" /> -->
            <PieChart
              :chartData="ageList"
              v-loading="ageLoading"
              :radius="['40%','60%']"
              class="pie_one"
              :dataList="ageList"
            />
          </div>
        </el-col>
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}} 年度罪犯死亡变化曲线</h3>
            <el-form ref="form" class="yn_form" inline label-width="7rem">
              <el-form-item label="选择年份:">
                <el-date-picker
                  class="yn_ipt"
                  :clearable="false"
                  v-model="year"
                  type="year"
                  placeholder="选择年"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn btn_pad" type="primary" @click="searchyear">查询</el-button>
              </el-form-item>
            </el-form>
            <div id="year_main" style="height:300px" v-loading="lineLoading"></div>
          </div>
        </el-col>
      </el-row>
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
import resize from '@/utils/mixins/resize.js'
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
  mixins: [resize],
  data() {
    return {
      date: [yestarday, today], // 时间
      pieDate: [yestarday, today], // 时间
      year: today,
      prisonName: '全省各监狱',
      qeuryParams: {},
      prisonId: getPrisonId(),
      prisonList: [],
      numlist: [],
      typesList: [],
      mounthList: [],
      pieList: [],
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
      chart: null,
      barLoading: true,
      pieLoading: true,
      lineLoading: true,
      ageDate: [yestarday, today],
      ageList: [],
      ageLoading: true,
      headIconList: [
        {
          url: require('@/assets/index/crimal_primary.png'),
          info: '死亡罪犯总数',
          text: null,
          isRouter: true,
          routerString: 'criminal_dead',
          params: {}
        }
        // {
        //   url: require('@/assets/index/crimal_err.png'),
        //   info: '狱外死亡罪犯数',
        //   text: null,
        //   isRouter: true,
        //   routerString: 'criminal_dead',
        //   params: { ifInPrison: false }
        // }
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
    pieTimeSet(val) {
      if (val) {
        this.pieDate[0] = this.selcetTime(new Date(val[0]))
        this.pieDate[1] = this.selcetTime(new Date(val[1]))
        this.getPieData()
      } else {
        this.date = []
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
    getAgeData() {
      this.ageList = []
      this.ageLoading = true

      this.axios
        .get(
          this._global.businessUrl +
            '/criminalDeath/statistics/' +
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
    getYearData() {
      this.mounthList = []
      this.lineLoading = true

      this.axios
        .get(
          this._global.businessUrl +
            '/criminalDeath/statistics/' +
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
        })
        .catch(error => {
          console.log(error)
        })
    },
    getPieData() {
      this.pieList = []
      this.pieLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalDeath/statistics/' +
            this.prisonId +
            '/' +
            this.pieDate[0] +
            '/' +
            this.pieDate[1] +
            '/' +
            this.year
        )
        .then(response => {
          console.log(response)

          if (this.prisonId == 1) {
            response.eachPrisonCounts.forEach(item => {
              if (item.result != 0) {
                this.pieList.push({ name: item.deptName, value: item.result })
              }
            })
          } else {
            response.eachWardCounts.forEach(item => {
              if (item.result != 0) {
                this.pieList.push({ name: item.deptName, value: item.result })
              }
            })
          }
          this.pieLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAllData() {
      this.typesList = []
      this.prisonList = []
      this.numlist = []
      this.barLoading = true

      this.ageList = []
      this.ageLoading = true

      this.pieList = []
      this.pieLoading = true

      this.axios
        .get(
          this._global.businessUrl +
            '/criminalDeath/statistics/' +
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
          //   this.$set(this.headIconList[1], 'text', response.deathOutPrison)
          let prisonList = []
          let numlist = []
          if (this.prisonId == 1) {
            response.eachPrisonCounts.forEach(item => {
              prisonList.push(item.deptName)
              numlist.push(item.result)
            })
          } else {
            response.eachWardCounts.forEach(item => {
              prisonList.push(item.deptName)
              numlist.push(item.result)
            })
          }
          this.prisonList = prisonList
          this.numlist = numlist
          this.drawLine()

          // getAgeData
          if (response.ageGroups.length > 0) {
            response.ageGroups.forEach(item => {
              if (item.result != 0) {
                this.ageList.push({ name: item.name, value: item.result })
              }
            })
          }
          this.ageLoading = false

          // getPieData
          if (this.prisonId == 1) {
            response.eachPrisonCounts.forEach(item => {
              if (item.result != 0) {
                this.pieList.push({ name: item.deptName, value: item.result })
              }
            })
          } else {
            response.eachWardCounts.forEach(item => {
              if (item.result != 0) {
                this.pieList.push({ name: item.deptName, value: item.result })
              }
            })
          }
          this.pieLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 柱状图
    drawLine() {
      this.chart = echarts.init(document.getElementById('bar_main'))

      if (this.prisonList.length == 0) {
        this.chart.showLoading({
          text: '暂无数据',
          color: 'transparent',
          textColor: color(),
          maskColor: 'transparent'
        })
      } else {
        this.chart.hideLoading()
        this.chart.setOption({
          tooltip: {},
          grid: {
            top: 50,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {
                name: '死亡罪犯情况统计图',
                iconStyle: { borderColor: '#43D3FF' }
              }
            }
          },
          color: ['#5A70F1'],
          xAxis: {
            data: this.prisonList,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            },
            axisLabel: {
              interval: 0, // 强制文字产生间隔
              rotate: 60, // 文字逆时针旋转45°
              textStyle: {
                fontSize: 14
              },
              color: color()
              // formatter: function(value) {
              //   return value.split("").join("\n");
              // }
            }
          },
          yAxis: {
            minInterval: 1,
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
      }
      this.barLoading = false
    },

    // 折线图
    yearLine() {
      this.chart = echarts.init(document.getElementById('year_main'))
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
      if (this.mounths.length == 0) {
        this.chart.showLoading({
          text: '暂无数据',
          color: 'transparent',
          textColor: color(),
          maskColor: 'transparent'
        })
      } else {
        this.chart.hideLoading()
        this.chart.setOption({
          tooltip: { trigger: 'axis' },
          xAxis: {
            name: '月',
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
            axisLabel: {
              color: color()
            }
          },
          color: ['#5A70F1'],
          toolbox: {
            feature: {
              saveAsImage: {
                name: '年度罪犯死亡变化曲线',
                iconStyle: { borderColor: '#43D3FF' }
              }
            }
          },
          yAxis: {
            name: '数量',
            axisLabel: {
              color: color()
            },
            nameTextStyle: {
              color: color()
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
              label: {
                textStyle: {
                  color: color()
                }
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
                      color: '#5A70F1' // 0% 处的颜色
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
      }
      this.lineLoading = false
    },

    searchyear() {
      if (typeof this.year === 'object') {
        let year = new Date(this.year).getFullYear()
        this.year = year + '-01-01'
      }
      this.getYearData()
    },

    nodeClick(val) {
      this.prisonId = val.id
      this.prisonName = val.departName

      sessionStorage.setItem('prisonID', this.prisonId)
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  watch: {
    prisonId: function() {
      if (this.prisonId == 1) {
        this.prisonName = '全省各监狱'
      }
      this.getAllData()

      this.getYearData()
      //   this.getPieData()
      //   this.getAgeData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
