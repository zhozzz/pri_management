<!--
 * @Description: 隐患排查新增
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:29:29

 -->
<template>
  <menuTree :menuList="['监狱管理','监狱动态','隐患排查报表','新增隐患排查']">
    <!-- <div class="yn_page_title">新增隐患排查</div> -->
    <el-form label-width="12rem" class="yn_form" :rules="rules" :model="formData" ref="creatForm">
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item prop="departName" label="监狱：">
            <el-input class="yn_ipt" v-model=" departName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item prop="checkType" label="隐患性质：">
            <el-cascader
              class="yn_cascader yn_ipt"
              v-model="formData.checkType"
              :options="riskType"
              :props="riskTypeProp"
              @change="typeChange"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="hiddenNum" label="隐患编号：">
            <el-input class="yn_ipt" v-model="formData.hiddenNum" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="checkDept" label="排查部门：">
            <el-cascader
              class="yn_cascader yn_ipt"
              v-model="formData.checkDept"
              :options="checkDeptOptions"
              :props="checkDeptProp"
            ></el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item prop="hiddenLevel" label="隐患等级：">
            <el-select
              v-model="formData.hiddenLevel"
              popper-class="level_sel"
              class="yn_ipt"
              placeholder="请选择隐患等级"
            >
              <el-option
                v-for="(item,i) in levelList"
                :key="item.subclassGuid"
                :label="item.value"
                :value="item.subclassGuid"
              >
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">
                    <p v-for="(p,i) in item.description" :key="i">{{p}}</p>
                  </div>
                  <div class="select_tool" :class="'tool'+i">{{item.value}}</div>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="positionType" label="隐患位置：">
            <el-row>
              <el-col :span="6">
                <el-select v-model="formData.positionType" class="yn_ipt" placeholder="请选择隐患位置：">
                  <el-option
                    v-for="item in positionTypeList"
                    :key="item.subclassGuid"
                    :label="item.value"
                    :value="item.subclassGuid"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="17" :offset="1">
                <el-input class="yn_ipt" v-model="formData.positionDetail" placeholder="输入位置详情："></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item prop="findDate" label="隐患发现时间：">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="formData.findDate"
              type="datetime"
              value-format="yyyy-MM-dd hh:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item prop="aimDept" label="对应整改部门：">
            <el-cascader
              class="yn_cascader yn_ipt"
              v-model="formData.aimDept"
              :options="checkDeptOptions"
              :props="checkDeptProp"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="aimDeptPerson" label="整改部门人员：">
            <el-input
              class="yn_ipt"
              v-model="formData.aimDeptPerson"
              type="textarea"
              placeholder="请输入部门人员信息"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="assistDept" label="协助整改部门：">
            <el-cascader
              class="yn_cascader yn_ipt"
              v-model="formData.assistDept"
              :options="checkDeptOptions"
              :props="checkDeptProp"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="assistDeptPerson" label="协助部门人员：">
            <el-input
              class="yn_ipt"
              v-model="formData.assistDeptPerson"
              type="textarea"
              placeholder="请输入部门人员信息"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="detail" label="隐患详情：">
            <el-input
              class="yn_ipt"
              v-model="formData.detail"
              type="textarea"
              placeholder="请输入隐患详情"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="measure" label="整改措施：">
            <el-input
              class="yn_ipt"
              v-model="formData.measure"
              type="textarea"
              placeholder="请输入整改措施"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="isHelp" label="是否需要上级帮助：">
            <el-radio v-model="formData.isHelp" :label="1">是</el-radio>
            <el-radio v-model="formData.isHelp" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-if="formData.isHelp==1">
          <el-form-item prop="helpDetail" label="需要帮助内容：">
            <el-input
              class="yn_ipt"
              v-model="formData.helpDetail"
              type="textarea"
              placeholder="需要上级帮助的详细需求"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="images" label="隐患照片：">
            <el-upload
              class="upload-demo"
              :action="_global.businessUrl+'/file/upload'"
              multiple
              :on-success="upsuccess"
              :on-remove="removefile"
              :before-upload="beforeAvatarUpload"
              list-type="picture-card"
              :file-list="fileIds"
            >
              <el-button class="yn_btn" type="primary">添加照片</el-button>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item prop="limitType" label="整改限时：">
            <el-select v-model="formData.limitType" class="yn_ipt" placeholder="请选择整改限时：">
              <el-option
                v-for="(item,i) in limitTypeList"
                :key="i"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item>
            <el-button class="yn_btn" @click="$checkMessage(submitForm)" type="primary">确定</el-button>
            <el-button class="yn_btn" @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </menuTree>
</template>

<script>
import _global from '@/utils/global_url'
import { Loading } from 'element-ui'
import menuTree from '@/components/menu_tree/'

import { getPrisonId, getDeptId, clearChildren } from '@/utils'
import {
  getDept,
  getRiskType,
  getRiskLevel,
  getPosition,
  getRiskNum,
  addRisk,
  getRiskTypeNum
} from '../service.js'

export default {
  name: 'index',
  components: {
    menuTree
  },
  data() {
    return {
      departName: '',
      prisonId: getPrisonId(),
      deptId: getDeptId(),
      formData: { images: [] },
      departList: [],
      checkDeptOptions: [],
      checkDeptProp: {
        multiple: true,
        checkStrictly: true,
        value: 'id',
        label: 'departName',
        children: 'list',
        emitPath: false
      },
      riskType: [],
      riskTypeProp: {
        value: 'id',
        label: 'dictionaryName',
        children: 'childList'
      },
      checkType: [],
      levelList: [],
      positionTypeList: [],
      fileIds: [],
      limitTypeList: [
        { name: '长期', value: 1 },
        { name: '一周', value: 2 },
        { name: '一月', value: 3 },
        { name: '一季', value: 4 }
      ],
      rules: {
        checkDept: [
          { required: true, message: '请选择排查部门名称', trigger: 'change' }
        ],
        checkType: [
          { required: true, message: '请选择隐患类型', trigger: 'change' }
        ],
        hiddenLevel: [
          { required: true, message: '请选择隐患级别', trigger: 'change' }
        ],
        positionType: [
          { required: true, message: '请输入详细位置', trigger: 'blur' }
        ],
        findDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        aimDept: [{ required: true, message: '请完整填写', trigger: 'change' }],
        aimDeptPerson: [
          { required: true, message: '请完整填写', trigger: 'blur' }
        ],
        detail: [{ required: true, message: '请完整填写', trigger: 'blur' }],
        measure: [{ required: true, message: '请完整填写', trigger: 'change' }],
        limitType: [
          { required: true, message: '请完整填写', trigger: 'change' }
        ],
        isHelp: [{ required: true, message: '请完整填写', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getDept()
  },
  methods: {
    nodeClick(val) {
      console.log(val)
    },
    getDept() {
      // 获取部门
      getDept(this.prisonId).then(res => {
        console.log(res)
        clearChildren(res, 'list')
        this.departName = res.departName
        this.checkDeptOptions = res.list
      })
      //   getRiskNum(this.prisonId).then(res => {
      //     this.formData.hiddenNum = res
      //   })
      // 获取隐患类型
      getRiskType(1).then(res => {
        this.riskType = res
      })

      // 获取隐患等级
      getRiskLevel().then(res => {
        this.levelList = res
        this.levelList.map(item => {
          item.description = item.description.split('___')
        })
      })

      // 获取位置信息
      getPosition().then(res => {
        this.positionTypeList = res
      })
    },
    typeChange(val) {
      if (val) {
        getRiskTypeNum(this.prisonId + '/' + val[0]).then(res => {
          //   this.formData.hiddenNum = res
          this.$set(this.formData, 'hiddenNum', res)
          console.log(res)

          console.log(this.formData)
        })
      }
    },
    submitForm() {
      console.log(this.formData)
      this.$refs['creatForm'].validate(valid => {
        if (valid) {
          if (this.formData.isHelp === 1 && !this.formData.helpDetail) {
            this.$message.error({ message: '请填写需要帮助内容' })
            return false
          }

          let formData = JSON.parse(JSON.stringify(this.formData))
          formData.prisonId = this.prisonId
          formData.deptId = this.deptId

          formData.hiddenType = formData.checkType[0]
          formData.subType = formData.checkType[1]
          delete formData.checkType
          addRisk(formData).then(res => {
            this.$message.success('新增完成')
            this.$router.push({ name: 'safety_inspection' })
          })
        } else {
          this.$message.error({ message: '请完整填写' })
          return false
        }
      })
    },
    upsuccess(res) {
      Loading.service().close()
      this.$message.success('上传成功')

      this.formData.images.push(res.data.fileId)
    },
    beforeAvatarUpload(file) {
      console.log(file)
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        Loading.service({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      } else {
        this.$message.error('请选择正确的图片格式')
        return false
      }
    },
    removefile(file, fileList) {
      //   this.formData.images = fileList
      if (fileList) {
        this.formData.images = fileList.map(item => {
          return item.response.data.fileId
        })
      }
      this.axios
        .delete(
          this._global.businessUrl + '/file/delete/' + file.response.data.fileId
        )
        .then(res => {
          console.log(res)
          this.$message.success(res)
        })
    }
  }
}
</script>

<style scoped lang='less'>
.yn_ipt {
  width: 100%;
}
/deep/.el-cascader__tags .el-tag > span,
/deep/.el-radio__label {
  font-size: 1.1rem;
}
.select_tool {
  text-align: center;
  font-size: 1.1rem;
  margin: 0 !important;
}
.tool0 {
  color: red;
}
.tool1 {
  color: rgb(255, 123, 0);
}
.tool2 {
  color: rgb(247, 244, 95);
}
.tool3 {
  color: rgb(0, 89, 255);
}
</style>
