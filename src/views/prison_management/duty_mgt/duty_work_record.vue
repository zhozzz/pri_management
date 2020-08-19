<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-28 17:05:28
 * @LastEditTime: 2020-04-01 09:48:08
 * @LastEditors: zhuhao
 -->
<template slot-scope="scope">
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','值班管理','值班工作记录']">
      <tab slot="heade_btn" name="值班工作记录" :right="true" pathName="leader_record" leftName="领导巡查记录" />

      <!-- <span class="yn_page_title">值班工作记录</span> -->
      <el-form :inline="true" class="demo-form-inline yn_form">
        <el-form-item label="选择日期">
          <el-date-picker class="yn_ipt" v-model="searchData.date" placeholder :clearable="false"></el-date-picker>
          <el-button class="yn_btn" @click="preDay" type="primary">前一天</el-button>
          <el-button class="yn_btn" @click="today" type="primary">今天</el-button>
          <el-button
            class="yn_btn"
            :disabled="new Date(searchData.date).getTime()>=new Date().getTime()-24*60*59*1000"
            @click="afterDay"
            type="primary"
          >后一天</el-button>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select class="yn_ipt" v-model="searchData.state" placeholder="请选择">
            <el-option v-for="(item,i) in typeList" :key="i" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <!-- <el-cascader
            :options="deptOption"
            class="yn_ipt"
            v-model="deptGuid"
            @change="deptChange"
            :filterable="true"
            :props="props"
            :show-all-levels="false"
          ></el-cascader>-->
          <el-select
            :disabled="deptList.length==0"
            v-model="searchData.deptId"
            class="select_box yn_ipt"
            placeholder="请选择"
            @change="deptChange"
            filterable
          >
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.departName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门关键字">
          <el-input placeholder="请输入部门名关键字" v-model="searchData.keyWord" class="yn_ipt"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="yn_btn" type="primary" @click="searchDuty">查询</el-button>
          <el-button class="yn_btn" type="primary" @click="resetSearch">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            class="yn_btn"
            type="primary"
            v-if="deptId==userDeptId"
            @click="addFlag=true"
            :style="{'width':'10rem'}"
          >新增工作记录</el-button>
        </el-form-item>
      </el-form>

      <div class="record_table_div" v-loading="deptLoading">
        <div
          class="userInfo"
          v-if="!leaders.length&&!dutyPoliceList.length&&!prePoliceList.length&&!dutyAuxList.length&&!dutyAuxList.length"
        >暂无值班配置</div>
        <div class="userInfo" v-if="leaders.length">
          部门领导:
          <span v-for="(item,i) in leaders" :key="i">
            <span
              v-for="(user,j) in item.users"
              :key="j"
            >{{user.userName}}({{user.workPosition}},{{user.phoneNumber}})</span>
            ({{item.time}})
          </span>
        </div>
        <div class="userInfo" v-if="dutyPoliceList.length">
          值班警察:
          <span v-for="(rota,i) in dutyPoliceList" :key="i">
            <span v-if="rota.users.length" @click="showUser(rota.users)">
              <span class="userName" v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                {{user.userName}}
                <span v-if="l<1&&l<rota.users.length-1">、</span>
              </span>
              等{{rota.users.length}}人
              ({{rota.time}})
            </span>
            <span v-if="i<dutyPoliceList.length-1">;</span>
          </span>
        </div>
        <div class="userInfo" v-if="prePoliceList.length">
          警察备勤:
          <span v-for="(rota,i) in prePoliceList" :key="i">
            <span v-if="rota.users.length" @click="showUser(rota.users)">
              <span class="userName" v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                {{user.userName}}
                <span v-if="l<1&&l<rota.users.length-1">、</span>
              </span>
              等{{rota.users.length}}人
              ({{rota.time}})
            </span>
            <span v-if="i<dutyPoliceList.length-1">;</span>
          </span>
        </div>
        <div class="userInfo" v-if="dutyAuxList.length">
          辅警值班:
          <span v-for="(rota,i) in dutyAuxList" :key="i">
            <span v-if="rota.users.length" @click="showUser(rota.users)">
              <span class="userName" v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                {{user.userName}}
                <span v-if="l<1&&l<rota.users.length-1">、</span>
              </span>
              等{{rota.users.length}}人
              ({{rota.time}})
            </span>
            <span v-if="i<dutyPoliceList.length-1">;</span>
          </span>
          <span v-if="dutyPoliceList.length==0">暂无人员</span>
        </div>
        <div class="userInfo" v-if="preAuxList.length">
          辅警备勤:
          <span v-for="(rota,i) in preAuxList" :key="i">
            <span v-if="rota.users.length" @click="showUser(rota.users)">
              <span class="userName" v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                {{user.userName}}
                <span v-if="l<1&&l<rota.users.length-1">、</span>
              </span>
              等{{rota.users.length}}人
              ({{rota.time}})
            </span>
            <span v-if="i<dutyPoliceList.length-1">;</span>
          </span>
        </div>
      </div>
      <table-view
        :tableData="tableData"
        noBottom
        noSearch
        v-loading="loading"
        @sizeChange="searchDuty"
      >
        <template slot="table-column">
          <el-table-column label="时间" align="center" prop="completeDate"></el-table-column>
          <el-table-column label="事项详情" align="center" prop="detail"></el-table-column>
          <el-table-column label="记录人" align="center" prop="recordPerson"></el-table-column>
          <el-table-column label="状态" align="center" prop="state">
            <template slot-scope="{row}">
              <div>{{row.state==1?'已完成':'未完成'}}</div>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <el-dialog class="yn_dialog" :visible.sync="showFlag" title="查看成员" center>
        <table-view noPage noBottom noSearch noIndex :tableData="{list:memberList}">
          <template slot="table-column">
            <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
            <el-table-column prop="policeNumber" align="center" label="警号"></el-table-column>
            <el-table-column prop="workPosition" align="center" label="职务"></el-table-column>
            <el-table-column prop="phoneNumber" align="center" label="联系电话"></el-table-column>
          </template>
        </table-view>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="showFlag=false">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog class="yn_dialog" :visible.sync="addFlag" title="新增工作记录" center>
        <el-form
          ref="addForm"
          label-width="10rem"
          class="yn_form"
          :rules="addrules"
          :model="addForm"
        >
          <el-form-item prop="detail" label="记录详情：">
            <el-input class="yn_ipt" v-model="addForm.detail" type="textarea" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="recordPerson" label="记录人：">
            <el-input class="yn_ipt" v-model="addForm.recordPerson" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="planName" label="时间：">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-radio v-model="timeType" :label="1">时间点</el-radio>
              </el-col>
              <el-col :span="11">
                <el-radio v-model="timeType" :label="2">时间段</el-radio>
              </el-col>
              <el-col :span="24" v-show="timeType==2">
                <el-time-picker
                  v-model="addForm.timeRange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="yn_ipt"
                  is-range
                  :clearable="false"
                  placeholder="选择时间"
                ></el-time-picker>
              </el-col>
              <el-col :span="24" v-show="timeType==1">
                <el-time-picker
                  v-model="addForm.startTime"
                  :clearable="false"
                  class="yn_ipt"
                  placeholder="选择时间"
                ></el-time-picker>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="realTimeCreate">确定</el-button>
          <el-button class="yn_btn" type="primary" @click="addFlag=false">取消</el-button>
        </span>
      </el-dialog>
    </menuTree>
  </deptLayout>
</template>
<script>
import { formatDate } from '../../../utils/date'
import menuTree from '@/components/menu_tree/'
import tab from '@/components/tab/index.vue'
import deptLayout from '@/components/deptLayout/index.vue'
import tableView from '@/components/table_view/'
import { getPrisonId, getDeptId } from '@/utils'
import {
  getDepartCheckRota,
  getDeptList,
  getRecordList,
  realTimeCreate
} from './server'

export default {
  components: { menuTree, tableView, tab, deptLayout },
  name: 'Duty_work_record',
  data() {
    return {
      deptId: getDeptId(),
      userDeptId: getDeptId(),
      userPrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      selectedTime: new Date(),
      loading: false,
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      searchData: {
        date: ''
      },
      typeList: [
        { name: '全部', value: '' },
        { name: '未办结', value: 1 },
        { name: '已办结', value: 0 }
      ],
      deptList: [],
      props: { emitPath: false, checkStrictly: true },
      showFlag: false,
      memberList: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      addFlag: false,
      addForm: {},
      timeType: 1,
      dutyAuxList: [],
      preAuxList: [],
      dutyPoliceList: [],
      prePoliceList: [],
      leaders: [],
      memberList: [],
      showFlag: false,
      addrules: {
        detail: [{ required: true, message: '请输入', trigger: 'blur' }],
        recordPerson: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.$set(
      this.searchData,
      'date',
      formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
    )

    this.searchData.deptId = this.userDeptId
    this.getDeptRota()
    this.getDeptList()
    this.searchDuty()
  },

  methods: {
    nodeClick(val) {
      console.log(val)
      this.deptId = val.id
      this.prisonId = val.id
      this.getDeptRota()
      this.getDeptList()
      this.tableData.pageSize = 10
      this.tableData.pageNum = 1

      this.searchDuty()
    },
    getDeptList() {
      this.deptList = []
      getDeptList(this.prisonId).then(res => {
        this.$set(this.searchData, 'deptId', '')
        this.deptList = res.list
      })
    },
    resetSearch() {
      this.searchData = {}
      //   this.searchData.date = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')

      this.$set(
        this.searchData,
        'date',
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      )
      this.searchData.deptId = ''
      this.searchDuty()
    },
    searchDuty() {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.pageSize = this.tableData.pageSize
      params.currentPage = this.tableData.pageNum
      if (!params.deptId) {
        params.deptId = this.deptId
      }
      params.date = formatDate(
        new Date(this.searchData.date),
        'yyyy-MM-dd hh:mm:ss'
      )
      getRecordList(params).then(res => {
        if (res) {
          this.tableData.list = res.list
          this.tableData.total = res.total
        }
      })
    },
    today() {
      //   this.searchData.date = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      this.$set(
        this.searchData,
        'date',
        formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      )
    },
    preDay() {
      //   this.searchData.date = formatDate(
      //     new Date(new Date(this.searchData.date).getTime() - 24 * 3600 * 1000),
      //     'yyyy-MM-dd hh:mm:ss'
      //   )
      this.$set(
        this.searchData,
        'date',
        formatDate(
          new Date(new Date(this.searchData.date).getTime() - 24 * 3600 * 1000),
          'yyyy-MM-dd hh:mm:ss'
        )
      )
    },
    afterDay() {
      //   this.searchData.date = formatDate(
      //     new Date(new Date(this.searchData.date).getTime() + 24 * 3600 * 1000),
      //     'yyyy-MM-dd hh:mm:ss'
      //   )
      this.$set(
        this.searchData,
        'date',
        formatDate(
          new Date(new Date(this.searchData.date).getTime() + 24 * 3600 * 1000),
          'yyyy-MM-dd hh:mm:ss'
        )
      )
    },
    deptChange(val) {
      console.log(val)
      this.deptId = val
      this.tableData.pageSize = 10
      this.tableData.pageNum = 1
      this.searchDuty()
      this.getDeptRota()
    },
    showUser(row) {
      this.showFlag = true
      this.memberList = row
    },
    getDeptRota() {
      this.deptLoading = true
      let str =
        this.deptId +
        '/' +
        formatDate(new Date(this.selectedTime), 'yyyy-MM-dd') +
        '/2'
      getDepartCheckRota(str).then(res => {
        this.deptLoading = false

        if (res.rotas) {
          this.dutyAuxList = []
          this.preAuxList = []
          this.dutyPoliceList = []
          this.prePoliceList = []
          this.leaders = []
          res.rotas.map(son => {
            let dutyAuxList = {
              users: [],
              time: son.startTime + '-' + son.endTime
            }
            let preAuxList = {
              users: [],
              time: son.startTime + '-' + son.endTime
            }
            let dutyPoliceList = {
              users: [],
              time: son.startTime + '-' + son.endTime
            }
            let prePoliceList = {
              users: [],
              time: son.startTime + '-' + son.endTime
            }
            let leaderList = {
              users: [],
              time: son.startTime + '-' + son.endTime
            }
            son.users.map(user => {
              switch (user.type) {
                case 0:
                  leaderList.users.push(user)
                  break
                case 1:
                  dutyPoliceList.users.push(user)
                  break
                case 2:
                  prePoliceList.users.push(user)
                  break
                case 3:
                  dutyAuxList.users.push(user)
                  break
                case 4:
                  preAuxList.users.push(user)
                  break
              }
            })
            this.dutyAuxList.push(dutyAuxList)
            this.preAuxList.push(preAuxList)
            this.dutyPoliceList.push(dutyPoliceList)
            this.prePoliceList.push(prePoliceList)
            if (leaderList.users.length > 0) {
              this.leaders.push(leaderList)
            }
          })
          console.log(this.leaders)
        }
      })
    },
    createClose() {
      this.addForm = {}
      this.$refs['addForm'].clearValidate()
    },
    realTimeCreate() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.addForm))
          params.deptId = this.userDeptId
          console.log(params)

          if (this.timeType == 2) {
            if (!params.timeRange) {
              this.$message.error('请完整填写')
              return false
            } else {
              params.startTime = formatDate(
                new Date(params.timeRange[0]),
                'hh:mm:ss'
              )
              params.endTime = formatDate(
                new Date(params.timeRange[1]),
                'hh:mm:ss'
              )
            }
          } else {
            params.endTime = ''
            if (!params.startTime) {
              this.$message.error('请完整填写')
              return false
            }
            params.startTime = formatDate(
              new Date(params.startTime),
              'hh:mm:ss'
            )
          }
          realTimeCreate(params).then(res => {
            console.log(res)
            this.addFlag = false
            this.$message.success(res)
            this.resetSearch()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang='less'>
.record_timeline_div,
.record_table_div,
.records {
  background: rgba(251, 252, 255, 1);
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  padding: 2rem;
}
.userInfo {
  font-size: 1.4rem;
  text-align: center;
  margin: 1rem 0;
  .userName {
    cursor: pointer;
    color: #2b8bef;
  }
}
.record_table_div {
  margin: 2rem 0;
}
.record_paging_div {
  height: 50px;
  margin: 2rem 0;
}
.record_box {
  box-sizing: border-box;
  background: rgba(251, 252, 255, 1);
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  padding: 2rem;
  margin: 2rem 0;
  .yn_ipt {
    margin: 1rem 0;
  }
}

.el-divider--vertical {
  display: inline-block;
  width: 3px;
  height: 1em;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
  background: rgba(43, 139, 239, 1);
}
.timeline_pose {
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background: #2b8bef;
  margin-top: 5px;
}
.technology {
  .record_table_div,
  .record_timeline_div,
  .record_box,
  .records {
    background: transparent;
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
  .contant_box {
    .title {
      color: #fff;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
  .record_timeline_div .el-card {
    border-radius: 6px;
    background: #071f49;
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 5px 0 5px -5px #8fdcf9 inset, 0 5px 5px -5px #8fdcf9 inset,
      0 -5px 5px -5px #8fdcf9 inset, -5px 0 5px -5px #8fdcf9 inset;
  }
}
</style>
