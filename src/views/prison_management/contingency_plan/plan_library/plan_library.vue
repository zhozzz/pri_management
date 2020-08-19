<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 14:16:38
 -->

<template slot-scope="scope">
  <!-- 预案库 -->
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['指挥调度','先期处置流程']">
      <tab
        slot="heade_btn"
        name="先期处置小组"
        :left="true"
        pathName="emergencies_team"
        leftName="先期处置流程"
      />

      <table-view
        :tableData="tableData"
        noBottom
        v-loading="tableLoading"
        @selectionchange="selectionchange"
        @sizeChange="getPlanData"
      >
        <div slot="searchCondition">
          <el-form ref="form" inline class="yn_form">
            <el-form-item label="创建时间：">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="date"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                align="right"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="事件类型：">
              <el-select v-model="searchData.eventType" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="先期处置流程名称：">
              <el-input
                class="yn_ipt"
                maxlength="10"
                v-model="searchData.planName"
                placeholder="请输入名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="对应警情级别：">
              <el-select v-model="searchData.emergencyLevel" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" @click="getPlanData" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>
              <el-button
                class="yn_btn"
                v-if="userPrisonId!=1"
                @click="createVisible=true"
                type="primary"
              >新建</el-button>
              <el-button class="yn_btn" v-if="userPrisonId!=1" type="primary" @click="delPlans">批量删除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column v-if="userPrisonId!=1" type="selection" align="center"></el-table-column>
          <el-table-column prop="planName" label="先期处置流程名称" width="width" align="center"></el-table-column>
          <el-table-column
            prop="eventType"
            label="事件类型"
            :formatter="typeMatter"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="emergencyLevel"
            :formatter="levelMatter"
            label="警情级别"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column prop="createUserName" label="创建人" width="width" align="center"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="createTime"
            label="创建时间"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="updateTime"
            label="最后修改时间"
            width="width"
            align="center"
          ></el-table-column>

          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                class="yn_text_btn"
                type="text"
                v-if="userPrisonId!=1"
                @click="delPlan(scope.row)"
              >删除</el-button>
              <el-button class="yn_text_btn" type="text" @click="seePlan(scope.row)">查看</el-button>

              <el-button
                class="yn_text_btn"
                type="text"
                v-if="userPrisonId!=1"
                @click="editPlan(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <!-- 弹出框 -->
      <!-- 新增 -->
      <planDialog
        v-if="userPrisonId!=1"
        :createVisible="createVisible"
        :dialogClose="dialogClose"
        @create="getPlanData"
      />
      <!-- 编辑 -->
      <planDialog
        v-if="userPrisonId!=1"
        :createVisible="editVisible"
        :dialogClose="dialogClose"
        :planForm="planForm"
        @create="getPlanData"
      />

      <!-- 查看 -->
      <el-dialog class="yn_dialog" :visible.sync="seeVisible" title="查看预案" center>
        <el-row class="items">
          <el-col :span="4">事件类型:</el-col>
          <el-col :span="18">{{planObj.eventName}}</el-col>
        </el-row>
        <el-row class="items">
          <el-col :span="4">流程名称:</el-col>
          <el-col :span="18">{{planObj.planName}}</el-col>
        </el-row>
        <el-row class="items">
          <el-col :span="4">步骤:</el-col>
          <el-col :span="18">
            <div class="stepBox" v-for="(item,i) in planObj.steps" :key="i">
              <el-row>
                <el-col :span="1">{{i+1}}、</el-col>
                <el-col :span="23">
                  <el-row>
                    <el-col :span="5">小组名称：</el-col>
                    <el-col :span="19">{{item.teamName}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="5">步骤名称：</el-col>
                    <el-col :span="19">{{item.stepName}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="5">采取措施：</el-col>
                    <el-col :span="19">{{item.detail}}</el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="seeVisible=false">确定</el-button>
        </span>
      </el-dialog>
    </menuTree>
  </deptLayout>
</template>
<script>
import tableView from '@/components/table_view/'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import formatDate from '@/utils/date'
import { getEventType, getPlanData, emergencyPlanDel } from './service'
import planDialog from './plan_dialog.vue'
import tab from '@/components/tab/index.vue'
import { pickerOptions } from '@/utils/picker_option_config.js'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tableView, deptLayout, tab, planDialog, menuTree },

  data() {
    return {
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      tableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },
      tableLoading: true,
      searchData: {},
      typeList: [],
      delIdList: [],
      date: [],
      levelList: [
        { name: '轻微', value: 1 },
        { name: '较低', value: 2 },
        { name: '中等', value: 3 },
        { name: '较高', value: 4 },
        { name: '严重', value: 5 }
      ],
      createVisible: false,
      editVisible: false,
      seeVisible: false,
      planForm: {},
      planObj: {}
    }
  },
  created() {
    this.getPlanData()
    this.getEventType()
  },
  methods: {
    // 获取事件类型
    getEventType() {
      getEventType().then(res => {
        this.typeList = res
      })
    },
    // 预案数据
    getPlanData() {
      this.tableLoading = true
      this.searchData.currentPage = this.tableData.pageNum
      this.searchData.pageSize = this.tableData.pageSize
      this.searchData.prisonId = this.prisonId
      getPlanData(this.searchData).then(res => {
        this.tableData.list = res.list
        this.tableData.total = res.total
        this.tableLoading = false
      })
    },
    // 时间参数
    timeChange(data) {
      if (data.length > 0) {
        this.searchData.startTime =
          formatDate(data[0], 'yyyy-MM-dd') + ' 00:00:00'
        this.searchData.endTime =
          formatDate(data[1], 'yyyy-MM-dd') + ' 23:59:59'
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
    },
    // 重置查询参数
    reset() {
      this.tableData.pageNum = 1
      this.tableData.pageSize = 10
      this.tableData.list = []
      this.tableData.total = 0
      this.searchData = {}
      this.date = []
      this.getPlanData()
    },
    // 监狱切换
    nodeClick(val) {
      this.prisonId = val.id
      this.reset()
    },
    dialogClose() {
      this.createVisible = false
      this.editVisible = false
    },
    // 查看
    seePlan(val) {
      console.log(val)
      this.planObj = JSON.parse(JSON.stringify(val))
      this.seeVisible = true
      this.typeList.forEach(item => {
        item.subclassGuid == this.planObj.eventType
          ? (this.planObj.eventName = item.value)
          : ''
      })
    },

    // 编辑
    editPlan(val) {
      this.editVisible = true
      this.planForm = JSON.parse(JSON.stringify(val))
    },

    // 删除
    delPlan(data) {
      console.log(data)

      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          emergencyPlanDel([data.id]).then(res => {
            this.$message.success('已删除')
            this.getPlanData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 多选删除
    selectionchange(val) {
      this.delIdList = []
      val.forEach(item => {
        this.delIdList.push(item.id)
      })
    },
    delPlans() {
      if (this.delIdList.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            emergencyPlanDel(this.delIdList).then(res => {
              this.$message.success('已删除')

              this.getPlanData()
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
    levelMatter(row, column, cellValue, index) {
      let str
      this.levelList.map(item => {
        item.value == cellValue ? (str = item.name) : ''
      })
      return str
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  }
}
</script>
<style scoped lang="less">
.yn_date_picker {
  width: 100% !important;
  font-size: 1.1rem;
  border: 1px solid rgb(153, 151, 151);
}
/deep/ .el-range-separator {
  width: 10%;
}
/deep/.el-select {
  width: 100%;
}
.items {
  margin: 1rem 0;
  font-size: 1.4rem;
}
.stepBox {
  margin-bottom: 1rem;
}
.technology {
  .items {
    color: #fff;
  }
}
</style>
