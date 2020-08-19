<!--
 * @Description: 工作流程管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:21:31
 * @todo:查询未整合入组织架构id
 -->
<template>
  <menuTree :menuList="['监狱管理','指挥中心','一日工作流程']">
    <tab
      slot="heade_btn"
      leftName="一日工作流程图"
      :right="true"
      pathName="allday_workflow"
      name="工作流程管理"
    />
    <table-view :tableData="tableData" v-loading="loadingFlag" noBottom noPage>
      <template slot="searchCondition">
        <createWork @submit="getAllList" />
      </template>

      <template slot="table-column">
        <el-table-column align="center" prop="startTime" label="开始时间">
          <template slot-scope="{row}">
            <span>{{row.endTime?row.startTime+'-'+row.endTime:row.startTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="detail" label="工作事项" />
        <el-table-column align="center" show-overflow-tooltip prop="require" label="工作要求" />
        <el-table-column align="center" prop="level" :formatter="formtype" label="等级" />
        <el-table-column align="center" show-overflow-tooltip prop="repeat" label="重复日期" />
        <el-table-column align="center" prop="prop" label="操作" width="200">
          <template slot-scope="{row}">
            <div class="yn_btn_box_inTable">
              <el-button type="text" class="del_btn yn_text_btn" @click="del(row)">删除</el-button>
              <!-- <el-button type="text" class="yn_text_btn" @click="edit(scope.row)">编辑</el-button> -->
              <createWork @submit="getAllList" :eidtForm="row" :iseidt="true" />
            </div>
          </template>
        </el-table-column>
      </template>
    </table-view>
  </menuTree>
</template>

<script>
import tableView from '@/components/table_view/'
import { expnoraml, Isname, isIDCard } from '@/utils/form_valid.js'
import { MessageBox, Message } from 'element-ui'
import { getPrisonId, getDeptId } from '@/utils'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'
import { getWorkProcess, deleteWork } from '../server.js'
import createWork from '../create_work/create_work'
import formatDate from '@/utils/date'

let today = new Date()

export default {
  components: { tableView, tab, menuTree, createWork },
  data() {
    return {
      loadingFlag: true,
      rankoptions: [
        { label: '低', value: 1 },
        { label: '中', value: 2 },
        { label: '高', value: 3 }
      ],
      props: { emitPath: false, multiple: true },
      prisonId: getPrisonId(),
      deptId: getDeptId(),
      deptUserTree: [],
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 50
      },
      rules: {
        workProject: [
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入工作事项', trigger: 'blur' },
          { validator: expnoraml(''), trigger: 'blur' }
        ],
        dateTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        endDateTemp: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        workRequire: [
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入工作要求', trigger: 'blur' },
          { validator: expnoraml(''), trigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请选择工作类型', trigger: 'blur' }
        ],
        workRank: [
          { required: true, message: '请选择工作等级', trigger: 'blur' }
        ]
      },
      patrolRule: {
        dateTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        users: [{ required: true, message: '请选择巡查人员', trigger: 'blur' }],
        leader: [
          { required: true, message: '请选择巡查领导', trigger: 'blur' }
        ],
        remark: [{ validator: expnoraml(''), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAllList()
    this.getDeptUserTree()
  },
  methods: {
    getDeptUserTree() {
      let deptGuid = JSON.parse(localStorage.getItem('user')).deptGuid

      this.axios
        .get(this._global.businessUrl + '/shift/deptUserTree/' + deptGuid)
        .then(response => {
          this.deptUserTree = response.children
        })
    },

    getAllList() {
      this.tableData.list = []
      this.loadingFlag = true

      getWorkProcess(this.deptId).then(res => {
        console.log(res)
        this.loadingFlag = false
        this.tableData.list = res
      })
    },

    // 打开编辑
    edit(row) {
      this.addFlag = true
      this.dialog = false

      this.addform = JSON.parse(JSON.stringify(row))
      if (this.addform.users) {
        this.addform.usersId = this.addform.users.map(item => {
          return item.userGuid
        })
      }
    },

    // 删除
    del(row) {
      MessageBox.confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteWork(row.id).then(res => {
            this.$message.success('完成删除')
            this.getAllList()
          })
        })
        .catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 格式化数据
    formtype(row, column, cellValue, index) {
      let name = ''
      this.rankoptions.forEach(item => {
        item.value == cellValue ? (name = item.label) : ''
      })

      return name
    }
  },
  watch: {
    // 监听日期变化，获取时间选择器可选的最小时间
    date: function(val) {
      if (this.date.getTime() > today.getTime()) {
        this.showDuty = false
      } else {
        this.showDuty = true
      }
      if (this.date.getTime() == today.getTime()) {
        let hour = today.getHours()
        if (hour < 10) {
          hour = '0' + hour
        }
        let min = today.getMinutes()
        if (min < 10) {
          min = '0' + min
        }
        this.nowTime = hour + ':' + min
        this.dutyChangeFlag = true
      } else {
        this.nowTime = ''
        this.dutyChangeFlag = false
      }
      if (this.date.getTime() >= today.getTime()) {
        this.showDel = true
      } else {
        this.showDel = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.del_btn {
  color: red;
}
.yn_ipt {
  width: 100%;
}
.users {
  font-size: 1.2rem;
}
.technology {
  .users {
    color: #fff;
  }
  .yn_dialog /deep/.el-dialog__footer {
    text-align: center;
  }
}
</style>
