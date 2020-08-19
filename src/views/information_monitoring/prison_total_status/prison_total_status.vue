<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-29 15:58:21
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:27:03
 -->
<template>
  <deptLayout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['信息监测','监狱总体情况分析']">
      <status-province v-if="prisonId==='1'"></status-province>
      <status-single v-else :prisonId="prisonId"></status-single>
    </menuTree>
  </deptLayout>
</template>

<script>
import ProvinceStatus from './prison_total_status_province'
import SingleStatus from './person_total_status_single'
import DeptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import menuTree from '@/components/menu_tree/'

export default {
  data() {
    return {
      prisonId: getPrisonId()
    }
  },
  components: {
    'status-province': ProvinceStatus,
    'status-single': SingleStatus,
    deptLayout: DeptLayout,
    menuTree
  },
  methods: {
    // 监狱切换
    nodeClick(val) {
      this.prisonId = val.id
    }
  }
}
</script>

<style lang="less" scoped>
</style>
