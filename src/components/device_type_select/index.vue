<!--
 * @Description: 4G设备类型选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-04 14:42:52
 -->

<template>
  <el-select
    :value="value"
    :multiple="multiple"
    filterable
    remote
    reserve-keyword
    placeholder="请选择设备类型"
    :remote-method="remoteMethod"
    @change="onChange"
    class="yn_ipt"
    :loading="loading"
  >
    <el-option v-for="item in options" :key="item.key" :label="item.value" :value="item.key"></el-option>
  </el-select>
</template>
<script>
import { getdeviceTypeList } from "./service";
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
    this.getdeviceTypeList();
  },
  methods: {
    remoteMethod(query) {
      this.loading = true;
      this.getdeviceTypeList({ query });
    },
    getdeviceTypeList(query) {
      getdeviceTypeList({ ...query, listType: 1 }).then(res => {
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
