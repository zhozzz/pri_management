<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-26 20:12:23
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:45:10
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','值班管理','基本数据','警员基本数据']">
      <!-- <div class="btn_box">
        <el-button class="yn_btn btn_pad" type="primary">警员基本数据</el-button>

        <el-button class="yn_btn btn_pad" @click="topage">罪犯基本数据</el-button>
       <el-button class="yn_btn btn_pad" @click="$router.push({name:'center_statisic'})">返回上报</el-button> 
      </div>-->
      <tab
        slot="heade_btn"
        name="罪犯基本数据"
        :left="true"
        pathName="criminal_manegement"
        leftName="警员基本数据"
      />
      <table-view :tableData="tableData" noBottom @sizeChange="sizeChange" v-loading="loading">
        <div slot="searchCondition">
          <el-form
            ref="searchForm"
            inline
            class="yn_form"
            :model="queryParams"
            :rules="searchRules"
          >
            <el-form-item label="警员姓名:" prop="realName">
              <el-input class="yn_ipt" v-model="queryParams.realName"></el-input>
            </el-form-item>

            <el-form-item label="警号:" prop="policeCardNo">
              <el-input class="yn_ipt" v-model="queryParams.policeCardNo"></el-input>
            </el-form-item>

            <el-form-item label="职务：" prop="workPosition">
              <el-select class="yn_ipt" clearable v-model="queryParams.workPosition">
                <el-option
                  v-for="(item,i) in worklist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="登记时间:">
              <!-- <div class="date_title">登记时间：</div> -->
              <el-date-picker
                :unlink-panels="true"
                class="yn_ipt yn_date_picker"
                v-model="date"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                align="right"
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <!-- <el-button class="yn_btn" @click="addUser" type="primary">新增</el-button> -->
              <el-button class="yn_btn" @click="search" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column prop="realName" label="姓名" width="width" align="center"></el-table-column>

          <el-table-column
            prop="prisonName"
            show-overflow-tooltip
            label="所属监狱"
            width="width"
            align="center"
          ></el-table-column>

          <el-table-column prop="policeCardNo" label="警号" width="width" align="center"></el-table-column>

          <el-table-column
            prop="workPosition"
            :formatter="formWork"
            label="职务"
            width="width"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="phoneNo"
            label="电话"
            width="width"
            align="center"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="gender"
            label="性别"
            width="width"
            :formatter="formSex"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="age" label="年龄" width="width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="scope">
              <div class="yn_btn_box_inTable">
                <el-button class="yn_text_btn" type="text" @click="checkUser(scope.row)">查看</el-button>
                <el-button class="yn_text_btn" type="text" @click="editUser(scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <el-dialog
        :title="checkModel === true ? '查看用户':'编辑用户'"
        center
        :visible.sync="detailVisible"
        width="50%"
        @close="editclose"
        class="deilogBox yn_dialog"
      >
        <div>
          <el-form
            class="yn_form"
            ref="editForm"
            :model="detailParams"
            label-width="8rem"
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
                  <el-input
                    class="yn_ipt"
                    :disabled="checkModel"
                    v-model="detailParams.policeCardNo"
                  ></el-input>
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
                <el-form-item label="登记时间：" prop="createTime">
                  <el-date-picker
                    class="yn_ipt"
                    v-model="detailParams.createTime"
                    value-format="timestamp"
                    type="date"
                    placeholder="未登记时间"
                    :disabled="checkModel"
                    @focus="datefocus"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="警衔：">
                  <el-input class="yn_ipt" :disabled="checkModel" v-model="detailParams.policyRank"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1" v-if="!checkModel">
                <el-form-item label="所属部门：" prop="deptGuid">
                  <el-cascader
                    class="yn_cascader yn_ipt"
                    :show-all-levels="false"
                    filterable
                    v-model="detailParams.deptGuid"
                    :options="deptlist"
                    :props="deptProp"
                    ref="cascad"
                    @change="deptChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="checkModel">
              <el-form-item label="所属部门：">
                <div class="deptRoute">{{detailParams.deptRoute}}</div>
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
          ></el-button>
          <el-button class="yn_btn" @click="detailVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </menuTree>
  </dept-layout>
</template>
<script>
import { MessageBox, Message, Loading } from 'element-ui'
import { expnoraml, isIDCard, Isphone, Isname } from '@/utils/form_valid.js'
import { pickerOptions } from '@/utils/picker_option_config.js'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId, clearChildren } from '@/utils'
import tableView from '@/components/table_view'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    deptLayout,
    tableView,
    menuTree,
    tab
  },
  data() {
    return {
      date: [], // 时间
      dataCount: 0, // 总数据
      queryParams: {
        // 查询参数
        pageSize: 10,
        currentPage: 1
      },
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      loading: true,
      worklist: [], // 职务

      searchRules: {
        realName: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          },
          { validator: Isname, trigger: 'blur' }
        ],
        policeCardNo: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          },
          { validator: expnoraml('警号'), trigger: 'blur' }
        ]
      },
      // 表单验证
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2到 50 个字符', trigger: 'blur' },
          { validator: expnoraml('用户名'), trigger: 'blur' }
        ],
        deptGuid: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        realName: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          },
          { validator: Isname, trigger: 'blur' }
        ],

        cardNo: [
          { required: true, message: '请输入用户身份证号', trigger: 'blur' },
          { validator: isIDCard, trigger: 'blur' }
        ],
        phoneNo: [{ validator: Isphone, trigger: 'blur' }],
        address: [
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
        ],
        policeCardNo: [
          { required: true, message: '请输入警号', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          },
          { validator: expnoraml('警号'), trigger: 'blur' }
        ]
      },

      detailParams: {
        // 详情和编辑参数
      },
      detailVisible: false,
      userdata: [], // 用户数组

      checkModel: false, // 查看模式
      editModel: false, // 编辑模式

      delarr: [], // 批量删除数组
      userInfo: {}, // 用户信息
      userRolelist: [], // 当前用户已绑定角色

      prisonId: '', // 登录账号所在监狱id
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

  created() {
    let user = JSON.parse(localStorage.getItem('user'))

    this.deptGuid = user.deptGuid
    this.prisonId = user.prisonId

    this.getworker()
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  methods: {
    topage() {
      this.$router.push({ name: 'criminal_manegement' })
    },
    // 查询
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.queryParams = {
            pageSize: 10,
            currentPage: 1
          }
          this.getdata()
        } else {
          Message.error({ message: '请正确输入' })
          return false
        }
      })
    },
    // 时间
    timeChange(data) {
      console.log(data)

      if (data != null) {
        this.queryParams.beginTime = Date.parse(data[0])
        this.queryParams.endTime = Date.parse(data[1])
      } else {
        this.queryParams.beginTime = ''
        this.queryParams.endTime = ''
      }
      console.log(this.queryParams)
    },
    // 格式化职务
    formWork(row, column, cellValue, index) {
      let workName = '暂未配置'
      this.worklist.forEach(item => {
        if (item.value == cellValue) {
          workName = item.label
        }
      })
      return workName
    },
    formSex(row, column, cellValue, index) {
      if (cellValue == 0) {
        return '女'
      } else if (cellValue == 1) {
        return '男'
      }
    },
    formTime(row, column, cellValue, index) {
      if (cellValue != null) {
        if (cellValue == 0) {
          return '未登记时间'
        } else {
          let date = new Date(cellValue)
          let y = date.getFullYear()
          let MM = date.getMonth() + 1
          MM = MM < 10 ? '0' + MM : MM
          let d = date.getDate()
          d = d < 10 ? '0' + d : d

          return y + '-' + MM + '-' + d
        }
      }
    },
    sizeChange() {
      this.getdata()
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
    // 根据登录用户所在监狱id获取其下部门
    getdept() {
      let that = this

      this.axios
        .get(this._global.userUrl + '/compose/getChildrenTree/' + this.prisonId)
        .then(response => {
          clearChildren(response, 'list')
          that.deptlist = [response]
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取用户
    getdata() {
      this.loading = true
      let that = this
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      let user = this.queryParams
      user.prisonId = this.prisonId
      this.axios
        .post(this._global.userUrl + '/userManage/getPolicyByQueryPage/', user)
        // .post(
        //   "http://10.64.81.59:8769/user/userManage/getPolicyByQueryPage",
        //   user
        // )
        .then(response => {
          that.tableData.list = response.list
          that.tableData.total = response.total
          this.loading = false
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 选择部门

    deptChange(e) {
      if (e) {
        if (e == 1) {
          this.selectPrisonId = 1
        } else {
          let loadingInstance = Loading.service({
            lock: true,
            text: '查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            target: document.querySelector('.el-cascader__dropdown')
          })
          this.axios
            .get(this._global.userUrl + '/department/getPrisonDeptId/' + e)
            .then(response => {
              this.selectPrisonId = response
              loadingInstance.close()
            })
        }
      }
    },

    editclose() {
      this.detailParams = {}
      this.$refs['editForm'].clearValidate()
    },
    // 多选
    selChange(e) {
      this.delarr = []
      e.forEach(item => {
        this.delarr.push(item.userGuid)
      })
    },

    resetInfo() {
      // 重置
      this.queryParams = {
        pageSize: 10,
        currentPage: 1
      }
      this.date = []
      this.$refs['searchForm'].clearValidate()

      this.getdata()
    },
    // 打开或关闭
    switchChange(e) {
      this.axios
        .post(this._global.userUrl + '/userManage/editUser', e)
        .then(response => {
          this.getdata()
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
      this.userInfo = row
    },
    editUser(row) {
      // 编辑用户
      this.checkModel = false
      this.editModel = true
      this.detailVisible = true
      this.detailParams = JSON.parse(JSON.stringify(row))

      this.userInfo = row
    },
    datefocus() {
      if (this.detailParams.createTime == 0) {
        this.detailParams.createTime = new Date().getTime()
      }
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

            user.prisonId = this.selectPrisonId
            user.deptGuid = this.detailParams.deptGuid

            this.axios
              .post(this._global.userUrl + '/userManage/editUser', user)
              .then(response => {
                that.detailVisible = false

                that.detailParams = {}
                that.getdata()
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            Message.error({ message: '请完整填写' })

            return false
          }
        })
      }
    },
    nodeClick(val) {
      console.log(val)
      this.prisonId = val.id
      this.deptGuid = val.id
      console.log(this.prisonId)
    }
  },
  watch: {
    prisonId(val) {
      this.getdata()
      this.getdept()
    }
  }
}
</script>
<style lang="less" scoped>
.btn_group {
  padding-top: 0.5rem;
}
.statemsg {
  font-size: 1.1rem;
  margin: 0.4rem 0;
}
.roles {
  font-size: 1.2rem;
  margin: 0.2rem 0.5rem;
  display: inline-block;
}

/deep/ .yn_date_picker {
  width: 100%;
  font-size: 1.1rem;
  border: 1px solid rgb(153, 151, 151);
}
/deep/ .el-date-editor.el-input {
  height: 2.5rem;
  width: 100%;
}
/deep/ .el-date-editor--daterange.el-input__inner {
  font-size: 1.2rem;
  width: 100%;
}
.deilogBox {
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.btn_box {
  margin: 1rem;
  .btn_pad {
    a {
      text-decoration: none;
    }
  }
}
.technology {
  .deptRoute {
    color: #fff;
  }
}
</style>
