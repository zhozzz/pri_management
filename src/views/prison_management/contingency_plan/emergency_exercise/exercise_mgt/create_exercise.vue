<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-02-17 15:33:39
 -->

<template slot-scope="scope">
  <!-- 应急小组新增/编辑 -->
  <div class="yn_page">
    <menuTree :menuList="['监狱管理','监狱动态','新增应急演练']" />

    <el-form ref="form" label-width="10rem" class="yn_form" :rules="rules" :model="formData">
      <el-row class="item_box">
        <el-col :span="10">
          <el-form-item prop="initiatorName" label="组织单位：">
            <el-input class="yn_ipt" v-model="formData.initiatorName" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item prop="participation" label="参与人数：">
            <el-input-number class="yn_ipt" :controls="false" v-model="formData.participation"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="item_box">
        <el-col :span="10">
          <el-form-item prop="taskName" label="开展时间：">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="date"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item prop="effect" label="开展效果：">
            <el-select v-model="formData.effect" class="select_box yn_ipt" placeholder="请选择">
              <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="item_box">
        <el-col :span="10">
          <el-form-item prop="eventType" label="事件类型：">
            <el-select
              :disabled="isFinish"
              v-model="formData.eventType"
              class="select_box yn_ipt"
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeList"
                :key="item.subclassGuid"
                :label="item.value"
                :value="item.subclassGuid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="参与部门：">
            <el-button class="yn_btn" type="primary" @click="addDepartVisble=true">点击添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="item_box">
        <el-col :span="16">
          <el-form-item prop="drillName" label="演练名称：">
            <el-input
              :disabled="isFinish"
              class="yn_ipt"
              v-model="formData.drillName"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="item_box">
        <el-col :span="16">
          <el-form-item prop="detail" label="演练内容：">
            <el-input class="yn_ipt" v-model="formData.detail" placeholder="请输入内容" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="item_box">
        <el-col :span="16">
          <el-form-item prop="summary" label="演练总结：">
            <el-input class="yn_ipt" type="textarea" v-model="formData.summary" placeholder="请输入总结"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="item_box">
        <el-col :span="16">
          <el-form-item label="相关文件：">
            <el-upload
              class="upload-demo"
              :action="_global.businessUrl+'/file/upload'"
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
      <div class="item_box">
        <div class="btn_box">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(createExercise)">提交</el-button>
          <el-button class="yn_btn" @click="gopage">返回</el-button>
        </div>
      </div>
    </el-form>

    <el-dialog class="yn_dialog" :visible.sync="addDepartVisble" center title="选择部门" @close="close">
      <div class="title">本监狱单位</div>

      <el-select v-model="localDeparts" multiple class="select_box yn_ipt" placeholder="请选择">
        <el-option v-for="item in areaList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
      </el-select>

      <div class="title">外部单位</div>
      <el-row class="dept_items" v-for="(obj,i) in  outerDepartsList" :key="i">
        <el-col :span="1">{{i+1}}</el-col>
        <el-col :span="16">
          <el-input class="yn_ipt" v-model="obj.name" placeholder="请输入"></el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="danger" class="yn_btn" @click="delOuter(i)">删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="10">
          <el-button type="primary" class="yn_btn" @click="addOuter">添加外部单位</el-button>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" class="yn_btn" @click="saveDept">确定</el-button>
        <el-button class="yn_btn" @click="addDepartVisble=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableView from '@/components/table_view/'
import { getPrisonId, getDeptId } from '@/utils'
import {
  getEventType,
  getTeamData,
  getOfficersUnderPrison,
  createExercise,
  editExercise
} from './service.js'
import tab from '@/components/tab/index.vue'
import { pickerOptions } from '@/utils/picker_option_config.js'
import { Loading } from 'element-ui'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tableView, tab, menuTree },

  data() {
    return {
      isEdit: false, // 是否是编辑
      isFinish: false, // 是否是完成演练任务
      prisonId: getPrisonId(),
      deptId: getDeptId(),
      addDepartVisble: false,
      typeList: [],
      formData: {},
      areaList: [],
      outerDepartsList: [],
      localDeparts: [],
      date: [],
      fileIds: [],
      levelList: [
        { name: '不满足预期', value: 0 },
        { name: '基本满足预期', value: 1 },
        { name: '满足预期', value: 2 }
      ],
      rules: {
        initiatorName: [
          { required: true, message: '请输入组织单位名称', trigger: 'blur' }
        ],
        drillName: [
          { required: true, message: '请输入演练名称', trigger: 'blur' }
        ],
        eventType: [
          { required: true, message: '请选择事件类型', trigger: 'change' }
        ],
        participation: [
          { required: true, message: '请输入参与人数', trigger: 'blur' }
        ],
        effect: [
          { required: true, message: '请选择开展效果', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请输入演练详情', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入演练总结', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getEventType()
    this.getOfficersUnderPrison()
    this.formData.taskType = 1
    console.log(this.$route.params)

    if (this.$route.params.type == 1) {
      this.finishRelease()
    } else if (this.$route.params.type == 2) {
      this.editRelease()
    }
    this.formData.fileIds = []
  },
  methods: {
    finishRelease() {
      this.formData = JSON.parse(JSON.stringify(this.$route.params.data))
      this.formData.taskType = 0
      this.formData.drillName = this.formData.taskName
      this.formData.taskId = this.formData.id
      this.isFinish = true
      delete this.formData['id']
      delete this.formData['taskName']
      console.log(this.formData)
    },
    editRelease() {
      this.formData = JSON.parse(JSON.stringify(this.$route.params.data))
      this.date = [this.formData.startTime, this.formData.endTime]

      this.formData.outerDeparts.forEach(item => {
        this.outerDepartsList.push({ name: item })
      })
      this.localDeparts = this.formData.localDeparts
      this.formData.fileIds = []
      this.formData.files.forEach(item => {
        this.fileIds.push({
          name: item.fileName,
          id: item.id
        })
      })

      this.isFinish = true
      this.isEdit = true
      console.log(this.formData)
    },
    // 时间参数
    timeChange(data) {
      if (data.length > 0) {
        this.formData.startTime = data[0]
        this.formData.endTime = data[1]
      } else {
        this.formData.startTime = ''
        this.formData.endTime = ''
      }
    },
    getEventType() {
      getEventType().then(res => {
        this.typeList = res
      })
    },
    getOfficersUnderPrison() {
      getOfficersUnderPrison(this.prisonId).then(res => {
        this.areaList = res
      })
    },

    createExercise() {
      this.formData.prisonId = this.prisonId
      this.formData.deptId = this.deptId

      this.fileIds.forEach(item => {
        this.formData.fileIds.push(item.id)
      })
      if (this.date.length == 0) {
        this.$message.warning({ message: '请选择时间' })
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.isEdit) {
              editExercise(this.formData).then(res => {
                this.$message.success({ message: res })
                this.$router.push({ name: 'exercise_mgt' })
              })
            } else {
              this.formData.deptId = this.deptId

              createExercise(this.formData).then(res => {
                this.$message.success({ message: res })
                this.$router.push({ name: 'exercise_mgt' })
              })
            }
          } else {
            this.$message.error({ message: '请完整填写' })

            return false
          }
        })
      }
    },
    addOuter() {
      this.outerDepartsList.push({})
    },
    delOuter(i) {
      this.outerDepartsList.splice(i, 1)
    },
    close() {
      this.outerDepartsList = []
      if (this.formData.outerDeparts) {
        this.formData.outerDeparts.forEach(item => {
          this.outerDepartsList.push({ name: item })
        })
      }
      this.localDeparts = this.formData.localDeparts
    },
    saveDept() {
      this.formData.outerDeparts = []
      this.outerDepartsList.forEach(item => {
        this.formData.outerDeparts.push(item.name)
      })
      this.formData.localDeparts = this.localDeparts
      this.addDepartVisble = false
    },
    gopage() {
      this.$router.push({ name: 'exercise_mgt' })
    },
    upsuccess(res, file, fileList) {
      Loading.service().close()
      this.$message.success('上传成功')

      this.fileIds.push({
        id: res.data.fileId,
        uid: file.uid,
        name: file.name
      })
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
      this.fileIds = fileList
      console.log(file)
      console.log(fileList)

      this.axios
        .delete(this._global.businessUrl + '/file/delete/' + file.id)
        .then(res => {
          console.log(res)
          this.$message.success(res)
        })
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  }
}
</script>
<style scoped lang='less'>
.yn_date_picker {
  width: 100%;
}
/deep/.el-select {
  width: 100%;
}
.title {
  width: 100%;
  font-size: 1.4rem;
  font-weight: 600;
  padding: 2rem 0;
  box-sizing: border-box;
}
.dept_items {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}
.btn_box {
  text-align: center;
  margin-top: 4rem;
}
.technology {
  .title,
  .dept_items {
    color: #fff;
  }
}
</style>
