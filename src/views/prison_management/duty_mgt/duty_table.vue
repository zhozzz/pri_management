<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-28 17:05:28
 * @LastEditTime: 2020-04-03 09:48:26
 * @LastEditors: zhuhao
 -->
<template slot-scope="scope">
  <dept-layout @input="nodeClick" v-model="prisonData">
    <menuTree :menuList="['监狱管理', '值班管理', '监狱系统值班表']">
      <div slot="heade_btn" class="yn_page_btn">
        <div :class="!showTable?'link_btn':'dis_btn'" @click="showTable=!showTable">统计分析</div>
        <div :class="showTable?'link_btn':'dis_btn'" @click="showTable=!showTable">管理</div>
      </div>
      <el-form :inline="true" class="demo-form-inline yn_form">
        <el-row :gutter="10">
          <el-col :span="24" v-if="!showTable">
            <el-form-item label="选择统计时段：">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="dateRange"
                type="daterange"
                placeholder="开始日期"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                :picker-options="{
              disabledDate(date) {
                return date.getTime() > new Date().getTime() - 24 * 1000 * 3600;
              }
            }"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="text" @click="week">本周</el-button>
              <el-button class="yn_btn" type="text" @click="month">本月</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="searchStatice">统计查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="showTable">
            <el-form-item label="部门详情：">
              <el-popover placement="top-start" trigger="click" popper-class="calendar_pop">
                <div :style="{ width: '400px' }">
                  <el-calendar v-model="date"></el-calendar>
                </div>

                <el-button slot="reference" type="primary" icon="el-icon-date" circle></el-button>
              </el-popover>
            </el-form-item>

            <!-- 监狱视角筛选部门 -->
            <el-form-item label="部门类型：" v-if="showTable&&isPrison&&prisonId!=1">
              <el-select class="yn_ipt" v-model="deptGuid" @change="deptChange">
                <el-option
                  v-for="(item,i) in deptOption"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 省局视角筛选部门 -->
            <el-form-item label="部门类型：" v-if="showTable&&prisonId==1">
              <el-select class="yn_ipt" v-model="deptType" @change="searchTable">
                <el-option
                  v-for="(item, i) in deptTypes"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-button
                v-if="showTable && prisonId == 1"
                @click="exportProvin"
                class="yn_btn"
                type="primary"
              >导出</el-button>
              <el-button
                @click="exportPrison"
                v-if="showTable && prisonId != 1"
                class="yn_btn"
                type="primary"
              >导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="10">
        <el-col :span="24">
          <table-view
            :tableData="tableData"
            noIndex
            noBottom
            noPage
            v-loading="loading"
            @sizeChange="searchTable"
            v-if="showTable && prisonId == 1"
          >
            <div slot="searchCondition"></div>
            <template slot="table-column">
              <el-table-column label="单位名称" align="center" prop="prisonName"></el-table-column>
              <el-table-column
                v-if="deptType == -1 || deptType == 0"
                label="值班领导"
                align="center"
                prop="deptName"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  <span v-if="row.departs.length">
                    <!-- {{
                  row.departs[0].leaderCount
                    }}-->
                    <span v-if="row.departs[0].rotas.length">
                      <span v-for="(rota, i) in row.departs[0].rotas" :key="i">
                        {{ rota.shiftName }}:
                        <span v-for="(users, j) in rota" :key="j">
                          <span v-for="(user, k) in users" :key="k">
                            <span v-if="user.userName">
                              {{ user.userName }}
                              <span v-show="users&&k < users.length - 1 ">,</span>
                            </span>
                          </span>
                        </span>
                        <span v-if="i<row.departs[0].rotas.length-1">
                          ;
                          <br />
                        </span>
                      </span>
                    </span>
                    <span v-else>暂无值班领导</span>
                  </span>
                  <span v-else>暂无值班领导</span>
                </template>
              </el-table-column>
              <el-table-column v-if="deptType == -1" label="指挥中心" align="center" prop="deptName">
                <template slot-scope="{ row }">
                  <span v-if="row.departs.length > 1">
                    <!-- {{
                  row.departs[1].prePoliceCount+row.departs[1].preAuxCount+row.departs[1].dutyAuxCount+row.departs[1].dutyPoliceCount
                    }}-->

                    <span v-if="row.departs[1].rotas.length">
                      <span v-for="(rota, i) in row.departs[1].rotas" :key="i">
                        {{ rota.shiftName }}:
                        <span v-for="(users, j) in rota" :key="j">
                          <span v-for="(user, k) in users" :key="k">
                            <span v-if="user.userName">
                              {{ user.userName }}
                              <span v-show="users&&k < users.length - 1 ">,</span>
                            </span>
                          </span>
                        </span>
                        <span v-if="i<row.departs[1].rotas.length-1">
                          ;
                          <br />
                        </span>
                      </span>
                    </span>
                    <span v-else>暂值班人员</span>
                  </span>
                  <span v-else>无指挥中心</span>
                </template>
              </el-table-column>
              <el-table-column v-if="deptType == 2" label="指挥中心" align="center" prop="deptName">
                <template slot-scope="{ row }">
                  <span v-if="row.departs.length > 0">
                    <!-- {{
                  row.departs[0].prePoliceCount+row.departs[0].preAuxCount+row.departs[0].dutyAuxCount+row.departs[0].dutyPoliceCount
                    }}-->
                    <span v-if="row.departs[0].rotas.length">
                      <span v-for="(rota, i) in row.departs[0].rotas" :key="i">
                        {{ rota.shiftName }}:
                        <span v-for="(users, j) in rota" :key="j">
                          <span v-for="(user, k) in users" :key="k">
                            <span v-if="user.userName">
                              {{ user.userName }}
                              <span v-show="users&&k < users.length - 1 ">,</span>
                            </span>
                          </span>
                        </span>
                        <span v-if="i<row.departs[0].rotas.length-1">
                          ;
                          <br />
                        </span>
                      </span>
                    </span>
                    <span v-else>暂值班人员</span>
                  </span>
                  <span v-else>无指挥中心</span>
                </template>
              </el-table-column>
              <el-table-column v-if="deptType == 1" label="科室值班人数" align="center" prop="deptName">
                <template slot-scope="{ row }">
                  <span v-if="row.departs.length > 0">
                    <!-- {{
                  row.departs[0].prePoliceCount+row.departs[0].preAuxCount+row.departs[0].dutyAuxCount+row.departs[0].dutyPoliceCount
                    }}-->
                    <span v-if="row.departs[0].rotas.length">
                      <span v-for="(rota, i) in row.departs[0].rotas" :key="i">
                        {{ rota.shiftName }}:
                        <span v-for="(users, j) in rota" :key="j">
                          <span v-for="(user, k) in users" :key="k">
                            <span v-if="user.userName">
                              {{ user.userName }}
                              <span v-show="users&&k < users.length - 1 ">,</span>
                            </span>
                          </span>
                        </span>
                        <span v-if="i<row.departs[0].rotas.length-1">
                          ;
                          <br />
                        </span>
                      </span>
                    </span>
                    <span v-else>暂值班人员</span>
                  </span>
                  <span v-else>无值班人数</span>
                </template>
              </el-table-column>
              <el-table-column v-if="deptType == 3" label="特警队值班人数" align="center" prop="deptName">
                <template slot-scope="{ row }">
                  <span v-if="row.departs.length > 0">
                    <!-- {{
                  row.departs[0].prePoliceCount+row.departs[0].preAuxCount+row.departs[0].dutyAuxCount+row.departs[0].dutyPoliceCount
                    }}-->
                    <span v-if="row.departs[0].rotas.length">
                      <span v-for="(rota, i) in row.departs[0].rotas" :key="i">
                        {{ rota.shiftName }}:
                        <span v-for="(users, j) in rota" :key="j">
                          <span v-for="(user, k) in users" :key="k">
                            <span v-if="user.userName">
                              {{ user.userName }}
                              <span v-show="users&&k < users.length - 1 ">,</span>
                            </span>
                          </span>
                        </span>
                        <span v-if="i<row.departs[0].rotas.length-1">
                          ;
                          <br />
                        </span>
                      </span>
                    </span>
                    <span v-else>暂值班人员</span>
                  </span>
                  <span v-else>无值班人数</span>
                </template>
              </el-table-column>
              <el-table-column v-if="deptType == 4" label="监区值班人数" align="center" prop="deptName">
                <template slot-scope="{ row }">
                  <span v-if="row.departs.length > 0">
                    <!-- {{
                  row.departs[0].prePoliceCount+row.departs[0].preAuxCount+row.departs[0].dutyAuxCount+row.departs[0].dutyPoliceCount
                    }}-->
                    <span v-if="row.departs[0].rotas.length">
                      <span v-for="(rota, i) in row.departs[0].rotas" :key="i">
                        {{ rota.shiftName }}:
                        <span v-for="(users, j) in rota" :key="j">
                          <span v-for="(user, k) in users" :key="k">
                            <span v-if="user.userName">
                              {{ user.userName }}
                              <span v-show="users&&k < users.length - 1 ">,</span>
                            </span>
                          </span>
                        </span>
                        <span v-if="i<row.departs[0].rotas.length-1">
                          ;
                          <br />
                        </span>
                      </span>
                    </span>
                    <span v-else>暂值班人员</span>
                  </span>
                  <span v-else>无值班人数</span>
                </template>
              </el-table-column>
              <el-table-column v-if="deptType == 5" label="医院值班人数" align="center" prop="deptName">
                <template slot-scope="{ row }">
                  <span v-if="row.departs.length > 0">
                    <span v-if="row.departs[0].rotas.length">
                      <span v-for="(rota, i) in row.departs[0].rotas" :key="i">
                        {{ rota.shiftName }}:
                        <span v-for="(users, j) in rota" :key="j">
                          <span v-for="(user, k) in users" :key="k">
                            <span v-if="user.userName">
                              {{ user.userName }}
                              <span v-show="users&&k < users.length - 1 ">,</span>
                            </span>
                          </span>
                        </span>
                        <span v-if="i<row.departs[0].rotas.length-1">
                          ;
                          <br />
                        </span>
                      </span>
                    </span>
                    <span v-else>暂值班人员</span>
                  </span>
                  <span v-else>无值班人数</span>
                </template>
              </el-table-column>
              <el-table-column label="值班人数" align="center" prop="deptName">
                <template slot-scope="{ row }">
                  <span>
                    {{
                    row.prePoliceCount +
                    row.preAuxCount +
                    row.dutyAuxCount +
                    row.dutyPoliceCount
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="详情" align="center" prop="deptName">
                <template slot-scope="scope">
                  <el-button class="yn_btn" type="primary" @click="showDetail(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </template>
          </table-view>

          <div v-if="showTable && prisonId != 1" v-loading="deptLoading">
            <deptTable
              :deptId="prisonId"
              :deptList="deptList"
              :titleInfos="titleInfos"
              v-if="isPrison"
              :date="date"
              @upData="upData"
            />

            <!--
                 单个部门值班
            -->
            <div class="dept_box" v-else>
              <div class="dept_item">
                <div class="dept_title">{{ deptData.departName }}</div>
                <div class="infos">
                  <div class="info bor_b">
                    值班人员：{{
                    deptData.dutyAuxCount + deptData.dutyPoliceCount
                    }}人
                  </div>
                  <div class="info bor_bl">
                    备勤人员：{{
                    deptData.preAuxCount + deptData.prePoliceCount
                    }}人
                  </div>
                  <div class="info">
                    <div class="users">
                      <div class="userhead">
                        <span class="icon"></span> 警察值班
                      </div>
                      <div v-if="deptData.dutyPoliceList.length>0">
                        <div class="duty" v-for="(rota,k) in deptData.dutyPoliceList" :key="k">
                          <div v-if="rota.users ">
                            <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                              {{user.userName}}
                              <span v-if="l<1&&rota.users.length>2">、</span>
                            </span>
                            <span v-show="rota.users.length>2">等{{rota.users.length}}人</span>
                          </div>
                          <div>{{rota.time}}</div>
                        </div>
                      </div>
                      <div class="duty" v-else>暂无人员配置</div>

                      <div class="userhead marTop">
                        <span class="icon sup"></span> 辅警值班
                      </div>
                      <div v-if="deptData.dutyAuxList.length>0">
                        <div class="duty" v-for="(rota,k) in deptData.dutyAuxList" :key="k">
                          <div v-if="rota.users ">
                            <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                              {{user.userName }}
                              <span v-if="l<1&&rota.users.length>2">、</span>
                            </span>
                            <span v-show="rota.users.length>2">等{{rota.users.length}}人</span>
                          </div>
                          <div>{{rota.time}}</div>
                        </div>
                      </div>
                      <div class="duty" v-else>暂无人员配置</div>
                    </div>
                  </div>
                  <div class="info bor_l">
                    <div class="users">
                      <div class="userhead">
                        <span class="icon"></span> 警察备勤
                      </div>
                      <div v-if="deptData.prePoliceList.length>0">
                        <div class="duty" v-for="(rota,k) in deptData.prePoliceList" :key="k">
                          <div v-if="rota.users ">
                            <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                              {{user.userName }}
                              <span v-if="l<1&&rota.users.length>2">、</span>
                            </span>
                            <span v-show="rota.users.length>2">等{{rota.users.length}}人</span>
                          </div>
                          <div>{{rota.time}}</div>
                        </div>
                      </div>
                      <div class="duty" v-else>暂无人员配置</div>

                      <div class="userhead marTop">
                        <span class="icon sup"></span> 辅警备勤
                      </div>
                      <div v-if="deptData.preAuxList.length>0">
                        <div class="duty" v-for="(rota,k) in deptData.preAuxList" :key="k">
                          <div v-if="rota.users ">
                            <span v-for="(user,l) in rota.users" :key="l" v-show="l<2">
                              {{user.userName }}
                              <span v-if="l<1&&rota.users.length>2">、</span>
                            </span>
                            <span v-show="rota.users.length>2">等{{rota.users.length}}人</span>
                          </div>
                          <div>{{rota.time}}</div>
                        </div>
                      </div>
                      <div class="duty" v-else>暂无人员配置</div>
                    </div>
                  </div>

                  <div class="msg_box msg" v-show="deptData.rotas.length == 0">暂无值班配置</div>
                </div>
              </div>
            </div>
          </div>

          <!--
               
               统计分析 
               
                 
          -->

          <div class="charts_box" v-if="!showTable">
            <div class="yn_charts">
              <h3>每日值班人数统计</h3>
              <bar-chart :dataList="dataList" />
              <line-chart :dataList="lineList" />
            </div>
          </div>
        </el-col>
      </el-row>

      <el-dialog
        class="yn_dialog"
        :visible="editVisible"
        append-to-body
        title="编辑"
        width="90%"
        center
        @close="closeEdit"
      >
        <dutyEdit
          :editForm="editForm"
          :date="date"
          :editIndex="editIndex"
          :isLeader="false"
          :colse="colse"
          @subSuccess="upData"
          :deptId="deptGuId"
        />
        <div slot="footer"></div>
      </el-dialog>

      <el-dialog class="yn_dialog" :visible.sync="showFlag" center title="查看值班" width="90%">
        <el-row>
          <el-col :span="2">
            <span class="yn_title">部门类型：</span>
          </el-col>
          <el-col :span="8">
            <el-select class="yn_ipt" v-model="deptGuid" @change="deptChangeIn">
              <el-option
                v-for="(item, i) in deptOption"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <deptTable
          v-loading="deptLoading"
          :deptId="prisonId"
          :deptList="deptList"
          :titleInfos="titleInfos"
          :date="date"
          @upData="upData"
        />
        <div slot="footer"></div>
      </el-dialog>
    </menuTree>
  </dept-layout>
</template>
<script>
import menuTree from '@/components/menu_tree/'

import deptLayout from './deptLayout/index.vue'
import tableView from '@/components/table_view/'
import barChart from './bar_chart'
import lineChart from './line_chart'
import deptTable from './dept_duty_table'
import { formatDate } from '@/utils/date'
import _globalUrl from '@/utils/global_url'
import dutyEdit from './duty_edit'

import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import {
  getPrisonDutyTable,
  getProvinDutyTable,
  dutyStatistics,
  getDepartCheckRota
} from './server'

export default {
  components: {
    menuTree,
    deptLayout,
    tableView,
    barChart,
    lineChart,
    deptTable,
    dutyEdit
  },
  data() {
    return {
      userDeptId: getDeptId(),
      userprisonId: getPrisonId(),
      prisonId: getPrisonId(),
      userDeptType: getDeptType(),
      date: new Date(),
      dateRange: [
        new Date().getTime() - 24 * 3600 * 1000 * 7,
        new Date() - 24 * 3600 * 1000
      ],
      deptGuid: -1,
      deptType: -1,
      deptOption: [
        { label: '全部', value: -1 },
        { label: '值班领导', value: 0 },
        { label: '指挥中心', value: 2 },
        { label: '科室', value: 1 },
        { label: '监区', value: 3 }
      ],
      deptTypes: [
        { label: '全部', value: -1 },
        { label: '值班领导', value: 0 },
        { label: '指挥中心', value: 2 },
        { label: '科室', value: 1 },
        { label: '特警队', value: 3 },
        // { label: '监区', value: 4 },
        { label: '医院', value: 5 }
      ],
      props: { emitPath: false, checkStrictly: true },
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      showTable: true,
      showFlag: false,
      dataList: {},
      lineList: [],
      deptList: [],
      nochangeList: [],
      titleInfos: {},
      prisonData: {},
      isPrison: true,
      deptData: {
        prePoliceList: [],
        preAuxList: [],
        dutyPoliceList: [],
        dutyAuxList: [],
        rotas: []
      },
      editForm: [],
      editVisible: false,
      deptGuId: '',
      editIndex: null,
      deptLoading: false
    }
  },
  watch: {
    date(val) {
      this.getPrisonDutyTable(this.prisonId)
    },
    showTable(val) {
      this.prisonId = this.userprisonId
      if (val) {
        this.getPrisonDutyTable(this.prisonId)
      } else {
        this.searchStatice()
      }
    }
  },
  created() {
    if (this.prisonId == 1) {
      this.deptGuid = -1
      this.searchTable()
    } else {
      this.getPrisonDutyTable(this.prisonId)
    }
  },
  methods: {
    upData() {
      this.getPrisonDutyTable(this.prisonId)
    },
    openEdit(row, boolean, index) {
      this.editForm = JSON.parse(JSON.stringify(row.rotas))
      this.editVisible = true
      this.deptGuId = row.departId
      this.editIndex = index
    },
    closeEdit() {
      this.editVisible = false
      this.editForm = []
      this.deptGuId = ''
    },
    colse() {
      this.editVisible = false
    },

    nodeClick(val) {
      this.deptList = []
      this.prisonId = val.id
      if (val.id != 1) {
        this.isPrison = val.isPrison
        if (this.isPrison) {
          if (this.showTable) {
            this.getPrisonDutyTable(val.id)
          } else {
            this.searchStatice()
          }
        } else {
          this.getDepartCheckRota(val.id)
        }
      } else {
        this.searchTable()
      }
    },
    week() {
      let now = new Date().getTime() - 24 * 60 * 60 * 1000
      let start = now - 7 * 24 * 60 * 60 * 1000
      this.dateRange = [new Date(start), new Date(now)]
      this.showTable = false
      this.searchStatice()
    },
    month() {
      let now = new Date().getTime() - 24 * 60 * 60 * 1000
      let start = now - 30 * 24 * 60 * 60 * 1000
      this.dateRange = [new Date(start), new Date(now)]
      this.showTable = false
      this.searchStatice()
    },
    deptChangeIn(val) {
      if (val !== -1) {
        let str = this.deptOption.filter(obj => {
          return obj.value == val
        })[0].value
        console.log(this.deptList)

        this.deptList = this.nochangeList.filter(item => {
          return item.orgGroup == str
        })
      } else {
        this.deptList = this.nochangeList.map(item => item)
      }
    },
    deptChange(val) {
      if (this.prisonId == 1) {
        this.searchTable()
      } else {
        if (val !== -1) {
          let str = this.deptOption.filter(obj => {
            return obj.value == val
          })[0].value
          console.log(this.deptList)

          this.deptList = this.nochangeList.filter(item => {
            return item.orgGroup == str
          })
        } else {
          this.deptList = this.nochangeList.map(item => item)
        }
      }
      console.log(this.deptList)
    },
    searchStatice() {
      this.showTable = false
      this.lineList = []
      this.dataList = {
        dateList: [],
        dutyPoliceCount: [],
        dutyAuxCount: [],
        prePoliceCount: [],
        preAuxCount: []
      }
      let str =
        this.prisonId +
        '/' +
        formatDate(new Date(this.dateRange[0]), 'yyyy-MM-dd') +
        '/' +
        formatDate(new Date(this.dateRange[1]), 'yyyy-MM-dd')
      dutyStatistics(str).then(res => {
        if (res) {
          res.map(item => {
            this.lineList.push({
              name: item.date,
              value:
                item.dutyAuxCount +
                item.dutyPoliceCount +
                item.preAuxCount +
                item.prePoliceCount +
                item.leaderCount
            })
            this.dataList.dateList.push(item.date)
            this.dataList.dutyPoliceCount.push(item.dutyPoliceCount)
            this.dataList.dutyAuxCount.push(item.dutyAuxCount)
            this.dataList.preAuxCount.push(item.preAuxCount)
            this.dataList.prePoliceCount.push(item.prePoliceCount)
          })
          console.log(this.dataList)
        }
      })
    },
    searchTable() {
      this.loading = true
      let str =
        this.deptType + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd')
      // this.deptGuid + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd')
      getProvinDutyTable(str).then(res => {
        this.tableData.list = res
        this.loading = false
      })
    },
    showDetail(row) {
      this.prisonId = row.prisonId
      this.deptLoading = true

      if (this.prisonId == 1) {
        this.showFlag = true
      } else {
        this.showFlag = false
      }

      this.getPrisonDutyTable(row.prisonId)
    },
    getPrisonDutyTable(id) {
      this.deptList = []
      let str = id + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd')
      getPrisonDutyTable(str).then(res => {
        if (res) {
          this.deptList = res.departs
          this.nochangeList = res.departs
          this.titleInfos.dutyAuxCount = res.dutyAuxCount
          this.titleInfos.dutyPoliceCount = res.dutyPoliceCount
          this.titleInfos.leaderCount = res.leaderCount
          this.titleInfos.preAuxCount = res.preAuxCount
          this.titleInfos.prePoliceCount = res.prePoliceCount
          this.deptLoading = false
        }
      })
    },
    getDepartCheckRota(id) {
      let str = id + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd') + '/2'

      getDepartCheckRota(str).then(res => {
        if (res) {
          this.deptData.dutyAuxCount = res.dutyAuxCount
          this.deptData.dutyPoliceCount = res.dutyPoliceCount
          this.deptData.preAuxCount = res.preAuxCount
          this.deptData.prePoliceCount = res.prePoliceCount
          this.deptData.departId = res.departId

          if (res.rotas) {
            this.deptData.dutyAuxList = []
            this.deptData.preAuxList = []
            this.deptData.dutyPoliceList = []
            this.deptData.prePoliceList = []

            res.rotas.map(son => {
              //   son.dutyAuxList = []
              //   son.preAuxList = []
              //   son.dutyPoliceList = []
              //   son.prePoliceList = []
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

              //   son.dutyAuxList.push(...dutyAuxList.users)
              //   son.preAuxList.push(...preAuxList.users)
              //   son.dutyPoliceList.push(...dutyPoliceList.users)
              //   son.prePoliceList.push(...prePoliceList.users)
              if (dutyAuxList.users.length) {
                this.deptData.dutyAuxList.push(dutyAuxList)
              }
              if (preAuxList.users.length) {
                this.deptData.preAuxList.push(preAuxList)
              }
              if (dutyPoliceList.users.length) {
                this.deptData.dutyPoliceList.push(dutyPoliceList)
              }
              if (prePoliceList.users.length) {
                this.deptData.prePoliceList.push(prePoliceList)
              }
            })
          }
          this.deptData.rotas = []
          this.deptData.rotas.push(...res.rotas)

          console.log(this.deptData)
        }
      })
    },
    exportProvin() {
      let str =
        this.deptType + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd')
      location.href =
        _globalUrl.businessUrl + '/duty/provincialRotaExport/' + str
    },
    exportPrison() {
      let str =
        this.prisonId + '/' + formatDate(new Date(this.date), 'yyyy-MM-dd')
      location.href = _globalUrl.businessUrl + '/duty/prisonRotaExport/' + str
    }
  }
}
</script>
<style scoped lang="less">
.el-icon-edit-outline {
  color: #2d9fff;
}
.dept_box {
  width: 100%;

  .dept_item {
    margin-bottom: 2rem;
    border: 1px solid rgba(215, 225, 237, 1);
    border-radius: 2px;
    margin-top: 2rem;
  }
  .dept_title {
    width: 100%;
    background: rgba(223, 237, 254, 1);
    padding: 9/14rem 0 1.1rem;
    text-align: center;
    font-size: 1.1rem;
    // border: 1px solid rgba(215, 225, 237, 1);
    .el-icon-edit-outline {
      color: #2d9fff;
    }
  }
  .infos {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    font-size: 1.1rem;
    .info {
      width: 50%;
      box-sizing: border-box;
      padding: 1rem;
      .users {
        width: 100%;
        .marTop {
          margin-top: 2rem;
        }
        .icon {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2d9fff;
        }
        .sup {
          background: #04cce4;
        }
        .duty {
          width: 100%;
          //   display: flex;
          //   justify-content: space-between;
          margin: 1rem 0;
        }
      }
    }

    .msg {
      text-align: center;
      padding: 1rem;
    }
    .msg_box {
      width: 100%;
    }
    .bor_b {
      border-bottom: 1px solid rgba(215, 225, 237, 1);
    }
    .bor_l {
      border-left: 1px solid rgba(215, 225, 237, 1);
    }
    .bor_bl {
      border-bottom: 1px solid rgba(215, 225, 237, 1);
      border-left: 1px solid rgba(215, 225, 237, 1);
    }

    .rota {
      width: 100%;
      display: flex;
      .shiftName {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid rgba(215, 225, 237, 1);
      }
      .users_box {
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        padding: 1rem;
        .users {
          width: 50%;
        }
      }
    }
  }
}
.el-calendar {
  border: none;
  /deep/.el-calendar-table td {
    border: none;
    .el-calendar-day {
      text-align: center;
      &:hover {
        background: #fff;
      }
    }
  }
  /deep/.el-calendar-table td.is-selected {
    background: #fff;
    span {
      background: #2d9fff;
      border-radius: 50%;
      color: #fff;
      height: 22px;
      width: 22px;
      display: inline-block;
    }
  }

  /deep/.el-calendar-table td.is-today {
    position: relative;
    &:after {
      content: '.';
      color: #2d9fff;
      position: absolute;
      bottom: 0;
      font-size: 4rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  /deep/.el-calendar__button-group {
    /deep/.el-button {
      padding: 0.5rem 1rem;
      font-size: 1.4rem;
      border: none;
    }
    /deep/.el-button:hover {
      border-bottom: 1px solid #fff;
      background: transparent;
      border-radius: 0;
    }
  }
}

.technology {
  .infos,
  .yn_title {
    color: #fff;
  }
  .dept_item {
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
  .el-calendar {
    background: transparent;
    /deep/.el-calendar__header {
      border-bottom: 1px solid transparent;
    }
    /deep/.el-calendar-table {
      tr:first-child td {
        border-top: 1px solid #2c82ca;
      }
      .is-selected {
        background: #045295;
        color: #fff;
      }
      .el-calendar-day:hover {
        background: #045295;
      }
      tr td:first-child {
        border-left: 1px solid #2c82ca;
      }
      tr td {
        border-bottom: 1px solid #2c82ca;
        border-right: 1px solid #2c82ca;
      }
    }
  }
  .dept_title {
    background: #2b8bef;
  }
}
</style>
