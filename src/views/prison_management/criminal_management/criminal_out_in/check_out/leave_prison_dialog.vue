<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-24 17:40:50
 -->
<template>
  <div>
    <el-dialog
      title="罪犯离监登记"
      :visible="leavePrisonVisible"
      width="60%"
      append-to-body
      center
      class="yn_dialog"
      @close="close"
    >
      <el-form ref="form" class="yn_form" :rules="rules" :model="params" label-width="12rem">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="选择罪犯">
              <el-button type="primary" class="yn_btn" @click="criVisible=true">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离监类型" prop="outType">
              <el-select class="yn_ipt" v-model="params.outType">
                <el-option
                  v-for="(item,i) in outTypeOptions"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离监时间" prop="outTime">
              <el-date-picker
                class="yn_ipt"
                v-model="params.outTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="预计归监时间">
              <el-date-picker
                class="yn_ipt"
                v-model="params.inTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任警察" prop="dutyPoliceIds">
              <police-select class="yn_ipt" v-model="params.dutyPoliceIds" multiple></police-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                class="yn_ipt"
                :rows="2"
                maxlength="1000"
                type="textarea"
                v-model="params.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          v-loading="loading"
          class="yn_btn"
          type="primary"
          @click="$checkMessage(submit)"
        >确 定</el-button>
        <el-button class="yn_btn" @click="handleCloseLeavePrison">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择罪犯"
      :visible.sync="criVisible"
      width="60%"
      append-to-body
      center
      class="yn_dialog"
    >
      <table-view
        :tableData="tableData"
        noBottom
        @selectionchange="selCri"
        @sizeChange="getCriList"
      >
        <div slot="searchCondition">
          <el-form class="yn_form" ref="queryForm" inline :model="queryParams" label-width="6rem">
            <el-form-item label="罪犯编号" prop="criminalNum">
              <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
            </el-form-item>

            <el-form-item label="罪犯姓名" prop="criminalName">
              <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="yn_btn" @click="getCriList">查询</el-button>
              <el-button type="primary" class="yn_btn" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column type="selection" reserve-selection align="center" />
          <el-table-column align="center" prop="zfNum" label="罪犯编号" />
          <el-table-column align="center" prop="zfName" label="罪犯姓名" />
        </template>
      </table-view>
      <div slot="footer">
        <el-button
          class="yn_btn"
          type="primary"
          v-loading="loading"
          @click="$checkMessage(saveIds)"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import policeSelect from '@/components/police_select'
import criminalTable from '@/components/criminal_table'
import _global from '@/utils/global_url'
import _globalUrl from '@/utils/global_url'

import tableView from '@/components/table_view'
import { getPrisonId, getDeptId } from '@/utils'
export default {
  components: { policeSelect, criminalTable, tableView },
  props: ['leavePrisonVisible', 'handleCloseLeavePrison'],
  data() {
    return {
      loading: false,
      criminalInfo: {},
      params: {},
      outTypeOptions: [],
      rules: {
        outType: { required: true, message: '请选择离监类型', trigger: 'blur' },
        outTime: { required: true, message: '请输入离监时间', trigger: 'blur' },
        dutyPoliceIds: {
          required: true,
          message: '请选择责任警察',
          trigger: 'blur'
        }
      },
      criVisible: false,
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {},

      selCriIds: []
    }
  },
  methods: {
    close() {
      this.handleCloseLeavePrison()
    },
    selCri(val) {
      console.log(val)
      this.selCriIds = val.map(item => {
        return item.id
      })
    },
    saveIds() {
      this.params.criminalIds = this.selCriIds
      this.criVisible = false
    },
    queryInfoType() {
      this.axios
        .get(_global.userUrl + '/dictionary/option/OutPrisonType')
        .then(res => {
          this.outTypeOptions = res
        })
    },
    submit() {
      if (this.params.criminalIds && this.params.criminalIds.length > 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            this.axios
              .post(
                _global.businessUrl + '/criminalInOut/outBatch',
                this.params
              )
              .then(
                res => {
                  this.loading = false
                  this.$message.success('离监登记成功')
                  this.$emit('submit', res)
                  this.handleCloseLeavePrison()
                },
                () => {
                  this.loading = false
                }
              )
          }
        })
      } else {
        this.$message.error('请选择罪犯')
      }
    },
    reset() {
      this.tableData = { list: [], total: 0, pageNum: 1, pageSize: 10 }
      this.queryParams = {}
      this.getCriList()
    },
    getCriList() {
      let parmas = {}
      parmas.pageSize = this.tableData.pageSize
      parmas.currentPage = this.tableData.pageNum
      parmas.prisonId = getPrisonId()
      //   parmas.prisonId = getDeptId()

      parmas.number = this.queryParams.criminalNum
      parmas.name = this.queryParams.criminalName
      this.axios
        .post(
          _globalUrl.businessUrl + '/criminalData/queryNormalCriminals',
          parmas
        )
        .then(res => {
          console.log(res)
          this.tableData.list = res.list
          this.tableData.total = res.total
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  watch: {
    leavePrisonVisible(val) {
      if (val === true) {
        this.queryInfoType()
        this.params = {}

        this.params.prisonId = JSON.parse(localStorage.getItem('user')).prisonId
        this.getCriList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dialog_transfer {
  display: table;
  margin: 0 auto;
}
.yn_ipt {
  width: 100%;
}
</style>
