<!--
 * @Description: In User Settings Edit
 * @Author: zhu
 * @Date: 2019-08-27 10:09:42
 * @LastEditTime: 2020-03-25 17:29:18
 * @LastEditors: zhuhao
 -->

<template>
  <!-- <dept-layout @input="nodeClick" v-model="prisonId" :backData="true"> -->
  <menuTree :menuList="['监狱管理','指挥中心','受理来文来电管理']">
    <tab slot="heade_btn" name="来电来文管理" :right="true" pathName="message_statisic" />
    <table-view :tableData="tableData" noBottom v-loading="loading" @sizeChange="queryList">
      <div slot="searchCondition">
        <el-form inline class="yn_form">
          <!-- <el-form-item label="来电来文部门：">
            <el-cascader
              class="yn_cascader yn_ipt"
              :show-all-levels="false"
              filterable
              v-model="params.deptId"
              :options="allDeptData"
              :props="allDeptProp"
              size="medium"
              popper-class="dowm_box"
            ></el-cascader>
          </el-form-item>-->
          <el-form-item label="类型：">
            <el-select class="yn_ipt" v-model="params.noticeType">
              <el-option
                v-for="(item,i) in typeList"
                :key="i"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="来文/来电时间:">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="date"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
              align="right"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="处理状态：">
            <el-select class="yn_ipt" v-model="params.handleStatus">
              <el-option
                v-for="(item,i) in statusList"
                :key="i"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="类别" prop="sourceType">
            <el-select class="yn_ipt" v-model="params.sourceType">
              <el-option
                v-for="(item,i) in classList"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="来文/来电人">
            <el-input class="yn_ipt" maxlength="10" v-model="params.noticeName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="yn_btn"
              type="primary"
              @click="()=>{tableData.pageNum=1;tableData.pageSize=10;queryList()}"
            >查询</el-button>
            <el-button class="yn_btn" type="primary" @click="clearParams">重置</el-button>
            <el-button class="yn_btn" @click="callerVisible = true" type="primary">新增登记</el-button>
            <!--<el-button class="yn_btn" size="small" type="primary">批量删除</el-button>-->
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column prop="sourceTypeValue" label="类别" align="center"></el-table-column>

        <el-table-column
          prop="noticeTime"
          min-width="100"
          label="发件时间"
          :formatter="formatDate"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="noticeType" label="类型" :formatter="formatType" align="center"></el-table-column>

        <!-- <el-table-column prop="fileName" label="附件名" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span @click="download(scope.row)">{{scope.row.fileName}}</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="noticeSource" label="记录来源" :formatter="formatSource" align="center"></el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="deptName"
          label="来电/来文部门"
          min-width="110"
          align="center"
        ></el-table-column>
        <el-table-column prop="noticeName" label="来电/来文人" min-width="100" align="center"></el-table-column>
        <el-table-column prop="userName" label="受理人" align="center">
          <template slot-scope="{row}">
            <span>{{row.userName?row.userName:'暂未处理'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handleStatus" label="处理状态" :formatter="formatStatus" align="center"></el-table-column>
        <!-- <el-table-column prop="forwardDeptName" label="转发部门" align="center"></el-table-column> -->
        <el-table-column prop="forwardState" label="转发状态" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              :open-delay="200"
              trigger="hover"
              @show="seeForword(scope.row)"
            >
              <div class="tip" v-for="(item,i) in forDeptList" :key="i">
                <span>{{item}}</span>
              </div>
              <div v-if="scope.row.forwardState==1" class="forWardBtn" slot="reference">已转发</div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <div class="yn_btn_box_inTable">
              <el-button @click="detail(scope.row)" class="yn_text_btn" type="text">查看</el-button>
              <el-button type="text" class="yn_text_btn" @click="openForward(scope.row)">转发</el-button>
              <el-button
                type="text"
                class="yn_text_btn yn_long_btn"
                @click="changeHandle(scope.row)"
                v-if="scope.row.handleStatus==1"
              >标记已处理</el-button>
              <el-button
                type="text"
                v-if="scope.row.fileName"
                class="yn_text_btn"
                @click="download(scope.row)"
              >附件下载</el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <!-- 新增 -->
    <el-dialog
      :title="addForm.noticeType==1?'来文登记':'来电登记'"
      class="yn_dialog"
      center
      :visible.sync="callerVisible"
      width="50%"
      @close="closeAddDialog"
    >
      <el-form :model="addForm" class="yn_form" label-width="10rem" ref="addform" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="来电/来文类型" prop="noticeType">
              <el-select class="yn_ipt" v-model="addForm.noticeType">
                <el-option
                  v-for="(item,i) in typeList"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别" prop="sourceType">
              <el-select class="yn_ipt" v-model="addForm.sourceType">
                <el-option
                  v-for="(item,i) in classList"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="addForm.sourceType==leaderCode"
              :label="addForm.noticeType==1?'来文部门':'来电部门'"
              prop="deptId"
            >
              <el-cascader
                class="yn_ipt yn_cascader"
                :show-all-levels="false"
                filterable
                v-model="addForm.deptId"
                :options="allDeptData"
                :props="allDeptProp"
                @change="addChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item v-else :label="addForm.noticeType==1?'来文部门':'来电部门'" prop="outsideName">
              <el-input
                class="yn_ipt"
                :disabled="!addForm.sourceType"
                v-model="addForm.outsideName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="addForm.noticeType==1?'来文人':'来电人'" prop="noticeName">
              <el-input class="yn_ipt" v-model="addForm.noticeName" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="addForm.noticeType==1" :span="12">
            <el-form-item label="来文文号" prop>
              <el-input class="yn_ipt" v-model="addForm.noticeFileNo" placeholder="来文文号"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="addForm.noticeType==1" :span="12">
            <el-form-item label="文件名" prop>
              <el-input class="yn_ipt" v-model="addForm.noticeFileName" placeholder="文件名"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="addForm.noticeType==2" :span="12">
            <el-form-item label="来电人证件" prop="noticeIdCard">
              <el-input class="yn_ipt" v-model="addForm.noticeIdCard" placeholder="来电人证件"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="addForm.noticeType==2" :span="12">
            <el-form-item label="来电号码" prop="noticeTel">
              <el-input class="yn_ipt" v-model="addForm.noticeTel" placeholder="来电号码"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="addForm.noticeType==2" :span="12">
            <el-form-item label="来电人部门" prop>
              <el-input class="yn_ipt" v-model="addForm.noticeName" placeholder="来电人部门"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="时间" prop="noticeTime">
              <el-date-picker
                v-model="addForm.noticeTime"
                value-format="timestamp"
                class="yn_ipt yn_date_picker"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!--
          <el-col :span="22" :offset="1">
            <el-form-item label="正文" prop="noticeContent">
              <quill-editor v-model="addForm.noticeContent" id="quill" :options="editorOption"></quill-editor>
            </el-form-item>
          </el-col>-->
          <el-col :span="22">
            <el-form-item label="备注" prop="remarks">
              <el-input
                type="textarea"
                class="yn_ipt"
                placeholder="请输入内容"
                v-model="addForm.remarks"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="附件">
              <el-upload
                class="upload-demo"
                :action="_global.businessUrl+'/file/upload'"
                :multiple="false"
                :limit="1"
                :on-success="upsuccess"
                :on-remove="removeFile"
                :before-upload="beforeUp"
                :file-list="fileList"
              >
                <el-button class="yn_btn" type="primary">添加</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button
          class="yn_btn"
          :disabled="upLoading"
          v-loading="upLoading"
          @click="$checkMessage(addNotice)"
          type="primary"
        >保存</el-button>
        <el-button class="yn_btn" @click="callerVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog
      :title="detailRow.noticeType==1?'来文查看':'来电查看'"
      class="yn_dialog"
      center
      :visible.sync="detailVisible"
      @close="closeDialog"
      width="50%"
    >
      <el-form ref="form" class="yn_form" label-width="10rem">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item :label="detailRow.noticeType==1?'来文人：':'来电人：'">
              <div class="yn_page_title">{{detailRow.noticeName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="detailRow.noticeType==1?'来文部门：':'来电部门：'">
              <div class="yn_page_title">{{detailRow.deptName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="detailRow.noticeType==1?'来文时间：':'来电时间：'">
              <div class="yn_page_title">{{formatDate(detailRow,detailRow,detailRow.noticeTime) }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
              <div class="yn_page_title">{{detailRow.fileName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:">
              <div class="yn_page_title">{{detailRow.remarks}}</div>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="正文:">
          <div class="noticeContent" v-html="detailRow.noticeContent"></div>
          </el-form-item>-->
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" @click="detailVisible=false" type="primary">确定</el-button>
      </div>
    </el-dialog>

    <!-- 转发 -->
    <el-dialog
      :title="forwardParms.noticeType==1?'来文转发':'来电转发'"
      class="yn_dialog"
      center
      @close="closeDialog"
      :visible.sync="forwardVisible"
      width="50%"
    >
      <el-form ref="form" class="yn_form" label-width="10rem">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="转发部门：">
              <el-cascader
                class="yn_cascader yn_ipt"
                :show-all-levels="false"
                filterable
                v-model="forwardParms.forwardId"
                :options="forwardList"
                :props="forWardProp"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="forwardForm.noticeType==1?'来文人：':'来电人：'">
              <div class="yn_page_title">{{forwardForm.noticeName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="forwardForm.noticeType==1?'来文部门：':'来电部门：'">
              <div class="yn_page_title">{{forwardForm.deptName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="forwardForm.noticeType==1?'来文时间：':'来电时间：'">
              <div
                class="yn_page_title"
              >{{formatDate(forwardForm,forwardForm,forwardForm.noticeTime)}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
              <div class="yn_page_title">{{forwardForm.fileName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:">
              <div class="yn_page_title">{{forwardForm.remarks}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button class="yn_btn" @click="$checkMessage(forwardNotice)" type="primary">保存</el-button>
        <el-button class="yn_btn" @click="forwardVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- </dept-layout> -->
  </menuTree>
</template>
<script>
import { MessageBox, Message, Loading } from 'element-ui'
import { expnoraml, Isname } from '@/utils/form_valid.js'
import { pickerOptions } from '@/utils/picker_option_config.js'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId, clearChildren } from '@/utils'
import tab from '@/components/tab/index.vue'
import tableView from '@/components/table_view/'
import { downloadFile } from '@/utils/downloadFile.js'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    deptLayout,
    tab,
    tableView,
    menuTree
  },
  data() {
    return {
      loading: true,
      upLoading: false,
      params: {
        // 查询参数
        startTime: '',
        endTime: '',
        deptId: '',
        noticeName: '',
        handleStatus: '',
        noticeType: '',
        currentPage: 1,
        pageSize: 10
      },
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      prisonId: '',
      deptGuid: '',
      forDeptList: [],
      rowid: '',
      fileList: [],
      forwardVisible: false,
      forwardList: [], // 可转发部门
      forwardForm: {}, // 转发正文
      forwardParms: {}, // 转发参数

      date: [], // 时间

      callerVisible: false, // 来电来文登记模态框

      addForm: { noticeType: 1, noticeTime: new Date().getTime() }, // 新增登记

      detailVisible: false, // 来电来文详情模态框
      detailRow: {}, // 查看详情

      statusList: [
        // 状态
        { name: '未处理', value: 1 },
        { name: '已处理', value: 2 }
      ],

      typeList: [
        // 类型
        { name: '来文', value: 1 },
        { name: '来电', value: 2 }
      ],

      allDeptData: [], // 全部部门
      allDeptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true
      },
      // 转发部门选择器配置
      forWardProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true,
        multiple: true
      },

      rules: {
        // noticeName: [
        //   { required: true, message: '请输入', trigger: 'blur' },
        //   { validator: Isname, trigger: 'blur' },
        //   { min: 2, max: 15, message: '长度在 2到 15 个字符', trigger: 'blur' }
        // ],
        deptId: [{ required: true, message: '请输入', trigger: 'blur' }],
        outsideName: [{ required: true, message: '请选择', trigger: 'blur' }],
        // noticeTel: [
        //   { required: true, message: '请输入来电号码', trigger: 'blur' }
        // ],
        // noticeIdCard: [
        //   { required: true, message: '请输入来电人证件号', trigger: 'blur' }
        // ],

        noticeTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        noticeContent: [
          { required: true, message: '请输入正文', trigger: 'blur' },
          {
            min: 2,
            max: 300,
            message: '长度在 2到 300 个字符',
            trigger: 'blur'
          }
        ]
      },
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
      classList: [],
      leaderCode: ''
    }
  },
  created() {
    if (this.$route.params) {
      this.params = Object.assign(this.params, this.$route.params)
    }
    this.deptGuid = JSON.parse(localStorage.getItem('user')).deptGuid
    this.getAllDept()
    this.queryList()
    this.getForwardDept()
    this.getClassList()
  },
  methods: {
    topage() {
      this.$router.push({ name: 'message_statisic' })
    },
    download(row) {
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      setTimeout(() => {
        loadingInstance.close()
      }, 3000)
      downloadFile(row.fileId)

      //   location.href = this._global.businessUrl + '/file/download/' + row.fileId
    },
    upsuccess(res) {
      this.$message.success('上传成功')

      this.addForm.fileId = res.data.fileId
      this.upLoading = false
    },
    removeFile(file, fileList) {
      this.addForm.fileId = ''
      this.axios
        .delete(
          this._global.businessUrl + '/file/delete/' + file.response.data.fileId
        )
        .then(res => {
          this.$message.success(res)
        })
    },
    beforeUp(res) {
      console.log(this.fileList)
      this.upLoading = true
    },
    clearParams() {
      this.params = { currentPage: 1, pageSize: 10 }
      this.tableData.pageNum = 1
      this.tableData.pageSize = 10
      this.date = []
      this.queryList()
    },
    detail(val) {
      this.detailVisible = true
      this.detailRow = val
    },
    // 转发
    openForward(val) {
      this.forwardVisible = true
      this.forwardParms.noticeId = val.noticeId
      this.forwardForm = JSON.parse(JSON.stringify(val))
    },
    // 标记
    changeHandle(val) {
      let params = {
        noticeId: val.noticeId,
        handleStatus: 2
      }
      params.assigneeId = JSON.parse(localStorage.getItem('user')).userGuid
      this.axios
        .put(this._global.businessUrl + '/notice/update', params)
        .then(data => {
          this.$message.success('已处理')
          this.queryList()
        })
    },

    // 根据登录用户所在监狱id获取可转发部门
    getForwardDept() {
      let that = this
      let user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        if (user.prisonId == 1) {
          this.axios
            .get(this._global.userUrl + '/compose/getBuMenById/1')
            .then(response => {
              clearChildren(response, 'list')
              that.forwardList = response.list
              //   that.forwardList.forEach(item => {
              //     item.id == user.deptGuid ? (item.disabled = true) : "";
              //   });
              that.selectArr(that.forwardList)
            })
        } else {
          this.axios
            .get(
              this._global.userUrl + '/compose/getChildrenTree/' + user.prisonId
            )
            .then(response => {
              that.forwardList = [response]
              //   that.forwardList.forEach(item => {
              //     item.id == user.deptGuid ? (item.disabled = true) : "";
              //   });
              that.selectArr(that.forwardList)
            })
        }
      } else {
        Message.error({ message: '未登录' })

        return false
      }
    },
    selectArr(arr) {
      let user = JSON.parse(localStorage.getItem('user'))

      arr.forEach(item => {
        item.id == user.deptGuid ? (item.disabled = true) : ''
        if (item.list) {
          this.selectArr(item.list)
        }
      })
    },
    // 获取全部部门
    getAllDept() {
      this.axios
        .get(this._global.userUrl + '/compose/getChildrenTree/1')
        .then(response => {
          //   response.forEach(item => {
          //     item.id == userDeptId ? (item.disabled = true) : "";
          //   });
          clearChildren(response, 'list')
          this.allDeptData = [response]
          this.selectDept(this.allDeptData)
        })
    },
    selectDept(val) {
      let userDeptId = JSON.parse(localStorage.getItem('user')).deptGuid
      val.forEach(item => {
        if (item.list) {
          this.selectDept(item.list)
        }
        item.id == userDeptId ? (item.disabled = true) : ''
      })
    },
    addChange(value) {
      if (value) {
        this.addForm.deptId = value[value.length - 1]
      }
    },
    closeDialog() {
      this.forwardForm = {}
      this.forwardParms = {}
      this.detailRow = {}
    },
    closeAddDialog() {
      this.addForm = { noticeType: 1, noticeTime: new Date().getTime() }

      this.fileList = []
      this.$refs['addform'].clearValidate()
    },
    forwardNotice() {
      let deplist = this.forwardParms.forwardId

      this.forwardParms.forwardId = []
      if (deplist.length == 0) {
        Message.error({ message: '请选择转发部门' })

        return false
      } else {
        deplist.forEach(item => {
          this.forwardParms.forwardId.push(item[item.length - 1])
        })
        this.forwardParms.userDeptId = JSON.parse(
          localStorage.getItem('user')
        ).deptGuid
        this.forwardParms.assigneeId = JSON.parse(
          localStorage.getItem('user')
        ).userGuid
        this.forwardParms.prisonId = JSON.parse(
          localStorage.getItem('user')
        ).prisonId
        this.axios
          .post(this._global.businessUrl + '/notice/forward', this.forwardParms)
          .then(data => {
            this.$message.success('转发成功')
            this.forwardVisible = false
            this.queryList()
          })
      }
    },
    addNotice() {
      console.log(this.addForm)

      this.$refs['addform'].validate(valid => {
        if (valid) {
          if (
            this.addForm.noticeIdCard ||
            this.addForm.noticeTel ||
            this.addForm.noticeFileNo ||
            this.addForm.noticeName
          ) {
            this.addForm.userDeptId = JSON.parse(
              localStorage.getItem('user')
            ).deptGuid
            this.addForm.prisonId = JSON.parse(
              localStorage.getItem('user')
            ).prisonId
            this.axios
              .post(this._global.businessUrl + '/notice/insert', this.addForm)
              .then(data => {
                this.$message.success('新增成功')
                this.callerVisible = false
                this.queryList()
              })
          } else {
            Message.error({ message: '请完整填写' })

            return false
          }
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    queryList() {
      this.loading = true
      var special = new RegExp(
        // eslint-disable-next-line no-useless-escape
        /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/
      )
      var blank = new RegExp(/^\S*$/)
      if (special.test(this.params.noticeName)) {
        Message.error({ message: '不能包含特殊字符，请重新输入' })
        this.params.noticeName = ''
      } else if (!blank.test(this.params.noticeName)) {
        Message.error({ message: '不能包含空格,请重新输入' })
        this.params.noticeName = ''
      } else {
        if (typeof this.params.deptId === 'object') {
          this.params.deptId = this.params.deptId[this.params.deptId.length - 1]
        }
        this.params.userDeptId = this.deptGuid
        this.params.currentPage = this.tableData.pageNum
        this.params.pageSize = this.tableData.pageSize

        this.axios
          .post(this._global.businessUrl + '/notice/list', this.params)
          .then(data => {
            this.tableData.list = data.rows
            this.tableData.total = data.total

            this.loading = false
          })
      }
    },
    timeChange(data) {
      if (data != null) {
        this.params.startTime = Date.parse(data[0])
        this.params.endTime = Date.parse(data[1]) + 24 * 60 * 60 * 1000
      } else {
        this.params.startTime = ''
        this.params.endTime = ''
      }
    },
    seeForword(row) {
      this.axios
        .get(
          this._global.businessUrl +
            '/notice/getForwardDeptName/' +
            row.noticeId
        )
        .then(data => {
          this.forDeptList = data
          this.rowid = row.noticeId
        })
    },
    leave() {
      this.forDeptList = ''
      this.rowid = ''
    },
    // 格式化时间
    formatDate(row, column, cellValue, index) {
      if (cellValue != null) {
        let date = new Date(cellValue)
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
        // return y + '-' + MM + '-' + d ;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
    },
    // 格式化是否可见列
    formatStatus(row, column, cellValue, index) {
      if (cellValue == 2) {
        return '已处理'
      }
      return '未处理'
    },
    formatType(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '来文'
      }
      return '来电'
    },
    formatSource(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '系统自动'
      } else if (cellValue == 2) {
        return '手动记录'
      } else {
        return '来自转发'
      }
    },

    formatForward(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '已转发'
      }
      return ''
    },

    nodeClick(val) {
      this.prisonId = val.id
      this.deptGuid = this.prisonId
    },
    getClassList() {
      this.classList = []
      this.axios
        .get(this._global.userUrl + '/dictionary/option/sourceType')
        .then(data => {
          this.classList = data
          data.map(item => {
            if (item.label == '上级领导') {
              this.leaderCode = item.value
            }
          })
        })
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  },
  watch: {
    prisonId(val) {
      this.queryList()
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100%;
}
.yn_date_picker {
  width: 100% !important;
}
.tip {
  width: 100%;
  margin: 1rem 0;
}
.forWardBtn {
  cursor: pointer;
  &:hover {
    color: #e6a23c;
  }
}
.noticeContent {
  color: #333;
}
/deep/.el-cascader__tags {
  input {
    display: none;
  }
}
#quill .ql-formats,
.ql-toolbar {
  line-height: 1 !important;
}
/deep/.ql-editor {
  min-height: 15rem;
}
.technology {
  .noticeContent {
    color: #fff;
  }
}
</style>
