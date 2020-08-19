<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:28:39
 -->

<template>
  <dept-layout @input="nodeClick" v-model="deptGuid" :backData="true">
    <menuTree :menuList="['监狱管理','指挥中心','受理来电来文管理']">
      <tab slot="heade_btn" name="来电来文管理" :left="true" pathName="accept_communications" />
      <head-icon :list="headList"></head-icon>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>受理来文/来电数量</h3>
            <el-form ref="form" class="yn_form" inline>
              <el-form-item label="选择年份:">
                <el-date-picker
                  class="yn_ipt"
                  v-model="selectYear"
                  :clearable="false"
                  type="year"
                  placeholder="选择年"
                  @change="getYearData"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <div id="bar_main" v-loading="barLoading"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>来文/来电占比</h3>
            <timeSelect @setTime="timeSet" />
            <PieChart
              :chartData="numdatas"
              :dataList="numdatas"
              v-loading="numLoading"
              class="pie_one"
            />
          </div>
        </el-col>
        <el-col :span="12" v-if="prisonId==1">
          <div class="yn_charts">
            <h3>来文/来电-来源占比</h3>
            <timeSelect @setTime="timeSetFrom" />

            <el-button v-if="backAll" class="yn_btn" type="primary" @click="getAllData">返回全部</el-button>

            <PieChart
              :chartData="fromList"
              class="pie_two"
              @selLeader="selLeader"
              tipName="来源"
              :dataList="fromList"
            />
          </div>
        </el-col>
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import menuTree from '@/components/menu_tree/'
import headIcon from '@/components/head_icon'
import { pickerOptions } from '@/utils/picker_option_config.js'
import PieChart from './pie_charts'
import deptLayout from '@/components/deptLayout/index.vue'
import tab from '@/components/tab/index.vue'
import { getPrisonId } from '@/utils'
import timeSelect from '@/components/time_select/index.vue'
import resize from '@/utils/mixins/resize.js'
import color from '@/utils/echarts_color'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

let today = new Date(new Date()).getTime()
let yesterday = new Date(new Date().getTime()).getTime() - 24 * 60 * 60 * 1000
export default {
  mixins: [resize],
  data() {
    return {
      chart: null,
      selectTime: 0,
      selectYear: today,
      date: [yesterday, today], // 时间
      dateFrom: [yesterday, today],
      dealed: 0,
      undeal: 0,
      deptGuid: '', // 用户所属
      prisonId: getPrisonId(),
      qeuryParams: {},
      numdata: [], // 来电来文数量
      // 来文来电来源
      fromList: [],
      mounthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 月份
      phonelist: [], // 来电
      noticlist: [], // 来文
      barLoading: true,
      numLoading: true,
      formLoading: true,
      backAll: false,
      leaderCode: '',
      headList: [
        {
          url: require('@/assets/index/info.png'),
          info: '当月已处理来电来文数',
          text: 0,
          isRouter: true,
          routerString: 'accept_communications',
          params: { handleStatus: 2 }
        },
        {
          url: require('@/assets/index/question.png'),
          info: '当月未确认数',
          text: 0,
          isRouter: true,
          routerString: 'accept_communications',
          params: { handleStatus: 1 }
        }
      ]
    }
  },
  components: {
    PieChart,
    deptLayout,
    tab,
    timeSelect,
    headIcon,
    menuTree
  },
  created() {
    this.deptGuid = JSON.parse(localStorage.getItem('user')).deptGuid

    this.getYearData()
    this.getnumData()
    this.getClassList()
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    getClassList() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/sourceType')
        .then(data => {
          data.map(item => {
            if (item.label == '上级领导') {
              this.leaderCode = item.value
            }
          })
        })
    },
    timeSet(val) {
      if (val) {
        this.date[0] = new Date(val[0]).getTime()
        this.date[1] = new Date(val[1]).getTime()
        // this.getAllData();
        this.getMonthData()
      } else {
        this.date = []
      }
    },
    timeSetFrom(val) {
      if (val) {
        this.dateFrom[0] = new Date(val[0]).getTime()
        this.dateFrom[1] = new Date(val[1]).getTime()
        this.getAllData()
      } else {
        this.date = []
      }
    },
    topage() {
      this.$router.push({ name: 'message_statisic' })
    },
    getnumData() {
      let qeuryParams = {}
      qeuryParams.deptId = this.deptGuid

      this.axios
        .post(this._global.businessUrl + '/notice/CountAll', qeuryParams)
        .then(response => {
          this.$set(this.headList[0], 'text', response.dealed)
          this.$set(this.headList[1], 'text', response.undeal)
        })
    },
    getAllData() {
      this.fromList = []
      this.formLoading = true
      this.backAll = false
      this.qeuryParams.deptId = this.deptGuid
      this.qeuryParams.startTime = this.dateFrom[0]
      this.qeuryParams.endTime = this.dateFrom[1] + 24 * 60 * 60 * 1000
      this.axios
        .post(this._global.businessUrl + '/notice/CountAll', this.qeuryParams)
        .then(response => {
          if (response.AllPrisonNoticeCountBySourceTypeValue) {
            response.AllPrisonNoticeCountBySourceTypeValue.forEach(item => {
              this.fromList.push({
                name: item.sourceTypeValue,
                value: item.countNum
              })
            })
          }
          this.formLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    selLeader() {
      this.fromList = []
      this.formLoading = true
      this.backAll = true
      this.qeuryParams.deptId = this.deptGuid
      this.qeuryParams.sourceType = this.leaderCode
      this.qeuryParams.startTime = this.dateFrom[0]
      this.qeuryParams.endTime = this.dateFrom[1] + 24 * 60 * 60 * 1000
      this.axios
        .post(
          this._global.businessUrl + '/notice/CountUnderSourceType',
          this.qeuryParams
        )
        .then(response => {
          if (response.UnderSourceTypeCount) {
            response.UnderSourceTypeCount.forEach(item => {
              this.fromList.push({
                name: item.deptName,
                value: item.countNum
              })
            })
          }
          this.formLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    getYearData() {
      let qeuryParams = {}
      qeuryParams.deptId = this.deptGuid

      let year = new Date(this.selectYear).getFullYear()
      let startday = new Date(year + '-01-01 23:59:59').getTime()
      let lastday = new Date(year + '-12-31 23:59:59').getTime()
      qeuryParams.startTime = startday
      qeuryParams.endTime = lastday
      this.barLoading = true
      this.noticlist = []
      this.phonelist = []
      this.axios
        .post(this._global.businessUrl + '/notice/CountMouth', qeuryParams)
        .then(response => {
          this.mounthList.forEach(item => {
            let flag = false
            response.MonthCount02.forEach(obj => {
              obj.creatMouth == item
                ? (this.phonelist.push(obj.countNum), (flag = true))
                : ''
            })
            flag ? '' : this.phonelist.push(0)

            let flag2 = false
            response.MonthCount01.forEach(obj => {
              obj.creatMouth == item
                ? (this.noticlist.push(obj.countNum), (flag2 = true))
                : ''
            })
            flag2 ? '' : this.noticlist.push(0)
          })

          this.drawLine()
        })
        .catch(error => {
          console.log(error)
        })
    },
    getMonthData() {
      this.qeuryParams.deptId = this.deptGuid
      this.qeuryParams.startTime = this.date[0]
      this.qeuryParams.endTime = this.date[1] + 24 * 60 * 60 * 1000

      this.numLoading = true

      this.axios
        .post(this._global.businessUrl + '/notice/CountMouth', this.qeuryParams)
        .then(response => {
          // 01 来文 02 来电
          this.numdata = [
            { value: 0, name: '来文' },
            { value: 0, name: '来电' }
          ]
          response.MonthCount01.forEach(item => {
            this.numdata[0].value += item.countNum
          })
          response.MonthCount02.forEach(item => {
            this.numdata[1].value += item.countNum
          })
          this.numLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 柱状图
    drawLine() {
      this.chart = echarts.init(document.getElementById('bar_main'))
      let subtext = ''
      if (this.noticlist.length == 0 && this.phonelist.length == 0) {
        subtext = '此时段暂无数据'
      }
      this.chart.setOption({
        title: { subtext: subtext },
        tooltip: { formatter: '{a}<br />{b}月:{c}条' },
        xAxis: {
          name: '月份',
          data: this.mounthList,
          axisLine: {
            lineStyle: {
              color: color()
            }
          },
          axisLabel: {
            color: color(),
            margin: '12',
            formatter: '{value}月'
          }
        },
        color: ['#036DCF', '#86D7FF'],
        legend: {
          left: 'center',
          bottom: '0',
          data: ['来文', '来电'],
          textStyle: {
            color: color()
          }
        },
        yAxis: {
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: color()
            }
          },
          axisLabel: {
            color: color(),
            margin: '12'
          }
        },
        series: [
          {
            name: '来文',
            type: 'bar',
            data: this.noticlist,
            label: {
              show: true,
              position: 'insideTop'
            }
          },
          {
            name: '来电',
            type: 'bar',
            data: this.phonelist,
            label: {
              show: true,
              position: 'insideTop'
            }
          }
        ]
      })
      this.barLoading = false
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.deptGuid = this.prisonId
      this.date = [yesterday, today] // 时间
      this.dateFrom = [yesterday, today]
      // this.getAllData();
      this.getMonthData()
      this.getYearData()
      this.getnumData()
    }
    // 饼图
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    },
    numdatas() {
      let arr = []
      this.numdata.forEach((item, i) => {
        item.value !== 0 ? arr.push(item) : ''
      })

      return arr
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
    font-size: 1.2rem;
  }
  .time_set {
    padding: 0.5rem;
    border-bottom: 2px solid #fff;
    font-size: 1.2rem;
    color: #666;
    margin: 0 0.5rem;
  }
  .select_set {
    border-bottom: 2px solid #2b8bef;
    color: #2b8bef;
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
/deep/.el-input__prefix {
  left: 85%;
}
.bg_gre {
  background: rgba(251, 252, 255, 1);
}
.bor_gre {
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  margin-bottom: 10px;
  .year_box {
    margin: 0.5rem 0;
  }
  .bar_title {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }
}
#bar_main {
  width: 100%;
  height: 300px;
}
.pie_card {
  width: 100%;
  background: rgba(251, 252, 255, 1);
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  padding: 0.5rem;
  box-sizing: border-box;
  .card_titile {
    font-weight: 600;
    font-size: 1.4rem;
    margin: 0.5rem 0;
  }
}
</style>
