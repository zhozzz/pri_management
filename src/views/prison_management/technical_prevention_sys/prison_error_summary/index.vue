<!--
 * @Description: 监狱 异常汇总
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-03 14:09:19
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-05 10:42:04
 -->
<template>
  <table-view noBottom :tableData="tableData">
    <template slot="searchCondition">
      <el-form ref="form" inline class="yn_form" label-width="80px">
        <el-form-item label="选择日期">
          <el-input class="yn_ipt" v-model="bindData.prisonName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-input class="yn_ipt" v-model="bindData.prisonName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="设备IP">
          <el-input class="yn_ipt" v-model="bindData.prisonName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input class="yn_ipt" v-model="bindData.prisonName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="yn_btn" @click="query">查询</el-button>
          <el-button class="yn_btn" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template slot="table-column">
      <el-table-column label="设备类型" />
      <el-table-column label="厂家" />
      <el-table-column label="ip" />
      <el-table-column label="设备名称" />
      <el-table-column label="位置" />
      <el-table-column label="描述" />
      <el-table-column label="时间" />
      <el-table-column label="状态" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text">转发整改单到信息处</el-button>
        </template>
      </el-table-column>
    </template>
  </table-view>
</template>
<script>
import tableView from '@/components/table_view'

export default {
  components: {
    tableView
  },
  data () {
    return {
      bindData: {},
      queryData: {},
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      }
    }
  },
  methods: {
    reset () {
      this.bindData = {}
      this.queryData = {}
      this.tableData.pageNum = 1
      this.getAllPrisonInfo()
    },
    query () {
      this.queryData = this.bindData
      this.getAllPrisonInfo()
    },
    getAllPrisonInfo () {},
    toInfoshop () {}
  }
}
</script>
<style lang="less" scoped>
</style>
