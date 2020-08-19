<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-30 14:03:10
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:03:24
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','监狱动态','监狱重大活动']">
      <tab slot="heade_btn" right name="重大活动管理" :pathName="'major_activities_statistics'"></tab>
      <table-view :tableData="tableData" v-loading="tableLoading" @sizeChange="changeSize" noBottom>
        <template slot="searchCondition">
          <el-form ref="searchForm" :model="queryParams" class="yn_form" inline label-width="5rem">
            <el-form-item label="时间：">
              <el-date-picker
                class="yn_ipt"
                v-model="queryParams.date"
                @change="dateChange"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="daterange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item v-if="prisonId==1" label="单位：">
              <el-cascader
                class="yn_ipt"
                @change="unitChange"
                :show-all-levels="false"
                :options="unitOptions"
                :props="unitProps"
                v-model="queryParams.eventPrison"
              ></el-cascader>
            </el-form-item>
            <el-form-item v-else label="单位：">
              <el-input class="yn_ipt" readonly v-model="unitName"></el-input>
            </el-form-item>
            <el-form-item label="部门：">
              <el-cascader
                v-if="departShow"
                v-loading="departLoading"
                class="yn_ipt"
                placeholder="选择单位后再选择部门"
                @change="departChange"
                :options="departOptions"
                :props="departProps"
                v-model="queryParams.eventDepartment"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="地点：">
              <el-select class="yn_ipt" v-model="queryParams.eventPosition">
                <el-option
                  v-for="item in positionOptions"
                  :key="item.subclassGuid"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型：">
              <el-select class="yn_ipt" v-model="queryParams.eventType">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0">
              <el-button class="yn_btn" type="primary" @click="search">查询</el-button>
              <el-button class="yn_btn" type="primary" @click="add" v-if="prisonId!=1">新增</el-button>
              <el-button class="yn_btn" type="primary" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template slot="table-column">
          <el-table-column
            show-overflow-tooltip
            prop="eventBeginTime"
            label="活动开始时间"
            width="width"
            align="center"
            min-width="120"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="eventName"
            label="活动名称"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="100"
            prop="eventPrisonName"
            label="监狱"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="100"
            prop="eventDepartmentName"
            label="部门"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="eventTypeName"
            label="类型"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="eventPositionName"
            label="地点"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="policeNum"
            label="警察人数"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="criminalNum"
            label="罪犯人数"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="visitorNum"
            label="外来人员数"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="width" align="center" min-width="200">
            <template slot-scope="{row}">
              <el-button
                class="yn_text_btn"
                type="text"
                @click="fastAdd(row)"
                v-if="prisonId!=1"
              >快速新增</el-button>
              <el-button type="text" class="yn_text_btn" @click="check(row)">查看</el-button>
              <el-button type="text" class="yn_text_btn" @click="edit(row)" v-if="prisonId!=1">编辑</el-button>
              <el-button
                type="text"
                class="yn_text_btn"
                @click="del(row)"
                style="color:red"
                v-if="prisonId!=1"
              >删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>
    </menuTree>
  </dept-layout>
</template>
<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import { MessageBox, Message } from 'element-ui'
import deptLayout from '@/components/deptLayout/index.vue'
import tab from '@/components/tab'
import { getPrisonId } from '@/utils'
import {
  getDepartDropdownInfo,
  getUnitDropdownInfo,
  getSelfPrison,
  getDic,
  getEventRecord,
  del,
  getArea
} from './service'
import tableView from '@/components/table_view'
import { expnoraml, IDCard, Isphone, Isname } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tableView, tab, deptLayout, menuTree },
  data() {
    return {
      departLoading: false,
      pickerOptions: pickerOptions,
      tableData: {
        list: [],
        pageSize: 10,
        pageNum: 1
      },
      unitName: '',
      tableLoading: false,
      prisonId: getPrisonId(),
      queryParams: {},
      unitOptions: [],
      departOptions: [],
      typeOptions: [],
      positionOptions: [],
      unitProps: {
        label: 'value',
        value: 'key',
        children: 'leafs'
      },
      departProps: {
        label: 'departName',
        value: 'id',
        children: 'list',
        checkStrictly: true
      },
      departShow: true
    }
  },
  created() {
    this.getUnitSelect(() => {
      this.changeSize()
    })
    this.getTypeAndPosition()
  },
  methods: {
    // 清除空的叶子节点
    clearLeafs(data) {
      data.forEach(item => {
        if (item.list.length < 1) {
          item.list = undefined
        } else {
          this.clearLeafs(item.list)
        }
      })
      return data
    },
    nodeClick(val) {
      this.prisonId = 1
      if (val.id === '1') {
        val.id = null
      }
      this.$set(this.queryParams, 'eventPrison', val.id)
      this.departShow = false
      getDepartDropdownInfo(val.id).then(res => {
        this.departOptions = res.list
        this.departShow = true
      })
      this.changeSize()
      this.prisonName = val.departName
    },
    dateChange(val) {
      if (val === null) {
        this.queryParams.searchFromDate = null
        this.queryParams.searchToDate = null
      } else {
        this.queryParams.searchFromDate = val[0]
        this.queryParams.searchToDate = val[1]
      }
    },
    getUnitSelect(callback) {
      if (this.prisonId === '1') {
        getUnitDropdownInfo({ eventDepartment: this.prisonId }).then(res => {
          this.unitOptions = [res]
          callback()
        })
      } else {
        getSelfPrison({ eventDepartment: this.prisonId })
          .then(res => {
            this.unitName = res.eventPrisonName
            this.$set(this.queryParams, 'eventPrison', res.eventPrison)
          })
          .then(res => {
            getDepartDropdownInfo(this.prisonId).then(res => {
              this.departOptions = this.clearLeafs(res.list)
              callback()
            })
          })
      }
    },
    // 当省局选择的单位变化的时候触发部门的重载
    unitChange(val) {
      if (!val) {
        return
      }
      this.queryParams.eventPrison = val[val.length - 1]
      this.queryParams.eventDepartment = null
      this.departLoading = true
      getDepartDropdownInfo(val[1]).then(res => {
        this.departShow = false
        this.departOptions = this.clearLeafs(res.list)
        this.departLoading = false
        this.departShow = true
      })
    },
    departChange(val) {
      if (!val) {
        return
      }
      this.queryParams.eventDepartment = val[val.length - 1]
    },
    getTypeAndPosition() {
      getDic('eventType').then(res => {
        this.typeOptions = res
      })
      getArea().then(res => {
        this.positionOptions = res
      })
    },
    // 查询
    search() {
      this.tableLoading = true
      getEventRecord(this.queryParams).then(res => {
        this.$set(this.tableData, 'list', res.list)
        this.$set(this.tableData, 'total', res.total)
        this.tableLoading = false
      })
    },
    // 新增
    add() {
      this.$router.push({ name: 'major_activities_add' })
    },
    reset() {
      this.queryParams = {
        pageSize: this.tableData.pageSize,
        pageNum: this.tableData.pageNum
      }
      this.departOptions = []
      this.getUnitSelect(() => {
        this.changeSize()
      })
    },
    // 打开编辑弹出赋值
    check({ eventId }) {
      this.$router.push({
        name: 'major_activities_check',
        query: { eventId: eventId }
      })
    },
    edit({ eventId }) {
      this.$router.push({
        name: 'major_activities_edit',
        query: { eventId: eventId }
      })
    },
    // 删除
    del({ eventId }) {
      MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        del({ eventId: eventId })
          .then(res => {
            this.$message.success('删除成功')
            this.changeSize()
            this.tableLoading = false
          })
          .catch(() => {
            this.tableLoading = false
          })
      })
    },
    fastAdd({ eventId }) {
      this.$router.push({
        name: 'major_activities_fastadd',
        query: { eventId: eventId }
      })
    },
    // 改变每页显示条数
    changeSize() {
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.pageNum = this.tableData.pageNum
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
.yn_item {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.yn_ipt {
  width: 100% !important;
}
</style>
