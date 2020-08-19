<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-22 18:45:48
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 15:59:57
 -->
<template>
  <menuTree :menuList="['系统管理','角色管理']">
    <table-view
      :tableData="tableData"
      noBottom
      v-loading="tableLoating"
      @sizeChange="getdata"
      @selectionchange="selChange"
    >
      <div slot="searchCondition">
        <el-form class="yn_form" ref="searchForm" inline :model="queryParams" :rules="searchRules">
          <el-form-item label="角色名：" prop="roleName">
            <el-input class="yn_ipt" v-model="queryParams.roleName"></el-input>
          </el-form-item>

          <el-form-item label="英文名：" prop="roleEnName">
            <el-input class="yn_ipt" v-model="queryParams.roleEnName"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="yn_btn" @click="addRoles" type="primary">新增</el-button>
            <el-button class="yn_btn" @click="delRoleArr" type="primary">删除</el-button>
            <el-button class="yn_btn" @click="search" type="primary">查询</el-button>
            <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column type="selection" width="width" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="width" align="center"></el-table-column>
        <el-table-column prop="roleEnName" label="角色英文名" width="width" align="center"></el-table-column>
        <el-table-column prop="state" label="是否启用" width="width" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchChange(scope.row)"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
            <div class="statemsg">{{scope.row.state==0?'已启用':'未启用'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="width" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text">查看</el-button> -->
            <el-button class="yn_text_btn" @click="editUser(scope.row)" type="text">编辑</el-button>
            <el-button class="yn_text_btn" @click="delRole(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <el-dialog
      title="新增角色"
      class="yn_dialog"
      center
      :visible.sync="addVisible"
      width="50%"
      @close="dialogClose"
    >
      <div>
        <el-form :model="addform" :rules="rules" class="yn_form" ref="addForm">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input class="yn_ipt" v-model="addform.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" :label-width="formLabelWidth" prop="roleEnName">
            <el-input class="yn_ipt" v-model="addform.roleEnName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(saveAdd)">确 定</el-button>
        <el-button class="yn_btn" @click="addVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑"
      class="yn_dialog"
      center
      :visible.sync="editVisible"
      width="50%"
      @close="editClose"
    >
      <div>
        <el-form :model="editForm" :rules="rules" class="yn_form" ref="editForm">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input class="yn_ipt" v-model="editForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" :label-width="formLabelWidth" prop="roleEnName">
            <el-input class="yn_ipt" v-model="editForm.roleEnName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(saveEdit)">确 定</el-button>
        <el-button class="yn_btn" @click="editVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>
<script>
import { MessageBox, Message } from 'element-ui'
import { expnoraml, IDCard, Isphone, Isname } from '@/utils/form_valid.js'
import tableView from '@/components/table_view/'
import menuTree from '@/components/menu_tree/'

export default {
  data() {
    return {
      tableLoating: false,
      dataCount: 0, // 总数据
      type: '',
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      detailList: [
        // table详情
      ],
      queryParams: {
        pageSize: 10,
        currentPage: 1
      },
      addform: {}, // 新增
      // 表单验证
      searchRules: {
        roleName: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          //   { validator: expnoraml("角色名"), trigger: "blur" }
        ],
        roleEnName: [
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml("英文名称"), trigger: "blur" }
        ]
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          //   { validator: expnoraml("角色名"), trigger: "blur" }
        ],
        roleEnName: [
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml("英文名称"), trigger: "blur" }
        ]
      },
      formLabelWidth: '12rem',

      addVisible: false,
      editVisible: false,
      editForm: {},
      delarr: [] // 批量删除数组
    }
  },
  components: { tableView, menuTree },
  created() {
    this.getdata()
  },
  methods: {
    // 查询
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.getdata()
        } else {
          Message.error({ message: '请正确输入' })
          return false
        }
      })
    },

    // 获取角色
    getdata() {
      let that = this
      that.tableLoating = true
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryParams.pageSize = this.tableData.pageSize
      let role = this.queryParams
      this.axios
        .post(this._global.userUrl + '/roleManage/getRoleByQueryPage/', role)
        .then(response => {
          that.tableData.total = response.total
          that.tableData.list = response.list
          that.tableLoating = false
        })
        .catch(error => {
          console.log(error)
          that.tableLoating = false
        })
    },
    // 多选
    selChange(e) {
      this.delarr = []
      e.forEach(item => {
        this.delarr.push(item.roleId)
      })
    },
    addRoles() {
      // 新增用户
      this.addVisible = true
    },
    // 保存新增
    saveAdd() {
      let that = this
      let role = this.addform
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.axios
            .put(this._global.userUrl + '/roleManage/addNewRole', role)
            .then(response => {
              this.addVisible = false
              that.addform = {}
              Message({
                type: 'success',
                message: '添加成功!'
              })
              that.getdata()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请正确填写' })

          return false
        }
      })
    },

    dialogClose() {
      this.addform = {}

      this.$refs['addForm'].clearValidate()
    },
    editClose() {
      this.editForm = {}

      this.$refs['editForm'].clearValidate()
    },
    // 批量删除
    delRoleArr() {
      let that = this
      if (this.delarr.length > 0) {
        let ids = this.delarr.join()

        console.log(ids)
        MessageBox.confirm('此操作将永久删除, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.axios
              .delete(this._global.userUrl + '/roleManage/delRole/' + ids)
              .then(response => {
                that.getdata()
                if (response.status == 0) {
                  Message({
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  this.$message.error(response.msg)
                }
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(() => {
            Message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    delRole(row) {
      // 删除用户
      let that = this
      let idarr = []
      idarr.push(row.roleId)
      let ids = idarr.join()
      MessageBox.confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(this._global.userUrl + '/roleManage/delRole/' + ids)
            .then(response => {
              that.getdata()
              if (response.status == 0) {
                Message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else {
                this.$message.error(response.msg)
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetInfo() {
      // 重置
      this.queryParams = {
        pageSize: 10,
        currentPage: 1
      }
      this.$refs['searchForm'].clearValidate()
      this.getdata()
    },
    checkUser(row) {
      // 查看用户
      this.editVisible = true
      this.editForm = row
    },
    // 打开或关闭
    switchChange(e) {
      this.axios
        .post(this._global.userUrl + '/roleManage/editRole', e)
        .then(response => {
          Message({
            type: 'success',
            message: '修改成功!'
          })

          this.getdata()
        })
        .catch(error => {
          console.log(error)
        })
    },
    editUser(row) {
      // 编辑用户
      this.editVisible = true
      this.editForm = JSON.parse(JSON.stringify(row))
    },
    saveEdit() {
      let that = this
      let role = this.editForm
      console.log(role)

      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.axios
            .post(this._global.userUrl + '/roleManage/editRole', role)
            .then(response => {
              that.editVisible = false

              that.editForm = {}
              that.getdata()
              Message({
                type: 'success',
                message: '修改成功!'
              })
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请正确填写' })

          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.yn_item {
  margin-top: 1rem;
  margin-bottom: 1rem;
  line-height: 3rem;
}
.btn_group {
  margin-top: 0.4rem;
  text-align: center;
}
</style>
