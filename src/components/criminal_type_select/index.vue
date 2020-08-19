<!--
 * @Description:返回id+name
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-24 11:35:10
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-24 11:40:42
 -->
<template>
  <el-select class="yn_ipt"
             :value="value"
             :multiple="multiple"
             @change="change">
    <el-option v-for="item in criminalOptions"
               :key="item.value"
               :label="item.label"
               :value="item.value+'|'+item.label">
    </el-option>
  </el-select>
</template>
<script>
import _global from '@/utils/global_url'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      // 罪犯列表
      criminalOptions: null
    }
  },
  props: {
    value: {
      required: true
    },
    multiple: false
  },
  mounted () {
    this.queryCriminalList()
  },
  methods: {
    queryCriminalList () {
      this.axios.get(_global.userUrl + '/dictionary/option/CrimeType').then(res => {
        this.criminalOptions = res
      })
    },
    change (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
