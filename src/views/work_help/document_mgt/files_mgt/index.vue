<!--
 * @Description: In User Settings Edit
 * @Author: zhu
 * @Date: 2019-08-27 10:09:42
 * @LastEditTime: 2020-03-25 10:06:14
 * @LastEditors: zhuhao
 -->

<template>
  <menuTree :menuList="['工作辅助','文件下发与报送']">
    <div slot="heade_btn" class="yn_page_btn">
      <div class="dis_btn" @click="tostatisic">文件统计</div>
      <div class="dis_btn" @click="tosend">收文记录</div>
      <div class="dis_btn" @click="topage">发文记录</div>
      <div class="link_btn" v-if="userPrisonId==1">文件管理</div>
    </div>
    <el-row class="main_box">
      <el-col :span="4">
        <div class="file_box file_box_title">文件菜单</div>
        <div class="file_box" @click="selectIt(2)">
          <i class="el-icon-folder-opened file_img"></i>
          <span :class="select==2?'active':''">服务器文件</span>
        </div>
        <div class="file_box" @click="selectIt(1)">
          <i class="el-icon-folder-opened file_img"></i>
          <span :class="select==1?'active':''">私人空间</span>
        </div>
      </el-col>
      <el-col :span="20" class="file_menu">
        <table-view
          :tableData="tableData"
          noIndex
          noBottom
          @sizeChange="sizeChange"
          v-loading="loading"
          @selectionchange="selChange"
        >
          <div slot="searchCondition">
            <el-form class="yn_form" ref="searchForm" inline :model="params">
              <el-form-item label="创建时间：" prop="date">
                <el-date-picker
                  class="yn_ipt yn_date_picker"
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="timeChange"
                  align="right"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="文件名：" prop="date">
                <el-input class="yn_ipt" v-model="params.fileName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn" @click="getData" type="primary">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn" @click="rest" type="primary">重置</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn" type="primary" @click="openUp">上传文件</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="yn_btn up_btn" type="primary" @click="downloadAll">批量下载</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template slot="table-column">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column
              align="center"
              :formatter="formTime"
              show-overflow-tooltip
              prop="createTime"
              label="文件创建时间"
            />

            <el-table-column align="center" show-overflow-tooltip prop="userDeptName" label="来源" />
            <el-table-column align="center" show-overflow-tooltip prop="fileName" label="文件名" />
            <el-table-column align="center" prop="userName" label="创建人" />
            <el-table-column align="center" :formatter="formSize" prop="fileSize" label="文件大小(KB)" />
            <el-table-column align="center" prop="prop" label="操作">
              <template slot-scope="scope">
                <el-button class="yn_text_btn" type="text" @click="download(scope.row.fileId)">下载</el-button>
                <el-button class="yn_text_btn" type="text" @click="del(scope.row.fileId)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>
      </el-col>
    </el-row>
    <!-- 上传-->
    <el-dialog
      title="上传文件"
      class="yn_dialog"
      center
      :visible.sync="upFlag"
      @close="closeDialog"
      width="50%"
    >
      <el-upload
        class="upload-demo"
        :action="_global.businessUrl+'/file/upload'"
        multiple
        :limit="9"
        ref="upload"
        :on-success="upsuccess"
        :on-remove="removefile"
        :before-upload="beforeAvatarUpload"
        :file-list="files"
      >
        <el-button class="yn_btn up_btn" type="primary">选取文件</el-button>
      </el-upload>

      <el-button
        class="yn_btn btn_pad up_btn"
        type="primary"
        :disabled="fileList.length==0"
        @click="submitUP"
      >提交至服务器</el-button>

      <span class="dialog_footer" slot="footer"></span>
    </el-dialog>
  </menuTree>
</template>
<script>
import { Loading } from 'element-ui'
import { expnoraml, Isname } from '@/utils/form_valid.js'
import { pickerOptions } from '@/utils/picker_option_config.js'
import { getPrisonId } from '@/utils'
import tableView from '@/components/table_view/'
import { downloadFile } from '@/utils/downloadFile.js'
import menuTree from '@/components/menu_tree/'

export default {
  components: {
    tableView,
    menuTree
  },
  data() {
    return {
      userPrisonId: getPrisonId(),
      date: [],
      fileList: [],
      files: [],
      sendFlag: false,
      upFlag: false,
      select: 2,
      params: {
        // 查询参数
        fileType: 2,
        userDeptId: '',
        fileUserId: '',
        fileName: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10
      },
      loading: true,
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      prisonId: '',
      selList: []
    }
  },
  created() {
    this.prisonId = JSON.parse(localStorage.getItem('user')).prisonId
    this.getData()
  },
  methods: {
    timeChange(data) {
      if (data != null) {
        this.params.startTime = Date.parse(data[0])
        this.params.endTime = Date.parse(data[1]) + 24 * 60 * 60 * 1000
      } else {
        this.params.startTime = ''
        this.params.endTime = ''
      }
    },
    selectIt(val) {
      this.select = val

      this.getData()
    },
    rest() {
      this.params = {
        userDeptId: '',
        fileUserId: '',
        fileName: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 10
      }
      this.date = []
      this.getData()
    },
    getData() {
      this.loading = true
      this.params.fileType = this.select

      this.params.fileUserId = JSON.parse(localStorage.getItem('user')).userGuid
      if (this.select == 2) {
        delete this.params.fileUserId
        this.params.userDeptId = ''
      } else {
        this.params.userDeptId = JSON.parse(
          localStorage.getItem('user')
        ).deptGuid
      }
      this.axios
        .post(this._global.businessUrl + '/file/list', this.params)
        .then(res => {
          this.tableData.list = res.rows
          this.tableData.total = res.total
          this.loading = false
        })
    },

    sizeChange() {
      this.params.currentPage = this.tableData.pageNum
      this.getData()
    },
    tostatisic() {
      this.$router.push({ name: 'document_statistical' })
    },
    topage() {
      this.$router.push({ name: 'sendreceive_log' })
    },
    tosend() {
      this.$router.push({ name: 'receive_mgt' })
    },

    //批量选择

    selChange(e) {
      this.selList = e.map(item => item.fileId)
      console.log(this.selList)
    },
    //批量下载
    downloadAll() {
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      setTimeout(() => {
        loadingInstance.close()
      }, 1000)
      this.selList.map(id => {
        downloadFile(id)
      })
    },
    //下载
    download(id) {
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      setTimeout(() => {
        loadingInstance.close()
      }, 1000)
      downloadFile(id)

      //   location.href = this._global.businessUrl + '/file/download/' + id
    },

    openUp() {
      this.upFlag = true
      this.fileList = []
    },
    closeDialog() {
      this.fileList = []
      this.files = []
    },
    upsuccess(res, file, fileList) {
      Loading.service().close()
      this.$message.success('上传成功')

      this.fileList.push(file)
      console.log(this.fileList)
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
      this.fileList = fileList

      this.axios
        .delete(
          this._global.businessUrl + '/file/delete/' + file.response.data.fileId
        )
        .then(res => {
          console.log(res)
          this.$message.success(res)
        })
    },
    submitUP() {
      let parmas = {}
      parmas.fileIds = []
      this.fileList.forEach(item => {
        parmas.fileIds.push(item.response.data.fileId)
      })

      parmas.fileUserId = JSON.parse(localStorage.getItem('user')).userGuid

      parmas.fileType = this.select
      this.axios
        .put(this._global.businessUrl + '/file/update', parmas)
        .then(res => {
          this.getData()
          this.upFlag = false
        })
    },
    del(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(this._global.businessUrl + '/file/delete/' + id)
            .then(res => {
              console.log(res)
              this.$message.success(res)
              this.getData()
            })
        })
        .catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 表格数据
    formSize(row, column, cellValue, index) {
      return (cellValue / 1024).toFixed(2)
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
  .btn_pad {
    color: #fff !important;
  }
  .main_box {
    color: #fff;
    background: transparent;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    .file_menu {
      border-left: 1px solid #7cdafd;
    }
  }
}
.file_img {
  color: #e8bf00;
}
.main_box {
  border: 1px solid #cddded;
  border-radius: 2px;
  box-sizing: border-box;
  padding: 0 1rem;
  margin: 2rem 0;
  .file_menu {
    box-sizing: border-box;
    padding-left: 2rem;
    border-left: 1px solid #cddded;
  }
}
.file_box {
  margin: 2rem 0;
  font-size: 1.6rem;
  .active {
    color: #2b8bef;
  }
}
.file_box_title {
  text-align: center;
  font-weight: 600;
}
.yn_date_picker {
  width: 100%;
  font-size: 1.1rem;
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
.up_btn {
  margin: 1rem auto;
}

/deep/ .el-range-separator {
  width: 10%;
}
.btn_group {
  margin-top: 0.5rem;
}
</style>
