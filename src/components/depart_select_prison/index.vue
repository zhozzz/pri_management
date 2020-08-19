<!--
 * @Description: 部门选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-25 16:00:12
 -->

<template>
  <el-cascader
    class="yn_cascader"
    :show-all-levels="false"
    filterable
    :value="value"
    :options="options"
    :props="deptProp"
    ref="cascad"
    @change="onChange"
  ></el-cascader>
</template>
<script>
import { getDepartmentList } from './service'
import { getPrisonId, getUserId } from '@/utils'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      valuea: '',
      options: [],
      loading: false,
      deptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true
      }
    }
  },
  props: {
    value: {
      required: true
    },
    multiple: false
    // style: ''
  },
  mounted () {
    this.getDepartmentList()
  },
  methods: {
    getDepartmentList () {
      getDepartmentList(getPrisonId())
        .then(response => {
          this.options = response.list
        })
        .catch(error => {
          console.log(error)
        })
    },
    onChange (val) {
      this.$emit('input', val[val.length - 1])
    }
  }
}
</script>
<style lang="less" scoped>
.el-scrollbar.el-cascader-menu {
  max-height: 500px;
}
</style>
