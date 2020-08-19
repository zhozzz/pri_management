<!--
 * @Description: 警察详情
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 15:16:16
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-10-24 09:53:01
 -->
<template>
  <el-button @click="getPoliceDetail"
             class="yn_text_btn"
             type="text">{{police.policeName}}</el-button>
</template>
<script>
import { getPoliceDetail } from './service'
export default {
  props: {
    police: {
      type: Object,
      required: true,
      default: () => {
        return {
          policeId: '',
          policeName: ''
        }
      }
    }
  },
  methods: {
    getPoliceDetail () {
      let { policeId } = this.police
      getPoliceDetail({ policeId }).then(res => {
        this.open(res)
      })
    },
    open (res) {
      let ele = this.ele(res)
      this.$msgbox({
        title: '警员基本信息',
        message: this.ele(res),
        showCancelButton: true,
        showConfirmButton: false
      })
    },
    ele ({
      prisonName = '',
      deptRoute = '',
      workPosition = '',
      realName = '',
      policeCardNo = '',
      gender = '',
      age = '',
      phoneNo = '',
      address = '',
      workPositionName = ''
    }) {
      const h = this.$createElement
      return h('div', { class: 'yn_form el-form el-police-detail' }, [
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '监狱：'),
          h('div', { class: 'el-form-item__content' }, prisonName)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '部门：'),
          h('div', { class: 'el-form-item__content' }, deptRoute)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '职位：'),
          h('div', { class: 'el-form-item__content' }, workPositionName)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '姓名：'),
          h('div', { class: 'el-form-item__content' }, realName)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '警号：'),
          h('div', { class: 'el-form-item__content' }, policeCardNo)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '性别：'),
          h(
            'div',
            { class: 'el-form-item__content' },
            gender === 1 ? '男' : '女'
          )
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '年龄：'),
          h('div', { class: 'el-form-item__content' }, age)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '联系电话：'),
          h('div', { class: 'el-form-item__content' }, phoneNo)
        ]),
        h('div', { class: 'el-form-item' }, [
          h('label', { class: 'el-form-item__label' }, '家庭住址：'),
          h('div', { class: 'el-form-item__content' }, address)
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
  }
}
</style>
