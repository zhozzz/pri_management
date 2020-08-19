<!--
 * @Description: 监狱 危险品管理
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 14:31:05
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:06:13
 -->

<template>
  <menuTree :menuList="['监狱管理','AB门管理','危险品详情']">
    <tab slot="heade_btn" name="危险品详情" :right="true" pathName="hazmat_management_data_statistic" />
    <table-view noBottom @sizeChange="getGoodsList" v-loading="tableLoading" :tableData="tableData">
      <div slot="searchCondition">
        <el-form ref="form" inline class="yn_form" label-width="80px">
          <el-form-item label="入监时间">
            <el-date-picker
              v-model="goodsInTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              class="yn_ipt"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="离监时间">
            <el-date-picker
              v-model="goodsOutTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              :clearable="false"
              class="yn_ipt"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="物品类型">
            <hazmat-type-select v-model="bindData.goodsType" />
          </el-form-item>
          <el-form-item label="责任警察">
            <police-select v-model="bindData.carryInPoliceNum" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="yn_btn" @click="query">查询</el-button>
            <el-button @click="reset" class="yn_btn">重置</el-button>
          </el-form-item>
          <el-form-item v-if="btnPermissions">
            <el-button type="primary" class="yn_btn" @click="openGoods">新增</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" class="yn_btn" @click="$router.back()">数据统计</el-button>
          </el-form-item>-->
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column align="center" label="物品名称" prop="goodsName" />
        <el-table-column align="center" prop="goodsTypeName" label="类型"></el-table-column>
        <el-table-column align="center" prop="goodsInNum" label="入监数量" />
        <el-table-column align="center" prop="goodsOutNum" label="离监数量" />
        <el-table-column align="center" prop="carryName" label="携带人员" />
        <el-table-column align="center" show-overflow-tooltip prop="goodsInTime" label="入监时间" />
        <el-table-column align="center" label="带入警察">
          <template slot-scope="{row}">
            <police-detail
              :police="{policeId: row.carryInPoliceNum, policeName:row.carryInPoliceName }"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsOutTime" show-overflow-tooltip label="离监时间" />
        <el-table-column align="center" label="带出警察">
          <template slot-scope="{row}">
            <police-detail
              :police="{policeId: row.carryOutPoliceNum, policeName:row.carryOutPoliceName }"
            />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="lengthOfStay" label="入监时长" />
        <el-table-column align="center" prop="thresholdValue" label="时长阈值" />
        <el-table-column align="center" prop="isWarning" label="是否预警">
          <template slot-scope="{row}">
            <span v-if="row.warning" style="color:red">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" v-if="btnPermissions">
          <template slot-scope="{row}">
            <el-button
              class="yn_text_btn"
              type="text"
              :disabled="row.goodsState===1"
              @click="openOutGoods(row)"
            >离监</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <el-dialog title="危险物品登记" class="yn_dialog" center :visible.sync="goodsToggle" width="600px">
      <el-form
        class="yn_form"
        ref="insertform"
        :model="insertGoodsData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="物品名称" prop="goodsName">
          <el-input class="yn_ipt" v-model="insertGoodsData.goodsName" placeholder="请输入物品名称" />
        </el-form-item>
        <el-form-item label="物品类型" prop="goodsType">
          <hazmat-type-select v-model="insertGoodsData.goodsType" />
        </el-form-item>
        <el-form-item label="物品数量" prop="goodsInNum">
          <el-input-number
            v-model="insertGoodsData.goodsInNum"
            :min="1"
            :controls="false"
            class="yn_ipt"
            placeholder="请输入物品数量"
          />
        </el-form-item>
        <el-form-item label="携带人员" prop="carryName">
          <el-input class="yn_ipt" v-model="insertGoodsData.carryName" placeholder="携带人员" />
        </el-form-item>
        <el-form-item label="带入警察" prop="carryInPoliceNum">
          <police-select v-model="insertGoodsData.carryInPoliceNum" placeholder="带入警察" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="closeGoods">取 消</el-button>
        <el-button class="yn_btn" type="primary" @click="$checkMessage(insertGoods)">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请指定带出警员"
      class="yn_dialog"
      center
      :visible.sync="goodsOutToggle"
      width="600px"
    >
      <el-form
        class="yn_form"
        ref="outform"
        :model="outGoodsData"
        :rules="outrules"
        label-width="80px"
      >
        <el-form-item label="物品数量" prop="goodsOutNum">
          <el-input-number
            v-model="outGoodsData.goodsOutNum"
            :min="1"
            class="yn_ipt"
            :controls="false"
            placeholder="请输入物品数量"
          />
        </el-form-item>
        <el-form-item label="带出警察" prop="carryOutPoliceNum">
          <police-select v-model="outGoodsData.carryOutPoliceNum" placeholder="带出警察" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="closeOutGoods">取 消</el-button>
        <el-button class="yn_btn" type="primary" @click="goodsOut">确认离监</el-button>
      </span>
    </el-dialog>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import { pickerOptions } from '@/utils/picker_option_config'
import hazmatTypeSelect from '@/components/hazmat_type_select'
import policeDetail from './police_detail'
import policeSelect from '@/components/police_select'
import { getGoodsList, insertGoods, goodsOut } from './service'
import permissions from '@/utils/permission.js'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    tableView,
    hazmatTypeSelect,
    policeSelect,
    policeDetail,
    tab,
    menuTree
  },
  data() {
    return {
      btnPermissions: permissions('hazmat_management_check_in_button'),
      tableLoading: false,
      bindData: {},
      goodsInTime: [],
      // goodsInStartTime: '',
      // goodsInEndTime: '',
      goodsOutTime: [],
      // goodsOutStartTime: '',
      // goodsOutEndTime: '',
      queryData: {},
      goodsToggle: false,
      goodsOutToggle: false,
      openOutGoodsId: null,
      insertGoodsData: {
        goodsInNum: 1
      },
      outGoodsData: {},
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入物品名称', trigger: 'blur' }
        ],
        goodsType: [
          { required: true, message: '请选择物品类型', trigger: 'change' }
        ],
        goodsInNum: [
          { required: true, message: '请输入物品数量', trigger: 'change' }
        ],
        carryName: [
          { required: true, message: '请输入携带人员', trigger: 'blur' }
        ],
        carryInPoliceNum: [
          { required: true, message: '请选择带入警察', trigger: 'change' }
        ]
      },
      outrules: {
        goodsOutNum: [
          { required: true, message: '请输入带出物品数量', trigger: 'blur' }
        ],
        carryOutPoliceNum: [
          { required: true, message: '请选择带出警察', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  methods: {
    query() {
      if (this.goodsInTime[0]) {
        this.bindData.goodsInStartTime = this.goodsInTime[0]
      }
      if (this.goodsInTime[1]) {
        this.bindData.goodsInEndTime = this.goodsInTime[1]
      }
      if (this.goodsOutTime[0]) {
        this.bindData.goodsOutStartTime = this.goodsOutTime[0]
      }
      if (this.goodsOutTime[1]) {
        this.bindData.goodsOutEndTime = this.goodsOutTime[1]
      }
      this.queryData = this.bindData
      this.getGoodsList()
    },
    reset() {
      this.queryData = {}
      this.bindData = {}
      this.tableData.pageNum = 1
      this.goodsInTime = []
      this.goodsOutTime = []
      this.getGoodsList()
    },
    openGoods() {
      this.goodsToggle = true
    },
    openOutGoods({ id }) {
      this.openOutGoodsId = id
      this.goodsOutToggle = true
    },
    closeGoods() {
      this.goodsToggle = false
      this.insertGoodsData = {
        goodsInNum: 1
      }
    },
    closeOutGoods() {
      this.goodsOutToggle = false
      this.outGoodsData = {}
    },
    insertGoods() {
      this.$refs.insertform.validate(valid => {
        if (valid) {
          this.$confirm(`新增危险品, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let user = JSON.parse(localStorage.getItem('user'))
              if (user) {
                this.insertGoodsData.prisonId = user.prisonId
              }
              insertGoods(this.insertGoodsData).then(res => {
                if (res) {
                  this.reset()
                  this.getGoodsList()
                  this.closeGoods()
                } else {
                  this.$message({
                    type: 'info',
                    message: '新增危险品失败!'
                  })
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '新增危险品失败!'
              })
            })
        } else {
          return false
        }
      })
    },
    goodsOut() {
      this.$refs.outform.validate(valid => {
        if (valid) {
          this.$confirm(`危险品离监, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.outGoodsData.id = this.openOutGoodsId
              goodsOut(this.outGoodsData).then(res => {
                if (res) {
                  this.reset()
                  this.getGoodsList()
                  this.closeOutGoods()
                } else {
                  this.$message({
                    type: 'info',
                    message: '离监危险品失败!'
                  })
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '取消离监危险品!'
              })
            })
        } else {
          return false
        }
      })
    },
    getGoodsList() {
      let { queryData } = this
      let { pageNum, pageSize } = this.tableData
      this.tableLoading = true
      getGoodsList({ ...queryData, pageNum, pageSize }).then(
        res => {
          this.tableData = res
          this.tableLoading = false
        },
        err => {
          that.tableLoading = false
        }
      )
    }
    // goodsOutToggle () {
    //
    // }
  },
  mounted() {
    this.getGoodsList()
  }
}
</script>
