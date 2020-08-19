<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-04 10:59:56
 -->
<template>
  <div>
    <el-dialog
      title="罪犯刑满释放登记"
      :visible="releaseVisible"
      append-to-body
      width="60%"
      center
      class="yn_dialog"
      @close="close"
    >
      <!-- fcd45f49-e06b-475c-83d4-17dee45edcbdf -->
      <el-form ref="form" class="yn_form" :rules="rules" :model="params" label-width="12rem">
        <el-row :gutter="10">
          <el-col :span="12" v-if="criminalId===null">
            <el-form-item label="选择罪犯">
              <div
                v-if="criminalInfo.zfName"
                class="yn_page_title"
              >{{criminalInfo.zfName}}-{{criminalInfo.zfNum}}</div>
              <criminalTable @input="selCriId" :isOnly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任警察" prop="dutyPoliceIds">
              <police-select class="yn_ipt" v-model="params.dutyPoliceIds" multiple></police-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出监时间" prop="outTime">
              <el-date-picker
                class="yn_ipt"
                v-model="params.outTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                class="yn_ipt"
                :rows="2"
                maxlength="1000"
                type="textarea"
                v-model="params.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          v-loading="loading"
          class="yn_btn"
          type="primary"
          @click="$checkMessage(submit)"
        >确 定</el-button>
        <el-button class="yn_btn" @click="handleCloseRelease">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import policeSelect from '@/components/police_select'
import criminalTable from '@/components/criminal_table'
import _global from '@/utils/global_url'
export default {
  components: { policeSelect, criminalTable },
  props: ['releaseVisible', 'handleCloseRelease', 'criminalId'],
  data() {
    return {
      loading: false,
      criminalInfo: {},
      params: {},
      outTypeOptions: [],
      rules: {
        outTime: { required: true, message: '请输入出监时间', trigger: 'blur' },
        dutyPoliceIds: {
          required: true,
          message: '请选择责任警察',
          trigger: 'blur'
        }
      }
    }
  },
  methods: {
    selCriId(val) {
      this.criminalInfo = val
      this.params.criminalId = val.id
    },
    close() {
      this.handleCloseRelease()
    },
    queryInfoType() {
      this.axios
        .get(_global.userUrl + '/dictionary/option/OutPrisonType')
        .then(res => {
          res.map(item => {
            item.label == '刑满释放' ? (this.params.outType = item.value) : ''
          })
        })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.axios
            .post(_global.businessUrl + '/criminalInOut/out', this.params)
            .then(
              res => {
                this.loading = false
                this.$message.success('刑满释放登记成功')
                this.$emit('submit', res)
                this.handleCloseRelease()
              },
              () => {
                this.loading = false
              }
            )
        }
      })
    }
  },
  watch: {
    releaseVisible(val) {
      if (val === true) {
        this.queryInfoType()
        this.params = {}
        if (this.criminalId !== null) {
          this.params.criminalId = this.criminalId
        }
        this.params.prisonId = JSON.parse(localStorage.getItem('user')).prisonId
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dialog_transfer {
  display: table;
  margin: 0 auto;
}
.yn_ipt {
  width: 100%;
}
</style>
