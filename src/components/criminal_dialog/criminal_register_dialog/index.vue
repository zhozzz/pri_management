<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-19 15:04:48

 -->
<template>
  <div class="main-page">
    <el-popover ref="popover" placement="right" width="200" trigger="click">
      <div class="btn_group">
        <el-button class="yn_btn" type="primary" @click="judge('hospitalize')" v-html="'罪犯住院'" />
        <!-- <el-button class="yn_btn"
                   type="primary"
                   @click="study"
                   v-html="'罪犯学习'" />
        <el-button class="yn_btn"
                   type="primary"
                   @click="rest"
        v-html="'罪犯休息'" />-->
        <el-button
          class="yn_btn"
          type="primary"
          @click="judge('isolation')"
          v-html="'禁闭/隔离'"
          v-if="$route.name !== 'confinement_mgt'"
        />
        <el-button class="yn_btn" type="primary" @click="judge('death')" v-html="'罪犯死亡'" />
        <el-button
          class="yn_btn"
          type="primary"
          @click="judge('out')"
          v-html="'罪犯离监'"
          v-if="$route.name !== 'criminal_check_out'"
        />
        <el-button
          class="yn_btn"
          type="primary"
          @click="judge('release')"
          v-html="'刑满释放'"
          v-if="$route.name !== 'criminal_check_out'"
        />
        <!-- 仅在禁闭隔离页面展示解除禁闭按钮 -->
        <el-button
          class="yn_btn"
          type="primary"
          @click="relieveConfinement()"
          v-html="'解除禁闭'"
          v-if="$route.name === 'confinement_mgt'"
        />
      </div>
      <el-button
        class="yn_text_btn"
        type="text"
        v-if="!$props.useIcon"
        slot="reference"
      >{{$props.btnName}}</el-button>
      <i class="el-icon-edit" v-else slot="reference"></i>
    </el-popover>
    <hospital-dialog
      :handleCloseHospital="handleCloseHospital"
      :hospitalVisible="hospitalVisible"
      @submit="submit"
      :criminalId="criminalId"
    ></hospital-dialog>
    <confinement-dialog
      :handleCloseConfinement="handleCloseConfinement"
      :confinementVisible="confinementVisible"
      @submit="submit"
      :prisonId="elPrisonId"
      :criminalId="criminalId"
    ></confinement-dialog>
    <rest-dialog
      :handleCloseRest="handleCloseRest"
      :restVisible="restVisible"
      @submit="submit"
      :criminalId="criminalId"
    ></rest-dialog>
    <study-dialog
      :handleCloseStudy="handleCloseStudy"
      :studyVisible="studyVisible"
      @submit="submit"
      :criminalId="criminalId"
    ></study-dialog>
    <die-dialog
      :handleCloseDie="handleCloseDie"
      :dieVisible="dieVisible"
      :criminalId="criminalId"
      @submit="submit"
    ></die-dialog>
    <leave-prison-dialog
      :handleCloseLeavePrison="handleCloseLeavePrison"
      :leavePrisonVisible="leavePrisonVisible"
      @submit="submit"
      :criminalId="criminalId"
    ></leave-prison-dialog>
    <release-dialog
      :handleCloseRelease="handleCloseRelease"
      :releaseVisible="releaseVisible"
      @submit="submit"
      :criminalId="criminalId"
    ></release-dialog>
  </div>
</template>
<script>
import hospitalDialog from './hospital_dialog'
import confinementDialog from './confinement_dialog'
import restDialog from './rest_dialog'
import studyDialog from './study_dialog'
import { judgeBtnVisible } from './func'
import dieDialog from './die_dialog'
import leavePrisonDialog from './leave_prison_dialog'
import releaseDialog from './release_dialog'
import { getPrisonId } from '@/utils'

export default {
  components: {
    hospitalDialog,
    confinementDialog,
    restDialog,
    studyDialog,
    dieDialog,
    leavePrisonDialog,
    releaseDialog
  },
  props: {
    btnName: {
      type: String,
      default: '状态登记'
    },
    criminalId: {
      type: String,
      default: null
    },
    criminalName: {
      type: String,
      default: null
    },
    confineId: {
      type: String,
      default: null
    },
    prisonId: {
      type: String,
      default: getPrisonId()
    },
    useIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hospitalVisible: false,
      studyVisible: false,
      restVisible: false,
      confinementVisible: false,
      dieVisible: false,
      leavePrisonVisible: false,
      releaseVisible: false,
      elPrisonId: ''
    }
  },
  created() {
    this.elPrisonId = this.prisonId
  },
  methods: {
    judge(type) {
      let sel = type
      sel == 'release' ? (sel = 'out') : ''
      judgeBtnVisible(sel, this.criminalId)
        .then(() => {
          switch (type) {
            case 'hospitalize':
              this.hospitalVisible = true
              break
            case 'isolation':
              this.confinementVisible = true
              break
            case 'death':
              this.dieVisible = true
              break
            case 'out':
              this.leavePrisonVisible = true
              break
            case 'release':
              this.releaseVisible = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCloseHospital() {
      this.hospitalVisible = false
    },
    handleCloseConfinement() {
      this.confinementVisible = false
    },
    handleCloseDie() {
      this.dieVisible = false
    },
    handleCloseLeavePrison() {
      this.leavePrisonVisible = false
    },
    submit(val) {
      this.$emit('submit')
    },
    // 解除禁闭，只有在禁闭隔离页面才会显示
    relieveConfinement() {
      this.$emit('relieveConfinement', {
        name: this.criminalName,
        id: this.confineId
      })
    },
    // study () {
    //   judgeBtnVisible().then(() => {
    //     this.studyVisible = true
    //   }).catch(err => {
    //     this.$message.warning(err)
    //   })
    // },
    // rest () {
    //   judgeBtnVisible().then(() => {
    //     this.restVisible = true
    //   }).catch(err => {
    //     this.$message.warning(err)
    //   })
    // },
    handleCloseStudy() {
      this.studyVisible = false
    },
    handleCloseRest() {
      this.restVisible = false
    },
    handleCloseRelease() {
      this.releaseVisible = false
    }
  },
  watch: {
    prisonId(val) {
      this.elPrisonId = val
    }
  }
}
</script>

<style lang="less" scoped>
.main-page {
  display: inline-block;
}
.btn_group {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 20rem;
  justify-content: space-around;
  .yn_btn {
    &:first-child {
      margin-left: 10px !important;
    }
  }
}
.el-icon-edit {
  color: #409eff;
}
.technoloy {
  /deep/.el-popover {
    background: transparent;
  }
}
</style>
