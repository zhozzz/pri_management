<!--
 * @Description: 部门选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-19 17:42:57
 -->

<template>
  <el-cascader
    class="yn_ipt"
    :show-all-levels="false"
    filterable
    v-loading="loading"
    :value="value"
    :options="options"
    :props="deptProp"
    ref="cascad"
    :disabled='disabled'
    @change="onChange"
  ></el-cascader>
</template>
<script>
import { getDepartmentList } from './service'
import { getPrisonId, getUserId } from '@/utils'
import { Loading } from 'element-ui'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      valuea: '',
      options: [],
      loading: false,
      deptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true,
        emitPath: false,
        disabled: function(data, node) {}
      }
    }
  },
  props: {
    value: {
      default: () => []
    },
    multiple: false,
    disabled:false
    // style: ''
  },
  watch: {
    value: {
      deep: true,
      handler(val) {}
    }
  },
  mounted() {
    this.getDepartmentList()
  },
  methods: {
    // 递归解决空数组
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].list.length < 1) {
          data[i].list = undefined
        } else {
          this.getTreeData(data[i].list)
        }
      }
      return data
    },
    getDepartmentList() {
      // let loadingInstance = Loading.service({
      //   lock: true,
      //   text: '加载中……',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      this.loading = true
      getDepartmentList(getPrisonId())
        .then(response => {
          let data = this.getTreeData(response.list)
          this.options = data
          this.loading = false
          // loadingInstance.close()
        })
        .catch(error => {
          this.loading = false
        })
    },
    onChange(val) {
      this.$emit('input', val)
      //   this.$emit('input', val[val.length - 1])
    }
  }
}
</script>
<style lang="less" scoped>
.el-scrollbar.el-cascader-menu {
  max-height: 500px;
}
</style>
