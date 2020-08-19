<!--
 * @Description: 罪犯住院
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:02:58
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','监狱动态','监狱重大活动']">
      <tab slot="heade_btn" left name="重大活动管理" :pathName="'major_activities'"></tab>
      <province-statics :prisonId="prisonId" v-if="prisonId==='1'"></province-statics>
      <prison-statics v-else :prisonId="prisonId" :prisonName="prisonName"></prison-statics>
    </menuTree>
  </dept-layout>
</template>
<script>
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import provinceStatics from './province_statistics/index'
import prisonStatics from './prison_statistics/index'
import tab from '@/components/tab'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    deptLayout,
    provinceStatics,
    prisonStatics,
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
      this.prisonId = val.id
      this.prisonName = val.departName
    }
  }
}
</script>
<style lang="less" scoped>
</style>
