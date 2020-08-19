<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-06 15:35:33
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-16 16:32:04
 -->

<template>
  <el-row class="whole_page" v-loading="treeLoading" :style="wholeStyle">
    <div
      class="arrow"
      v-if="prisonId==='1'||isCenter"
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
    <el-col :span="pageIsOpen ? 4 : 0" v-if="userPrisonId==='1'||isCenter" class="page_left">
      <el-tree
        :data="selfPrisonList"
        @node-click="nodeClick"
        :props="defaultProps"
        highlight-current
        node-key="id"
        ref="tree"
        accordion
        :default-expanded-keys="[prisonId]"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <span slot-scope="
               {node,data}">
          {{data.name}}
          <span
            class="item-badge"
            v-if="data.id!=='1'"
            :class="[{error:data.state==0,success:!data.state!=0}]"
          >{{data.state==0?'未上报':''}}</span>

          <!-- <span class="item-badge success" @click="helpUP" v-if="node.level==1">代上报</span> -->
          <span v-if="data.errorState==1" class="error">数据异常</span>
        </span>
      </el-tree>
    </el-col>
    <!-- :offset="prisonId==='1'?pageIsOpen ? 4 : 0:0" -->
    <el-col
      :span="userPrisonId==='1'||isCenter?pageIsOpen ? 20 : 24:24"
      class="page_right"
      :style="rightStyle"
    >
      <div class="slot_box">
        <slot></slot>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { getPrisonId, getDeptType } from '@/utils'
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

    prisonList: {
      required: true
    },
    noPadding: {
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
      treeLoading: false,
      pageIsOpen: true,
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      isCenter: getDeptType() === '监狱' || getDeptType() === '指挥中心',
      defaultProps: {
        children: 'list',
        label: 'name'
      },

      //组件保存一次数据
      selfPrisonList: []
    }
  },
  mounted() {
    if (this.prisonId == 1) {
      this.$refs.tree.setCurrentKey('1')
      this.$refs.tree.setCheckedNodes([this.prisonId])
    }
  },
  watch: {
    prisonList: {
      deep: true,
      handler(val) {
        this.selfPrisonList = val
      }
    }
  },
  methods: {
    nodeClick(data) {
      let val = this.backData ? data : data.id
      this.$emit('input', val)
    },
    helpUP() {}
  }
}
</script>
<style lang="less" scoped>
.whole_page {
  height: 100%;
  position: relative;
}
.page_right {
  height: 100%;
}
.slot_box {
  height: 100%;
  overflow: scroll;
}
.standard {
  .arrow {
    position: absolute;
    top: 25rem;
    z-index: 100;
  }
  .page_left {
    padding-top: 1rem;
    box-shadow: 4px 0px 6px 0px rgba(11, 28, 61, 0.15);
    // position: fixed;
    // top: 5.71429rem;
    // bottom: 0;
    height: calc(100vh - 6rem);
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .page_right {
    box-sizing: border-box;
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
    // position: fixed;
    // top: 5.71429rem;
    // bottom: 0;
    height: calc(100vh - 6rem);

    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
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
.error {
  background: red;
  color: white;
  padding: 0 5px;
  border-radius: 4px;
}
</style>
