<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-26 20:12:23
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-15 10:43:09
 -->
<template>
  <menuTree :menuList="['系统管理','用户管理']">
    <table-view
      :tableData="tableData"
      noBottom
      v-loading="tableLoating"
      @sizeChange="getdata"
      @selectionchange="selChange"
    >
      <div slot="searchCondition">
        <el-form class="yn_form" ref="searchForm" :model="queryParams" inline :rules="searchRules">
          <el-form-item label="用户名:" prop="userName">
            <el-input class="yn_ipt" v-model="queryParams.userName"></el-input>
          </el-form-item>

          <el-form-item label="真实姓名:" prop="realName">
            <el-input class="yn_ipt" v-model="queryParams.realName"></el-input>
          </el-form-item>

          <el-form-item label="所属监狱:" prop="prisonName">
            <el-input class="yn_ipt" v-model="queryParams.prisonName"></el-input>
          </el-form-item>

          <el-form-item label="职务：" prop="workPosition">
            <el-select class="yn_ipt" v-model="queryParams.workPosition">
              <el-option
                v-for="(item,i) in worklist"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="addUser" type="primary">新增</el-button>
            <el-button class="yn_btn" @click="delRoleArr" type="primary">删除</el-button>
            <el-button class="yn_btn" @click="search" type="primary">查询</el-button>
            <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column type="selection" width="width" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="width" align="center"></el-table-column>
        <el-table-column prop="realName" label="姓名" width="width" align="center"></el-table-column>
        <el-table-column
          prop="policeCardNo"
          :formatter="formatterNo"
          label="警号"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="workPosition"
          :formatter="formatterWork"
          label="职务"
          width="width"
          align="center"
        ></el-table-column>

        <el-table-column label="角色" width="width" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="yn_btn" @click="showrole(scope.row)">查看角色</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="prisonName"
          label="所属监狱"
          width="width"
          min-width="100"
          align="center"
        ></el-table-column>
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
        <el-table-column prop="prop" label="操作" min-width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="txt_btn" @click="checkUser(scope.row)">查看</el-button>
            <el-button type="text" class="txt_btn" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="text" class="txt_btn" @click="delUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <el-dialog
      title="新增用户"
      class="yn_dialog"
      center
      :visible.sync="addVisible"
      width="60%"
      @close="dialogClose"
    >
      <div>
        <el-form
          class="yn_form"
          ref="addForm"
          :model="addParams"
          label-width="10rem"
          :rules="rules"
        >
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="用户名：" prop="userName">
                <el-input class="yn_ipt" v-model="addParams.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="密码：" prop="passWord">
                <el-input class="yn_ipt" v-model="addParams.passWord" show-password></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="确认密码：" prop="checkPass">
                <el-input class="yn_ipt" v-model="addParams.checkPass" show-password></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="所属部门：" prop="deptGuid">
                <el-cascader
                  :show-all-levels="false"
                  class="yn_cascader yn_ipt"
                  filterable
                  v-model="addParams.deptGuid"
                  :options="deptlist"
                  :props="deptProp"
                  ref="cascad"
                  @change="deptChange"
                  popper-class="dowm_box"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="真实姓名：" prop="realName">
                <el-input class="yn_ipt" v-model="addParams.realName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="身份证号：" prop="cardNo">
                <el-input class="yn_ipt" v-model="addParams.cardNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="单位地址：" prop="address">
                <el-input class="yn_ipt" v-model="addParams.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="联系电话：" prop="phoneNo">
                <el-input class="yn_ipt" v-model="addParams.phoneNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="邮箱：" prop="email">
                <el-input class="yn_ipt" v-model="addParams.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="年龄：" prop="age">
                <el-input-number
                  class="yn_ipt"
                  v-model="addParams.age"
                  :controls="false"
                  :min="1"
                  :max="100"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="警号：" prop="policeCardNo">
                <el-input class="yn_ipt" v-model="addParams.policeCardNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="职务：" prop="workPosition">
                <el-select class="yn_ipt" v-model="addParams.workPosition">
                  <el-option
                    v-for="(item,i) in worklist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="性别：" prop="address">
                <el-radio v-model="addParams.gender" :label="1">男</el-radio>
                <el-radio v-model="addParams.gender" :label="0">女</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          class="yn_btn"
          :disabled="btnFlag"
          type="primary"
          @click="$checkMessage(subAddPel)"
        >确 定</el-button>
        <el-button class="yn_btn" @click="addVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="checkModel === true ? '查看用户':'编辑用户'"
      center
      class="yn_dialog"
      :visible.sync="detailVisible"
      width="50%"
      @close="editclose"
    >
      <div>
        <el-form
          class="yn_form"
          ref="editForm"
          :model="detailParams"
          label-width="10rem"
          :rules="rules"
        >
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="用户名：" prop="userName">
                <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="真实姓名：" prop="realName">
                <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.realName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="警号：" prop="policeCardNo">
                <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.policeCardNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="身份证号：" prop="cardNo">
                <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.cardNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="单位地址：" prop="address">
                <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="联系电话：" prop="phoneNo">
                <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.phoneNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="所属部门：" prop="deptGuid">
                <el-cascader
                  class="yn_cascader yn_ipt"
                  :show-all-levels="false"
                  filterable
                  :disabled="checkModel"
                  v-model="detailParams.deptGuid"
                  :options="deptlist"
                  :props="deptProp"
                  ref="cascad"
                  @change="deptChange"
                  popper-class="dowm_box"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="年龄：" prop="age">
                <el-input-number
                  class="yn_ipt"
                  :disabled="checkModel"
                  v-model="detailParams.age"
                  :controls="false"
                  :min="1"
                  :max="100"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="职务：" prop="workPosition">
                <el-select
                  class="yn_ipt"
                  v-model="detailParams.workPosition"
                  :disabled="checkModel"
                >
                  <el-option
                    v-for="(item,i) in worklist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="邮箱：" prop="email">
                <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="性别：" prop="address">
                <el-radio v-model="detailParams.gender" :disabled="checkModel" :label="1">男</el-radio>
                <el-radio v-model="detailParams.gender" :disabled="checkModel" :label="0">女</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="checkModel">
            <el-form-item label="所属部门：">
              <div class="dept_route">{{detailParams.deptRoute}}</div>
            </el-form-item>
          </el-row>

          <el-row :gutter="10">
            <el-form-item label="绑定角色：">
              <div class="roles" v-for="(item,i) in userRolelist" :key="i">{{item.roleName}}</div>

              <el-button class="yn_btn" @click="showrole(detailParams)" type="danger ">角色面板</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          class="yn_btn"
          type="primary"
          @click="saveEdit"
          v-html="checkModel === true ? '确 定':'提交'"
          :disabled="btnFlag"
        ></el-button>
        <el-button class="yn_btn" @click="detailVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog class="yn_dialog" title="查看角色" center :visible.sync="showFlag" width="70%">
      <table-view :tableData="roleTableData" noIndex noBottom @sizeChange="getRoleData">
        <div slot="searchCondition">
          <el-form class="yn_form" ref="userInfo" :model="addParams" label-width="8rem">
            <el-form-item label="用户：">
              <div class="dept_route">{{userInfo.userName}}</div>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column prop="roleName" align="center" label="角色名"></el-table-column>
          <el-table-column prop="roleEnName" align="center" label="角色英文名"></el-table-column>

          <el-table-column prop="selt" label="是否绑定" align="center"></el-table-column>

          <el-table-column prop="selt" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="yn_btn"
                v-if="scope.row.selt=='已绑定'"
                @click="delRole(scope.row)"
              >解除绑定</el-button>
              <el-button
                type="text"
                class="yn_btn"
                v-if="scope.row.selt=='未绑定'"
                @click="saveRole(scope.row)"
              >添加绑定</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="showFlag = false">确 定</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>
<script>
import { MessageBox, Message, Loading } from 'element-ui'
import {
  expnoraml,
  isIDCard,
  Isphone,
  Isname,
  passwordStrengthValidator
} from '@/utils/form_valid.js'
import { clearChildren } from '@/utils'
import menuTree from '@/components/menu_tree/'

import tableView from '@/components/table_view/'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addParams.checkPass !== '') {
          this.$refs.addForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addParams.passWord) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableLoating: false,
      prisonType: '',
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      roleTableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {
        // 查询参数
        pageSize: 10,
        currentPage: 1
      },
      // 角色查询参数
      roleParams: {
        pageSize: 10,
        currentPage: 1,
        state: 0
      },
      worklist: [], // 职务
      // 表单验证
      searchRules: {
        userName: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml("用户名"), trigger: "blur" }
        ],
        realName: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
          //   { validator: Isname, trigger: "blur" }
        ]
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
          //   { min: 2, max: 8, message: "长度在 2到 8 个字符", trigger: "blur" },
          //   { validator: expnoraml("用户名"), trigger: "blur" }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 8,
            max: 15,
            message: '长度在 8 到 15 个字符',
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' },
          { validator: passwordStrengthValidator, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          {
            min: 8,
            max: 15,
            message: '长度在 8 到 15 个字符',
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' }
          //   { validator: expnoraml("密码"), trigger: "blur" }
        ],
        deptGuid: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        realName: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          //   { validator: Isname, trigger: "blur" }
        ],

        cardNo: [{ validator: isIDCard, trigger: 'blur' }],
        phoneNo: [{ validator: Isphone, trigger: 'blur' }],
        address: [
          {
            min: 2,
            max: 200,
            message: '长度在 2 到 200 个字符',
            trigger: 'blur'
          }
        ],
        policeCardNo: [
          {
            min: 2,
            max: 200,
            message: '长度在 2 到 200 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            min: 2,
            max: 200,
            message: '长度在 2 到 200 个字符',
            trigger: 'blur'
          }
        ],
        prisonName: [
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml("部门名"), trigger: "blur" }
        ]
      },
      addParams: {
        // 新增参数
      },
      detailParams: {
        // 详情和编辑参数
      },
      addVisible: false, // 新增模态框
      detailVisible: false,

      checkModel: false, // 查看模式
      editModel: false, // 编辑模式

      delarr: [], // 批量删除数组
      userInfo: {}, // 用户信息
      showFlag: false,
      userRolelist: [], // 当前用户已绑定角色
      btnFlag: false,
      prisonID: '', // 登录账号所在监狱id
      deptGuid: '', // 登录账号所在部门
      deptlist: [], // 部门数组
      deptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  components: { tableView, menuTree },

  created() {
    this.getdata()
    this.getRoleData()
    this.getdept()
    this.getworker()
    this.gettype()
  },

  methods: {
    formatterWork(row, column, cellValue, index) {
      if (cellValue) {
        let work = ''
        this.worklist.forEach(item => {
          if (item.value == cellValue) {
            work = item.label
          }
        })
        return work
      } else {
        return '暂无'
      }
    },
    formatterNo(row, column, cellValue, index) {
      if (!cellValue) {
        return '无'
      } else {
        return cellValue
      }
    },
    // 查询
    search() {
      console.log(this.$refs['searchForm'])

      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.getdata()
        } else {
          Message.error({ message: '请正确输入' })
          return false
        }
      })
    },
    // 角色更换页码数量
    roleSize(p) {
      this.roleParams.pageSize = p
      this.getRoleData()
    },
    rolePage(e) {
      this.roleParams.currentPage = e
      this.getRoleData()
    },

    // 获取职务
    getworker() {
      let that = this
      this.axios
        .get(this._global.userUrl + '/dictionary/option/WORK_POSITION')
        .then(res => {
          this.worklist = res
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取部门类型
    gettype() {
      let that = this
      this.axios
        .get(this._global.userUrl + '/dictionary/option/ORGANIZATION')
        .then(res => {
          console.log(res)
          res.forEach(item => {
            item.label == '监狱' ? (this.prisonType = item.value) : ''
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 根据登录用户所在监狱id获取其下部门
    getdept() {
      let that = this
      let user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        this.deptGuid = user.deptGuid
        let prisonID = user.prisonId
        this.axios
          .get(this._global.userUrl + '/compose/getChildrenTree/' + prisonID)
          .then(response => {
            clearChildren(response, 'list')

            that.deptlist = [response]
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        Message.error({ message: '未登录' })

        return false
      }
    },
    // 获取角色
    getRoleData() {
      let that = this
      this.roleParams.currentPage = this.roleTableData.pageNum
      this.roleParams.pageSize = this.roleTableData.pageSize
      let role = this.roleParams
      this.axios
        // .post(
        //   "http://10.64.81.59:8769/user/roleManage/getRoleByQueryPage/",
        //   role
        // )
        .post(this._global.userUrl + '/roleManage/getRoleByQueryPage/', role)
        .then(response => {
          response.list.forEach(item => {
            item.selt = '未绑定'
          })
          that.roleTableData.list = response.list
          that.roleTableData.total = response.total
          that.roleTableData.list.forEach(item => {
            that.userRolelist.forEach(obj => {
              if (item.roleId == obj.roleId) {
                item.selt = '已绑定'
                item.id = obj.id
              }
            })
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取用户
    getdata() {
      let that = this
      let prisonId = JSON.parse(localStorage.getItem('user')).prisonId
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryParams.pageSize = this.tableData.pageSize
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
          that.tableLoating = false
          that.tableData.list = response.list
          that.tableData.total = response.total
        })
        .catch(error => {
          that.tableLoating = false
          console.log(error)
        })
    },

    // 新增用户
    addUser() {
      this.addVisible = true
    },
    // 选择部门
    deptChange(e) {
      if (e) {
        if (e == 1) {
          this.prisonID = 1
        } else {
          let loadingInstance = Loading.service({
            lock: true,
            text: '查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            target: document.querySelector('.el-cascader__dropdown')
          })
          this.btnFlag = true
          this.axios
            .get(this._global.userUrl + '/department/getPrisonDeptId/' + e)
            .then(response => {
              this.prisonID = response
              loadingInstance.close()
              this.btnFlag = false
            })
            .catch(() => {
              this.prisonID = 1
            })
        }
      }
    },

    dialogClose() {
      console.log(this.addParams)
      this.prisonID = ''
      this.addParams = {}
      this.$refs['addForm'].clearValidate()
    },
    editclose() {
      this.prisonID = ''
      this.detailParams = {}
      this.$refs['editForm'].clearValidate()
    },
    // 保存新增用户
    subAddPel() {
      let that = this
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({
            lock: true,
            text: '新增中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          console.log(loadingInstance)

          let hunman = JSON.parse(JSON.stringify(this.addParams))
          hunman.prisonId = this.prisonID
          hunman.deptGuid = this.addParams.deptGuid
          this.axios
            .put(this._global.userUrl + '/userManage/addNewUser', hunman)
            .then(response => {
              that.addVisible = false

              that.addParams = {}
              loadingInstance.close()
              Message({
                type: 'success',
                message: '添加成功!'
              })
              that.getdata()
            })
            .catch(error => {
              console.log(error)
              loadingInstance.close()
            })
        } else {
          Message.error({ message: '请完整填写' })
          return false
        }
      })
    },
    // 多选
    selChange(e) {
      this.delarr = []
      e.forEach(item => {
        this.delarr.push(item.userGuid)
      })
    },

    // 批量删除
    delRoleArr() {
      let that = this
      if (this.delarr.length > 0) {
        let ids = this.delarr.join()
        MessageBox.confirm('此操作将永久删除, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.axios
              .delete(this._global.userUrl + '/userManage/delUser/' + ids)
              .then(response => {
                that.getdata()
                Message({
                  type: 'success',
                  message: '删除成功!'
                })
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

    delUser(row) {
      // 删除用户
      let that = this
      let idarr = []
      idarr.push(row.userGuid)
      let ids = idarr.join()
      MessageBox.confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(this._global.userUrl + '/userManage/delUser/' + ids)
            .then(response => {
              that.getdata()
              Message({
                type: 'success',
                message: '删除成功!'
              })
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
    // 打开或关闭
    switchChange(e) {
      this.axios
        .post(this._global.userUrl + '/userManage/editUser', e)
        .then(response => {
          this.getdata()
          Message({
            type: 'success',
            message: '添加成功!'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    checkUser(row) {
      // 查看用户
      this.editModel = false
      this.checkModel = true
      this.detailVisible = true
      this.detailParams = row
      this.axios
        .get(this._global.userUrl + '/userManage/getUserById/' + row.userGuid)
        .then(response => {
          this.detailParams.deptRoute = response.deptRoute
        })

      this.showrole(row)
      this.showFlag = false
    },
    editUser(row) {
      // 编辑用户
      this.checkModel = false
      this.editModel = true
      this.detailVisible = true
      this.detailParams = JSON.parse(JSON.stringify(row))
      this.showrole(row)
      this.showFlag = false
      console.log(this.detailParams)
    },
    // 保存编辑
    saveEdit() {
      if (this.checkModel) {
        this.detailVisible = false
      } else {
        this.$refs['editForm'].validate(valid => {
          if (valid) {
            let that = this
            let user = this.detailParams

            if (this.prisonID != '') {
              user.prisonId = this.prisonID
            }

            delete user.prisonName
            delete user.deptRoute
            let loadingInstance = Loading.service({
              lock: true,
              text: '修改中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.axios
              .post(this._global.userUrl + '/userManage/editUser', user)
              .then(response => {
                that.detailVisible = false

                loadingInstance.close()
                that.detailParams = {}
                Message({
                  type: 'success',
                  message: '编辑成功!'
                })
                that.getdata()
              })
              .catch(error => {
                loadingInstance.close()

                console.log(error)
              })
          } else {
            Message.error({ message: '请完整填写' })

            return false
          }
        })
      }
    },

    // 查看角色
    showrole(data) {
      this.showFlag = true
      this.userInfo = data
      this.roleTableData.list.forEach(item => {
        item.selt = '未绑定'
      })
      let that = this
      this.axios
        .get(
          this._global.userUrl +
            '/userRoleManage/getUserRoleByUserId/' +
            this.userInfo.userGuid
        )
        .then(response => {
          that.userRolelist = response
          that.roleTableData.list.forEach(item => {
            that.userRolelist.forEach(obj => {
              if (item.roleId == obj.roleId) {
                item.selt = '已绑定'
                item.id = obj.id
              }
            })
          })
        })
    },

    // 保存角色
    saveRole(data) {
      let that = this
      console.log(data)

      let record = {
        roleEnName: data.roleEnName,
        roleId: data.roleId,
        roleName: data.roleName,
        userId: that.userInfo.userGuid
      }
      this.axios
        .put(this._global.userUrl + '/userRoleManage/addUserRole', record)
        .then(response => {
          that.showrole(that.userInfo)
          Message({
            type: 'success',
            message: '绑定成功!'
          })
        })
    },
    // 删除角色关系
    delRole(data) {
      let that = this
      let record = {
        roleEnName: data.roleEnName,
        roleId: data.roleId,
        roleName: data.roleName,
        userId: this.userInfo.userGuid,
        id: data.id
      }
      this.axios
        .delete(this._global.userUrl + '/userRoleManage/delUserRole/' + data.id)
        .then(response => {
          console.log(response)
          that.showrole(that.userInfo)
          data.selt = '未绑定'
          Message({
            type: 'success',
            message: '解除绑定成功!'
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.statemsg {
  font-size: 1.1rem;
  margin: 0.4rem 0;
}
/deep/.el-radio__label {
  font-size: 1.1rem;
}
.roles {
  font-size: 1.1rem;
  margin: 0.2rem 0.5rem;
  display: inline-block;
}
/deep/ .el-input-number {
  height: 2.5rem;
  width: 100%;
}
.txt_btn {
  font-size: 1.1rem;
}
.yn_cascader {
  width: 100%;
  line-height: 30px;
}

.technology {
  .dept_route,
  .roles,
  .el-radio {
    color: #fff;
  }
}
</style>
