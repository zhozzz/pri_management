<!--
 * @Description: 
 * @Author: zhuhao
 * @Date: 2020-03-09 15:30:06
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-13 09:47:36
 -->
<template>
  <el-table-column
    :prop="col.fieldNameTrue"
    :label="col.fieldName"
    align="center"
    :min-width="col.fieldName.length*15+20"
  >
    <template v-if="col.children">
      <my-column v-for="(item, index) in col.children" :key="index" :col="item"></my-column>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: 'myColumn',
  props: {
    col: {
      type: Object
    }
  },
  watch: {
    col: {
      deep: true,
      handler(val) {
        console.log(val)
      }
    }
  }
}
</script>