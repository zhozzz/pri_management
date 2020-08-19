<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-06 15:35:33
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:24:27
 -->

<template>
  <el-row class="whole_page" v-loading="treeLoading" :style="wholeStyle">
    <div
      class="arrow"
      v-if="prisonId==='1'"
      :style="{left: pageIsOpen ? '16.30%' : '-0.4%',width: '25px'}"
    >
      <img
        v-if="theme==2"
        :src="pageIsOpen ? require('@/assets/index/closearrow.png') : require('@/assets/index/openarrow.png')"
        @click="pageIsOpen=!pageIsOpen"
        style="width:100%"
      />
      <img
        v-else-if="theme==1"
        :src="pageIsOpen ? require('@/assets/index/closearrow2.png') : require('@/assets/index/openarrow2.png')"
        @click="pageIsOpen=!pageIsOpen"
        style="width:50%;margin-left:28%"
      />
    </div>
    <el-col :span="pageIsOpen ? 4 : 0" v-if="prisonId==='1'" class="page_left sidebar-container">
      <el-tree
        :data="prisondata"
        @node-click="nodeClick"
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="tree"
        default-expand-all
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <span slot-scope="
               {data}">
          <!-- v-if="data.reportTimes!='0'" -->
          {{data.departName}}
          <span
            class="item-badge"
            v-if="data.id!=='1'"
            :class="[{error:data.overTime,success:!data.overTime}]"
          >{{data.reportTimes}}</span>
        </span>
      </el-tree>
    </el-col>
    <el-col
      :span="prisonId==='1'?pageIsOpen ? 20 : 24:24"
      :offset="prisonId==='1'?pageIsOpen ? 4 : 0:0"
      class="page_right"
      :style="rightStyle"
    >
      <slot></slot>
    </el-col>
  </el-row>
</template>
<script>
import { getPrisonId } from '@/utils'
import { formatDate } from '@/utils/date'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      required: true
    },
    backData: {
      type: Boolean,
      default: false
    },
    date: {
      required: true
    }
  },
  data() {
    return {
      theme: localStorage.getItem('theme'),
      wholeStyle: {
        backgroundColor:
          this.$route.name === 'main_page' ? '#1F54AF' : '#FBFCFF'
      },
      rightStyle: {
        borderLeft:
          this.$route.name !== 'main_page'
            ? '1px solid rgba(205,221,237,1)'
            : 'none',
        backgroundColor: this.$route.name === 'main_page' ? '#0d386b' : '#fff'
      },
      treeLoading: false,
      pageIsOpen: true,
      prisonId: getPrisonId(),
      prisondata: [],
      defaultProps: {
        children: 'list',
        label: 'departName'
      }
    }
  },
  mounted() {
    this.getpridata()
  },
  watch: {
    date() {
      this.getpridata()
    }
  },
  methods: {
    getpridata() {
      let that = this
      // let PrisonId = this.prisonId
      // if (PrisonId) {
      this.treeLoading = true
      this.axios
        .get(
          this._global.businessUrl +
            '/safetyDailyReportController/getLeftTreeAndReportNum?date=' +
            formatDate(this.date, 'yyyy-MM-dd')
        )
        .then(response => {
          that.prisondata = [response]
          // 设置默认选中高亮
          if (this.prisonId == 1) {
            this.$nextTick(function() {
              this.$refs.tree.setCurrentKey('1')
            })
          }
          this.treeLoading = false
        })
        .catch(error => {
          console.log(error)
          this.treeLoading = false
        })
      // } else {
      //   return false
    },
    nodeClick(data) {
      let val = this.backData ? data : data.id
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="less" scoped>
.standard {
  .arrow {
    position: absolute;
    top: 25rem;
    z-index: 100;
  }
  .page_left {
    padding-top: 1rem;
    box-shadow: 4px 0px 6px 0px rgba(11, 28, 61, 0.15);
    position: fixed;
    top: 5.71429rem;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .page_right {
    box-shadow: 4px 0px 6px 0px rgba(11, 28, 61, 0.15) inset;
  }
}
.technology {
  .el-tree {
    color: #fff;
    background: transparent !important;
    padding-bottom: 2rem;
    // focus的颜色
    /deep/.el-tree-node .el-tree-node.is-focusable:focus {
      .el-tree-node__content {
        background: #042044;
      }
    }
    // 鼠标悬浮的颜色
    /deep/.el-tree-node__content:hover {
      background: #042044;
    }
    // focus过后点击鼠标显示的颜色
    /deep/.el-tree-node.is-current > .el-tree-node__content {
      background: #042044 !important;
    }
  }
  .arrow {
    position: fixed;
    top: 25rem;
    z-index: 100;
  }
  .page_left {
    padding-top: 1rem;
    box-shadow: 4px 0px 6px 0px rgba(11, 28, 61, 0.15);
    background: #054284;
    position: fixed;
    top: 5.71429rem;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .page_right {
    box-shadow: 4px 0px 6px 0px rgba(11, 28, 61, 0.15) inset;
    background-color: transparent !important;
    border: none !important;
  }
}
.item-badge.error {
  background: #f56c6c;
  color: white;
  padding: 0 5px;
  border-radius: 4px;
}
.item-badge.success {
  background: #409eff;
  color: white;
  padding: 0 5px;
  border-radius: 4px;
}
.item-badge.warn {
  background: #e6a23c;
  color: white;
  padding: 0 5px;
  border-radius: 4px;
}
</style>
