<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-16 15:55:40
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:41:04
 -->
<template>
  <div class="btn_box yn_page_btn">
    <!-- <el-button :disabled="left"
               class="yn_btn btn_pad"
               @click="turnTo"
               :type="left?'primary':'none'">{{leftName}}</el-button>
    <el-button :disabled="right"
               @click="turnTo"
               v-if="needManage&&!noRight"
               class="yn_btn btn_pad"
    :type="right?'primary':'none'">{{name}}</el-button>-->
    <div @click="left?'':turnTo()" :class="left?'link_btn':'dis_btn'">{{leftName}}</div>
    <div @click="right?'':turnTo()" :class="right?'link_btn':'dis_btn'">{{name}}</div>
    <el-button class="yn_btn btn_pad back_btn" v-if="back" @click="$router.go(-1)">返回</el-button>
    <el-button class="yn_btn btn_pad back_btn" v-if="saveBtn" type="primary" @click="save">保存</el-button>
  </div>
</template>
<script>
export default {
  props: {
    pathName: {
      type: String
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '管理'
    },
    leftName: {
      type: String,
      default: '统计页面'
    },
    back: {
      type: Boolean,
      default: true
    },
    needManage: {
      type: Boolean,
      default: true
    },
    noRight: {
      type: Boolean,
      default: false
    },
    saveBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    turnTo() {
      this.$router.push({ name: this.pathName })
    },
    save() {
      this.$emit('save', true)
    }
  }
}
</script>
<style lang="less" scoped>
.btn_box {
  //   margin: 1rem;
  position: relative;
  .btn_pad {
    height: 2.2rem;
    width: 8rem;
    a {
      text-decoration: none;
    }
  }
}
.back_btn {
  //   float: right;
  position: absolute;
  right: 10px;
}
</style>
