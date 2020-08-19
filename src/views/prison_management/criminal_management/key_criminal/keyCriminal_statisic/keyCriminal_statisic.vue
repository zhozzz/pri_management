<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:46:32
 -->

<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','重点罪犯管理']">
      <tab slot="heade_btn" name="重点罪犯管理" :left="true" pathName="key_criminal" />
      <headIcon :list="headIconList"></headIcon>
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
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}}重点罪犯情况</h3>
            <!-- <timeSelect @setTime="timeSet" :noSelect="false" /> -->
            <div id="bar_main" v-loading="barLoading" style="height:300px"></div>
          </div>
        </el-col>
        <el-col :span="12" v-if="prisonId==1">
          <div class="yn_charts">
            <h3>重点罪犯数量—监狱 分布</h3>
            <!-- <timeSelect @setTime="pieTimeSet" /> -->
            <!-- <PieChart
              :chartData="pieList"
              v-loading="pieLoading"
              :radius="['40%','60%']"
              class="pie_one"
              :dataList="pieList"
            />-->
            <table-view height="21.6rem" :tableData="tableData" noBottom noSearch noPage>
              <template slot="table-column">
                <el-table-column align="center" show-overflow-tooltip prop="name" label="监狱" />
                <el-table-column align="center" show-overflow-tooltip prop="value" label="数量" />
              </template>
            </table-view>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>重点罪犯性别</h3>
            <!-- <timeSelect @setTime="sexTimeSet" /> -->
            <PieChart
              :chartData="pieList"
              v-loading="pieLoading"
              :radius="['40%','60%']"
              class="pie_one"
              height="26rem"
              :dataList="pieList"
            />
          </div>
        </el-col>

        <el-col :span="12" v-if="prisonId!=1">
          <div class="yn_charts">
            <h3>罪犯类型分布</h3>
            <!-- <timeSelect @setTime="typeTimeSet" /> -->
            <PieChart
              :chartData="typesList"
              v-loading="pieLoading"
              :radius="['40%','60%']"
              class="pie_one"
              height="26rem"
              :dataList="typesList"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>重点罪犯年龄分布</h3>
            <!-- <timeSelect @setTime="ageTimeSet" /> -->
            <PieChart
              :chartData="ageList"
              v-loading="ageLoading"
              :radius="['40%','60%']"
              class="pie_one"
              height="26rem"
              :dataList="ageList"
            />
          </div>
        </el-col>
        <el-col :span="24">
          <div class="yn_charts">
            <h3>{{prisonName}}年度重点罪犯变化曲线</h3>
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
            <div id="year_main" v-loading="lineLoading" style="height:300px"></div>
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
import menuTree from '@/components/menu_tree/'
import { getPrisonId } from '@/utils'
import tableView from '@/components/table_view/'
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
      pieDate: [yestarday, today],
      typeDate: [yestarday, today],
      ageDate: [yestarday, today],
      sexDate: [yestarday, today],

      year: today,
      prisonName: '全省各监狱',
      qeuryParams: {},
      prisonId: getPrisonId(),
      prisonList: [],
      numlist: [],
      typesList: [],
      mounthList: [],
      pieList: [],
      ageList: [],
      chart: null,
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
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      headIconList: [
        {
          url: require('@/assets/index/crimal_sucess.png'),
          info: '重点罪犯关押数',
          text: null,
          isRouter: true,
          routerString: 'key_criminal',
          params: {}
        }
        // {
        //   url: require('@/assets/index/crimal_err.png'),
        //   info: '异常罪犯数',
        //   text: 0,
        //   isRouter: true,
        //   routerString: 'key_criminal',
        //   params: {}
        // }
      ],
      barLoading: true,
      lineLoading: true,
      pieLoading: true,
      ageLoading: true
    }
  },
  components: {
    PieChart,
    deptLayout,
    timeSelect,
    tab,
    headIcon,
    menuTree,
    tableView
  },
  created() {
    this.getAllData()
    this.getYaerData()
    // this.getAreaData();
    // this.getTypeData();

    console.log(JSON.parse(localStorage.getItem('user')))
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
    pieTimeSet(val) {
      if (val) {
        this.pieDate[0] = this.selcetTime(new Date(val[0]))
        this.pieDate[1] = this.selcetTime(new Date(val[1]))

        this.getAreaData()
      } else {
        this.pieDate = []
      }
    },
    sexTimeSet(val) {
      if (val) {
        this.sexDate[0] = this.selcetTime(new Date(val[0]))
        this.sexDate[1] = this.selcetTime(new Date(val[1]))

        this.getSexData()
      } else {
        this.sexDate = []
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
    ageTimeSet(val) {
      if (val) {
        this.ageDate[0] = this.selcetTime(new Date(val[0]))
        this.ageDate[1] = this.selcetTime(new Date(val[1]))

        this.getAgeData()
      } else {
        this.ageDate = []
      }
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
    getYaerData() {
      this.mounthList = []
      this.lineLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/keyCriminal/statistics/' +
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
    getTypeData() {
      this.typesList = []
      this.pieLoading = true

      this.axios
        .get(
          this._global.businessUrl +
            '/keyCriminal/statistics/' +
            this.prisonId +
            '/' +
            this.date[0] +
            '/' +
            this.date[1] +
            '/' +
            this.year
        )
        .then(response => {
          response.types.forEach(item => {
            this.typesList.push({ name: item.name, value: item.result })
          })
          this.pieLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAllData() {
      this.prisonList = []
      this.barLoading = true
      this.numlist = []

      this.typesList = []
      this.pieLoading = true

      this.pieList = []
      this.pieLoading = true

      this.tableData.list = []

      this.ageList = []
      this.ageLoading = true

      this.axios
        .get(
          this._global.businessUrl +
            '/keyCriminal/statistics/' +
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
          if (this.prisonId == 1) {
            response.eachPrisonCounts.forEach(item => {
              this.prisonList.push(item.deptName)
              this.numlist.push(item.result)
            })
          } else {
            response.eachWardCounts.forEach(item => {
              this.prisonList.push(item.deptName)
              this.numlist.push(item.result)
            })
          }
          this.mounthList = response.eachMonthCounts
          this.drawLine()

          //  getTypeData
          response.types.forEach(item => {
            this.typesList.push({ name: item.name, value: item.result })
          })
          this.pieLoading = false

          //   getSexData

          this.pieLoading = false
          response.genderGroups.forEach(item => {
            if (item.result !== 0) {
              this.pieList.push({ name: item.name, value: item.result })
            }
          })

          // getAreaData
          if (response.eachPrisonCounts) {
            response.eachPrisonCounts.forEach(item => {
              this.tableData.list.push({
                name: item.deptName,
                value: item.result
              })
              this.tableData.total = response.eachPrisonCounts.length
            })
          }

          // getAgeData
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
    getSexData() {
      this.pieList = []
      this.pieLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/keyCriminal/statistics/' +
            this.prisonId +
            '/' +
            this.sexDate[0] +
            '/' +
            this.sexDate[1] +
            '/' +
            this.year
        )
        .then(response => {
          this.pieLoading = false
          response.genderGroups.forEach(item => {
            if (item.result !== 0) {
              this.pieList.push({ name: item.name, value: item.result })
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAreaData() {
      this.axios
        .get(
          this._global.businessUrl +
            '/keyCriminal/statistics/' +
            this.prisonId +
            '/' +
            this.pieDate[0] +
            '/' +
            this.pieDate[1] +
            '/' +
            this.year
        )
        .then(response => {
          if (response.eachPrisonCounts) {
            response.eachPrisonCounts.forEach(item => {
              this.tableData.list.push({
                name: item.deptName,
                value: item.result
              })
              this.tableData.total = response.eachPrisonCounts.length
            })
          }
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
            '/keyCriminal/statistics/' +
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
    // 柱状图
    drawLine() {
      this.chart = echarts.init(document.getElementById('bar_main'))
      if (this.prisonList.length == 0) {
        this.chart.showLoading({
          text: '暂无数据',
          color: 'tranparent',
          textColor: color(),
          maskColor: 'tranparent'
        })
      } else {
        this.chart.hideLoading()

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {
                name: this.prisonName + '重点罪犯情况',
                iconStyle: { borderColor: '#43D3FF' }
              }
            }
          },
          color: ['#F3763E'],
          grid: {
            top: 50,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            data: this.prisonList,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0, // 强制文字产生间隔
              rotate: 60, // 文字逆时针旋转45°
              color: color(),

              textStyle: {
                fontSize: 12
              }
              // formatter: function(value) {
              //   return value.split("").join("\n");
              // }
            },
            axisLine: {
              lineStyle: {
                color: color()
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
                color: color()
              }
            }
          },
          series: [
            {
              name: '罪犯数量',
              type: 'bar',
              data: this.numlist,
              barMaxWidth: '30%'
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
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            color: color(),
            margin: '12'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {
              name: this.prisonName + '年度重点罪犯变化曲线',
              iconStyle: { borderColor: '#43D3FF' }
            }
          }
        },
        yAxis: {
          axisLabel: {
            color: color()
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        color: ['#F3763E'],
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
                    color: '#F3763E' // 0% 处的颜色
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
      this.lineLoading = false
    },

    searchyear() {
      if (typeof this.year === 'object') {
        let year = new Date(this.year).getFullYear()
        this.year = year + '-01-01'
      }
      this.getYaerData()
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
      this.getYaerData()
      //   this.getAreaData()
      //   this.getTypeData()
      //   this.getAgeData()
      //   this.getSexData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
