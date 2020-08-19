<!--
 * @Description: 出监弹窗
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 09:42:26
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-02 15:59:28
 -->

<template>
  <div>
    <el-dialog
      title="出监登记"
      class="yn_dialog"
      center
      @close="handleDialogClose"
      :visible.sync="departureToggle"
      width="70%"
    >
      <table-view noBottom noSearch v-loading="tableLoading" :tableData="tableData">
        <template slot="table-column">
          <el-table-column label="姓名" width="120">
            <template slot-scope="{row}">
              <span v-for="(item,index) in row.vistorNameList" :key="index">{{item}}</span>
            </template>
          </el-table-column>
          <el-table-column label="人数">
            <template slot-scope="{row}">{{row.vistorNameList.length}}</template>
          </el-table-column>
          <el-table-column prop="inDateTime" label="入监时间"></el-table-column>
          <el-table-column label="带入警员">
            <template slot-scope="{row}">
              <police-detail :police="{policeId:row.inPoliceId,policeName:row.inPoliceName}" />
            </template>
          </el-table-column>

          <el-table-column prop="dept_name" label="操作">
            <template slot-scope="{row}">
              <el-button
                type="text"
                class="yn_text_btn"
                @click="visitorLeaveOpenOutPolice(row)"
              >标记出监</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="handleDepartureToggle(false)">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="指定带出警员"
      class="yn_dialog"
      center
      @close="dsparturePoliceClose"
      width="600px"
      :visible.sync="visitorLeavePoliceToggle"
    >
      <el-form ref="dutyPoliceForm" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="带出警员" prop="policeId">
          <police-select v-model="formData.outpoliceId"></police-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="visitorLeave" type="primary">确 定</el-button>
        <el-button class="yn_btn" @click="dsparturePoliceClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableView from '@/components/table_view'
import policeSelect from '@/components/police_select/index'
import policeDetail from '@/components/police_detail'
import { listLeaveVistorInfo, visitorLeave } from './service'
import { formatDate } from '@/utils/date'
export default {
  props: {
    departureToggle: {
      required: true,
      type: Boolean
    },
    prisonId: {
      type: String,
      required: true,
      default: JSON.parse(localStorage.getItem('user')).prisonId
    },
    handleDepartureToggle: {
      type: Function
    }
  },
  components: { tableView, policeSelect, policeDetail },
  data () {
    return {
      visitorLeavePoliceToggle: false,
      tableLoading: false,
      tableData: {
        list: [],
        total: null,
        pageNum: 1,
        pageSize: 10
      },
      formData: {
        outpoliceId: null
      },
      dutyPolices: [],
      rules: {
        outPoliceId: [{ required: true, message: '请选择带出警察' }]
      }
    }
  },

  methods: {
    dsparturePoliceClose () {
      this.visitorLeavePoliceToggle = false
      this.$refs.dutyPoliceForm.resetFields()
      this.formData = {}
    },
    handleDialogClose () {
      this.handleDialogToggle(false)
    },
    handleDialogToggle (status) {
      this.handleDepartureToggle(status)
    },
    // 当前在监车辆
    listLeaveVistorInfo () {
      let tempDate = formatDate(new Date(), 'yyyy-MM-dd')
      let startDate = `${tempDate} 00:00:00`
      let endDate = `${tempDate} 23:59:59`
      this.tableLoading = true
      listLeaveVistorInfo({
        startDate,
        endDate,
        prisonId: this.prisonId
      }).then(
        res => {
          this.tableData.list = res
          this.tableLoading = false
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    // 保存当前出监信息 打开警员设置
    visitorLeaveOpenOutPolice (row) {
      this.formData.row = row
      this.visitorLeavePoliceToggle = true
    },

    visitorLeave () {
      // 出监操作
      let that = this
      that.$refs.dutyPoliceForm.validate(valid => {
        if (valid) {
          let formData = that.formData.row.vistorRecordIdList.map(item => {
            return { ...item, outpoliceId: that.formData.outpoliceId }
          })

          visitorLeave(formData).then(res => {
            this.$message({
              type: 'success',
              message: '出监成功!'
            })
            that.dsparturePoliceClose()
            this.handleDialogClose()
            that.$emit('getPrisonVisitorInfo')
          })
        } else {
          return false
        }
      })
    }
  },

  watch: {
    departureToggle (newStatus) {
      if (newStatus) {
        this.listLeaveVistorInfo()
      }
    }
  }
}
</script>
