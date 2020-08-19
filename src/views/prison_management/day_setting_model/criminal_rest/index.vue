<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-10 20:03:42
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 16:04:00
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menu-tree :menuList="menuList">
      <tab slot="heade_btn" right name="罪犯休息管理" :pathName="'criminal_rest_statistics'"></tab>
      <table-view
        :tableData="tableData"
        v-loading="tableLoading"
        noBottom
        noIndex
        @selectionchange="selectionchange"
        @sizeChange="sizeChange"
      >
        <div slot="searchCondition">
          <el-form ref="form" class="yn_form" inline :model="queryParams" label-width="7rem">
            <el-form-item label="日期">
              <el-date-picker
                class="yn_ipt"
                v-model="queryTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="监区" prop="wardId">
              <depart-select class="yn_ipt" v-model="queryParams.wardId"></depart-select>
            </el-form-item>
            <el-form-item label="是否完成" prop="isComplete">
              <el-select class="yn_ipt" clearable v-model="queryParams.isComplete">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="yn_btn" @click="queryInfo">查询</el-button>
              <el-button type="primary" class="yn_btn" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="yn_btn"
                v-if="userPrisonId!=1"
                @click="addVisible=true"
              >新增</el-button>
            </el-form-item>
            <el-form-item v-if="userPrisonId!=1">
              <el-button
                class="yn_btn"
                :disabled="selIdList.length==0"
                type="primary"
                @click="deleltAll"
              >批量删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="exportExcel">导出数据</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" align="center"></el-table-column>

          <el-table-column show-overflow-tooltip align="center" prop="date" label="日期" />
          <el-table-column
            v-if="prisonId==1"
            min-width="100"
            align="center"
            prop="prisonName"
            label="监狱"
          />
          <el-table-column min-width="100" align="center" prop="deptName" label="监区" />
          <el-table-column show-overflow-tooltip align="center" prop="beginTime" label="开始时间" />
          <el-table-column show-overflow-tooltip align="center" prop="endTime" label="结束时间" />
          <el-table-column show-overflow-tooltip align="center" label="警察人数">
            <template slot-scope="{row}">
              <el-button
                type="text"
                v-html="row.policeCount"
                class="yn_text_btn"
                @click="openUpdate('police',row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="罪犯人数">
            <template slot-scope="{row}">
              <el-button
                type="text"
                v-html="row.criminalCount"
                class="yn_text_btn"
                @click="openGroup(row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="是否休息日">
            <template slot-scope="{row}">
              <span v-if="row.isRest===0">是</span>
              <span v-else-if="row.isRest===1">否</span>
              <span v-else-if="row.isRest===2">否</span>
              <span v-else>暂未配置</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="预警状态">
            <template slot-scope="{row}">
              <el-button
                type="text"
                class="yn_text_btn"
                v-if="row.warn === 0"
                @click="updateWorkWarn(row.id,1)"
              >正常</el-button>
              <el-button
                v-else-if="row.warn === 1"
                type="text"
                class="yn_text_btn"
                style="color:red"
                @click="updateWorkWarn(row.id,0)"
              >异常</el-button>
              <!-- <span v-if="row.warn === 0"
                    @click="updateWorkWarn(row.id,1)">正常</span>
              <span v-else-if="row.warn === 1"
                    style="color:red"
              @click="updateWorkWarn(row.id,0)">异常</span>-->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isComplete" label="完成状态">
            <template slot-scope="{row}">
              <span>{{row.isComplete==1?'已完成':'进行中'}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="timeType" label="时间类型">
            <template slot-scope="{row}">
              <span>{{row.timeType==1?'全天':'半天'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="操作" min-width="300">
            <template slot-scope="{row}">
              <div class="btn_box_inTable">
                <el-button
                  type="text"
                  class="yn_text_btn"
                  v-if="userPrisonId!=1"
                  @click="fastAdd(row)"
                >快捷新增</el-button>
                <el-button
                  type="text"
                  :disabled="row.isComplete==1"
                  v-if="userPrisonId!=1"
                  class="yn_text_btn"
                  @click="completeAll(row.id)"
                >{{row.isComplete==1?'已结束':'结束'}}</el-button>
                <el-button
                  type="text"
                  :disabled="row.isComplete==1"
                  v-if="userPrisonId!=1"
                  class="yn_text_btn"
                  @click="edit(row)"
                >编辑</el-button>
                <el-button type="text" class="yn_text_btn" @click="check(row)">查看</el-button>
                <el-button
                  type="text"
                  v-if="userPrisonId!=1"
                  style="color:red"
                  class="yn_text_btn"
                  @click="del([row.id])"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <add-dialog
        :addVisible="addVisible"
        :handleCloseAdd="handleCloseAdd"
        @addSuccess="sizeChange"
      ></add-dialog>
      <edit-dialog
        :editVisible="editVisible"
        :handleCloseEdit="handleCloseEdit"
        @editSuccess="sizeChange"
        :rows="editList"
      ></edit-dialog>

      <transfer-update
        :updateVisible="updateVisible"
        :handleCloseUpdateDialog="handleCloseUpdateDialog"
        :params="updateParams"
        :submitAPI="'/rest/updateCriAndPol'"
        :disabled="updateParams.isComplete==1||userPrisonId==1"
        @updateSuccess="sizeChange"
      ></transfer-update>

      <detailDialog :Visible="detailVisible" :close="checkClose" :detail="checkForm" />

      <el-dialog
        title="罪犯小组"
        append-to-body
        class="yn_dialog"
        center
        :visible.sync="groupVisible"
        width="60%"
        @close="queryInfo"
      >
        <criminalGroupInfo
          :groupList="groupList"
          :selct="prisonId!=1"
          :showComplete="true"
          :laborId="laborId"
          word="结束"
          @selectionchange="groupChange"
        >
          <template slot="colum_btns">
            <el-table-column label="操作" v-if="userPrisonId!=1" align="center" width="150">
              <template slot-scope="{row}">
                <el-button
                  type="text"
                  :disabled="row.isComplete==1"
                  class="yn_text_btn"
                  @click="$checkMessage(()=>complete(row))"
                >{{row.isComplete==1?'已结束':'结束'}}</el-button>
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
            <el-table-column align="center" label="操作" v-if="userPrisonId!=1">
              <template slot-scope="{row}">
                <el-button
                  type="text"
                  :disabled="row.isComplete==1"
                  class="yn_text_btn"
                  @click="$checkMessage(()=>delCrimal(row.id))"
                >移除</el-button>
                <el-button
                  type="text"
                  :disabled="row.isComplete==1"
                  class="yn_text_btn"
                  @click="$checkMessage(()=>completeCri(row))"
                >{{row.isComplete==1?'已结束':'结束'}}</el-button>
                <criminalRegister
                  :criminalId="row.id"
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
            v-if="userPrisonId!=1&&larborData.isComplete!==1"
            @click="openNewGroup()"
          >添加罪犯</el-button>
          <el-button
            type="primary"
            class="yn_btn"
            v-if="userPrisonId!=1&&larborData.isComplete!==1&&selGroups.length>0"
            @click="$checkMessage(()=>delGroups())"
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
        <criminalGroupInfo
          :groupList="newGroupList"
          @selectionchange="newGroupChange"
          :laborId="laborId"
          :criSelct="true"
          :selct="true"
        >
          <!-- <template slot="colum_btns">
            <el-table-column align="center" label="添加">
              <template slot-scope="{row}">
                <el-button type="text" class="yn_text_btn" @click="addNewGroup(row.id)">添加</el-button>
              </template>
            </el-table-column>
          </template>-->
        </criminalGroupInfo>

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
import addDialog from './add'
import editDialog from './edit'
import _global from '@/utils/global_url'
import _globalUrl from '@/utils/global_url'
import policesDetail from '@/components/polices_detail'
import criminalDetail from './criminal_detail'
import { getPrisonId, getDeptId } from '@/utils'
import menuTree from '@/components/menu_tree'
import tab from '@/components/tab'
import departSelect from '../dept_select.vue'
// import departSelect from '@/components/depart_select'
import criminalGroupInfo from '@/components/criminal_group_info'
import detailDialog from './detail'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'

export default {
  components: {
    tableView,
    addDialog,
    editDialog,
    criminalDetail,
    policesDetail,
    tab,
    deptLayout,
    transferUpdate,
    departSelect,
    menuTree,
    criminalGroupInfo,
    detailDialog,
    criminalRegister
  },
  data() {
    return {
      menuList: ['5+1+1模式执行', '罪犯休息'],
      pickerOptions: pickerOptions,
      tableLoading: false,
      queryParams: {
        deptId: JSON.parse(localStorage.getItem('user')).deptGuid
      },
      studyOptions: {},
      addVisible: false,
      editVisible: false,
      criminalVisible: false,
      policeVisible: false,
      queryTime: '',
      tableData: {
        pageSize: 10,
        pageNum: 1
      },
      criminalList: [],
      policeList: [],
      userPrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      prisonName: '',
      editList: {},
      updateVisible: false,
      updateParams: {},
      selIdList: [],
      groupVisible: false,
      groupList: [],
      checkForm: {},
      detailVisible: false,
      addNewVisible: false,
      laborId: '',
      larborData: {},
      newGroupList: [],
      selcetIDs: [],
      selGroups: [],
      selNewGroups: []
    }
  },
  mounted() {
    if (this.$route.params.datePicker) {
      this.queryTime = this.$route.params.datePicker
    }
    this.sizeChange()
  },
  methods: {
    sizeChange() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryInfo()
    },
    reset() {
      this.queryParams = {}
      this.queryTime = ''

      this.queryParams.pageSize = 10
      this.queryParams.currentPage = 1
      this.queryInfo()
    },
    queryInfo() {
      this.queryParams.deptId = this.prisonId
      this.tableLoading = true
      this.axios
        .post(_global.businessUrl + '/rest/selAll', this.queryParams)
        .then(
          res => {
            this.$set(this.tableData, 'list', res.rows)
            this.tableLoading = false
          },
          () => {
            this.tableLoading = false
          }
        )
    },
    // 打开查看模态框
    check(rows) {
      //   this.$router.push({ name: 'criminal_rest_detail', query: rows })
      this.checkForm = JSON.parse(JSON.stringify(rows))
      this.detailVisible = true
    },
    exportExcel() {
      let queryParams = this.queryParams
      queryParams.deptId = this.prisonId

      this.axios
        .post(this._global.businessUrl + '/rest/export', queryParams, {
          responseType: 'blob'
        })
        .then(msg => {
          let url = window.URL.createObjectURL(msg.data) // 表示一个指定的file对象或Blob对象
          console.log(msg)
          let a = document.createElement('a')
          document.body.appendChild(a)

          let fileName =
            '罪犯休息管理-' + this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          a.href = url
          a.download = fileName // 命名下载名称
          a.click() // 点击触发下载
          window.URL.revokeObjectURL(url)
        })
    },
    checkClose() {
      this.detailVisible = false
    },

    getGroups(id) {
      this.axios
        .get(_global.businessUrl + '/labour/criminalInfoByGroup/' + id)
        .then(res => {
          this.groupList = res
        })
    },

    openNewGroup() {
      this.axios
        .get(
          _global.businessUrl +
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

    complete(row) {
      if (row.id) {
        this.axios
          .put(
            _global.businessUrl +
              '/rest/oneGroupComplete/' +
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
    //收工
    completeAll(row) {
      this.$confirm('是否结束?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .put(_global.businessUrl + '/rest/oneStudyComplete/' + row)
            .then(res => {
              this.$message({
                type: 'success',
                message: res
              })
              this.sizeChange()
            })
        })
        .catch(err => {
          console.log(err)

          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    fastAdd(row) {
      this.axios
        .put(
          _global.businessUrl +
            '/rest/quickCopy/' +
            row.id +
            '/' +
            row.deptId +
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

    delGroup(id) {
      this.$confirm('是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(
              _global.businessUrl +
                '/rest/deleteCriminalGroup/' +
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
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

    addNewGroup(id) {
      this.axios
        .post(
          _global.businessUrl +
            '/rest/addCriminalGroup/' +
            this.laborId +
            '/' +
            id
        )
        .then(res => {
          this.$message.success(res)
          this.addFinish(this.laborId)
        })
    },

    // 打开列表修改模态框
    openUpdate(type, row) {
      this.updateParams = row
      this.updateParams.type = type
      this.updateVisible = true
    },

    // 打开列表修改模态框
    openGroup(row) {
      this.groupVisible = true
      this.laborId = row.id
      this.larborData = JSON.parse(JSON.stringify(row))
      this.getGroups(row.id)
    },
    handleCloseUpdateDialog() {
      this.updateVisible = false
    },
    handleCloseAdd() {
      this.addVisible = false
    },
    handleCloseEdit() {
      this.editVisible = false
    },
    handleCloseCriminal() {
      this.criminalVisible = false
    },
    handleClosePolice() {
      this.policeVisible = false
    },
    openCriminal(row) {
      this.criminalVisible = true
      this.criminalList = row.criminalList
    },
    openPolice(row) {
      this.policeVisible = true
      this.policeList = row.policeList
    },
    edit(rows) {
      this.editList = JSON.parse(JSON.stringify(rows))
      this.editVisible = true
    },

    selectionchange(val) {
      this.selIdList = val.map(Item => Item.id)
    },
    deleltAll() {
      this.del(this.selIdList)
    },
    del(row) {
      let param = []
      param.push(...row)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(_global.businessUrl + '/rest/delete', param)
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
      this.$confirm('确认修改预警状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        this.axios
          .get(_global.businessUrl + '/rest/updateWarn/' + id + '/' + flag)
          .then(res => {
            this.$message.success('更新成功')
            this.queryInfo()
          })
      )
    },
    groupChange(val) {
      console.log(val)
      this.selGroups = val
    },
    delGroups() {
      console.log(this.selGroups)
      let params = {}
      params.id = this.laborId
      params.type = 2
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
      params.type = 2
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
      params.type = 2
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
    queryTime(val) {
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
<style scoped>
.btn_box_inTable {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>