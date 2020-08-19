<!--
 * @Description: 劳动新增模态框
 * @Author: fylih
 * @Date: 2019-09-09 15:51:41
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-02 19:32:25
 -->
<template>
  <el-dialog
    title="劳动信息编辑"
    class="yn_dialog"
    center
    v-loading="dialogLoading"
    :visible="editVisible"
    width="60%"
    @close="close"
  >
    <div>
      <el-form ref="editForm" class="yn_form" :model="editParams" :rules="rules" label-width="8rem">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="劳动类型" prop="laborName">
              <!-- <el-select class="yn_ipt" v-model="editParams.laborName">
                <el-option
                  v-for="item in labourTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-cascader
                v-model="editParams.laborName"
                class="yn_ipt"
                :options="labourTypeOptions"
                :show-all-levels="false"
                :props="{emitPath:false}"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="劳动地点" prop="laborPlace">
              <el-input class="yn_ipt" v-model="editParams.laborPlace"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10"></el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="开/收工时间" prop="workTime">
              <el-time-picker
                v-model="editParams.workTime"
                is-range
                @change="changeTime"
                class="yn_ipt"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="劳动日期" prop="date">
              <el-date-picker
                v-model="editParams.date"
                class="yn_ipt"
                type="date"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="时间类型" prop="laborType">
              <el-radio-group v-model="editParams.laborType">
                <el-radio-button label="1">全天</el-radio-button>
                <el-radio-button label="0">半天</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="是否加班" prop="isOverTime">
              <el-radio-group v-model="editParams.isOverTime">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="23">
            <el-form-item label="备注">
              <el-input type="textarea" class="yn_ipt" :rows="2" v-model="editParams.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" v-loading="submitLoading">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(editSubmit)">确 定</el-button>
      <el-button class="yn_btn" @click="handleCloseEdit">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _global from '@/utils/global_url'
export default {
  props: [
    'handleCloseEdit',
    'editDetail',
    'editVisible',
    'labourTypeOptions',
    'rows'
  ],
  data() {
    return {
      submitLoading: false,
      dialogLoading: false,
      workTime: [],
      editParams: {},
      rules: {
        workTime: {
          required: true,
          message: '请选择开/收工时间',
          trigger: 'blur'
        },
        laborName: {
          required: true,
          message: '请选择劳动项目',
          trigger: 'blur'
        },
        laborPlace: [
          {
            required: true,
            message: '请输入地点',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur'
          }
        ],
        laborType: {
          required: true,
          message: '请选择时间类型',
          trigger: 'change'
        },
        date: { required: true, message: '请选择劳动日期', trigger: 'blur' }
      }
    }
  },
  methods: {
    changeTime(val) {
      console.log(val)

      this.editParams.beginTime = val[0]
      this.editParams.endTime = val[1]
    },
    close() {
      this.$refs.editForm.resetFields()

      this.handleCloseEdit()
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.editParams.workTime = null
          this.axios
            .post(_global.businessUrl + '/labour/update', this.editParams)
            .then(
              res => {
                this.$message.success('更新成功')
                this.$emit('editSuccess', '1')
                this.handleCloseEdit()
                this.submitLoading = false
              },
              () => {
                this.submitLoading = false
              }
            )
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
        this.$set(this.editParams, 'workTime', [
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
