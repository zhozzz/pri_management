<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-18 16:29:51
 -->
<template>
  <div>
    <el-dialog
      title="罪犯禁闭/隔离登记"
      :visible="confinementVisible"
      width="60%"
      append-to-body
      center
      class="yn_dialog"
      @close="close"
    >
      <el-form ref="form" class="yn_form" :rules="rules" :model="params" label-width="12rem">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select class="yn_ipt" v-model="params.type" @change="typeChange">
                <el-option label="禁闭" :value="0"></el-option>
                <el-option label="隔离" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择罪犯">
              <el-button type="primary" class="yn_btn" @click="criVisible=true">选择</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item :label="typeName+'原因'" prop="reason">
              <el-select class="yn_ipt" v-model="params.reason">
                <el-option
                  v-for="item in reasonOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item :label="typeName+'室'" prop="roomId">
              <el-select class="yn_ipt" v-model="params.roomId">
                <el-option
                  v-for="item in roomOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="typeName+'开始时间'" prop="startTime">
              <el-date-picker
                class="yn_ipt"
                v-model="params.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="typeName+'结束时间'" prop="endTime">
              <el-date-picker
                class="yn_ipt"
                v-model="params.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="typeName+'具体原因'">
              <el-input class="yn_ipt" type="textarea" v-model="params.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          class="yn_btn"
          type="primary"
          v-loading="loading"
          @click="$checkMessage(registerConfinement)"
        >确 定</el-button>
        <el-button class="yn_btn" @click="handleCloseConfinement">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择罪犯"
      :visible.sync="criVisible"
      width="60%"
      append-to-body
      center
      class="yn_dialog"
    >
      <table-view
        :tableData="tableData"
        noBottom
        @selectionchange="selCri"
        @sizeChange="getCriList"
      >
        <div slot="searchCondition">
          <el-form class="yn_form" ref="queryForm" inline :model="queryParams" label-width="6rem">
            <el-form-item label="罪犯编号" prop="criminalNum">
              <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
            </el-form-item>

            <el-form-item label="罪犯姓名" prop="criminalName">
              <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="yn_btn" @click="getCriList">查询</el-button>
              <el-button type="primary" class="yn_btn" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column type="selection" reserve-selection align="center" />
          <el-table-column align="center" prop="zfNum" label="罪犯编号" />
          <el-table-column align="center" prop="zfName" label="罪犯姓名" />
        </template>
      </table-view>
      <div slot="footer">
        <el-button
          class="yn_btn"
          type="primary"
          v-loading="loading"
          @click="$checkMessage(saveIds)"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import criminalTable from '@/components/criminal_table'
import { getPrisonId, getDeptId } from '@/utils'
import tableView from '@/components/table_view'

export default {
  props: [
    'confinementVisible',
    'handleCloseConfinement',
    'criminalId',
    'prisonId'
  ],
  data() {
    return {
      criminalInfo: {},
      loading: false,
      criVisible: false,
      params: { type: 1 },
      typeName: '禁闭',
      roomOptions: [], // 房间号
      reasonOptions: [],
      rules: {
        type: { required: true, message: '请选择类型', trigger: 'blur' },
        // reason: { required: true, message: '请选择原因', trigger: 'blur' },
        roomId: {
          required: true,
          message: '请选择禁闭隔离室',
          trigger: 'blur'
        },
        startTime: {
          required: true,
          message: '请选择禁闭隔离开始时间',
          trigger: 'blur'
        },
        endTime: {
          required: true,
          message: '请选择禁闭隔离结束时间',
          trigger: 'blur'
        }
      },
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {},

      selCriIds: [],
      elPrisonId: getPrisonId()
    }
  },
  components: {
    criminalTable,
    tableView
  },
  created() {
    this.elPrisonId = this.prisonId
  },
  methods: {
    selCri(val) {
      console.log(val)
      this.selCriIds = val.map(item => {
        return item.id
      })
    },
    saveIds() {
      this.params.criminalIds = this.selCriIds
      this.criVisible = false
    },

    close() {
      this.handleCloseConfinement()
    },
    typeChange(val) {
      this.queryRoomIdsArr(val)
    },
    reset() {
      this.tableData = { list: [], total: 0, pageNum: 1, pageSize: 10 }
      this.queryParams = {}
      this.getCriList()
    },
    getCriList() {
      let parmas = {}
      parmas.pageSize = this.tableData.pageSize
      parmas.currentPage = this.tableData.pageNum
      //   parmas.prisonId = getDeptId()
      parmas.prisonId = this.elPrisonId
      parmas.number = this.queryParams.criminalNum
      parmas.name = this.queryParams.criminalName

      this.axios
        .post(
          _globalUrl.businessUrl + '/criminalData/queryNormalCriminals',
          parmas
        )
        .then(res => {
          console.log(res)
          this.tableData.list = res.list
          this.tableData.total = res.total
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryRoomIdsArr(val) {
      // 查询房间号
      this.axios
        .get(
          _globalUrl.userUrl + '/room/queryRoom/' + val + '/' + this.elPrisonId
        )
        // .get(_globalUrl.userUrl + '/room/queryRoomIds')
        .then(res => {
          this.roomOptions = res
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryJinbiTypeArr() {
      // 查询禁闭隔离原因选项
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/IsolationReason_JinBi')
        .then(res => {
          this.reasonOptions = res
        })
        .catch(error => {
          console.log(error)
        })
    },
    queryGeliTypeArr() {
      // 查询禁闭隔离原因选项
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/IsolationReason_GeLi')
        .then(res => {
          this.reasonOptions = res
        })
        .catch(error => {
          console.log(error)
        })
    },
    registerConfinement() {
      // 禁闭隔离登记
      this.loading = true
      if (this.params.criminalIds && this.params.criminalIds.length > 0) {
        this.axios
          .post(
            _globalUrl.businessUrl + '/criminalIsolation/addIsolationList',
            this.params
          )
          .then(res => {
            this.$message.success('添加成功')
            this.params = {}
            this.loading = false
            this.handleCloseConfinement()
            this.$emit('submit', res)
          })
          .catch(err => (this.loading = false))
      } else {
        this.$message.error('请选择罪犯')
      }
    }
  },
  watch: {
    confinementVisible(val) {
      if (val === true) {
        this.params = { type: 1 }
        this.queryRoomIdsArr(1)
        this.getCriList()
      }
    },
    params: {
      deep: true,
      handler(val) {
        // if (val.type == 1) {
        //   this.queryGeliTypeArr()
        //   this.typeName = '隔离'
        // } else if (val.type == 0) {
        //   this.queryJinbiTypeArr()
        //   this.typeName = '禁闭'
        // }
      }
    },
    prisonId(val) {
      if (!val) {
        this.elPrisonId = getPrisonId()
      } else {
        this.elPrisonId = val
      }
    }
  }
}
</script>

<style lang="less" scoped>
.yn_ipt {
  width: 100%;
}
</style>
