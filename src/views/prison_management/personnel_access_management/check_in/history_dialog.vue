<!--
 * @Description: 车辆进出历史
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 09:42:26
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-13 16:14:01
 -->

<template>
  <el-dialog
    title="来往历史"
    @close="close"
    class="yn_dialog"
    center
    :visible="historyToggle"
  >
    <table-view
      noBottom
      noSearch
      v-loading="tableLoading"
      :tableData="tableData"
    >
      <template slot="table-column">
        <el-table-column
          prop="visitorName"
          label="姓名"
        />
        <el-table-column
          prop="deptName"
          label="进入区域"
        />
        <el-table-column
          prop="cardNum"
          label="身份证号"
        />
        <el-table-column
          prop="visitorTypeName"
          label="人员类型"
        />
        <el-table-column
          prop="issue"
          label="来访事由"
        />
        <el-table-column
          prop="inpoliceName"
          label="带入警员"
        />
        <el-table-column
          prop="outpoliceName"
          label="带出警员"
        />
        <el-table-column
          prop="swipecardTime"
          label="进入时间"
        />
        <el-table-column
          prop="leaveTime"
          label="离开时间"
        />
        <el-table-column
          prop="stayHour"
          label="停留时长"
        />
      </template>
    </table-view>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="yn_btn"
        @click="handleHistoryClose"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import tableView from '@/components/table_view'
import { getHistory } from './service'
export default {
  props: ['historyToggle', 'cardNum', 'handleHistoryClose'],
  components: { tableView },
  data() {
    return {
      tableLoading: false,
      tableData: {
        list: [],
        pageNum: 1,
        pageSize: 10,
        total: null
      }
    }
  },
  methods: {
    close() {
      this.handleHistoryClose()
    },
    getHistory() {
      let { pageNum, pageSize } = this.tableData
      this.tableLoading = true
      getHistory({
        cardNum: this.cardNum,
        pageNum,
        pageSize,
        prisonId: this.$route.query.prisonId
      }).then(
        res => {
          this.tableData = {
            ...res,
            total: res.count,
            pageSize: this.tableData.pageSize
          }
          this.tableLoading = false
        },
        err => {
          this.tableLoading = false
        }
      )
    }
  },

  watch: {
    historyToggle(newStatus) {
      if (newStatus) {
        this.getHistory()
      }
    }
  }
}
</script>
