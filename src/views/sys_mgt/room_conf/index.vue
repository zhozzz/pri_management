<!--
 * @Description:房间管理
 * @Author:fylih
 * @Date: 2019-08-20 11:06:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 16:38:14
 -->
<template>
  <menuTree :menuList="['系统管理','房间管理']">
    <!-- <span class="yn_page_title">房间关系列表</span> -->
    <table-view noBottom :tableData="tableData" v-loading="tableLoating" @sizeChange="sizeChange">
      <div slot="searchCondition">
        <el-form class="yn_form" ref="form" inline :model="queryParams">
          <el-form-item label="房间编号：">
            <el-input class="yn_ipt" v-model="queryParams.roomId"></el-input>
          </el-form-item>
          <el-form-item label="房间类型:">
            <el-select class="yn_ipt" v-model="queryParams.roomType" placeholder="请选择">
              <el-option
                v-for="item in roomTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="addRoom" type="primary">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="queryInfo" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column prop="roomId" label="房间编号" width="width" align="center" />
        <el-table-column prop="roomTypeName" label="房间类型" width="width" align="center" />
        <el-table-column prop="departName" label="所属部门" width="width" align="center" />
        <el-table-column label="操作" width="width" align="center">
          <template slot-scope="scope">
            <el-button class="yn_text_btn" type="text" @click="editRoom(scope.row)">编辑</el-button>
            <el-button class="yn_text_btn" type="text" @click="delRoom(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <el-dialog
      title="新增房间"
      @close="addClose"
      center
      class="yn_dialog"
      :visible.sync="addVisible"
      width="60%"
    >
      <div>
        <el-form ref="addForm" class="yn_form" :model="addParams" :rules="rules" label-width="8rem">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="房间编号：" prop="roomId">
                <el-input class="yn_ipt" v-model="addParams.roomId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="房间类型:" prop="roomType">
                <el-select class="yn_ipt" v-model="addParams.roomType" placeholder="请选择">
                  <el-option
                    v-for="item in roomTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="所属部门：" prop="deptId">
                <el-cascader
                  class="yn_ipt yn_cascader"
                  :show-all-levels="false"
                  filterable
                  v-model="addParams.deptId"
                  :options="deptlist"
                  :props="deptProp"
                  ref="cascad"
                  @change="deptChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1" v-if="selCameraList.length>0">
              <el-form-item label="已绑定摄像头：" label-width="9rem">
                <el-popover placement="right" width="400" trigger="click">
                  <el-table class="yn_table" :data="selCameraList">
                    <el-table-column
                      prop="cameraId"
                      label="摄像头编号"
                      show-overflow-tooltip
                      width="width"
                      align="center"
                    />
                    <el-table-column
                      prop="cameraName"
                      label="摄像头名称"
                      show-overflow-tooltip
                      width="width"
                      align="center"
                    />
                    <el-table-column label="操作" width="width" align="center">
                      <template slot-scope="scope">
                        <el-button
                          class="yn_btn yn_text_btn"
                          type="text"
                          @click="removeCamera(scope.row)"
                        >取消绑定</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-button class="yn_btn" type="primary" slot="reference">查看</el-button>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <table-view
          noBottom
          :tableData="cameraTableData"
          v-loading="cameraTableLoading"
          @sizeChange="queryCameraList"
        >
          <div slot="searchCondition">
            <el-form ref="form" class="yn_form" label-width="8rem" :model="cameraQueryParams">
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="摄像头编号：">
                    <el-input class="yn_ipt" v-model="cameraQueryParams.cameraId"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="摄像头名称:">
                    <el-input class="yn_ipt" v-model="cameraQueryParams.cameraName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item>
                    <el-button class="yn_btn" @click="queryCameraList" type="primary">查询</el-button>

                    <el-button class="yn_btn" @click="resetCameraInfo" type="primary">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <template slot="table-column">
            <el-table-column prop="cameraId" label="摄像头编号" width="width" align="center" />
            <el-table-column prop="cameraName" label="摄像头名称" width="width" align="center" />
            <el-table-column label="操作" width="width" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.isSel"
                  class="yn_text_btn"
                  type="text"
                  @click="removeCamera(scope.row)"
                >取消绑定</el-button>
                <el-button v-else class="yn_text_btn" type="text" @click="addCamera(scope.row)">添加绑定</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="addSubmit">新 增</el-button>
        <el-button class="yn_btn" @click="addVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="yn_dialog" title="编辑房间" center :visible.sync="editVisible" width="60%">
      <div>
        <el-form
          class="yn_form"
          ref="editForm"
          :model="editParams"
          :rules="rules"
          label-width="8rem"
        >
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="房间编号:" prop="roomId">
                <el-input class="yn_ipt" v-model="editParams.roomId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="房间类型:" prop="roomType">
                <el-select class="yn_ipt" v-model="editParams.roomType" placeholder="请选择">
                  <el-option
                    v-for="item in roomTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="所属部门：" prop="deptId">
                <el-cascader
                  class="yn_ipt yn_cascader"
                  :show-all-levels="false"
                  filterable
                  v-model="editParams.deptId"
                  :options="deptlist"
                  :props="deptProp"
                  ref="cascad"
                  @change="deptChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1" v-if="selCameraList.length>0">
              <el-form-item label="已绑定摄像头：" label-width="9rem">
                <el-popover placement="right" width="400" trigger="click">
                  <el-table class="yn_table" :data="selCameraList">
                    <el-table-column
                      prop="cameraId"
                      label="摄像头编号"
                      width="width"
                      show-overflow-tooltip
                      align="center"
                    />
                    <el-table-column
                      prop="cameraName"
                      label="摄像头名称"
                      width="width"
                      show-overflow-tooltip
                      align="center"
                    />
                    <el-table-column label="操作" width="width" align="center">
                      <template slot-scope="scope">
                        <el-button
                          class="yn_text_btn"
                          type="text"
                          @click="removeCamera(scope.row)"
                        >取消绑定</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button class="yn_btn" type="primary" slot="reference">查看</el-button>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <table-view
          noBottom
          :tableData="cameraTableData"
          v-loading="cameraTableLoading"
          @sizeChange="queryCameraList"
        >
          <div slot="searchCondition">
            <el-form class="yn_form" ref="form" label-width="8rem" :model="cameraQueryParams">
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item label="摄像头编号:">
                    <el-input class="yn_ipt" v-model="cameraQueryParams.cameraId"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="摄像头名称:">
                    <el-input class="yn_ipt" v-model="cameraQueryParams.cameraName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item>
                    <el-button class="yn_btn" @click="queryCameraList" type="primary">查询</el-button>

                    <el-button class="yn_btn" @click="resetCameraInfo" type="primary">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <template slot="table-column">
            <el-table-column prop="cameraId" label="摄像头编号" width="width" align="center" />
            <el-table-column prop="cameraName" label="摄像头名称" width="width" align="center" />
            <el-table-column label="操作" width="width" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.isSel"
                  class="yn_text_btn"
                  type="text"
                  @click="removeCamera(scope.row)"
                >取消绑定</el-button>
                <el-button v-else class="yn_text_btn" type="text" @click="addCamera(scope.row)">添加绑定</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(editRoomSubmit)">确定</el-button>
        <el-button class="yn_btn" @click="editVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import _globalUrl from '@/utils/global_url'
import departSelect from '@/components/depart_select'
import { expnoraml } from '@/utils/form_valid'
import { clearChildren } from '@/utils'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tableView, departSelect, menuTree },
  data() {
    return {
      tableLoating: false,
      queryParams: {
        // 查询参数
        roomId: '',
        roomType: '',
        currentPage: '1',
        pageSize: '10'
      },
      cameraQueryParams: {
        // 查询参数
        currentPage: 1,
        pageSize: 5,
        cameraName: '',
        prisonId: getPrisonId()
      },
      addParams: {
        // 新增参数
        roomId: '',
        roomType: '',
        deptId: '',
        userId: JSON.parse(localStorage.getItem('user')).userGuid
      },
      roomTypes: [],
      tableData: {
        // 参数
        list: [],
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      cameraTableData: {
        // 参数
        list: [],
        total: 0,
        pageSize: 5,
        pageNum: 1
      },
      cameraTableLoading: false,
      editParams: {
        // 编辑参数
        id: '',
        roomId: '',
        roomType: '',
        floor: '',
        prisonArea: '',
        userId: JSON.parse(localStorage.getItem('user')).userGuid
      },
      deptlist: [], // 部门数组
      deptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true
      },
      deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
      addDeptOptions: [],
      editDeptOptions: [],
      addVisible: false, // 新增模态框
      editVisible: false, // 编辑模态框
      rules: {
        roomId: [
          { required: true, message: '请输入房间编号' },
          { validator: expnoraml('房间编号'), trigger: 'blur' }
        ],
        roomType: { required: true, message: '请选择房间类型' },
        deptId: { required: true, message: '请选择所属部门' }
      },
      selCameraList: []
    }
  },
  mounted() {
    this.queryInfo()
    this.queryCameraList()

    this.getdata()
    this.getdept()
    this.queryRoomTypeArr()
  },
  methods: {
    sizeChange() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryInfo()
    },
    queryRoomTypeArr() {
      // 查询房间类型
      let that = this
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/RoomType')
        .then(response => {
          this.roomTypes = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryCameraList() {
      this.cameraTableLoading = true
      this.cameraQueryParams.currentPage = this.cameraTableData.pageNum
      this.cameraQueryParams.pageSize = this.cameraTableData.pageSize
      this.axios
        .post(
          _globalUrl.userUrl + '/camera/queryCamera',
          this.cameraQueryParams
        )
        .then(res => {
          res.rows.map(item => {
            item.isSel = false
            this.selCameraList.map(obj => {
              obj.cameraId == item.cameraId ? (item.isSel = true) : ''
            })
          })

          this.cameraTableData.list = res.rows
          this.cameraTableData.total = res.total
          this.cameraTableLoading = false
        })
    },
    addRoom() {
      // 新增房间
      this.addVisible = true
      this.addParams = {}
      this.selCameraList = []
      this.cameraTableData.list.map(item => {
        item.isSel = false
      })
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let hunman = JSON.parse(JSON.stringify(this.addParams))
          hunman.prisonId = this.prisonID
          let len = this.addParams.deptId.length - 1
          hunman.deptId = this.addParams.deptId[len]
          hunman.cameraIds = this.selCameraList.map(item => {
            return item.id
          })
          this.axios
            .post(_globalUrl.userUrl + '/room/addRoom', hunman)
            .then(res => {
              this.$message.success('添加成功')
              this.addParams = {}
              this.addVisible = false
              this.queryInfo()
            })
        } else {
          return false
        }
      })
    },
    // 获取用户
    getdata() {
      let that = this
      let prisonId = JSON.parse(localStorage.getItem('user')).prisonId

      let user = this.queryParams
      user.prisonId = prisonId
      this.tableLoating = true
      this.axios
        // .post(
        //   "http://10.64.81.59:8769/user/userManage/getUserByQueryPage/",
        //   user
        // )
        .post(this._global.userUrl + '/userManage/getUserByQueryPage/', user)
        .then(response => {
          that.userdata = response.list
          that.dataCount = response.total
          this.tableLoating = false
        })
        .catch(error => {
          this.tableLoating = false
          console.log(error)
        })
    },
    // 根据登录用户所在监狱id获取其下部门
    getdept() {
      let that = this
      let user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        this.deptGuid = user.deptGuid
        this.prisonID = user.prisonId
        this.axios
          .get(
            this._global.userUrl + '/compose/getChildrenTree/' + this.prisonID
          )
          .then(response => {
            clearChildren(response, 'list')
            that.deptlist = [response]
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        this.$message.error({ message: '未登录' })

        return false
      }
    },
    // 选择部门
    deptChange(e) {
      let node = this.$refs['cascad'].getCheckedNodes()[0].data
      let prisonId = JSON.parse(localStorage.getItem('user')).prisonId
      if (e) {
        if (prisonId == '1') {
          if (e.length > 2) {
            this.prisonID = e[1]
          } else {
            this.prisonID = node.id
          }
        }
      }
    },
    delRoom(row) {
      // 删除房间
      this.$confirm('删除后不可恢复，确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.axios
            .delete(_globalUrl.userUrl + '/room/deleteRoom/' + row.id)
            .then(res => {
              this.$message.warning('删除成功')
              this.queryInfo()
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    queryInfo() {
      // 查询房间
      this.tableLoating = true
      this.axios
        .post(_globalUrl.userUrl + '/room/queryRoom', this.queryParams)
        .then(res => {
          console.log(res)
          this.tableData.list = res.rows
          this.tableData.total = res.total
          this.tableLoating = false
        })
    },
    resetInfo() {
      // 重置
      this.queryParams = {}
      this.tableData = {
        // 参数
        list: [],
        total: 0,
        pageSize: 10,
        pageNum: 1
      }

      this.queryInfo()
    },
    resetCameraInfo() {
      this.cameraQueryParams = {}
      this.cameraTableData = {
        // 参数
        list: [],
        total: 0,
        pageSize: 10,
        pageNum: 1
      }
      this.queryCameraList()
    },
    editRoom(row) {
      // 修改房间
      this.editParams = JSON.parse(JSON.stringify(row))
      this.editVisible = true

      if (this.editParams.cameras.length > 0) {
        this.selCameraList = this.editParams.cameras
      } else {
        this.selCameraList = []
      }

      this.cameraTableData.list.map(item => {
        item.isSel = false
        this.selCameraList.map(obj => [
          obj.cameraId === item.cameraId ? (item.isSel = true) : ''
        ])
      })
    },
    editRoomSubmit(row) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let user = this.editParams
          if (typeof this.editParams.deptId !== 'string') {
            user.deptId = this.editParams.deptId[
              this.editParams.deptId.length - 1
            ]
          }
          user.cameraIds = this.selCameraList.map(item => {
            return item.id
          })
          this.axios
            .put(_globalUrl.userUrl + '/room/updateRoom', user)
            .then(res => {
              this.$message.success('更新成功')
              this.editVisible = false
              this.queryInfo()
            })
        } else {
          return false
        }
      })
    },
    addCamera(row) {
      console.log(row)
      row.isSel = true
      this.selCameraList.push(row)
    },
    removeCamera(row) {
      row.isSel = false

      this.selCameraList.forEach((item, i) => {
        item.id == row.id ? this.selCameraList.splice(i, 1) : ''
      })
    },
    addClose() {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.btn_group {
  margin-bottom: 1rem;
}
.camera_transfer {
  width: 100%;
  .camera_transfer_inner {
    display: table;
    margin: 0 auto;
    /deep/.el-transfer__buttons {
      padding: 0 10px;
    }
  }
}
</style>
