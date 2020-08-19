<!--
 * @Description: 罪犯住院
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:40:32
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯禁闭/隔离']">
      <tab slot="heade_btn" left name="禁闭隔离管理" :pathName="'confinement_mgt'"></tab>
      <province-stastics v-if="prisonId==='1'"></province-stastics>
      <prison-stastics v-else :prisonId="prisonId" :prisonName="prisonName"></prison-stastics>
    </menuTree>
  </dept-layout>
</template>
<script>
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import provinceStastics from './province_stastics/index'
import prisonStastics from './prison_stastics/index'
import tab from '@/components/tab'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    deptLayout,
    provinceStastics,
    prisonStastics,
    tab,
    menuTree
  },
  data() {
    return {
      prisonId: getPrisonId(),
      prisonName: ''
    }
  },
  methods: {
    nodeClick(val) {
      console.log(val)
      this.prisonId = val.id
      this.prisonName = val.departName
    }
  }
}
</script>
<style lang="less" scoped>
</style>
