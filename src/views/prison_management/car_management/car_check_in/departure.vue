<!--
 * @Description: 出监弹窗
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 09:42:26
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-04 14:48:27
 -->

<template>
  <div>
    <el-dialog class="yn_dialog"
               title="出监登记"
               center
               @close="handleDialogClose"
               :visible.sync="departureToggle">
      <table-view noBottom
                  noSearch
                  noPage
                  v-loading="tableLoading"
                  :tableData="tableData">
        <template slot="table-column">
          <el-table-column label="车牌号"
                           prop="cardNum"></el-table-column>
          <el-table-column prop="swipecardTime"
                           label="入监时间" />
          <el-table-column prop="dept_name"
                           label="带入警员">
            <template slot-scope="{row}">
              <police-detail :police="{
                policeId: row.inpoliceId,
                policeName: row.inpoliceName}" />
            </template>
          </el-table-column>
          <el-table-column prop="dept_name"
                           label="操作">
            <template slot-scope="{row}">
              <el-button type="text"
                         class="yn_text_btn"
                         @click="selectDsparturePolice(row)">标记离监</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <span slot="footer"
            class="dialog-footer">
        <el-button class="yn_btn"
                   @click="handleDepartureToggle(false)">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="指定带出警员"
               center
               @close="dsparturePoliceClose"
               width="600px"
               :visible.sync="dsparturePoliceToggle">
      <el-form ref="dutyPoliceForm"
               :model="formData"
               :rules="rules"
               label-width="80px">
        <el-form-item label="带出警员"
                      prop="outpoliceId">
          <policeSelect v-model="formData.outpoliceId" />
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button class="yn_btn"
                   @click="departure"
                   type="primary">确 定</el-button>
        <el-button class="yn_btn"
                   @click="dsparturePoliceClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableView from '@/components/table_view'
import policeSelect from '@/components/police_select'
import policeDetail from '@/components/police_detail'
import { formatDate } from '@/utils/date'
import { getInPrisonCars, carDeparture } from './service'

export default {
  props: ['departureToggle', 'handleDepartureToggle', 'startDate', 'endDate'],
  components: { tableView, policeSelect, policeDetail },

  data () {
    return {
      tableLoading: true,
      dsparturePoliceToggle: false,
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      formData: {
        outpoliceId: null,
        row: {}
      },
      dutyPolices: [],
      rules: {
        outpoliceId: [{ required: true, message: '请选择带出警察' }]
      }
    }
  },

  methods: {
    dsparturePoliceClose () {
      this.dsparturePoliceToggle = false
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
    getInPrisonCars () {
      this.tableLoading = true
      getInPrisonCars({
        startDate: this.startDate,
        endDate: this.endDate,
        prisonId: this.$route.query.prisonId
      }).then(
        res => {
          this.tableData.list = res
          this.tableLoading = false
        },
        err => {
          this.tableLoading = false
        }
      )
    },
    // 保存当前出监信息 打开警员设置
    selectDsparturePolice (row) {
      this.formData.row = row
      this.dsparturePoliceToggle = true
    },

    departure () {
      // 离监操作
      let that = this
      that.$refs.dutyPoliceForm.validate(valid => {
        if (valid) {
          let formData = {
            ...this.formData.row,
            outpoliceId: this.formData.outpoliceId
          }
          carDeparture(formData).then(res => {
            that.dsparturePoliceClose()
            that.handleDialogToggle(false)
            that.$emit('getPrisonOutSideCarInfo')
          })
        } else {
          return false
        }
      })
    }
  },

  watch: {
    departureToggle (newStatus) {
      let that = this
      if (newStatus) {
        that.getInPrisonCars()
        // that.getDutyPolice()
      }
    }
  }
}
</script>
