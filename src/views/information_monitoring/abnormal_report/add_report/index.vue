
<!--
 * @Description: 警察选择
 * @Author: zhuhao
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-16 16:20:50
 -->

<template>
  <el-dialog
    title="新增违规记录"
    :visible="sendVisible"
    @close="close"
    center
    class="yn_dialog"
    width="50%"
  >
    <el-form ref="createData" :model="createData" :rules="rule" class="yn_form" label-width="7rem">
      <el-row :gutter="10">
        <!--<el-col :span="12">-->
          <!--<el-form-item label="违规等级" prop="grade">-->
            <!--<el-select class="yn_ipt" v-model="createData.grade">-->
              <!--<el-option-->
                <!--v-for="(item,i) in levelList"-->
                <!--:key="i"-->
                <!--:label="item.name"-->
                <!--:value="item.value"-->
              <!--&gt;</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="违规类型" prop="type">
            <el-cascader class="yn_ipt" v-model="createData.type" :options="typeList"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规单位" prop="copId">
            <el-select
              v-model="createData.copId"
              @change="getDeptList"
              :disabled="isPrison"
              class="select_box yn_ipt"
              placeholder="请选择"
            >
              <el-option
                v-for="item in prisonList"
                :key="item.id"
                :label="item.departName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规部门" prop="deptId">
            <el-select
              :disabled="deptList.length==0"
              v-model="createData.deptId"
              class="select_box yn_ipt"
              placeholder="请选择"
            >
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.departName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规区域" prop="violationAreaId">
            <el-select
              v-model="createData.violationAreaId"
              class="select_box yn_ipt"
              placeholder="请选择"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整改时限" prop="timeType">
            <el-select v-model="createData.timeType" class="select_box yn_ipt" placeholder="请选择">
              <el-option
                v-for="item in timeTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="违规描述" prop="description">
            <el-input
              class="yn_ipt"
              type="textarea"
              placeholder="请输入确认内容"
              v-model="createData.description"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="选择图片" prop="photoIds">
            <el-button
              :disabled="subLaoding"
              v-loading="subLaoding"
              type="primary"
              class="yn_btn"
              @click="clickPhoto"
            >选择图片</el-button>

            <input
              class
              ref="photoIpt"
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              v-show="false"
              @change="photoChange"
            />
            <div v-if="photoIds.length>0" class="photoMian">
              <div v-for="(img,i) in photoIds" :key="i" class="photoBox">
                <el-image
                  class="photo"
                  :src="img.photo"
                  :preview-src-list="photoIds.map(item=>item.photo)"
                ></el-image>
                <i class="el-icon-delete" @click="delPhoto(i)"></i>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="选择附件" prop="fileIds">
            <el-button
              :disabled="subLaoding"
              v-loading="subLaoding"
              type="primary"
              class="yn_btn"
              @click="clickFile"
            >选择附件</el-button>

            <input class ref="fileIpt" type="file" v-show="false" @change="fileChange" />
            <div v-if="fileList.length>0">
              <div v-for="(item,i) in fileList" :key="i">
                <span>{{item.name}}</span>
                <i class="el-icon-delete" @click="delFile(item.uid,i)"></i>
              </div>
            </div>
            <el-button
              :disabled="subLaoding"
              v-loading="subLaoding"
              v-if="fileList.length>0"
              type="primary"
              class="yn_btn"
              @click="subFiles"
            >提交附件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="yn_btn"
        :disabled="subLaoding"
        v-loading="subLaoding"
        @click="subCreate"
      >保 存</el-button>
      <el-button type="primary" class="yn_btn" @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Loading } from 'element-ui'
import {
  getList,
  insertData,
  getType,
  insertCheck,
  getCheckList,
  getPrisonList,
  getDeptList,
  getViolateType,
  addPatrol
} from '../service'
import { formatDate } from '@/utils/date'
import { getPrisonId, clearChildren } from '@/utils'
export default {
  data() {
    return {
      userPrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      createData: {},
      prisonList: [],
      deptList: [],
      timeTypeList: [
        { name: '三日', value: 0 },
        { name: '一周', value: 1 },
        { name: '一月', value: 2 },
        { name: '一季', value: 3 }
      ],
      levelList: [
        { name: '高', value: 4 },
        { name: '较高', value: 3 },
        { name: '中', value: 2 },
        { name: '低', value: 1 },
        { name: '较低', value: 0 }
      ],
      typeList: [],
      areaList: [],
      photoIds: [],
      fileIds: [],
      fileList: [],
      filesNum: 0,
      rule: {
        grade: [{ required: true, message: '请输入', trigger: 'change' }],
        type: [{ required: true, message: '请输入', trigger: 'change' }],
        copId: [{ required: true, message: '请输入', trigger: 'change' }],
        deptId: [{ required: true, message: '请输入', trigger: 'change' }],
        violationAreaId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        timeType: [{ required: true, message: '请输入', trigger: 'change' }],
        description: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '长度在 2 到 1000 个字符',
            trigger: 'blur'
          }
        ]
      },
      isPrison: false,
      subLaoding: false
    }
  },
  props: ['sendVisible', 'closeSend'],
  mounted() {
    this.getPrisonList()
    this.getType()
    if (this.userPrisonId != 1) {
      this.createData.copId = this.userPrisonId
      this.isPrison = true
      this.getDeptList()
    }
  },
  methods: {
    close() {
      this.closeSend()
      this.createData = {}
      if (this.userPrisonId != 1) {
        this.createData.copId = this.userPrisonId
        this.isPrison = true
        this.getDeptList()
      }
      this.photoIds = []
      this.fileList = []
      this.fileIds = []
      this.$refs['createData'].resetFields()
    },
    subCreate() {
      this.$refs['createData'].validate(valid => {
        if (valid) {
          if (this.fileIds.length == 0 && this.fileList.length != 0) {
            this.$message.warning('请提交文件')
          } else if (this.fileIds.length !== this.fileList.length) {
            this.$message.warning('文件上传中，请稍后提交')
          } else {
            let createData = JSON.parse(JSON.stringify(this.createData))

            createData.fileIds = this.fileIds.map(item => {
              return item.id
            })
            this.subLaoding = true
            //去掉违规等级之后，传个默认值0占位
            createData.grade = 0;
            createData.datetime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            createData.fileIds = createData.fileIds.toString('')
            createData.photoList = this.photoIds.map(item => {
              return {
                photo: item.photo.substring(item.photo.indexOf('base64,') + 7)
              }
            })
            createData.firstTypeId = createData.type[0]
            createData.secondTypeId = createData.type[1]
            if (this.userPrisonId == 1) {
              createData.isProvince = 1
            } else {
              createData.isProvince = 0
            }
            delete createData.type
            addPatrol(createData).then(res => {
              this.$message.success('新增成功')
              this.closeSend()
              this.$emit('subSuccess')
              this.subLaoding = false
            })
          }
        } else {
          this.$message.error('请完整填写')
          return false
        }
      })
    },
    getType() {
      this.typeList = []
      this.areaList = []
      getViolateType().then(res => {
        console.log(res)
        this.typeList = res
      })
      getType('violateArea').then(res => {
        this.areaList.push(...res)
      })
    },

    getPrisonList() {
      getPrisonList(1).then(res => {
        this.prisonList = res
      })
    },
    getDeptList() {
      this.deptList = []
      getDeptList(this.createData.copId).then(res => {
        this.$set(this.createData, 'deptId', null)
        this.deptList = res.list
      })
    },
    clickFile() {
      this.$refs.fileIpt.click()
    },
    clickPhoto() {
      this.$refs.photoIpt.click()
    },
    photoChange() {
      let that = this
      let file = this.$refs.photoIpt.files[0]
      var reader = new FileReader()
      if (file) {
        reader.readAsDataURL(file)
        reader.onload = function() {
          that.photoIds.push({ photo: reader.result })
        }
      }
    },
    fileChange() {
      let that = this
      let file = this.$refs.fileIpt.files[0]
      if (this.filesNum < 5) {
        this.filesNum += 1

        that.fileList.push({
          file: file,
          name: file.name,
          uid: file.name + this.filesNum
        })
      } else {
        this.$message.warning('不能超过5个')
      }
    },
    subFiles() {
      let that = this
      this.subLaoding = true

      that.fileIds = []
      that.fileList.map(item => {
        let fd = new FormData()
        let file = item.file
        let flag = true
        that.fileIds.map(obj => {
          obj.uid == item.uid ? (flag = false) : ''
        })
        if (flag) {
          fd.append('file', file)
          that.axios
            .post(that._global.businessUrl + '/file/upload', fd)
            .then(res => {
              console.log(res)
              that.fileIds.push({
                name: res.fileName,
                id: res.fileId,
                uid: item.uid
              })
              if (that.fileIds.length == that.fileList.length) {
                that.subLaoding = false
              }
            })
        }
      })
    },
    delPhoto(i) {
      this.photoIds.splice(i, 1)
    },
    delFile(uid, i) {
      this.fileList.splice(i, 1)

      this.filesNum -= 1
      this.subLaoding = true
      this.fileIds.map((item, j) => {
        if (item.uid == uid) {
          this.fileIds.splice(j, 1)

          this.axios
            .delete(this._global.businessUrl + '/file/delete/' + item.id)
            .then(res => {
              console.log(res)
              this.$message.success(res)
              this.subLaoding = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-cascader {
  width: 100% !important;
}
.photoMian {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.photoBox {
  display: flex;
  font-size: 2rem;
  color: red;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    cursor: pointer;
  }
}
.photo {
  width: 10rem;
  height: 10rem;
  margin: 1rem;
}
</style>
