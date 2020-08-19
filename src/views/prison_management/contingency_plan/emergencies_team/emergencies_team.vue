<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 14:17:35
 -->

<template slot-scope="scope">
  <!-- 应急小组管理 -->
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['指挥调度','先期处置小组管理']">
      <tab slot="heade_btn" name="先期处置小组" :right="true" pathName="plan_library" leftName="先期处置流程" />
      <table-view
        :tableData="tableData"
        noBottom
        v-loading="tableLoading"
        @selectionchange="selectionchange"
        @sizeChange="getTeamData"
      >
        <div slot="searchCondition">
          <el-form ref="form" inline class="yn_form">
            <el-form-item label="先期处置小组类型：">
              <el-select v-model="searchData.teamType" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="先期处置小组名称：">
              <el-input class="yn_ipt" v-model="searchData.teamName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" @click="getTeamData" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>
              <el-button class="yn_btn" v-if="userPrisonId!=1" @click="addTeam" type="primary">新建</el-button>
              <!-- <el-button class="yn_btn" v-if="userPrisonId!=1" @click="delTeams" type="primary">批量解散</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column
            show-overflow-tooltip
            prop="teamName"
            label="小组名称"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="teamType"
            label="小组类型"
            :formatter="typeMatter"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column prop="members" label="成员信息" width="width" align="center">
            <template slot-scope="scope">
              <el-button class="yn_btn" type="text" @click="seeMembers(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="udn" label="对讲机使用情况" width="width" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.udn?'使用正常':"未绑定"}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="leader"
            :formatter="leadrMatter"
            label="小组负责人"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column v-if="userPrisonId!=1" label="操作" width="width" align="center">
            <template slot-scope="scope">
              <el-button class="yn_text_btn" type="text" @click="delTeam(scope.row)">解散</el-button>
              <el-button class="yn_text_btn" type="text" @click="editTeam(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <!-- 查看成员 -->
      <el-dialog class="yn_dialog" :visible.sync="membersVisible" title="查看成员" center>
        <table-view noPage noBottom noSearch :tableData="memberList">
          <template slot="table-column">
            <el-table-column align="center" property="realName" label="姓名"></el-table-column>
            <el-table-column align="center" property="workPositionName" label="职务"></el-table-column>
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
import { getTeamType, getTeamData, emergencyTeamDel } from './service.js'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tableView, deptLayout, tab, menuTree },

  data() {
    return {
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      typeList: [],
      searchData: {},
      tableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },
      tableLoading: true,
      membersVisible: false,
      memberList: { list: [], total: 0, pageNum: 1, pageSize: 100 },
      delIdList: []
    }
  },
  created() {
    this.getTeamType()
    this.getTeamData()
  },
  methods: {
    // 重置查询
    reset() {
      this.tableData.pageNum = 1
      this.tableData.pageSize = 10
      this.tableData.list = []
      this.tableData.total = 0
      this.searchData = {}
      this.getTeamData()
    },
    // 获取类型数据
    getTeamType() {
      getTeamType().then(res => {
        this.typeList = res
      })
    },
    // 获取表格数据
    getTeamData() {
      this.tableLoading = true
      this.searchData.currentPage = this.tableData.pageNum
      this.searchData.pageSize = this.tableData.pageSize
      this.searchData.organizationId = this.prisonId
      getTeamData(this.searchData).then(res => {
        this.tableData.list = res.list
        this.tableData.total = res.total
        this.tableLoading = false
      })
    },
    // 查看成员
    seeMembers(data) {
      console.log(data)
      this.membersVisible = true
      this.memberList.list = data.members
    },
    // 监狱切换
    nodeClick(val) {
      this.prisonId = val.id
      this.reset()
    },
    addTeam() {
      this.$router.push({ name: 'add_team' })
    },
    editTeam(data) {
      this.$router.push({ name: 'add_team', params: { data } })
    },
    delTeam(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          emergencyTeamDel([data.id]).then(res => {
            this.$message.success('删除成功')
            this.getTeamData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    selectionchange(val) {
      this.delIdList = []
      val.forEach(item => {
        this.delIdList.push(item.id)
      })
    },
    delTeams() {
      if (this.delIdList.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            emergencyTeamDel(this.delIdList).then(res => {
              this.$message.success(res)

              this.getTeamData()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
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
