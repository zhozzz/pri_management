<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:32:30
 -->

<template slot-scope="scope">
  <!-- 应急小组管理 -->
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['指挥调度','预案管理']">
      <tab
        slot="heade_btn"
        name="预案小组管理"
        :left="true"
        pathName="reserve_group_management"
        leftName="预案管理"
      />
      <table-view
        :tableData="tableData"
        noBottom
        v-loading="tableLoading"
        @sizeChange="getReserveList"
      >
        <div slot="searchCondition">
          <el-form ref="form" inline class="yn_form">
            <el-form-item label="预案名称：">
              <el-input class="yn_ipt" v-model="searchData.planName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="预案类型：">
              <el-select class="yn_ipt" @focus="searchType" v-model="searchData.planType">
                <el-option
                  v-for="item in planOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
              <el-button class="yn_btn" @click="getReserveList" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>
              <el-button class="yn_btn" v-if="userPrisonId!=1" @click="addReserve" type="primary">新建</el-button>
              <!-- <el-button class="yn_btn" v-if="userPrisonId!=1" @click="delTeams" type="primary">批量解散</el-button> -->
            </el-form-item>
            <el-form-item>
              <i @click="showRules" class="el-icon-warning"></i>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column
            show-overflow-tooltip
            prop="planName"
            label="预案名称"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column prop="planTypeName" label="类型" width="width" align="center"></el-table-column>
          <el-table-column prop="firstCommand" label="指挥长" width="width" align="center">
            <template slot-scope="{row}">
              <span v-if="row.firstCommand">{{row.firstCommand.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="secondCommands"
            :formatter="leadrMatter"
            label="副指挥"
            width="width"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <span v-for="(item,i) in row.secondCommands" :key="i">
                {{item.realName}}
                <span v-if="i<row.secondCommands.length-1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="group"
            :formatter="leadrMatter"
            label="预案小组"
            width="width"
            align="center"
          >
            <template slot-scope="{row}">
              <!-- <el-tag v-for="(item,i) in row.group" :key="i" type="success">{{item.groupName}}</el-tag> -->
              <span v-for="(item,i) in row.group" :key="i">
                {{item.groupName}}
                <span v-if="i<row.group.length-1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="width" align="center"></el-table-column>
          <el-table-column label="操作" width="width" align="center">
            <template slot-scope="scope">
              <div class="yn_btn_box_inTable">
                <el-button
                  v-if="userPrisonId!=1"
                  class="yn_text_btn"
                  type="text"
                  @click="editReserve(scope.row)"
                >编辑</el-button>
                <el-button class="yn_text_btn" type="text" @click="reserveDetail(scope.row)">详情</el-button>
                <el-button
                  v-if="userPrisonId!=1"
                  class="yn_text_btn"
                  type="text"
                  @click="delReverse(scope.row)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <setting-dialog @submit="getReserveList" ref="settingDialog"></setting-dialog>
      <el-dialog class="yn_dialog" :visible.sync="membersVisible" title="查看成员" center>
        <table-view noPage noBottom noSearch :tableData="memberList">
          <template slot="table-column">
            <el-table-column property="realName" label="姓名"></el-table-column>
            <el-table-column property="workPositionName" label="职务"></el-table-column>
          </template>
        </table-view>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="membersVisible=false">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog class="yn_dialog" :visible.sync="ruleVisible" title="查看" center>
        <div v-for="(item,i) in rules" :key="i" class="txt_box">
          <div class="yn_page_title">
            <span>{{item.id=='general_rules'?'总则':"基本原则"}}</span>

            <i class="el-icon-edit" v-if="prisonId==1" @click="openEdit(item)"></i>
          </div>
          <div class="main" v-html="item.txt"></div>
        </div>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="ruleVisible=false">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog append-to-body class="yn_dialog" :visible.sync="editVisible" title="编辑" center>
        <div class="yn_page_title">
          <span>{{editForm.id=='general_rules'?'总则':"基本原则"}}</span>
        </div>
        <quill-editor v-model="editForm.txt" id="quill" :options="editorOption"></quill-editor>

        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="saveEdit">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        append-to-body
        class="yn_dialog"
        :visible.sync="detailVisible"
        :title="detail.planName"
        center
        width="60%"
      >
        <el-form
          :model="detail"
          ref="form"
          label-position="right"
          label-width="100px"
          class="yn_form"
        >
          <el-form-item label="预案类型：" prop="planTypeName">
            <span class="delailInfo">{{detail.planTypeName}}</span>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTime">
            <span class="delailInfo">{{detail.createTime}}</span>
          </el-form-item>
          <el-form-item label="指挥长：" prop="firstCommand" v-if="detail.firstCommand">
            <span class="delailInfo">{{detail.firstCommand.realName}}</span>
          </el-form-item>
          <el-form-item label="副指挥：" prop="secondCommands">
            <span class="delailInfo" v-for="(item,i) in detail.secondCommands" :key="i">
              {{item.realName}}
              <span v-if="i< detail.secondCommands.length-1">、</span>
            </span>
          </el-form-item>
          <el-form-item label="预案小组：" prop="group">
            <table
              class="groupTable"
              v-for="(item,i) in detail.group"
              :key="i"
              rules="all"
              cellpadding="10"
            >
              <tr>
                <td :style="{'width':'20%'}" :rowspan="2">{{item.groupName}}</td>
                <td :style="{'width':'30%'}">小组成员</td>
                <td :style="{'width':'20%'}">小组职责</td>
                <td :style="{'width':'20%'}">对讲机</td>
              </tr>
              <tr>
                <td>
                  <p class="users" v-for="(user,j) in item.members" :key="j">
                    {{user.realName}}
                    <span v-if="user.phoneNo">({{user.phoneNo}})</span>
                  </p>
                </td>
                <td>{{item.groupDuty}}</td>
                <td>{{item.intercom&&item.intercomId?item.intercom.name:'未绑定'}}</td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="预案详情：" prop="planContent">
            <div class="markInfo" v-html="detail.planContent"></div>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="detailVisible=false">确定</el-button>
        </span>
      </el-dialog>
    </menuTree>
  </deptLayout>
</template>
<script>
import tableView from '@/components/table_view/'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import {
  getReserveList,
  getPlanType,
  delReverse,
  getRules,
  editRules
} from '../server.js'
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
      memberList: { list: [], total: 0, pageNum: 1, pageSize: 100 },
      planOptions: [],
      ruleVisible: false,
      rules: [],
      editVisible: false,
      editForm: {},
      editorOption: {
        // 富文本配置
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link']
          ]
        },
        theme: 'snow',
        placeholder: '富文本编辑框，支持文字、图片、公式等'
      },
      detailVisible: false,
      detail: {}
    }
  },
  created() {
    this.getReserveList()
    this.getRules()
  },
  methods: {
    showRules() {
      this.ruleVisible = true
    },
    getRules() {
      getRules().then(res => {
        this.rules = res
      })
    },
    openEdit(row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editVisible = true
    },
    saveEdit() {
      editRules(this.editForm).then(res => {
        console.log(res)
        this.editVisible = false
        this.getRules()
      })
    },
    searchType() {
      getPlanType().then(res => {
        this.planOptions = res
      })
    },
    reset() {
      this.tableData.pageNum = 1
      this.tableData.pageSize = 10
      this.tableData.list = []
      this.tableData.total = 0
      this.searchData = {}
      this.getReserveList()
    },
    // 获取表格数据
    getReserveList() {
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
      getReserveList(this.searchData).then(res => {
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
    addReserve() {
      this.$refs.settingDialog.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.settingDialog.mod = 'add'
      })
    },
    editReserve(data) {
      this.$refs.settingDialog.dialogVisible = true
      this.$nextTick(() => {
        let params = JSON.parse(JSON.stringify(data))
        params.secondCommandIds = params.secondCommands.map(
          item => item.userGuid
        )
        params.groupIds = params.group.map(item => item.id)
        this.$refs.settingDialog.params = params
        this.$refs.settingDialog.mod = 'edit'
      })
    },
    delReverse(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delReverse([data.id]).then(res => {
          this.$message.success('删除成功')
          this.getReserveList()
        })
      })
    },
    //详情
    reserveDetail(row) {
      this.detail = row
      this.detailVisible = true
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
.txt_box {
  margin: 2rem 0;
}
.yn_page_title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 1.6rem;
    font-weight: 600;
  }
}
.main {
  width: 100%;
  padding: 1rem;
}

.el-icon-warning,
.el-icon-edit {
  color: #2b8bef;
  font-size: 2rem;
  cursor: pointer;
}

.delailInfo {
  font-size: 1.1rem;
}
.groupTable {
  border: 1px solid #ccc;
  font-size: 1.1rem;
  min-width: 100%;
  margin: 1rem;
  text-align: center;
  .users {
    line-height: 1;
  }
}
.technology {
  .el-icon-warning,
  .el-icon-edit,
  .main,
  .delailInfo,
  .markInfo,
  .groupTable {
    color: #fff;
  }
}
</style>
