<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 11:15:16
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-02 15:58:37
 -->
<template>
  <div>
    <!-- <el-button class="yn_btn" type="primary" @click.stop="queryInfo">罪犯返监</el-button> -->

    <el-dialog
      class="yn_dialog"
      title="返监登记"
      @close="close"
      center
      :visible="checkOutVisible"
      width="80%"
    >
      <div>
        <table-view :tableData="tableData" noBottom @sizeChange="queryInfo">
          <div slot="searchCondition">
            <el-form ref="queryForm" class="yn_form" inline :model="queryParams">
              <el-form-item label="罪犯编号" prop="criminalNum">
                <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
              </el-form-item>
              <el-form-item label="罪犯姓名" prop="criminalName">
                <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
              </el-form-item>

              <el-form-item label="出监类型" prop="outType">
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
            </el-form>
          </div>
          <template slot="table-column">
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="criminal.zfNum"
              label="罪犯编号"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="criminal.zfName"
              label="罪犯姓名"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="criminal.deptName"
              label="所属监区"
            />
            <el-table-column show-overflow-tooltip align="center" prop="outTypeName" label="出监类型" />
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button class="yn_text_btn" type="text" @click="backPrison(scope.row)">返监</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" @click="handleCloseCheckOut">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import tableView from '@/components/table_view'
import { getPrisonId } from '@/utils'

export default {
  props: ['prisonId', 'checkOutVisible', 'handleCloseCheckOut', 'deptId'],
  data() {
    return {
      queryParams: {},
      outTypeOptions: [],
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  components: { tableView },
  created() {
    this.queryInfo()
    this.queryInfoType()
  },
  watch: {
    prisonId() {
      this.queryInfo()
    }
  },
  methods: {
    queryInfoType() {
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/OutPrisonType')
        .then(res => {
          this.outTypeOptions = res
        })
    },
    close() {
      this.handleCloseCheckOut()
    },
    reset() {
      this.queryParams = {}
      this.queryInfo()
    },
    // 查询所有
    queryInfo() {
      this.queryParams.deptId = this.deptId
      this.queryParams.prisonId = this.prisonId

      this.queryParams.outFlag = 1

      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.axios
        .post(
          _globalUrl.businessUrl + '/criminalInOut/selAll',
          this.queryParams
        )
        .then(res => {
          this.$set(this.tableData, 'list', res.rows)
          this.tableData.total = res.total
        })
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
    }
  }
}
</script>
