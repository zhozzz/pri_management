<!--
 * @Description: olor:red
 * @Author: 
 * @Date: 2019-09-10 14:28:30
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-18 16:44:49
 -->
<template>
  <div>
    <table-view
      :tableData="tableData"
      noPage
      noBottom
      noIndex
      noSearch
      @selectionchange="selectionchange"
    >
      <template slot="table-column">
        <el-table-column type="selection" v-if="selct" align="center"></el-table-column>
        <el-table-column prop="groupName" label="小组" align="center" />
        <!-- <el-table-column prop="deptName" label="所属监区" align="center" /> -->
        <el-table-column prop="isComplete" label="是否收工" v-if="showComplete" align="center">
          <template slot-scope="{row}">
            <span>{{row.isComplete==1?'已收工':'进行中'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="criminalList" width="300" label="罪犯名单" align="center">
          <template slot-scope="{row}">
            <span
              class="criName"
              v-for="(item,i) in row.criminalList"
              :key="i"
              v-show="i<5"
            >{{item.zfName}}</span>
            <el-button class="yn_btn" @click="openCri(row)">更多</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="completeBtn" label="操作" align="center" width="150">
          <template slot-scope="{row}">
            <el-button
              type="text"
              :disabled="row.isComplete==1"
              class="yn_text_btn"
              @click="$checkMessage(()=>complete(row.id))"
            >{{row.isComplete==1?'已收工':'收工'}}</el-button>
            <el-button
              type="text"
              v-if="row.isComplete!=1"
              class="yn_text_btn"
              @click="delGroup(row.id)"
            >移除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="添加" v-if="addBtn">
          <template slot-scope="{row}">
            <el-button type="text" class="yn_text_btn" @click="addNewGroup(row.id)">添加</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <el-dialog
      append-to-body
      title="罪犯列表"
      :visible.sync="criVisible"
      center
      class="yn_dialog"
      width="70%"
    >
      <table-view
        height="30rem"
        noSearch
        noBottom
        noPage
        noIndex
        :tableData="inGroupCriData"
        @selectionchange="selectCri"
      >
        <template slot="table-column">
          <el-table-column align="center" type="selection" v-if="selct"></el-table-column>
          <el-table-column align="center" prop="zfName" label="罪犯名称"></el-table-column>
          <el-table-column align="center" prop="zfNum" label="罪犯编号"></el-table-column>

          <el-table-column align="center" label="操作" v-if="completeBtn">
            <template slot-scope="{row}">
              <el-button
                type="text"
                :disabled="row.isComplete==1"
                class="yn_text_btn"
                @click="$checkMessage(()=>delCrimal(row.id))"
              >移除</el-button>

              <el-button
                type="text"
                :disabled="row.isComplete==1"
                class="yn_text_btn"
                @click="$checkMessage(()=>completeCri(row.id))"
              >{{row.isComplete==1?'已收工':'收工'}}</el-button>
              <criminalRegister :criminalId="row.id" :criminalName="row.zfName" />
            </template>
          </el-table-column>
        </template>
      </table-view>
      <div slot="footer"></div>
    </el-dialog>
  </div>
</template>
<script>
import tableView from '@/components/table_view'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import _globalUrl from '@/utils/global_url'

export default {
  //   props: ['groupList', 'selct'],
  props: {
    groupList: {
      type: Array,
      default: () => []
    },
    selct: {
      type: Boolean,
      default: true
    },
    showComplete: {
      type: Boolean,
      default: false
    },
    completeBtn: {
      type: Boolean,
      default: false
    },
    addBtn: {
      type: Boolean,
      default: false
    },
    laborId: {
      type: String
    }
  },
  components: { tableView, criminalRegister },
  watch: {
    groupList: {
      deep: true,
      handler(val) {
        this.tableData.list = val
      }
    }
  },
  created() {
    this.tableData.list = this.groupList
  },
  data() {
    return {
      tableData: {
        pageSize: 10,
        pageNum: 1,
        list: null
      },
      inGroupCriData: {
        pageSize: 10,
        pageNum: 1,
        list: null
      },
      criVisible: false
    }
  },
  methods: {
    selectionchange(val) {
      console.log(val)
      this.$emit('selectionchange', val)
    },
    selectCri(val) {
      console.log(val)
    },
    openCri(val) {
      this.criVisible = true
      this.inGroupCriData.list = val.criminalList
    },
    complete(row) {
      this.axios
        .put(
          _globalUrl.businessUrl +
            '/labour/oneGroupComplete/' +
            this.laborId +
            '/' +
            row
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.$emit('complete', this.laborId)
        })
    },
    completeCri(row) {
      this.axios
        .put(
          _globalUrl.businessUrl +
            '/labour/oneCriminalComplete/' +
            this.laborId +
            '/' +
            row
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.criVisible = false

          this.$emit('complete', this.laborId)
        })
    },
    delCrimal(id) {
      this.axios
        .delete(
          _globalUrl.businessUrl +
            '/labour/deleteOneCriminal/' +
            this.laborId +
            '/' +
            id
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.criVisible = false
          this.$emit('complete', this.laborId)
        })
    },
    delGroup(id) {
      this.$confirm('是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(
              _globalUrl.businessUrl +
                '/labour/deleteCriminalGroup/' +
                this.laborId +
                '/' +
                id
            )
            .then(res => {
              this.$message({
                type: 'success',
                message: res
              })

              this.$emit('complete', this.laborId)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    addNewGroup(id) {
      this.axios
        .post(
          _globalUrl.businessUrl +
            '/labour/addCriminalGroup/' +
            this.laborId +
            '/' +
            id
        )
        .then(res => {
          this.$emit('add', this.laborId)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.criName {
  margin: 2px 4px;
  font-size: 1.1rem;
}
</style>