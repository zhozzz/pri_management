<!--
 * @Description: 请选择监区
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: fylih
 * @LastEditTime: 2019-09-30 11:18:23
 -->

<template>
  <el-select :value="value"
             :multiple="multiple"
             filterable
             remote
             reserve-keyword
             placeholder="请选择监区"
             :remote-method="remoteMethod"
             @change="onChange"
             :loading="loading">
    <el-option v-for="item in options"
               :key="item.prisonId"
               :label="item.prisonName"
               :value="item.prisonId">
    </el-option>
  </el-select>
</template>
<script>
import { getDeptList } from './service'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      options: [
      ],
      loading: false
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
    this.getDeptList()
  },
  methods: {
    remoteMethod (query) {
      this.loading = true
      this.getDeptList({ query })
    },
    getDepartmentList (query = {}) {
      getDeptList(query).then(res => {
        this.options = res
        this.loading = false
      })
    },
    onChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>
