<!--
 * @Description:罪犯休息详情
 * @Author: fylih
 * @Date: 2019-08-27 10:07:02
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-06 10:06:57
 -->
<template>
  <el-dialog title="休息详情" center class="yn_dialog" :visible="Visible" width="60%" @close="close">
    <div class="laborInfo">
      <div>
        {{details.date}}--
        {{details.prisonName}}--
        {{details.deptName}}
      </div>

      <!-- <div>
        本次学习带班警察{{details.policeCount}}人--
        出勤罪犯{{details.criminalCount}}人 
      </div> -->
      <div>
        休息时间：
        {{details.beginTime}}--
        {{details.endTime}}
      </div>
      <div>休息描述信息：{{details.remark}}</div>
    </div>
    <table-view
      v-loading="tableLoading"
      :tableData="tableDataPolice"
      noBottom
      @sizeChange="sizeChange1"
    >
      <div slot="searchCondition">
        <el-form ref="form" class="yn_form" inline :model="details" label-width="10rem">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开工时间:">{{details.beginTime}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间:">{{details.endTime}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否休息日:">
                <span v-if="details.isRest===0">是</span>
                <span v-else-if="details.isRest===1">否</span>
                <span v-else-if="details.isRest===2">否</span>
                <span v-else>暂未配置</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预警状态:">
                <span v-if="details.warn === 0">正常</span>
                <span v-else-if="details.warn === 1" style="color:red">异常</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述:">{{details.remark}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column show-overflow-tooltip align="center" prop="realName" label="警察姓名"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="policeCardNo" label="警号" />
        <el-table-column show-overflow-tooltip align="center" prop="workPositionName" label="职务" />
        <el-table-column show-overflow-tooltip align="center" prop="phoneNo" label="联系方式" />
        <el-table-column show-overflow-tooltip align="center" prop="deptIdName" label="部门" />
      </template>
    </table-view>

    <criminalGroupInfo
      :groupList="groupList"
      :selct="false"
      :showComplete="true"
      :laborId="detail.id"
      word="结束"
      v-loading="table2Loading"
    />
    <div slot="footer"></div>
  </el-dialog>
</template>
<script>
import tableView from '@/components/table_view'
import deptLayout from '@/components/deptLayout/index.vue'
import _globalUrl from '@/utils/global_url'
import { getPrisonId } from '@/utils'
import tab from '@/components/tab'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import criminalFiles from '@/components/criminal_dialog/criminal_files_dialog'
import criminalGroupInfo from '@/components/criminal_group_info'

export default {
  components: {
    tableView,
    deptLayout,
    tab,
    criminalRegister,
    criminalFiles,
    criminalGroupInfo
  },
  props: ['Visible', 'close', 'detail'],
  data() {
    return {
      tableLoading: false,
      tableDataPolice: {
        pageSize: 10,
        pageNum: 1
      },
      tableDataCriminal: {
        pageSize: 10,
        pageNum: 1
      },
      prisonId: getPrisonId(),
      prisonName: '',
      details: {},
      queryParams: {
        pageSize: 10,
        currentPage: 1
      },
      groupList: [],
      table2Loading: false
    }
  },
  mounted() {
    this.queryParams.flag = 1
  },
  watch: {
    detail: {
      deep: true,
      handler(val) {
        if (val) {
          this.details = val
          this.queryParams.relateId = val.id
          this.getGroups()
        }
      }
    },
    Visible(val) {
      if (val) {
        this.queryPolice()
      }
    }
  },
  methods: {
    queryPolice() {
      this.tableLoading = true
      this.axios
        .get(_globalUrl.businessUrl + '/rest/selRestPolices', {
          params: this.queryParams
        })
        .then(
          res => {
            this.$set(this.tableDataPolice, 'list', res.rows)
            this.$set(this.tableDataPolice, 'total', res.total)
            this.tableLoading = false
          },
          () => {
            this.tableLoading = false
          }
        )
    },

    sizeChange1() {
      this.queryParams.pageSize = this.tableDataPolice.pageSize
      this.queryParams.currentPage = this.tableDataPolice.pageNum
      this.queryPolice()
    },

    getGroups() {
      this.table2Loading = true
      this.axios
        .get(
          _globalUrl.businessUrl +
            '/labour/criminalInfoByGroup/' +
            this.detail.id
        )
        .then(res => {
          this.table2Loading = false

          this.groupList = res
        })
    }
  }
}
</script>
<style lang="less" scoped>
.technology {
  .el-form--inline {
    .el-form-item {
      /deep/.el-form-item__content {
        color: #fff;
        font-size: 1.1rem;
      }
    }
  }
  .laborInfo {
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
}
.laborInfo {
  border: 1px solid #cddded;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;

  font-size: 1.4rem;
  text-align: center;
  div {
    margin: 1rem 0;
  }
}
</style>
