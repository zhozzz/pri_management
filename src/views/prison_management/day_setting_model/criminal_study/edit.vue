<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-19 23:54:15
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-03 15:44:17
 -->
<template>
  <el-dialog
    title="罪犯学习编辑"
    class="yn_dialog"
    :visible="editVisible"
    center
    width="60%"
    @close="close"
  >
    <div>
      <el-form
        ref="editForm"
        class="yn_form"
        :rules="rules"
        :model="editParams"
        label-width="10rem"
      >
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="学习日期" prop="date">
              <el-date-picker
                class="yn_ipt"
                v-model="editParams.date"
                type="date"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="开始/结束时间" prop="studyTime">
              <el-time-picker
                class="yn_ipt"
                is-range
                v-model="editParams.studyTime"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="学习标题" prop="studyTitle">
              <el-input class="yn_ipt" v-model="editParams.studyTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="学习地点" prop="studyPlace">
              <el-input class="yn_ipt" v-model="editParams.studyPlace"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="时间类型" prop="timeType">
              <el-radio-group v-model="editParams.timeType">
                <el-radio-button label="1">全天</el-radio-button>
                <el-radio-button label="0">半天</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="11" :offset="1">
            <el-form-item label="是否延时" prop="isOverTime">
              <el-radio-group v-model="editParams.isOverTime">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="学习类型">
              <el-select v-model="editParams.studyType" class="yn_ipt" placeholder="请选择学习类型">
                <el-option
                  v-for="item in studyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="备注">
              <el-input type="textarea" :rows="2" class="yn_ipt" v-model="editParams.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" v-loading="editLoading">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(editSubmit)">确 定</el-button>
      <el-button class="yn_btn" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import criminalSelect from '@/components/criminal_select'
import policeSelect from '@/components/police_select'
import _global from '@/utils/global_url'
export default {
  props: ['editVisible', 'handleCloseEdit', 'rows'],
  components: { criminalSelect, policeSelect },
  data() {
    return {
      editLoading: false,
      editParams: {},
      studyTime: '',
      rules: {
        date: [{ required: true, message: '请选择日期' }],
        studyTime: [{ required: true, message: '请选择时间' }],
        studyTitle: [
          { required: true, message: '请填写标题' },
          { max: 100, message: '最多输入100个字符' }
        ],
        studyPlace: [{ max: 100, message: '最多输入100个字符' }]
      },
      studyList: []
    }
  },
  created() {
    this.getStudyList()
  },
  methods: {
    changeTime(val) {
      this.editParams.beginTime = val[0]
      this.editParams.endTime = val[1]
    },
    getStudyList() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/studyType')
        .then(res => {
          console.log(res)
          this.studyList = res
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    close() {
      this.handleCloseEdit()
      this.$refs.editForm.clearValidate()
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editLoading = true
          this.axios
            .post(_global.businessUrl + '/study/update', this.editParams)
            .then(res => {
              this.$message.success('更新成功')
              this.editLoading = false
              this.close()
              this.$emit('editSuccess', 1)
            })
        } else {
          return false
        }
      })
    }
  },
  watch: {
    editVisible(val) {
      if (val === true) {
        this.editParams = this.rows
        this.$set(this.editParams, 'studyTime', [
          this.rows.beginTime,
          this.rows.endTime
        ])
        this.editParams.deptId = JSON.parse(
          localStorage.getItem('user')
        ).deptGuid
      }
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100% !important;
}
</style>
