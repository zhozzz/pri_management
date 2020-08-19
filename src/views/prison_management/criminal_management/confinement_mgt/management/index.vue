<!--
 * @Description: 禁闭隔离管理页面
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:41:20
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯禁闭/隔离']">
      <tab slot="heade_btn" right name="禁闭隔离管理" back :pathName="'shutterIsolation_statistics'"></tab>
      <confinements-dialog
        :handleCloseConfinement="handleCloseConfineMore"
        :confinementVisible="confineMore"
        :prisonId="prisonId"
        @submit="addSub"
      ></confinements-dialog>
      <confinement-dialog
        :handleCloseConfinement="handleCloseConfinement"
        :confinementVisible="confinementVisible"
        :criminalId="null"
        :prisonId="prisonId"
        @submit="addSub"
      ></confinement-dialog>
      <table-view :tableData="tableData" noBottom @sizeChange="searchInfo">
        <div slot="searchCondition">
          <el-form ref="form" :model="queryParams" class="yn_form" inline label-width="8rem">
            <el-form-item label="禁闭隔离日期">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="queryTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="罪犯编号">
              <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select class="yn_ipt" v-model="queryParams.type">
                <el-option label="禁闭" value="0"></el-option>
                <el-option label="隔离" value="1"></el-option>
                <el-option label="全部" value></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="罪犯姓名">
              <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
            </el-form-item>
            <el-form-item label-width="1rem">
              <el-button class="yn_btn" type="primary" @click="searchInfo">查询</el-button>
              <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :style="{'width':'10rem'}"
                class="yn_btn"
                @click="confinementVisible=true"
                v-if="prisonId!=1"
              >禁闭/隔离登记</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :style="{'width':'12rem'}"
                v-if="prisonId!=1"
                class="yn_btn"
                @click="confineMore=true"
              >批量登记</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <!-- <el-table-column align="center"
                         prop="zfCard"
          label="禁闭隔离编号" />-->
          <el-table-column tool align="center" prop="criminalNum" label="罪犯编号" />
          <el-table-column align="center" prop="type" label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">禁闭</span>
              <span v-else-if="scope.row.type == 1">隔离</span>
            </template>
          </el-table-column>

          <el-table-column too align="center" label="是否重点罪犯">
            <template slot-scope="scope">
              <span
                v-if="scope.row.keyCriminal == 1"
                style="color:red"
                @click="$markKeyCriminal(scope.row.criminalId,'0',searchInfo)"
              >是</span>
              <span
                v-else-if="scope.row.keyCriminal == 0"
                @click="$markKeyCriminal(scope.row.criminalId,'1',searchInfo)"
              >否</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="criminalName" label="罪犯姓名" />
          <el-table-column show-overflow-tooltip align="center" prop="criminalType" label="分管等级" />
          <el-table-column show-overflow-tooltip align="center" prop="startTime" label="禁闭隔离开始时间" />
          <el-table-column show-overflow-tooltip align="center" prop="endTime" label="禁闭隔离结束时间" />
          <!-- <el-table-column show-overflow-tooltip align="center" prop="reason" label="禁闭隔离原因" /> -->
          <el-table-column show-overflow-tooltip align="center" prop="roomId" label="禁闭隔离房间" />
          <el-table-column min-width="260" align="center" prop="prop" label="操作">
            <template slot-scope="scope">
              <criminal-register
                :criminalId="scope.row.criminalId"
                :confineId="scope.row.id"
                :criminalName="scope.row.criminalName"
                @relieveConfinement="relieveConfinement"
              ></criminal-register>
              <criminalFile :criminalId="scope.row.criminalId">查看档案</criminalFile>
              <el-button class="yn_text_btn" type="text" @click="edit(scope.row)" disabled>查看监控</el-button>
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
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import tab from '@/components/tab'
import { getPrisonId } from '@/utils'
import deptLayout from '@/components/deptLayout/index.vue'
import confinementsDialog from './confinement_dialog.vue'
import confinementDialog from '@/components/criminal_dialog/criminal_register_dialog/confinement_dialog.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    tableView,
    criminalRegister,
    criminalFile,
    tab,
    deptLayout,
    confinementDialog,
    confinementsDialog,
    menuTree
  },
  data() {
    return {
      pickerOptions: pickerOptions,
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {},
      editParams: {},
      queryTime: '',
      fileFlag: false,
      confineMore: false,
      criminalId: '',
      prisonId: getPrisonId(),
      prisonName: '',
      confinementVisible: false
    }
  },
  mounted() {
    if (this.$route.params.datePicker) {
      this.queryTime = this.$route.params.datePicker
    }
    this.searchInfo()
  },
  methods: {
    handleCloseConfineMore() {
      this.confineMore = false
      this.reset()
    },
    handleCloseConfinement() {
      this.confinementVisible = false
      this.reset()
    },
    addSub(val) {
      this.searchInfo()
    },
    // 查询所有
    searchInfo() {
      this.queryParams.prisonId = this.prisonId
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.axios
        .post(
          _globalUrl.businessUrl + '/criminalIsolation/queryIsolationRecord',
          this.queryParams
        )
        .then(res => {
          this.tableData.list = res.rows
          this.tableData.total = res.total
        })
    },
    relieveConfinement({ name, id }) {
      this.$confirm(`是否解除对${name}的禁闭?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .put(
            _globalUrl.businessUrl +
              '/criminalIsolation/updateIsolationRecord/' +
              id
          )
          .then(res => {
            this.$message.success('解除成功')
            this.searchInfo()
          })
      })
    },
    reset() {
      this.queryParams = {}
      this.queryTime = ''
      this.tableData = {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
      this.searchInfo()
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.prisonName = val.departName
      this.reset()

      this.searchInfo()
    }
  },
  watch: {
    queryTime(val) {
      if (!val) {
        return
      }
      this.queryParams.startTime = val[0]
      this.queryParams.endTime = val[1]
    }
  }
}
</script>
<style lang="less" scoped>
.manege_box {
  /deep/ .yn_date_picker {
    width: 100%;
    font-size: 1.1rem;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
}
</style>
