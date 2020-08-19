<!--
 * @Description: 警察选择
 * @Author: zhuhao
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-23 10:06:10
 -->

<template>
  <el-dialog
    title="文件发送"
    class="yn_dialog"
    :visible="sendVisible"
    center
    width="50%"
    @close="dialogClose"
  >
    <el-form :model="addform" label-width="8rem" class="yn_form" ref="addForm" :rules="rule">
      <el-row :gutter="10">
        <el-col :span="20" :offset="1">
          <el-form-item label="接收单位" prop="selReceiveIds">
            <el-cascader
              :show-all-levels="false"
              class="yn_cascader yn_ipt"
              filterable
              v-model="addform.selReceiveIds"
              :options="deptlist"
              :props="deptProp"
              ref="cascad"
              popper-class="dowm_box"
              @change="selectDept"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" v-if="prisonId==1">
        <el-col :span="20" :offset="1">
          <el-form-item label="是否需要反馈" prop="isFeedback">
            <el-radio v-model="addform.isFeedback" @change="radioChange" label="Y">是</el-radio>
            <el-radio v-model="addform.isFeedback" @change="radioChange" label="N">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="prisonId==1">
        <el-col :span="20" :offset="1">
          <el-form-item label="反馈周期">
            <el-select
              class="yn_ipt"
              v-model="addform.fbPeriod"
              :disabled="addform.isFeedback=='N'"
            >
              <el-option v-for="(item,i) in fbPeriodList" :key="i" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" v-if="prisonId==1">
        <el-col :span="20" :offset="1">
          <el-form-item label="反馈次数" prop="fbCount">
            <el-input-number
              class="yn_ipt"
              :disabled="addform.isFeedback=='N'"
              v-model="addform.fbCount"
              :controls="false"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="20" :offset="1">
          <el-form-item label="文件" prop="fileList">
            <el-upload
              class="upload-demo"
              :action="_global.businessUrl+'/file/upload'"
              multiple
              :limit="9"
              :on-success="upsuccess"
              :on-remove="removefile"
              :before-upload="beforeAvatarUpload"
              :file-list="fileIds"
            >
              <el-button class="yn_btn" type="primary">添加文件</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="20" :offset="1">
          <el-form-item label="文件类型" prop="fileSuffix">
            <el-select class="yn_ipt" v-model="addform.fileSuffix" v-loading="fileLoading">
              <el-option
                v-for="(item,i) in fileTypeList"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="20" :offset="1">
          <el-form-item label="备注信息">
            <el-input class="yn_ipt" type="textarea" v-model="addform.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="yn_btn" type="primary" @click="submit">发送</el-button>
      <el-button class="yn_btn" type="primary" @click="dialogClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { Loading } from 'element-ui'

import { getPrisonId, clearChildren } from '@/utils'
export default {
  model: {
    prop: 'value'
  },
  data() {
    return {
      prisonId: getPrisonId(),
      addform: { isFeedback: 'N', fileList: [] },
      deptlist: [], // 部门数组
      isPrison: '',
      deptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true,
        multiple: true
        // emitPath: false
      },
      // 反馈周期
      fbPeriodList: ['每日', '每周', '每月', '按季', '每年'],
      selDeptList: [],
      rule: {
        selReceiveIds: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        fileList: [{ required: true, message: '请上传文件', trigger: 'blur' }],
        fileSuffix: [
          { required: true, message: '请选择文件类型', trigger: 'blur' }
        ]
      },
      fileIds: [],
      fileTypeList: [],
      fileLoading: true
    }
  },
  props: ['sendVisible', 'closeSend'],
  mounted() {
    this.getdept()
    this.getDeptType()
    this.getFileType()
  },
  methods: {
    //user/dictionary/option/PlanType
    // 关闭蒙层
    dialogClose() {
      this.addform = { isFeedback: 'N', fileList: [] }
      this.fileIds = []
      this.selDeptList = []
      console.log(this.addform)
      this.$refs['addForm'].clearValidate()
      this.closeSend()
    },
    radioChange(val) {
      if (val == 'N') {
        this.addform.fbPeriod = ''
        this.addform.fbCount = undefined
      }
    },

    selectDept(val) {
      this.selDeptList = []
      this.addform.receiveIds = []
      console.log(val)

      if (val) {
        val.forEach(obj => {
          this.addform.receiveIds.push(obj[obj.length - 1])
          if (obj.length > 1) {
            this.deptlist[0].list.forEach(item => {
              if (obj[1] == item.id) {
                if (item.departType == this.isPrison) {
                  this.selDeptList.push({
                    prisonId: obj[1],
                    deptId: obj[obj.length - 1]
                    // deptType: this.isPrison
                  })
                } else {
                  this.selDeptList.push({
                    prisonId: 1,
                    deptId: item.id
                    // deptType: item.departType
                  })
                }
              }
            })
          } else {
            this.selDeptList.push({ prisonId: 1, deptId: 1 })
          }
        })
      }
    },

    //获取文件类型

    getFileType() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/FileType')
        .then(res => {
          this.fileTypeList = res
          this.fileLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    //部门类型
    getDeptType() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/ORGANIZATION')
        .then(response => {
          response.map(item => {
            item.label == '监狱' ? (this.isPrison = item.value) : ''
          })
          console.log(this.isPrison)
        })
        .catch(error => {
          console.log(error)
        })
    },
    upsuccess(res) {
      Loading.service().close()
      this.$message.success('上传成功')

      this.addform.fileList.push(res.data.fileId)
    },
    beforeAvatarUpload() {
      Loading.service({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    removefile(file, fileList) {
      this.addform.fileList = fileList
      this.axios
        .delete(
          this._global.businessUrl + '/file/delete/' + file.response.data.fileId
        )
        .then(res => {
          console.log(res)
          this.$message.success(res)
        })
    },
    // 获取部门
    getdept() {
      this.axios
        .get(this._global.userUrl + '/compose/getChildrenTree/1')
        .then(response => {
          clearChildren(response, 'list')
          this.deptlist = [response]
          this.disDept(this.deptlist)
        })
        .catch(error => {
          console.log(error)
        })
    },
    disDept(arr) {
      let userDeptId = JSON.parse(localStorage.getItem('user')).deptGuid

      arr.forEach(item => {
        item.id == userDeptId ? (item.disabled = true) : ''
        if (item.list) {
          this.disDept(item.list)
        }
      })
    },
    submit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          console.log(this.addform)
          let parma = JSON.parse(JSON.stringify(this.addform))
          let deptId = JSON.parse(localStorage.getItem('user')).deptGuid
          parma.sendId = deptId
          parma.sePrisonId = this.prisonId
          parma.fileIds = this.addform.fileList
          parma.deptlist = this.selDeptList

          delete parma.fileList
          delete parma.selReceiveIds
          this.axios
            .post(this._global.businessUrl + '/dispatchFile/insert', parma)
            .then(res => {
              console.log(res)
              this.$emit('submit')
              this.$message.success('发送成功！')
              this.closeSend()
            })
        } else {
          this.$message.error({ message: '请正确输入' })
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.yn_cascader {
  width: 100%;
  height: auto;
}
.yn_ipt {
  width: 100%;
}
/deep/.el-cascader__tags {
  input {
    display: none;
  }
}
</style>
