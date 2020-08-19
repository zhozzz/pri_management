<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:46:47
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','值班管理','基本数据','罪犯基本数据']">
      <!-- <div class="btn_box">
        <el-button class="yn_btn btn_pad" @click="topage">警员基本数据</el-button>
        <el-button class="yn_btn btn_pad" type="primary">罪犯基本数据</el-button>
        <el-button class="yn_btn btn_pad" @click="$router.push({name:'center_statisic'})">返回上报</el-button>
      </div>-->
      <tab
        slot="heade_btn"
        name="罪犯基本数据"
        :right="true"
        pathName="police_management"
        leftName="警员基本数据"
      />
      <table-view :tableData="tableData" noBottom @sizeChange="sizeChange" v-loading="loading">
        <div slot="searchCondition">
          <el-form ref="queryForm" inline class="yn_form" :rules="searchRules" :model="queryParams">
            <el-form-item label="罪犯编号" prop="zfNum">
              <el-input class="yn_ipt" v-model="queryParams.zfNum"></el-input>
            </el-form-item>

            <el-form-item label="罪犯姓名" prop="zfName">
              <el-input class="yn_ipt" v-model="queryParams.zfName"></el-input>
            </el-form-item>

            <el-form-item label="入监时间">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="datePicker"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="daterange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="部门">
              <departSelect v-model="queryParams.deptId" />
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn sub_btn" type="primary" @click="search">查询</el-button>
              <el-button class="yn_btn" type="primary" @click="resetInfo">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column show-overflow-tooltip align="center" prop="zfNum" label="罪犯编号" />
          <el-table-column show-overflow-tooltip align="center" label="是否重点罪犯" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isKey == 0" @click="$markKeyCriminal(scope.row.id,1,search)">否</span>
              <span
                v-else-if="scope.row.isKey == 1"
                @click="$markKeyCriminal(scope.row.id,0,search)"
              >是</span>
            </template>
          </el-table-column>
          <!-- <el-table-column show-overflow-tooltip align="center" prop="zfCard" label="身份证号" /> -->
          <el-table-column show-overflow-tooltip align="center" prop="zfName" label="姓名" />
          <el-table-column show-overflow-tooltip align="center" prop="deptName" label="部门" />
          <el-table-column show-overflow-tooltip align="center" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.zfGender == 0">女</span>
              <span v-else-if="scope.row.zfGender == 1">男</span>
            </template>
          </el-table-column>
          <!-- <el-table-column show-overflow-tooltip align="center" prop="zfBirth" label="生日" />
          <el-table-column show-overflow-tooltip align="center" prop="zfCountry" label="国籍" />
          <el-table-column show-overflow-tooltip align="center" prop="zfBornPlace" label="籍贯" />-->
          <el-table-column show-overflow-tooltip align="center" prop="zfTypeName" label="分管等级" />
          <el-table-column show-overflow-tooltip align="center" prop="intoTime" label="入监时间" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="zfAccusationName"
            :formatter="accusationType"
            label="罪名"
          />
          <!-- <el-table-column show-overflow-tooltip align="center" prop="height" label="身高" />
          <el-table-column show-overflow-tooltip align="center" prop="weight" label="体重" />
          <el-table-column show-overflow-tooltip align="center" prop="age" label="年龄" />-->
          <!-- <el-table-column
            show-overflow-tooltip
            align="center"
            prop="updateTime"
            label="最近更新时间"
            min-width="120"
          />-->
          <!-- <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间" /> -->
          <el-table-column min-width="300" align="center" prop="prop" label="操作">
            <template slot-scope="scope">
              <div class="yn_btn_box_inTable">
                <el-button
                  v-if="scope.row.isOut!=1"
                  type="text"
                  class="yn_text_btn"
                  @click="edit(scope.row)"
                >编辑</el-button>
                <criminal-register
                  :prisonId="prisonId"
                  v-if="scope.row.isOut!=1"
                  :criminalId="scope.row.id"
                ></criminal-register>
                <criminalFile :criminalId="scope.row.id">查看档案</criminalFile>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <edit-dialog
        :editVisible="editVisible"
        :handleCloseEdit="handleCloseEdit"
        :editList="editParams"
        @updateSuc="queryInfo"
      ></edit-dialog>
      <el-dialog title="包夹罪犯列表" :visible.sync="relateVisible" class="yn_dialog" center width="50%">
        <div></div>
        <div slot="footer">
          <el-button type="primary" @click="relateVisible = false">确 定</el-button>
          <el-button @click="relateVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </menuTree>
  </dept-layout>
</template>
<script>
import tableView from '@/components/table_view'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import editDialog from './edit_dialog'
import _globalUrl from '@/utils/global_url'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import { pickerOptions } from '@/utils/picker_option_config.js'
import { expnoraml, isIDCard } from '@/utils/form_valid'
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import { formatDate } from '@/utils/date'
import menuTree from '@/components/menu_tree/'
import departSelect from '@/components/depart_select/'
import tab from '@/components/tab/index.vue'

export default {
  components: {
    tableView,
    editDialog,
    criminalRegister,
    deptLayout,
    criminalFile,
    menuTree,
    departSelect,
    tab
  },
  data() {
    return {
      checkInVisible: false,
      editVisible: false,
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      editParams: {},
      queryParams: {
        pageSize: 10,
        currentPage: 1,
        beginDate: '',
        endDate: '',
        deptId: ''
      },
      loading: true,
      datePicker: '',
      relateVisible: false,
      prisonId: getPrisonId(),
      searchRules: {
        zfName: [
          { message: '请输入姓名', trigger: 'blur' },
          { validator: expnoraml('姓名'), trigger: 'blur' }
        ],
        zfNum: [
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.$route.params.datePicker) {
      this.datePicker = this.$route.params.datePicker
      this.queryParams.beginDate = this.datePicker[0]
      this.queryParams.endDate = this.datePicker[1]
    }
  },
  mounted() {
    this.queryInfo()
    // this.queryCriminalType()
  },
  methods: {
    topage() {
      this.$router.push({ name: 'police_management' })
    },
    sizeChange() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryInfo()
    },
    search() {
      this.$refs['queryForm'].validate(val => {
        if (val) {
          this.tableData.pageNum = 1
          this.tableData.pageSize = 10
          this.queryInfo()
        } else {
          this.$message.error('请正确输入')
        }
      })
    },
    resetInfo() {
      // 重置
      this.queryParams = {
        pageSize: 10,
        currentPage: 1
      }
      this.date = []
      this.$refs['queryForm'].clearValidate()
      this.datePicker = ''
      this.queryInfo()
    },
    // 查询所有
    queryInfo() {
      this.loading = true

      if (!this.queryParams.deptId) {
        this.queryParams.deptId = this.prisonId
      }
      //   else {
      //     // this.queryParams.deptId = getPrisonId()
      //     this.queryParams.deptId = JSON.parse(
      //       localStorage.getItem('user')
      //     ).deptGuid
      //   }
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      let param = {}
      Object.assign(param, this.queryParams)
      if (param.beginDate && param.endDate) {
        param.beginDate =
          formatDate(param.beginDate, 'yyyy-MM-dd ') + '00:00:00'
        param.endDate = formatDate(param.endDate, 'yyyy-MM-dd ') + '23:59:59'
      }
      this.axios
        .post(_globalUrl.businessUrl + '/criminalBase/selAll', param)
        .then(res => {
          this.tableData.list = res.rows
          this.tableData.total = res.total
          this.loading = false
        })
    },
    // 编辑
    edit(row) {
      this.editParams = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.editVisible = true
      })
    },
    // 关闭入监模态框
    handleCloseEdit() {
      this.editVisible = false
      this.editParams = {}
    },
    // 包夹罪犯模态框
    // checkRelate (row) {
    //   this.relateVisible = true
    // }
    nodeClick(val) {
      this.prisonId = val.id
    },
    accusationType(row, col, cellvalue, index) {
      let str = ''
      row.criminalAccusations.map(item => {
        str += item.label + '；'
      })
      str = str.substring(0, str.length - 1)

      return str
    }
  },
  watch: {
    datePicker(val) {
      console.log(val)

      if (val) {
        this.queryParams.beginDate = val[0]
        this.queryParams.endDate = val[1]
      } else {
        this.queryParams.beginDate = ''
        this.queryParams.endDate = ''
      }
    },
    prisonId(val) {
      this.queryParams.deptId = this.prisonId
      this.queryInfo()
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  }
}
</script>
<style lang="less" scoped>
.btn_box {
  margin: 1rem;
  .btn_pad {
    a {
      text-decoration: none;
    }
  }
}
.sub_btn {
  margin-top: 0.4rem;
}
.yn_date_picker {
  width: 100%;
  font-size: 1.2rem;
}
/deep/ .el-date-editor.el-input {
  height: 2.5rem;
  width: 100%;
}
/deep/ .el-date-editor--daterange.el-input__inner {
  font-size: 1.2rem;
  width: 100%;
}
</style>
