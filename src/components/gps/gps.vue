<!--
 * @Description: 
 * @Author: zhuhao
 * @Date: 2019-10-14 14:56:24
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-10-21 17:16:56
 -->
 
<template>
  <div class="page">
    <el-button type="primary" class="yn_btn" @click="gpsOpen ">查看位置</el-button>

    <el-dialog :visible.sync="alarmVisible" title="位置查看" center width="80%" @close="close">
      <!-- <iframe :src="url" frameborder="0" ref="iframe" width="100%"></iframe> -->
      <iframeBox v-if="alarmVisible" />
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="subAlarm">确定</el-button>
        <el-button class="yn_btn" type="primary" @click="alarmVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from "@/utils/global_url";
import { getPrisonId } from "@/utils";
import iframeBox from "./iframe_box.vue";

export default {
  data() {
    return {
      alarmVisible: false,
      url: "/static/gps/gps.html"
    };
  },
  model: {},
  props: {},
  components: {
    iframeBox
  },
  mounted() {},
  methods: {
    subAlarm() {},
    gpsOpen() {
      this.alarmVisible = true;
    },
    close() {
      console.log(this.$refs);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
