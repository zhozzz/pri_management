<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-18 16:38:48
 -->
<template>
  <div>
    <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
      <tab right name="罪犯入监管理" :pathName="'criminal_in_statistics'"></tab>
      <table-view :tableData="tableData" noBottom @sizeChange="sizeChange">
        <div slot="searchCondition">
          <el-form ref="queryForm" inline :model="queryParams" label-width="8rem" :rules="rules">
            <br />
            <el-form-item label="罪犯编号" prop="zfNum">
              <el-input class="yn_ipt" v-model="queryParams.zfNum"></el-input>
            </el-form-item>
            <el-form-item label="罪犯姓名" prop="zfName">
              <el-input class="yn_ipt" v-model="queryParams.zfName"></el-input>
            </el-form-item>
            <el-form-item label="入监时间">
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
            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="queryInfo">查询</el-button>
              <el-button class="yn_btn" type="primary" @click="checkIn">新犯入监</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column show-overflow-tooltip align="center" prop="zfNum" label="罪犯编号" />
          <el-table-column show-overflow-tooltip align="center" label="是否重点罪犯" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isKey == 0" @click="$markKeyCriminal(scope.row.id,'1')">否</span>
              <span
                v-else-if="scope.row.isKey == 1"
                style="color:red"
                @click="$markKeyCriminal(scope.row.id,'0')"
              >是</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="zfCard" label="身份证号" />
          <el-table-column show-overflow-tooltip align="center" prop="zfName" label="姓名" />
          <el-table-column show-overflow-tooltip align="center" prop="deptName" label="部门" />
          <el-table-column show-overflow-tooltip align="center" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.zfGender == 0">女</span>
              <span v-else-if="scope.row.zfGender == 1">男</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="zfBirth" label="生日" />
          <el-table-column show-overflow-tooltip align="center" prop="zfCountry" label="国籍" />
          <el-table-column show-overflow-tooltip align="center" prop="zfBornPlace" label="籍贯" />
          <el-table-column show-overflow-tooltip align="center" prop="zfTypeName" label="分管等级" />
          <el-table-column show-overflow-tooltip align="center" prop="intoTime" label="入监时间" />
          <el-table-column show-overflow-tooltip align="center" prop="zfAccusationName" label="罪名" />
          <el-table-column show-overflow-tooltip align="center" prop="height" label="身高" />
          <el-table-column show-overflow-tooltip align="center" prop="weight" label="体重" />
          <el-table-column show-overflow-tooltip align="center" prop="age" label="年龄" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="updateTime"
            label="最近更新时间"
            min-width="120"
          />
          <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间" />
          <el-table-column min-width="250" align="center" prop="prop" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <criminal-register :prisonId="prisonId" :criminalId="scope.row.id"></criminal-register>
              <criminalFile @seeFile="seeFile" :criminalId="scope.row.id">查看档案</criminalFile>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <!-- <criminalFile :fileFlag="fileFlag" @seeFile="seeFile" :criminalId="criminalId"></criminalFile> -->
      <check-in-dialog
        :checkInVisible="checkInVisible"
        :handleCloseCheckIn="handleCloseCheckIn"
        @addSuc="queryInfo"
      ></check-in-dialog>
      <edit-dialog
        :editVisible="editVisible"
        :handleCloseEdit="handleCloseEdit"
        :editList="editParams"
        @updateSuc="queryInfo"
      ></edit-dialog>
    </dept-layout>
  </div>
</template>
<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import tableView from '@/components/table_view'
import checkInDialog from './check_in_dialog'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import editDialog from './edit_dialog'
import _globalUrl from '@/utils/global_url'
import { expnoraml, isEnName } from '@/utils/form_valid'
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import tab from '@/components/tab'
import { getPrisonId } from '@/utils'
import deptLayout from '@/components/deptLayout/index.vue'
export default {
  components: {
    tableView,
    checkInDialog,
    editDialog,
    criminalRegister,
    criminalFile,
    deptLayout,
    tab
  },
  data() {
    return {
      pickerOptions: pickerOptions,
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
        deptId: JSON.parse(localStorage.getItem('user')).deptGuid
      },
      datePicker: '',
      rules: {
        zfName: [
          { validator: expnoraml('姓名') },
          { validator: isEnName },
          { max: 20, message: '姓名不能超过20个字符' }
        ],
        zfNum: [{ max: 40, message: '编号最大长度为40' }]
      },
      fileFlag: false,
      criminalId: '',
      prisonId: getPrisonId(),
      prisonName: ''
    }
  },
  mounted() {
    this.queryInfo()
    // this.queryCriminalType()
  },
  methods: {
    sizeChange() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryInfo()
    },
    // 打开入监模态框
    checkIn() {
      this.checkInVisible = true
    },
    // 关闭入监模态框
    handleCloseCheckIn() {
      this.checkInVisible = false
    },
    // 查询所有
    queryInfo() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.axios
            .post(
              _globalUrl.businessUrl + '/criminalBase/selAll',
              this.queryParams
            )
            .then(res => {
              this.tableData.list = res.rows
              this.tableData.total = res.total
            })
        } else {
          return false
        }
      })
    },
    // 编辑
    edit(row) {
      this.editParams = row
      this.$nextTick(() => {
        this.editVisible = true
      })
    },
    // 关闭入监模态框
    handleCloseEdit() {
      this.editVisible = false
    },
    checkCriminalData(id) {
      this.fileFlag = true
      this.criminalId = id
    },
    seeFile(Val) {
      console.log(Val)
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.prisonName = val.departName
      this.queryParams.deptId = val.id
      this.queryInfo()
    }
  },
  watch: {
    datePicker(val) {
      this.queryParams.beginDate = val[0]
      this.queryParams.endDate = val[1]
    }
  }
}
</script>
<style lang="less" scoped>
.yn_date_picker {
  font-size: 1.2rem !important;
  border: 1px solid rgb(153, 151, 151);
  width: 100% !important;
}
/deep/.el-date-editor .el-range-separator {
  width: 10% !important;
  font-size: 1.2rem;
}
</style>
