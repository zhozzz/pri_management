<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-14 14:56:24
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:21:06
 -->

<template>
  <div class="page">
    <el-button
      :type="iseidt?'text':'primary'"
      :class="iseidt?'yn_text_btn':'yn_btn'"
      @click="createVisible = true"
    >{{iseidt?'编辑':'新增待办'}}</el-button>

    <el-dialog
      :visible.sync="createVisible"
      title="待办事项"
      center
      :v-loading="loading"
      width="70%"
      @close="close"
      class="yn_dialog"
    >
      <el-form ref="form" label-width="10rem" :rules="rules" :model="addform" class="yn_form">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="type" label="类型">
              <el-select
                v-model="addform.type"
                class="yn_ipt"
                @change="typeChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,i) in eventList"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="addform.type==3">
            <el-form-item label="重复类型" prop="repeat">
              <el-radio v-model="addform.repeat" label="1" @change="repeatChange">每月固定</el-radio>
              <el-radio v-model="addform.repeat" label="2" @change="repeatChange">每周固定</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="addform.repeat==2&&addform.type==3">
            <el-form-item label=" " prop="repeatType">
              <el-checkbox-group v-model="addform.repeatType">
                <el-checkbox-button v-for="(label,i) in weekdays" :label="label" :key="i">{{label}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="addform.repeat==1&&addform.type==3">
            <el-form-item label=" " prop="repeatType">
              <el-checkbox-group v-model="addform.repeatType">
                <el-checkbox v-for="(label,i) in monthdays" :label="label" :key="i">{{label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间" prop="timeType">
              <el-radio v-model="addform.timeType" label="1">时间段</el-radio>
              <el-radio v-model="addform.timeType" label="2">时间点</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label=" " prop="startTime">
              <el-time-picker
                v-show="addform.timeType==2"
                class="yn_ipt"
                :clearable="false"
                v-model="addform.startTime"
                placeholder="任意时间点"
                value-format="HH:mm:ss"
              ></el-time-picker>
              <el-time-picker
                v-show="addform.timeType==1"
                class="yn_ipt"
                is-range
                :clearable="false"
                v-model="addform.timeRange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作事项" prop="detail">
              <el-input class="yn_ipt" v-model="addform.detail" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="待办人员" prop="personnel">
              <el-input class="yn_ipt" v-model="addform.personnel" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作要求" prop="require">
              <el-input class="yn_ipt" v-model="addform.require" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="等级" prop="level">
              <el-select class="yn_ipt" v-model="addform.level" placeholder="请选择">
                <el-option
                  v-for="item in rankoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button class="yn_btn" v-if="iseidt" type="primary" @click="$checkMessage(saveEidt)">确定</el-button>
        <el-button class="yn_btn" v-else type="primary" @click="$checkMessage(subAlarm)">确定</el-button>
        <el-button class="yn_btn" type="primary" @click="createVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import { getPrisonId, getDeptId } from '@/utils'
import { getRank, create, editWork } from '../server'
import formatDate from '@/utils/date'

export default {
  data() {
    return {
      loading: false,
      createVisible: false,
      prisonId: getPrisonId(),
      deptId: getDeptId(),
      addform: { type: '2', repeat: '2', repeatType: [], timeType: '1' },
      date: [],
      planDisable: true,
      rules: {
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        level: [{ required: true, message: '请选择', trigger: 'change' }],
        require: [{ required: true, message: '请选择', trigger: 'blur' }],
        detail: [{ required: true, message: '请选择', trigger: 'blur' }],
        personnel: [{ required: true, message: '请选择', trigger: 'blur' }],
        repeatType: [{ required: true, message: '请选择', trigger: 'change' }],
        timeType: [{ required: true, message: '请选择', trigger: 'change' }],
        repeat: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      eventList: [
        { label: '非重复', value: '1' },
        { label: '工作日', value: '2' },
        { label: '自定义', value: '3' }
      ],
      rankoptions: [
        { label: '低', value: 1 },
        { label: '中', value: 2 },
        { label: '高', value: 3 }
      ],
      weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      monthdays: []
    }
  },
  model: {},
  props: {
    eidtForm: {
      type: Object,
      default: () => {}
    },
    iseidt: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.addform.repeatType = ['周一', '周二', '周三', '周四', '周五']
    let today = new Date()
    let year = new Date().getFullYear()
    let Month = new Date().getMonth()
    let lastDay = new Date(year, Month + 1, 1).getTime() - 24 * 3600 * 1000
    let startDay = new Date(year, Month, 1).getTime()
    let length = (lastDay - startDay) / (24 * 3600 * 1000) + 1
    for (let index = 1; index <= length; index++) {
      this.monthdays.push(index + '号')
    }
    console.log(this.eidtForm)

    if (this.eidtForm) {
      this.setEdit()
    }
  },
  watch: {
    eidtForm: {
      deep: true,
      handler(val) {
        this.setEdit()
      }
    }
  },
  methods: {
    setEdit() {
      this.addform = JSON.parse(JSON.stringify(this.eidtForm))
      if (this.addform.endTime) {
        this.addform.timeType = '1'
        this.addform.timeRange = [this.addform.startTime, this.addform.endTime]
      } else {
        this.addform.timeType = '2'
      }
      if (this.addform.repeatType) {
        if (this.addform.repeatType[0] == '非重复') {
          this.addform.type = '1'
        } else if (this.addform.repeatType[0].indexOf('号') >= 0) {
          this.addform.type = '3'
          this.addform.repeat = '1'
        } else if (
          this.addform.repeatType == ['周一', '周二', '周三', '周四', '周五']
        ) {
          this.addform.type = '2'
        } else {
          this.addform.type = '3'
          this.addform.repeat = '2'
        }
      }
      console.log(this.addform)
    },
    close() {
      this.$refs['form'].clearValidate()
      if (this.iseidt) {
        this.setEdit()
      } else {
        this.addform = { type: '2', repeat: '2', repeatType: [], timeType: '1' }
      }
    },
    getRank() {
      getRank().then(res => {
        this.rankoptions = res
      })
    },
    typeChange(val) {
      this.addform.repeatType = []
      if (val == 1) {
        this.addform.repeatType = ['非重复']
      } else if ((val = 2)) {
        this.addform.repeatType = ['周一', '周二', '周三', '周四', '周五']
      }
    },

    repeatChange(val) {
      this.addform.repeatType = []
    },
    subAlarm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.addform.deptId = this.deptId
          if (this.addform.timeType == 1) {
            if (!this.addform.timeRange) {
              this.$message.error('请完整填写')
              return false
            } else {
              this.addform.startTime = this.addform.timeRange[0]
              this.addform.endTime = this.addform.timeRange[1]
            }
          } else {
            this.addform.endTime = ''
            if (this.addform.startTime == '') {
              this.$message.error('请完整填写')
              return false
            }
          }
          create(this.addform).then(res => {
            this.$message.success('新建成功')
            this.createVisible = false
            this.$emit('submit')
          })
        } else {
          this.$message.error('请完整填写')
          return false
        }
      })
    },
    saveEidt() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.addform.timeType == 1) {
            this.addform.startTime = this.addform.timeRange[0]
            this.addform.endTime = this.addform.timeRange[1]
          } else {
            this.addform.endTime = ''
          }
          editWork(this.addform).then(res => {
            this.$message.success('编辑成功')
            this.createVisible = false
            this.$emit('submit')
          })
        } else {
          this.$message.error('请完整填写')
          return false
        }
      })
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
    /deep/.el-radio__label,
    /deep/.el-checkbox-button__inner {
      font-size: 1.1rem;
    }
  }
}
</style>
