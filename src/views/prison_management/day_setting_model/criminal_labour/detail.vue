<!--
 * @Description:罪犯劳动详情
 * @Author: fylih
 * @Date: 2019-08-27 10:07:02
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-06 10:11:30
 -->
<template>
  <el-dialog title="劳动详情" center class="yn_dialog" :visible="Visible" width="60%" @close="close">
    <!-- <tab right back name="罪犯劳动管理" :pathName="'criminal_labour_statistics'"></tab> -->
    <div class="laborInfo">
      <div>
        {{details.date}}--
        {{details.prisonName}}--
        {{details.deptName}}--
        {{details.laborValue}}
      </div>

      <div>
        本次劳动带班警察{{details.policeCount}}人--
        出工罪犯{{details.criminalCount}}（事务性劳动:{{details.businessCount}},生产性劳动:{{details.produceCount}}）人
        --劳动地点-{{details.laborPlace}}
      </div>
      <div>
        劳动时间：
        {{details.beginTime}}--
        {{details.endTime}}
      </div>
      <div>劳动描述信息：{{details.remark}}</div>
    </div>
    <table-view
      v-loading="tableLoading"
      :tableData="tableDataPolice"
      noBottom
      noSearch
      noIndex
      height="20rem"
      @sizeChange="sizeChange1"
    >
      <div slot="searchCondition">
        <!-- <el-form ref="form" class="yn_form" inline :model="details" label-width="10rem">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="劳动类型:">{{details.laborValue}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="劳动地点:">{{details.laborPlace}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开工时间:">{{details.beginTime}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间:">{{details.endTime}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事务性劳动人数:">{{details.businessCount}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产性劳动人数:">{{details.produceCount}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门:">{{details.deptName}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述:">{{details.remark}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>-->
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
  props: ['Visible', 'close', 'detail'],

  components: {
    tableView,
    deptLayout,
    tab,
    criminalRegister,
    criminalFiles,
    criminalGroupInfo
  },
  data() {
    return {
      tableLoading: false,
      table2Loading: false,
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
      groupList: []
    }
  },
  mounted() {
    // this.details = this.$route.query
    // this.queryParams.relateId = this.$route.query.id
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
        .get(_globalUrl.businessUrl + '/labour/selLaborPolices', {
          params: this.queryParams
        })
        .then(
          res => {
            if (res.rows) {
              this.$set(this.tableDataPolice, 'list', res.rows)
              this.$set(this.tableDataPolice, 'total', res.total)
            }
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
