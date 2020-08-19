<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:37:54
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯离监']">
      <tab slot="heade_btn" right name="罪犯离监管理" back :pathName="'criminal_out_statistics'"></tab>
      <leave-prison-dialog
        :handleCloseLeavePrison="handleCloseLeavePrison"
        :leavePrisonVisible="leavePrisonVisible"
        :criminalId="null"
        @submit="queryInfo"
      ></leave-prison-dialog>
      <leaves-prison-dialog
        @submit="queryInfo"
        :handleCloseLeavePrison="closemore"
        :leavePrisonVisible="moreVisible"
      ></leaves-prison-dialog>
      <!-- <gps /> -->
      <!-- <router-link :to="{name:'criminal_check_in'}">罪犯入监</router-link> -->
      <table-view :tableData="tableData" noBottom @sizeChange="sizeChange">
        <div slot="searchCondition">
          <el-form
            ref="queryForm"
            class="yn_form"
            :rules="rules"
            inline
            :model="queryParams"
            label-width="8rem"
          >
            <el-form-item label="罪犯编号" prop="criminalNum">
              <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
            </el-form-item>
            <el-form-item label="罪犯姓名" prop="criminalName">
              <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
            </el-form-item>
            <el-form-item label="离监时间">
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
            <el-form-item label="离监类型" prop="outType">
              <el-select class="yn_ipt" v-model="queryParams.outType">
                <el-option
                  v-for="(item,i) in outTypeOptions"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="queryInfo">查询</el-button>
              <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item v-if="userPrisonId!=1">
              <el-button
                type="primary"
                class="yn_btn yn_long_btn"
                @click="leavePrisonVisible=true"
              >罪犯离监登记</el-button>
              <el-button type="primary" class="yn_btn" @click="moreVisible=true">批量登记</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column show-overflow-tooltip align="center" prop="criminal.zfNum" label="罪犯编号" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="criminal.zfName"
            label="罪犯姓名"
          />

          <!-- <el-table-column
            show-overflow-tooltip
            align="center"
            :formatter="accusationType"
            prop="zfAccusationName"
            label="罪名"
          />-->
          <el-table-column show-overflow-tooltip align="center" label="是否重点罪犯">
            <template slot-scope="scope" v-if="scope.row.criminal">
              <span
                v-if="scope.row.criminal.isKey == 0"
                @click="$markKeyCriminal(scope.row.id,'1',queryInfo)"
              >否</span>
              <span
                v-else-if="scope.row.criminal.isKey == 1"
                style="color:red"
                @click="$markKeyCriminal(scope.row.id,'0',queryInfo)"
              >是</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="polices" label="看押警察">
            <template slot-scope="scope">
              <span v-for="(item,i) in scope.row.polices" :key="i">
                {{item.userName}}
                <span v-if="i<scope.row.polices.length-1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="outTime" label="离监时间" />
          <el-table-column show-overflow-tooltip align="center" prop="outTypeName" label="离监类型" />
          <el-table-column min-width="280" align="center" label="操作">
            <template slot-scope="scope">
              <div class="btn_box_inTable">
                <el-button v-if="scope.row.outTypeName!='刑满释放'" class="yn_text_btn" type="text">查看位置</el-button>
                <criminal-register
                  :prisonId="prisonId"
                  v-if="scope.row.outTypeName!='刑满释放'"
                  :criminalId="scope.row.criminal.id"
                ></criminal-register>
                <criminalFile :criminalId="scope.row.criminal.id">查看档案</criminalFile>
                <el-button
                  type="text"
                  class="yn_text_btn"
                  @click="backPrison(scope.row)"
                  v-if="scope.row.outTypeValue !=='fcd45f49-e06b-475c-83d4-17dee45edcbdf'"
                >返监</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>
    </menuTree>
  </dept-layout>
</template>
<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import tableView from '@/components/table_view'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import _globalUrl from '@/utils/global_url'
import { expnoraml, isEnName } from '@/utils/form_valid'
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import leavePrisonDialog from '@/components/criminal_dialog/criminal_register_dialog/leave_prison_dialog'
import leavesPrisonDialog from './leave_prison_dialog'

import tab from '@/components/tab'
import { getPrisonId } from '@/utils'
import deptLayout from '@/components/deptLayout/index.vue'
import gps from '@/components/gps/gps.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    tableView,
    criminalRegister,
    criminalFile,
    deptLayout,
    tab,
    gps,
    menuTree,
    leavePrisonDialog,
    leavesPrisonDialog
  },
  data() {
    return {
      pickerOptions: pickerOptions,
      editVisible: false,
      moreVisible: false,
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
        deptId: JSON.parse(localStorage.getItem('user')).deptGuid,
        prisonId: getPrisonId()
      },
      datePicker: '',
      outTypeOptions: [],
      rules: {
        criminalNum: [{ max: 40, message: '编号最大长度为40' }],
        criminalName: [
          { validator: expnoraml('姓名') },
          { validator: isEnName },
          { max: 20, message: '姓名不能超过20个字符' }
        ]
      },
      fileFlag: false,
      criminalId: '',
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      prisonName: '',
      leavePrisonVisible: false
    }
  },

  mounted() {
    if (this.$route.params.datePicker) {
      this.datePicker = this.$route.params.datePicker
    }
    this.queryInfo()
    this.queryInfoType()
  },
  methods: {
    handleCloseLeavePrison() {
      this.leavePrisonVisible = false
      this.reset()
    },
    closemore() {
      this.moreVisible = false
      this.reset()
    },
    sizeChange() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryInfo()
    },
    // 查询所有
    queryInfo() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.axios
            .post(
              _globalUrl.businessUrl + '/criminalInOut/selAll',
              this.queryParams
            )
            .then(res => {
              this.$set(this.tableData, 'list', res.rows)
              this.tableData.total = res.total
            })
        } else {
          return false
        }
      })
    },
    queryInfoType() {
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/OutPrisonType')
        .then(res => {
          this.outTypeOptions = res
        })
    },
    // 编辑
    edit(row) {
      this.editParams = row
      this.$nextTick(() => {
        this.editVisible = true
      })
    },
    reset() {
      this.queryParams = {
        pageSize: 10,
        currentPage: 1,
        deptId: JSON.parse(localStorage.getItem('user')).deptGuid
      }
      this.datePicker = []
    },
    // 关闭入监模态框
    handleCloseEdit() {
      this.editVisible = false
    },
    // 返监
    backPrison(row) {
      console.log(row)
      this.$confirm('确认标记' + row.criminal.zfName + '返监?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .put(
            _globalUrl.businessUrl +
              '/criminalInOut/returnPrison/' +
              getPrisonId() +
              '/' +
              row.id
          )
          .then(res => {
            this.$message.success('标记成功')
            this.queryInfo()
          })
      })
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.prisonName = val.departName
      this.queryParams.deptId = val.id
      this.queryParams.prisonId = val.id
      this.queryInfo()
    },
    accusationType(row, col, cellvalue, index) {
      let str = ''
      if (row.criminalAccusations) {
        row.criminalAccusations.map(item => {
          str += item.label + '；'
        })
        str = str.substring(0, str.length - 1)
      }

      return str
    }
  },
  watch: {
    datePicker(val) {
      if (!val) {
        return
      }
      this.queryParams.beginDate = val[0]
      this.queryParams.endDate = val[1]
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