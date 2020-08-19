<!--
 * @Description: 警察选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-02-17 09:55:55
 -->

<template>
  <el-select
    :value="value"
    :multiple="multiple"
    filterable
    class="yn_ipt"
    :disabled="disabled"
    reserve-keyword
    placeholder="请选择"
    @visible-change="visibleChange"
    @change="onChange"
    :loading="loading"
  >
    <!-- remote
    :remote-method="remoteMethod"-->
    <el-option
      v-for="item in options"
      :key="item.userGuid"
      :label="item.realName"
      :value="item.userGuid"
    ></el-option>
  </el-select>
</template>
<script>
import { getDutyPolice } from './service'
import _globalUrl from '../../utils/global_url'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      options: [],
      list: [],
      loading: false
    }
  },
  props: {
    value: {
      required: true
    },
    disabled: false,
    departId: '',
    multiple: false
  },
  watch: {
    departId(val) {
      this.getPoliceList()
    }
  },
  mounted() {
    this.getPoliceList()
  },
  methods: {
    remoteMethod(query) {
      this.loading = true
      this.getPoliceList()
    },
    visibleChange(val) {
      if (val) {
        this.getPoliceList()
      }
    },
    getPoliceList() {
      // getDutyPolice({ deptId: this.departId }).then(res => {
      //   this.options = res
      //   this.loading = false
      // })
      this.axios
        .get(_globalUrl.userUrl + '/userManage/selPolice/' + this.departId)
        .then(res => {
          this.options = res
          this.loading = false
        })
    },
    onChange(val) {
      // console.log(val)
      this.$emit('input', val)
    }
  }
}
</script>
