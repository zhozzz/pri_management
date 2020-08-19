<!--
 * @Description: 重点罪犯管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-03 10:05:18
 * @todo:查询未整合入组织架构id
 -->
<template>
  <menuTree :menuList="['监狱管理','指挥中心','一日工作流程']">
    <tab slot="heade_btn" leftName="一日工作流程图" :left="true" pathName="workflow_mgt" name="工作流程管理" />
    <el-form class="yn_form" inline>
      <el-form-item label="选择日期">
        <el-date-picker
          class="yn_ipt"
          v-model="date"
          :clearable="false"
          type="date"
          placeholder="选择日期时间"
          @change="dateChange"
          :picker-options="{
              disabledDate(date){
                return  new Date(date).getTime()>new Date().getTime()
              }
          }"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button class="yn_btn yesterday_btn" @click="dateLess" type="primary">前一天</el-button>
        <el-button
          class="yn_btn nextday_btn"
          :disabled="new Date(
            formatDate(new Date(date), 'yyyy-MM-dd 00:00:00')
            ).getTime() >=
            new Date(formatDate(new Date(), 'yyyy-MM-dd 00:00:00')).getTime()"
          @click="dateAdd"
          type="primary"
        >后一天</el-button>
      </el-form-item>
      <el-form-item label>
        <el-button
          v-if="unFinishData.list.length>0"
          class="yn_btn yn_long_btn"
          @click="showUnfinishFlag=true"
          type="primary"
        >查看未办结事项</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      class="yn_dialog"
      append-to-body
      :visible.sync="showUnfinishFlag"
      title="查看未办结事项"
      center
      width="70%"
    >
      <table-view :tableData="unFinishData" v-loading="loadingFlag" noBottom noPage noSearch>
        <template slot="table-column">
          <el-table-column align="center" prop="startTime" label="开始时间">
            <template slot-scope="{row}">
              <span>{{row.endTime?row.startTime+'-'+row.endTime:row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="detail" label="工作事项" />
          <el-table-column align="center" prop="require" label="工作要求" />
          <el-table-column align="center" prop="personnel" label="待办人员" />
          <el-table-column align="center" prop="level" :formatter="formtype" label="等级" />
          <el-table-column align="center" prop="prop" label="操作">
            <template slot-scope="scope">
              <div class="yn_btn_box_inTable">
                <el-button type="text" class="yn_text_btn" v-if="scope.row.ifShiftCompleted">已办结</el-button>
                <el-button type="text" class="yn_text_btn" v-else @click="openWork(scope.row)">工作办结</el-button>

                <el-button
                  type="text"
                  class="del_btn yn_text_btn"
                  @click="$checkMessage(()=>del(scope.row)) "
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <span slot="footer"></span>
    </el-dialog>

    <el-row :gutter="10">
      <el-col :span="18">
        <div class="moudel_box" v-loading="loadingFlag">
          <div class="titleBox">当日工作流程时间轴</div>
          <div v-if="workList.length==0" class="titleBox">暂无工作事项配置</div>
          <div class="timeLine_box">
            <el-card shadow="hover">
              <div class="circle"></div>
              <div class="time">时间轴</div>
              <div class="items">事项内容</div>
              <div class="items">工作要求</div>
              <div class="items">事项等级</div>
              <div class="items">重复类型</div>
              <div class="items"></div>
            </el-card>
          </div>
          <div class="timeLine_box" v-for="(item,i) in workList" :key="i">
            <el-card shadow="hover">
              <div class="circle"></div>

              <div class="time">{{item.startTime}}{{item.endTime?'-'+item.endTime:''}}</div>

              <div class="items">{{item.detail}}</div>

              <div class="items">{{item.require}}</div>

              <div class="items">{{formtype(item,item,item.level)}}</div>

              <div class="items">{{item.repeat?item.repeat:'长期'}}</div>
              <div class="items" v-if="item.isDuty">
                <el-button class="yn_btn" v-if="item.ifShiftCompleted" type="success">已交接</el-button>
                <el-button
                  class="yn_btn"
                  :disabled="new Date(date).getTime()<new Date(formatDate(new Date(),'yyyy-MM-dd ')+'00:00:00').getTime()"
                  v-else
                  type="primary"
                  @click="openShift(item,i)"
                >交接班</el-button>
              </div>
              <div class="items" v-else>
                <el-button class="yn_btn" disabled v-if="item.state==1" type="success">已办结</el-button>
                <el-button
                  class="yn_btn"
                  v-else
                  type="primary"
                  :disabled="new Date(date).getTime()<new Date(formatDate(new Date(),'yyyy-MM-dd ')+'00:00:00').getTime()"
                  @click="openWork(item)"
                >办结</el-button>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="record_table_div" v-loading="deptLoading">
          <div class="userInfo">部门: {{deptName}}</div>
          <div class="userInfo">
            部门领导:
            <span v-if="leaders.length==0">无</span>

            <span v-for="(item,i) in leaders" :key="i">
              <span
                v-for="(user,j) in item.users"
                :key="j"
                class="userName"
              >{{user.userName}}({{user.workPosition}},{{user.phoneNumber}})</span>
              ({{item.time}})
              <span v-if="i<leaders.length-1">;</span>
            </span>
          </div>
          <div class="userInfo">
            值班警察:
            <span v-if="dutyPoliceList.length==0">无</span>

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
          <div class="userInfo">
            警察备勤:
            <span v-if="prePoliceList.length==0">无</span>

            <span v-for="(rota,i) in prePoliceList" :key="i">
              <span v-if="rota.users.length">
                <span
                  @click="showUser(rota.users)"
                  class="userName"
                  v-for="(user,l) in rota.users"
                  :key="l"
                  v-show="l<2"
                >
                  {{user.userName}}
                  <span v-if="l<1&&l<rota.users.length-1">、</span>
                </span>
                等{{rota.users.length}}人
                ({{rota.time}})
              </span>
              <span v-if="i<prePoliceList.length-1">;</span>
            </span>
          </div>
          <div class="userInfo">
            辅警值班:
            <span v-if="preAuxList.length==0">无</span>
            <span v-for="(rota,i) in preAuxList" :key="i">
              <span v-if="rota.users.length">
                <span
                  @click="showUser(rota.users)"
                  v-for="(user,l) in rota.users"
                  :key="l"
                  v-show="l<2"
                  class="userName"
                >
                  {{user.userName}}
                  <span v-if="l<1&&l<rota.users.length-1">、</span>
                </span>
                等{{rota.users.length}}人
                ({{rota.time}})
              </span>
              <span v-if="i<preAuxList.length-1">;</span>
            </span>
          </div>
          <div class="userInfo">
            辅警备勤:
            <span v-if="dutyAuxList.length==0">无</span>
            <span v-for="(rota,i) in dutyAuxList" :key="i">
              <span v-if="rota.users.length">
                <span
                  @click="showUser(rota.users)"
                  class="userName"
                  v-for="(user,l) in rota.users"
                  :key="l"
                  v-show="l<2"
                >
                  {{user.userName}}
                  <span v-if="l<1&&l<rota.users.length-1">、</span>
                </span>
                等{{rota.users.length}}人
                ({{rota.time}})
              </span>
              <span v-if="i<dutyAuxList.length-1">;</span>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      class="yn_dialog changeBox"
      center
      title="工作办结"
      :visible.sync="workVisbale"
      width="50%"
    >
      <el-form
        :model="workform"
        label-width="8rem"
        label-position="right"
        :rules="rules"
        class="yn_form"
        ref="workform"
      >
        <el-form-item label="办结人" prop="recordPerson">
          <el-input class="yn_ipt" v-model="workform.recordPerson"></el-input>
        </el-form-item>
        <el-form-item label="完成内容" prop="detail">
          <el-input class="yn_ipt" type="textarea" v-model="workform.detail"></el-input>
        </el-form-item>
        <el-form-item label="办结时间">
          <el-radio v-model="workform.timeType" label="1">时间段</el-radio>
          <el-radio v-model="workform.timeType" label="2">时间点</el-radio>
        </el-form-item>
        <el-form-item v-show="workform.timeType==2" label=" " prop="startTime">
          <el-time-picker
            class="yn_ipt"
            :clearable="false"
            v-model="workform.startTime"
            placeholder="任意时间点"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>

        <el-form-item v-show="workform.timeType==1" label=" " prop="timeRange">
          <el-time-picker
            class="yn_ipt"
            is-range
            :clearable="false"
            v-model="workform.timeRange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="submitFinish">保存</el-button>
        <el-button class="yn_btn" @click="workVisbale = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="yn_dialog changeBox"
      center
      title="交接班"
      :visible.sync="shiftVisible"
      width="50%"
    >
      <div class="yn_page_title">
        今日已完成事项:
        <span v-if="beforeFinishList.length==0">暂无</span>
      </div>
      <table-view
        v-if="beforeFinishList.length>0"
        :tableData="{list:beforeFinishList}"
        noBottom
        noPage
        noSearch
        noIndex
        max-height="20rem"
      >
        <template slot="table-column">
          <el-table-column label="时间" align="center" prop="startTime">
            <template slot-scope="{row}">
              <span>{{row.endTime?row.startTime+'-'+row.endTime:row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="事项内容" align="center" prop="detail" />
          <el-table-column align="center" prop="recordPerson" label="办结人员" />
        </template>
      </table-view>

      <div class="yn_page_title">
        当前未完成事项:
        <span v-if="unfinishList.length==0">暂无</span>
      </div>

      <table-view
        v-if="unfinishList.length>0"
        :tableData="{list:unfinishList}"
        noBottom
        noPage
        noSearch
        noIndex
        max-height="20rem"
      >
        <template slot="table-column">
          <el-table-column label="时间" align="center" prop="startTime">
            <template slot-scope="{row}">
              <span>{{row.endTime?row.startTime+'-'+row.endTime:row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="事项内容" align="center" prop="detail" />
          <el-table-column align="center" prop="require" label="工作要求" />
        </template>
      </table-view>

      <el-form
        :model="shiftform"
        label-width="8rem"
        label-position="right"
        :rules="rules"
        class="yn_form"
        ref="shiftform"
      >
        <el-form-item label="交班人员" prop="recordPerson">
          <el-input class="yn_ipt" v-model="shiftform.recordPerson"></el-input>
        </el-form-item>
        <el-form-item label="接班人员" prop="recordPerson">
          <el-input class="yn_ipt" v-model="shiftform.recordPerson"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="detail">
          <el-input class="yn_ipt" type="textarea" v-model="shiftform.detail"></el-input>
        </el-form-item>

        <!-- 暂时注释 -->
        <!-- <el-form-item label="办结时间">
          <el-radio v-model="shiftform.timeType" label="1">时间段</el-radio>
          <el-radio v-model="shiftform.timeType" label="2">时间点</el-radio>
        </el-form-item>
        <el-form-item label=" " prop="startTime">
          <el-time-picker
            v-show="shiftform.timeType==2"
            class="yn_ipt"
            :clearable="false"
            v-model="shiftform.startTime"
            placeholder="任意时间点"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>

        <el-form-item label=" " prop="timeRange">
          <el-time-picker
            v-show="shiftform.timeType==1"
            class="yn_ipt"
            is-range
            :clearable="false"
            v-model="shiftform.timeRange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>-->

        <!-- <el-form-item label="遗留事项">
          <el-button class="yn_btn" type="primary" @click="addLefts">新增遗留事项</el-button>
        </el-form-item>-->

        <!-- <div v-for="(item,i) in shiftform.lefts" :key="i">
          <el-form-item label="指定办结人" prop="recordPerson">
            <el-input class="yn_ipt" v-model="item.recordPerson"></el-input>
          </el-form-item>
          <el-form-item label="遗留事项" prop="detail">
            <el-input class="yn_ipt" type="textarea" v-model="item.detail"></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-radio v-model="item.timeType" label="1">时间段</el-radio>
            <el-radio v-model="item.timeType" label="2">时间点</el-radio>
          </el-form-item>
          <el-form-item label=" " v-show="item.timeType==2">
            <el-time-picker
              class="yn_ipt"
              :clearable="false"
              v-model="item.startTime"
              placeholder="任意时间点"
              value-format="HH:mm:ss"
            ></el-time-picker>
          </el-form-item>

          <el-form-item label=" " v-show="item.timeType==1">
            <el-time-picker
              class="yn_ipt"
              is-range
              :clearable="false"
              v-model="item.timeRange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="HH:mm:ss"
            ></el-time-picker>
          </el-form-item>
          <el-form-item label=" ">
            <el-button size="mini" type="danger" @click="delLefts(i)">删除</el-button>
          </el-form-item>
        </div>-->
      </el-form>

      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="submitShift">保存</el-button>
        <el-button class="yn_btn" @click="shiftVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog class="yn_dialog" append-to-body :visible.sync="showFlag" title="查看成员" center>
      <tableView noPage noBottom noSearch noIndex :tableData="{list:memberList}">
        <template slot="table-column">
          <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
          <el-table-column prop="policeNumber" align="center" label="警号"></el-table-column>
          <el-table-column prop="workPosition" align="center" label="职务"></el-table-column>
          <el-table-column prop="phoneNumber" align="center" label="联系电话"></el-table-column>
        </template>
      </tableView>
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="showFlag=false">确定</el-button>
      </span>
    </el-dialog>
  </menuTree>
</template>

<script>
import tableView from '@/components/table_view/'
import menuTree from '@/components/menu_tree/'
import { expnoraml, Isname, isIDCard } from '@/utils/form_valid.js'
import { MessageBox, Message } from 'element-ui'
import { getPrisonId, getDeptId, getDeptType, getDeptName } from '@/utils'
import tab from '@/components/tab/index.vue'
import createWork from './create_work/create_work'
import formatDate from '@/utils/date'
import { getDayWork, finish, deleteUndo, getDeptRota } from './server.js'

let today = new Date()

export default {
  components: { tableView, tab, menuTree },
  data() {
    return {
      date: today, // 时间
      nowTime: '',
      loadingFlag: true,
      deptLoading: false,
      prisonId: getPrisonId(),
      deptId: getDeptId(),
      deptName: getDeptName(),
      workList: [],
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 50
      },
      unFinishData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 50
      },
      rules: {
        workProject: [
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入工作事项', trigger: 'blur' }
        ],
        // startTime: [
        //   { required: true, message: '请选择开始时间', trigger: 'blur' }
        // ],
        recordPerson: [{ required: true, message: '请输入', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入', trigger: 'blur' }],
        // timeRange: [{ required: true, message: '请输入', trigger: 'blur' }],
        workRequire: [
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入工作要求', trigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请选择工作类型', trigger: 'blur' }
        ],
        workRank: [
          { required: true, message: '请选择工作等级', trigger: 'blur' }
        ],
        toDo: [{ validator: expnoraml(''), trigger: 'blur' }],
        attentions: [{ validator: expnoraml(''), trigger: 'blur' }]
      },
      showWork: true,
      workVisbale: false,
      shiftVisible: false,
      workform: { timeType: '1' },
      shiftform: { timeType: '1', lefts: [] },
      rankoptions: [
        { label: '低', value: 1 },
        { label: '中', value: 2 },
        { label: '高', value: 3 }
      ],
      unfinishList: [],
      beforeFinishList: [],
      dutyAuxList: [],
      preAuxList: [],
      dutyPoliceList: [],
      prePoliceList: [],
      leaders: [],
      memberList: [],
      showFlag: false,
      typeNum: 3,
      showUnfinishFlag: false
    }
  },
  created() {
    let type = getDeptType()

    switch (type) {
      case '指挥中心':
        this.typeNum = 2
        break
      case '值班领导':
        this.typeNum = 0
        break
      case '科室':
        this.typeNum = 1
        break
      default:
        this.typeNum = 3
        break
    }
    this.getAllList()

    let hour = today.getHours()
    if (hour < 10) {
      hour = '0' + hour
    }
    let min = today.getMinutes()
    if (min < 10) {
      min = '0' + min
    }
    this.nowTime = hour + ':' + min
  },
  methods: {
    showUser(users) {
      this.showFlag = true
      this.memberList = users
    },
    // 时间变化
    dateChange(val) {
      console.log(val)

      this.date = new Date(this.date)
      this.getAllList()
    },
    dateAdd() {
      this.date = this.date.getTime() + 24 * 60 * 60 * 1000

      this.date = new Date(this.date)
      this.getAllList()
    },
    dateLess() {
      this.date = this.date.getTime() - 24 * 60 * 60 * 1000
      this.date = new Date(this.date)
      this.getAllList()
    },
    // 获取事项等级
    getDeptRota() {
      this.deptLoading = true
      let str =
        this.deptId + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd') + '/2'

      getDeptRota(str).then(res => {
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
    getAllList() {
      this.getDeptRota()
      this.workList = []
      this.loadingFlag = true
      let str =
        this.deptId + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd')
      getDayWork(str).then(res => {
        this.loadingFlag = false

        this.workList = [...res.repeatUndos, ...res.todayTemporaties]
        res.undosFromShift.map(item => {
          item.isDuty = true
          this.workList.push(item)
        })
        this.unFinishData.list = res.leftUndos
        this.workList.sort(function(a, b) {
          return (
            new Date('1970/01/01 ' + a.startTime).getTime() -
            new Date('1970/01/01 ' + b.startTime).getTime()
          )
        })
        console.log(this.workList)
      })
    },
    del(row) {
      let str = row.id + '/' + this.deptId
      deleteUndo(str).then(res => {
        console.log(res)
        this.$message.success(res)
        this.getAllList()
      })
    },
    openWork(row) {
      console.log(row)
      this.workVisbale = true
      this.workform.id = row.id
      this.workform.deptId = this.deptId
      this.workform.timeType = '1'
    },
    openShift(row, i) {
      this.shiftVisible = true
      this.shiftform.id = row.id
      this.shiftform.deptId = this.deptId
      this.shiftform.timeType = '1'
      this.shiftform.lefts = []

      let beforeList = []

      this.unfinishList = []
      this.beforeFinishList = []
      this.workList.map((item, j) => {
        if (j < i) {
          beforeList.push(item)
        }
      })
      console.log(beforeList)
      beforeList.map(item => {
        if (item.ifShiftCompleted) {
          this.beforeFinishList.push(item)
        } else {
          this.unfinishList.push(item)
        }
      })
    },
    addLefts() {
      this.shiftform.lefts.push({
        deptId: this.deptId,
        repeatType: ['非重复'],
        timeType: '1'
      })
    },
    delLefts(i) {
      this.shiftform.lefts.splice(i, 1)
    },
    formtype(row, column, cellValue, index) {
      let name = ''
      this.rankoptions.forEach(item => {
        item.value == cellValue ? (name = item.label) : ''
      })

      return name
    },
    submitFinish() {
      this.$refs['workform'].validate(valid => {
        if (valid) {
          //时间填写校验
          //   if (this.workform.timeType == 1) {
          //     if (!this.workform.timeRange) {
          //       this.$message.error('请完整填写')
          //       return false
          //     } else {
          //       this.workform.startTime = this.workform.timeRange[0]
          //       this.workform.endTime = this.workform.timeRange[1]
          //     }
          //   } else {
          //     this.workform.endTime = ''
          //     if (this.workform.startTime == '') {
          //       this.$message.error('请完整填写')
          //       return false
          //     }
          //   }
          finish(this.workform).then(res => {
            this.$message.success(res)
            this.workVisbale = false
            this.workform = { timeType: '1' }
            this.getAllList()
          })
        } else {
          this.$message.error('请完整填写')
          return false
        }
      })
    },
    submitShift() {
      this.$refs['shiftform'].validate(valid => {
        if (valid) {
          let flag = true

          if (this.shiftform.timeType == 1) {
            if (!this.shiftform.timeRange) {
              this.$message.error('请完整填写')
              flag = false
            } else {
              this.shiftform.startTime = this.shiftform.timeRange[0]
              this.shiftform.endTime = this.shiftform.timeRange[1]
            }
          } else {
            this.shiftform.endTime = ''
            if (this.shiftform.startTime == '') {
              this.$message.error('请完整填写')
              flag = false
            }
          }
          this.shiftform.lefts.map(item => {
            if (item.recordPerson && item.detail) {
            } else {
              this.$message.error('请完整填写')
              flag = false
            }
          })
          if (flag) {
            finish(this.shiftform).then(res => {
              console.log(res)
              this.$message.success(res)
              this.shiftVisible = false
              this.shiftform = { timeType: '1', lefts: [] }
              this.getAllList()
            })
          }
        } else {
          this.$message.error('请完整填写')
          return false
        }
      })
    }
  },
  watch: {
    // 监听日期变化，获取时间选择器可选的最小时间
    date: function(val) {
      if (this.date.getTime() > today.getTime()) {
        this.showWork = false
      } else {
        this.showWork = true
      }
      if (this.date.getTime() == today.getTime()) {
        let hour = today.getHours()
        if (hour < 10) {
          hour = '0' + hour
        }
        let min = today.getMinutes()
        if (min < 10) {
          min = '0' + min
        }
        this.nowTime = hour + ':' + min
        this.dutyChangeFlag = true
      } else {
        this.nowTime = ''
        this.dutyChangeFlag = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.record_table_div {
  background: rgba(251, 252, 255, 1);
  border: 1px solid rgba(205, 221, 237, 1);
  border-radius: 2px;
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
}
.items {
  font-size: 1.1rem;
}
.yn_page_title {
  font-weight: 600;
}
.userInfo {
  //   width: 50%;
  width: 100%;
  font-size: 1.1rem;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  .userName {
    cursor: pointer;
    color: #2b8bef;
  }
}
.standard {
  .timer_title {
    font-size: 1.1rem;
  }
  .date_pikcer {
    margin: 0 0.5rem;
    /deep/.el-input__prefix {
      left: 85%;
    }
  }
  .del_btn {
    color: red;
  }
  .btn_group {
    margin: 1rem 0;
  }
  .moudel_box {
    width: 100%;
    border: 1px solid #cddded;
    box-sizing: border-box;
    padding: 2rem;
    border-radius: 4px;
    // margin: 1rem 0;
    background: #fbfcff;
  }
  .titleBox {
    box-sizing: border-box;
    font-size: 1.4rem;
    margin: 2rem 0;
  }
  .timeLine_box {
    width: 100%;
    /deep/.el-card {
      border-radius: 6px;
      background: rgba(245, 251, 255, 1);
      margin: 2rem 0;
      position: relative;
      overflow: visible;
      border: 1px solid rgba(83, 186, 255, 1);
      .el-card__body {
        display: flex;
        align-items: center;
        padding: 0;
      }
      .circle {
        width: 1rem;
        height: 1rem;
        border: 3px solid #2b8bef;
        border-radius: 50%;
        position: absolute;
        left: -0.5rem;
        background: #fff;
      }
      .time {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2b8bef;
        padding: 2rem 0;
        border-right: 1px solid #eee;
        width: 100%/6;
        text-align: center;
      }
      .items {
        margin: 0 2rem;
        box-sizing: border-box;
        padding-left: 0.5rem;
        // border-left: 3px solid #2b8bef;
        width: 100%/6;
        text-align: center;
      }
    }
  }
  .changeBox {
    /deep/ .el-row {
      line-height: 3rem;
    }
    .title {
      width: 100%;
      text-align: left;
    }
  }
  .users {
    margin: 0;
  }
  .timer {
    width: 100%;
  }
  .lang_btn {
    width: 9rem;
  }
}
.technology {
  .record_table_div {
    background: transparent;
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
  .timer_title {
    font-size: 1.4rem;
  }
  .date_pikcer {
    margin: 0 0.5rem;
    /deep/.el-input__prefix {
      left: 85%;
    }
  }
  .del_btn {
    color: red;
  }
  .btn_group {
    margin: 1rem 0;
  }
  .moudel_box {
    width: 100%;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    box-sizing: border-box;
    padding: 2rem;
    // margin: 1rem 0;
    background: transparent;
  }
  .titleBox {
    box-sizing: border-box;
    font-size: 1.4rem;
    margin: 1rem 0;
    color: #fff;
  }
  .timeLine_box {
    width: 100%;
    /deep/.el-card {
      border-radius: 6px;
      background: #071f49;
      margin: 2rem 0;
      position: relative;
      overflow: visible;
      border: 1px solid #7cdafd;
      box-shadow: 5px 0 5px -5px #8fdcf9 inset, 0 5px 5px -5px #8fdcf9 inset,
        0 -5px 5px -5px #8fdcf9 inset, -5px 0 5px -5px #8fdcf9 inset;
      .el-card__body {
        display: flex;
        align-items: center;
        padding: 0;
      }
      .circle {
        width: 1rem;
        height: 1rem;
        border: 3px solid #2b8bef;
        border-radius: 50%;
        position: absolute;
        left: -0.5rem;
        background: #fff;
      }
      .time {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2b8bef;
        padding: 2rem 0;
        border-right: 1px solid #7cdafd;
        text-align: center;
        width: 100%/6;
      }
      .items {
        margin: 0 2rem;
        box-sizing: border-box;
        padding-left: 0.5rem;
        color: #fff;
        text-align: center;
        width: 100%/6;
      }
    }
  }
  .dialog_box {
    margin-top: 1.6rem;
  }
  .changeBox {
    /deep/ .el-row {
      line-height: 3rem;
    }
    .title {
      width: 100%;
      text-align: left;
      color: #fff;
    }
  }
  .users {
    margin: 0;
  }
  .timer {
    width: 100%;
  }
  .lang_btn {
    width: 9rem;
  }
}
</style>
