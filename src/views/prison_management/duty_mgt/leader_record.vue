<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-28 17:05:28
 * @LastEditTime: 2020-04-03 16:31:29
 * @LastEditors: zhuhao
 -->
<template slot-scope="scope">
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','值班管理','领导巡查记录']">
      <tab
        slot="heade_btn"
        name="值班工作记录"
        leftName="领导巡查记录"
        :left="true"
        pathName="duty_work_record"
      />

      <el-form :inline="true" class="demo-form-inline yn_form">
        <el-form-item label="部门">
          <el-select
            :disabled="deptList.length==0"
            v-model="selPrisonId"
            v-if="userPrisonId==1"
            class="select_box yn_ipt"
            placeholder="请选择"
            @change="deptChange"
            filterable
          >
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.departName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值班领导">
           <el-input class="yn_ipt" placeholder="请输入"  v-model="dutyLeader"></el-input>
        </el-form-item>

        <el-form-item label="选择日期">
          <el-date-picker
            class="yn_ipt"
            v-model="selectedTime"
            placeholder
            :clearable="false"
            @change="searchDuty"
            :picker-options="{}"
          ></el-date-picker>
          <el-button class="yn_btn" @click="preDay" type="primary">前一天</el-button>
          <el-button class="yn_btn" @click="today" type="primary">今天</el-button>
          <el-button
            class="yn_btn"
            @click="afterDay"
            :disabled=" new Date(selectedTime).getTime() >new Date().getTime()-24*3600*1000"
            type="primary"
          >后一天</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="yn_btn" type="primary" @click="searchDuty">查询</el-button>
          <el-button class="yn_btn" type="primary" @click="resetSearch">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            class="yn_btn"
            :style="{'width':'10rem'}"
            type="primary"
            v-if="userPrisonId==prisonId"
            @click="addFlag=true"
          >新增巡查记录</el-button>
          <el-button class="yn_btn" type="primary" @click="exportList">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- 新增登记说明 -->
      <div class="time_box">
        <div>登记说明</div>
        <div :style="{'margin':'0 10px'}">{{descriptionData}}</div>
        <div v-if="userPrisonId==1" @click="openEditDialog">
          <i :style="{'color':'#409EFF','fontSize':'1.6rem'}" class="el-icon-edit-outline"></i>
        </div>
      </div>
      <table-view
        :tableData="tableData"
        noBottom
        noSearch
        :noIndex = true
        noPage
        v-loading="loading"
        @sizeChange="searchDuty"
      >
        <template slot="table-column">
          <el-table-column label="所属监狱" align="center" prop="prisonName"></el-table-column>
          <el-table-column label="巡查领导" align="center" prop="userName"></el-table-column>
          <el-table-column label="巡查时间" align="center">
            <template slot-scope="{row}">
              <div>{{row.startTime}}-{{row.endTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="巡查区域" align="center" prop="mainArea"></el-table-column>
          <el-table-column label="备注" align="center" prop="remark"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button class="yn_text_btn" type="text" @click="$checkMessage(()=>del(row))">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <el-dialog class="yn_dialog" @close="close" :visible.sync="addFlag" title="新增工作记录" center>
        <el-form ref="form" :rules="rules" label-width="12rem" class="yn_form" :model="addForm">
          <el-form-item prop="userId" label="巡查领导：">
            <el-select class="yn_ipt" filterable v-model="addForm.userId" placeholder="请选择">
              <el-option
                v-for="(item,i) in leaderList"
                :key="i"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dateTime" label="时间：">
            <el-time-picker
              v-model="addForm.dateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="yn_ipt"
              type="datetime"
              placeholder="选择时间"
              is-range
            ></el-time-picker>
          </el-form-item>
          <el-form-item prop="mainArea" label="主要巡查地点：">
            <el-input class="yn_ipt" v-model="addForm.mainArea" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="remark" label="备注：">
            <el-input class="yn_ipt" v-model="addForm.remark" type="textarea" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="leaderPatrolAdd">确定</el-button>
          <el-button class="yn_btn" type="primary" @click="addFlag=false">取消</el-button>
        </span>
      </el-dialog>
      <el-dialog class="yn_dialog" center title="编辑说明" :visible.sync="editFLag" width="50%" @close="handleClose">
        <el-form label-width="8rem" class="yn_form" ref="editform">
          <el-form-item label="说明内容:">
            <el-input
              class="yn_ipt"
              type="textarea"
              autosize
              :maxlength="300"
              placeholder="无"
              v-model="editDescription"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button class="yn_btn" type="primary" @click="addRegisterExplain">保存</el-button>
          <el-button class="yn_btn" @click="editFLag=false">取消</el-button>
        </div>
      </el-dialog>
    </menuTree>
  </deptLayout>
</template>
<script>
import { formatDate } from '@/utils/date'
import menuTree from '@/components/menu_tree/'
import tab from '@/components/tab/index.vue'
import tableView from '@/components/table_view/'
import deptLayout from '@/components/deptLayout/index.vue'
import _globalUrl from '@/utils/global_url'

import { getPrisonId } from '@/utils'
import {
  getLeaderList,
  leaderPatrolAdd,
  leaderPatrolDel,
  getDeptList,
  getRegisterExplain,
  addRegisterExplain
} from './server'

export default {
  components: { menuTree, tableView, tab, deptLayout },

  data() {
    return {
      loading: false,
      prisonId: getPrisonId(),
      selPrisonId: null,
      userPrisonId: getPrisonId(),
      selectedTime: new Date(),
      addFlag: false,
      addForm: {},
      tableData: {
        list: []
      },
      leaderList: [],
      rules: {
        userId: [{ required: true, message: '请输入', trigger: 'blur' }],
        dateTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        mainArea: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      deptList: [],
      deptId: '',
      dutyLeader:'',
      descriptionData:'11111111111111', //情况说明
      editDescription:"",
      editFLag: false, 
    }
  },

  created() {
    this.searchDuty()
    this.getDeptUserTree()
    this.getDeptList()
    this.getRegisterExplain()
  },

  methods: {
    close() {
      this.addForm = {}
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.searchDuty()
      this.getDeptUserTree()
      this.getDeptList()
    },
    getDeptUserTree() {
      this.leaderList = []
      this.axios
        .get(
          this._global.businessUrl +
            '/duty/queryPolice/' +
            this.prisonId +
            '/true'
        )
        .then(response => {
          this.leaderList.push(...response)
        })
    },
    today() {
      this.selectedTime = new Date()
      this.searchDuty()
    },
    preDay() {
      this.selectedTime = new Date(
        new Date(this.selectedTime).getTime() - 24 * 3600 * 1000
      )
      this.searchDuty()
    },
    afterDay() {
      this.selectedTime = new Date(
        new Date(this.selectedTime).getTime() + 24 * 3600 * 1000
      )
      this.searchDuty()
    },
    searchDuty() {
      let str =
        this.prisonId +
        '/' +
        formatDate(new Date(this.selectedTime), 'yyyy-MM-dd')
      getLeaderList(str).then(res => {
        this.tableData.list = res
      })
    },
    
    resetSearch() {},
    getRegisterExplain() {
      getRegisterExplain().then(res=>{
        this.descriptionData = res
      })
    },
    addRegisterExplain() {
      addRegisterExplain({registerExplain:this.editDescription}).then(res=>{
        this.editFLag = false
        this.getRegisterExplain()
      })
    },
    leaderPatrolAdd() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.addForm))
          params.startTime = params.dateTime[0]
          params.endTime = params.dateTime[1]
          params.prisonId = this.prisonId
          leaderPatrolAdd(params).then(res => {
            console.log(res)
            this.$message.success(res)
            this.addFlag = false
            this.searchDuty()
          })
        } else {
          return false
        }
      })
    },
    del(row) {
      leaderPatrolDel(row.id).then(res => {
        console.log(res)
        this.$message.success(res)
        this.searchDuty()
      })
    },
    exportList() {
      let str =
        this.prisonId +
        '/' +
        formatDate(new Date(this.selectedTime), 'yyyy-MM-dd')
      location.href = _globalUrl.businessUrl + '/duty/leaderPatrolExport/' + str
    },

    deptChange(val) {
      console.log(val)
    },
    getDeptList() {
      this.deptList = []
      getDeptList(this.prisonId).then(res => {
        this.deptList = res.list
      })
    },
    openEditDialog() {
      this.editFLag = true
      this.editDescription  = this.descriptionData

    },
    //编辑说明保存
    subDesc() {

    },
    handleClose() {
      this.editDescription = ""
    }
  }
}
</script>
<style scoped lang='less'>
/deep/.el-range-editor.el-input__inner {
  width: 100% !important;
}
.time_box {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  margin: 1rem 0;
  // color: #fff;
  .yn_date_picker {
    margin: 0 1rem;
    width: 15rem;
  }
}
</style>
