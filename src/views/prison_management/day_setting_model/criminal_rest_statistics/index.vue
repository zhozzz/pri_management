<!--
 * @Description: 罪犯住院
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 16:04:09
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menu-tree :menuList="menuList">
      <tab slot="heade_btn" left pathName="criminal_rest" name="罪犯休息管理"></tab>
      <province-statics v-if="prisonId==='1'" @getRankingPrisonId="getRankingPrisonId"></province-statics>
      <prison-statics v-else :prisonId="prisonId" :prisonName="prisonName"></prison-statics>
    </menu-tree>
  </dept-layout>
</template>
<script>
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import provinceStatics from './province_statistics/index'
import prisonStatics from './prison_statistics/index'
import tab from '@/components/tab'
import menuTree from '@/components/menu_tree'

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
      menuList: ['5+1+1模式执行', '罪犯休息'],
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
.btn_box {
  margin: 1rem;
  .btn_pad {
    width: 8rem;
    height: 3rem;
    a {
      text-decoration: none;
    }
  }
}
</style>
