<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-30 14:03:10
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 15:50:10
 -->
<template>
  <!-- <span class="yn_page_title">菜单管理</span> -->
  <menuTree :menuList="['系统管理','菜单管理']">
    <table-view
      :tableData="tableData"
      noIndex
      noBottom
      v-loading="tableLoating"
      @sizeChange="queryMenu"
    >
      <div slot="searchCondition">
        <el-form class="yn_form" ref="searchForm" :model="queryParams" inline :rules="searchRules">
          <el-form-item label="菜单名称：" prop="menuName">
            <el-input class="yn_ipt" v-model="queryParams.menuName"></el-input>
          </el-form-item>

          <el-form-item label="归属模块：">
            <el-cascader
              class="yn_ipt yn_cascader"
              v-model="queryValue"
              :options="queryTree"
              :props="defaultProps"
              :show-all-levels="false"
              clearable
              v-loading="treeLoating"
              @change="queryChange"
            ></el-cascader>
          </el-form-item>

          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="addVisible = true">新增</el-button>
            <el-button class="yn_btn" type="primary" @click="searchMenu">查询</el-button>
            <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column prop="menuName" label="菜单名称" width="width" align="center"></el-table-column>
        <el-table-column prop="parentName" label="归属模块" width="width" align="center"></el-table-column>
        <el-table-column prop="menuEnname" label="菜单路径" width="width" align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="formatDate"
          label="创建时间"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column prop="createName" label="创建人" width="width" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" width="width" align="center"></el-table-column>
        <el-table-column
          prop="status"
          :formatter="formatStatus"
          label="是否可见"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="width" align="center">
          <template slot-scope="scope">
            <el-button class="yn_text_btn" type="text" @click="editMenu(scope.row)">编辑</el-button>
            <el-button class="yn_text_btn" type="text" @click="deleteMenu(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <el-dialog
      title="新增"
      class="yn_dialog"
      center
      :visible.sync="addVisible"
      width="50"
      @close="closeAdd"
    >
      <el-form :model="addParams" class="yn_form" label-width="9rem" :rules="rules" ref="addParam">
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input class="yn_ipt" v-model="addParams.menuName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单路径：" prop="menuEnname">
          <el-input class="yn_ipt" v-model="addParams.menuEnname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="归属模块：" prop="parentName">
          <el-cascader
            v-model="addParams.parentName"
            class="yn_ipt yn_cascader"
            :options="addTree"
            :props="defaultProps"
            :show-all-levels="false"
            clearable
            @change="addChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="显示在工作台：" prop="isInWorkBench">
          <!-- <el-radio v-model="addParams.isInWorkBench" label="0">否</el-radio>
          <el-radio v-model="addParams.isInWorkBench" label="1">是</el-radio>-->
          <el-switch
            v-model="addParams.isInWorkBench"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="addParams.status" label="0">可见</el-radio>
          <el-radio v-model="addParams.status" label="1">不可见</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(addMenu)">确 定</el-button>
        <el-button class="yn_btn" @click="addVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑"
      center
      :visible.sync="editVisible"
      width="50"
      class="yn_dialog"
      @close="closeEdit"
    >
      <el-form
        :model="editParams"
        label-width="9rem"
        class="yn_form"
        :rules="rules"
        ref="editParams"
      >
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input class="yn_ipt" v-model="editParams.menuName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单路径：" prop="menuEnname">
          <el-input class="yn_ipt" v-model="editParams.menuEnname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="归属模块：" prop="parentName">
          <el-cascader
            v-model="editParams.parentName"
            class="yn_ipt yn_cascader"
            :options="editTree"
            :props="defaultProps"
            :show-all-levels="false"
            clearable
            @change="editChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input class="yn_ipt" type="number" v-model="editParams.sort"></el-input>
        </el-form-item>
        <el-form-item label="显示在工作台：" prop="isInWorkBench">
          <el-switch
            v-model="editParams.isInWorkBench"
            active-value="1"
            inactive-value="0"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="工作台图标：" prop="menuIcon">
          <el-upload
            class="upload-demo"
            :action="_global.businessUrl+'/file/upload'"
            :limit="1"
            :on-success="editupsuccess"
            :on-remove="editremovefile"
            :before-upload="beforeAvatarUpload"
            list-type="picture-card"
            :file-list="menuIconList"
            :on-exceed="overExceed"
          >
            <el-button class="yn_btn" type="primary">添加</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="editParams.status" label="0">可见</el-radio>
          <el-radio v-model="editParams.status" label="1">不可见</el-radio>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(updateMenu)">确 定</el-button>
        <el-button class="yn_btn" @click="editVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>
<script>
import { MessageBox, Message, Loading } from 'element-ui'
import { expnoraml, IDCard, Isphone, Isname } from '@/utils/form_valid.js'
import tableView from '@/components/table_view/'
import menuTree from '@/components/menu_tree/'

export default {
  data() {
    return {
      menuData: [],
      tableLoating: false,
      treeLoating: false,
      queryParams: {
        menuName: '',
        parentName: '',
        currentPage: 1,
        pageSize: 10,
        permissionId: ''
      },
      addParams: {
        status: '0',
        createName: JSON.parse(localStorage.getItem('user')).userGuid
      },
      editParams: {
        menuName: '',
        parentName: '',
        menuEnname: '',
        status: '0',
        menuId: '',
        sort: ''
      },
      searchRules: {
        menuName: [
          { min: 2, max: 15, message: '长度在 2到 15 个字符', trigger: 'blur' },
          { validator: expnoraml('菜单名'), trigger: 'blur' }
        ]
      },
      rules: {
        menuName: [
          { min: 2, max: 15, message: '长度在 2到 15 个字符', trigger: 'blur' },
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        menuEnname: [
          {
            min: 2,
            max: 200,
            message: '长度在 2到 200 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '请选择归属模块', trigger: 'blur' }
        ]
      },
      dataCount: 0,
      addVisible: false,
      editVisible: false,
      value: [],
      queryValue: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
        value: 'menuName',
        checkStrictly: true
      },
      editTree: [],
      queryTree: [],
      addTree: [],
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      menuIconList: []
    }
  },
  components: { tableView, menuTree },
  created() {
    this.queryMenu()
    this.getMenuTree()
  },
  methods: {
    // 得到菜单树
    getMenuTree() {
      this.treeLoating = true
      this.axios.get(this._global.userUrl + '/menu/getMenuTree').then(data => {
        this.treeLoating = false
        this.editTree = data
        this.addTree = data
        this.queryTree = data
        this.setChildren(data)
      })
    },
    // 递归处理菜单树
    setChildren(par) {
      for (let i in par) {
        if (par[i].children) {
          if (par[i].children.length === 0) {
            par[i].children = undefined
          } else {
            this.setChildren(par[i].children)
          }
        } else {
          par[i].children = undefined
        }
      }
    },
    // 新增赋值
    addChange(value) {
      if (value !== undefined) {
        this.addParams.parentName = value[value.length - 1]
      }
    },
    // 修改赋值
    editChange(value) {
      if (value !== undefined) {
        this.editParams.parentName = value[value.length - 1]
      }
    },
    reset() {
      this.queryParams = {}
      this.queryMenu()
      this.$refs['searchForm'].clearValidate()
    },
    // 查询赋值
    queryChange(value) {
      this.queryParams.parentName = value[value.length - 1]
    },
    searchMenu() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.queryMenu()
        } else {
          Message.error({ message: '请正确填写' })

          return false
        }
      })
    },
    // 删除菜单
    deleteMenu(par) {
      MessageBox.confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(this._global.userUrl + '/menu/deleteMenu/' + par.menuName)
            .then(data => {
              this.$message.success(data + '')
              this.queryMenu()
              this.$emit('getNewMenu', data)
            })
        })
        .catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 清空新增参数
    cleanParam() {
      this.addParams.menuName = ''
      this.addParams.parentName = ''
      this.addParams.menuEnname = ''
      this.addParams.status = '0'
    },
    // 格式化时间
    formatDate(row, column, cellValue, index) {
      let date = new Date(cellValue)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d
      // return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    },
    // 格式化是否可见列
    formatStatus(row, column, cellValue, index) {
      if (cellValue === 0) {
        return '可见'
      }
      return '不可见'
    },
    // 查询菜单
    queryMenu() {
      this.tableLoating = true
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryParams.pageSize = this.tableData.pageSize
      this.axios
        .post(this._global.userUrl + '/menu/list', this.queryParams)
        .then(data => {
          console.log(data)
          this.tableLoating = false
          this.tableData.total = data.total
          this.tableData.list = data.rows
        })
    },
    // 打开编辑弹出赋值
    editMenu(par) {
      this.editParams.menuName = par.menuName
      this.editParams.menuId = par.menuId
      this.editParams.menuEnname = par.menuEnname
      this.editParams.parentName = par.parentName
      this.editParams.status = par.status + ''
      this.editParams.sort = par.sort
      this.editVisible = true
      console.log(par)

      if (par.menuIcon != null) {
        this.menuIconList = [{ url: par.menuIcon, name: par.menuName }]
      }
      console.log(this.menuIconList)
    },
    // 编辑菜单
    updateMenu() {
      this.$refs['editParams'].validate(valid => {
        if (valid) {
          this.axios
            .put(this._global.userUrl + '/menu/update', this.editParams)
            .then(data => {
              this.$message.success(data + '')
              this.queryMenu()
              this.$emit('getNewMenu', data)
            })
          this.editVisible = false
        } else {
          Message.error({ message: '请正确填写' })

          return false
        }
      })
    },
    // 新增菜单
    addMenu() {
      this.$refs['addParam'].validate(valid => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.addParams))
          this.axios
            .post(this._global.userUrl + '/menu/addMenu', param)
            .then(data => {
              this.$message.success(data + '')
              this.queryMenu()
              this.cleanParam()
              this.$emit('getNewMenu', data)
            })
          this.addVisible = false
        } else {
          Message.error({ message: '请正确填写' })

          return false
        }
      })
    },
    closeAdd() {
      this.cleanParam()

      this.$refs['addParam'].clearValidate()
    },
    closeEdit() {
      this.$refs['editParams'].clearValidate()
      this.menuIconList = []
    },
    editupsuccess(res, file, fileList) {
      this.editParams.menuIcon = res.data.filePath
      this.$message.success('上传成功')

      Loading.service().close()
    },
    editremovefile(file, fileList) {
      this.editParams.menuIcon = null

      this.axios
        .delete(
          this._global.businessUrl + '/file/delete/' + file.response.data.fileId
        )
        .then(res => {
          console.log(res)
          this.$message.success(res)
        })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式和 PNG 格式!')
      } else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      } else {
        Loading.service({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      return isJPG && isLt2M
    },
    overExceed(file, fileList) {
      MessageBox.confirm('最多上传一张图片, 是否删除已上传图片?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.editParams.menuIcon = null
          this.menuIconList = []
        })
        .catch(err => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.yn_item {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
