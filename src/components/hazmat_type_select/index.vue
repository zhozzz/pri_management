<!--
 * @Description: 危险品类型选择
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-10-24 09:58:38
 -->

<template>
  <el-select
    :value="value"
    :multiple="multiple"
    filterable
    remote
    reserve-keyword
    placeholder="请输入危险品"
    :remote-method="remoteMethod"
    @change="onChange"
    :loading="loading"
    class="yn_ipt"
  >
    <el-option v-for="item in options" :key="item.id" :label="item.goodsTypeName" :value="item.id"></el-option>
  </el-select>
</template>
<script>
import { getHazmatList } from "./service";
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
    this.getHazmatList();
  },
  methods: {
    remoteMethod() {
      this.loading = true;
      this.getHazmatList();
    },
    getHazmatList() {
      getHazmatList().then(res => {
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
