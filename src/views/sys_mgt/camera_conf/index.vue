<!--
 * @Description:摄像头管理
 * @Author:fylih
 * @Date: 2019-08-20 11:06:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 16:41:42
 -->
<template>
  <menuTree :menuList="['系统管理','摄像头管理']">
    <table-view noBottom :tableData="tableData" v-loading="tableLoading" @sizeChange="queryInfo">
      <div slot="searchCondition">
        <el-form class="yn_form" ref="form" inline :model="queryParams">
          <el-form-item label="摄像头编号:">
            <el-input class="yn_ipt" v-model="queryParams.cameraId"></el-input>
          </el-form-item>
          <!-- <el-form-item label="摄像头名称:">
            <el-input class="yn_ipt"
                      v-model="queryParams.cameraName"></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="房间编号:">
            <el-select class="yn_ipt" v-model="queryParams.roomId" placeholder="请选择">
              <el-option
                v-for="item in roomIds"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item>
            <el-button class="yn_btn" @click="addCamera" type="primary">新增</el-button>
          </el-form-item>-->
          <el-form-item>
            <el-button class="yn_btn" @click="queryInfo" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column prop="cameraId" label="摄像头编号" width="width" align="center" />
        <el-table-column prop="cameraName" label="摄像头名称" width="width" align="center" />
        <!-- <el-table-column prop="roomId" label="房间编号" width="width" align="center" />
        <el-table-column prop="roomType" label="房间类型" width="width" align="center" />-->
        <el-table-column label="操作" width="width" align="center">
          <template slot-scope="scope">
            <!-- <el-button class="yn_text_btn" type="text" @click="editCamera(scope.row)">编辑</el-button> -->
            <el-button class="yn_text_btn" type="text" @click="delCamera(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <el-dialog
      title="新增摄像头"
      @close="addClose"
      class="yn_dialog"
      center
      :visible.sync="addVisible"
      width="50%"
    >
      <div>
        <el-form class="yn_form" :rules="rules" ref="addForm" :model="addParams" label-width="8rem">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="摄像头编号:" prop="cameraId">
                <el-input class="yn_ipt" v-model="addParams.cameraId"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="11" :offset="1">
              <el-form-item label="房间编号:">
                <el-select class="yn_ipt" v-model="addParams.roomId" placeholder="请选择">
                  <el-option
                    v-for="item in roomIds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(addSubmit)">确 定</el-button>
        <el-button class="yn_btn" @click="addVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="yn_dialog"
      inline
      title="编辑摄像头"
      center
      :visible.sync="editVisible"
      width="50%"
    >
      <el-form class="yn_form" ref="editForm" :rules="rules" :model="editParams" label-width="8rem">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="摄像头编号:" prop="cameraId">
              <el-input class="yn_ipt" v-model="editParams.cameraId"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="11" :offset="1">
            <el-form-item label="房间编号:">
              <el-select class="yn_ipt" v-model="editParams.roomId" placeholder="请选择">
                <el-option
                  v-for="item in roomIds"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(editSubmit)">确 定</el-button>
        <el-button class="yn_btn" @click="editVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import _globalUrl from '@/utils/global_url'
import { expnoraml } from '@/utils/form_valid'
import menuTree from '@/components/menu_tree/'
import { getPrisonId } from '@/utils'

export default {
  components: { tableView, menuTree },
  data() {
    return {
      tableLoading: false,
      queryParams: {
        // 查询参数
        currentPage: 1,
        pageSize: 10,
        roomId: '',
        cameraName: '',
        roomType: '',
        prisonId: getPrisonId()
      },
      addParams: {
        // 新增参数
        cameraId: '',
        cameraName: '',
        roomId: '',
        createUser: JSON.parse(localStorage.getItem('user')).userGuid
      },
      roomIds: [], // 房间号
      addVisible: false, // 新增模态框
      editVisible: false, // 摄像头模态框
      tableData: {
        list: [],
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      editParams: {
        cameraId: '',
        roomId: ''
      },
      rules: {
        cameraId: [
          { required: true, message: '请输入摄像头名称' },
          { validator: expnoraml('摄像头编号') }
        ]
      }
    }
  },
  mounted() {
    this.queryInfo()
    this.queryRoomIdsArr()
  },
  methods: {
    queryInfo() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryParams.prisonId = getPrisonId()

      this.tableLoading = true
      this.axios
        .post(_globalUrl.userUrl + '/camera/queryCamera', this.queryParams)
        .then(res => {
          console.log(res.rows)
          this.tableData.list = res.rows
          this.tableData.total = res.total
          this.tableLoading = false
        })
    },
    queryRoomIdsArr() {
      // 查询房间号
      this.axios
        .get(_globalUrl.userUrl + '/room/queryRoomIds')
        .then(response => {
          this.roomIds = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    delCamera(row) {
      // 删除摄像头
      this.$confirm('删除后不可恢复，确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.axios
            .delete(_globalUrl.userUrl + '/camera/deleteCamera/' + row.id)
            .then(res => {
              this.$message.warning('删除成功')
              this.queryInfo()
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    resetInfo() {
      // 重置
      this.queryParams = {}
      this.tableData.pageSize = 10
      this.tableData.pageNum = 1
      this.queryInfo()
    },
    editCamera(row) {
      // 修改摄像头
      this.editVisible = true
      this.editParams = JSON.parse(JSON.stringify(row))
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.axios
            .put(_globalUrl.userUrl + '/camera/updateCamera', this.editParams)
            .then(res => {
              this.$message.success('修改成功')
              this.queryInfo()
              this.editVisible = false
            })
        } else {
          return false
        }
      })
    },
    addCamera() {
      // 新增摄像头
      this.addVisible = true
      this.addParams = {}
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.axios
            .post(_globalUrl.userUrl + '/camera/addCamera', this.addParams)
            .then(res => {
              this.$message.success('添加成功')
              this.addParams = {}
              this.queryInfo()
              this.addVisible = false
            })
        } else {
          return false
        }
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
