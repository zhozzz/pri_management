<!--
 * @Description: level
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-04 15:00:12
 -->

<template>
  <el-select
    :value="value"
    filterable
    class="yn_ipt"
    remote
    reserve-keyword
    placeholder="请选择"
    @change="onChange"
    :loading="loading"
  >
    <el-option
      v-for="item in options"
      :key="item.subclassGuid"
      :label="item.value"
      :value="item.subclassGuid"
    ></el-option>
  </el-select>
</template>
<script>
import { getLevelList } from "./service";
export default {
  model: {
    prop: "value",
    event: "input"
  },
  data() {
    return {
      options: [],
      list: [],
      loading: false
    };
  },
  props: {
    value: {
      required: true
    },
    multiple: false
  },
  mounted() {
    this.getLevelList();
  },
  methods: {
    remoteMethod(query) {
      this.loading = true;
      this.getLevelList();
    },
    getLevelList(query) {
      getLevelList().then(res => {
        console.log(res);
        this.options = res;
        this.loading = false;
      });
    },
    onChange(val) {
      this.$emit("input", val);
    }
  }
};
</script>
