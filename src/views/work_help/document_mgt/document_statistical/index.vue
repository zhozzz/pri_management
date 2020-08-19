<!--
 * @Description:''
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:08:13
 -->

<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['工作辅助','文件下发与报送']">
      <sendfile :sendVisible="sendFlag" :closeSend="closeSend"></sendfile>
      <div slot="heade_btn" class="yn_page_btn">
        <!-- <el-button class="yn_btn btn_pad" type="primary">文件统计</el-button>
        <el-button class="yn_btn btn_pad" @click="tosend">收文记录</el-button>
        <el-button class="yn_btn btn_pad" @click="torecord">发文记录</el-button>
        <el-button class="yn_btn btn_pad" v-if="userPrisonId==1" @click="topage">文件管理</el-button>
        <el-button class="yn_btn time_btn" @click="openSend" type="primary">文件发送</el-button>-->

        <div class="link_btn">文件统计</div>
        <div class="dis_btn" @click="tosend">收文记录</div>
        <div class="dis_btn" @click="torecord">发文记录</div>
        <div class="dis_btn" @click="topage" v-if="userPrisonId==1">文件管理</div>
        <!-- <div class="dis_btn" @click="openSend">文件发送</div> -->
        <el-button class="yn_btn time_btn" @click="openSend" type="primary">文件发送</el-button>
      </div>
      <el-row>
        <el-col :span="16">
          <timeSelect @setTime="timeSet" />
        </el-col>
      </el-row>

      <headIcon v-if="prisonId==1" :list="headIconList"></headIcon>
      <headIcon v-if="prisonId!=1" :list="headIconList2"></headIcon>
      <!-- 省局 -->
      <!-- <el-row class="head_item"
              :gutter="10"
              v-if="prisonId==1">

        <el-col :span="7">
          <div class="cards">
            <div class="icon_box">
              <img src="@/assets/index/receive.png"
                   alt />
            </div>
            <div class="info_box">
              <div class="info_num">{{send}}</div>下发文件总次数
            </div>
          </div>
        </el-col>
        <el-col :span="7"
                :offset="1">
          <div class="cards">
            <div class="icon_box">
              <img src="@/assets/index/send_file.png"
                   alt />
            </div>
            <div class="info_box">
              <div class="info_num">{{receive}}</div>接收文件总次数
            </div>
          </div>
        </el-col>
        <el-col :span="7"
                :offset="1">
          <el-popover placement="bottom"
                      width="400"
                      trigger="hover">
            <table-view :tableData="tableData"
                        noBottom
                        noSearch
                        @sizeChange="getUnBack">
              <template slot="table-column">
                <el-table-column align="center"
                                 prop="sendTime"
                                 show-overflow-tooltip
                                 :formatter="formtime"
                                 label="发送时间" />
                <el-table-column align="center"
                                 prop="fbDeptName"
                                 :label="'收文单位'" />
                <el-table-column align="center"
                                 prop="remark"
                                 show-overflow-tooltip
                                 :label="'备注信息'" />
                <el-table-column align="center"
                                 prop="fbPeriod"
                                 :label="'反馈周期'" />
                <el-table-column align="center"
                                 prop="fbCtNum"
                                 :label="'当前系第几次反馈'" />
                <el-table-column align="center"
                                 prop="fbDeptTel"
                                 show-overflow-tooltip
                                 :label="'收文单位电话'" />
              </template>
            </table-view>
            <div class="cards"
                 slot="reference">
              <div class="icon_box">
                <img src="@/assets/index/files.png"
                     alt />
              </div>
              <div class="info_box">
                <div class="info_num">{{unFeedback}}</div>未反馈总数
              </div>
            </div>
          </el-popover>
        </el-col>
      </el-row>-->

      <!-- 监狱 -->
      <!-- <el-row class="head_item"
              :gutter="10"
              v-if="prisonId!=1">
        <el-col :span="7">
          <div class="cards">
            <div class="icon_box">
              <img src="@/assets/index/receive.png"
                   alt />
            </div>
            <div class="info_box">
              <div class="info_num">{{send}}</div>发送文件总次数
            </div>
          </div>
        </el-col>
        <el-col :span="7"
                :offset="1">
          <div class="cards">
            <div class="icon_box">
              <img src="@/assets/index/send_file.png"
                   alt />
            </div>
            <div class="info_box">
              <div class="info_num">{{receive}}</div>接收文件总次数
            </div>
          </div>
        </el-col>
        <el-col :span="7"
                :offset="1">
          <div class="cards"
               @click="torecord">
            <div class="icon_box">
              <img src="@/assets/index/files.png"
                   alt />
            </div>
            <div class="info_box">
              <div class="info_num">{{unFeedback}}</div>当前待反馈文件数
            </div>
          </div>
        </el-col>
      </el-row>-->

      <!-- 饼图 -->

      <!-- 类型 -->
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="yn_charts">
            <h3>接收文件数量</h3>
            <el-row>
              <el-form ref="form" class="yn_form" inline label-width="4rem">
                <el-form-item label="月份:">
                  <el-date-picker
                    class="yn_ipt"
                    v-model="month"
                    type="month"
                    @change="monthChange"
                    :clearable="false"
                    placeholder="选择月"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </el-row>
            <LineChart :dateList="dateList" :chartData="ReceiveList" v-loading="receiveLoading" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>{{prisonId==1?'下发文件数量':'发送文件数量'}}</h3>
            <el-row>
              <el-form ref="form" class="yn_form" inline label-width="4rem">
                <el-form-item label="月份:">
                  <el-date-picker
                    class="yn_ipt"
                    v-model="sendMonth"
                    type="month"
                    @change="sendMonthChange"
                    :clearable="false"
                    placeholder="选择月"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </el-row>
            <LineChart :dateList="sendDateList" v-loading="sendLoading" :chartData="SendList" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="prisonId!=1">
        <el-col :span="12">
          <div class="yn_charts">
            <h3>接收文件来源分布</h3>
            <PieChart
              :chartData="typesList"
              v-loading="barLoading"
              tipName="来源"
              class="pie_one"
              height="20rem"
              :dataList="typesList"
              :centerTitle="['接收总数','次']"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>接收文件需要反馈占比</h3>
            <PieChart
              :chartData="needData"
              v-loading="barLoading"
              :centerTitle="['接收总数','次']"
              class="pie_one"
              height="20rem"
              :dataList="needData"
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="prisonId==1">
        <el-col :span="24">
          <div class="yn_charts">
            <h3>各监狱反馈情况</h3>
            <div id="bar_main" style="height:300px" v-loading="barLoading"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="yn_charts">
            <h3>接收文件来源分布</h3>
            <PieChart
              :chartData="typesList"
              v-loading="barLoading"
              tipName="来源"
              class="pie_one"
              height="20rem"
              :centerTitle="['接收总数','次']"
              :dataList="typesList"
            />
          </div>
        </el-col>
      </el-row>
    </menuTree>
  </dept-layout>
</template>

<script>
import PieChart from '@/components/pie_charts/pie_charts.vue'
import LineChart from './line_charts/'
import deptLayout from '@/components/deptLayout/index.vue'
import sendfile from '@/components/send_file/index.vue'
import { getPrisonId, getDeptId } from '@/utils'
import tableView from '@/components/table_view/'
import timeSelect from '@/components/time_select/index.vue'
import headIcon from '@/components/head_icon'
import resize from '@/utils/mixins/resize.js'
import color from '@/utils/echarts_color'
import menuTree from '@/components/menu_tree/'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

let today = new Date().getTime()
let yestarday = new Date().getTime() - 24 * 60 * 60 * 1000
let year = new Date().getFullYear()
let defultMonth = new Date().getMonth() + 1
let defultDay = new Date(year + '/' + defultMonth + '/1 00:00:00')
export default {
  mixins: [resize],
  data() {
    return {
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 5
      },
      date: [yestarday, today], // 时间
      year: today,
      month: defultDay, // 月份
      sendMonth: defultDay, // 月份
      receiveLoading: true,
      sendLoading: true,

      monthList: [],
      sendMonthList: [],
      send: 0,
      receive: 0,
      unFeedback: 0,
      prisonName: '全省各监狱',
      qeuryParams: {},
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      userDeptId: getDeptId(),
      typesList: [],
      prisonList: [],
      backedList: [],
      unBackedList: [],
      sendFlag: false,
      timeoutNum: 0,
      dateList: [],
      sendDateList: [],
      ReceiveList: {},
      SendList: {},
      needData: [],
      barLoading: true,
      headIconList: [
        {
          url: require('@/assets/index/receive.png'),
          info: '当月下发文件总次数',
          text: 0,
          isRouter: true,
          routerString: 'sendreceive_log',
          params: {}
        },
        {
          url: require('@/assets/index/send_file.png'),
          info: '当月接收文件总次数',
          text: 0,
          isRouter: true,
          routerString: 'receive_mgt',
          params: {}
        },
        {
          url: require('@/assets/index/files.png'),
          info: '当月未反馈总数',
          text: 0,
          isRouter: true,
          routerString: 'sendreceive_log',
          params: { isFeedback: 'Y' }
        }
      ],
      headIconList2: [
        {
          url: require('@/assets/index/receive.png'),
          info: '下发文件总次数',
          text: 0,
          isRouter: true,
          routerString: 'sendreceive_log',
          params: {}
        },
        {
          url: require('@/assets/index/send_file.png'),
          info: '接收文件总次数',
          text: 0,
          isRouter: true,
          routerString: 'receive_mgt',
          params: {}
        },
        {
          url: require('@/assets/index/files.png'),
          info: '未反馈总数',
          text: 0,
          isRouter: true,
          routerString: 'receive_mgt',
          params: { isFeedback: 'Y' }
        }
      ],
      chart: null
    }
  },
  components: {
    PieChart,
    deptLayout,
    sendfile,
    LineChart,
    tableView,
    timeSelect,
    headIcon,
    menuTree
  },
  created() {
    this.monthChange(this.month)
    this.sendMonthChange(this.sendMonth)
  },

  methods: {
    timeSet(val) {
      if (val) {
        this.date[0] = new Date(val[0]).getTime()
        this.date[1] = new Date(val[1]).getTime() + 24 * 60 * 59 * 1000
        this.getAllData()
        this.getUnBack()
      } else {
        this.date = []
      }
    },
    monthChange(val) {
      if (val) {
        let latsmonth = val.getMonth() + 2
        let year = val.getFullYear()
        let end = new Date(year + '/' + latsmonth + '/1')
        this.monthList = [val.getTime(), end.getTime()]
        // this.monthList = [
        //   new Date(val[0]).getTime(),
        //   new Date(val[1]).getTime()
        // ];
        this.getLineData()
      }
    },
    sendMonthChange(val) {
      if (val) {
        let latsmonth = val.getMonth() + 2
        let year = val.getFullYear()
        let end = new Date(year + '/' + latsmonth + '/1')
        this.sendMonthList = [val.getTime(), end.getTime()]
        this.getSendLineData()
      }
    },

    // 打开发送
    openSend() {
      this.sendFlag = true
    },
    closeSend() {
      this.sendFlag = false
    },
    // 文件管理
    topage() {
      this.$router.push({ name: 'files_mgt' })
    },
    tosend() {
      this.$router.push({ name: 'receive_mgt' })
    },
    // 收发记录
    torecord() {
      this.$router.push({ name: 'sendreceive_log' })
    },
    // 未反馈数据
    getUnBack() {
      let parmas = {}
      parmas.pageSize = this.tableData.pageSize
      parmas.currentPage = this.tableData.pageNum
      parmas.fbStatus = 1
      parmas.startTime = this.date[0]
      parmas.endTime = this.date[1]
      this.axios
        .post(this._global.businessUrl + '/feedback/list', parmas)
        .then(res => {
          console.log(res)
          this.tableData.list = res.rows
          this.tableData.total = res.total
        })
    },
    // 全部数据
    getAllData() {
      this.typesList = []
      this.prisonList = []
      this.backedList = []
      this.unBackedList = []
      this.barLoading = true

      this.needData = []

      let parmas = {}
      parmas.sePrisonId = this.prisonId
      parmas.rePrisonId = this.prisonId

      parmas.sendId = this.userDeptId
      parmas.receiveId = this.userDeptId

      parmas.startTime = this.date[0]
      parmas.endTime = this.date[1]
      this.axios
        .post(
          this._global.businessUrl + '/dispatchFile/dispatchFileCount',
          parmas
        )
        .then(response => {
          this.$set(this.headIconList[0], 'text', response.send)
          this.$set(this.headIconList2[0], 'text', response.send)
          this.$set(this.headIconList[1], 'text', response.receive)
          this.$set(this.headIconList2[1], 'text', response.receive)

          response.source.forEach(item => {
            this.typesList.push({ name: item.deptName, value: item.countNum })
          })

          if (this.prisonId == 1) {
            this.$set(this.headIconList[2], 'text', response.unFeedback)
            this.unFeedback = response.unFeedback
            this.timeoutNum = response.allPrisonOutTimeFeedbackCount

            response.allPrisonFeedbackedCount.forEach(item => {
              this.prisonList.push(item.deptName)
              this.backedList.push(item.countNum)
            })
            response.allPrisonUnFeedbackCount.forEach(item => {
              this.unBackedList.push(item.countNum)
            })

            this.drawLine()
          } else {
            this.$set(this.headIconList2[2], 'text', response.unFeedback)
            this.unFeedback = response.unFeedback

            if (response.needFeedbackFileCount + response.receive > 0) {
              this.needData.push({
                name: '不需要反馈',
                value: response.needFeedbackFileCount
              })
              this.needData.push({
                name: '需要反馈',
                value: response.receive - response.needFeedbackFileCount
              })
            }
          }
          this.barLoading = false
        })
        .catch(error => {
          console.log(error)
        })

      this.getSendLineData()

      this.getLineData()
    },
    getLineData() {
      this.dateList = []
      this.receiveLoading = true
      let days = (this.monthList[1] - this.monthList[0]) / (24 * 60 * 60 * 1000)

      for (let index = days; index > 0; index--) {
        let day = this.monthList[1] - 24 * 60 * 60 * 1000 * index

        if (day == this.monthList[0]) {
          this.dateList.push(new Date(this.monthList[0]).getDate())
        } else {
          this.dateList.push(new Date(day).getDate())
        }
      }
      this.ReceiveList = {
        prisonData: [],
        centerData: []
      }
      let parmas = {}
      parmas.sePrisonId = this.prisonId
      parmas.rePrisonId = this.prisonId
      parmas.startTime = this.monthList[0]
      parmas.endTime = this.monthList[1]
      this.axios
        .post(
          this._global.businessUrl + '/dispatchFile/dispatchFileDayCount',
          parmas
        )
        .then(response => {
          if (this.prisonId == 1) {
            // 监狱接收
            this.ReceiveList.prisonData = response.dispatchReceiveFileDayCount
            // 省局接收
            this.ReceiveList.centerData =
              response.dispatchReceiveFileFromAllPrisonDayCount
          } else {
            // 监狱接收
            this.ReceiveList.prisonData =
              response.receiveFileTFromOthersDayCount
            // 省局接收
            this.ReceiveList.centerData = response.receiveFileaFromBaseDayCount
          }
          this.receiveLoading = false
          console.log(this.ReceiveList)
        })
    },
    getSendLineData() {
      this.sendDateList = []
      this.sendLoading = true

      let days =
        (this.sendMonthList[1] - this.sendMonthList[0]) / (24 * 60 * 60 * 1000)

      for (let index = days; index > 0; index--) {
        let day = this.sendMonthList[1] - 24 * 60 * 60 * 1000 * index

        if (day == this.sendMonthList[0]) {
          this.sendDateList.push(new Date(this.sendMonthList[0]).getDate())
        } else {
          this.sendDateList.push(new Date(day).getDate())
        }
      }
      this.SendList = {
        prisonData: [],
        centerData: []
      }
      let parmas = {}
      parmas.sePrisonId = this.prisonId
      parmas.rePrisonId = this.prisonId
      parmas.startTime = this.sendMonthList[0]
      parmas.endTime = this.sendMonthList[1]
      this.axios
        .post(
          this._global.businessUrl + '/dispatchFile/dispatchFileDayCount',
          parmas
        )
        .then(response => {
          if (this.prisonId == 1) {
            // 监狱发送
            this.SendList.prisonData = response.dispatchSendFileDayCount
            // 省局发送
            this.SendList.centerData =
              response.dispatchSendFileToAllPrisonDayCount
          } else {
            // 监狱发送
            this.SendList.prisonData = response.sendFileToOthersDayCount
            // 省局发送
            this.SendList.centerData = response.sendFileToBaseDayCount
          }
          this.sendLoading = false
        })
    },
    drawLine() {
      this.chart = echarts.init(document.getElementById('bar_main'))
      this.chart.setOption({
        title: {
          text: this.timeoutNum + '所监狱反馈超时',
          textStyle: {
            fontSize: 13,
            color: color()
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#F17037', '#86D7FF'],
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
            rotate: 50, // 文字逆时针旋转45°
            textStyle: {
              fontSize: 14,
              color: color()
            },
            // formatter: function(value) {
            //   return value.split("").join("\n");
            // },
            color: '#333'
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
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
            name: '需要反馈数',
            type: 'bar',
            data: this.unBackedList
          },
          {
            name: '已反馈数',
            type: 'bar',
            data: this.backedList
          }
        ]
      })
    },
    nodeClick(val) {
      console.log(val)

      this.prisonId = val.id
      this.userDeptId = val.id
      this.prisonName = val.departName
      sessionStorage.setItem('prisonID', this.prisonId)
    },

    formtime(row, column, cellValue, index) {
      if (cellValue != null) {
        let date = new Date(cellValue)
        let y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? '0' + MM : MM
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        let h = date.getHours()
        h = h < 10 ? '0' + h : h
        let m = date.getMinutes()
        m = m < 10 ? '0' + m : m
        let s = date.getSeconds()
        s = s < 10 ? '0' + s : s
        // return y + '-' + MM + '-' + d ;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
    }
  },

  watch: {
    prisonId: function() {
      if (this.prisonId == 1) {
        this.prisonName = '全省各监狱'
      } else {
        this.chart.dispose()
      }
      this.getAllData()
    }
  }
}
</script>
<style lang="less" scoped>
.technology {
  .btn_pad,
  .cards,
  .info_num {
    color: #fff !important;
  }
  .cards,
  .bar_box,
  .card_box {
    color: #fff;
    background: transparent;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
}
.btn_box {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  .btn_pad {
    // border-bottom: 3px solid #fff;
    // margin: 0 1rem;
    // text-align: center;
    // padding: 0.5rem 1rem;
    // font-weight: 600;
    // font-size: 1.2rem;
    // cursor: pointer;
    height: 2.2rem;
    width: 8rem;
  }
  .active {
    border-bottom: 3px solid #2b8bef;
    color: #2b8bef;
  }
}
.time_box {
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .title {
    text-align: right;
    font-size: 1.4rem;
  }
}
.time_btn {
  margin-left: 2rem;
}
.yn_date_picker {
  font-size: 1.2rem !important;
  border: 1px solid rgb(153, 151, 151);
}
.el-date-editor .el-range-separator {
  width: 10% !important;
  font-size: 1.2rem;
}
.cards {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 2rem 1rem;
  background: rgba(251, 252, 255, 1);
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  margin: 1rem 0;

  .icon_box {
    width: 6rem;
    height: 6rem;
    text-align: center;
    line-height: 8rem;
    .icon_img {
      font-size: 4rem;
      color: #fff;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .warning {
    background: #e6a23c;
  }
  .success {
    background: #67c23a;
  }
  .danger {
    background: #f56c6c;
  }
  .info_box {
    font-size: 1.2rem;
    color: #c0c0c0;
    font-weight: 500;
    .info_num {
      color: #000;
      font-size: 1.6rem;
      font-weight: 600;
      margin-top: 1rem;
    }
  }
}
.big_one {
  margin-right: 20%;
}
.block {
  margin-top: 6rem;
}
</style>
