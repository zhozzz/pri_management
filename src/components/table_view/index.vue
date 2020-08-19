<!--
 * @Description: 表格组件
 * @Author:
 * @Github:
 * @Date: 2019-08-21 10:24:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:18:57
 -->
<template>
  <div class="table-container">
    <el-row class="table-top-button-group" v-if="!noSearch">
      <el-col :span="24" :style="{'padding':'1rem '}">
        <slot name="searchCondition">
          <span>请添加searchCondition功能或Table传递noSearch</span>
        </slot>
      </el-col>
    </el-row>
    <div class="eltable-container" :class="{'no-page':noPage}">
      <!-- :height="customTableHeight?customTableHeight:tableHeight" -->
      <el-table
        :data="tableData.list"
        :size="size"
        class="eltable"
        :class="haveTeBorder?'haveBoder':''"
        @selection-change="handleSelectionChange"
        @row-click="handle"
        :show-header="!noTableHearder"
        border
        row-key="id"
        @sort-change="sortChange"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        :row-class-name="tableRowClassName"
        :span-method="spanMethod"
        style="width: 100%"
        :height="height"
        ref="tableView"
      >
        <el-table-column
          type="index"
          label="序号"
          v-if="!noIndex"
          align="center"
          :resizable="false"
          :index="indexMethod"
          width="55px"
        ></el-table-column>
        <slot name="table-column"></slot>
      </el-table>
    </div>
    <el-row class="pagination-container" v-if="!noPage">
      <el-col :span="24">
        <el-pagination
          :current-page.sync="tableData.pageNum"
          :disabled="disabled()"
          class="pagination-position"
          :page-size="tableData.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-row class="table-bottom-button-group" v-if="!noBottom">
      <el-col :span="24">
        <slot name="bottomCondition">
          <span>请添加bottomCondition功能或Table传递noBottom</span>
        </slot>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    sortChange: {
      type: Function,
      default: () => {}
    },
    summaryList: {
      type: Array,
      default: () => []
    },
    warningThreshold: {
      default: false
    },
    height: {
      default: null
    },
    column: {
      type: Array
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    noSearch: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    rowClick: {
      type: Function,
      default: () => {}
    },
    noTableHearder: {
      type: Boolean,
      default: false
    },
    noPage: {
      type: Boolean,
      default: false
    },
    noBottom: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    noIndex: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Object,
      default: () => {
        return {
          list: [],
          pageNum: null,
          pageSize: 10,
          total: null
        }
      }
    },
    customTableHeight: {
      default: 0,
      type: Number
    },
    tableRowClassName: {
      default: ({ row, rowIndex }) => {
        return row.warning ? 'warning-row' : 'success-row'
      },
      type: Function
    },
    spanMethod: {
      default: () => [1, 1],
      type: Function
    },
    haveTeBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // heightKey: {
      //   noPage: 48,
      //   noSearch: 56,
      //   noBottom: 56
      // },
      // tableHeight: 500
    }
  },
  watch: {
    'tableData.pageSize'() {
      this.$emit('sizeChange')
    },
    'tableData.pageNum'() {
      this.$emit('sizeChange')
    },
    summaryList: {
      deep: true,
      handler(val) {
        this.summaryMethod()
      }
    }
  },
  methods: {
    summaryMethod(params) {
      return this.summaryList
    },
    indexMethod(index) {
      return index + 1 + this.tableData.pageSize * (this.tableData.pageNum - 1)
    },
    handle(row, event, column) {
      this.rowClick(row, event, column)
    },
    returnTableHeight() {
      let h =
        (this.noPage ? 0 : this.heightKey.noPage) +
        (this.noSearch ? 0 : this.heightKey.noSearch) +
        (this.noBottom ? 0 : this.heightKey.noBottom) +
        42 +
        64 +
        24
      this.tableHeight = document.documentElement.clientHeight - h
    },
    handleOpen(key, keyPath) {},
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    handleClose(key, keyPath) {},
    disabled() {
      if (this.tableData.total) {
        if (this.tableData.total > this.tableData.pageSize) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    handleSelectionChange(val) {
      this.$emit('selectionchange', val)
    }
  },
  created() {
    // this.returnTableHeight()
  },
  mounted() {
    // const that = this
    // window.onresize = () => {
    //   return (() => {
    //     that.returnTableHeight()
    //   })()
    // }
  }
}
</script>
<style lang="less">
.table-top-button-group {
  /deep/.el-form-item {
    margin-bottom: 0.3rem;
  }
}

.eltable-container {
  th {
    /deep/.el-checkbox__inner::after {
      border-right: 1px solid #333;
      border-bottom: 1px solid #333;
    }
    /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      background: #333;
    }
  }
}
.el-table th > .cell {
  white-space: nowrap;
}
.standard {
  .table-container {
    margin-bottom: 10px;
    // 表格上工具栏
    .pagination-container {
      // margin-top: 8px;
      // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      text-align: right;
      background: #fbfcff;
      padding: 8px 6px;
      //   border: 1px solid rgba(205, 221, 237, 1);
      //   border-top: none;
    }
    .eltable-container {
      .warning-row {
        // background: #ffe4e4;
      }

      .success-row {
        // background: #f0f9eb;
      }
    }

    .table-top-button-group {
      > .el-col {
        padding: 8px 6px;
        padding-bottom: 0px;
      }
    }
    .eltable-container.no-page {
      //   border: 1px solid rgba(205, 221, 237, 1);
    }
    .eltable-container {
      padding: 1.5rem;
      background: #fbfcff;
      //   border: 1px solid rgba(205, 221, 237, 1);
      //   border-bottom: none;
    }
    .table-bottom-button-group {
      // padding-top: 8px;
      .el-col {
        text-align: right;
        padding: 8px 0;
      }
    }
    .el-table th {
      background: #dfedfe !important;
      color: #000;
      font-size: 1.1rem;
      font-weight: bold;
      * {
        background: #dfedfe !important;
      }
    }
    .el-table {
      border-color: rgba(215, 225, 237, 1);
      /deep/ td {
        font-size: 12/14rem;
        // border-color: rgba(215, 225, 237, 1);
        border-right: 1px solid #d7e1ed;
        border-bottom: 1px solid #d7e1ed;
      }
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background: #d7e1ed;
    }
    .el-table .hover-row {
      /deep/ td {
        background: #e4f3fd !important;
      }
    }
  }
}
.technology {
  .table-container {
    margin-bottom: 10px;
    // 表格上工具栏
    .pagination-container {
      text-align: right;
      background: transparent;
      padding: 8px 6px;
      color: #fff;
      .el-pagination__total {
        color: #fff;
      }
      .btn-prev,
      .btn-next {
        i {
          color: #fff;
        }
        background: transparent;
        border: 1px solid #4b94c5;
      }
      .el-pager {
        li {
          color: #fff;
          background: transparent;
          border: 1px solid #4b94c5;
        }
        .active {
          background: #2eafd8;
        }
      }
      .el-pagination__jump {
        color: #fff;
        .el-pagination__editor {
          margin-left: 5px;
          margin-right: 5px;
          background: transparent;
          border: 1px solid #4b94c5;
          border-radius: 0;
          .el-input__inner {
            height: 26px;
            padding: 0;
            border: none;
            background: transparent;
            color: #fff;
          }
        }
      }
    }
    .eltable-container {
      .warning-row {
        // background: #ffe4e4;
      }
      .success-row {
        // background: #f0f9eb;
      }
    }
    .table-top-button-group {
      > .el-col {
        padding: 8px 6px;
        padding-bottom: 0px;
      }
    }
    .eltable-container.no-page {
      margin-top: 1rem;
      //   border: 1px solid #7cdafd;
      //   box-shadow: 28px 0 28px -28px #8fdcf9 inset,
      //     0 28px 28px -28px #8fdcf9 inset, 0 -28px 28px -28px #8fdcf9 inset,
      //     -28px 0 28px -28px #8fdcf9 inset;
    }
    .eltable-container {
      margin-top: 1rem;
      padding: 1.5rem;
      //   border: 1px solid #7cdafd;
      //   box-shadow: 28px 0 28px -28px #8fdcf9 inset,
      //     0 28px 28px -28px #8fdcf9 inset, 0 -28px 28px -28px #8fdcf9 inset,
      //     -28px 0 28px -28px #8fdcf9 inset;
      .table-bottom-button-group {
        .el-col {
          text-align: right;
          padding: 8px 0;
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: #042044 !important;
      }

      .el-table {
        border-color: rgba(215, 225, 237, 1);
        /deep/th {
          background: radial-gradient(#0752bb, #2763c5) !important;
          color: #fff;
          font-size: 1.1rem;
          font-weight: bold;
          * {
            background: transparent !important;
          }
        }
        /deep/td {
          font-size: 12/14rem;
          border-color: rgba(215, 225, 237, 1);
        }
      }
      .el-table .hover-row {
        /deep/ td {
          background: #042044 !important;
        }
      }
      /deep/.el-table--border td,
      /deep/.el-table--border th,
      /deep/.el-table--border tr {
        border: none;
      }
      .el-table {
        // border: 1px solid #416db3;
        border: none;
        /deep/ td:not(:last-child) {
          border-bottom: 1px solid #416db3;
          border-right: 1px solid #416db3;
        }
        /deep/ tr:last-child td {
          border-bottom: none;
        }
      }
      .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        background: #416db3;
      }
      .haveBoder {
        /deep/ td:not(:last-child) {
          border-right: 1px solid #416db3;
        }
      }
      //   .el-table--border::after,
      //   .el-table--group::after,
      //   .el-table::before {
      //     background: transparent;
      //   }
      .el-table__fixed-right::before,
      .el-table__fixed::before {
        background: transparent;
      }
    }
    .el-table__footer-wrapper tbody td,
    .el-table__header-wrapper tbody td {
      background: transparent;
    }
  }

  .eltable-container {
    th {
      /deep/.el-checkbox__inner::after {
        border-right: 1px solid #fff;
        border-bottom: 1px solid #fff;
      }
    }
    /deep/
      .el-checkbox__input.is-disabled.is-checked
      .el-checkbox__inner::after {
      border-right: 1px solid #409eff;
      border-bottom: 1px solid #409eff;
    }
    /deep/.el-table td,
    /deep/.el-table th.is-leaf {
      border-bottom: 1px solid #409eff !important;
    }
  }
  /deep/.el-table__empty-block {
    border-left: 1px solid #416db3;
  }
}
</style>
