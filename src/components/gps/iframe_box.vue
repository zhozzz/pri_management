<!--
 * @Description: 
 * @Author: zhuhao
 * @Date: 2019-10-14 14:56:24
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-10-21 17:16:56
 -->
 
<template>
  <div class="page">
    <el-button type="primary" class="yn_btn" @click="sendMessage ">查看位置</el-button>

    <iframe :src="url" frameborder="0" ref="iframe" width="100%" @load="sendMessage"></iframe>
  </div>
</template>
<script>
import _globalUrl from "@/utils/global_url";
import { getPrisonId } from "@/utils";

export default {
  data() {
    return {
      url: "/static/gps/gps.html",
      iframeWin: {}
    };
  },
  model: {},
  props: {},
  mounted() {
    window.addEventListener("message", this.handleMessage);
    this.iframeWin = this.$refs.iframe.contentWindow;
  },
  methods: {
    sendMessage() {
      // 外部vue向iframe内部传数据

      this.iframeWin.postMessage(
        {
          cmd: "getFormJson",
          params: { name: "测试" }
        },
        "*"
      );
    },
    handleMessage(event) {
      // 根据上面制定的结构来解析iframe内部发回来的数据
      const data = event.data;

      switch (data.cmd) {
        case "returnFormJson":
          // 业务逻辑
          break;
        case "returnHeight":
          // 业务逻辑
          this.$refs.iframe.height = data.params.data;
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
