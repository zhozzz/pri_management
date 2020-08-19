<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-06 15:35:33
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 10:26:10
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
    <el-col :span="pageIsOpen ? 4 : 0" v-if="prisonId==='1'" class="page_left">
      <el-tree
        :data="prisondata"
        @node-click="nodeClick"
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="tree"
        :expand-on-click-node="false"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      ></el-tree>
    </el-col>
    <el-col
      :span="prisonId==='1'?pageIsOpen ? 20 : 24:24"
      :offset="prisonId==='1'?pageIsOpen ? 4 : 0:0"
      class="page_right"
      :style="rightStyle"
    >
      <div>
        <slot></slot>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { getPrisonId } from '@/utils'
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
      pageIsOpen: true,
      treeLoading: false,
      priType: '',
      prisonId: getPrisonId(),
      prisondata: [],
      defaultProps: {
        children: 'list',
        label: 'departName'
      }
    }
  },
  mounted() {
    this.getpritype()
  },
  methods: {
    getpritype() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/ORGANIZATION')
        .then(res => {
          res.map(item => {
            item.label === '监狱' ? (this.priType = item.value) : ''
          })

          this.getpridata()
        })
    },
    getpridata() {
      let that = this
      // let PrisonId = this.prisonId
      // if (PrisonId) {
      console.log(this.priType)

      this.treeLoading = true
      if (sessionStorage.getItem('DeptTree')) {
        that.prisondata = JSON.parse(sessionStorage.getItem('DeptTree'))
        this.treeLoading = false
      } else {
        this.axios
          .get(this._global.userUrl + '/compose/getChildrenTree/1')
          .then(response => {
            that.prisondata = [response]
            // 设置默认选中高亮
            if (this.prisonId == 1) {
              this.$nextTick(function() {
                // this.$refs.tree.setCurrentKey('1')
              })
            }
            sessionStorage.setItem('DeptTree', JSON.stringify([response]))
            this.treeLoading = false
          })
          .catch(error => {
            console.log(error)

            this.treeLoading = false
          })
      }
      // } else {
      //   return false
    },
    nodeClick(data) {
      if (data.departType == this.priType) {
        data.isPrison = true
      } else {
        data.isPrison = false
      }
      let val = data

      this.$emit('input', val)
    }
  }
}
</script>
<style lang="less" scoped>
.el-tree {
  font-size: 1.4rem;
}
.standard {
  .arrow {
    position: fixed;
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
</style>
