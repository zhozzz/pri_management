<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-28 16:27:30
 -->

<template slot-scope="scope">
  <!-- 预案创建 -->
  <el-dialog class="yn_dialog" :visible="createVisible" title="预案创建" center @close="close">
    <el-form ref="form" label-width="10rem" class="yn_form" :rules="rules" :model="formData">
      <el-form-item prop="planName" label="流程名称：">
        <el-input class="yn_ipt" v-model="formData.planName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item prop="eventType" label="事件类型：">
        <el-select v-model="formData.eventType" class="select_box yn_ipt" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.subclassGuid"
            :label="item.value"
            :value="item.subclassGuid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="emergencyLevel" label="警情级别：">
        <el-select v-model="formData.emergencyLevel" class="select_box yn_ipt" placeholder="请选择">
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="steps" label="步骤：">
        <el-button class="yn_btn" type="primary" @click="openStep">设置步骤</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      width="50%"
      center
      class="yn_dialog"
      title="设置步骤"
      :visible.sync="stepVisible"
      append-to-body
      @close="stepColse"
    >
      <div class="stepBoxs" v-for="(item,i) in stepList" :key="i">
        <el-row :gutter="10">
          <el-col :span="3">步骤{{i+1}}</el-col>
          <el-col :span="18">
            <el-form
              ref="stepForm"
              label-width="8rem"
              :model="item"
              :rules="stepRule"
              class="yn_form"
            >
              <el-form-item prop="stepName" label="步骤名称：">
                <el-input class="yn_ipt" v-model="item.stepName" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item prop="teamId" label="应急小组：">
                <el-select v-model="item.teamId" class="select_box yn_ipt" placeholder="请选择">
                  <el-option
                    v-for="obj in teamList"
                    :key="obj.teamId"
                    :label="obj.teamName"
                    :value="obj.teamId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="detail" label="步骤详情：">
                <el-input class="yn_ipt" v-model="item.detail" placeholder="请输入详情"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              class="yn_ipt cir_btn"
              @click="delStep(i)"
            ></el-button>
          </el-col>
        </el-row>
      </div>
      <div class="btn_box">
        <el-button class="yn_btn" type="primary" @click="addSteps">添加步骤</el-button>
      </div>
      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="saveSteps">保存</el-button>
        <el-button class="yn_btn" @click="stepVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <span slot="footer">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(saveCreate)">确定</el-button>
      <el-button class="yn_btn" @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getPrisonId, getUserId } from '@/utils'
import { getEventType, getTeamList, createPlan, editPlan } from './service.js'

export default {
  components: {},
  props: ['createVisible', 'dialogClose', 'planForm'],
  data() {
    return {
      prisonId: getPrisonId(),
      stepVisible: false,
      typeList: [],
      formData: {},
      levelList: [
        { name: '轻微', value: 1 },
        { name: '较低', value: 2 },
        { name: '中等', value: 3 },
        { name: '较高', value: 4 },
        { name: '严重', value: 5 }
      ],
      teamList: [],
      stepList: [],
      rules: {
        planName: [
          {
            min: 2,
            max: 225,
            message: '长度在 2到 225 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入预案名称', trigger: 'blur' }
        ],
        eventType: [
          { required: true, message: '请选择事件类型', trigger: 'change' }
        ],
        emergencyLevel: [
          { required: true, message: '请选择警情级别', trigger: 'change' }
        ]
      },
      stepRule: {
        stepName: [
          { required: true, message: '请填写步骤名', trigger: 'blur' }
        ],
        teamId: [
          { required: true, message: '请选择应急小组', trigger: 'change' }
        ],
        detail: [{ required: true, message: '请填写步骤详情', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getEventType()
    this.getTeamList()
  },
  methods: {
    // 获取类型数据
    getEventType() {
      getEventType().then(res => {
        this.typeList = res
      })
    },
    getTeamList() {
      getTeamList(this.prisonId).then(res => {
        this.teamList = res
      })
    },
    close() {
      this.formData = {}
      this.$refs['form'].resetFields()
      this.dialogClose()
    },
    stepColse() {
      this.stepList = []
    },
    openStep() {
      this.stepVisible = true
      if (this.formData.steps) {
        this.stepList = JSON.parse(JSON.stringify(this.formData.steps))
      }
    },
    // 添加步骤
    addSteps() {
      this.stepList.push({})
    },
    delStep(i) {
      this.stepList.splice(i, 1)
    },
    // 保存步骤
    saveSteps() {
      let flag = true

      this.$refs['stepForm'].forEach(item => {
        item.validate(valid => {
          if (valid) {
          } else {
            this.$message.error({ message: '请完整填写' })
            flag = false
          }
        })
      })

      if (flag) {
        this.stepList.forEach((item, i) => {
          item.index = i + 1
        })
        this.formData.steps = JSON.parse(JSON.stringify(this.stepList))
        this.stepVisible = false
      }
    },
    saveCreate() {
      this.formData.prisonId = this.prisonId
      this.formData.userId = getUserId()
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.formData.steps) {
            if (this.planForm) {
              editPlan(this.formData).then(res => {
                this.$message.success('操作成功')
                this.close()
                this.$emit('create')
              })
            } else {
              createPlan(this.formData).then(res => {
                this.$message.success('操作成功')
                this.close()
                this.$emit('create')
              })
            }
          } else {
            this.$message.error({ message: '请添加步骤' })
            this.stepVisible = true
          }
        } else {
          this.$message.error({ message: '请完整填写' })

          return false
        }
      })
    }
  },
  watch: {
    planForm: {
      deep: true,
      handler(val) {
        this.formData = this.planForm
      }
    }
  }
}
</script>
<style scoped lang="less">
/deep/.el-form-item__label {
  font-size: 1.2rem;
}
.cir_btn {
  padding: 4px !important;
  font-size: 1.4rem;
}
.stepBoxs {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  margin: 1rem 0;
}
.btn_box {
  width: 100%;
  margin-top: 1rem;
  text-align: right;
}
.technology {
  .stepBoxs {
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
}
</style>
