<!--
 * @Description: 
 * @Author: zhuhao
 * @Date: 2020-04-27 21:30:33
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-29 15:53:18
 -->
<template>
  <menuTree :menuList="['监狱管理','值班管理','基本数据数据导出预览']" noMune>
    <el-table
      :data="tableData"
      class="yn_table"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :span-method="arraySpanMethod"
      height="70vh"
    >
      <el-table-column
        align="center"
        min-width="100"
        fixed
        v-if="params.exportType==1"
        label="部门"
        prop="deptName"
      ></el-table-column>
      <el-table-column align="center" v-if="params.exportType==0" label="日期" prop="date"></el-table-column>
      <el-table-column
        align="center"
        fixed
        v-if="params.exportType==1"
        label="开始日期"
        prop="beginDate"
      ></el-table-column>
      <el-table-column align="center" fixed v-if="params.exportType==1" label="结束日期" prop="endDate"></el-table-column>
      <el-table-column
        align="center"
        min-width="100"
        v-if="params.exportType==0"
        label="部门"
        prop="deptName"
      ></el-table-column>
      <el-table-column
        :prop="item.name"
        :label="item.comment"
        align="center"
        v-for="(item,i) in params.baseDataNameList"
        :key="i"
      ></el-table-column>
      <el-table-column
        :prop="item.comment"
        :label="item.comment"
        align="center"
        v-for="(item,j) in params.customDataIdList"
        :key="'custom'+j"
      ></el-table-column>
    </el-table>
    <div class="yn_btn_box_inTable">
      <el-button class="yn_btn" type="primary" @click="exportExcel">导出</el-button>
      <el-button class="yn_btn" type="primary" @click="goBack">返回</el-button>
    </div>
  </menuTree>
</template>

<script>
import menuTree from '@/components/menu_tree/'
import { formatDate } from '@/utils/date'
import _globalUrl from '@/utils/global_url'

export default {
  data() {
    return {
      params: {},
      daysList: [],
      tableData: []
    }
  },
  components: {
    menuTree
  },
  created() {
    if (this.$route.params) {
      this.params = this.$route.params
      this.getDays()
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getDays() {
      let begin = new Date(this.params.beginDate).getTime()
      let endDate = new Date(this.params.endDate).getTime()
      let days = []
      let daysLength = (endDate - begin) / (24 * 60 * 60 * 1000)
      for (let index = 0; index < daysLength; index++) {
        days.push(
          formatDate(
            new Date(endDate - 24 * 60 * 60 * 1000 * index),
            'yyyy-MM-dd'
          )
        )
      }
      days.push(formatDate(new Date(this.params.beginDate), 'yyyy-MM-dd'))
      this.daysList = days
      console.log(this.daysList)

      this.tableData = []
      if (this.params.exportType == 1) {
        this.params.deptsName.map(dept => {
          //   this.daysList.map(day => {
          this.tableData.push({
            deptName: dept,
            // date: day,
            beginDate: this.params.beginDate,
            endDate: this.params.endDate
          })
          //   })
        })
      } else {
        this.daysList.map(day => {
          this.params.deptsName.map(dept => {
            this.tableData.push({ deptName: dept, date: day })
          })
        })
      }
      console.log(this.tableData)
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        if (this.params.exportType == 0) {
          // if (this.params.exportType == 1) {
          //   if (rowIndex % this.daysList.length == 0) {
          //     return {
          //       rowspan: this.daysList.length,
          //       colspan: 1
          //     }
          //   } else {
          //     return {
          //       rowspan: 0,
          //       colspan: 0
          //     }
          //   }
          // } else {
          if (rowIndex % this.params.deptsName.length == 0) {
            return {
              rowspan: this.params.deptsName.length,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    exportExcel() {
      let excelForm = this.params

      console.log(excelForm)

      this.axios
        .post(_globalUrl.businessUrl + '/dataReport/export', excelForm, {
          responseType: 'blob'
        })
        .then(msg => {
          let url = window.URL.createObjectURL(msg.data) // 表示一个指定的file对象或Blob对象
          console.log(msg)
          let a = document.createElement('a')
          document.body.appendChild(a)

          let fileName =
            '基本数据-' + excelForm.beginDate + '-' + excelForm.endDate
          a.href = url
          a.download = fileName // 命名下载名称
          a.click() // 点击触发下载
          window.URL.revokeObjectURL(url)
        })
    },
    handleScroll() {},
    mouseOut(e) {}
  }
}
</script>
<style lang="less">
.technology {
  /deep/.el-table__fixed-right::before,
  /deep/.el-table__fixed::before {
    height: 0;
  }
}
</style>