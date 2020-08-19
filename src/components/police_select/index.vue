<!--
 * @Description: 警察选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-19 11:34:07
 -->

<template>
  <el-select
    :value="value"
    :multiple="multiple"
    filterable
    reserve-keyword
    placeholder="请选择"
    @change="onChange"
    class="yn_ipt"
    :loading="loading"
  >
    <!-- remote -->
    <!-- :remote-method="remoteMethod" -->
    <el-option v-for="(item,i) in options" :key="i" :label="item.realName" :value="item.userGuid"></el-option>
  </el-select>
</template>
<script>
import { getDutyPolice } from './service'
import _globalUrl from '../../utils/global_url'
import { getDeptId, getPrisonId } from '../../utils'
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
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
    multiple: false,
    isPrison: false
  },
  mounted() {
    this.getPoliceList()
  },
  methods: {
    remoteMethod(query) {
      this.loading = true
      this.getPoliceList(query)
    },
    getPoliceList() {
      // getDutyPolice().then(res => {
      //   this.options = res
      //   this.loading = false
      // })
      let str = this.isPrison ? getPrisonId() : getDeptId()
      this.axios
        .get(_globalUrl.userUrl + '/userManage/selPolice/' + str)
        .then(res => {
          this.options = res
          this.loading = false
        })
    },
    onChange(val) {
      // console.log(val)
      this.$emit('input', val)
    }
  }
}
</script>
<!--
 * @Description: 警察选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: fylih
 * @LastEditTime: 2019-09-03 17:00:34
 -->

<!--<template>
  <yn-select v-model="value">
  </yn-select>
</template>
<script>
import ynSelect from './newindex'
import { getDutyPolice } from './service'
export default {
  components: { ynSelect },
  // model: {
  //   prop: 'value',
  //   event: 'input'
  // },
  data () {
    return {
      value: '',
      options: [],
      list: [],
      loading: false
    }
  },
  props: {
    // value: {
    //   required: true
    // },
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
      getDutyPolice().then(res => {
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
-->
