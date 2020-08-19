
<!--
 * @Description: 警察选择
 * @Author: zhuhao
 * @Github:
 * @Date: 2019-08-24 14:30:55
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-11 11:13:09
 -->

<template>
  <el-dialog
    title="编辑违规记录"
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
        <!--<el-select :disabled="updateState==2" class="yn_ipt" v-model="createData.grade">-->
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
            <el-cascader
              :disabled="updateState==2||updateState==3"
              class="yn_ipt"
              v-model="createData.type"
              :options="typeList"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违规单位" prop="copId">
            <el-select
              :disabled="true"
              v-model="createData.copId"
              @change="getDeptList"
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
              :disabled="deptList.length==0||updateState==2||updateState==3"
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
        <el-col :span="12" v-if="updateState==3">
          <el-form-item label="违规区域" prop="violationAreaId">
            <el-select
              :disabled="updateState==2||updateState==3"
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

        <el-col :span="12" v-if="updateState==3">
          <el-form-item prop="checkType" label="隐患性质：">
            <el-cascader
              class="yn_cascader yn_ipt"
              v-model="createData.checkType"
              :options="riskType"
              :props="riskTypeProp"
              @change="typeChange"
            ></el-cascader>
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
        <el-col :span="12">
          <el-form-item prop="hiddenLevel" label="隐患等级：">
            <el-select
              v-model="createData.hiddenLevel"
              popper-class="level_sel"
              class="yn_ipt"
              placeholder="请选择隐患等级"
            >
              <el-option
                v-for="(item,i) in riskLevelList"
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
        <el-col :span="12">
          <el-form-item prop="isHelp" label="是否需要上级帮助：">
            <el-radio v-model="createData.isHelp" :label="1">是</el-radio>
            <el-radio v-model="createData.isHelp" :label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="createData.isHelp==1">
          <el-form-item prop="helpDetail" label="需要帮助内容：">
            <el-input
              class="yn_ipt"
              v-model="createData.helpDetail"
              type="textarea"
              placeholder="需要上级帮助的详细需求"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="positionType" label="隐患位置：">
            <el-row>
              <el-col :span="6">
                <el-select v-model="createData.positionType" class="yn_ipt" placeholder="请选择隐患位置：">
                  <el-option
                    v-for="item in positionTypeList"
                    :key="item.subclassGuid"
                    :label="item.value"
                    :value="item.subclassGuid"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="17" :offset="1">
                <el-input class="yn_ipt" v-model="createData.positionDetail" placeholder="输入位置详情："></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
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
  editPatrol,
  getPatrolImage,
  getPosition,
  getRiskType,
  getRiskLevel,
  getRiskTypeNum,
  addRisk
} from '../service'
import { formatDate } from '@/utils/date'
import { getPrisonId, clearChildren, getDeptId } from '@/utils'
export default {
  data() {
    return {
      userPrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      userGuid: getDeptId(),
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
      subLaoding: false,
      positionTypeList: [],
      riskType: [],
      riskLevelList: [],
      riskTypeProp: {
        value: 'id',
        label: 'dictionaryName',
        children: 'childList'
      }
    }
  },
  props: ['sendVisible', 'closeSend', 'editParam', 'updateState'],
  mounted() {
    this.createData = JSON.parse(JSON.stringify(this.editParam))

    this.getPrisonList()
    this.getType()
    if (this.userPrisonId != 1) {
      this.createData.copId = this.userPrisonId

      this.getDeptList()
    }
  },
  watch: {
    editParam: {
      deep: true,
      handler(val) {
        console.log(val)

        this.createData = JSON.parse(JSON.stringify(val))
        this.createData.type = [
          this.createData.firstTypeId,
          this.createData.secondTypeId
        ]
        this.fileIds = []

        if (val) {
          this.getDeptList()
          this.getPatrolImage()
        }
      }
    },
    updateState(val) {}
  },
  methods: {
    close() {
      this.closeSend()

      this.$refs['createData'].resetFields()
    },
    subCreate() {
      this.$refs['createData'].validate(valid => {
        console.log(this.fileIds)
        console.log(this.fileList)

        if (valid) {
          if (this.fileList.length != 0 && this.fileIds.length == 0) {
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
            createData.grade = 0
            // createData.datetime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
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
            createData.updateState = this.updateState

            delete createData.type
            delete createData.isDown
            if (this.updateState == 3) {
              createData.rectificationDeptId = createData.deptId
              createData.investDeptId = this.userGuid
              addRisk(createData).then(res => {
                this.subLaoding = false
                this.closeSend()
                this.$emit('subSuccess')
                console.log(res)
                this.$message.success('下发成功')
              })
            } else {
              editPatrol(createData).then(res => {
                if (this.updateState == 2) {
                  this.$message.success('下发成功')
                } else {
                  this.$message.success('编辑成功')
                }
                this.closeSend()
                this.$emit('subSuccess')
                this.subLaoding = false
              })
            }
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
      // 获取位置信息
      getPosition().then(res => {
        this.positionTypeList = res
      })
      // 获取隐患类型
      getRiskType(1).then(res => {
        this.riskType = res
      })

      // 获取隐患等级
      getRiskLevel().then(res => {
        this.riskLevelList = res
        this.riskLevelList.map(item => {
          item.description = item.description.split('___')
        })
      })
    },
    getPatrolImage() {
      this.photoIds = []
      this.fileList = []
      getPatrolImage(this.createData.id).then(res => {
        if (res.photos) {
          this.photoIds = res.photos.map(item => {
            return { photo: 'data:image/png;base64,' + item }
          })
        }
        if (res.fileInfo) {
          this.fileList = res.fileInfo.map((item, i) => {
            this.filesNum++
            return {
              name: item.fileName,
              fileId: item.fileId,
              filePath: item.filePath,
              uid: item.fileName + this.filesNum
            }
          })

          this.fileIds = this.fileList.map(item => {
            return {
              name: item.name,
              id: item.fileId,
              uid: item.uid
            }
          })
        }
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
        // this.$set(this.createData, 'deptId', null)
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
      that.fileIds = []
      that.subLaoding = true

      that.fileList.map(item => {
        let fd = new FormData()
        let file = item.file
        let flag = true
        that.fileIds.map(obj => {
          obj.uid == item.uid ? (flag = false) : ''
        })
        if (item.fileId) {
          flag = false
          that.fileIds.push({
            name: item.name,
            id: item.fileId,
            uid: item.uid
          })
        }
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
    },
    typeChange(val) {
      if (val) {
        getRiskTypeNum(this.prisonId + '/' + val[0]).then(res => {
          this.$set(this.createData, 'hiddenNum', res)
          console.log(res)
        })
      }
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
