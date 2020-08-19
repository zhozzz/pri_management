<!--
 * @Description: 部门选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-19 11:08:24
 -->

<template>
  <el-select
    v-loading="loading"
    @change="onChange"
    filterable
    class="yn_ipt"
    v-model="valuea"
    placeholder="请选择"
  >
    <el-option v-for="item in options" :key="item.id" :label="item.departName" :value="item.id"></el-option>
  </el-select>
</template>
<script>
import { getPrisonId, getUserId } from '@/utils'
import API from '@/api'
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
      loading: false
    }
  },
  props: {
    value: {
      default: ''
    }
  },
  watch: {
    value(val) {
      this.valuea = val
    }
  },
  mounted() {
    this.getDepartmentList()
  },
  methods: {
    getDepartmentList() {
      this.loading = true
      this.axios
        .get(API.GET_DEPART_TREE + getPrisonId())
        .then(response => {
          if (response.list) {
            this.options = response.list
          }
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    },
    onChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="less" scoped>
.el-scrollbar.el-cascader-menu {
  max-height: 500px;
}
</style>
