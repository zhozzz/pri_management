<!--
 * @Description: 车辆进出历史
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 09:42:26
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-04 14:48:37
 -->

<template>
  <el-dialog class="yn_dialog"
             :title="numberPlate+'来往历史'"
             center
             @close="close"
             :visible="historyToggle">
    <table-view noBottom
                noSearch
                v-loading="tableLoading"
                @sizeChange="getHistory"
                :tableData="tableData">
      <template slot="table-column">
        <el-table-column prop="numberPlate"
                         label="车牌号" />
        <el-table-column prop="deptName"
                         label="部门" />
        <el-table-column prop="visitorName"
                         label="外来人员姓名" />
        <el-table-column prop="swipecardTime"
                         label="进入时间" />
        <el-table-column prop="departureTime"
                         label="离开时间" />
        <el-table-column label="停留时间(小时)"
                         prop="stayHour" />
        <el-table-column prop="inpoliceName"
                         label="带入警员" />
        <el-table-column prop="outpoliceName"
                         label="带出警员" />
        <!-- <el-table-column prop="driverName"
        label="代驾司机" />-->
      </template>
    </table-view>
    <span slot="footer"
          class="dialog-footer">
      <el-button class="yn_btn"
                 @click="handleHistoryClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import tableView from '@/components/table_view'
import { getHistory } from './service'
export default {
  props: ['historyToggle', 'numberPlate', 'handleHistoryClose'],
  components: { tableView },
  data () {
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
    close () {
      this.handleHistoryClose()
    },
    getHistory () {
      let { pageNum, pageSize } = this.tableData
      this.tableLoading = true
      getHistory({
        numberPlate: this.numberPlate,
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
          console.log(res)
          this.tableLoading = false
        },
        err => {
          this.tableLoading = false
        }
      )
    }
  },

  watch: {
    historyToggle (newStatus) {
      if (newStatus) {
        this.getHistory()
      }
    }
  }
}
</script>
