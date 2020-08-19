<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 14:35:28
 -->

<template slot-scope="scope">
  <!-- 预案库 -->
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理', '监狱动态', '应急预案演练']">
      <tab slot="heade_btn" name="演练管理" :right="true" pathName="exercise_statisic" leftName="演练统计" />
      <table-view
        :tableData="tableData"
        noBottom
        noIndex
        v-loading="tableLoading"
        @selectionchange="selectionchange"
        @sizeChange="getPlanData"
      >
        <div slot="searchCondition">
          <el-form ref="form" inline class="yn_form">
            <el-form-item label="演练时间：">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="date"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                align="right"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="演练事件类型：">
              <el-select v-model="searchData.eventType" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="组织单位：">
              <el-input
                class="yn_ipt"
                maxlength="10"
                v-model="searchData.initiatorName"
                placeholder="请输入单位名称"
              ></el-input>
            </el-form-item>

            <el-form-item label="演练发起类型：">
              <el-select v-model="searchData.taskType" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预期达成情况：">
              <el-select v-model="searchData.effect" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in effectList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class="yn_btn" @click="getPlanData" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>

              <el-button class="yn_btn" v-if="userPrisonId != 1" @click="delPlans">批量删除</el-button>

              <!-- <el-button
              class="yn_btn"
              v-if="$selPurview('release_task_button')&&prisonId==userPrisonId"
              @click="downVisble=true"
              type="primary"
              >下达演练任务</el-button>-->
              <el-button
                class="yn_btn"
                v-if="
                prisonId == userPrisonId &&
                  (userDeptType == '指挥中心' || userPrisonId == 1)
              "
                @click="downVisble = true"
                type="primary"
              >下达演练任务</el-button>
              <el-button
                class="yn_btn"
                v-if="userPrisonId != 1"
                @click="seeVisble = true"
                type="primary"
              >待办演练任务</el-button>
              <el-button
                class="yn_btn"
                v-if="(userPrisonId == prisonId&&isCenter)||userPrisonId==1"
                @click="openPublic"
                type="primary"
              >已下发任务</el-button>
              <el-button
                class="yn_btn"
                v-if="userPrisonId != 1"
                @click="goCreate(null, 0)"
                type="primary"
              >新增演练登记</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column v-if="userPrisonId != 1" type="selection" align="center"></el-table-column>
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column
            v-if="userPrisonId == 1"
            prop="prisonName"
            show-overflow-tooltip
            label="演练单位"
            min-width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="initiatorName"
            label="组织单位"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="drillName"
            label="演练名称"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="taskType"
            :formatter="releaseMatter"
            label="演练发起类型"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            label="演练时间"
            :formatter="dateMatter"
            show-overflow-tooltip
            min-width="200"
            align="center"
          ></el-table-column>
          <el-table-column prop="participation" label="参与人数" width="width" align="center"></el-table-column>
          <el-table-column
            prop="eventType"
            label="演练事件类型"
            :formatter="typeMatter"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="effect"
            :formatter="levelMatter"
            label="演练效果"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="checkType"
            prop="endLine"
            label="演练任务截止时间"
            show-overflow-tooltip
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="checkType"
            prop="completeTime"
            :formatter="finishMatter"
            label="演练任务实际完成时间"
            show-overflow-tooltip
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ifNeedMaterial"
            label="是否需要上报材料"
            show-overflow-tooltip
            width="width"
            align="center"
          >
            <template slot-scope="row">
              {{
              row.ifNeedMaterial ? "是" : "否"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="materialEndLine"
            label="上报材料截止时间"
            show-overflow-tooltip
            :formatter="upMatter"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" min-width="250" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.id !== null">
                <el-button type="text" class="yn_text_btn" @click="seePlan(scope.row)">查看详情</el-button>

                <el-popover placement="right" trigger="click" v-if="scope.row.files.length > 0">
                  <el-table :data="scope.row.files" class="yn_table">
                    <el-table-column property="fileName" label="文件名" width="200" align="center"></el-table-column>
                    <el-table-column
                      property="fileSize"
                      :formatter="formSize"
                      label="大小(KB)"
                      width="100"
                      align="center"
                    ></el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                      <template slot-scope="scope">
                        <el-button
                          class="yn_text_btn"
                          type="text"
                          @click="download(scope.row.id)"
                        >下载</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button
                    slot="reference"
                    :style="{ margin: '0 1rem' }"
                    class="yn_text_btn"
                    type="text"
                  >下载附件</el-button>
                </el-popover>

                <el-button
                  type="text"
                  class="yn_text_btn"
                  v-if="userPrisonId != 1 && scope.row.taskType !== 0"
                  @click="delPlan(scope.row)"
                >删除</el-button>

                <el-button
                  type="text"
                  class="yn_text_btn"
                  v-if="userPrisonId != 1"
                  @click="editPlan(scope.row)"
                >编辑</el-button>
              </div>
              <div v-if="scope.row.id === null">
                <el-button type="text" class="yn_text_btn">暂未完成</el-button>
              </div>
              <div
                v-if="
                scope.row.ifNeedMaterial &&
                  (scope.row.prisonId == userPrisonId ||
                    scope.row.prisonId == userDeptId)
              "
              >
                <el-button type="text" @click="upMaterial(scope.row)" class="yn_text_btn">上传材料</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <el-dialog
        class="yn_dialog"
        :visible.sync="downVisble"
        title="下达演练任务"
        center
        @close="dowmClose"
      >
        <el-form ref="form" label-width="12rem" :model="transmitData" class="yn_form">
          <el-form-item prop="planName" label="演练名称：">
            <el-input class="yn_ipt" v-model="transmitData.taskName" placeholder="请输入演练名称"></el-input>
          </el-form-item>
          <el-form-item prop="eventType" label="事件类型：">
            <el-select v-model="transmitData.eventType" class="select_box yn_ipt" placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.subclassGuid"
                :label="item.value"
                :value="item.subclassGuid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="planName" label="任务截止时间：">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="transmitData.endLine"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd hh:mm:ss"
              :picker-options="pickerOption"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="ifNeedMaterial" label="是否需要上报材料：">
            <el-switch
              v-model="transmitData.ifNeedMaterial"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item prop="planName" v-if="transmitData.ifNeedMaterial" label="上报材料截止时间：">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="transmitData.materialEndLine"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd hh:mm:ss"
              :picker-options="pickerOption"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="eventType" :label="userPrisonId == 1 ? '接受任务监狱：' : '接受任务监区：'">
            <el-select
              v-model="transmitData.prisonIds"
              multiple
              class="select_box yn_ipt"
              placeholder="请选择"
            >
              <el-option
                v-for="item in prisonList"
                :key="item.id"
                :label="item.departName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(subTransmit)">确定</el-button>
          <el-button class="yn_btn" type="primary" @click="downVisble = false">取消</el-button>
        </span>
      </el-dialog>

      <el-dialog
        class="yn_dialog"
        :visible.sync="seeVisble"
        v-if="userPrisonId != 1"
        title="查看演练任务"
        center
        width="70%"
      >
        <table-view
          :tableData="taskTableData"
          noBottom
          noPage
          noSearch
          v-loading="taskTableLoading"
          @sizeChange="getTaskList"
        >
          <template slot="table-column">
            <el-table-column prop="taskName" label="演练名称" width="width" align="center"></el-table-column>
            <el-table-column prop="publisherName" label="演练任务发起单位" width="width" align="center"></el-table-column>
            <el-table-column
              prop="eventType"
              label="事件类型"
              :formatter="typeMatter"
              width="width"
              align="center"
            ></el-table-column>
            <el-table-column prop="endLine" label="任务截止时间" width="width" align="center"></el-table-column>
            <el-table-column prop="ifNeedMaterial" label="是否需要上报材料" width="width" align="center">
              <template slot-scope="scope">
                {{
                scope.row.ifNeedMaterial ? "是" : "否"
                }}
              </template>
            </el-table-column>
            <el-table-column prop="materialEndLine" label="上报材料截止时间" width="width" align="center"></el-table-column>
            <el-table-column label="操作" width="width" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="goCreate(scope.row, 1)">标记已完成</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="seeVisble = false">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog class="yn_dialog" :visible.sync="publicVisble" title="查看下达任务" center width="70%">
        <table-view
          :tableData="publicData"
          noBottom
          noSearch
          v-loading="taskTableLoading"
          @sizeChange="getPublicList"
        >
          <template slot="table-column">
            <el-table-column prop="taskName" label="演练名称" width="width" align="center"></el-table-column>

            <el-table-column
              prop="eventType"
              label="事件类型"
              :formatter="typeMatter"
              width="width"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="endLine"
              label="任务截止时间"
              show-overflow-tooltip
              width="width"
              align="center"
            ></el-table-column>
            <el-table-column prop="ifNeedMaterial" label="是否需要上报材料" width="width" align="center">
              <template slot-scope="scope">
                {{
                scope.row.ifNeedMaterial ? "是" : "否"
                }}
              </template>
            </el-table-column>
            <el-table-column label="已完成部门" width="width" align="center">
              <template slot-scope="scope">
                <el-popover placement="top-start" trigger="hover">
                  <div v-if="scope.row.completedPrisons.length > 0">
                    <span v-for="(item, i) in scope.row.completedPrisons" :key="i">
                      {{ item }}
                      <span v-if="i<scope.row.completedPrisons.length-1">、</span>
                    </span>
                  </div>
                  <div v-else>暂无完成部门</div>
                  <el-button type="text" class="yn_text_btn" slot="reference">
                    {{
                    scope.row.completedPrisons.length
                    }}
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="未完成部门" width="width" align="center">
              <template slot-scope="scope">
                <el-popover placement="top-start" trigger="hover">
                  <div v-if="scope.row.undonePrisons.length > 0">
                    <span v-for="(item, i) in scope.row.undonePrisons" :key="i">
                      {{ item }}
                      <span v-if="i<scope.row.undonePrisons.length-1">、</span>
                    </span>
                  </div>
                  <div v-else>无未完成部门</div>
                  <el-button type="text" class="yn_text_btn" slot="reference">
                    {{
                    scope.row.undonePrisons.length
                    }}
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
          </template>
        </table-view>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="publicVisble = false">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog class="yn_dialog" :visible.sync="detailVisble" title="演练活动详情" center width="70%">
        <el-row class="detail_item">
          <el-col :span="4">参与单位：</el-col>
          <el-col :span="18">
            <div
              v-if="
              detailForm.localDepartsNames.length +
                detailForm.outerDeparts.length ==
                0
            "
            >未登记参与单位</div>
            <div v-for="(item, i) in detailForm.localDepartsNames" :key="i">{{ i + 1 }}、{{ item }}</div>

            <div
              v-for="(obj, j) in detailForm.outerDeparts"
              :key="'local' + j"
            >{{ j + detailForm.localDepartsNames.length + 1 }}、{{ obj }}</div>
          </el-col>
        </el-row>

        <el-row class="detail_item">
          <el-col :span="4">开始时间：</el-col>
          <el-col :span="18">{{ detailForm.startTime }}</el-col>
        </el-row>

        <el-row class="detail_item">
          <el-col :span="4">演练名称：</el-col>
          <el-col :span="18">{{ detailForm.drillName }}</el-col>
        </el-row>
        <el-row class="detail_item">
          <el-col :span="4">组织类型：</el-col>
          <el-col :span="18">
            {{
            detailForm.taskType == 1 ? "自行组织" : "上级下达"
            }}
          </el-col>
        </el-row>
        <el-row class="detail_item">
          <el-col :span="4">活动内容：</el-col>
          <el-col :span="18">{{ detailForm.detail }}</el-col>
        </el-row>
        <el-row class="detail_item">
          <el-col :span="4">活动总结：</el-col>
          <el-col :span="18">{{ detailForm.summary }}</el-col>
        </el-row>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="detailVisble = false">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog class="yn_dialog" :visible.sync="upFlag" title="上传材料" center width="50%">
        <el-row :gutter="10">
          <el-col :span="4">
            <div class="yn_page_title">上传材料：</div>
          </el-col>
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              :action="_global.businessUrl + '/file/upload'"
              multiple
              :on-success="handleSuccess"
              :on-remove="onRemove"
              :before-upload="beforeUpload"
              :file-list="fileList"
            >
              <el-button class="yn_btn" type="primary" v-loading="upLoading">点击上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="subUpDirll" v-loading="upLoading">确定</el-button>
        </span>
      </el-dialog>
    </menuTree>
  </deptLayout>
</template>
<script>
import tableView from '@/components/table_view/'
import deptLayout from './dept_layout.vue'
import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import formatDate from '@/utils/date'
import tab from '@/components/tab/index.vue'
import { pickerOptions } from '@/utils/picker_option_config.js'
import {
  getEventType,
  getPrisonList,
  releaseExercise,
  getExerciseData,
  getTaskList,
  getDrillDetail,
  delExercise,
  bindFiles,
  getPublicList
} from './service.js'
import { Loading } from 'element-ui'
import { downloadFile } from '@/utils/downloadFile.js'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tableView, deptLayout, tab, menuTree },

  data() {
    return {
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      userDeptId: getDeptId(),
      userDeptType: getDeptType(),
      isCenter: getDeptType() == '指挥中心' || getDeptType() == '监狱',
      tableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },
      taskTableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },
      publicData: { list: [], total: 0, pageNum: 1, pageSize: 10 },

      tableLoading: false,
      taskTableLoading: false,
      date: [],
      searchData: {},
      typeList: [],
      levelList: [
        { value: 0, name: '上级下达' },
        { value: 1, name: '自行组织' }
      ],
      effectList: [
        { value: 0, name: '不满足预期' },
        { value: 2, name: '满足预期' },
        { value: 1, name: '基本满足预期' }
      ],
      downVisble: false,
      transmitData: { ifNeedMaterial: false },
      prisonList: [],
      seeVisble: false,
      publicVisble: false,
      delIdList: [],
      detailVisble: false,
      detailForm: { localDepartsNames: [], outerDeparts: [] },

      checkType: false,

      pickerOption: {
        disabledDate: vm => {
          let flag
          let now = new Date().getTime()
          vm.getTime() < now ? (flag = true) : (flag = false)
          return flag
        }
      },
      upDrillId: '',
      upFlag: false,
      upLoading: false,
      fileList: [],
      fileIdList: [],
      deptId: getDeptId(),
      taskDeptId:
        getDeptType() == '监狱' ||
        getDeptType() == '省局' ||
        getDeptType() == '指挥中心'
          ? null
          : getDeptId()
    }
  },
  created() {
    this.searchData = { ...this.searchData, ...this.$route.params }

    if (this.$route.params.openDialog) {
      if (this.userPrisonId !== '1') {
        this.seeVisble = true
      } else {
        // this.searchData.taskType = 0
        this.openPublic()
      }
    }
    if (this.$route.params.prisonId) {
      this.prisonId = this.$route.params.prisonId
    }
    console.log(this.searchData)

    this.getPlanData()
    this.getEventType()
    this.getPrisonList()
    if (this.userPrisonId != 1) {
      this.getTaskList()
    }
  },
  methods: {
    // 获取事件类型
    getEventType() {
      getEventType().then(res => {
        this.typeList = res
      })
    },
    getPublicList() {
      getPublicList(
        this.prisonId +
          '/' +
          this.publicData.pageNum +
          '/' +
          this.publicData.pageSize
      ).then(res => {
        console.log(res)
        this.publicData.list = res.list
        this.publicData.total = res.total
      })
    },
    openPublic() {
      this.publicVisble = true
      this.getPublicList()
    },
    // 监狱列表
    getPrisonList() {
      getPrisonList(this.userPrisonId).then(res => {
        this.prisonList = res
        // console.log(res)
      })
    },
    getTaskList() {
      this.taskTableLoading = true
      getTaskList(this.prisonId + '/' + this.deptId).then(res => {
        this.taskTableData.list = res
        this.taskTableLoading = false
      })
    },
    goCreate(data, type) {
      this.$router.push({ name: 'create_exercise', params: { data, type } })
    },
    // 预案数据
    getPlanData() {
      this.searchData.currentPage = this.tableData.pageNum
      this.searchData.pageSize = this.tableData.pageSize
      this.searchData.prisonId = this.prisonId
      this.searchData.deptId = this.taskDeptId
      this.searchData.organizationId = this.userDeptId
      if (this.searchData.taskType == 0) {
        this.checkType = true
      } else {
        this.checkType = false
      }
      getExerciseData(this.searchData).then(res => {
        this.tableData.list = res.list
        this.tableData.total = res.total
      })
    },
    // 时间参数
    timeChange(data) {
      if (data.length > 0) {
        this.searchData.startTime =
          formatDate(data[0], 'yyyy-MM-dd') + ' 00:00:00'
        this.searchData.endTime =
          formatDate(data[1], 'yyyy-MM-dd') + ' 00:00:00'
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
    },
    // 重置查询参数
    reset() {
      this.tableData.pageNum = 1
      this.tableData.pageSize = 10
      this.tableData.list = []
      this.tableData.total = 0
      this.searchData = {}
      this.date = []
      this.getPlanData()
    },
    // 监狱切换
    nodeClick(val) {
      this.prisonId = val.prisonId
      if (val.isPrison) {
        this.taskDeptId = null
      } else {
        this.taskDeptId = val.id
      }
      this.deptId = val.id

      this.reset()
    },
    // 保存下达
    subTransmit() {
      this.transmitData.publisherId = getPrisonId()
      releaseExercise(this.transmitData).then(res => {
        this.$message.success(res)
        this.downVisble = false
        this.reset()
      })
    },
    // 查看
    seePlan(val) {
      getDrillDetail(val.id).then(res => {
        this.detailVisble = true
        this.detailForm = res
      })
    },
    // 下载
    download(data) {
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      setTimeout(() => {
        loadingInstance.close()
      }, 2000)
      downloadFile(data)

      //   location.href = this._global.businessUrl + '/file/download/' + data
    },
    // 编辑
    editPlan(val) {
      getDrillDetail(val.id).then(res => {
        this.goCreate(res, 2)
      })
    },

    // 删除
    delPlan(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delExercise([data.id]).then(res => {
            this.$message.success(res)
            this.reset()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 多选删除
    selectionchange(val) {
      this.delIdList = []
      val.forEach(item => {
        this.delIdList.push(item.id)
      })
    },
    delPlans() {
      if (this.delIdList.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delExercise(this.delIdList).then(res => {
              this.$message.success(res)
              this.reset()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    upMaterial(val) {
      this.upFlag = true
      this.upDrillId = val.id
    },
    handleSuccess(response, file, fileList) {
      this.fileIdList.push(response.data.fileId)
      this.upLoading = false
    },
    onRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    beforeUpload() {
      this.upLoading = true
    },
    subUpDirll() {
      console.log(this.fileList)
      let str = 'drillId=' + this.upDrillId
      this.fileIdList.map(item => {
        str += '&fileIds=' + item
      })
      bindFiles(str).then(res => {
        console.log(res)
      })
    },
    dowmClose() {
      this.transmitData = { ifNeedMaterial: false }
    },
    // 表格数据格式
    typeMatter(row, column, cellValue, index) {
      let str = ''
      this.typeList.forEach(item => {
        item.subclassGuid == cellValue ? (str = item.value) : ''
      })

      return str
    },
    releaseMatter(row, column, cellValue, index) {
      let str
      cellValue == 1 ? (str = '自行组织') : (str = '上级下达')

      return str
    },
    levelMatter(row, column, cellValue, index) {
      let str
      //   cellValue == 1 ? (str = "自发演练") : (str = "上级下达");
      switch (cellValue) {
        case 0:
          str = '不满足预期'
          break
        case 1:
          str = '基本满足预期'
          break
        case 2:
          str = '满足预期'
          break
      }
      return str
    },
    formSize(row, column, cellValue, index) {
      return (cellValue / 1024).toFixed(2)
    },
    dateMatter(row, column, cellValue, index) {
      if (row.startTime != null && row.endTime != null) {
        return row.startTime + '至' + row.endTime
      } else {
        return '未完成'
      }
    },
    finishMatter(row, column, cellValue, index) {
      let str
      cellValue ? (str = cellValue) : (str = '未完成')
      return str
    },
    upMatter(row, column, cellValue, index) {
      let str
      cellValue ? (str = cellValue) : (str = '无')
      return str
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .el-range-separator {
  width: 10%;
}
/deep/.el-select {
  width: 100%;
}
.detail_item {
  margin: 2rem 0;
  font-size: 1.4rem;
}
.yn_date_picker {
  width: 100%;
}
.technology {
  .detail_item {
    color: #fff;
  }
}
</style>
