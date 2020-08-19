<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-02 10:33:15
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-14 21:15:34
 -->
<template>
  <menuTree :menuList="['监狱管理','技防管理','技防系统运行情况']" />
  <!--
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="故障汇总" name="list">
        <table-view noBottom :tableData="tableData">
          <template slot="searchCondition">
            <el-form ref="form" inline label-width="80px" class="yn_form">
              <el-form-item label="监狱名称">
                <el-input class="yn_ipt" v-model="bindData.prisonName" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
                <el-button class="yn_btn" @click="reset">重置</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template slot="table-column">
            <el-table-column label="监狱名称" />
            <el-table-column label="设备总数" />
            <el-table-column label="故障设备数" />
            <el-table-column label="故障率" />
            <el-table-column label="故障时长" />
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button class="yn_text_btn" type="text" @click="toInfoshop(row)">转发整改单到信息处</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>
      </el-tab-pane>

      <el-tab-pane label="数据统计" name="data">
        <data-statistic />
      </el-tab-pane>

      <el-tab-pane label="监狱数据统计" name="prisonDataStatistic">
        <prison-error-statistic />
      </el-tab-pane>

      <el-tab-pane label="设备故障详情" name="prisonSummary">
        <prison-error-summary />
      </el-tab-pane>
  </el-tabs>-->
</template>
<script>
import tableView from '@/components/table_view'
import prisonErrorSummary from '../prison_error_summary'
import prisonErrorStatistic from '../prison_data_statistic'
import menuTree from '@/components/menu_tree/'
import dataStatistic from '../data_statistic'
import { getPrisonId } from '@/utils'
import globalUrl from '@/utils/global_url'

export default {
  components: {
    tableView,
    dataStatistic,
    prisonErrorSummary,
    prisonErrorStatistic,
    menuTree
  },
  data() {
    return {
      activeName: 'data',
      bindData: {},
      queryData: {},
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: [{}]
      }
    }
  },
  created() {
    this.sso_login()
  },
  methods: {
    sso_login() {
      let xpwidth = window.screen.width - 10
      let xpheight = window.screen.height - 35
      this.axios({
        method: 'get',
        url: globalUrl.videoUrl2 + '/login/' + getPrisonId(),
        withCredentials: true
      })
        .then(response => {
          console.log('response:' + response)

          let midpage = window.open(response)
          let self = ''
          setTimeout(() => {
            let host = response.split('//bic')[0]

            let win = window.open(
              host + '/nms/views/home',
              //   '_top',
              `height=${xpheight}, width=${xpwidth},toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no`
            )
            midpage.close()
          }, 3000)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    reset() {
      this.bindData = {}
      this.queryData = {}
      this.tableData.pageNum = 1
      this.getAllPrisonInfo()
    },
    query() {
      this.queryData = this.bindData
      this.getAllPrisonInfo()
    },
    getAllPrisonInfo() {},
    toInfoshop() {}
  }
}
</script>
<style lang="less" scoped>
.technology {
  .el-tabs {
    /deep/.el-tabs__header {
      .el-tabs__nav-wrap {
        color: #fff;
        .el-tabs__item {
          color: #fff;
        }
        .el-tabs__item.is-active {
          color: #409eff;
        }
      }
    }
  }
}
</style>
