<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-12 10:10:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-27 15:15:52
 -->
<template>
  <div class="yn_page" v-loading="tableLoading">
    <menuTree :menuList="['监狱管理','指挥中心','安全日报上报']" />

    <table-view noBottom noPage noIndex :tableData="rootWork">
      <div slot="searchCondition">
        <el-form ref="form" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" :disabled="isAllowReport" class="yn_btn" @click="report">确认上报</el-button>
            <el-button class="yn_btn" @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
        <div class="yn-table-title">总值班详情</div>
      </div>
      <template slot="table-column">
        <el-table-column prop="shiftName" label="班次" />
        <el-table-column prop="dutyPersonName" label="总值班" />
        <el-table-column prop="positionName" label="职务" />
        <el-table-column prop="phoneNum" label="联系方式" />
        <el-table-column label="是否在岗">
          <template slot-scope="{ row }">{{row.isOnDutyShow?'是':'否'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ $index}">
            <el-button type="text" @click="editDuty( $index,'rootWork')">编辑</el-button>
            <el-button type="text" @click="deleteWork($index)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <table-view noBottom noPage noIndex :tableData="prisonWork">
      <div slot="searchCondition">
        <div class="yn-table-title">各监区值班人员详情</div>
      </div>

      <template slot="table-column">
        <el-table-column prop="deptName" label="部门" />
        <el-table-column prop="shiftName" label="班次" />

        <el-table-column prop="dutyPersonName" v-if="template.dutyPersonName" label="值班人员" />
        <el-table-column prop="phoneNum" label="联系方式" v-if="template.phoneNum" />
        <el-table-column label="是否在岗" v-if="template.isOnDuty">
          <template slot-scope="{ row }">{{row.isOnDutyShow?'是':'否'}}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="{ $index}">
            <el-button type="text" @click="editDuty( $index,'prisonWork')">编辑</el-button>
            <el-button type="text" @click="deleteDuty($index)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <table-view noBottom noPage noIndex :tableData="patrolWork">
      <div slot="searchCondition">
        <div class="yn-table-title">巡查记录详情</div>
      </div>

      <template slot="table-column">
        <el-table-column prop="inspectAreaName" v-if="template.inspectAreaId" label="巡查区域" />
        <el-table-column prop="inspectTime" v-if="template.inspectTime" label="巡查时间" />
        <el-table-column prop="inspectMembers" v-if="template.inspectMembers" label="巡查人">
          <template slot-scope="{ row }">
            <span
              v-for="(item,index) in breakinspectMembers(row.inspectMembers)"
              :key="index"
            >{{item.name}}、</span>
          </template>
        </el-table-column>
        <el-table-column prop="inspectLeader" label="巡查领导" v-if="template.inspectLeader">
          <template slot-scope="{ row }">{{JSON.parse(row.inspectLeader).name}}</template>
        </el-table-column>
        <el-table-column prop="abnormalIssue" label="异常情况" v-if="template.abnormalIssue" />
        <el-table-column label="操作">
          <template slot-scope="{ $index}">
            <el-button type="text" @click="editPatrol( $index,'prisonWork')">编辑</el-button>

            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <el-dialog title="编辑内容" class="yn_dialog" center :visible.sync="dutyDataTooggle" width="40%">
      <el-form
        ref="dutyform"
        class="yn_form"
        :rules="rules.dutyData"
        :model="dutyData"
        label-width="100px"
      >
        <el-form-item label="值班人员" prop="dutyPersonId">
          <police-select v-model="dutyData.dutyPersonId"></police-select>
        </el-form-item>

        <el-form-item label="是否在岗" prop=" isOnDuty">
          <el-select v-model="dutyData.isOnDuty" placeholder="请选择">
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDuty">取 消</el-button>
        <el-button type="primary" @click="$checkMessage(duty)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑内容" class="yn_dialog" center :visible.sync="patrolDataTooggle" width="40%">
      <el-form
        ref="patrolform"
        class="yn_form"
        :rules="rules.patrolData"
        :model="patrolData"
        label-width="100px"
      >
        <el-form-item label="巡查人" prop="inspectMembers">
          <police-select v-model="patrolData.inspectMembers" multiple></police-select>
        </el-form-item>
        <el-form-item label="巡查时间" prop="inspectTime">
          <el-date-picker v-model="patrolData.inspectTime" type="date" placeholder />
        </el-form-item>
        <el-form-item label="巡查领导" prop="inspectLeader">
          <police-select v-model="patrolData.inspectLeader"></police-select>
        </el-form-item>

        <el-form-item label="异常情况" prop="abnormalIssue">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="patrolData.abnormalIssue"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePatrol">取 消</el-button>
        <el-button type="primary" @click="$checkMessage(patrol)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import policeSelect from '@/components/police_select/val_id_select'
import tableView from '@/components/table_view'
import { formatDate } from '@/utils/date'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree/'

import {
  listDailyData,
  insertDailyReport,
  getPrisonReportTimes
} from './service'
export default {
  components: { tableView, policeSelect, menuTree },
  data () {
    return {
      tableLoading: false,
      isAllowReport: true,
      queryTime: new Date(),
      dutyDataTooggle: false,
      reportTimes: 0,
      patrolDataTooggle: false,
      dutyIndex: 0,
      patrolIndex: 0,
      dutyEditKey: 'rootWork',
      prisonId: getPrisonId(),
      dutyData: {
        isOnDuty: 1
        // 值班选择
      },
      patrolData: {},
      rootWork: {
        list: []
      },
      prisonWork: {
        list: []
      },
      patrolWork: {
        list: []
      },
      rules: {
        dutyData: {
          dutyPersonId: [
            { required: true, message: '请选择值班人员', trigger: 'change' }
          ]
        },
        patrolData: {
          inspectMembers: [
            { required: true, message: '请选择巡查人员', trigger: 'change' }
          ],
          inspectTime: [
            { required: true, message: '请选择巡查时间', trigger: 'change' }
          ],
          inspectLeader: [
            { required: true, message: '请选择巡查领导', trigger: 'change' }
          ]
        }
      },
      template: {}
    }
  },
  created () {
    if (this.$route.params.prisonId) {
      this.prisonId = this.$route.params.prisonId
    }
  },
  methods: {
    getReportStatus () {
      getPrisonReportTimes({ prisonId: this.prisonId }).then(res => {
        let now = Date.now()
        console.log(now)

        this.reportTimes = res.num
        if (
          res.num === 0 &&
          //   now < res.thre.firstEnd &&
          now > res.thre.firstBegin
        ) {
          this.isAllowReport = false
        } else if (
          res.num === 1 &&
          now > res.thre.lastBegin
          //   &&
          //   now < res.thre.lastEnd
        ) {
          this.isAllowReport = false
        }
      })
    },
    editDuty (index, k) {
      this.dutyEditKey = k
      this.dutyIndex = index
      this.dutyDataTooggle = true
    },
    deleteDuty (index) {
      this.prisonWork.list.splice(index, 1)
    },
    deleteWork (index) {
      this.rootWork.list.splice(index, 1)
    },
    editPatrol (index) {
      this.patrolIndex = index
      this.patrolDataTooggle = true
    },
    closeDuty () {
      this.dutyDataTooggle = false
      this.$refs.dutyform.resetFields()
      this.dutyData = {
        isOnDuty: 1
      }
    },
    duty () {
      let that = this
      this.$refs.dutyform.validate(valid => {
        if (valid) {
          let { dutyIndex, dutyEditKey } = this
          let dutyPersonName = this.dutyData.dutyPersonId.split('_')[1]
          let dutyPersonId = this.dutyData.dutyPersonId.split('_')[0]
          this.$set(this[dutyEditKey].list, dutyIndex, {
            ...this[dutyEditKey].list[dutyIndex],
            ...this.dutyData,
            dutyPersonName,
            dutyPersonId
          })
          setTimeout(() => {
            that.closeDuty()
          })
        } else {
          return false
        }
      })
    },
    closePatrol () {
      this.patrolDataTooggle = false
      this.$refs.patrolform.resetFields()
      this.patrolData = {}
    },
    patrol () {
      let that = this
      this.$refs.patrolform.validate(valid => {
        if (valid) {
          let { patrolIndex, patrolData } = this
          let inspectMembers = this.patrolData.inspectMembers.map(item => {
            let arr = item.split('_')
            return { id: arr[0], name: arr[1] }
          })
          this.$set(this.patrolWork.list, patrolIndex, {
            ...this.patrolWork.list[patrolIndex],
            ...patrolData,
            inspectMembers,
            inspectLeader: {
              id: patrolData.inspectLeader.split('_')[0],
              name: patrolData.inspectLeader.split('_')[1]
            },
            inspectTime: formatDate(patrolData.inspectTime, 'yyyy-MM-dd hh:mm')
          })

          setTimeout(() => {
            that.closePatrol()
          })
        } else {
          return false
        }
      })
    },
    report () {
      this.$confirm(`确认上报?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let formdata = {
            dutyList: [...this.rootWork.list, ...this.prisonWork.list],
            inspectList: this.patrolWork.list,
            prisonId: this.prisonId,
            reportType: this.reportTimes === 0 ? '首次上报' : '末次上报'
          }
          insertDailyReport(formdata).then(res => {
            this.$message({
              type: 'success',
              message: '上报成功'
            })
            this.$router.back()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消上报!'
          })
        })
    },
    breakinspectMembers (v) {
      return JSON.parse(v)
    }
  },

  mounted () {
    this.tableLoading = true
    listDailyData({ prisonId: this.prisonId }).then(
      res => {
        const dutyList = res.dutyList
        let leaderList = []
        let memberList = []
        for (let obj of dutyList) {
          if (obj.dutyType === '总值班') {
            leaderList.push(obj)
          } else {
            memberList.push(obj)
          }
        }
        this.rootWork.list = leaderList
        this.prisonWork.list = memberList
        this.patrolWork.list = res.inspectList
        this.tableLoading = false
        this.template = res.template
      },
      err => {
        this.tableLoading = false
      }
    )
    this.getReportStatus()
  }
}
</script>
<style lang="less" scoped>
.yn-table-title {
  padding: 10px;
  color: #fff;
  background: linear-gradient(to right, #29aaf9, #fff);
  margin-bottom: 1rem;
  width: 15rem;
  border-radius: 2px;
}
</style>
