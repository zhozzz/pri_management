<template>
  <div>
    <el-dialog
      title="小组详情"
      class="yn_dialog"
      center
      @close="close"
      :visible.sync="dialogVisible"
      width="width"
    >
      <el-form :model="params" ref="form" label-position="left" label-width="100px" class="yn_form">
        <el-form-item
          label="小组名称"
          prop="groupName"
          :rules="[{required:true,message:'请输入小组名称',trigger:'blur'}]"
        >
          <el-input class="yn_ipt" v-model="params.groupName"></el-input>
        </el-form-item>
        <el-form-item
          label="小组职责"
          prop="groupName"
          :rules="[{required:true,message:'请输入小组职责',trigger:'blur'}]"
        >
          <el-input class="yn_ipt" type="textarea" v-model="params.groupDuty"></el-input>
        </el-form-item>
        <el-form-item
          label="小组负责人"
          prop="groupName"
          :rules="[{required:true,message:'请选择负责人',trigger:'change'}]"
        >
          <!-- <police-sel v-if="dialogVisible" class="yn_ipt" v-model="params.leaderId"></police-sel> -->

          <police-select
            :isPrison="true"
            v-if="dialogVisible"
            class="yn_ipt"
            v-model="params.leaderId"
          ></police-select>
        </el-form-item>
        <el-form-item prop="interphoneId" label="绑定对讲机">
          <div class="yn_page_title">{{params.udn}}</div>
          <el-button class="yn_btn" type="primary" @click="openInter">点击选择</el-button>
        </el-form-item>
        <el-form-item
          label="成员"
          prop="memberIds"
          :rules="[{required:true,message:'请选择成员',trigger:'change'}]"
        >
          <police-select
            v-if="dialogVisible"
            class="yn_ipt"
            :isPrison="true"
            multiple
            :groupId="groupId"
            v-model="params.memberIds"
          ></police-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="submit">确 定</el-button>
        <el-button class="yn_btn" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="yn_dialog"
      @close="intercomClose"
      :visible.sync="interphoneVisible"
      title="选择对讲机"
      center
      width="60%"
    >
      <table-view noBottom :tableData="tableData" @sizeChange="queryIntercomList">
        <div slot="searchCondition">
          <el-form ref="form" class="yn_form" inline :model="tableParams">
            <el-form-item label="对讲机编号：">
              <el-input class="yn_ipt" v-model="tableParams.udn"></el-input>
            </el-form-item>
            <el-form-item label="对讲机名称：">
              <el-input class="yn_ipt" v-model="tableParams.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" @click="queryIntercomList" type="primary">查询</el-button>
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
  </div>
</template>
<script>
import policeSel from '@/components/police_select/reverse'
import policeSelect from '@/components/police_select'
import tableView from '@/components/table_view/'
import { getPrisonId } from '@/utils'
import { getIntercom, addGroup, editGroup } from '../server.js'
export default {
  components: {
    policeSelect,
    tableView,
    policeSel
  },
  data() {
    return {
      prisonId: getPrisonId(),
      mod: 'add',
      params: {
        groupName: '',
        groupDuty: '',
        leaderId: '',
        prisonId: getPrisonId(),
        udn: ''
      },
      dialogVisible: false,
      interphoneVisible: false,
      tableData: { list: [], total: 0, pageSize: 10, pageNum: 1 },
      tableParams: {},
      intercomId: '',
      udn: '',
      groupId: null
    }
  },
  methods: {
    intercomClose() {
      this.intercomId = null
      this.udn = null
    },
    close() {
      this.params = {
        groupName: '',
        groupDuty: '',
        leaderId: '',
        prisonId: getPrisonId(),
        udn: ''
      }
      this.$refs.form.resetFields()
    },
    queryIntercomList() {
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
      this.params.intercomId = this.intercomId
      this.params.udn = this.udn
      this.interphoneVisible = false
    },
    openInter() {
      this.interphoneVisible = true
      this.intercomId = this.params.intercomId
      this.udn = this.params.udn
      this.queryIntercomList()
    },
    submit() {
      this.$refs.form.validate(value => {
        if (value) {
          if (this.mod == 'add') {
            addGroup(this.params).then(res => {
              this.$message.success('新增成功')
              this.dialogVisible = false
              this.$emit('submit')
            })
          } else {
            editGroup(this.params).then(res => {
              this.$message.success('编辑成功')
              this.dialogVisible = false
              this.$emit('submit')
            })
          }
        }
      })
    }
  }
}
</script>
