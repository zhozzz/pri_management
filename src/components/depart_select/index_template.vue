<!--
 * @Description: 部门选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-29 10:21:54
 -->

<template>
  <el-cascader
    class
    :show-all-levels="false"
    filterable
    :value="list"
    :options="options"
    :props="deptProp"
    ref="cascad"
    @change="onChange"
  ></el-cascader>
</template>
<script>
import { getDepartmentList } from './service'
import { getPrisonId, getUserId } from '@/utils'
import { Loading } from 'element-ui'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      valuea: '',
      options: [],
      loading: false,
      list: [],
      deptProp: {
        value: 'departName',
        label: 'departName',
        children: 'list',
        checkStrictly: true,
        multiple: true,
        emitPath: false
      }
    }
  },
  props: {
    value: {
      default: () => []
    },
    multiple: false
    // style: ''
  },
  mounted () {
    this.list = JSON.parse(this.value)

    this.getDepartmentList()
  },
  methods: {
    getDepartmentList () {
      // let loadingInstance = Loading.service({
      //   lock: true,
      //   text: '加载中……',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })

      getDepartmentList(getPrisonId())
        .then(response => {
          this.options = [response]
          // loadingInstance.close()
        })
        .catch(error => {
          console.log(error)
        })
    },
    onChange (val) {
      console.log(val)
      val = JSON.stringify(val)
      this.$emit('input', val)
      //   this.$emit('input', val[val.length - 1])
    }
  },
  watch: {
    value: {
      handler (val) {
        if (val) {
          this.list = JSON.parse(val)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-scrollbar.el-cascader-menu {
  max-height: 500px;
}
</style>
