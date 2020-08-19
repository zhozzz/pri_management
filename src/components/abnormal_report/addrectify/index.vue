<!--
 * @Description: 警察详情
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:16:16
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-08 16:35:09
 -->
<template>
  <el-button @click="getDetail"
             class="yn_text_btn"
             type="text">整改反馈</el-button>
</template>
<script>
import { add } from './service'
export default {
  props: {
    detail: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: ''
        }
      }
    }
  },
  methods: {
    add () {
      let { id } = this.detail
      add({ id }).then(res => {
        this.open(res)
      })
    },
    open (res) {
      let ele = this.ele(res)
      this.$msgbox({
        title: '整改反馈结果',
        message: this.ele(res),
        showCancelButton: true,
        showConfirmButton: false
      })
    },
    ele ({
      grade = '',
      datetime = '',
      typeName = ''
    }) {
      const h = this.$createElement
      return h('div', { class: 'el-form el-police-detail' }, [
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规等级：'),
          h('div', { class: 'el-form-item__content' }, grade)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '违规时间：'),
          h('div', { class: 'el-form-item__content' }, datetime)
        ])
      ])
    }
  }
}
</script>
<style lang="less" scoped>
.el-police-detail {
  padding: 0 20px;
  .el-form-item {
    margin-bottom: 16px;
    .el-form-item__content,
    .el-form-item__label {
      font-size: 1.1rem;
    }
  }
}
.technology {
  .el-message-box {
    /deep/.el-form-item__label {
      color: #fff;
    }
  }
}
</style>
