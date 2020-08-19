<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-22 14:06:43
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 17:02:20
 -->
<template>
  <menuTree :menuList="['系统管理','阈值管理']">
    <el-button
      style="margin-bottom:20px"
      type="primary"
      class="yn_btn"
      @click="handleAddThreshold"
    >新增阈值</el-button>
    <el-row :gutter="12" v-loading="tableLoating">
      <el-col :span="8" v-for="(item,index) in thresholdList" :key="index">
        <el-card shadow="always" style="margin-bottom:20px;">
          <el-row type="flex" align="middle">
            <el-col
              style="overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;"
              :title="item.thresholdCode"
              :span="10"
            >
              <b>{{item.thresholdCode}}</b>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col
              :span="10"
              style="overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;"
              :title="item.thresholdName"
            >
              <b>{{item.thresholdName}}</b>
            </el-col>
            <el-col :span="3" style="text-align:center">
              <i @click="handleEditThreshold(item)" class="edit_icon el-icon-edit"></i>
            </el-col>
          </el-row>

          <el-row type="flex" align="middle" style="padding-top:10px">
            <el-col :span="11">
              值：&emsp;
              <b>{{item.thresholdValue}}{{item.unit}}</b>
            </el-col>
            <el-col :span="13">
              <span>
                最后修改时间：&emsp;
                <b>{{item.lastModifyTime | formatDate}}</b>
              </span>
            </el-col>
          </el-row>

          <el-row style="padding-top:10px">
            <el-col :span="21">
              <span>
                最后修改人:&emsp;
                <b>{{item.lastModifierName}}</b>
              </span>
            </el-col>
            <el-col :span="3" style="text-align:center">
              <el-tag v-show="item.status===0" type="success" disable-transitions>启用</el-tag>
              <el-tag v-show="item.status===1" type="danger" disable-transitions>停用</el-tag>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="newThresholdDialogTitle"
      class="yn_dialog"
      center
      :visible.sync="newThresholdDialog"
      @closed="resetForm('thresholdForm')"
      width="30%"
    >
      <div>
        <el-form
          label-position="left"
          label-width="80px"
          :model="thresholdForm"
          ref="thresholdForm"
          class="demo-form-inline yn_form"
          :rules="rules"
          @submit.native.prevent
        >
          <el-form-item
            v-show="thresholdForm.lastModifierGuid==null"
            label="唯一标识"
            prop="thresholdCode"
          >
            <el-input class="yn_ipt" v-model="thresholdForm.thresholdCode" placeholder="输入阈值标识"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="thresholdName">
            <el-input class="yn_ipt" v-model="thresholdForm.thresholdName" placeholder="输入阈值名称"></el-input>
          </el-form-item>
          <el-form-item label="后缀单位" prop="unit">
            <el-input class="yn_ipt" v-model="thresholdForm.unit" placeholder="输入单位"></el-input>
          </el-form-item>
          <el-form-item label="值" prop="thresholdValue">
            <el-input-number
              class="yn_ipt"
              :controls="false"
              v-model="thresholdForm.thresholdValue"
              :precision="1"
              :step="0.1"
              :min="0.1"
              :max="100000"
            ></el-input-number>
            <span class="num_area">值取值范围:[0.0-100000.0]</span>
          </el-form-item>
          <el-form-item label="状态" v-show="thresholdForm.lastModifierGuid!=null">
            <el-switch
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="停用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="thresholdForm.status"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="saveThreshold()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </menuTree>
</template>

<script>
import { inputSpecialCharactersValidator } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'

export default {
  filters: {
    formatDate: function(value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  components: { menuTree },

  data() {
    var thresholdCodeValidator = (rule, value, callback) => {
      if (this.newThresholdDialogTitle == '编辑阈值') {
        callback()
        return
      }
      this.axios
        .get(this._global.businessUrl + '/threshold/checkCode/' + value)
        .then(data => {
          if (data) {
            callback()
          } else {
            callback(new Error('唯一标识不可重复'))
          }
        })
    }

    return {
      tableLoating: false,
      newThresholdDialog: false,
      newThresholdDialogTitle: '',
      queryParams: {
        menuName: '',
        atrbModule: '',
        type: ''
      },
      value: '0',
      thresholdList: [],
      thresholdForm: {
        thresholdCode: null,
        thresholdValue: null,
        thresholdName: null,
        unit: null,
        lastModifierGuid: null,
        status: 0
      },
      prisonUnitOption: [],
      rules: {
        thresholdCode: [
          { required: true, message: '唯一标识不可为空', trigger: 'blur' },
          {
            max: 255,
            message: '长度在255 个字符以下',
            trigger: 'blur'
          },
          {
            validator: inputSpecialCharactersValidator,
            trigger: 'blur'
          },
          { validator: thresholdCodeValidator, trigger: 'blur' }
        ],
        thresholdName: [
          { required: true, message: '阈值名称不可为空', trigger: 'blur' },
          {
            max: 255,
            message: '长度在255 个字符以下',
            trigger: 'blur'
          },
          {
            validator: inputSpecialCharactersValidator,
            trigger: 'blur'
          }
        ],
        thresholdValue: [
          { required: true, message: '值不可为空', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '后缀单位不可为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getThresholdList()
  },
  methods: {
    resetForm(formName) {
      console.log(formName)
      if (this.$refs[formName]) {
        console.log(formName)
        this.$refs[formName].resetFields()
      }
    },
    saveThreshold() {
      this.$refs.thresholdForm.validate(valid => {
        if (valid) {
          if (this.thresholdForm.lastModifierGuid == null) {
            this.thresholdForm.lastModifierGuid = JSON.parse(
              localStorage.getItem('user')
            ).userGuid
            this.axios
              .post(this._global.businessUrl + '/threshold', this.thresholdForm)
              .then(data => {
                this.getThresholdList()
                this.newThresholdDialog = false
                this.$message.success('新增成功')
              })
          } else {
            this.thresholdForm.lastModifierGuid = JSON.parse(
              localStorage.getItem('user')
            ).userGuid
            this.axios
              .put(this._global.businessUrl + '/threshold', this.thresholdForm)
              .then(data => {
                this.getThresholdList()
                this.newThresholdDialog = false
                this.$message.success('编辑成功')
              })
          }
        } else {
          console.log('invalid')
          return false
        }
      })
    },

    getThresholdList() {
      this.tableLoating = true
      this.axios
        .get(this._global.businessUrl + '/threshold' + '?' + Math.random())
        .then(data => {
          this.thresholdList = data
          this.tableLoating = false
        })
    },
    handleAddThreshold() {
      this.newThresholdDialogTitle = '新增阈值'
      this.thresholdForm = {
        thresholdCode: null,
        thresholdValue: null,
        thresholdName: null,
        unit: null,
        lastModifierGuid: null,
        status: 0
      }
      this.newThresholdDialog = true
    },
    handleEditThreshold(threshold) {
      this.newThresholdDialogTitle = '编辑阈值'
      this.thresholdForm = Object.assign({}, threshold)
      this.newThresholdDialog = true
    },
    updateThreshold(threshold) {
      let param = {
        lastModifierGuid: 'xxx', // 当前登录人guid
        thresholdValue: threshold.thresholdValue,
        status: threshold.status,
        thresholdCode: threshold.thresholdCode,
        unit: threshold.unit,
        thresholdName: threshold.thresholdName
      }
      // loading
      this.axios
        .put(this._global.businessUrl + '/threshold', param)
        .then(data => {
          // loading end
        })
    }
  }
}
</script>

<style lang="less" scoped>
.edit_icon {
  font-size: 1.4rem;
  color: blue;
}
.num_area {
  font-size: 1.1rem;
}
.yn_item {
  margin-top: 1rem;
  margin-bottom: 1rem;

  .yn_ipt_title {
    width: 7rem;
  }

  .yn_ipt {
    width: calc(100% - 7.5rem);
  }
}
.technology {
  .num_area {
    color: #fff;
  }
  .el-card {
    background: transparent;
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
  .edit_icon {
    color: yellow;
  }
}
</style>
