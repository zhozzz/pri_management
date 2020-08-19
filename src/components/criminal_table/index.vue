<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-10 09:36:13
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-04 10:50:46
 -->
<template>
  <!-- <el-select
    class="yn_ipt"
    :loading="loading"
    filterable
    :loading-text="'正在获取'"
    :value="value"
    :multiple="multiple"
    @change="change"
  >
    <el-option v-for="item in criminalOptions" :key="item.id" :label="item.zfName" :value="item.id"></el-option>
  </el-select>-->
  <div>
    <el-button class="yn_btn" type="primary" @click="openSel">选择罪犯</el-button>

    <el-dialog
      title="选择罪犯"
      append-to-body
      class="yn_dialog"
      center
      :visible.sync="selFlag"
      width="60%"
    >
      <table-view
        v-loading="loading"
        noIndex
        noBottom
        noPage
        height="30rem"
        @selectionchange="change"
        :tableData="tableData"
      >
        <template slot="searchCondition">
          <el-form ref="form" inline class="yn_form" label-width="80px">
            <el-form-item label="罪犯姓名">
              <el-input class="yn_ipt" v-model="searchData.name" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="罪犯编号">
              <el-input class="yn_ipt" v-model="searchData.num" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class="yn_btn" type="primary" @click="query">查询</el-button>
              <el-button class="yn_btn" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template slot="table-column">
          <el-table-column v-if="!isOnly" type="selection" width="55"></el-table-column>
          <el-table-column type="index" width="55"></el-table-column>
          <el-table-column min-width="100" align="center" prop="zfName" label="罪犯姓名" />
          <el-table-column min-width="100" align="center" prop="zfNum" label="罪犯编号" />
          <el-table-column min-width="100" align="center" prop="zfNum" label="选择" v-if="isOnly">
            <template slot-scope="scope">
              <el-button class="yn_btn" @click="sel(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="submit">确 定</el-button>
        <el-button class="yn_btn" @click="selFlag=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableView from '@/components/table_view'
import _global from '@/utils/global_url'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      // 罪犯列表
      criminalOptions: null,
      loading: false,
      selFlag: false,
      searchData: {},
      allList: [],
      tableData: { pageSize: 10, pageNum: 1, total: '', list: [] }
    }
  },
  components: {
    tableView
  },
  props: {
    value: null,
    multiple: false,
    deptId: null,
    isOnly: false
  },
  mounted () {
    this.queryCriminalList()
  },
  methods: {
    query () {
      console.log(this.searchData)
      console.log(this.tableData.list)

      this.tableData.list = []
      this.allList.map(item => {
        if (
          item.zfName.indexOf(this.searchData.name) >= 0 ||
          item.zfNum.indexOf(this.searchData.num) >= 0
        ) {
          this.tableData.list.push(item)
        }
      })
    },
    reset () {
      this.searchData = {}
      this.queryCriminalList()
    },
    queryCriminalList () {
      this.loading = true
      let deptId =
        this.deptId || JSON.parse(localStorage.getItem('user')).deptGuid
      this.axios
        .get(_global.businessUrl + '/criminalBase/selCriminal/' + deptId)
        .then(
          res => {
            this.tableData.list = res
            this.allList = res
            this.tableData.total = res.length
            this.loading = false
          },
          () => {
            this.loading = false
          }
        )
    },
    change (val) {
      this.idList = val.map(item => {
        return item.id
      })
    },
    submit () {
      this.selFlag = false

      this.$emit('input', this.idList)
    },
    sel (val) {
      this.selFlag = false
      this.$emit('input', val)
    },
    openSel () {
      this.selFlag = true
    }
  },
  watch: {
    deptId (val) {
      this.queryCriminalList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
