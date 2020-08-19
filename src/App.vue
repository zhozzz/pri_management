<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-14 11:38:42
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-23 22:52:58
 -->
<template>
  <div id="app">
    <router-view />
    <div class="theme" @click="changeTheme">
      <i class="el-icon-s-custom"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      theme: JSON.parse(localStorage.getItem('theme')) || 1
    }
  },
  methods: {
    changeTheme() {
      let themeNum = null
      themeNum = this.theme === 2 ? 1 : this.theme + 1
      window.localStorage.setItem('theme', themeNum)
      location.reload()
    }
  }
}
</script>
<style lang="less" scoped>
// 换肤 图标
.theme {
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 1.5rem;
  cursor: pointer;
  .el-icon-s-custom {
    background-image: -webkit-linear-gradient(bottom, red, #fd8403, yellow);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
