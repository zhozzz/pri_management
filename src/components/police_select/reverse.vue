<!--
 * @Description: 警察选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors  : fylih
 * @LastEditTime : 2020-01-15 18:18:03
 -->

<template>
  <el-select :value="value"
             :multiple="multiple"
             filterable
             reserve-keyword
             placeholder="请选择"
             @change="onChange"
             class="yn_ipt"
             :loading="loading">
    <!-- remote -->
    <!-- :remote-method="remoteMethod" -->
    <el-option v-for="item in options"
               :key="item.userGuid"
               :label="item.realName"
               :value="item.userGuid"></el-option>
  </el-select>
</template>
<script>
// import { getDutyPolice } from './service'
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
    groupId: null
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
      console.log(this.groupId)
      if (this.groupId) {
        this.axios
          .get(
            _globalUrl.businessUrl +
              '/emergencyGroup/getPolice/' +
              getDeptId() +
              '/' +
              this.groupId
          )
          .then(res => {
            this.options = res
            this.loading = false
          })
      } else {
        this.axios
          .get(
            _globalUrl.businessUrl +
              '/emergencyGroup/getPolice/' +
              getDeptId() +
              '/-1'
          )
          .then(res => {
            this.options = res
            this.loading = false
          })
      }
    },
    onChange(val) {
      // console.log(val)
      this.$emit('input', val)
    }
  },
  watch: {
    groupId() {
      this.getPoliceList()
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
