<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 14:19:21
 -->

<template slot-scope="scope">
  <!-- 应急小组新增/编辑 -->

  <menuTree :menuList="['指挥调度','应急小组管理','新增应急小组']">
    <el-form ref="form" label-width="12rem" class="yn_form" :rules="rules" :model="formData">
      <div class="item_box">
        <el-form-item prop="teamName" label="小组名称：">
          <el-input class="yn_ipt" v-model="formData.teamName" placeholder="请输入名称"></el-input>
        </el-form-item>
      </div>
      <div class="item_box">
        <el-form-item prop="teamType" label="小组类型：">
          <el-select v-model="formData.teamType" class="select_box yn_ipt" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.subclassGuid"
              :label="item.value"
              :value="item.subclassGuid"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="item_box">
        <el-form-item prop="memberIds" label="应急小组成员">
          <!-- <el-row :gutter="10">
            <el-col :span="5" v-for="(item,i) in memberNames" :key="i">{{item}}</el-col>
          </el-row>-->
          <div class="name_box">
            <div class="names" v-for="(item,i) in memberNames" :key="i">{{item}}</div>
          </div>
          <el-button class="yn_btn" @click="membersVisible=true" type="primary">点击选择</el-button>
        </el-form-item>
      </div>
      <div class="item_box">
        <el-form-item prop="leaderId" label="小组负责人">
          <div class="names">{{leaderName}}</div>
          <el-button class="yn_btn" type="primary" @click="leaderVisible=true">点击选择</el-button>
        </el-form-item>
      </div>
      <div class="item_box">
        <el-form-item prop="interphoneId" label="绑定对讲机">
          <div class="names">{{formData.udn}}</div>
          <el-button class="yn_btn" type="primary" @click="openInter">点击选择</el-button>
        </el-form-item>
      </div>
      <div class="item_box">
        <div class="btn_box">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(emergencyTeamCreate)">保存</el-button>
          <el-button class="yn_btn" type="primary" @click="gopage">取消</el-button>
        </div>
      </div>
    </el-form>
    <el-dialog center class="yn_dialog" :visible.sync="leaderVisible" title="选择负责人">
      <div class="areaSelect">
        <div class="area_box">
          <div
            class="areas"
            :class="areaIndex==i?'areas_active':''"
            v-for="(item,i) in areaList"
            :key="i"
            @click="selecArea(i)"
          >{{item.deptName}}</div>
        </div>
        <div class="police_box">
          <div class="areas" v-if="policeLsit.length==0">暂无人员</div>
          <el-radio-group v-model="leaderId" v-else>
            <div class="areas" v-for="(item,i) in policeLsit" :key="i">
              <el-radio :label="item.userGuid">{{item.userName}}</el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="saveLeader">保存</el-button>
        <el-button class="yn_btn" type="primary" @click="leaderVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="yn_dialog" :visible.sync="membersVisible" title="选择小组成员" center>
      <div class="areaSelect">
        <div class="area_box">
          <div
            class="areas"
            :class="areaIndex==i?'areas_active':''"
            v-for="(item,i) in areaList"
            :key="i"
            @click="selecArea(i)"
          >{{item.deptName}}</div>
        </div>
        <div class="police_box">
          <div class="areas" v-if="policeLsit.length==0">暂无人员</div>

          <el-checkbox-group v-model="memberIdList" v-else>
            <div class="areas" v-for="(item,i) in policeLsit" :key="i">
              <el-checkbox :label="item.userGuid">{{item.userName}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="saveMember">保存</el-button>
        <el-button class="yn_btn" type="primary" @click="membersVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="yn_dialog"
      @close="close"
      :visible.sync="interphoneVisible"
      title="选择对讲机"
      center
      width="60%"
    >
      <table-view noBottom :tableData="tableData" @sizeChange="queryList">
        <div slot="searchCondition">
          <el-form ref="form" class="yn_form" inline :model="tableParams">
            <el-form-item label="对讲机编号：">
              <el-input class="yn_ipt" v-model="tableParams.udn"></el-input>
            </el-form-item>
            <el-form-item label="对讲机名称：">
              <el-input class="yn_ipt" v-model="tableParams.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" type="primary">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column prop="udn" label="对讲机编号" width="width" align="center" />
          <el-table-column prop="name" label="对讲机名称" width="width" align="center" />
          <el-table-column label="操作" width="width" align="center">
            <template slot-scope="scope">
              <el-button
                class="yn_text_btn"
                v-if="scope.row.id===intercomId"
                @click="delIntercom(scope.row)"
                type="text"
              >取消绑定</el-button>

              <el-button class="yn_text_btn" v-else @click="addIntercom(scope.row)" type="text">添加绑定</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="saveIntercom">保存</el-button>
        <el-button class="yn_btn" type="primary" @click="interphoneVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view/'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree/'

import {
  getTeamType,
  getTeamData,
  getOfficersUnderPrison,
  emergencyTeamCreate,
  emergencyTeamEdit,
  getIntercom
} from './service.js'
import tab from '@/components/tab/index.vue'

export default {
  components: { tableView, tab, menuTree },

  data() {
    return {
      isEdit: false, // 是否是编辑
      prisonId: getPrisonId(),
      typeList: [],
      formData: {},
      areaIndex: 0,
      areaList: [],
      policeLsit: [],
      props: {},
      leaderVisible: false,
      membersVisible: false,
      interphoneVisible: false,
      leaderId: '',
      leaderName: '',
      interphoneName: '', // 对讲机
      memberIdList: [],
      memberNames: [],
      rules: {
        teamName: [
          { min: 2, max: 50, message: '长度在 2到 50 个字符', trigger: 'blur' },
          { required: true, message: '请输入小组名称', trigger: 'blur' }
        ],
        teamType: [
          { required: true, message: '请选择小组类型', trigger: 'change' }
        ],
        leaderId: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        memberIds: [
          { required: true, message: '请选择小组成员', trigger: 'change' }
        ]
      },
      tableData: { list: [], total: 0, pageSize: 10, pageNum: 1 },
      tableParams: {},
      intercomId: '',
      udn: ''
    }
  },
  created() {
    this.getTeamType()
    this.queryList()
    this.getOfficersUnderPrison()
    if (this.$route.params.data) {
      this.setEdit()
    }
  },
  methods: {
    setEdit() {
      getOfficersUnderPrison(this.prisonId).then(res => {
        this.areaList = res
        this.setParams()
      })
    },
    setParams() {
      this.formData = this.$route.params.data
      this.intercomId = this.formData.intercomId
      this.udn = this.formData.udn
      this.isEdit = true
      this.leaderId = this.$route.params.data.leaderId
      this.$route.params.data.members.forEach(item => {
        this.memberIdList.push(item.userGuid)
      })
      this.saveLeader()
      this.saveMember()
    },
    getTeamType() {
      getTeamType().then(res => {
        this.typeList = res
      })
    },
    getOfficersUnderPrison() {
      getOfficersUnderPrison(this.prisonId).then(res => {
        this.areaList = res
        this.policeLsit = res[0].polices
      })
    },

    selecArea(i) {
      this.policeLsit = this.areaList[i].polices

      this.areaIndex = i
    },
    saveLeader() {
      this.formData.leaderId = this.leaderId
      this.areaList.forEach(item => {
        item.polices.forEach(obj => {
          obj.userGuid == this.leaderId ? (this.leaderName = obj.userName) : ''
        })
      })
      this.leaderVisible = false
    },
    saveMember() {
      this.formData.memberIds = this.memberIdList

      this.memberNames = []
      this.areaList.forEach(item => {
        item.polices.forEach(obj => {
          this.memberIdList.forEach(ids => {
            obj.userGuid == ids ? this.memberNames.push(obj.userName) : ''
          })
        })
      })
      this.membersVisible = false
    },
    emergencyTeamCreate() {
      this.formData.prisonId = this.prisonId

      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            emergencyTeamEdit(this.formData).then(res => {
              this.$message.success('操作成功')
              this.$router.push({ name: 'emergencies_team' })
            })
          } else {
            emergencyTeamCreate(this.formData).then(res => {
              this.$message.success('操作成功')

              this.$router.push({ name: 'emergencies_team' })
            })
          }
        } else {
          this.$message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    gopage() {
      this.$router.push({ name: 'emergencies_team' })
    },
    queryList() {
      let params = {}
      params.prisonId = this.prisonId
      params.currentPage = this.tableData.pageNum
      params.pageSize = this.tableData.pageSize
      params.name = this.tableParams.name
      params.udn = this.tableParams.udn
      getIntercom(params).then(res => {
        this.tableData.list = res.list
        this.tableData.total = res.total
      })
    },
    addIntercom(val) {
      this.intercomId = val.id
      this.udn = val.udn
    },
    delIntercom(val) {
      this.intercomId = null
      this.udn = null
    },
    saveIntercom(val) {
      this.formData.intercomId = this.intercomId
      this.formData.udn = this.udn
      this.interphoneVisible = false
    },
    openInter() {
      this.interphoneVisible = true
      this.intercomId = this.formData.intercomId
      this.udn = this.formData.udn
    },
    close() {
      this.intercomId = null
      this.udn = null
    }
  }
}
</script>
<style scoped lang='less'>
.item_box {
  width: 40%;
  padding: 0 0.5rem;
  font-size: 1.1rem;
  /deep/.el-form-item__label {
    font-size: 1.4rem;
  }
  /deep/.select_box {
    width: 100%;
  }
}
.btn_box {
  width: 100%;
  padding-left: 7rem;
  margin-top: 5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.names {
  font-size: 1.1rem;
}
.name_box {
  width: 100%;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  flex-wrap: wrap;
  .names {
    margin: 1rem;
  }
}
.areaSelect {
  width: 100%;
  display: flex;
  font-size: 1.4rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  color: #333;
  .area_box {
    width: 30%;
    .areas:last-child {
      border-bottom: none;
    }
  }
  .areas {
    width: 100%;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    padding: 1rem 0;
    text-align: center;
  }
  .areas_active {
    background: #f1f1f1;
    color: #409eff;
  }
  .police_box {
    width: 70%;
    height: 50rem;
    overflow: scroll;
    .areas {
      border-right: none;
    }
    /deep/.el-radio-group {
      width: 100%;
    }
  }
}
.technology {
  .areaSelect {
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
  .item_box,
  .name_box {
    color: #fff;
  }
  .areas {
    color: #fff;
    border-bottom: 1px solid #8fdcf9;
    border-left: 1px solid #8fdcf9;
    /deep/.el-checkbox {
      color: #fff;
    }
  }
  .areas_active {
    color: #409eff;
  }
}
</style>
