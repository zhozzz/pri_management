<!--
 * @Description: 罪犯住院
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:34:57
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <!--<tab left-->
    <!--name="罪犯入监管理"-->
    <!--noRight-->
    <!--:pathName="'criminal_check_in'"></tab>-->
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯入监']">
      <province-statics v-if="prisonId==='1'" @getRankingPrisonId="getRankingPrisonId"></province-statics>
      <prison-statics v-else :prisonId="prisonId" :deptId="deptId" :prisonName="prisonName"></prison-statics>
    </menuTree>
  </dept-layout>
</template>
<script>
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId, getDeptId } from '@/utils'
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
      prisonName: '',
      deptId: getDeptId()
    }
  },
  methods: {
    nodeClick(val) {
      this.prisonId = val.id
      this.deptId = val.id
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
