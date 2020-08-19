<!--
 * @Description: In User Settings Edit
 * @Author: zhu
 * @Date: 2019-08-27 10:09:42
 * @LastEditTime: 2020-03-31 11:42:37
 * @LastEditors: zhuhao
 -->

<template>
  <menuTree :menuList="['工作辅助','文件下发与报送']">
    <div slot="heade_btn" class="yn_page_btn">
      <div class="dis_btn" @click="tostatisic">文件统计</div>
      <div class="dis_btn" @click="tosend">收文记录</div>
      <div class="link_btn">发文记录</div>
      <div class="dis_btn" @click="topage" v-if="userPrisonId==1">文件管理</div>
      <el-button class="yn_btn time_btn" @click="openSend" type="primary">文件发送</el-button>
    </div>
    <sendfile :sendVisible="sendFlag" @submit="getData" :closeSend="closeSend"></sendfile>

    <table-view
      :tableData="tableData"
      noBottom
      noIndex
      @sizeChange="sizeChange"
      @selectionchange="selectionchange"
      v-loading="loading"
    >
      <div slot="searchCondition">
        <el-form ref="searchForm" :model="params" class="yn_form" inline>
          <el-form-item label="收发时间:" prop="criminalName">
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

          <el-form-item label="是否需要反馈:" prop="isFeedback" v-if="prisonId==1">
            <el-select class="yn_ipt" v-model="params.isFeedback">
              <el-option
                v-for="(item,i) in statusList"
                :key="i"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="对方部门：">
            <el-cascader
              :show-all-levels="false"
              class="yn_cascader yn_ipt"
              filterable
              v-model="params.deptId"
              :options="allDeptData"
              :props="allDeptProp"
              ref="cascad"
              popper-class="dowm_box"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="getData" type="primary">查询</el-button>
            <el-button class="yn_btn" @click="rest" type="primary">重置</el-button>
            <el-button
              class="yn_btn"
              :disabled="listStr==''"
              @click="downloadAllByTable"
              type="primary"
            >批量下载</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>

        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="sendTime"
          :formatter="formTime"
          label="发送时间"
        />
        <!-- <el-table-column align="center" prop="zfNum" label="当前状态" /> -->
        <el-table-column
          align="center"
          prop="deptName"
          show-overflow-tooltip
          :label="params.dispatchType==1?'发文单位':'收文单位'"
        />
        <el-table-column
          align="center"
          prop="isFeedback"
          v-if="params.dispatchType==2&&prisonId==1"
          :formatter="formBack"
          label="需要何种反馈"
        />
        <el-table-column
          align="center"
          prop="isFeedback"
          v-if="params.dispatchType==1&&prisonId!=1"
          :formatter="formBack"
          label="需要何种反馈"
        />
        <el-table-column
          align="center"
          prop="fbRemainNum"
          v-if="params.dispatchType==2&&prisonId==1"
          label="待反馈次数"
        />
        <el-table-column
          align="center"
          prop="fbRemainNum"
          v-if="params.dispatchType==1&&prisonId!=1"
          label="待反馈次数"
        />
        <el-table-column align="center" prop="remark" label="备注" />

        <el-table-column align="center" prop="prop" label="操作">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="click">
              <el-table :data="fileList" @selection-change="selChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column
                  width="200"
                  property="fileName"
                  show-overflow-tooltip
                  label="文件名"
                  align="center"
                ></el-table-column>
                <el-table-column
                  width="100"
                  property="fileSize"
                  :formatter="formSize"
                  label="大小(KB)"
                  align="center"
                ></el-table-column>
                <el-table-column
                  width="100"
                  property="fileSuffix"
                  :formatter="formType"
                  label="文件类型"
                  align="center"
                ></el-table-column>

                <el-table-column width="100" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button class="yn_text_btn" type="text" @click="download(scope.row)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button
                :style="{'margin':'2rem 0 1rem 45% '}"
                class="yn_btn"
                type="primary"
                @click="downloadAll"
              >批量下载</el-button>

              <el-button
                slot="reference"
                class="yn_text_btn"
                @click="getFileList(scope.row)"
                type="text"
              >下载文件</el-button>
            </el-popover>
            <el-button
              class="yn_text_btn"
              type="text"
              v-if="params.dispatchType==1&&scope.row.isFeedback=='Y'"
              @click="back(scope.row)"
            >反馈</el-button>

            <el-button
              class="yn_text_btn"
              type="text"
              v-if="params.dispatchType==2&&scope.row.isFeedback=='Y'"
              @click="lookBack(scope.row)"
            >查看反馈</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>
    <!-- 查看反馈 -->
    <el-dialog title="反馈详情" center class="yn_dialog" :visible.sync="backFlag" width="60%">
      <el-table :data="backList" class="yn_table">
        <el-table-column
          show-overflow-tooltip
          property="fbExpTime"
          :formatter="formTime"
          label="规定反馈时间"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="fbAcuTime"
          :formatter="formTime"
          align="center"
          label="实际反馈时间"
        ></el-table-column>
        <el-table-column property="fbStatus" label="反馈状态" :formatter="formTYPE" align="center"></el-table-column>
        <el-table-column property="fbUserName" label="反馈人" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip property="fbContent" label="反馈内容"></el-table-column>
        <el-table-column label="操作" v-if="params.dispatchType==1">
          <template slot-scope="scope">
            <el-button
              class="yn_text_btn"
              type="text"
              v-if="scope.row.fbStatus==1"
              @click="openBack(scope.row)"
            >进行反馈</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span class="dialog_footer" slot="footer"></span>
    </el-dialog>

    <!-- 进行反馈 -->
    <el-dialog
      title="信息反馈"
      class="yn_dialog"
      center
      :visible.sync="writeBackFlag"
      @close="closeDialog"
      width="60%"
    >
      <el-row>
        <el-col :span="4" class="span_title">收文备注信息:</el-col>
        <el-col :span="14" class="title">{{detailRow.remark}}</el-col>
      </el-row>
      <el-row class="txt_box">
        <el-col :span="4" class="span_title">本次反馈信息:</el-col>
        <el-col :span="14">
          <el-input
            class="yn_ipt"
            type="textarea"
            placeholder="请输入内容"
            v-model="detailRow.fbContent"
          ></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="8">
          <el-button class="yn_btn sub_btn" type="primary" @click="submitBack">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </menuTree>
</template>
<script>
import { MessageBox, Message, Loading } from 'element-ui'
import { expnoraml, Isname } from '@/utils/form_valid.js'
import { pickerOptions } from '@/utils/picker_option_config.js'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId, clearChildren, getUserId } from '@/utils'
import { downloadFile } from '@/utils/downloadFile.js'
import tableView from '@/components/table_view/'
import sendfile from '@/components/send_file/index.vue'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    deptLayout,
    tableView,
    sendfile,
    menuTree
  },
  data() {
    return {
      date: [],
      fileList: [],
      sendFlag: false,
      loading: false,
      params: {
        // 查询参数
        dispatchType: 2,
        startTime: '',
        endTime: '',
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
      userPrisonId: getPrisonId(),
      deptGuid: '',
      forDeptList: [],
      detailVisible: false,
      statusList: [
        // 状态
        { name: '是', value: 'Y' },
        { name: '否', value: 'N' }
      ],

      typeList: [
        // 类型
        { name: '发文', value: 2 },
        { name: '收文', value: 1 }
      ],

      allDeptData: [], // 全部部门
      allDeptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true,
        emitPath: false
      },
      // 反馈详情
      detailRow: {},
      // 反馈列表
      backList: [],
      backFlag: false,
      writeBackFlag: false,
      downloadArr: [],
      fileTypeList: [],
      listStr: '',
      fileStr: ''
    }
  },
  created() {
    this.deptGuid = JSON.parse(localStorage.getItem('user')).deptGuid
    this.prisonId = JSON.parse(localStorage.getItem('user')).prisonId
    if (this.$route.params.isFeedback) {
      this.params.isFeedback = this.$route.params.isFeedback
    }
    this.getAllDept()
    this.getData()
    this.getFileType()
    let s = 'string'
    console.log({ ...s })
  },
  methods: {
    getFileType() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/FileType')
        .then(res => {
          this.fileTypeList = res
        })
        .catch(error => {
          console.log(error)
        })
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
    // 全部部门
    getAllDept() {
      this.axios
        .get(this._global.userUrl + '/compose/getChildrenTree/1')
        .then(response => {
          clearChildren(response, 'list')
          this.allDeptData = [response]
          this.selectDept(this.allDeptData)
        })
    },
    // 筛选自己部门
    selectDept(val) {
      let userDeptId = JSON.parse(localStorage.getItem('user')).deptGuid
      val.forEach(item => {
        item.id == userDeptId ? (item.disabled = true) : ''
        if (item.list) {
          this.selectDept(item.list)
        }
      })
    },
    typeChange(val) {
      this.tableData.list = []
      this.getData()
    },
    rest() {
      this.params = {
        dispatchType: 1,
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10
      }
      this.date = []
      this.getData()
    },
    sizeChange() {
      this.params.currentPage = this.tableData.pageNum
      this.getData()
    },
    // 获取数据
    getData() {
      let parma = this.params
      parma.receiveId = this.deptGuid
      parma.sendId = this.params.deptId
      this.loading = true
      this.axios
        .post(this._global.businessUrl + '/dispatchFile/list', parma)
        .then(res => {
          this.tableData.list = res.rows
          this.tableData.total = res.total
          this.loading = false
        })
    },
    getFileList(row) {
      this.axios
        .get(
          this._global.businessUrl +
            '/dispatchFile/getFilelist/' +
            row.dispatchId
        )
        .then(res => {
          this.fileList = res
        })
    },

    //多选记录下载
    selectionchange(val) {
      this.listStr = ''
      if (val) {
        val.map((item, i) => {
          //   this.listStr += 'recordIds=' + item.id
          //   if (i < val.length - 1) {
          //     this.listStr += '&'
          //   }

          item.fileIds.map((ids, j) => {
            this.listStr += 'fileIds=' + ids
            if (i < val.length - 1 || j < item.fileIds.length - 1) {
              this.listStr += '&'
            }
          })
        })
      }
    },

    //列表多选下载
    downloadAllByTable() {
      if (this.listStr != '') {
        let loadingInstance = Loading.service({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href =
          //   this._global.baseUrl +
          //   '/base/file/downloadMultipleFiles/' +
          this._global.NoSSLUrl +
          '/file/downloadMultipleFiles/' +
          getUserId() +
          '?' +
          this.listStr
        a.click()
        loadingInstance.close()
        // this.axios
        //   .get(
        //     this._global.baseUrl +
        //       '/base/file/downloadMultipleFilesFromRecordList/' +
        //       getUserId() +
        //       '?' +
        //       this.listStr
        //   )
        //   .then(res => {
        //     console.log(res)
        //     loadingInstance.close()
        //   })
      }
    },

    selChange(e) {
      this.downloadArr = []
      this.fileStr = ''

      if (e) {
        e.forEach((item, i) => {
          console.log(item)

          this.downloadArr.push(item.fileId)
          this.fileStr += 'fileIds=' + item.fileId
          if (i < e.length - 1) {
            this.fileStr += '&'
          }
        })
        console.log(this.fileStr)
      }
    },

    //批量下载
    downloadAll() {
      if (this.fileStr != '') {
        let loadingInstance = Loading.service({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href =
          //   this._global.baseUrl +
          //   '/base/file/downloadMultipleFiles/' +
          this._global.NoSSLUrl +
          '/file/downloadMultipleFiles/' +
          getUserId() +
          '?' +
          this.fileStr
        a.click()
        loadingInstance.close()
      }
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
      }, 2000)
      downloadFile(row.fileId)
    },

    // 查看反馈列表
    lookBack(row) {
      this.backFlag = true
      let parms = {}
      parms.id = row.id
      //   parms.fbDeptId = row.receiveId;

      this.axios
        .post(this._global.businessUrl + '/feedback/list', parms)
        .then(res => {
          this.backList = res.rows
        })
    },
    back(row) {
      this.backFlag = true
      this.detailRow = JSON.parse(JSON.stringify(row))
      let parms = {}
      parms.id = row.id
      //   parms.dispatchId = row.dispatchId;
      //   parms.fbDeptId = row.receiveId;

      this.axios
        .post(this._global.businessUrl + '/feedback/list', parms)
        .then(res => {
          this.backList = res.rows
        })
    },
    openBack(row) {
      this.writeBackFlag = true
      this.detailRow.fbExpTime = row.fbExpTime
      this.detailRow.fbId = row.fbId
      this.detailRow.id = row.id
      this.backFlag = false
    },
    submitBack() {
      let parms = {}
      parms.fbContent = this.detailRow.fbContent
      parms.fbId = this.detailRow.fbId
      parms.id = this.detailRow.id
      //   parms.dispatchId = this.detailRow.dispatchId;
      parms.fbExpTime = this.detailRow.fbExpTime
      parms.fbUserName = JSON.parse(localStorage.getItem('user')).realName
      //   parms.fbDeptId = JSON.parse(localStorage.getItem("user")).deptGuid;
      this.axios
        .put(this._global.businessUrl + '/feedback/update', parms)
        .then(res => {
          this.$message.success(res)
          this.writeBackFlag = false
          this.getData()
        })
    },
    closeDialog() {
      this.detailRow = {}
    },
    tostatisic() {
      this.$router.push({ name: 'document_statistical' })
    },
    topage() {
      this.$router.push({ name: 'files_mgt' })
    },
    tosend() {
      this.$router.push({ name: 'receive_mgt' })
    },
    // 打开发送
    openSend() {
      this.sendFlag = true
    },
    closeSend() {
      this.sendFlag = false
    },
    // 表格数据
    formBack(row, column, cellValue, index) {
      if (cellValue == 'N') {
        return '不需反馈'
      }
      return row.fbPeriod
    },
    formTYPE(row, column, cellValue, index) {
      if (cellValue == '1') {
        return '未反馈'
      } else if (cellValue == '2') {
        return '已反馈'
      } else if (cellValue == '3') {
        return '反馈超时'
      }
      return row.fbPeriod
    },
    formSize(row, column, cellValue, index) {
      return (cellValue / 1024).toFixed(2)
    },
    formType(row, column, cellValue, index) {
      let str = ''
      this.fileTypeList.map(item =>
        item.value == cellValue ? (str = item.label) : ''
      )
      return str
    },
    formTime(row, column, cellValue, index) {
      if (cellValue == null) {
        return '无'
      }
      let date = new Date(cellValue)
      let year = date.getFullYear()
      let mounth = date.getMonth() + 1
      mounth = this.timeSet(mounth)
      let day = date.getDate()
      day = this.timeSet(day)

      let hour = date.getHours()
      hour = this.timeSet(hour)

      let min = date.getMinutes()
      min = this.timeSet(min)

      return year + '-' + mounth + '-' + day + ' ' + hour + ':' + min
    },
    timeSet(val) {
      val < 10 ? (val = '0' + val) : ''
      return val
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  }
}
</script>
<style lang="less" scoped>
.yn_text_btn {
  margin: 0 1rem;
}
.technology {
  .btn_pad,
  .cards,
  .info_num {
    color: #fff !important;
  }
  .cards,
  .bar_box,
  .card_box {
    color: #fff;
    background: transparent;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
}
.card_head {
  font-size: 1.4rem;
  width: 100%;
  box-sizing: border-box;
  padding: 3rem 1rem;
  text-indent: 2.4rem;

  font-weight: 600;
}
.card_main {
  font-size: 1.2rem;
  padding: 3rem 1rem;
  text-indent: 2.4rem;
  box-sizing: border-box;
}
.yn_date_picker {
  width: 100%;
  font-size: 1.1rem;
}
.sub_btn {
  margin-bottom: 2rem;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
}
.btn_box {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  .btn_pad {
    border-bottom: 3px solid #fff;
    margin: 0 1rem;
    text-align: center;
    padding: 0.5rem 1rem;
    font-weight: 600;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .active {
    border-bottom: 3px solid #2b8bef;
    color: #2b8bef;
  }
}
.head_ipt {
  width: 15rem !important;
}
.head_title {
  width: 10rem !important;
}
.padbox {
  padding: 5px 0;
}
.forTitle {
  margin: 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}
/deep/ .el-range-separator {
  width: 10%;
}
.btn_group {
  margin-top: 0.5rem;
}
.title {
  font-size: 1.4rem;
  border: 1px solid #49dcfe;
  border-radius: 2px;
  padding: 1rem;
  box-sizing: border-box;
}
.txt_box {
  margin: 2rem 0;
}
/deep/.yn_ipt .el-textarea__inner {
  border: 1px solid #49dcfe;
  border-radius: 2px;
}
.span_title {
  text-align: right;
  font-size: 1.4rem;
  margin-right: 1rem;
}
</style>
