<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:41:37
 -->

<template slot-scope="scope">
  <!-- 应急小组管理 -->
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['指挥调度','预案小组管理']">
      <tab
        slot="heade_btn"
        name="预案小组管理"
        :right="true"
        pathName="reserve_management"
        leftName="预案管理"
      />
      <table-view
        :tableData="tableData"
        noBottom
        v-loading="tableLoading"
        @sizeChange="getReserveGroupList"
      >
        <div slot="searchCondition">
          <el-form ref="form" inline class="yn_form">
            <el-form-item label="小组名称：">
              <el-input class="yn_ipt" v-model="searchData.groupName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="选择日期：">
              <el-date-picker
                class="yn_ipt"
                v-model="searchData.date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" @click="getReserveGroupList" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>
              <el-button class="yn_btn" v-if="userPrisonId!=1" @click="addGroup" type="primary">新建</el-button>
              <!-- <el-button class="yn_btn" v-if="userPrisonId!=1" @click="delTeams" type="primary">批量解散</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column
            show-overflow-tooltip
            prop="groupName"
            label="小组名称"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="createTime"
            label="创建时间"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="leader"
            :formatter="leadrMatter"
            label="小组负责人"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column label="对讲机" width="width" align="center">
            <template slot-scope="{row}">
              <span v-if="row.intercom">{{row.intercom.name}}</span>
              <span v-else>未绑定</span>
            </template>
          </el-table-column>
          <el-table-column prop="members" label="小组成员" width="width" align="center">
            <template slot-scope="scope">
              <el-button class="yn_btn" type="text" @click="seeMembers(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="groupDuty" label="职责" width="width" align="center"></el-table-column>
          <el-table-column v-if="userPrisonId!=1" label="操作" width="width" align="center">
            <template slot-scope="scope">
              <el-button class="yn_text_btn" type="text" @click="editGroup(scope.row)">编辑</el-button>
              <el-button class="yn_text_btn" type="text" @click="delGroup(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <setting-dialog @submit="getReserveGroupList" ref="settingDialog"></setting-dialog>
      <el-dialog class="yn_dialog" :visible.sync="membersVisible" title="查看成员" center>
        <table-view noPage noBottom noSearch :tableData="memberList">
          <template slot="table-column">
            <el-table-column align="center" property="realName" label="姓名"></el-table-column>
            <el-table-column align="center" property="workPositionName" label="职务"></el-table-column>
            <el-table-column align="center" property="phoneNo" label="电话"></el-table-column>
          </template>
        </table-view>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="membersVisible=false">确定</el-button>
        </span>
      </el-dialog>
    </menuTree>
  </deptLayout>
</template>
<script>
import tableView from '@/components/table_view/'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import { getReserveGroupList, delGroup } from '../server.js'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'
import settingDialog from './dialog'
import { formatDate } from '@/utils/date'

export default {
  components: { tableView, deptLayout, tab, menuTree, settingDialog },
  data() {
    return {
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      typeList: [],
      searchData: {},
      tableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },
      tableLoading: true,
      membersVisible: false,
      memberList: { list: [], total: 0, pageNum: 1, pageSize: 100 }
    }
  },
  created() {
    this.getReserveGroupList()
  },
  methods: {
    // 重置查询
    reset() {
      this.tableData.pageNum = 1
      this.tableData.pageSize = 10
      this.tableData.list = []
      this.tableData.total = 0
      this.searchData = {}
      this.getReserveGroupList()
    },
    // 获取表格数据
    getReserveGroupList() {
      this.tableLoading = true
      this.searchData.currentPage = this.tableData.pageNum
      this.searchData.pageSize = this.tableData.pageSize
      this.searchData.prisonId = this.prisonId
      if (this.searchData.date) {
        this.searchData.beginTime = formatDate(
          new Date(this.searchData.date[0]),
          'yyyy-MM-dd hh:mm:ss'
        )
        this.searchData.endTime = formatDate(
          new Date(this.searchData.date[1]),
          'yyyy-MM-dd hh:mm:ss'
        )
      }
      getReserveGroupList(this.searchData).then(res => {
        this.tableData.list = res.rows
        this.tableData.total = res.total
        this.tableLoading = false
      })
    },
    // 查看成员
    seeMembers(data) {
      this.membersVisible = true
      this.memberList.list = data.members
    },
    // 监狱切换
    nodeClick(val) {
      this.prisonId = val.id
      this.reset()
    },
    addGroup() {
      this.$refs.settingDialog.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.settingDialog.mod = 'add'
      })
    },
    editGroup(data) {
      this.$refs.settingDialog.dialogVisible = true
      this.$nextTick(() => {
        let params = JSON.parse(JSON.stringify(data))
        params.memberIds = params.members.map(item => {
          return item.userGuid
        })
        this.$refs.settingDialog.params = params
        this.$refs.settingDialog.groupId = data.id
        this.$refs.settingDialog.mod = 'edit'
      })
    },
    delGroup(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delGroup([data.id]).then(res => {
            this.$message.success('删除成功')
            this.getReserveGroupList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 表格数据格式
    typeMatter(row, column, cellValue, index) {
      let str = ''
      this.typeList.forEach(item => {
        item.subclassGuid == cellValue ? (str = item.value) : ''
      })

      return str
    },
    leadrMatter(row, column, cellValue, index) {
      return cellValue.realName
    }
  }
}
</script>
<style scoped lang="less">
/deep/.el-select {
  width: 100%;
}
</style>
