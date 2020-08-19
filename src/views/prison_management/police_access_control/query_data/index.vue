<!--
 * @Description: 狱局 警察进出查看
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 14:31:05
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:06:51
 -->

<template>
  <menuTree :menuList="['监狱管理','AB门管理','警察进出详情']">
    <tab
      slot="heade_btn"
      name="警察进出详情"
      :right="true"
      pathName="police_access_control_data_statistic"
    />
    <table-view
      noBottom
      @sizeChange="getPoliceAccessControlList"
      v-loading="tableLoading"
      :tableData="tableData"
    >
      <div slot="searchCondition">
        <el-form ref="form" inline class="yn_form" label-width="80px">
          <el-form-item label="进入时间">
            <el-date-picker
              v-model="swipeCardTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="yn_ipt"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="警察姓名">
            <police-select class="yn_ipt" v-model="bindData.policeId" />
          </el-form-item>

          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
            <el-button class="yn_btn" @click="reset">重置</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="$router.back()">数据统计</el-button>
          </el-form-item>-->
        </el-form>
      </div>
      <template slot="table-column">
        <!--<el-table-column label="序号" />-->
        <el-table-column prop="policeName" label="姓名" align="center">
          <template slot-scope="{row}">
            <police-detail :police="{policeId: row.policeId, policeName: row.policeName}"></police-detail>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="policeNum" label="警号" />
        <el-table-column align="center" prop="workPositionName" label="职务" />
        <el-table-column align="center" prop="policeGenderDes" label="性别" />
        <el-table-column align="center" min-width="100" prop="deptName" label="部门" />
        <el-table-column align="center" prop="policeAge" label="年龄" />
        <el-table-column align="center" show-overflow-tooltip prop="policePhone" label="联系方式" />
        <el-table-column align="center" show-overflow-tooltip prop="swipeCardInTime" label="进入时间" />
        <el-table-column align="center" show-overflow-tooltip prop="swipeCardOutTime" label="离开时间" />
        <el-table-column align="center" prop="lengthOfStay" label="停留时间" />
      </template>
    </table-view>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import { pickerOptions } from '@/utils/picker_option_config'
import departSelect from '@/components/depart_select'
import policeSelect from '@/components/police_select'
import policeDetail from './police_detail'
import { getPrisonId } from '@/utils'
import { getPoliceAccessControlList } from './service'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    tableView,
    departSelect,
    policeDetail,
    policeSelect,
    tab,
    menuTree
  },
  data() {
    return {
      prisonId: getPrisonId(),
      tableLoading: false,
      bindData: {},
      queryData: {},
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      swipeCardTime: []
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  methods: {
    query() {
      if (this.swipeCardTime[0]) {
        this.bindData.swipeCardStartTime = this.swipeCardTime[0]
      }
      if (this.swipeCardTime[1]) {
        this.bindData.swipeCardEndTime = this.swipeCardTime[1]
      }
      this.queryData = this.bindData
      this.getPoliceAccessControlList()
    },
    reset() {
      this.queryData = {}
      this.bindData = {}
      this.tableData.pageNum = 1
      this.swipeCardTime = []
      this.getPoliceAccessControlList()
    },
    getPoliceAccessControlList() {
      let { queryData } = this
      let { pageNum, pageSize } = this.tableData
      this.tableLoading = true
      getPoliceAccessControlList({
        ...queryData,
        pageNum,
        pageSize,
        prisonId: this.prisonId
      }).then(
        res => {
          this.tableData = res
          this.tableLoading = false
        },
        () => {
          this.tableLoading = false
        }
      )
    }
  },
  mounted() {
    // this.getPoliceAccessControlList()
  }
}
</script>
