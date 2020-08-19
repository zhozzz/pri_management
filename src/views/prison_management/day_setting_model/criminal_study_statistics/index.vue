<!--
 * @Description: 罪犯住院
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 16:04:28
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','5+1+1模式执行','罪犯学习']">
      <tab slot="heade_btn" left name="罪犯学习管理" :pathName="'criminal_study'"></tab>
      <province-statics v-if="prisonId==='1'" @getRankingPrisonId="getRankingPrisonId"></province-statics>
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
      // console.log(val)
      this.prisonId = val.id
      this.prisonName = val.departName
    },
    // 获得排名处监狱的id和name
    getRankingPrisonId(id, name) {
      this.prisonId = id
      this.prisonName = name
    }
  }
}
</script>
<style lang="less" scoped>
</style>
