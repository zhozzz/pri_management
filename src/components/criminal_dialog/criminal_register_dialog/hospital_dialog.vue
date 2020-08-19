<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-17 16:09:42
 -->
<template>
  <div>
    <el-dialog
      title="罪犯住院登记"
      :visible="hospitalVisible"
      width="60%"
      center
      append-to-body
      class="yn_dialog"
      @close="close"
    >
      <el-form ref="form" class="yn_form" :rules="rules" :model="params" label-width="10rem">
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
            <el-form-item label="住院类型" prop="hospitalizeType">
              <el-select class="yn_ipt" v-model="params.hospitalizeType">
                <el-option
                  v-for="item in hospitalizeTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住院原因">
              <el-select class="yn_ipt" v-model="params.hospitalizeReason">
                <el-option
                  v-for="item in hospitalizeReasonOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入院时间" prop="hospitalizeTime">
              <el-date-picker class="yn_ipt" v-model="params.hospitalizeTime" type="datetime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否监管病房" prop="isRegulatoryWard">
              <el-select class="yn_ipt" v-model="params.isRegulatoryWard">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="params.hospitalizeType===isOut">
            <el-form-item label="住院地点" prop="hospitalizePlace">
              <el-input class="yn_ipt" v-model="params.hospitalizePlace"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="戒具使用情况">
              <el-select class="yn_ipt" v-model="params.restraintToolState">
                <el-option
                  v-for="item in restraintToolStateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="params.hospitalizeType!=='6b156e46-ce1e-11e9-a84e-525400e39388'">
            <el-form-item label="看押警员" prop="officerIds">
              <police-select class="yn_ipt" v-model="params.officerIds" multiple></police-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          v-loading="loading"
          type="primary"
          class="yn_btn"
          @click="$checkMessage(handleSubmit)"
        >确 定</el-button>
        <el-button class="yn_btn" @click="handleCloseHospital">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import policeSelect from '@/components/police_select'
import criminalTable from '@/components/criminal_table'
import { formatDate } from '../../../utils/date'
export default {
  components: { policeSelect, criminalTable },
  props: ['hospitalVisible', 'handleCloseHospital', 'criminalId'],
  data() {
    return {
      loading: false,
      isOut: '',
      params: {},
      criminalInfo: {},
      hospitalizeTypeOptions: [],
      hospitalizeReasonOptions: [],
      restraintToolStateOptions: [
        { value: 1, label: '使用中' },
        { value: 0, label: '暂停使用' }
      ],
      rules: {
        hospitalizeTime: {
          required: true,
          message: '请填写住院时间',
          trigger: 'blur'
        },
        hospitalizeType: {
          required: true,
          message: '请选择住院类型',
          trigger: 'blur'
        }
        // isRegulatoryWard: {
        //   required: true,
        //   message: '请选择是否监管病房',
        //   trigger: 'blur'
        // },

        // officerIds: {
        //   required: true,
        //   message: '请选择警员',
        //   trigger: 'blur',
        //   type: 'array'
        // }
      }
    }
  },

  watch: {
    hospitalVisible(val) {
      if (val) {
        this.searchType()
      }
    }
  },
  methods: {
    selCriId(val) {
      this.criminalInfo = val
      this.params.criminalId = val.id
      console.log(val)
    },
    close() {
      this.criminalInfo = {}
      this.handleCloseHospital()
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.params.prisonId = JSON.parse(
            localStorage.getItem('user')
          ).prisonId
          this.params.hospitalizeTime = formatDate(
            new Date(this.params.hospitalizeTime),
            'yyyy-MM-dd hh:mm:ss'
          )
          this.loading = true
          this.axios
            .post(
              _globalUrl.businessUrl + '/criminalHospitalize/hospitalize',
              this.params
            )
            .then(
              res => {
                this.loading = false
                this.$message.success('登记成功')
                this.handleCloseHospital()
                this.$emit('submit', res)
              },
              () => {
                this.loading = false
              }
            )
        } else {
          return false
        }
      })
    },
    // 查询住院类型和住院原因
    searchType() {
      this.axios
        .get(
          this._global.businessUrl +
            '/dictionary/getDictionaryTypes/HospitalizeReason'
        )
        .then(res => {
          this.hospitalizeReasonOptions = res
        })
      this.axios
        .get(
          this._global.businessUrl +
            '/dictionary/getDictionaryTypes/HospitalizeType'
        )
        .then(res => {
          this.hospitalizeTypeOptions = res
          res.map(item => {
            item.label === '社会医院住院' ? (this.isOut = item.value) : ''
          })
        })
    }
  },
  watch: {
    hospitalVisible(val) {
      if (val === true) {
        this.params = {
          criminalId: this.criminalId,
          createUserId: JSON.parse(localStorage.getItem('user')).userGuid
        }

        if (this.criminalId !== null) {
          this.params.criminalId = this.criminalId
        }
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
