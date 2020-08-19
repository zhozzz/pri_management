<!--
 * @Description: 狱局 警察进出查看
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 14:31:05
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-11 09:41:03
 -->

<template>
  <dept-layout v-model="changePrisonId">
    <menuTree :menuList="['监狱管理','指挥中心','巡查督察']">
      <tab
        slot="heade_btn"
        leftName="巡查督察统计"
        :right="true"
        pathName="abnormal_statics"
        name="巡查督察"
      />

      <div>
        <table-view noBottom @sizeChange="getList" :tableData="tableData">
          <div slot="searchCondition">
            <el-form ref="form" class="yn_form" inline>
              <el-form-item label="违规时间：">
                <el-date-picker
                  class="yn_ipt"
                  v-model="searchTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  range-separator="至"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="部门：">
                <el-select
                  :disabled="deptList.length==0"
                  v-model="queryData.deptId"
                  class="select_box yn_ipt"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.departName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="整改状态：">
                <el-select class="yn_ipt" v-model="queryData.state">
                  <el-option
                    v-for="(item,i) in flagList"
                    :key="i"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item label="违规等级：">-->
              <!--<el-select class="yn_ipt" v-model="queryData.grade">-->
              <!--<el-option-->
              <!--v-for="(item,i) in levelList"-->
              <!--:key="i"-->
              <!--:label="item.name"-->
              <!--:value="item.value"-->
              <!--&gt;</el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <el-form-item label="违规类型：">
                <el-cascader
                  :props="{ checkStrictly: true }"
                  class="yn_ipt"
                  v-model="queryData.type"
                  :options="typeList"
                ></el-cascader>

                <el-form-item label="违规区域" prop="violationAreaId">
                  <el-select
                    v-model="queryData.violationAreaId"
                    class="select_box yn_ipt"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in areaList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
                <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
              </el-form-item>

              <el-form-item>
                <el-button
                  class="yn_btn yn_long_btn"
                  v-if="role"
                  type="primary"
                  @click="createVisible=true"
                >新增违规记录</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template slot="table-column">
            <el-table-column align="center" min-width="150" prop="datetime" label="违规时间"></el-table-column>
            <el-table-column align="center" prop="dayTypeName" label="当日类型"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="firstTypeName"
              min-width="100"
              label="违规类型"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="secondTypeName"
              min-width="100"
              label="违规子类型"
            />
            <el-table-column align="center" prop="copName" min-width="120" label="违规单位" />
            <el-table-column align="center" prop="deptName" min-width="80" label="违规部门" />
            <!--<el-table-column align="center" prop="grade" label="违规等级">-->
            <!--<template slot-scope="{row}">{{levelList[row.grade].name}}</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" prop="violationAreaName" label="违规区域" />
            <el-table-column align="center" min-width="150" prop="fixCompleteDatetime" label="整改期限"></el-table-column>
            <el-table-column align="center" prop="state" label="处理情况">
              <template slot-scope="{row}">{{row.state==0?'未通知':row.state==1?'整改中' :'已完成'}}</template>
            </el-table-column>

            <el-table-column min-width="200" align="center" label="操作">
              <template slot-scope="{row}">
                <div class="yn_btn_box_inTable">
                  <el-button
                    v-if="row.isDown==0&&row.prisonId==prisonId"
                    type="text"
                    class="yn_text_btn"
                    @click="openEdit(row,0)"
                  >编辑</el-button>
                  <el-button type="text" class="yn_text_btn" @click="openDetail(row)">详情</el-button>

                  <el-button
                    v-if="row.state==1&&row.copId==prisonId&&role&&row.prisonId==1"
                    type="text"
                    class="yn_text_btn"
                    @click="openReportData(row)"
                  >整改反馈</el-button>

                  <el-button
                    v-if="row.state==1&&row.deptId==userGuid&&row.prisonId!=1"
                    type="text"
                    class="yn_text_btn"
                    @click="openReportData(row)"
                  >整改反馈</el-button>

                  <el-button
                    :style="{'width':'10rem'}"
                    v-if="row.state!=0&&row.copId==prisonId&&row.downTime"
                    type="text"
                    class="yn_text_btn"
                    @click="openNotice(row,1)"
                  >查看整改单</el-button>
                  <el-button
                    v-if="row.informTime&&row.copId==prisonId"
                    type="text"
                    class="yn_text_btn"
                    @click="openNotice(row,2)"
                  >查看通知</el-button>
                  <el-button
                    :style="{'width':'10rem'}"
                    v-if="role&&row.state==2&&row.prisonId==prisonId"
                    type="text"
                    class="yn_text_btn"
                    @click="openCheck(row)"
                  >要求重新整改</el-button>

                  <el-button
                    type="text"
                    class="yn_text_btn"
                    v-if="role&&row.isDown==0"
                    @click="sendToPrison(row)"
                  >{{prisonId==1?'下发到监狱':'下发到部门'}}</el-button>
                </div>
              </template>
            </el-table-column>
          </template>
        </table-view>
        <el-dialog title="整改反馈" :visible.sync="reportToggle" center class="yn_dialog" width="50%">
          <el-form
            ref="insertform"
            :model="insertDatas"
            :rules="rules"
            class="yn_form"
            label-width="10rem"
          >
            <el-form-item label="整改内容" prop="desc">
              <el-input
                v-model="insertDatas.desc"
                type="textarea"
                class="yn_ipt"
                :rows="2"
                placeholder="请输入整改内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <el-button
                :disabled="subLoading"
                v-loading="subLoading"
                type="primary"
                class="yn_btn"
                @click="clickPhoto"
              >选择图片</el-button>

              <input
                class
                ref="photoIpt"
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                v-show="false"
                @change="photoChange"
              />
              <div v-if="photoIds.length>0" class="photoMian">
                <div v-for="(img,i) in photoIds" :key="i" class="photoBox">
                  <el-image
                    class="photo"
                    :src="img.photo"
                    :preview-src-list="photoIds.map(item=>item.photo)"
                  ></el-image>
                  <i class="el-icon-delete" @click="delPhoto(img,i)"></i>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              class="yn_btn"
              :disabled="subLoading"
              v-loading="subLoading"
              @click="insertData"
            >提交整改反馈</el-button>
          </span>
        </el-dialog>

        <el-dialog title="整改审核" :visible.sync="checkFlag" center class="yn_dialog" width="50%">
          <el-form
            ref="checkData"
            :model="checkData"
            :rules="checkRules"
            class="yn_form"
            label-width="10rem"
          >
            <el-form-item label="驳回原因" prop="desc">
              <el-input
                v-model="checkData.desc"
                type="textarea"
                class="yn_ipt"
                :rows="2"
                placeholder="请输入原因"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="yn_btn" @click="inserCheck">提交反馈</el-button>
          </span>
        </el-dialog>
        <reportDetail :detailVisible="detailVisible" :detail="detail" :closeDetail="closeDetail"></reportDetail>

        <addReport @subSuccess="getList" :sendVisible="createVisible" :closeSend="closeSend" />

        <el-dialog
          title="请选择处理方式"
          @close="sendClose"
          :visible.sync="sendVisible"
          center
          class="yn_dialog"
          width="50%"
        >
          <div class="btn_group">
            <el-button
              type="primary"
              class="yn_btn"
              @click="$checkMessage(report)"
            >{{prisonId==1?'通知该监狱':'通知该部门'}}</el-button>

            <el-button
              type="primary"
              class="yn_btn yn_long_btn"
              @click="openEdit(sendObj,2)"
            >下发整改通知单</el-button>

            <!-- 暂不开放 -->
            <!-- <el-button
              type="primary"
              class="yn_btn yn_long_btn"
              @click="openEdit(sendObj,3)"
            >下发隐患通知单</el-button>-->
            <el-button type="primary" class="yn_btn" @click="sendClose">取消</el-button>
          </div>
          <div slot="footer"></div>
        </el-dialog>

        <editReport
          @subSuccess="sucEdit"
          :editParam="editParam"
          :sendVisible="editVisible"
          :closeSend="closeEdit"
          :updateState="updateState"
        />

        <el-dialog
          :title="noticeInfo.prisonName+'指挥中心整改通知单'"
          :visible.sync="noticeVisible"
          center
          class="yn_dialog"
          width="50%"
        >
          <div class="yn_page_title">
            <h3 :style="{'text-align':'center'}">{{noticeInfo.downNum}}</h3>
            <p>{{noticeInfo.prisonId==1?noticeInfo.copName:noticeInfo.deptName}}:</p>
            <p :style="{'text-indent':'1rem','margin-bottom':'1rem'}">经查，发现你工作单位存在如下问题：</p>
            <p>{{noticeInfo.description}}</p>

            <p>请你们尽快采取措施予以解决，并将结果于{{noticeInfo.fixCompleteDatetime}}前上报{{noticeInfo.prisonName}}指挥中心</p>
            <p :style="{'text-align':'right'}">{{noticeInfo.downTime}}</p>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="yn_btn" @click="noticeVisible=false">确定</el-button>
          </span>
        </el-dialog>

        <el-dialog title=" 通知 " :visible.sync="messageVisible" center class="yn_dialog" width="50%">
          <div class="yn_page_title">
            <p>{{noticeInfo.description}}</p>

            <p>请你单位确认违规是否存在，并作出相应处理</p>
            <p :style="{'text-align':'right'}">{{noticeInfo.informTime}}</p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="yn_btn" @click="messageVisible=false">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </menuTree>
  </dept-layout>
</template>
<script>
import tableView from '@/components/table_view'
import { pickerOptions } from '@/utils/picker_option_config'
import departSelect from '@/components/depart_select'
import reportDetail from '@/components/abnormal_report/detail'
import deptLayout from '@/components/deptLayout/index.vue'
import {
  getList,
  insertData,
  getType,
  getPrisonList,
  getDeptList,
  getPatrolList,
  getViolateType,
  editPatrol,
  postRectify,
  selInform
} from './service'
import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import menuTree from '@/components/menu_tree/'
import tab from '@/components/tab/index.vue'
import { formatDate } from '@/utils/date'
import addReport from './add_report'
import editReport from './edit_report'

export default {
  components: {
    tableView,
    departSelect,
    reportDetail,
    deptLayout,
    menuTree,
    tab,
    addReport,
    editReport,
    postRectify
  },
  data() {
    return {
      changePrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      userGuid: getDeptId(),
      userDeptType: getDeptType(),
      bindData: {},
      queryData: {},
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      searchTime: [],
      reportToggle: false,
      insertDatas: {},
      rules: {
        desc: [
          { required: true, message: '请输入整改内容', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '长度在 2 到 1000 个字符',
            trigger: 'blur'
          }
        ],
        datetime: [
          { required: true, message: '请选择整改时间', trigger: 'blur' }
        ]
      },
      checkRules: {
        desc: [
          { required: true, message: '请输入原因', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '长度在 2 到 1000 个字符',
            trigger: 'blur'
          }
        ],
        state: [{ required: true, message: '请输入整改内容', trigger: 'blur' }]
      },

      flagList: [
        { name: '未通知', value: 0 },
        // { name: '已整改', value: 1 },
        { name: '整改中', value: 1 },
        { name: '已完成', value: 2 }
      ],
      levelList: [
        { name: '较低', value: 0 },
        { name: '低', value: 1 },
        { name: '中', value: 2 },
        { name: '较高', value: 3 },
        { name: '高', value: 4 }
      ],
      typeList: [],
      areaList: [],
      role: false,
      checkFlag: false,
      checkData: {},
      recordFlag: false,
      checkListData: {
        pageNum: 1,
        pageSize: 100,
        total: null,
        list: []
      },
      createVisible: false,
      createData: {},
      prisonList: [],
      deptList: [],
      timeTypeList: [
        { name: '三日', value: 0 },
        { name: '一周', value: 1 },
        { name: '一月', value: 2 },
        { name: '一季', value: 3 }
      ],
      photoIds: [],
      sendVisible: false,
      sendObj: {},
      editVisible: false,
      editParam: {},
      updateState: 0,
      noticeInfo: {},
      noticeVisible: false,
      messageVisible: false,
      detailVisible: false,
      detail: {},
      subLoading: false,
      safetyFlag: false,
      safetyForm: {},
      satefyRules: {
        datetime: [
          { required: true, message: '请选择整改时间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  methods: {
    query() {
      if (this.searchTime) {
        this.queryData.beginDate = this.searchTime[0]
        this.queryData.endDate = this.searchTime[1]
      } else {
        this.queryData.beginDate = ''
        this.queryData.endDate = ''
      }
      this.getList()
    },
    reset() {
      this.searchTime = []
      this.queryData = {}
      this.getList()
    },
    clickPhoto() {
      this.$refs.photoIpt.click()
    },
    delPhoto(item, i) {
      this.photoIds.splice(i, 1)
      this.subLoading = true

      this.axios
        .delete(this._global.businessUrl + '/file/delete/' + item.id)
        .then(res => {
          this.subLoading = false
          this.$message.success(res)
        })
    },
    photoChange() {
      let that = this
      let file = this.$refs.photoIpt.files[0]
      var reader = new FileReader()
      if (file) {
        that.subLoading = true
        reader.readAsDataURL(file)
        reader.onload = function() {
          let fd = new FormData()
          fd.append('file', file)
          that.axios
            .post(that._global.businessUrl + '/file/upload', fd)
            .then(res => {
              console.log(res)
              that.subLoading = false
              that.photoIds.push({
                name: res.fileName,
                id: res.fileId,
                photo: reader.result
              })
            })
        }
      }
    },
    getList() {
      let { queryData, changePrisonId } = this
      let { pageSize } = this.tableData
      let currentPage = this.tableData.pageNum
      let isProvince = this.prisonId == 1 ? 1 : 0
      let firstTypeId = this.queryData.type ? this.queryData.type[0] : ''
      let secondTypeId =
        this.queryData.type && this.queryData.type.length > 0
          ? this.queryData.type[1]
          : ''

      getPatrolList({
        ...queryData,
        currentPage,
        pageSize,
        isProvince,
        firstTypeId,
        secondTypeId,
        loginPrisonId: changePrisonId
      }).then(res => {
        this.tableData.list = res.rows
        this.tableData.total = res.total

        this.sendVisible = false
      })
    },
    insertData() {
      this.$refs.insertform.validate(valid => {
        if (valid) {
          this.$confirm(`确认提交整改反馈?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              console.log(this.insertDatas)
              this.insertDatas.images = this.photoIds.map(item => {
                return item.id
              })
              this.insertDatas.images = this.insertDatas.images.toString('')
              postRectify(this.insertDatas).then(res => {
                this.getList()
                this.reportToggle = false
                this.insertDatas = {}
                this.$message.success('提交成功')
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '取消整改反馈!'
              })
            })
        } else {
          return false
        }
      })
    },
    openReportData({ id, state }) {
      this.reportToggle = true
      this.insertDatas.relateId = id
      this.insertDatas.state = 2
      this.photoIds = []
      console.log(this.insertDatas)
    },
    getType() {
      this.areaList = []
      this.typeList = []
      getViolateType().then(res => {
        this.typeList = res
      })
      getType('violateArea').then(res => {
        this.areaList.push(...res)
      })
    },
    getDeptList() {
      this.deptList = []
      getDeptList(this.changePrisonId).then(res => {
        this.$set(this.queryData, 'deptId', null)
        this.deptList = res.list
      })
    },
    openNotice(val, i) {
      selInform(val.id).then(res => {
        console.log(res)
        this.noticeInfo = res
        if (i == 1) {
          this.noticeVisible = true
        } else {
          this.messageVisible = true
        }
      })
    },
    openCheck(val) {
      this.checkFlag = true
      this.checkData.relateId = val.id
      this.checkData.state = 1
    },
    openDetail(val) {
      this.detail = JSON.parse(JSON.stringify(val))
      this.detailVisible = true
    },
    inserCheck() {
      console.log(this.checkData)
      this.$refs.checkData.validate(valid => {
        if (valid) {
          this.$confirm(`确认提交整改审核?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              postRectify(this.checkData).then(res => {
                this.getList()
                this.checkFlag = false
                this.checkData = {}
                this.$message.success('提交成功')
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '取消整改反馈!'
              })
            })
        } else {
          return false
        }
      })
    },

    closeSend() {
      this.createVisible = false
    },
    closeDetail() {
      this.detailVisible = false
    },
    sendToPrison(row) {
      this.sendVisible = true
      this.sendObj = JSON.parse(JSON.stringify(row))
    },
    sendClose() {
      this.sendObj = {}
      this.sendVisible = false
    },
    closeEdit() {
      this.editVisible = false
    },
    openEdit(row, i) {
      this.editParam = JSON.parse(JSON.stringify(row))
      this.editVisible = true
      this.updateState = i
    },
    report() {
      editPatrol({
        id: this.sendObj.id,
        updateState: 1,
        prisonId: this.prisonId,
        deptId: this.sendObj.deptId,
        copId: this.sendObj.copId,
        timeType: this.sendObj.timeType
      }).then(res => {
        this.$message.success('通知成功')

        this.sendVisible = false

        this.getList()
      })
    },
    openSafety() {
      this.editParam = JSON.parse(JSON.stringify(this.sendObj))
      this.editVisible = true
      this.updateState = 3
    },
    sucEdit() {
      this.getList()
      this.updateState = 0
    }
  },
  mounted() {
    if (this.$route.params.state !== undefined) {
      this.queryData.state = this.$route.params.state
    }
    this.getList()
    this.getType()
    this.getDeptList()

    let roles = JSON.parse(localStorage.getItem('user')).roles
    roles.map(item => {
      item.roleEnName == 'province_admin' ? (this.role = true) : ''
    })
    JSON.parse(localStorage.getItem('user')).deptType == '指挥中心'
      ? (this.role = true)
      : ''
  },
  watch: {
    changePrisonId() {
      this.getList()
      this.getDeptList()
    }
  }
}
</script>
<style lang="less" scoped>
.technology {
  .el-textarea.is-disabled /deep/.el-textarea__inner {
    background: rgba(10, 10, 10, 0.5);
    color: #d1d3d3;
    border: 1px solid #1471bd;
  }
}
.btn_group {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.photoMian {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.photoBox {
  display: flex;
  font-size: 2rem;
  color: red;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    cursor: pointer;
  }
}
.photo {
  width: 10rem;
  height: 10rem;
  margin: 1rem;
}
</style>
