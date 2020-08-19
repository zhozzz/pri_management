<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-10 09:36:13
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-15 10:33:41
 -->
<template>
  <el-select
    class="yn_ipt"
    :loading="loading"
    filterable
    :loading-text="'正在获取'"
    :value="value"
    :multiple="multiple"
    @change="change"
  >
    <el-option v-for="item in criminalOptions" :key="item.id" :label="item.zfName" :value="item.id"></el-option>
  </el-select>
</template>
<script>
import _global from '@/utils/global_url'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      // 罪犯列表
      criminalOptions: null,
      loading: false
    }
  },
  props: {
    value: {
      required: true
    },
    multiple: false,
    deptId: null
  },
  mounted() {
    this.queryCriminalList()
  },
  methods: {
    queryCriminalList() {
      this.loading = true
      let deptId =
        this.deptId || JSON.parse(localStorage.getItem('user')).deptGuid
      this.axios
        .get(_global.businessUrl + '/criminalBase/selCriminal/' + deptId)
        .then(
          res => {
            this.criminalOptions = res
            this.loading = false
          },
          () => {
            this.loading = false
          }
        )
    },
    change(val) {
      this.$emit('input', val)
    }
  },
  watch: {
    deptId(val) {
      this.queryCriminalList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
