<!--
 * @Description:外来人员 登记
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:03:05
 -->
<template>
  <menuTree :menuList="['监狱管理','AB门管理','外来人员管理']">
    <tab slot="heade_btn" name="外来人员管理" :right="true" pathName="personnel_access_data_statistic" />
    <table-view
      noBottom
      @sizeChange="getPrisonVisitorInfo"
      :tableRowClassName="tableRowClassName"
      v-loading="tableLoading"
      :tableData="tableData"
    >
      <div slot="searchCondition">
        <el-form ref="form" class="yn_form" inline>
          <el-form-item label="外来时间">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="bindData.swipecardTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              align="right"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="来访事由">
            <el-select class="yn_ipt" v-model="bindData.issue" placeholder="请选择">
              <el-option
                v-for="item in visitorIssue"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="当前状态">
            <el-select class="yn_ipt" v-model="bindData.isOverTime" placeholder="请选择">
              <el-option
                v-for="item in statusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="人员类型">
            <el-select class="yn_ipt" v-model="bindData.visitorType" placeholder="请选择">
              <el-option
                v-for="item in visitorType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="进入区域">
            <depart-select class="yn_ipt" v-model="bindData.deptId"></depart-select>
          </el-form-item>

          <el-form-item label="性别">
            <el-select class="yn_ipt" v-model="bindData.gender" placeholder="请选择">
              <el-option
                v-for="item in gender"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
            <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item>
            <!-- <el-button v-if="btnPermissions"
                       class="yn_btn"
                       type="primary"
                       @click="handleSwipeVisitorToggle(true)">入监登记</el-button>

            <el-button v-if="btnPermissions"
                       class="yn_btn"
                       type="primary"
            @click="handleDepartureToggle(true)">离监登记</el-button>-->
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column align="center" prop="visitorName" label="姓名" />
        <el-table-column align="center" prop="genderName" label="性别" />
        <el-table-column align="center" show-overflow-tooltip prop="cardNum" label="身份证号" />
        <el-table-column align="center" min-width="100" prop="deptName" label="进入区域" />
        <el-table-column align="center" show-overflow-tooltip prop="phoneNum" label="联系方式" />
        <el-table-column align="center" label="人员类型" prop="visitorTypeName"></el-table-column>
        <el-table-column align="center" prop="issue" label="来访事由" />
        <el-table-column align="center" show-overflow-tooltip prop="swipecardTime" label="进入时间" />
        <el-table-column align="center" show-overflow-tooltip prop="leaveTime" label="离开时间" />
        <el-table-column align="center" prop="stayHour" label="停留时间" />
        <el-table-column align="center" label="阈值(小时)">{{Math.round((overTime /60000)/60)}}</el-table-column>
        <el-table-column align="center" label="是否预警">
          <template slot-scope="{row}">{{ isWarn(row)}}</template>
        </el-table-column>
        <el-table-column align="center" prop="inpoliceName" label="带入警员">
          <template slot-scope="{row}">
            <police-detail :police="{policeId: row.inpoliceId, policeName:row.inpoliceName}" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="outpoliceName" label="带出警员">
          <template slot-scope="{row}">
            <police-detail :police="{policeId: row.outpoliceId, policeName:row.outpoliceName}" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button class="yn_btn" type="text" @click="handleHistory(row)">历史详情</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <!-- 出监登记 -->
    <departure
      :departureToggle="departureToggle"
      @getPrisonVisitorInfo="getPrisonVisitorInfo"
      :handleDepartureToggle="handleDepartureToggle"
      :prisonId="prisonId"
    />
    <!-- 入监登记 -->
    <el-dialog title="入监登记" class="yn_dialog" center :visible.sync="swipeVisitorToggle" width="70%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="带入警员">
          <police-select v-model="swipeVisitorForm.inpoliceId"></police-select>
          <el-button class="yn_btn" type="primary" @click="insetVehicle">添加一行</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-table center :data="swipeVisitorForm.vehicleInfo" border stripe style="width: 100%">
              <el-table-column label="姓名" width="120">
                <template slot-scope="{row}">
                  <el-input class="yn_ipt" v-model="row.visitorName" placeholder="姓名"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="性别" width="100">
                <template slot-scope="{row}">
                  <el-select class="yn_ipt" v-model="row.gender" placeholder="性别">
                    <el-option
                      v-for="item in gender"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="身份证号">
                <template slot-scope="{row}">
                  <el-input class="yn_ipt" v-model="row.cardNum" placeholder="身份证号"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="进入区域">
                <template slot-scope="{row}">
                  <depart-select v-model="row.deptId"></depart-select>
                </template>
              </el-table-column>
              <el-table-column label="来访事由">
                <template slot-scope="{row}">
                  <el-select class="yn_ipt" v-model="row.issue" placeholder="来访事由">
                    <el-option
                      v-for="item in visitorIssue"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="联系方式">
                <template slot-scope="{row}">
                  <el-input class="yn_ipt" v-model="row.phoneNum" placeholder="联系方式"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="人员类型" width="200">
                <template slot-scope="{row}">
                  <el-select class="yn_ipt" v-model="row.visitorType" placeholder="人员类型">
                    <el-option
                      v-for="item in visitorType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="{$index}">
                  <el-button
                    @click="deleteVehicle($index)"
                    :disabled="swipeVisitorForm.vehicleInfo.length===1"
                    type="text"
                    class="yn_text_btn"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="handleSwipeVisitorToggle(false)">取 消</el-button>
        <el-button class="yn_btn" type="primary" @click="$checkMessage(visitorCheckIn)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 来往历史 -->
    <history-dialog
      :historyToggle="historyToggle"
      :cardNum="cardNum"
      :handleHistoryClose="handleHistoryClose"
    />
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import departure from './departure'
import historyDialog from './history_dialog'
import policeSelect from '@/components/police_select/index'
import { pickerOptions } from '@/utils/picker_option_config.js'
import { formatDate } from '@/utils/date'
import policeDetail from '@/components/police_detail'
import {
  listVisitorInfo,
  visitorCheckIn,
  visitorLeave,
  getDutyPolice,
  getHistory,
  getTodayStatisticalData,
  getStayTimeForPeriod,
  getIssueStatisticalDataForPeriod,
  getBaseData,
  getOverTime
} from './service'
import departSelect from '@/components/depart_select_prison'
import permissions from '@/utils/permission.js'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

let tempDate = formatDate(new Date(), 'yyyy-MM-dd')
let tempStartDate = new Date(`${tempDate} 00:00:00`)
let tempEndDate = new Date(`${tempDate} 23:59:59`)

export default {
  components: {
    tab,
    tableView,
    departure,
    historyDialog,
    policeSelect,
    departSelect,
    policeDetail,
    menuTree
  },
  data() {
    return {
      prisonId: JSON.parse(localStorage.getItem('user')).prisonId,
      btnPermissions: permissions('personnel_access_management_button'),
      tableLoading: false,
      overTime: 0,
      statusOption: [
        { label: '全部', value: 'all' },
        { label: '已超时', value: 'true' },
        { label: '未超时', value: 'false' }
      ], // 当前状态
      gender: [], // 性别
      visitorType: [], // 人员类型
      visitorIssue: [], // 来访事由
      bindData: {
        swipecardTime: [tempStartDate, tempEndDate],
        isOverTime: 'all'
      },
      queryData: {
        startDate: `${tempDate} 00:00:00`,
        endDate: `${tempDate} 23:59:59`,
        isOverTime: 'all'
      },
      tableData: {
        list: [],
        total: null,
        pageNum: 1,
        pageSize: 10
      },
      swipeVisitorToggle: false,
      departureToggle: false,
      historyToggle: false,
      cardNum: null,
      swipeVisitorForm: {
        inpoliceId: null,
        vehicleInfo: [{}]
      }
    }
  },

  methods: {
    tableRowClassName({ row }) {
      return row.stayMillisecond >= this.overTime
        ? 'warning-row'
        : 'success-row'
    },
    query() {
      let { swipecardTime } = this.bindData

      this.queryData = { ...this.bindData }
      let startDate = ''
      let endDate = ''
      if (swipecardTime) {
        startDate = formatDate(swipecardTime[0], 'yyyy-MM-dd hh:mm:ss')
        endDate = formatDate(swipecardTime[1], 'yyyy-MM-dd hh:mm:ss')
      }
      this.queryData.startDate = startDate
      this.queryData.endDate = endDate
      delete this.queryData.swipecardTime
      this.getPrisonVisitorInfo()
    },
    reset() {
      this.queryData = {
        startDate: `${tempDate} 00:00:00`,
        endDate: `${tempDate} 23:59:59`,
        isOverTime: 'all'
      }
      this.bindData = {
        swipecardTime: [tempStartDate, tempEndDate],
        isOverTime: 'all'
      }
      this.tableData.pageNum = 1
      this.getPrisonVisitorInfo()
    },
    insetVehicle() {
      this.swipeVisitorForm.vehicleInfo.push({})
    },
    deleteVehicle(index) {
      this.swipeVisitorForm.vehicleInfo.splice(index, 1)
    },
    // 来往历史记录车牌号
    handleHistory(row) {
      this.cardNum = row.cardNum
      this.historyToggle = true
    },
    // 来往历史关闭
    handleHistoryClose() {
      this.historyToggle = false
    },
    // 入监打开关闭
    handleSwipeVisitorToggle(value) {
      this.swipeVisitorToggle = value
      this.cardNum = null
      this.swipeVisitorForm = {
        inpoliceId: null,
        vehicleInfo: [{}]
      }
    },
    // 出监打开关闭
    handleDepartureToggle(value) {
      this.departureToggle = value
    },
    // 入监历史记录
    getPrisonVisitorInfo() {
      let { queryData } = this
      let { pageNum, pageSize } = this.tableData
      this.tableLoading = true
      let formData = {
        ...queryData,
        pageNum,
        pageSize,
        prisonId: JSON.parse(localStorage.getItem('user')).prisonId
      }
      listVisitorInfo(formData).then(
        res => {
          this.tableData = {
            ...res,
            total: res.count,
            pageSize: this.tableData.pageSize
          }
          this.tableLoading = false
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    getBaseData() {
      getBaseData().then(res => {
        let { gender, visitorIssue, visitorType } = res
        this.gender = gender
        this.visitorType = visitorType
        this.visitorIssue = visitorIssue
      })
    },
    isWarn(row) {
      return row.stayMillisecond >= this.overTime ? '是' : '否'
    },
    // 入监提交
    visitorCheckIn() {
      let {
        swipeVisitorForm: { inpoliceId, vehicleInfo }
      } = this
      if (!inpoliceId) {
        this.$message({
          type: 'info',
          message: '请选择带入警员!'
        })
        return false
      }

      let check = true
      for (let index = 0; index < vehicleInfo.length; index++) {
        const element = vehicleInfo[index]
        element.inpoliceId = inpoliceId

        if (!element.visitorName) {
          // 校验
          this.$message({
            type: 'info',
            message: '请输入姓名!'
          })
          check = false
        }
        if (!element.gender) {
          // 校验
          this.$message({
            type: 'info',
            message: '请输入性别!'
          })
          check = false
        }
        if (
          !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/.test(
            element.cardNum
          )
        ) {
          this.$message({
            type: 'info',
            message: '请输入正确的证件号码!'
          })
          check = false
        }

        if (!element.deptId) {
          // 校验
          this.$message({
            type: 'info',
            message: '请选择进入区域!'
          })
          check = false
        }
        if (!element.issue) {
          // 校验
          this.$message({
            type: 'info',
            message: '请选择来访事由!'
          })
          check = false
        }
        if (!element.phoneNum) {
          // 校验
          this.$message({
            type: 'info',
            message: '请输入联系方式!'
          })
          check = false
        }
        if (!element.visitorType) {
          // 校验
          this.$message({
            type: 'info',
            message: '请选择来访类型!'
          })
          check = false
        }
      }
      if (check) {
        visitorCheckIn(vehicleInfo).then(res => {
          this.$message({
            type: 'success',
            message: '入监成功！'
          })
          this.handleSwipeVisitorToggle(false)
          this.getPrisonVisitorInfo()
        })
      }
    },
    getOverTime() {
      // overTime
      getOverTime().then(res => {
        console.log(res)
        this.overTime = res * 60000
      })
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },

  mounted() {
    this.getOverTime()
    this.getPrisonVisitorInfo()
    this.getBaseData()
  }
}
</script>
<style lang="less" scoped>
.remove-card {
  text-align: center;
  * {
    color: red;
  }
}
.yn_date_picker {
  width: 100% !important;
}
</style>
