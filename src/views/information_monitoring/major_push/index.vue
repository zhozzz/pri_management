<!--
 * @Description: 重要事情发布
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-30 10:36:37
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:20:06
 -->
<template>
  <menuTree :menuList="['信息监测','要情信息发布']">
    <!-- <dept-layout v-model="prisonId"
    :backData="true">-->
    <table-view noBottom v-loading="tableLoading" @sizeChange="getMajorInfo" :tableData="tableData">
      <template slot="searchCondition">
        <el-form ref="form" inline class="yn_form">
          <el-form-item label="起止日期">
            <el-date-picker
              v-model="bindData.time"
              type="daterange"
              class="yn_ipt"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="bindData.title" class="yn_ipt" placeholder="请输入标题" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="yn_btn" @click="query">查询</el-button>
            <el-button class="yn_btn" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="insertTitle">新增</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table-column">
        <!-- <el-table-column prop="orderId"
        label="编号" />-->
        <el-table-column prop="title" align="center" label="标题" />
        <!-- <el-table-column align="center" prop="createDate" label="创建时间">
          <template
            slot-scope="{row}"
          >{{formatDate(row.createDate=row.createDate.replace(new RegExp(/-/gm) ,"/"))}}</template>
        </el-table-column>-->
        <el-table-column align="center" prop="publicDate" label="发布时间">
          <template
            slot-scope="{row}"
          >{{formatDate(row.publicDate=row.publicDate.replace(new RegExp(/-/gm) ,"/"))}}</template>
        </el-table-column>
        <el-table-column align="center" prop="typeName" label="类型" />
        <el-table-column min-width="100" align="center" prop="sendUnitName" label="发出单位" />
        <el-table-column align="center" prop="sendUnitNum" label="接收单位/部门总数（个）">
          <!-- <template slot-scope="{row}">
            <el-button class="yn_text_btn" type="text" @click="titleDept(row)">{{row.sendUnitNum}}</el-button>
          </template>-->
        </el-table-column>
        <el-table-column align="center" prop="confirmNum" label="已确认个数" />
        <el-table-column align="center" width="200" label="操作">
          <template slot-scope="{row}">
            <div class="yn_btn_box_inTable">
              <el-button class="yn_text_btn" type="text" @click="titleDept(row)">预览</el-button>
              <el-button class="yn_text_btn" type="text" @click="detailTitle(row,false)">查看</el-button>
              <el-button class="yn_text_btn" type="text" v-if="row.confirmButton==='2'">已确认</el-button>
              <el-button
                class="yn_text_btn"
                type="text"
                v-if="row.confirmButton==='1'"
                @click="detailTitle(row,true)"
              >确认</el-button>
              <el-button
                v-if="row.attachments"
                class="yn_text_btn"
                type="text"
                @click="download(row.attachments)"
              >下载附件</el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <el-dialog
      center
      :title="isEdit?'编辑':'新增'"
      :visible.sync="dialogToggle"
      @close="closeTitleData"
      width="800px"
      class="yn_dialog"
    >
      <el-form class="yn_form" ref="form" :rules="rules" :model="titleData" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input class="yn_ipt" v-model="titleData.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <level v-model="titleData.level" />
          <!-- <el-input class="yn_ipt" type="text" placeholder="请输入" v-model="titleData.level"></el-input> -->
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <notice-type v-model="titleData.type" />
          <!-- <el-input class="yn_ipt" type="text" placeholder="请输入" v-model="titleData.type"></el-input> -->
        </el-form-item>
        <el-form-item label="附件" prop="attachments">
          <el-upload
            class="upload"
            ref="upload"
            action
            :file-list="titleData.attachments"
            :on-change="onChange"
            :auto-upload="false"
          >
            <el-button class="yn_btn" slot="trigger" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" class="el-form-item__content-quill" prop="content">
          <quill-editor v-model="titleData.contentTemp" id="quill" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="发布给" prop="receiveUnitList">
          <el-transfer
            v-model="titleData.receiveUnitList"
            :data="transferData"
            :props="{key:'key', label:'value'}"
            class="yn_transfer"
          ></el-transfer>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="closeTitleData">取 消</el-button>
        <el-button
          class="yn_btn"
          @click="$checkMessage(formSubmit)"
          type="primary"
        >{{isEdit?'保 存':'发 布'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="titleDetail.title"
      center
      :visible.sync="titleDetailToggle"
      @close="closeTitleDetail"
      width="50%"
      class="yn_dialog"
    >
      <div class="dialog_box">
        <div class="info" v-html="titleDetail.contentTemp"></div>
        <div class="info" style="text-align: right">{{titleDetail.createDate}}</div>
        <div>
          <el-button
            type="text"
            v-for="(item,index) in attachmentLists(titleDetail.attachments)"
            :key="index"
            @click="download(item)"
            class="yn_text_btn"
          >附件{{index+1}}</el-button>
        </div>
        <div v-if="titleDetail.confirmButton==='1'&&flag">
          <br />
          <el-input
            class="yn_ipt"
            type="text"
            placeholder="请输入确认内容"
            v-model="titleDetail.confirmContent"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" @click="closeTitleDetail">取 消</el-button>
        <el-button
          type="primary"
          class="yn_btn"
          v-if="titleDetail.confirmButton==='1'&&flag"
          @click="majorConfirm"
        >确认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="接收详情"
      center
      :visible.sync="titleDeptToggle"
      @close="closeTitleDept"
      width="800px"
      class="yn_dialog"
    >
      <!-- @close="closeTitleDept" -->
      <table-view noBottom noSearch @sizeChange="pageTitleDept" :tableData="tableDeptData">
        <template slot="table-column">
          <el-table-column align="center" prop="title" label="通知标题" />
          <el-table-column align="center" min-width="100" prop="receiveUnitName" label="单位/部门" />
          <el-table-column align="center" prop="confirmFlagName" label="是否确认" />
          <el-table-column align="center" show-overflow-tooltip prop="createDate" label="接收时间"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="confirmContent" label="确认内容" />
          <el-table-column align="center" show-overflow-tooltip prop="confirmDate" label="确认时间"></el-table-column>
        </template>
      </table-view>
      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" type="primary" @click="closeTitleDept">取 消</el-button>
      </span>
    </el-dialog>
    <!-- </dept-layout> -->
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import level from '@/components/level'
import noticeType from '@/components/notice_type'
import { pickerOptions } from '@/utils/picker_option_config.js'
import deptLayout from '@/components/deptLayout/index.vue'
import menuTree from '@/components/menu_tree/'

import {
  getMajorInfo,
  insertSelective,
  getDepartmentList,
  updateTitle,
  editNoticePublic,
  uploadFiles,
  majorDownload,
  getNoticePublicDetail,
  noticeConfirmInfo,
  majorAddList,
  noticeConfirmMessage
} from './service'
import { getUserId, getPrisonId } from '@/utils/index.js'
import formatDate from '@/utils/date.js'

export default {
  components: { tableView, level, noticeType, deptLayout, menuTree },
  data() {
    return {
      tableLoading: false,
      flag: false,
      orderId: '',
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      tableDeptData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      dialogToggle: false,
      bindData: { time: [] },
      queryData: {},
      titleData: {},
      editorOption: {
        // 富文本配置
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link']
          ]
        },
        theme: 'snow',
        placeholder: '富文本编辑框，支持文字、图片、公式等'
      },
      transferData: [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],

        level: [{ required: true, message: '请选择级别', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        contentTemp: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 3, message: '长度至少 6 个字符', trigger: 'blur' }
        ],
        receiveUnitList: [
          { required: true, message: '请选择接收部门', trigger: 'blur' }
        ]
      },
      isEdit: false,
      titleDetailToggle: false,
      titleDeptToggle: false,
      titleDetail: {}
    }
  },
  methods: {
    attachmentLists(val) {
      if (val) {
        return val.split()
      } else {
        return []
      }
    },
    closeTitleDetail() {
      this.titleDetail = {}
      this.titleDetailToggle = false
    },
    closeTitleDept() {
      this.titleDeptToggle = false
      this.orderId = ''
      this.tableDeptData = {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      }
    },
    formatDate(date) {
      if (date != null && date != '' && date != undefined) {
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm')
      }
    },

    majorConfirm() {
      this.$confirm(`标记确认?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let msgId = this.titleDetail.msgId
          noticeConfirmMessage({ msgId, receiveDeptId: getPrisonId() }).then(
            r => {
              noticeConfirmInfo({
                msgId,
                receiveUnitId: getPrisonId(),
                confirmUserId: getUserId(),
                confirmContent: this.titleDetail.confirmContent
              }).then(res => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '已确认'
                  })
                } else {
                  this.$message({
                    type: 'info',
                    message: '确认失败'
                  })
                }

                this.closeTitleDetail()
                this.getMajorInfo()
              })
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消确认'
          })
        })
    },
    query() {
      this.queryData = this.bindData
      let { title, time } = this.bindData
      let startDate = ''
      let endDate = ''
      if (time && time.length) {
        startDate = formatDate(time[0], 'yyyy-MM-dd')
        endDate = formatDate(time[1], 'yyyy-MM-dd')
      }
      this.queryData = { title, startDate, endDate }
      this.getMajorInfo()
    },

    reset() {
      this.queryData = {}
      this.bindData = {}
      this.tableData.pageNum = 1
      this.getMajorInfo()
    },
    insertTitle() {
      this.dialogToggle = true
      this.isEdit = false
    },
    getMajorInfo() {
      let { queryData } = this
      let { pageNum, pageSize } = this.tableData
      let formData = { ...queryData, pageNum, pageSize }
      this.tableLoading = true
      getMajorInfo(formData).then(
        res => {
          this.tableData = res
          this.tableLoading = false
        },
        err => {
          this.tableLoading = false
        }
      )
    },
    getDepartmentList() {
      getDepartmentList({ listType: 2 }).then(res => {
        this.transferData = res
      })
    },

    editTitle(titleData) {
      let orderId = titleData.orderId
      editNoticePublic({ orderId }).then(res => {
        this.titleData = res
      })
      this.dialogToggle = true
      this.isEdit = true
    },
    detailTitle({ msgId }, flag) {
      // this.titleDetail = row
      this.flag = flag
      getMajorInfo({ msgId, pageNum: 1, pageSize: 1 }).then(res => {
        this.titleDetail = res.list[0]
        this.titleDetailToggle = true
      })
    },
    pageTitleDept() {
      if (this.titleDeptToggle) {
        this.titleDept({ orderId: this.orderId })
      }
    },
    titleDept({ orderId }) {
      this.orderId = orderId
      this.titleDeptToggle = true
      let { pageNum, pageSize } = this.tableDeptData
      getNoticePublicDetail({ orderId, pageNum, pageSize }).then(res => {
        this.tableDeptData = res
      })
    },

    insertCheckValue() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.insertSelective()
          this.closeTitleData()
        } else {
          this.$message.error('请完整填写')
          return false
        }
      })
    },
    formSubmit() {
      this.isEdit ? this.updateCheckValue() : this.insertCheckValue()
    },
    updateCheckValue() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updateTitle()
          this.closeTitleData()
        } else {
          this.$message.error('请完整填写')

          return false
        }
      })
    },
    updateTitle() {
      let {
        orderId,
        receiveUnitList,
        title,
        level,
        type,
        contentTemp,
        // eslint-disable-next-line camelcase
        attachments
      } = this.titleData
      let titleData = {
        orderId,
        receiveUnitList,
        title,
        level,
        type,
        contentTemp,
        // eslint-disable-next-line camelcase
        attachments
      }
      updateTitle({
        ...titleData,
        updateUser: getUserId()
      }).then(res => {
        // this.closeTitleData();
        this.$message.success(res)
        this.getMajorInfo()
      })
    },
    insertSelective() {
      let { titleData } = this
      let fd = new FormData()

      let temp = titleData.attachments ? titleData.attachments : []
      for (let i = 0; i < temp.length; i++) {
        let file1 = temp[i]
        fd.append('files', file1.raw, file1.name)
      }
      let that = this

      majorAddList({
        sendUserid: getUserId(),
        deptIds: titleData.receiveUnitList,
        title: titleData.title,
        path: 'major_push'
      }).then(msgId => {
        uploadFiles(fd).then(function(temp) {
          // eslint-disable-next-line camelcase
          let attachments = temp.map(item => item.fileId)
          insertSelective({
            msgId,
            ...titleData,
            createUser: getUserId(),
            sendUnitId: getPrisonId(),
            path: 'major_push',
            attachments: attachments.join(',')
          }).then(res => {
            // that.closeTitleData();
            that.getMajorInfo()
            that.$message.success('添加成功')
          })
        })
      })
    },
    closeTitleData() {
      this.dialogToggle = false
      this.isEdit = false
      this.$refs.form.clearValidate()
      this.titleData = {}
    },
    onChange(file, fileList) {
      this.titleData.attachments = fileList
    },
    download(file) {
      //   majorDownload(file)
      let temp = file.split()
      temp.forEach(item => {
        majorDownload(item)
      })
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  mounted() {
    this.getMajorInfo()
    this.getDepartmentList()
  }
}
</script>
<style lang="less" scoped>
#quill .ql-formats,
.ql-toolbar {
  line-height: 1 !important;
}
/deep/.ql-editor {
  min-height: 15rem;
}
.technology {
  .dialog_box {
    color: #fff;
  }
}
.info {
  font-size: 1.1rem;
}
</style>
