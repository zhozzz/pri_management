<!--
 * @Description: 罪犯劳动
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 16:05:55
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menu-tree :menuList="menuList">
      <tab left slot="heade_btn" name="罪犯劳动管理" :pathName="'criminal_labour'"></tab>
      <province-statics v-if="prisonId==='1'" @getRankingPrisonId="getRankingPrisonId"></province-statics>
      <prison-statics v-else :prisonId="prisonId" :prisonName="prisonName"></prison-statics>
    </menu-tree>
  </dept-layout>
</template>
<script>
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree'
import provinceStatics from './province_statistics/index'
import prisonStatics from './prison_statistics/index'
import tab from '@/components/tab'

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
      menuList: ['5+1+1模式执行', '罪犯劳动'],
      prisonId: getPrisonId(),
      prisonName: ''
    }
  },
  methods: {
    nodeClick(val) {
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
