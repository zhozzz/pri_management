<!--
 * @Description:外来车辆 登记
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:01:55
 -->
<template>
  <menuTree :menuList="['监狱管理','AB门管理','外来车辆管理']">
    <tab slot="heade_btn" name="外来车辆管理" :right="true" pathName="car_management_data_statistic" />
    <table-view
      noBottom
      @sizeChange="getPrisonOutSideCarInfo"
      :tableData="tableData"
      v-loading="tableLoading"
      :tableRowClassName="tableRowClassName"
    >
      <div slot="searchCondition">
        <el-form ref="form" class="yn_form" inline>
          <el-form-item label="外来时间">
            <el-date-picker
              v-model="bindData.time"
              class="yn_ipt yn_date_picker"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              align="right"
            ></el-date-picker>
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
          <el-form-item label=" " label-width="1rem">
            <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
            <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
          </el-form-item>
          <!-- <el-form-item label=" " label-width="1rem">
            <el-button
              v-if="btnPermissions"
              class="yn_btn"
              type="primary"
              @click="handleSwipecardToggle(true)"
            >入监登记</el-button>

            <el-button
              v-if="btnPermissions"
              class="yn_btn"
              type="primary"
              @click="handleDepartureToggle(true)"
            >离监登记</el-button>
          </el-form-item>-->

          <!-- <el-button class="yn_btn" type="primary" @click="$router.back()">数据统计</el-button> -->
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column prop="numberPlate" label="车牌号" />
        <el-table-column min-width="100" prop="deptName" label="部门" />
        <el-table-column prop="visitorName" label="外来人员姓名" />
        <el-table-column prop="swipecardTime" show-overflow-tooltip label="进入时间" />
        <el-table-column prop="leaveTime" show-overflow-tooltip label="离开时间" />
        <el-table-column label="停留时间(小时)" prop="stayHour"></el-table-column>
        <el-table-column label="阈值(小时)">{{Math.round((overTime /60000)/60)}}</el-table-column>
        <el-table-column label="是否预警">
          <template slot-scope="{row}">{{ isWarn(row)}}</template>
        </el-table-column>

        <el-table-column prop="inpoliceName" label="带入警员">
          <template slot-scope="{row}">
            <police-detail :police="{policeId: row.inpoliceId, policeName:row.inpoliceName}" />
          </template>
        </el-table-column>
        <el-table-column prop="outpoliceName" label="带出警员">
          <template slot-scope="{row}">
            <police-detail :police="{policeId: row.outpoliceId, policeName:row.outpoliceName}" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button class="yn_text_btn" type="text" @click="handleHistory(row)">历史详情</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <!-- 出监登记 -->
    <departure
      :departureToggle="departureToggle"
      @getPrisonOutSideCarInfo="getPrisonOutSideCarInfo"
      :handleDepartureToggle="handleDepartureToggle"
      :startDate="queryData.startDate"
      :endDate="queryData.endDate"
    />
    <!-- 入监登记 -->
    <el-dialog title="入监登记" center :visible.sync="swipecardToggle" width="800px">
      <el-form ref="form" label-width="80px" inline>
        <el-form-item label="进入监区">
          <depart-select v-model="swipecardForm.deptId" />
        </el-form-item>
        <el-form-item label="带入警员">
          <police-select
            v-model="swipecardForm.inpoliceId"
            :disabled="!swipecardForm.deptId"
            :departId="swipecardForm.deptId"
          />
          <el-button class="yn_btn" type="primary" @click="insetVehicle">添加一行</el-button>
        </el-form-item>

        <el-row>
          <el-col :span="24">
            <!-- stripe -->
            <el-table :data="swipecardForm.vehicleInfo" border>
              <el-table-column prop="numberPlate" label="车牌号" minWidth="120">
                <template slot-scope="{row}">
                  <el-input class="yn_ipt" v-model="row.numberPlate" placeholder="车牌号"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="visitorName" label="司机姓名" minWidth="140">
                <template slot-scope="{row}">
                  <el-input class="yn_ipt" v-model="row.visitorName" placeholder="司机姓名"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="cardNum" label="证件号码" minWidth="418">
                <template slot-scope="{row}">
                  <el-input class="yn_ipt" v-model="row.cardNum" placeholder="证件号码"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="{$index}">
                  <el-button
                    @click="deleteVehicle($index)"
                    :disabled="swipecardForm.vehicleInfo.length===1"
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
        <el-button class="yn_btn" @click="handleSwipecardToggle(false)">取 消</el-button>
        <el-button class="yn_btn" type="primary" @click="$checkMessage(carCheckIn)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 来往历史 -->
    <history-dialog
      :historyToggle="historyToggle"
      :numberPlate="numberPlate"
      :handleHistoryClose="handleHistoryClose"
    />
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import departure from './departure'
import historyDialog from './history_dialog'
import { pickerOptions } from '@/utils/picker_option_config.js'
import policeDetail from '@/components/police_detail'
import policeSelect from '@/components/depart_police_select'
import departSelect from '@/components/depart_select_prison'
import { formatDate } from '@/utils/date'
import permissions from '@/utils/permission.js'
import { getPrisonOutSideCarInfo, carCheckIn, getOverTime } from './service'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

let tempDate = formatDate(new Date(), 'yyyy-MM-dd')
let tempStartDate = new Date(`${tempDate} 00:00:00`)
let tempEndDate = new Date(`${tempDate} 23:59:59`)
// normal不能为空不能包含特殊字符不能有空格
var special = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/
)
var blank = new RegExp(/^\S*$/)

export default {
  components: {
    tableView,
    departure,
    historyDialog,
    policeDetail,
    policeSelect,
    departSelect,
    tab,
    menuTree
  },
  data() {
    return {
      btnPermissions: permissions('car_management_check_in_button'),
      tableLoading: false,
      overTime: 0,
      statusOption: [
        { label: '全部', value: 'all' },
        { label: '已超时', value: 'true' },
        { label: '未超时', value: 'false' }
      ],
      bindData: {
        time: [tempStartDate, tempEndDate],
        isOverTime: 'all'
      },
      queryData: {
        startDate: `${tempDate} 00:00:00`,
        endDate: `${tempDate} 23:59:59`,
        isOverTime: 'all'
      },
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      swipecardToggle: false,
      departureToggle: false,
      historyToggle: false,
      numberPlate: null,
      swipecardForm: {
        inpoliceId: null,
        deptId: null,
        vehicleInfo: [{}]
      }
    }
  },

  methods: {
    query() {
      let { isOverTime, time } = this.bindData
      let startDate = ''
      let endDate = ''
      if (time) {
        startDate = formatDate(time[0], 'yyyy-MM-dd hh:mm:ss')
        endDate = formatDate(time[1], 'yyyy-MM-dd hh:mm:ss')
      }
      this.queryData = {
        isOverTime,
        startDate,
        endDate
      }
      this.getPrisonOutSideCarInfo()
    },
    reset() {
      this.queryData = {
        startDate: `${tempDate} 00:00:00`,
        endDate: `${tempDate} 23:59:59`,
        isOverTime: 'all'
      }
      this.bindData = {
        time: [tempStartDate, tempEndDate],
        isOverTime: 'all'
      }
      this.tableData.pageNum = 1
      this.getPrisonOutSideCarInfo()
    },
    // 入监历史记录
    getPrisonOutSideCarInfo() {
      let { queryData } = this
      let { pageNum, pageSize } = this.tableData
      let formData = {
        ...queryData,
        pageNum,
        pageSize,
        prisonId: JSON.parse(localStorage.getItem('user')).prisonId
      }
      this.tableLoading = true

      getPrisonOutSideCarInfo(formData).then(
        res => {
          this.tableData = {
            ...res,
            total: res.count,
            pageSize: this.tableData.pageSize
          }
          this.tableLoading = false
          // eslint-disable-next-line handle-callback-err
        },
        err => {
          this.tableLoading = false
        }
      )
    },
    insetVehicle() {
      this.swipecardForm.vehicleInfo.push({})
    },
    deleteVehicle(index) {
      this.swipecardForm.vehicleInfo.splice(index, 1)
    },
    // 来往历史记录车牌号
    handleHistory(row) {
      this.numberPlate = row.numberPlate
      this.historyToggle = true
    },
    // 来往历史关闭
    handleHistoryClose() {
      this.historyToggle = false
    },
    // 入监打开关闭
    handleSwipecardToggle(value) {
      this.swipecardForm = {
        inpoliceId: null,
        deptId: null,
        vehicleInfo: [{}]
      }
      this.swipecardToggle = value
      this.numberPlate = null
    },
    // 出监打开关闭
    handleDepartureToggle(value) {
      this.departureToggle = value
    },

    // 入监提交
    carCheckIn() {
      let {
        swipecardForm: { inpoliceId, deptId, vehicleInfo }
      } = this
      if (!inpoliceId) {
        this.$message({
          type: 'info',
          message: '请选择带入警员!'
        })
        return false
      }
      if (!deptId) {
        this.$message({
          type: 'info',
          message: '请选择进入监区!'
        })
        return false
      }
      let check = true
      for (let index = 0; index < vehicleInfo.length; index++) {
        const element = vehicleInfo[index]
        element.inpoliceId = inpoliceId
        element.deptId = deptId
        if (!element.numberPlate) {
          // 校验

          this.$message({
            type: 'info',
            message: '请输入车牌号!'
          })
          check = false
        } else {
          /* if (special.test(element.numberPlate)) {
            this.$message({
              type: 'info',
              message: '车牌号不能包含特殊字符!'
            })
            check = false
          } else  if (!blank.test(element.numberPlate)) {
            this.$message({
              type: 'info',
              message: '车牌号不能包含空格!'
            })
            check = false
          } */
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

        if (!element.visitorName) {
          // 校验
          this.$message({
            type: 'info',
            message: '请输入司机姓名!'
          })
          check = false
        }
      }
      if (check) {
        carCheckIn(vehicleInfo).then(res => {
          this.$message({
            type: 'success',
            message: '入监成功！'
          })
          this.handleSwipecardToggle(false)
          this.getPrisonOutSideCarInfo() // 成功刷新数据
        })
      }
    },
    tableRowClassName({ row }) {
      return row.stayMillisecond >= this.overTime
        ? 'warning-row'
        : 'success-row'
    },
    isWarn(row) {
      return row.stayMillisecond >= this.overTime ? '是' : '否'
    },
    getOverTime() {
      // overTime
      getOverTime().then(res => {
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
    // if (this.$route.params) {
    //   this.bindData.isOverTime = this.$route.params.isOverTime
    // }
    this.getPrisonOutSideCarInfo()
    this.getOverTime()
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
