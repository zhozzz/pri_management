<!--
 * @Description: 隐患排查管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:29:17

 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','监狱动态','隐患排查报表']">
      <tab slot="heade_btn" name="隐患排查管理" :right="true" pathName="safety_statisic" />
      <table-view
        :tableData="tableData"
        noBottom
        v-loading="tableLoading"
        @sizeChange="getRiskData"
      >
        <div slot="searchCondition">
          <el-form ref="form" inline class="yn_form">
            <el-form-item label="报送时间：">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="searchData.beginDate"
                type="month"
                value-format="yyyy-MM-dd hh:mm:ss"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="隐患性质：">
              <el-select v-model="searchData.hiddenType" class="yn_ipt" placeholder="请选择">
                <el-option
                  v-for="item in riskType"
                  :key="item.id"
                  :label="item.dictionaryName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="隐患等级：">
              <el-select v-model="searchData.hiddenLevel" class="yn_ipt" placeholder="请选择隐患等级">
                <el-option
                  v-for="item in levelList"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否需要上级帮助：">
              <el-select v-model="searchData.isHelp" class="yn_ipt" placeholder="是否需要上级帮助">
                <el-option
                  v-for="(item,i) in isHelpList"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门类型：">
              <el-select v-model="searchData.deptType" class="yn_ipt" placeholder="请选择部门类型">
                <el-option
                  v-for="item in deptType"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地点类型：">
              <el-select v-model="searchData.positionType" class="yn_ipt" placeholder="请选择地点类型">
                <el-option
                  v-for="item in positionTypeList"
                  :key="item.subclassGuid"
                  :label="item.value"
                  :value="item.subclassGuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查看已销号：">
              <el-checkbox v-model="searchData.checked"></el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button class="yn_btn" @click="getRiskData" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>
              <el-button
                class="yn_btn"
                @click="$router.push({name:'safety_inspection_created'})"
                type="primary"
                v-if="prisonId!=1"
              >新增</el-button>
              <el-button class="yn_btn" @click="exportData" type="primary">导出数据</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column
            prop="prisonName"
            min-width="100"
            label="报送单位"
            width="width"
            align="center"
            v-if="prisonId==1"
          ></el-table-column>
          <el-table-column
            prop="hiddenNum"
            show-overflow-tooltip
            label="隐患序号"
            width="width"
            min-width="100"
            align="center"
          >
            <template slot="header">
              <el-tooltip class="item" effect="dark" placement="top">
                <span>
                  隐患序号
                  <i class="el-icon-question"></i>
                </span>
                <div slot="content">
                  隐患序号生成规则：
                  <br />监狱简写英文大写字母2~3位-年份(后两位数)-隐患类型(第一级别)的数字序号(有20个)-该监狱这一年第几个隐患
                </div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row.hiddenNum}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="hiddenLevelName"
            show-overflow-tooltip
            label="隐患等级"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="subTypeName"
            show-overflow-tooltip
            label="隐患性质"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.hiddenTypeName}}-{{scope.row.subTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="findDate"
            show-overflow-tooltip
            label="报送月份"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="positionDetail"
            show-overflow-tooltip
            label="隐患地点"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <p>{{scope.row.positionTypeName}}({{scope.row.positionDetail}})</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="detail"
            show-overflow-tooltip
            label="隐患具体情况"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" class="yn_text_btn" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="checkDept"
            min-width="100"
            label="排查部门"
            width="width"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-for="(item,i) in scope.row.checkDept" :key="i">
                {{item}}
                <span v-if="i<scope.row.checkDept.length-1">、</span>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="aimDept"
            min-width="100"
            label="整改责任部门"
            width="width"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <span v-for="(item,i) in scope.row.aimDept" :key="i">
                {{item}}
                <span v-if="i<scope.row.aimDept.length-1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="aimDeptPerson"
            show-overflow-tooltip
            label="责任人"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="assistDeptPerson"
            show-overflow-tooltip
            label="协助人员"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column prop="measure" label="整改措施" width="width" align="center">
            <template slot-scope="scope">
              <div class="measure_btn" @click="showMeasure(scope.row)">{{scope.row.measure}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="limitType"
            show-overflow-tooltip
            label="整改时限"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{limitType[scope.row.limitType-1]}}(至{{scope.row.needDate}})</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="solveDate"
            show-overflow-tooltip
            label="整改完成时间"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.solveDate===null?"未完成":scope.row.solveDate}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            show-overflow-tooltip
            label="处理情况"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <span>{{statusList[scope.row.state]}}</span> -->
              <span class="finish" v-if="scope.row.state===1">已完成</span>
              <span
                class="outtime"
                v-else-if="new Date().getTime()>new Date(scope.row.needDate).getTime()"
              >已超时{{scope.row.process!==null?'('+scope.row.process+'%)':''}}</span>
              <span
                class="doing"
                v-else
              >进行中{{scope.row.process!==null?'('+scope.row.process+'%)':''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="isHelp"
            show-overflow-tooltip
            label="是否需要上级帮助"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isHelp===0">否</span>

              <!-- <el-tooltip v-else :content="scope.row.helpDetail" placement="top"> -->
              <span v-else>{{scope.row.helpDetail}}</span>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" align="center">
            <template slot-scope="scope">
              <span v-for="(item,i) in scope.row.checkDeptAll" :key="i">
                <el-button
                  v-if="item.id===deptId&&scope.row.state!=1&&(new Date().getTime()>new Date(scope.row.needDate).getTime()||scope.row.limitType==1)"
                  type="text"
                  class="yn_text_btn"
                  @click="edit(scope.row)"
                >编辑</el-button>
              </span>
              <span v-for="(item,j) in scope.row.checkDeptAll" :key="'item'+j">
                <el-button
                  v-if="item.id===deptId&&scope.row.state!=1&&new Date().getTime()>new Date(scope.row.needDate).getTime()"
                  type="text"
                  class="yn_text_btn"
                  @click="need(scope.row)"
                >督办</el-button>
              </span>
              <span v-for="(obj,k) in scope.row.aimDeptAll" :key="'obj'+k">
                <el-button
                  type="text"
                  v-if="deptId==obj.id&&scope.row.state!=1"
                  class="yn_text_btn"
                  @click="report(scope.row)"
                >汇报</el-button>
              </span>
              <el-button
                type="text"
                v-if="scope.row.state===1"
                class="yn_text_btn"
                @click="showFinish(scope.row)"
              >查看成果</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <!-- 详情-->
      <el-dialog :visible.sync="detailVisible" class="yn_dialog" title="详情" center>
        <div class="detail_box">
          <div class="detail_title">隐患详情</div>
          <div class="detail_info">{{detailForm.detail}}</div>
          <div class="img_box">
            <div v-for="(img,i) in detailForm.allImage" :key="i">
              <img class="imgs" :src="img.filePath" v-if="img.type===0" />
            </div>
          </div>
        </div>
        <div class="detail_box">
          <div class="detail_title">汇报照片</div>
          <div class="img_box">
            <div v-for="(img,i) in detailForm.allImage" :key="i">
              <img class="imgs" :src="img.filePath" v-if="img.type===1" />
            </div>
          </div>
        </div>
        <div class="detail_box" v-if="detailForm.state===1">
          <div class="detail_title">整改成果</div>
          <div class="img_box">
            <div v-for="(img,i) in detailForm.allImage" :key="i">
              <img class="imgs" :src="img.filePath" v-if="img.type===2" />
            </div>
          </div>
        </div>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="detailVisible=false">确定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog :visible.sync="editVisible" class="yn_dialog" title="编辑" center>
        <el-form class="yn_form" :model="editForm">
          <el-form-item label="隐患等级：">
            <el-select
              v-model="editForm.level"
              class="yn_ipt"
              popper-class="level_Sel"
              placeholder="请选择隐患等级"
            >
              <el-option
                v-for="item in levelList"
                :key="item.subclassGuid"
                :label="item.value"
                :value="item.subclassGuid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="修改缘由：">
            <el-input
              class="yn_ipt"
              v-model="editForm.reason"
              type="textarea"
              placeholder="请输入修改缘由"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(submitEdit)">确定</el-button>
          <el-button class="yn_btn" type="primary" @click="editVisible=false">取消</el-button>
        </span>
      </el-dialog>
      <!-- 督办 -->
      <el-dialog :visible.sync="needVisible" class="yn_dialog" title="督办" center>
        <el-form class="yn_form" :model="needForm">
          <el-form-item label="修改限时：">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="needForm.needDate"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="督办理由：">
            <el-input
              class="yn_ipt"
              v-model="needForm.reason"
              type="textarea"
              placeholder="请填写督办、更改整改时限的理由"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="sunNeed">确定</el-button>
          <el-button class="yn_btn" type="primary" @click="needVisible=false">取消</el-button>
        </span>
      </el-dialog>

      <!-- 汇报 -->
      <el-dialog
        :visible.sync="reportVisible"
        @close="fileIds=[]"
        class="yn_dialog"
        title="汇报"
        center
      >
        <el-form class="yn_form" ref="creatForm" :model="reportForm" :rules="reportRule">
          <el-form-item label="是否完成：" prop="isComplete">
            <el-radio v-model="reportForm.isComplete" :label="1">是</el-radio>
            <el-radio v-model="reportForm.isComplete" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="完成进度(%)：">
            <el-input-number
              class="yn_ipt"
              v-model="reportForm.process"
              :max="100"
              :min="0"
              :disabled="reportForm.isComplete==1"
              :controls="false"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo"
              :action="_global.businessUrl+'/file/upload'"
              multiple
              :on-success="upsuccess"
              :on-remove="removefile"
              :before-upload="beforeAvatarUpload"
              :file-list="fileIds"
              list-type="picture-card"
            >
              <el-button class="yn_btn" type="primary">添加整改照片</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="subReport">确定</el-button>
          <el-button class="yn_btn" type="primary" @click="reportVisible=false">取消</el-button>
        </span>
      </el-dialog>

      <!-- 查看成果-->
      <el-dialog :visible.sync="finishVisible" class="yn_dialog" title="整改成果" center>
        <div class="detail_box">
          <div class="detail_title">整改成果</div>
          <div class="img_box">
            <div v-for="(img,i) in finishData.allImage" :key="i">
              <img class="imgs" :src="img.filePath" v-if="img.type===2" />
            </div>
          </div>
        </div>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="finishVisible=false">确定</el-button>
        </span>
      </el-dialog>

      <!-- 查看措施-->
      <el-dialog :visible.sync="measureVisible" class="yn_dialog" title="整改措施" center>
        <div class="detail_box">
          <div class="detail_title">整改措施</div>
          <div class="detail_info">{{measureData.measure}}</div>
        </div>
        <div class="detail_box">
          <div class="detail_title">编辑记录</div>
          <div class="detail_info" v-if="measureData.updateInfos.length==0">暂无记录</div>
          <div
            class="detail_info"
            v-for="(item,i) in measureData.updateInfos"
            :key="i"
          >{{i+1}}、于{{item.createTime}}，因{{item.name}},修改隐患等级为{{item.value}}</div>
        </div>
        <div class="detail_box">
          <div class="detail_title">督办记录</div>
          <div class="detail_info" v-if="measureData.handleInfos.length==0">暂无记录</div>
          <div
            class="detail_info"
            v-for="(item,i) in measureData.handleInfos"
            :key="i"
          >{{i+1}}、于{{item.createTime}}，因{{item.name}},修改整改时限至{{item.value}}</div>
        </div>
        <span slot="footer">
          <el-button class="yn_btn" type="primary" @click="measureVisible=false">确定</el-button>
        </span>
      </el-dialog>
    </menuTree>
  </dept-layout>
</template>

<script>
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import tableView from '@/components/table_view/'
import _global from '@/utils/global_url'
import deptLayout from '@/components/deptLayout/index.vue'
import tab from '@/components/tab/index.vue'
import { Loading } from 'element-ui'
import menuTree from '@/components/menu_tree/'

import { getPrisonId, getDeptId } from '@/utils'
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import {
  getDept,
  getRiskType,
  getRiskLevel,
  getPosition,
  getDeptType,
  getRiskData,
  editRisk,
  needRisk,
  reportRisk,
  exportData
} from './service.js'

export default {
  components: {
    tableView,
    criminalRegister,
    deptLayout,
    criminalFile,
    tab,
    menuTree
  },
  name: 'index',
  data() {
    return {
      prisonId: getPrisonId(),
      selPrisonId: getPrisonId(),
      deptId: getDeptId(),
      searchData: {},
      tableLoading: true,
      tableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },

      riskType: [],
      levelList: [],
      positionTypeList: [],
      isHelpList: [
        { name: '是', value: 1 },
        { name: '否', value: 0 }
      ],
      deptType: [],
      limitType: ['长期', '一周', '一月', '一季'],
      statusList: ['进行中', '完成', '超时进行', '超时完成'],
      editVisible: false,
      editForm: {},
      detailVisible: false,
      detailForm: {},
      needVisible: false,
      needForm: {},
      reportVisible: false,
      reportForm: {},
      fileIds: [],
      finishVisible: false,
      finishData: {},
      measureVisible: false,
      measureData: { handleInfos: [], updateInfos: [] },
      reportRule: {
        isComplete: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  created() {
    if (this.$route.params) {
      this.searchData = this.$route.params
    }
    this.getSearchData()
    this.getRiskData()
  },
  methods: {
    nodeClick(val) {
      this.selPrisonId = val.id
      this.getRiskData()
    },
    exportData() {
      let params = {}
      params = this.searchData
      exportData(params)
      //   .catch(res => {
      //     // const blob = res.data
      //     // console.log(blob)
      //     const reader = new FileReader()
      //     console.log(reader)

      //     var blob = new Blob([res.data])
      //     reader.readAsDataURL(blob)
      //     reader.onload = e => {
      //       const a = document.createElement('a')
      //       a.download = `隐患排查报表.xls`
      //       a.href = URL.createObjectURL(blob)
      //       document.body.appendChild(a)
      //       a.click()
      //       document.body.removeChild(a)
      //     }
      //   })
    },
    getSearchData() {
      // 获取隐患类型
      getRiskType(2).then(res => {
        this.riskType = res
      })

      // 获取隐患等级
      getRiskLevel().then(res => {
        this.levelList = res
      })

      // 获取位置信息
      getPosition().then(res => {
        this.positionTypeList = res
      })
      getDeptType().then(res => {
        this.deptType = res
      })
    },
    reset() {
      this.searchData = { checked: false }
      this.tableData = { list: [], total: 0, pageNum: 1, pageSize: 10 }
      this.getRiskData()
    },
    getRiskData() {
      this.tableLoading = true
      let params = {}
      params = this.searchData
      this.searchData.checked === true
        ? (params.isComplete = 1)
        : (params.isComplete = 0)
      params.pageSize = this.tableData.pageSize
      params.currentPage = this.tableData.pageNum
      params.prisonId = this.selPrisonId
      getRiskData(params).then(res => {
        this.tableData.list = res.rows
        this.tableData.total = res.total
        this.tableLoading = false
      })
    },
    detail(val) {
      this.detailForm = {}
      this.detailForm = JSON.parse(JSON.stringify(val))
      console.log(this.detailForm)
      this.detailVisible = true
    },
    edit(val) {
      this.editForm = {}
      this.editForm.id = val.id
      //   this.editForm.level = val.hiddenLevel
      console.log(this.editForm)
      this.editVisible = true
    },

    submitEdit() {
      console.log(this.editForm)
      if (this.editForm.level && this.editForm.reason) {
        editRisk(this.editForm).then(res => {
          this.$message.success('更新成功')
          this.getRiskData()

          this.editVisible = false
        })
      } else {
        this.$message.error('请完成填写')
      }
    },
    need(val) {
      this.needForm = {}
      this.needForm.id = val.id
      this.needVisible = true
    },
    sunNeed() {
      if (this.needForm.needDate && this.needForm.reason) {
        needRisk(this.needForm).then(res => {
          this.$message.success('更新成功')
          this.getRiskData()

          this.needVisible = false
        })
      } else {
        this.$message.error('请完成填写')
      }
    },
    report(val) {
      this.reportForm = {}
      this.reportForm.id = val.id
      this.reportForm.images = []
      this.reportVisible = true
    },
    subReport() {
      this.$refs['creatForm'].validate(valid => {
        console.log(this.reportForm)

        if (valid) {
          if (this.reportForm.isComplete == 0 && !this.reportForm.process) {
            this.$message.error('请完整填写')
          } else {
            reportRisk(this.reportForm).then(res => {
              this.reportVisible = false
              this.$message.success('汇报完成')

              this.getRiskData()
            })
          }
        } else {
          this.$message.error('请完整填写')
        }
      })
    },
    showFinish(val) {
      console.log(val)
      this.finishData = val
      this.finishVisible = true
    },
    upsuccess(res) {
      Loading.service().close()
      this.$message.success('上传成功')

      this.reportForm.images.push(res.data.fileId)
      console.log(this.reportForm.images)
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
      console.log(fileList)

      if (fileList) {
        this.reportForm.images = fileList.map(item => {
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
    },
    showMeasure(val) {
      this.measureData = val
      this.measureVisible = true
    }
  }
}
</script>

<style scoped lang='less'>
.finish {
  color: greenyellow;
}
.outtime {
  color: red;
}
.doing {
  color: #f59a24;
}
.measure_btn {
  color: #f59a24;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.detail_box {
  width: 100%;
  margin: 10px 0;
  font-size: 1.2rem;
  .detail_title {
    text-align: center;
    width: 100%;
    margin: 10px 0;
  }
  .detail_info {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    font-size: 1.4rem;
  }
  .img_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .imgs {
      margin: 1rem 2rem;
      width: 10rem;
      height: 10rem;
    }
  }
}

.technology {
  .detail_box {
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
}
</style>
