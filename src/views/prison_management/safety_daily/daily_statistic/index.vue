<!--
 * @Description:外来人员 数据统计
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-23 15:33:08
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:22:30
 -->

<template>
  <dept-layout v-model="changePrisonId" :date="queryTime">
    <menuTree :menuList="['监狱管理','指挥中心','监管安全日报']">
      <div class="time_box">
        <div>各单位上报时限</div>
        <div :style="{'margin':'0 10px'}">
          午间：{{formatDate(new Date(time[2].beginTime),'hh:mm:ss')}}-
          {{formatDate(new Date(time[2].endTime),'hh:mm:ss')}}
        </div>
        <div v-if="changePrisonId==1" @click="openEdit(2)">
          <i class="el-icon-edit-outline"></i>
        </div>
        <div :style="{'margin':'0 10px'}">
          晚间：{{formatDate(new Date(time[3].beginTime),'hh:mm:ss')}}-
          {{formatDate(new Date(time[3].endTime),'hh:mm:ss')}}
        </div>
        <div v-if="changePrisonId==1" @click="openEdit(3)">
          <i class="el-icon-edit-outline"></i>
        </div>
      </div>
      <div class="statistic" v-show="changePrisonId==='1'">
        <div class="title-query-bar">
          <el-form ref="form" inline class="yn_form" label-width="6rem">
            <el-form-item>
              <el-date-picker
                class="yn_ipt"
                v-model="queryTime"
                type="date"
                @change="query"
                :clearable="false"
                placeholder="选择日期"
                :picker-options="{
              disabledDate(date){
                return  new Date(date).getTime()>new Date().getTime()
              }
          }"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="yn_btn yesterday_btn" @click="yesterday">前一天</el-button>
              <el-button
                type="primary"
                class="yn_btn nextday_btn"
                :disabled="queryTime.getTime()>new Date().getTime()-24*3600*1000"
                @click="tomorrow"
              >后一天</el-button>
              <el-button type="primary" class="yn_btn today_btn" @click="today">今天</el-button>
              <el-button type="primary" class="yn_btn" v-if="prisonId==1" @click="goMgt">模板管理</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <head-icon :list="headIconList" v-loading="loding"></head-icon> -->

        <el-dialog class="yn_dialog" center title="编辑上报时限" :visible.sync="editTimeFLag" width="50%">
          <el-form label-width="6rem" class="yn_form" inline ref="addform">
            <el-form-item label="上报时限:">
              <el-time-picker
                class="yn_ipt"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择开始时间"
                :value="timer"
                :clearable="false"
                @input="input"
              ></el-time-picker>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button class="yn_btn" type="primary" @click="subTime">保存</el-button>
            <el-button class="yn_btn" @click="editTimeFLag=false">取消</el-button>
          </div>
        </el-dialog>
        <div>
          <!-- <div class="yn_charts"> -->
          <h3 class="yn_page_title">各监狱上报时间</h3>
          <table-view noBottom noPage noIndex noSearch :tableData="tableData" v-loading="loding">
            <template slot="table-column">
              <el-table-column label="单位" prop="prisonName" align="center" />
              <!-- <el-table-column label="值班领导" prop="inTime" /> -->
              <el-table-column label="中午" prop="inTime" align="center">
                <template slot-scope="{row}">
                  <span
                    v-if="row.reportVoList[0].state!==null"
                  >{{row.reportVoList[0].state==0?'未报':row.reportVoList[0].state==1?'迟报':'已报'}}</span>

                  <div class="tableBtns" v-else>
                    <el-button
                      type="primary"
                      class="table_btn"
                      :style="{'width':'100%' }"
                      :disabled="!row.reportVoList[0].reportContent"
                      @click="setReport(0,row,2)"
                    >已报</el-button>
                    <el-button
                      type="danger"
                      class="table_btn"
                      :style="{'width':'49%' }"
                      @click="setReport(0,row,0)"
                    >未报</el-button>
                    <el-button
                      type="warning"
                      class="table_btn"
                      :style="{'width':'49%' }"
                      @click="setReport(0,row,1)"
                    >迟报</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="上报内容" prop="inTime" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <i class="el-icon-edit-outline" @click="openReport(row,0)"></i>
                  <span>{{row.reportVoList[0].reportContent}}</span>
                </template>
              </el-table-column>

              <el-table-column label="晚间" prop="inTime" align="center">
                <template slot-scope="{row}">
                  <span
                    v-if="row.reportVoList[1].state!==null"
                  >{{row.reportVoList[1].state==0?'未报':row.reportVoList[1].state==1?'迟报':'已报'}}</span>

                  <div class="tableBtns" v-else>
                    <el-button
                      type="primary"
                      class="table_btn"
                      :style="{'width':'100%' }"
                      :disabled="!row.reportVoList[1].reportContent"
                      @click="setReport(1,row,2)"
                    >已报</el-button>
                    <el-button
                      type="danger"
                      class="table_btn"
                      :style="{'width':'49%' }"
                      @click="setReport(1,row,0)"
                    >未报</el-button>
                    <el-button
                      type="warning"
                      class="table_btn"
                      :style="{'width':'49%' }"
                      @click="setReport(1,row,1)"
                    >迟报</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="上报内容" prop="inTime" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <i class="el-icon-edit-outline" @click="openReport(row,1)"></i>
                  <span>{{row.reportVoList[1].reportContent}}</span>
                </template>
              </el-table-column>
            </template>
          </table-view>
        </div>
      </div>

      <el-dialog :visible.sync="reportVisible" class="yn_dialog" title="代上报" center @close="close">
        <div class="yn_page_title">当前单位值班领导:{{dutyLeader}}</div>

        <el-input
          class="yn_ipt"
          type="textarea"
          :rows="2"
          v-model="paramsReport.reportContent"
          placeholder="请输入上报内容"
        ></el-input>
        <div slot="footer">
          <el-button
            type="primary"
            class="yn_btn"
            @click="$checkMessage(provincialHandleReport)"
          >确认代上报</el-button>
          <el-button type="primary" class="yn_btn" @click="close">取消</el-button>
        </div>
      </el-dialog>
      <daily-Info
        v-show="changePrisonId!=='1'"
        :time="time"
        :changePrisonId="changePrisonId"
        :date="queryTime"
      ></daily-Info>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import BarChart from './bar_chart'
import deptLayout from '@/components/deptLayout/dailyIndex.vue'
import tableView from '@/components/table_view'
import { getPrisonId } from '@/utils'
import {
  getStatisticalData,
  getPrisonData,
  getTime,
  subTime,
  markReportState,
  provincialHandleReport,
  listDailyReport,
  getLeader
} from './service'
import { formatDate } from '@/utils/date'
import dailyInfo from '../daily_info'
import menuTree from '@/components/menu_tree/'
import headIcon from '@/components/head_icon'
export default {
  components: {
    BarChart,
    deptLayout,
    tableView,
    dailyInfo,
    headIcon,
    menuTree
  },
  data() {
    return {
      tooggle: false,
      loding: false,
      reportVisible: false,
      editTimeFLag: false,
      time: { 2: {}, 3: {} },
      timeStatus: '',
      timer: [new Date(), new Date()],
      queryTime: new Date(),
      changePrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      sourceTableData: [],
      tableData: {
        list: [],
        pageNum: 1,
        pageSize: 10
      },
      exceptionReport: {
        list: []
      },
      headIconList: [
        {
          url: require('@/assets/index/waiting_info.png'),
          info: '全省今日上报安全日报数',
          text: null
        },
        {
          url: require('@/assets/index/waiting_yellow.png'),
          info: '当前未上报监狱数',
          text: null
        }
      ],
      paramsReport: {},
      dutyLeader: ''
    }
  },
  methods: {
    getLeader() {
      let str =
        this.paramsReport.prisonId +
        '/' +
        formatDate(this.queryTime, 'yyyy-MM-dd')
      getLeader(str).then(res => {
        console.log(res)
        if (res.departs[0].rotas.length) {
          this.dutyLeader = ''
          res.departs[0].rotas.map((item, i) => {
            if (item.users) {
              item.users.map((user, j) => {
                if (i < res.departs[0].rotas.length - 1) {
                  this.dutyLeader = user.userName + '、'
                } else {
                  this.dutyLeader = user.userName
                }
              })
            }
          })
        } else {
          this.dutyLeader = '暂无领导'
        }
      })
    },
    //省局代上报
    openReport(row, turn) {
      this.paramsReport.prisonId = row.prisonId

      this.paramsReport.turn = turn
      this.getLeader()
      if (!this.paramsReport.reportContent) {
        listDailyReport({
          reportTime: formatDate(this.queryTime, 'yyyy-MM-dd'),
          prisonId: row.prisonId
        }).then(res => {
          let status = 2
          if (turn == 1) {
            status = 3
          }
          res.map(item => {
            if (item.status == status) {
              this.$set(this.paramsReport, 'reportContent', item.reportContent)
              //   this.paramsReport.reportContent = item.reportContent
            }
          })

          this.reportVisible = true
        })
      } else {
        // this.paramsReport.reportContent = row.reportVoList[turn].reportContent
        this.$set(
          this.paramsReport,
          'reportContent',
          row.reportVoList[turn].reportContent
        )

        this.reportVisible = true
      }
    },

    provincialHandleReport() {
      let params = {}
      params.prisonId = this.paramsReport.prisonId
      params.content = this.paramsReport.reportContent
      params.turn = this.paramsReport.turn
      params.supposedDate = formatDate(this.queryTime, 'yyyy-MM-dd')

      provincialHandleReport(params).then(res => {
        this.$message.success('编辑成功')
        this.reportVisible = false
        this.paramsReport = {}
        this.getPrisonData()
      })
    },

    close() {
      this.reportVisible = false
      this.paramsReport = {}
    },
    //省局设置状态
    setReport(i, row, state) {
      this.$msgbox
        .confirm('确认操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = {}
          params.turn = i
          params.prisonId = row.prisonId
          params.date = formatDate(new Date(this.queryTime), 'yyyy-MM-dd')
          params.state = state
          markReportState(params).then(res => {
            this.getPrisonData()
          })
        })
    },
    getTime(val) {
      getTime(val).then(res => {
        this.time[val] = res
      })
    },
    input(val) {
      this.$set(this, 'timer', val)
    },
    subTime() {
      let params = {}
      params.beginTime = formatDate(
        new Date(this.timer[0]),
        'yyyy-MM-dd hh:mm:ss'
      )
      params.endTime = formatDate(
        new Date(this.timer[1]),
        'yyyy-MM-dd hh:mm:ss'
      )
      params.status = this.timeStatus
      subTime(params).then(res => {
        this.editTimeFLag = false
        this.$message.success('修改完成')
        this.getPrisonData()
        this.getTime(2)
        this.getTime(3)
      })
    },
    openEdit(val) {
      //   this.timer = [this.time[val].beginTime, this.time[val].endTime]
      this.$set(this, 'timer', [
        this.time[val].beginTime,
        this.time[val].endTime
      ])

      this.timeStatus = val
      this.editTimeFLag = true
    },
    getPrisonData() {
      getPrisonData({
        reportTime: formatDate(this.queryTime, 'yyyy-MM-dd')
      }).then(res => {
        this.tableData.list = res
      })
    },
    getStatisticalData() {
      this.loding = true

      getStatisticalData({
        date: formatDate(this.queryTime, 'yyyy-MM-dd')
      }).then(res => {
        this.loding = false
        this.$set(this.headIconList[0], 'text', res.reportedNum)
        this.$set(this.headIconList[1], 'text', res.notReportedNum)
      })
    },
    today() {
      this.queryTime = new Date()
      this.query()
    },
    submit(val) {
      this.$router.push({
        name: 'safety_daily_push',
        params: { prisonId: val.prisonId }
      })
    },
    yesterday() {
      let queryTime = this.queryTime.getTime() - 24 * 60 * 60 * 1000
      this.queryTime = new Date(queryTime)
      this.query()
    },
    tomorrow() {
      let queryTime = this.queryTime.getTime() + 24 * 60 * 60 * 1000
      this.queryTime = new Date(queryTime)
      this.query()
    },
    goMgt() {
      this.$router.push({ name: 'safety_daily_template' })
    },
    query() {
      //   this.getStatisticalData()
      this.getPrisonData()
    }
  },
  mounted() {
    // this.getStatisticalData()
    this.getPrisonData()
    this.getTime(2)
    this.getTime(3)
  },
  watch: {
    changePrisonId() {
      // this.setOption(val)
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-edit-outline {
  color: #409eff;
  font-size: 1.6rem;
}
.tableBtns {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .table_btn {
    font-size: 1.2rem !important;
    margin: 0.2rem 0;
    padding: 0.5rem;
    line-height: 2;
    border-radius: 4px;
    color: #fff;
  }
}
.technology {
  .yn_charts {
    .yn_btn {
      width: 100%;
    }
  }
  .time_box {
    color: #fff;
  }
}
.time_box {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin: 1rem 1rem;
}
</style>
