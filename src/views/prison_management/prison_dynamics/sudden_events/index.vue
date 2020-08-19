<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:25:01
 -->

<template slot-scope="scope">
  <!-- 预案库 -->

  <dept-layout v-model="prisonId">
    <menuTree :menuList="['监狱管理','监狱动态','监狱突发事件']">
      <tab
        slot="heade_btn"
        name="突发事件管理"
        :right="true"
        pathName="emergency_statisic"
        leftName="突发事件统计"
      />
      <table-view
        :tableData="tableData"
        noIndex
        noBottom
        v-loading="tableLoading"
        @sizeChange="getPlanData"
      >
        <div slot="searchCondition">
          <el-form ref="form" inline class="yn_form">
            <el-form-item label="报警时间：">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="date"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                value-format="timestamp"
                align="right"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="报警事件类型：">
              <el-select v-model="searchData.alarmEvent" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="警情级别：">
              <el-select v-model="searchData.alarmLevel" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" @click="getPlanData" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>
            </el-form-item>
            <el-form-item v-if="userPrisonId!=1">
              <alarmDialog class="yn_btn" @submit="getPlanData" />
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column
            prop="alarmTime"
            show-overflow-tooltip
            label="报警时间"
            :formatter="dateMatter"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="alarmEvent"
            label="报警事件"
            :formatter="typeMatter"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="alarmLevel"
            :formatter="levelMatter"
            label="警情级别"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="alarmAddress"
            label="报警地点"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="alarmType"
            :formatter="releaseMatter"
            label="报警类型"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="planId"
            label="先期处置流程"
            show-overflow-tooltip
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.planId"
                type="text"
                class="yn_text_btn"
                @click="seePlan(scope.row.planId)"
              >{{scope.row.planName}}</el-button>
              <el-button v-else type="text" class="yn_text_btn" @click="setPlan(scope.row)">绑定处置流程</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="处置状态" width="width" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.status==1?'未处理':'已处理'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="handleTime"
            :formatter="dateMatter"
            label="处置完毕时间"
            width="width"
            align="center"
          ></el-table-column>

          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="yn_text_btn yn_long_btn"
                v-if="scope.row.isEmergencyExercise==1&&userPrisonId!=1"
                @click="setExercise(scope.row)"
              >标注为应急演练</el-button>
              <el-button
                type="text"
                class="yn_text_btn yn_long_btn"
                v-if="scope.row.handleTime"
                @click="seeCommand(scope.row)"
              >查看处理详情</el-button>
              <!-- <el-button
              type="text"
              class="yn_text_btn"
              v-if="!scope.row.handleTime"
              @click="setFinish(scope.row)"
              >标记已处理</el-button>-->
              <el-button
                type="text"
                class="yn_text_btn"
                v-if="!scope.row.handleTime&&userPrisonId!=1"
                @click="goCommand(scope.row)"
              >前去指挥</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <!-- 查看 -->
      <el-dialog :visible.sync="seeVisible" class="yn_dialog" title="查看先期处置流程" center>
        <el-row class="items">
          <el-col :span="4">事件类型:</el-col>
          <el-col :span="20">{{planObj.eventName}}</el-col>
        </el-row>
        <el-row class="items">
          <el-col :span="4">预案名称:</el-col>
          <el-col :span="20">{{planObj.planName}}</el-col>
        </el-row>
        <el-row class="items">
          <el-col :span="4">步骤:</el-col>
          <el-col :span="20">
            <div class="stepBox" v-for="(item,i) in planObj.steps" :key="i">
              <el-row>
                <el-col :span="1">{{i+1}}、</el-col>
                <el-col :span="23">
                  <el-row>
                    <el-col :span="5">小组名称：</el-col>
                    <el-col :span="19">{{item.teamName}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="5">步骤名称：</el-col>
                    <el-col :span="19">{{item.stepName}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="5">采取措施：</el-col>
                    <el-col :span="19">{{item.detail}}</el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="seeVisible=false">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="commandVisible" class="yn_dialog" title="查看处理详情" center>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in commandList"
            :key="index"
            :timestamp="activity.timestamp"
          >
            <div class="items">步骤内容：{{activity.operateContent}}</div>
            <div class="items">备注：{{activity.remark}}</div>
          </el-timeline-item>
        </el-timeline>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="commandVisible=false">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="setVisible" class="yn_dialog" title="绑定处置流程" center>
        <el-form ref="form" label-width="12rem" :model="setData" class="yn_form">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item prop="alarmEvent" label="报警事件类型：">
                <el-select
                  v-model="setData.alarmEvent"
                  @change="selChange"
                  class="yn_ipt"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.subclassGuid"
                    :label="item.value"
                    :value="item.subclassGuid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item prop="alarmLevel" label="警情级别：">
                <el-select
                  v-model="setData.alarmLevel"
                  class="yn_ipt"
                  @change="selChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in levelList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="planId" label="选择先期处置流程:">
                <el-select
                  v-model="setData.planId"
                  class="yn_ipt"
                  placeholder="请选择"
                  :disabled="planDisable"
                >
                  <el-option
                    v-for="item in planList"
                    :key="item.id"
                    :label="item.planName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="savePlan">确定</el-button>
          <el-button class="yn_btn" type="primary" @click="setVisible=false">取消</el-button>
        </span>
      </el-dialog>
    </menuTree>
  </dept-layout>
</template>
<script>
import tableView from '@/components/table_view/'
import { getPrisonId } from '@/utils'
import formatDate from '@/utils/date'
import tab from '@/components/tab/index.vue'
import alarmDialog from '@/components/alarm_dialog/alarm_dialog.vue'
import { pickerOptions } from '@/utils/picker_option_config.js'
import deptLayout from '@/components/deptLayout/index.vue'
import menuTree from '@/components/menu_tree/'

import {
  getEventType,
  getExerciseData,
  setFinish,
  getPlanDetail,
  setExercise,
  getEventDetail,
  getPlans,
  upData
} from './service.js'
import { Loading } from 'element-ui'

export default {
  components: { tableView, tab, alarmDialog, deptLayout, menuTree },

  data() {
    return {
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      tableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },
      tableLoading: false,
      date: [],
      searchData: {},
      typeList: [],
      levelList: [
        { name: '轻微', value: '1' },
        { name: '较低', value: '2' },
        { name: '中等', value: '3' },
        { name: '较高', value: '4' },
        { name: '严重', value: '5' }
      ],
      downVisble: false,
      transmitData: {},
      prisonList: [],
      seeVisible: false,
      commandVisible: false,
      planObj: {},
      commandList: [],
      eventId: '',
      setVisible: false,
      setData: {},
      planDisable: true,
      planList: []
    }
  },
  created() {
    this.getPlanData()
    this.getEventType()
  },
  methods: {
    // 获取事件类型
    getEventType() {
      getEventType().then(res => {
        this.typeList = res
      })
    },

    // 预案数据
    getPlanData() {
      this.searchData.currentPage = this.tableData.pageNum
      this.searchData.pageSize = this.tableData.pageSize
      this.searchData.emPrisonId = this.prisonId

      getExerciseData(this.searchData).then(res => {
        this.tableData.list = res.rows
        this.tableData.total = res.total
      })
    },

    // 时间参数
    timeChange(data) {
      if (data) {
        this.searchData.startTime = data[0]
        this.searchData.endTime = data[1] + 24 * 3600 * 1000
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
    },
    // 重置查询参数
    reset() {
      this.tableData = { list: [], total: 0, pageNum: 1, pageSize: 10 }
      this.searchData = {}
      this.date = []
      this.getPlanData()
    },
    setExercise(val) {
      setExercise(val.emergencyEventId).then(res => {
        this.$message.success(res)
        this.getPlanData()
      })
    },
    seePlan(val) {
      this.seeVisible = true
      getPlanDetail(val).then(res => {
        this.planObj = res
        this.typeList.forEach(item => {
          item.subclassGuid == this.planObj.eventType
            ? (this.planObj.eventName = item.value)
            : ''
        })
      })
    },
    setPlan(row) {
      this.setVisible = true
      this.eventId = row.emergencyEventId
      this.setData.alarmEvent = row.alarmEvent
      this.setData.alarmLevel = row.alarmLevel
      this.selChange()
    },

    selChange() {
      if (this.setData.alarmEvent && this.setData.alarmLevel) {
        this.getPlans()
        this.planDisable = false
      } else {
        this.planDisable = true
      }
      //   this.setData.planId = ''
    },

    getPlans() {
      let str =
        this.setData.alarmEvent +
        '/' +
        this.setData.alarmLevel +
        '/' +
        this.prisonId
      getPlans(str)
        .then(res => {
          this.planList = res
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    savePlan() {
      let parmas = {
        planId: this.setData.planId,
        emergencyEventId: this.eventId
      }

      upData(parmas).then(res => {
        this.$message.success('更新成功')
        this.setVisible = false
        this.getPlanData()
      })
    },
    setFinish(val) {
      let params = {}
      params.emergencyEventId = val.emergencyEventId
      params.status = 2
      params.handleTime = new Date().getTime()
      setFinish(params).then(res => {
        this.$message.success(res)
        this.getPlanData()
      })
    },
    goCommand(val) {
      if (val.planId) {
        this.$router.push({ name: 'emergency_command', params: val })
      } else {
        this.$message.error('未绑定先期处置流程')
      }
    },
    seeCommand(val) {
      this.commandList = []
      this.commandVisible = true
      getEventDetail(val.emergencyEventId).then(res => {
        this.commandList = res
        this.commandList.forEach(item => {
          item.timestamp = formatDate(
            new Date(item.operateTime),
            'yyyy-MM-dd hh:mm:ss'
          )
        })
      })
    },
    // 表格数据格式
    typeMatter(row, column, cellValue, index) {
      let str = ''
      this.typeList.forEach(item => {
        // item.subclassGuid == cellValue ? str = item.value : ''
        if (item.subclassGuid == cellValue) {
          str = item.value
          row.alarmEventName = item.value
        }
      })

      return str
    },
    releaseMatter(row, column, cellValue, index) {
      let str
      cellValue == 1 ? (str = '手动报警') : (str = '设备报警')

      return str
    },
    levelMatter(row, column, cellValue, index) {
      let str
      this.levelList.map(item => {
        item.value == cellValue ? (str = item.name) : ''
      })
      return str
    },
    dateMatter(row, column, cellValue, index) {
      if (cellValue) {
        return formatDate(new Date(cellValue), 'yyyy-MM-dd hh:mm:ss')
      } else {
        return '未处置完毕'
      }
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  watch: {
    prisonId() {
      this.getPlanData()
    }
  }
}
</script>
<style scoped lang="less">
.btn_group {
  width: 100%;
  margin-bottom: 2rem;
  .yn_btn {
    margin: 0 10px;
  }
}
.detail_item {
  margin: 2rem 0;
  font-size: 1.4rem;
}
.yn_text_btn {
  width: 7rem;
}
.technology {
  .items {
    color: #fff;
  }
}
</style>
