<!--
 * @Description: olor:red
 * @Author: 
 * @Date: 2019-09-10 14:28:30
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 16:43:58
 -->
<template>
  <div class="bor_box">
    <el-table
      :data="tableData.list"
      class="eltable"
      @selection-change="selectionchange"
      ref="tableView"
    >
      <el-table-column type="selection" v-if="selct" :selectable="selectable" align="center"></el-table-column>
      <el-table-column prop="groupName" label="小组" align="center" />
      <el-table-column prop="isComplete" :label="'是否'+word" v-if="showComplete" align="center">
        <template slot-scope="{row}">
          <span>{{row.isComplete==1?'已'+word:'进行中'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="criminalList" width="400" label="罪犯名单" align="center">
        <template slot-scope="{row}">
          <span v-if="row.selCriminalList&&showSel">
            <span
              class="criName"
              v-for="(item,i) in row.selCriminalList"
              :key="i"
              v-show="i<6"
            >{{item.zfName}}</span>
          </span>
          <span
            v-else
            class="criName"
            v-for="(item,i) in row.criminalList"
            :key="i"
            v-show="i<6"
          >{{item.zfName}}</span>
          <el-button class="yn_btn" @click="openCri(row)">更多</el-button>
        </template>
      </el-table-column>
      <slot name="colum_btns"></slot>
    </el-table>
    <!-- <table-view
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
        <el-table-column prop="isComplete" :label="'是否'+word" v-if="showComplete" align="center">
          <template slot-scope="{row}">
            <span>{{row.isComplete==1?'已'+word:'进行中'}}</span>
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
        <slot name="colum_btns"></slot>
      </template>
    </table-view>-->
    <el-dialog
      append-to-body
      title="罪犯列表"
      :visible.sync="criVisible"
      center
      class="yn_dialog"
      width="70%"
    >
      <table-view
        noSearch
        noBottom
        noPage
        noIndex
        :tableData="inGroupCriData"
        @selectionchange="selectCri"
      >
        <template slot="table-column">
          <el-table-column type="selection" v-if="criSelct" align="center"></el-table-column>

          <el-table-column align="center" prop="zfName" label="罪犯名称"></el-table-column>
          <el-table-column align="center" prop="zfNum" label="罪犯编号"></el-table-column>

          <slot name="dialog_btns"></slot>
        </template>
      </table-view>
      <div slot="footer">
        <el-button class="yn_btn" @click="criVisible=false">确定</el-button>
      </div>
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
    showSel: {
      type: Boolean,
      default: true
    },
    criSelct: {
      type: Boolean,
      default: false
    },
    showComplete: {
      type: Boolean,
      default: false
    },

    laborId: {
      type: String
    },
    word: {
      type: String,
      default: '收工'
    }
  },
  components: { tableView, criminalRegister },
  watch: {
    groupList: {
      deep: true,
      handler(val) {
        this.tableData.list = JSON.parse(JSON.stringify(val))
        this.criVisible = false
      }
    }
  },
  created() {
    this.tableData.list = JSON.parse(JSON.stringify(this.groupList))
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
      criVisible: false,
      selVal: {}
    }
  },
  methods: {
    selectionchange(val) {
      this.selGroupList = val
      this.$emit('selectionchange', this.selGroupList)
    },
    selectCri(val) {
      this.selVal.criminalIdList = val.map(item => {
        return item.id
      })
      this.selVal.selCriminalList = val.map(item => {
        return item
      })

      this.$refs.tableView.toggleRowSelection(this.selVal)
      if (this.selVal.criminalIdList.length > 0) {
        this.$refs.tableView.toggleRowSelection(this.selVal, true)
      }
    },
    openCri(val) {
      this.criVisible = true
      this.selVal = val
      this.$emit('openCri', val)
      this.inGroupCriData.list = val.criminalList
    },
    selectable(row) {
      return row.isComplete != 1
    }
  }
}
</script>
<style lang="less" scoped>
.criName {
  margin: 2px 4px;
  font-size: 1.1rem;
}
.eltable {
  border: 1px solid #ebeef5;
  border-bottom: none;
  /deep/tr td {
    font-size: 1.1rem;
  }

  /deep/ th {
    font-size: 1.4rem;
  }
}
.technology {
  .eltable {
    border: none;
  }
}
</style>