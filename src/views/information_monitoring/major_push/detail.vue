<!--
 * @Description: 重要事情发布
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-30 10:36:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-13 09:53:27
 -->
<template>
  <div class="yn_page">
    <table-view noBottom noSearch v-loading="tableLoading" :tableData="tableData">
      <template slot="table-column">
        <el-table-column align="center" prop="title" label="通知标题" />
        <el-table-column align="center" min-width="100" prop="receiveUnitName" label="单位/部门" />
        <el-table-column align="center" prop="confirmFlagName" label="是否确认" />
        <el-table-column align="center" prop="createDate" label="接收时间">
          <template slot-scope="{row}">{{formatDate(row.createDate)}}</template>
        </el-table-column>
        <el-table-column align="center" prop="confirmDate" label="确认时间" />
        <el-table-column align="center" prop="confirmDate" label="确认时间">
          <template slot-scope="{row}">{{formatDate(row.confirmDate)}}</template>
        </el-table-column>
      </template>
    </table-view>
  </div>
</template>
<script>
import tableView from '@/components/table_view'
import { getNoticePublicDetail } from './service'
import formatDate from '@/utils/date.js'

export default {
  components: { tableView },
  data() {
    return {
      tableLoading: false,
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      }
    }
  },
  methods: {
    getNoticePublicDetail() {
      let { orderId } = this.$route.query
      let { pageNum, pageSize } = this.tableData
      this.tableLoading = true
      getNoticePublicDetail({ orderId, pageNum, pageSize }).then(res => {
        this.tableData = res
        this.tableLoading = false
      })
    },
    formatDate(date) {
      return formatDate(new Date(date), 'yyyy-MM-dd')
    }
  },

  mounted() {
    this.getNoticePublicDetail()
  }
}
</script>
