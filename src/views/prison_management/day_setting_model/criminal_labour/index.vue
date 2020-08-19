<!--
 * @Description:罪犯劳动
 * @Author: fylih
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 16:02:06
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menu-tree :menuList="menuList">
      <tab slot="heade_btn" right name="罪犯劳动管理" :pathName="'criminal_labour_statistics'"></tab>
      <table-view
        :tableData="tableData"
        noBottom
        noIndex
        @sizeChange="sizeChange"
        @selectionchange="selectionchange"
        v-loading="tableLoading"
      >
        <div slot="searchCondition">
          <el-form ref="queryForm" class="yn_form" inline :model="queryParams" label-width="7rem">
            <el-form-item label="起止时间">
              <el-date-picker
                class="yn_ipt"
                v-model="datePicker"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="劳动类型" prop="laborName">
              <!-- <el-select class="yn_ipt" clearable v-model="queryParams.laborName">
                <el-option
                  v-for="(item,i) in labourTypeOptions"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-cascader
                v-model="queryParams.laborName"
                class="yn_ipt"
                :options="labourTypeOptions"
                :show-all-levels="false"
                :props="{ emitPath: false }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="是否完成" prop="isComplete">
              <el-select class="yn_ipt" clearable v-model="queryParams.isComplete">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否预警" prop="policeWarn">
              <el-select class="yn_ipt" clearable v-model="queryParams.policeWarn">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="劳动地点" prop="laborPlace">
              <el-input class="yn_ipt" v-model="queryParams.laborPlace"></el-input>
            </el-form-item>
            <el-form-item label="监区" prop="wardId">
              <depart-select class="yn_ipt" v-model="queryParams.wardId"></depart-select>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="queryInfo">查询</el-button>
              <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item v-if="userPrisonId != 1">
              <el-button class="yn_btn" type="primary" @click="addVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="exportExcel">导出数据</el-button>
            </el-form-item>
            <el-form-item v-if="userPrisonId != 1">
              <el-button
                class="yn_btn"
                :disabled="selIdList.length == 0"
                type="primary"
                @click="deleltAll"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column min-width="100" align="center" prop="date" label="劳动日期" />
          <el-table-column
            v-if="prisonId == 1"
            min-width="120"
            align="center"
            prop="prisonName"
            label="监狱"
          />
          <el-table-column min-width="100" align="center" prop="deptName" label="监区" />
          <el-table-column show-overflow-tooltip align="center" prop="laborValue" label="劳动类型" />
          <el-table-column show-overflow-tooltip align="center" prop="laborPlace" label="劳动地点"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="businessCount"
            label="事务性劳动人数"
            min-width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="produceCount"
            label="生产性劳动人数"
            min-width="100"
          ></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="警察人数">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                v-html="row.policeCount"
                class="yn_text_btn"
                @click="openUpdate('police', row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="罪犯人数">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                v-html="row.criminalCount"
                class="yn_text_btn"
                @click="openGroup(row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isOverTime" label="是否加班">
            <template slot-scope="{ row }">
              <span>{{ row.isOverTime == 1 ? "是" : "否" }}</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip align="center" label="加班预警">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                class="yn_text_btn"
                :disabled="userPrisonId == 1"
                v-if="row.workWarn === 0"
                @click="updateWorkWarn(row.id, 1)"
              >否</el-button>
              <el-button
                v-else-if="row.workWarn === 1"
                type="text"
                class="yn_text_btn"
                :disabled="userPrisonId == 1"
                style="color:red"
                @click="updateWorkWarn(row.id, 0)"
              >是</el-button>
              <!-- <span style="color:red"
                    v-if="row.workWarn === 1"
                    @click="updateWorkWarn(row.id,0)">是</span>
              <span  style="color:#409EFF" v-else-if="row.workWarn === 0"
              @click="updateWorkWarn(row.id,1)">否</span>-->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="laborType" label="时间类型">
            <template slot-scope="{ row }">
              <span>{{ row.laborType == 1 ? "全天" : "半天" }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="警囚比预警">
            <template slot-scope="{ row }">
              <span style="color:red" v-if="row.policeWarn === 1">是</span>
              <span style="color:#409EFF" v-else-if="row.policeWarn === 0">否</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="是否劳动日">
            <template slot-scope="{ row }">
              <span v-if="row.isLabor === 0">否</span>
              <span v-else-if="row.isLabor === 1">是</span>
              <span v-else-if="row.isLabor === 2">否</span>
              <span v-else>暂未配置</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isComplete" label="完成状态">
            <template slot-scope="{ row }">
              <span>{{ row.isComplete == 1 ? "已完成" : "进行中" }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="300" align="center" label="操作">
            <template slot-scope="{ row }">
              <div class="btn_box_inTable">
                <el-button
                  type="text"
                  class="yn_text_btn"
                  v-if="userPrisonId != 1"
                  @click="fastAdd(row)"
                >快捷新增</el-button>
                <el-button
                  type="text"
                  v-if="userPrisonId != 1"
                  :disabled="row.isComplete == 1"
                  class="yn_text_btn"
                  @click="edit(row)"
                >编辑</el-button>
                <el-button type="text" class="yn_text_btn" @click="check(row)">查看</el-button>
                <el-button
                  type="text"
                  :disabled="row.isComplete == 1"
                  v-if="userPrisonId != 1"
                  class="yn_text_btn"
                  @click="completeAll(row.id)"
                >{{ row.isComplete == 1 ? "已收工" : "收工" }}</el-button>
                <el-button
                  type="text"
                  class="yn_text_btn"
                  v-if="userPrisonId != 1"
                  @click="deleteItem([row.id])"
                  style="color:red"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <add-dialog
        :addVisible="addVisible"
        :handleCloseAdd="handleCloseAdd"
        :labourTypeOptions="labourTypeOptions"
        @addSuccess="sizeChange"
      ></add-dialog>
      <fastadd-dialog
        :addVisible="fastVisible"
        :handleCloseAdd="handleCloseFastAdd"
        :labourTypeOptions="labourTypeOptions"
        :fastAddForm="fastAddForm"
        @addSuccess="sizeChange"
      ></fastadd-dialog>
      <edit-dialog
        :editVisible="editVisible"
        :handleCloseEdit="handleCloseEdit"
        :labourTypeOptions="labourTypeOptions"
        @editSuccess="sizeChange"
        :rows="editList"
      ></edit-dialog>
      <transfer-update
        :updateVisible="updateVisible"
        :handleCloseUpdateDialog="handleCloseUpdateDialog"
        :submitAPI="'/labour/updateCriAndPol'"
        :params="updateParams"
        @updateSuccess="sizeChange"
        :disabled="updateParams.isComplete == 1 || userPrisonId == 1"
      ></transfer-update>

      <detailDialog :Visible="detailVisible" :close="checkClose" :detail="checkForm" />
      <el-dialog
        title="罪犯小组"
        append-to-body
        class="yn_dialog"
        center
        :visible.sync="groupVisible"
        width="60%"
        @close="sizeChange"
      >
        <!-- <criminalGroupInfo
          :groupList="groupList"
          :selct="false"
          :showComplete="true"
          :completeBtn="true"
          :laborId="laborId"
          @complete="getGroups"
        />-->
        <criminalGroupInfo
          :groupList="groupList"
          :selct="userPrisonId != 1"
          :showComplete="true"
          :laborId="laborId"
          word="收工"
          @selectionchange="groupChange"
        >
          <template slot="colum_btns">
            <el-table-column label="操作" v-if="userPrisonId != 1" align="center" width="150">
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  :disabled="row.isComplete == 1"
                  class="yn_text_btn"
                  @click="$checkMessage(() => complete(row))"
                >{{ row.isComplete == 1 ? "已收工" : "收工" }}</el-button>
                <!-- <el-button
                  type="text"
                  v-if="row.isComplete!=1"
                  class="yn_text_btn"
                  @click="delGroup(row.id)"
                >移除</el-button>-->
              </template>
            </el-table-column>
          </template>
          <template slot="dialog_btns">
            <el-table-column align="center" label="操作" v-if="userPrisonId != 1">
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  :disabled="row.isComplete == 1"
                  class="yn_text_btn"
                  @click="$checkMessage(() => delCrimal(row.id))"
                >移除</el-button>
                <el-button
                  type="text"
                  :disabled="row.isComplete == 1"
                  class="yn_text_btn"
                  @click="$checkMessage(() => completeCri(row))"
                >{{ row.isComplete == 1 ? "已收工" : "收工" }}</el-button>

                <criminalRegister
                  :criminalId="row.id"
                  :prisonId="prisonId"
                  :criminalName="row.zfName"
                  @submit="completeCri(row)"
                />
              </template>
            </el-table-column>
          </template>
        </criminalGroupInfo>
        <div slot="footer">
          <el-button
            type="primary"
            class="yn_btn"
            v-if="userPrisonId != 1 && larborData.isComplete !== 1"
            @click="openNewGroup()"
          >添加罪犯</el-button>
          <el-button
            type="primary"
            class="yn_btn"
            v-if="
              userPrisonId != 1 &&
                larborData.isComplete != 1 &&
                selGroups.length > 0
            "
            @click="$checkMessage(() => delGroups())"
          >移除罪犯</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="添加罪犯"
        append-to-body
        class="yn_dialog"
        center
        :visible.sync="addNewVisible"
        width="60%"
      >
        <!-- <criminalGroupInfo
          :groupList="newGroupList"
          :laborId="laborId"
          :addBtn="true"
          @add="addFinish"
          :selct="false"
        />-->
        <criminalGroupInfo
          :groupList="newGroupList"
          :laborId="laborId"
          :selct="true"
          :criSelct="true"
          @selectionchange="newGroupChange"
        ></criminalGroupInfo>

        <div slot="footer">
          <el-button type="primary" class="yn_btn" @click="addGroups">添加</el-button>
        </div>
      </el-dialog>
    </menu-tree>
  </dept-layout>
</template>
<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import tableView from '@/components/table_view'
import deptLayout from '@/components/deptLayout/index.vue'
import transferUpdate from '@/components/transfer_list_update'
import _globalUrl from '@/utils/global_url'
import _global from '@/utils/global_url'
import { expnoraml, isEnName } from '@/utils/form_valid'
import { getPrisonId, getDeptId } from '@/utils'
import addDialog from './add'
import fastaddDialog from './fastAdd'
import menuTree from '@/components/menu_tree'
import editDialog from './edit'
import detailDialog from './detail'
import tab from '@/components/tab'
import departSelect from '../dept_select.vue'
// import departSelect from '@/components/depart_select'
// import criminalGroupInfo from './criminal_group_info'
import criminalGroupInfo from '@/components/criminal_group_info'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'

export default {
  components: {
    tableView,
    addDialog,
    deptLayout,
    tab,
    editDialog,
    transferUpdate,
    menuTree,
    departSelect,
    detailDialog,
    criminalGroupInfo,
    criminalRegister,
    fastaddDialog
  },
  data() {
    return {
      menuList: ['5+1+1模式执行', '罪犯劳动'],
      list: [
        {
          a: 555,
          b: function() {}
        }
      ],
      pickerOptions: pickerOptions,
      tableLoading: false,
      editVisible: false,
      checkVisible: false,
      addVisible: false,
      detailVisible: false,
      checkForm: {},
      tableData: {
        pageSize: 10,
        pageNum: 1
      },
      queryParams: {},
      rows: [],
      datePicker: '',
      labourTypeOptions: null,
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      prisonName: '',
      deptId: getDeptId(),
      editList: {},
      updateVisible: false,
      updateParams: {},
      groupVisible: false,
      groupList: [],
      selIdList: [],
      laborId: '',
      larborData: {},
      addNewVisible: false,
      newGroupList: [],
      selcetIDs: [],
      selGroups: [],
      selNewGroups: [],
      fastAddForm: {},
      fastVisible: false
    }
  },
  mounted() {
    this.sizeChange()
    this.getLaborType()
  },
  methods: {
    sizeChange() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryInfo()
    },
    reset() {
      this.queryParams = {}
      this.datePicker = ''
      this.queryParams.pageSize = 10
      this.queryParams.currentPage = 1
      this.queryInfo()
    },
    exportExcel() {
      let queryParams = this.queryParams
      queryParams.deptId = this.prisonId

      this.axios
        .post(_globalUrl.businessUrl + '/labour/export', queryParams, {
          responseType: 'blob'
        })
        .then(msg => {
          let url = window.URL.createObjectURL(msg.data) // 表示一个指定的file对象或Blob对象
          console.log(msg)
          let a = document.createElement('a')
          document.body.appendChild(a)
          //   let fileName = msg.headers['content-disposition']
          //     .split(';')[1]
          //     .split('=')[1] // filename名称截取
          let fileName =
            '罪犯劳动管理-' + this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          a.href = url
          a.download = fileName // 命名下载名称
          a.click() // 点击触发下载
          window.URL.revokeObjectURL(url)
        })
    },
    // 查询所有
    queryInfo() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.queryParams.deptId = this.prisonId
          this.tableLoading = true
          this.axios
            .post(_globalUrl.businessUrl + '/labour/selAll', this.queryParams)
            .then(
              res => {
                this.$set(this.tableData, 'list', res.rows)
                this.$set(this.tableData, 'total', res.total)
                this.tableLoading = false
              },
              () => {
                this.tableLoading = false
              }
            )
        } else {
          return false
        }
      })
    },
    getLaborType() {
      this.axios
        .get(_globalUrl.businessUrl + '/patrol/getTree/LaborType')
        .then(res => {
          this.labourTypeOptions = res
        })
    },
    // 打开列表修改模态框
    openUpdate(type, row) {
      this.updateParams = JSON.parse(JSON.stringify(row))
      this.updateParams.type = type
      this.updateVisible = true
    },
    openGroup(row) {
      this.groupVisible = true
      this.laborId = row.id
      this.larborData = JSON.parse(JSON.stringify(row))
      this.getGroups(row.id)
    },
    handleCloseUpdateDialog() {
      this.updateVisible = false
    },
    getGroups(id) {
      this.axios
        .get(_globalUrl.businessUrl + '/labour/criminalInfoByGroup/' + id)
        .then(res => {
          this.groupList = res
        })
    },
    // 打开查看模态框
    check(rows) {
      //   this.$router.push({ name: 'criminal_labour_detail', query: rows })
      this.checkForm = JSON.parse(JSON.stringify(rows))
      this.detailVisible = true
    },
    //收工
    completeAll(row) {
      this.$confirm('是否收工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .put(_globalUrl.businessUrl + '/labour/oneLaborComplete/' + row)
            .then(res => {
              this.$message({
                type: 'success',
                message: res
              })
              this.sizeChange()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    complete(row) {
      if (row.id) {
        this.axios
          .put(
            _globalUrl.businessUrl +
              '/labour/oneGroupComplete/' +
              this.laborId +
              '/' +
              row.id
          )
          .then(res => {
            this.$message({
              type: 'success',
              message: res
            })
            this.getGroups(this.laborId)
          })
      } else {
        let arr = row.criminalList.map(item => item.id)
        this.axios
          .put(
            _globalUrl.businessUrl + '/labour/noGroupComplete/' + this.laborId,
            arr
          )
          .then(res => {
            this.$message({
              type: 'success',
              message: res
            })
            this.getGroups(this.laborId)
          })
      }
    },
    checkClose() {
      this.detailVisible = false
    },
    edit(rows) {
      this.editList = JSON.parse(JSON.stringify(rows))
      console.log(this.editList)

      this.editVisible = true
    },
    // 关闭新增模态框
    handleCloseAdd() {
      this.addVisible = false
    },
    handleCloseFastAdd() {
      this.fastVisible = false
    },
    // 关闭编辑模态框
    handleCloseEdit() {
      this.editVisible = false
    },
    fastAdd(row) {
      this.fastAddForm = JSON.parse(JSON.stringify(row))
      this.fastVisible = true
    },
    saveFastAdd() {
      this.axios
        .put(
          _globalUrl.businessUrl +
            '/labour/quickCopy/' +
            fastAddForm.id +
            '/' +
            fastAddForm.deptId +
            '/' +
            this.prisonId
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.sizeChange()
        })
    },
    selectionchange(val) {
      console.log(val)

      this.selIdList = val.map(Item => Item.id)
    },
    deleltAll() {
      this.deleteItem(this.selIdList)
    },
    deleteItem(row) {
      let params = []
      params.push(...row)
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(_globalUrl.businessUrl + '/labour/delete', params)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.sizeChange()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.prisonName = val.departName
      this.queryInfo()
    },
    updateWorkWarn(id, flag) {
      this.$confirm('确认修改加班预警?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        this.axios
          .get(
            _globalUrl.businessUrl + '/labour/updateWorkWarn/' + id + '/' + flag
          )
          .then(res => {
            this.$message.success('更新成功')
            this.queryInfo()
          })
      )
    },
    delCrimal(id) {
      this.axios
        .delete(
          _global.businessUrl +
            '/labour/deleteOneCriminal/' +
            this.laborId +
            '/' +
            id
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.getGroups(this.laborId)
        })
    },
    completeCri(row) {
      this.axios
        .put(
          _global.businessUrl +
            '/rest/oneCriminalComplete/' +
            this.laborId +
            '/' +
            row.id
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          row.isComplete = 1
          this.getGroups(this.laborId)
        })
    },
    openNewGroup() {
      this.axios
        .get(
          _globalUrl.businessUrl +
            '/labour/getNoChooseGroup/' +
            this.larborData.deptId +
            '/' +
            this.larborData.id
        )
        .then(res => {
          console.log(res)
          this.newGroupList = res
          this.addNewVisible = true
        })
    },
    addFinish(val) {
      this.addNewVisible = false
      this.getGroups(val)
    },
    groupChange(val) {
      console.log(val)
      this.selGroups = val
    },
    delGroups() {
      console.log(this.selGroups)
      let params = {}
      params.id = this.laborId
      params.type = 0
      params.criminalList = []
      params.groupList = []
      this.selGroups.map(row => {
        if (row.criminalIdList) {
          params.criminalList.push(...row.criminalIdList)
        } else {
          row.criminalList.map(item => {
            params.criminalList.push(item.id)
          })
        }
        if (row.id) {
          params.groupList.push(row.id)
        }
      })
      this.axios
        .put(_global.businessUrl + '/labour/deleteCriminal', params)
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.getGroups(this.laborId)
        })
    },
    addNewGroup(row) {
      let params = {}
      params.id = this.laborId
      params.type = 0
      if (row.criminalIdList) {
        params.criminalList = row.criminalIdList
      } else {
        params.criminalList = row.criminalList.map(item => item.id)
      }
      if (row.id) {
        params.groupList = [row.id]
      }
      this.axios
        .post(_global.businessUrl + '/labour/addCriminal', params)
        .then(res => {
          this.$message.success(res)
          this.addFinish(this.laborId)
        })
    },
    addGroups() {
      let params = {}
      params.id = this.laborId
      params.criminalList = []
      params.groupList = []
      params.type = 0
      this.selNewGroups.map(row => {
        if (row.criminalIdList) {
          params.criminalList.push(...row.criminalIdList)
        } else {
          row.criminalList.map(item => {
            params.criminalList.push(item.id)
          })
        }
        if (row.id) {
          params.groupList.push(row.id)
        }
      })
      this.axios
        .post(_global.businessUrl + '/labour/addCriminal', params)
        .then(res => {
          this.$message.success(res)
          this.addFinish(this.laborId)
        })
    },
    newGroupChange(val) {
      this.selNewGroups = val
    }
  },
  watch: {
    datePicker(val) {
      if (val) {
        this.queryParams.beginDate = val[0]
        this.queryParams.endDate = val[1]
      } else {
        this.queryParams.beginDate = null
        this.queryParams.endDate = null
      }
    }
  }
}
</script>
<style scoped lang="less">
.btn_box_inTable {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>