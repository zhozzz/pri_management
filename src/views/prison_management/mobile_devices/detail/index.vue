<!--
 * @Description: 4G设备管理 详情页面
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-27 10:58:46
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:33:15
 -->

<template>
  <menuTree :menuList="['监狱管理','技防管理','4G移动设备管理']">
    <table-view
      noBottom
      @sizeChange="getMobileDeviceManagementDetail"
      v-loading="tableLoading"
      :tableData="tableData"
    >
      <template slot="searchCondition">
        <el-form ref="form" inline class="yn_form" label-width="80px">
          <el-form-item label="警察">
            <police-select v-model="formData.receiveId" />
          </el-form-item>

          <el-form-item label="部门">
            <depart-select v-model="formData.receiveDepartmentId" />
          </el-form-item>

          <el-form-item label="登记人">
            <police-select v-model="formData.createUser" />
          </el-form-item>
          <el-form-item label="登记时间">
            <el-date-picker
              class="yn_ipt"
              v-model="formData.searchRegisterDate"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
            <el-button class="yn_btn" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="dialogFlag=true">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="backPage">返回</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table-column">
        <el-table-column align="center" prop="deviceName" label="设备名称" />
        <el-table-column align="center" prop="deviceCode" label="设备编号" />
        <el-table-column align="center" prop="deviceTypeName" label="设备类型" />
        <el-table-column align="center" prop="deviceStateName" label="设备状态" />
        <el-table-column align="center" prop="createDate" label="录入时间">
          <template slot-scope="{row}">{{formatDate(row.createDate)}}</template>
        </el-table-column>
        <el-table-column align="center" prop="receiveDepartmentName" label="领用部门" />
        <el-table-column align="center" label="警察">
          <template slot-scope="{row}">
            <police-detail
              v-if="row.receiveId"
              :police="{policeId:row.receiveId,policeName:row.receiveUser}"
            ></police-detail>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="repairOrderId" label="工单编号" />
        <el-table-column align="center" label="操作" v-if="btnPermissions" min-width="200">
          <template slot-scope="{row}">
            <el-button
              type="text"
              class="yn_text_btn"
              @click="handleTakeToggle(row)"
              v-if="showTake(row.deviceState)"
            >领用</el-button>
            <el-button type="text" class="yn_text_btn" @click="showHistory(row)">查看记录</el-button>
            <el-button type="text" class="yn_text_btn" @click="editDevice(row)">编辑</el-button>
            <el-button
              type="text"
              class="yn_text_btn"
              @click="back(row)"
              v-if="showBack(row.deviceState)"
            >归还</el-button>
            <el-button
              class="yn_text_btn"
              type="text"
              @click="handleServiceToggle(row)"
              v-if="showService(row.deviceState)"
            >故障报修</el-button>
            <el-button
              class="yn_text_btn"
              type="text"
              @click="handleDelete(row)"
              v-if="showDelete(row.deviceState)"
              style="color: #E34268;"
            >删除</el-button>
            <el-button
              class="yn_text_btn"
              type="text"
              @click="scrap(row)"
              v-if="showScrap(row.deviceState)"
            >报废</el-button>
            <el-button
              class="yn_text_btn"
              type="text"
              @click="repair(row)"
              v-if="showScrap(row.deviceState)"
            >已修复</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <el-dialog title="领用" class="yn_dialog" center :visible.sync="takeToggle" width="500px">
      <el-form
        ref="takeform"
        class="yn_form"
        :rules="rules.takeData"
        :model="takeData"
        label-width="100px"
      >
        <el-form-item label="设备名称">{{takeData.deviceName}}</el-form-item>
        <el-form-item label="设备编号">{{takeData.deviceCode}}</el-form-item>
        <el-form-item label="设备类型">{{takeData.deviceTypeName}}</el-form-item>
        <el-form-item label="领用部门" prop="receiveDepartmentId">
          <depart-select class="yn_ipt" v-model="takeData.receiveDepartmentId" />
        </el-form-item>
        <el-form-item label="领用警员" prop="receiveId">
          <depart-police-select
            class="yn_ipt"
            v-model="takeData.receiveId"
            :disabled="!takeData.receiveDepartmentId"
            :departId="takeData.receiveDepartmentId"
          />
        </el-form-item>
        <el-form-item label="备注" prop="receiveComment">
          <el-input
            class="yn_ipt"
            v-model="takeData.receiveComment"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" type="primary" @click="take">确 定</el-button>
        <el-button class="yn_btn" @click="closeTake">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="维修" class="yn_dialog" center :visible.sync="serviceToggle" width="500px">
      <el-form
        ref="serviceform"
        :rules="rules.serviceData"
        :model="serviceData"
        label-width="100px"
        class="yn_form"
      >
        <!-- <el-form-item label="维修编号" prop="repairOrderId">
          <el-input class="yn_ipt" v-model="serviceData.repairOrderId" placeholder="请输入维修编号" />
        </el-form-item>-->
        <el-form-item label="设备名称">{{serviceData.deviceName}}</el-form-item>
        <el-form-item label="设备编号">{{serviceData.deviceCode}}</el-form-item>
        <el-form-item label="设备类型">{{serviceData.deviceTypeName}}</el-form-item>
        <!-- <el-form-item label="领用部门">
          {{serviceData.receiveDepartmentName}}
        </el-form-item>
        <el-form-item label="领用警员">
          {{serviceData.receiveUser}}
        </el-form-item>-->
        <el-form-item label="故障描述" prop="repairDescribe">
          <el-input
            class="yn_ipt"
            v-model="serviceData.repairDescribe"
            type="textarea"
            :rows="2"
            placeholder="请输入故障描述"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" type="primary" @click="service">确 定</el-button>
        <el-button class="yn_btn" @click="closeService">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增"
      class="yn_dialog"
      @close="()=>{insertForm={}}"
      center
      :visible.sync="dialogFlag"
      width="50%"
    >
      <el-form ref="addform" class="yn_form" :model="insertForm" label-width="10rem">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input class="yn_ipt" v-model="insertForm.deviceCode" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(insertDeviceDetail)">确 定</el-button>
        <el-button class="yn_btn" @click="dialogFlag=false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑"
      class="yn_dialog"
      @close="()=>{editForm={}}"
      center
      :visible.sync="editFlag"
      width="50%"
    >
      <el-form ref="addform" class="yn_form" :model="editForm" label-width="10rem">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input class="yn_ipt" v-model="editForm.deviceCode" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(editDeviceDetail)">确 定</el-button>
        <el-button class="yn_btn" @click="editFlag=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="查看记录"
      class="yn_dialog"
      @close="()=>{historyData={}}"
      center
      :visible.sync="historyVisible"
      width="50%"
    >
      <el-form ref="addform" class="yn_form" :model="historyData" label-width="10rem">
        <el-form-item label="设备编号" prop="deviceCode">{{historyData.deviceCode}}</el-form-item>
        <el-form-item label="设备类型" prop="deviceCode">{{historyData.deviceTypeName}}</el-form-item>
        <el-form-item label="设备名称" prop="deviceCode">{{historyData.deviceName}}</el-form-item>
        <el-form-item label="设备状态" prop="deviceCode">{{historyData.deviceStateName}}</el-form-item>
      </el-form>

      <table-view
        noBottom
        noSearch
        noIndex
        height="20rem"
        @sizeChange="mobileDeviceLog"
        :tableData="HIStable"
      >
        <template slot="table-column">
          <el-table-column align="center" prop="deviceName" label="设备名称" />
          <el-table-column align="center" prop="deviceCode" label="设备编号" />
          <el-table-column align="center" prop="deviceHandle" label="操作记录" />
          <el-table-column align="center" prop="logDate" width="200" label="操作时间" />
        </template>
      </table-view>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="historyVisible=false">确定</el-button>
      </span>
    </el-dialog>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import policeSelect from '@/components/police_select'
import departPoliceSelect from '@/components/depart_police_select'
import policeDetail from '@/components/police_detail'
import departSelect from '@/components/depart_select'
import deviceTypeSelect from '@/components/device_type_select'
import { expnoraml } from '@/utils/form_valid'
import formatDate from '@/utils/date.js'
import { getPrisonId, getDeptId, getUserId } from '@/utils'

import {
  getMobileDeviceManagementDetail,
  updDeviceInfo,
  insertDeviceDetail,
  editDeviceDetail,
  mobileDeviceLog
} from './service'
import menuTree from '@/components/menu_tree/'
import permissions from '@/utils/permission.js'
export default {
  components: {
    tableView,
    policeSelect,
    departPoliceSelect,
    departSelect,
    deviceTypeSelect,
    policeDetail,
    menuTree
  },
  data() {
    return {
      btnPermissions: permissions('mobile_devices_summary_button'),
      tableLoading: false,
      takeToggle: false, // 领用
      serviceToggle: false, // 维修
      deviceTypeId: '',
      deviceId: '',
      deviceName: '',
      formData: {
        // 检索v-model data
      },
      searchData: {
        // 检索使用 data
      },
      takeData: {
        // 领用
      },
      serviceData: {
        // 维修
      },
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      HIStable: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      rules: {
        takeData: {
          receiveDepartmentId: [
            { required: true, message: '请选择领用部门', trigger: 'blur' }
          ],
          receiveId: [
            { required: true, message: '请选择领用警员', trigger: 'blur' }
          ]
        },
        serviceData: {
          repairOrderId: [
            { required: true, message: '请输入维修编号', trigger: 'blur' },
            { validator: expnoraml('维修编号'), trigger: 'blur' }
          ],
          repairDescribe: [
            { required: true, message: '请输入故障描述', trigger: 'blur' }
          ]
        }
      },
      insertForm: {},
      dialogFlag: false,
      editFlag: false,
      editForm: {},
      historyData: {},
      historyVisible: false
    }
  },
  mounted() {
    this.deviceTypeId = this.$route.query.deviceTypeId
    this.deviceId = this.$route.query.deviceId
    this.deviceName = this.$route.query.deviceName

    this.getMobileDeviceManagementDetail()
  },
  methods: {
    backPage() {
      this.$router.back()
    },
    insertDeviceDetail() {
      this.insertForm.deviceTypeId = this.deviceTypeId
      this.insertForm.deviceId = this.deviceId
      this.insertForm.deviceName = this.deviceName
      this.insertForm.createDepartmentId = getPrisonId()
      this.insertForm.createUser = getUserId()
      this.insertForm.updateUser = getUserId()
      insertDeviceDetail(this.insertForm).then(res => {
        console.log(res)
        this.dialogFlag = false
        this.$message.success(res)

        this.getMobileDeviceManagementDetail()
      })
    },
    showHistory(row) {
      this.historyVisible = true
      this.historyData = row
      this.mobileDeviceLog()
    },
    mobileDeviceLog() {
      let params = {}
      params.pageSize = this.HIStable.pageSize
      params.currentPage = this.HIStable.pageNum
      params.deviceDetailId = this.historyData.deviceDetailId
      mobileDeviceLog(params).then(res => {
        console.log(res)
        if (res) {
          this.HIStable.list = res.rows
          this.HIStable.total = res.total
        }
      })
    },
    editDevice(row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editFlag = true
    },
    editDeviceDetail() {
      this.editForm.deviceTypeId = this.deviceTypeId
      this.editForm.deviceId = this.deviceId
      this.editForm.updateUser = getUserId()

      editDeviceDetail(this.editForm).then(res => {
        console.log(res)
        this.editFlag = false
        this.$message.success(res)
        this.getMobileDeviceManagementDetail()
      })
    },
    formatDate(date) {
      return date.split(' ')[0]
      //   return formatDate(new Date(date), 'yyyy-MM-dd')
    },
    query() {
      this.searchData = this.formData
      this.getMobileDeviceManagementDetail()
    },
    reset() {
      this.searchData = {}
      this.formData = {}
      this.tableData.pageNum = 1
      this.getMobileDeviceManagementDetail()
    },
    // 获取列表
    getMobileDeviceManagementDetail() {
      let { searchData, deviceTypeId, deviceId } = this
      let searchRegisterDate = searchData.searchRegisterDate
        ? formatDate(searchData.searchRegisterDate, 'yyyy-MM-dd')
        : ''
      let { pageNum, pageSize } = this.tableData
      let formData = {
        ...searchData,
        pageNum,
        pageSize,
        deviceTypeId,
        deviceId,
        searchRegisterDate
      }
      this.tableLoading = true
      getMobileDeviceManagementDetail(formData).then(
        res => {
          this.tableData = res
          this.tableLoading = false
        },
        err => {
          console.log(err)

          this.tableLoading = false
        }
      )
    },
    handleTakeToggle({
      deviceId,
      deviceCode,
      deviceTypeId = '',
      deviceDetailId = '',
      deviceState = 2,
      receiveId = '',
      receiveDepartmentId = '',
      receiveComment = '',
      receiveDepartmentName = '',
      deviceTypeName = '',
      deviceName = ''
    }) {
      // 领用弹窗
      this.takeData = {
        deviceId,
        deviceCode,
        deviceTypeName,
        deviceName,
        receiveDepartmentName,
        deviceTypeId,
        deviceDetailId,
        deviceState,
        receiveId,
        receiveDepartmentId,
        receiveComment
      }
      this.takeToggle = true
    },
    closeTake() {
      // 关闭领用弹窗
      this.takeToggle = false
      this.takeData = {}
    },
    take() {
      // 领用
      this.$refs.takeform.validate(valid => {
        if (valid) {
          let { takeData } = this
          this.updDeviceInfo({ ...takeData, deviceState: 2 }, this.closeTake)
        } else {
          return false
        }
      })
    },
    handleServiceToggle({
      receiveId = '',
      receiveName = '',
      deviceName = '',
      deviceTypeName = '',
      repairOrderId = '',
      deviceId = '',
      deviceTypeId = '',
      deviceDetailId = '',
      deviceState = 3,
      receiveDepartmentId = '',
      receiveDepartmentName,
      receiveUser,
      deviceCode,
      repairDescribe = ''
    }) {
      // 维修
      this.serviceData = {
        deviceCode,
        deviceId, // 设备编号（隐藏）
        deviceTypeId, // 设备类型编号（隐藏）
        deviceDetailId, // 子设备编号（隐藏）
        deviceState, // 维修status
        repairOrderId, // 工单编号
        receiveName,
        deviceName,
        deviceTypeName,
        receiveUser,
        receiveDepartmentName,
        repairDescribe // 故障描述
      }
      this.serviceToggle = true
    },
    closeService() {
      // 关闭维修弹窗
      this.serviceToggle = false
      this.serviceData = {}
    },
    service() {
      // 维修
      this.$refs.serviceform.validate(valid => {
        if (valid) {
          let { serviceData } = this
          this.updDeviceInfo(
            { ...serviceData, deviceState: 3 },
            this.closeService
          )
        } else {
          return false
        }
      })
    },

    // handleEditToggle () { // 编辑

    // },

    back({
      deviceId = '',
      deviceTypeId = '',
      deviceDetailId = '',
      deviceState = 1,
      deviceTypeName,
      deviceName,
      deviceCode,
      createDepartmentId
    }) {
      // 归还
      let backData = {
        deviceId,
        createDepartmentId,
        deviceCode,
        deviceTypeId,
        deviceDetailId,
        deviceState: 1
      }
      if (deviceCode) {
        deviceCode = '编号:' + deviceCode
      } else {
        deviceCode = '暂无编号'
      }
      this.$confirm(
        `归还 ${deviceTypeName}-${deviceName} 设备, ${deviceCode}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.updDeviceInfo(backData, () =>
            this.$message({
              type: 'success',
              message: '归还成功!'
            })
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消归还!'
          })
        })
    },
    handleDelete({
      deviceId = '',
      deviceTypeId = '',
      deviceDetailId = '',
      deviceTypeName,
      deviceName,
      deviceCode,
      createDepartmentId
    }) {
      // 删除
      let deleteData = {
        deviceId,
        deviceTypeId,
        deviceDetailId,
        createDepartmentId,

        isDelete: 1
      }
      if (deviceCode) {
        deviceCode = '编号:' + deviceCode
      } else {
        deviceCode = '暂无编号'
      }
      this.$confirm(
        `删除 ${deviceTypeName}-${deviceName} 设备, ${deviceCode}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.updDeviceInfo(deleteData, () =>
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除!'
          })
        })
    },
    scrap({
      deviceId = '',
      deviceTypeId = '',
      deviceDetailId = '',
      deviceTypeName,
      deviceName,
      deviceState = 4,
      scrapReason = ''
    }) {
      // 报废
      let scrapData = {
        deviceId,
        deviceTypeId,
        deviceDetailId,
        deviceState: 4,
        scrapReason
      }
      this.$confirm(
        `报废 ${deviceTypeName}-${deviceName} 设备, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.updDeviceInfo(scrapData, () =>
            this.$message({
              type: 'success',
              message: '报废成功!'
            })
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消报废!'
          })
        })
    },
    repair(val) {
      console.log(val)

      this.$confirm(
        ` ${val.deviceTypeName}-${val.deviceName} 设备是否完成修复?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.axios
            .put(
              this._global.businessUrl +
                '/mobileDeviceManagement/markFixed/' +
                val.deviceId +
                '/' +
                val.deviceDetailId
            )
            .then(response => {
              this.getMobileDeviceManagementDetail()

              this.$message({
                type: 'success',
                message: response
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    updDeviceInfo(data, callback) {
      // 更新数据
      updDeviceInfo(data).then(res => {
        callback()
        this.getMobileDeviceManagementDetail()
      })
    },

    // 领用按钮
    showTake(deviceState) {
      return !!(deviceState === 1)
    },
    // 维修按钮
    showService(deviceState) {
      return !!(deviceState === 1)
    },
    // 编辑按钮
    // editService (deviceState) {
    //   return !!(deviceState === 1 || deviceState === 2 || deviceState === 3)
    // },
    // 报废按钮
    showScrap(deviceState) {
      return !!(deviceState === 3)
    },
    // 归还按钮
    showBack(deviceState) {
      return !!(deviceState === 2)
    },
    // 删除按钮
    showDelete(deviceState) {
      return !!(deviceState === 1 || deviceState === 4)
    }
  }
}
</script>
<style lang="less" scoped>
.cell {
  .el-button.el-button--text {
    margin-left: 0;
  }
}
.technology {
  .yn_form {
    color: #fff;
  }
}
</style>
