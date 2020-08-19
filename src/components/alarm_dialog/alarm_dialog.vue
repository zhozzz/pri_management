<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-14 14:56:24
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-19 11:37:51
 -->

<template>
  <div class="page">
    <el-button type="primary" class="yn_btn" @click="alarmVisible = true">手动报警</el-button>

    <el-dialog
      :visible.sync="alarmVisible"
      title="突发事件报警"
      center
      :v-loading="loading"
      width="60%"
      @close="close"
      class="yn_dialog"
    >
      <el-form ref="form" label-width="12rem" :rules="rules" :model="searchData" class="yn_form">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item prop="alarmTime" label="报警时间：">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="searchData.alarmTime"
                type="datetime"
                align="right"
                :picker-options="pickerOption"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="alarmAddress" label="报警地点：">
              <el-input class="yn_ipt" v-model="searchData.alarmAddress" placeholder="请输入地点名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="alarmEvent" label="报警事件类型：">
              <el-select
                v-model="searchData.alarmEvent"
                @change="selChange"
                class="yn_ipt"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in eventList"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="alarmLevel" label="警情级别：">
              <el-select
                v-model="searchData.alarmLevel"
                class="yn_ipt"
                @change="selChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="11">
            <el-form-item prop="planId" label="选择先期处置流程：">
              <el-select
                v-model="searchData.planId"
                class="yn_ipt"
                @change="selChange"
                placeholder="请选择"
                :disabled="planDisable"
              >
                <el-option
                  v-for="item in planList"
                  :key="item.id"
                  :label="item.planName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(subAlarm)">确定</el-button>
        <el-button class="yn_btn" type="primary" @click="alarmVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import { getPrisonId } from '@/utils'

export default {
  data() {
    return {
      alarmVisible: false,
      loading: false,
      eventList: [],
      planList: [],
      prisonId: getPrisonId(),
      levelList: [
        { name: '轻微', value: 1 },
        { name: '较低', value: 2 },
        { name: '中等', value: 3 },
        { name: '较高', value: 4 },
        { name: '严重', value: 5 }
      ],
      searchData: { alarmTime: new Date() },
      date: [],
      planDisable: true,
      rules: {
        alarmTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        alarmAddress: [
          { required: true, message: '请选择地点', trigger: 'blur' }
        ],
        alarmEvent: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        alarmLevel: [
          { required: true, message: '请选择级别', trigger: 'change' }
        ],
        planId: [{ required: true, message: '请选择预案', trigger: 'change' }]
      },
      pickerOption: {
        disabledDate: vm => {
          let flag
          let now = new Date().getTime()
          vm.getTime() > now ? (flag = true) : (flag = false)
          return flag
        }
      }
    }
  },
  model: {},
  props: {},
  created() {
    this.getEventType()
  },
  methods: {
    getEventType() {
      this.axios
        .get(_globalUrl.userUrl + '/dictionarySubclass/byCode/EmergencyType')
        .then(res => {
          console.log(res)
          this.eventList = res
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    getPlanData() {
      this.axios
        .get(
          _globalUrl.businessUrl +
            '/emergencyPlan/getPlansForEmergency/' +
            this.searchData.alarmEvent +
            '/' +
            this.searchData.alarmLevel +
            '/' +
            this.prisonId
        )
        .then(res => {
          console.log(res)
          this.planList = res
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    selChange() {
      if (this.searchData.alarmEvent && this.searchData.alarmLevel) {
        this.getPlanData()
        this.planDisable = false
      } else {
        this.planDisable = true
      }
    },
    subAlarm() {
      this.searchData.status = 1
      this.searchData.alarmType = 1

      this.searchData.emPrisonId = this.prisonId
      this.searchData.alarmTime = new Date(this.searchData.alarmTime).getTime()
      console.log(this.searchData)

      this.$refs['form'].validate(valid => {
        if (valid) {
          this.axios
            .post(
              _globalUrl.businessUrl + '/emergencyEvent/insert',
              this.searchData
            )
            .then(res => {
              this.$message.success('新增成功')
              this.alarmVisible = false
              this.$emit('submit')
              this.$refs['form'].clearValidate()
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          this.$message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    close() {
      this.$refs['form'].clearValidate()
      this.searchData = {}
    }
  }
}
</script>
<style lang="less" scoped>
.page {
  display: inline-block;
  .yn_dialog {
    /deep/.el-form-item__label {
      float: left;
    }
    /deep/.el-form-item__content {
      display: block;
    }
    .el-col {
      margin-bottom: 1.2rem;
    }
    .yn_date_picker {
      width: 100%;
    }
  }
}
</style>
