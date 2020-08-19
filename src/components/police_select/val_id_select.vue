<!--
 * @Description: 警察选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-23 14:18:35
 -->

<template>
  <el-select :value="value"
             :multiple="multiple"
             filterable
             remote
             reserve-keyword
             placeholder="请选择"
             :remote-method="remoteMethod"
             @change="onChange"
             :loading="loading">
    <el-option v-for="item in options"
               :key="item.userGuid"
               :label="item.realName"
               :value="item.userGuid+'_'+item.realName">
    </el-option>
  </el-select>
</template>
<script>
import { getDutyPolice } from './service'
import { getDeptId } from '../../utils'
import _globalUrl from '../../utils/global_url'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
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
    multiple: false
  },
  mounted () {
    this.getPoliceList()
  },
  methods: {
    remoteMethod (query) {
      this.loading = true
      this.getPoliceList(query)
    },
    getPoliceList () {
      // getDutyPolice().then(res => {
      //   this.options = res
      //   this.loading = false
      // })
      this.axios.get(_globalUrl.userUrl + '/userManage/selPolice/' + getDeptId())
        .then(res => {
          this.options = res
          this.loading = false
        })
    },
    onChange (val) {
      // console.log(val)
      this.$emit('input', val)
    }
  }
}
</script>
