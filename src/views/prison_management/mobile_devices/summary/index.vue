<!--
 * @Description: 移动设备管理汇总
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-26 14:48:33
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:30:44
 -->
<template>
  <dept-layout v-model="changePrisonId">
    <menuTree :menuList="['监狱管理','技防管理','4G移动设备管理']">
      <table-view
        noBottom
        :tableData="tableData"
        @sizeChange="getMobileDeviceManagementList"
        v-loading="tableLoading"
        :summaryList="summaryList"
        :showSummary="true"
        :tableRowClassName="tableRowClassName"
      >
        <template slot="searchCondition">
          <el-form ref="form" class="yn_form" inline label-width="80px">
            <el-form-item label="设备名称">
              <el-input class="yn_ipt" v-model="formData.deviceName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="设备类型">
              <device-type-select v-model="formData.deviceTypeId" />
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
              <el-button class="yn_btn" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item v-if="btnPermissions">
              <el-button class="yn_btn" type="primary" @click="handleDeviceToggle(true)">新增</el-button>
            </el-form-item>
            <el-form-item v-if="btnPermissions">
              <el-upload
                class="upload-demo"
                :action="userData.url"
                accept=".xls, .xlsx"
                :show-file-list="false"
                :auto-upload="true"
                :headers="{token:userData.token}"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                multiple
                ref="upload"
                :limit="1"
              >
                <el-button class="yn_btn" type="primary">Excel导入</el-button>
              </el-upload>
            </el-form-item>

            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="mobileDeviceEexport">Excel导出</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template slot="table-column">
          <el-table-column align="center" prop="deviceName" label="设备名称" />
          <el-table-column align="center" prop="deviceTypeName" label="设备类型" />
          <el-table-column align="center" prop="deviceNum" label="设备总数" />
          <el-table-column align="center" prop="stockNum" label="在用数量" />
          <el-table-column align="center" prop="receiveNum" label="领用数量" />
          <el-table-column align="center" prop="scrapNum" label="报废数量" />
          <el-table-column align="center" prop="repairNum" label="维修数量" />
          <el-table-column align="center" prop="stockThreshold" label="在用阈值" />
          <el-table-column align="center" prop="scrapThreshold" label="报废阈值" />
          <el-table-column align="center" prop="warning" label="预警状态" />
          <!-- <el-table-column align="center" prop="deviceCode" label="设备编号" /> -->
          <el-table-column align="center" label="查看" min-width="150">
            <template slot-scope="{row}">
              <el-button class="yn_text_btn" type="text" @click="mobileDevicesDetailPage(row)">详情</el-button>
              <el-button
                class="yn_text_btn"
                type="text"
                v-if="btnPermissions"
                @click="mobileDevicesEdit(row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <el-dialog title="新增" class="yn_dialog" center :visible.sync="deviceToggle" width="500px">
        <el-form
          ref="addform"
          class="yn_form"
          :rules="rules.addData"
          :model="addData"
          label-width="80px"
        >
          <el-form-item label="设备名称" prop="deviceName">
            <el-input class="yn_ipt" v-model="addData.deviceName" placeholder="请输入内容"></el-input>
          </el-form-item>
          <!-- <el-form-item label="设备编号" prop="deviceCode">
            <el-input class="yn_ipt" v-model="addData.deviceCode" placeholder="请输入"></el-input>
          </el-form-item>-->
          <el-form-item label="设备类型" prop="deviceTypeId">
            <device-type-select v-model="addData.deviceTypeId" />
          </el-form-item>
          <el-form-item label="设备数量" prop="deviceNum">
            <el-input-number
              :controls="false"
              v-model="addData.deviceNum"
              :min="1"
              :step="1"
              label="设备数量"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(addDataCheckRequired)">确 定</el-button>
          <el-button class="yn_btn" @click="closeAddData">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="编辑" class="yn_dialog" center :visible.sync="editDeviceToggle" width="500px">
        <el-form
          ref="editform"
          class="yn_form"
          :rules="rules.editData"
          :model="editData"
          label-width="80px"
        >
          <el-form-item label="设备名称" prop="deviceName">
            <el-input class="yn_ipt" v-model="editData.deviceName" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceTypeId">
            <device-type-select v-model="editData.deviceTypeId" />
          </el-form-item>

          <el-form-item label="报废阈值" prop="scrapThreshold">
            <el-input-number v-model="editData.scrapThreshold" :min="0" :step="1" label="设备数量" />
          </el-form-item>
          <el-form-item label="在用阈值" prop="stockThreshold">
            <el-input-number v-model="editData.stockThreshold" :min="0" :step="1" label="设备数量" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="$checkMessage(editDataCheckRequired)">确 定</el-button>
          <el-button @click="closeEditData">取 消</el-button>
        </span>
      </el-dialog>

      <div class="yn_charts">
        <h3>设备使用状态占比</h3>
        <pieCharts :dataList="chartData" :chartData="chartData" :centerTitle="['总计','件']" />
      </div>
    </menuTree>
  </dept-layout>
</template>
<script>
import tableView from '@/components/table_view'
import { expnoraml } from '@/utils/form_valid'
import { pickerOptions } from '@/utils/picker_option_config'
import deviceTypeSelect from '@/components/device_type_select'
import deptLayout from '@/components/deptLayout/index.vue'
import permissions from '@/utils/permission.js'
import menuTree from '@/components/menu_tree/'
import pieCharts from '@/components/pie_charts/pie_charts'

import {
  getMobileDeviceManagementList,
  insertSelective,
  mobileDeviceEexport,
  editMobileDevice,
  getTotalMobileDevice
} from './service'
import { getUserId, getPrisonId } from '@/utils'
export default {
  components: { tableView, deviceTypeSelect, deptLayout, menuTree, pieCharts },
  data() {
    let myToken = localStorage.getItem('token')
    let user = JSON.parse(localStorage.getItem('user'))
    let prisonId = ''
    let userId = ''
    if (user) {
      prisonId = user.prisonId
      userId = user.userGuid
    }
    let token = ''
    if (myToken) {
      token = myToken
    }
    return {
      btnPermissions: permissions('mobile_devices_summary_button'),
      changePrisonId: getPrisonId(),
      tableLoading: false,
      prisonId,
      userId,
      deviceToggle: false,
      editDeviceToggle: false,
      editData: {},
      formData: {
        deviceTypeId: '', // 设备类型
        deviceName: '' // 设备名称
      },
      addData: {
        deviceName: '',
        deviceTypeId: '',
        deviceNum: 1,
        createUser: '',
        createDepartmentId: ''
      },
      searchData: {
        deviceTypeId: '', // 设备类型
        deviceName: '' // 设备类型
      },
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: [{ deviceTypeId: 1, deviceId: 2 }]
      },
      summaryList: [],
      rules: {
        addData: {
          deviceName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            },
            { validator: expnoraml('设备名称'), trigger: 'blur' }
          ],
          deviceTypeId: [
            { required: true, message: '请选择设备类型', trigger: 'change' }
          ],
          deviceNum: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('不能为空'))
                }
                if (!Number.isInteger(value)) {
                  callback(new Error('请输入数字值'))
                } else {
                  let re = /^[1-9]\d*$/
                  if (!re.test(value)) {
                    callback(new Error('请输入正整数'))
                  } else {
                    callback()
                  }
                }
              },
              trigger: 'blur'
            }
          ]
        },
        editData: {
          deviceName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          deviceTypeId: [
            { required: true, message: '请选择设备类型', trigger: 'change' }
          ],
          scrapThreshold: [
            {
              validator: (rule, value, callback) => {
                // if (value !== '') {
                //   return callback(new Error('不能为空'))
                // }
                if (!Number.isInteger(value)) {
                  callback(new Error('请输入数字值'))
                } else {
                  let re = /^[0-9]\d*$/
                  if (!re.test(value)) {
                    callback(new Error('请输入正整数'))
                  } else {
                    callback()
                  }
                }
              },
              trigger: 'blur'
            }
          ],
          stockThreshold: [
            {
              validator: (rule, value, callback) => {
                // if (value !== '') {
                //   return callback(new Error('不能为空'))
                // }
                if (!Number.isInteger(value)) {
                  callback(new Error('请输入数字值'))
                } else {
                  let re = /^[0-9]\d*$/
                  if (!re.test(value)) {
                    callback(new Error('请输入正整数'))
                  } else {
                    callback()
                  }
                }
              },
              trigger: 'blur'
            }
          ]
        }
      },
      userData: {
        url:
          this._global.businessUrl +
          '/mobileDeviceManagement/import' +
          '?userId=' +
          userId +
          '&prisonId=' +
          prisonId,
        token
      },
      chartData: []
    }
  },
  mounted() {
    this.getMobileDeviceManagementList()
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      return row.warning === '是' ? 'warning-row' : 'success-row'
    },
    reset() {
      this.searchData = {}
      this.formData = {}
      this.tableData.pageNum = 1
      this.getMobileDeviceManagementList()
    },
    query() {
      this.searchData = this.formData
      this.getMobileDeviceManagementList()
    },
    // 获取汇总列表
    getSummaries(row) {
      this.summaryList = ['合计', '', '']
      this.chartData = []
      getTotalMobileDevice({ prisonId: this.changePrisonId }).then(res => {
        if (res[0]) {
          this.summaryList.push(res[0].deviceNumTotal)
          this.summaryList.push(res[0].stockNumTotal)
          this.summaryList.push(res[0].receiveNumTotal)
          this.summaryList.push(res[0].scrapNumTotal)
          this.summaryList.push(res[0].repairNumTotal)
          this.summaryList.push(res[0].stockThresholdTotal)
          this.summaryList.push(res[0].scrapThresholdTotal)
          this.chartData.push({ name: '在用数量', value: res[0].stockNumTotal })
          this.chartData.push({
            name: '领用数量',
            value: res[0].receiveNumTotal
          })
          this.chartData.push({ name: '报废数量', value: res[0].scrapNumTotal })
          this.chartData.push({
            name: '维修数量',
            value: res[0].repairNumTotal
          })
        }
      })
    },
    getMobileDeviceManagementList() {
      let { searchData, changePrisonId } = this
      let { pageNum, pageSize } = this.tableData
      let formData = {
        ...searchData,
        pageNum,
        pageSize,
        prisonId: changePrisonId
      }

      this.tableLoading = true
      getMobileDeviceManagementList(formData).then(
        res => {
          this.tableData = res
          this.tableLoading = false
          this.getSummaries()
        },
        err => {
          console.log(err)

          this.tableLoading = false
        }
      )
    },
    insertSelective() {
      let createDepartmentId = this.prisonId
      let createUser = this.userId

      insertSelective({ ...this.addData, createDepartmentId, createUser }).then(
        _ => {
          this.$message.success('添加成功')
          this.getMobileDeviceManagementList()
          this.closeAddData()
        }
      )
    },
    addDataCheckRequired() {
      this.$refs.addform.validate(valid => {
        if (valid) {
          this.insertSelective()
        } else {
          return false
        }
      })
    },
    handleDeviceToggle(val) {
      this.deviceToggle = val
    },
    closeAddData() {
      this.handleDeviceToggle(false)
      this.$refs.addform.resetFields()
      this.addData = {
        deviceName: '',
        deviceTypeId: '',
        deviceNum: 1
      }
    },
    closeEditData() {
      this.handleEditToggle(false)
      this.$refs.editform.resetFields()
      this.editData = {
        deviceId: '',
        deviceName: '',
        deviceTypeId: '',
        scrapThreshold: 0,
        stockThreshold: 0
      }
    },
    mobileDevicesEdit({
      deviceId,
      deviceName,
      deviceTypeId,
      scrapThreshold,
      stockThreshold
    }) {
      this.editData = {
        deviceId,
        deviceName,
        deviceTypeId,
        scrapThreshold,
        stockThreshold
      }
      this.handleEditToggle(true)
    },
    handleEditToggle(val) {
      this.editDeviceToggle = val
    },
    editDataCheckRequired() {
      this.$refs.editform.validate(valid => {
        if (valid) {
          this.editMobileDevice()
        } else {
          return false
        }
      })
    },
    editMobileDevice() {
      let {
        deviceId,
        deviceName,
        deviceTypeId,
        scrapThreshold,
        stockThreshold
      } = this.editData
      let formData = {
        deviceId,
        deviceName,
        deviceTypeId,
        scrapThreshold,
        stockThreshold,
        createDepartmentId: getUserId(),
        createUser: getPrisonId()
      }
      editMobileDevice(formData).then(res => {
        this.$message.success('编辑成功')

        this.getMobileDeviceManagementList()
        this.closeEditData()
      })
    },
    mobileDevicesDetailPage({ deviceTypeId, deviceId, deviceName }) {
      this.$router.push({
        name: 'mobile_device_detail',
        query: { deviceTypeId, deviceId, deviceName }
      })
    },
    uploadSuccess(response, file, fileList) {
      if (response.status === 0) {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.getMobileDeviceManagementList()
      } else {
        this.$message({
          type: 'info',
          message: '导入失败!'
        })
      }

      this.clearFiles()
    },
    uploadError() {
      this.clearFiles()
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    mobileDeviceEexport() {
      // if (!this.formData.deviceTypeId && !this.formData.deviceName) {
      //   this.$message({
      //     type: 'info',
      //     message: '添加检索条件!'
      //   })
      //   return false
      // }
      mobileDeviceEexport(this.formData)
    }
  },
  watch: {
    changePrisonId() {
      this.query()
    }
  }
}
</script>
