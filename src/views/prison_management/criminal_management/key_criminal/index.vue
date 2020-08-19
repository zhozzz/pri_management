<!--
 * @Description: 重点罪犯管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:45:56
 * @todo:查询未整合入组织架构id
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','重点罪犯管理']">
      <tab slot="heade_btn" name="重点罪犯管理" :right="true" pathName="keyCriminal_statisic" />

      <!-- <table-view :tableData="tableData" noBottom @sizeChange="sizeChange" v-loading="loading"> -->

      <!-- <div slot="searchCondition">  -->
      <el-form
        ref="searchForm"
        inline
        :model="queryParams"
        label-width="7rem"
        :rules="searchRules"
        class="yn_form"
      >
        <el-form-item label="罪犯姓名:" prop="criminalName">
          <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
        </el-form-item>

        <el-form-item label="罪犯编号:" prop="criminalNum">
          <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
        </el-form-item>

        <!-- <el-form-item label="性别：" prop="zfGender">
              <el-select class="yn_ipt" v-model="queryParams.gender">
                <el-option
                  v-for="(item,i) in sexlist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
        </el-form-item>-->

        <el-form-item label="入监时间：" prop="date">
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
        <!-- <el-form-item label="重点罪犯类型:" prop="KeyCriminalType" label-width="8rem">
              <el-select class="yn_ipt" v-model="queryParams.KeyCriminalType">
                <el-option
                  v-for="(item,i) in keyTypelist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
        </el-form-item>-->
        <el-form-item label="所属监区：" prop="workPosition">
          <!-- <el-select class="yn_ipt" v-model="queryParams.areaId">
                <el-option
                  v-for="(item,i) in arealist"
                  :key="i"
                  :label="item.departName"
                  :value="item.id"
                ></el-option>
          </el-select>-->
          <el-cascader
            class="yn_ipt"
            :show-all-levels="false"
            v-model="queryParams.areaId"
            :options="selArealist"
            :props="{label:'departName',value:'id',children:'list',emitPath:false,checkStrictly:true}"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button class="yn_btn" @click="search" type="primary">查询</el-button>
          <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="criCardBox" v-if="tableData.list.length">
        <div class="criCard" v-for="(item,i) in tableData.list" :key="i">
          <div class="card_head">
            <div>{{item.zfName}}</div>
            <div class="yn_btn_box_inTable">
              <!-- <el-button class="yn_text_btn" type="text" @click="edit(item)">编辑</el-button> -->
              <criminal-register
                :useIcon="true"
                :prisonId="prisonId"
                :criminalId="item.id"
                @dieSubmit="saveEdit"
              ></criminal-register>
              <criminalFile :useIcon="true" :criminalId="item.id"></criminalFile>
            </div>
          </div>
          <el-row :gutter="10">
            <el-col :span="24">罪犯编号：{{item.zfNum}}</el-col>
            <!-- <el-col :span="12">分管等级：{{item.typeName}}</el-col> -->
            <el-col :span="24">入监时间：{{item.intoTime}}</el-col>
            <el-col :span="24">罪名：{{formCriminalName(item)}}</el-col>
          </el-row>
          <p v-if="item.ifInRound">&nbsp;</p>
          <p :style="{'color':'red'}" @click="setRound(item)" v-else>未处在视频轮巡组</p>
        </div>
      </div>
      <div v-else class="criCardBox">暂无重点罪犯数据</div>

      <div class="pagination-container">
        <el-pagination
          :current-page.sync="tableData.pageNum"
          :disabled="disabled()"
          class="pagination-position"
          :page-size="tableData.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.total"
        ></el-pagination>
      </div>
      <!-- </div> -->

      <!-- <template slot="table-column">
          <el-table-column align="center" show-overflow-tooltip prop="zfNum" label="罪犯编号" />
          <el-table-column align="center" show-overflow-tooltip prop="station" label="工位" />
          <el-table-column align="center" show-overflow-tooltip prop="zfCard" label="身份证号" />
          <el-table-column align="center" prop="zfName" label="姓名" />

          <el-table-column align="center" prop="zfTypeValue" :formatter="formType" label="分管等级" />
          <el-table-column align="center" show-overflow-tooltip prop="intoTime" label="入监时间" />
          <el-table-column
            align="center"
            min-width="100"
            prop="deptId"
            :formatter="formArea"
            label="所属监区"
          />
          <el-table-column align="center" label="监舍" />
          <el-table-column align="center" label="床位" />
           <el-table-column
            align="center"
            prop="zfAccusationValue"
            :formatter="formCriminalName"
            show-overflow-tooltip
            min-width="120px"
            label="罪名"
          />

          <el-table-column align="center" prop="jointCriminals" show-overflow-tooltip label="包夹罪犯">
            <template slot-scope="scope" v-if="scope.row.jointCriminals.length>0">
              <div v-for="(item,i) in scope.row.jointCriminals" :key="i">{{item.zfName}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="责任警员" />

          <el-table-column align="center" prop="prop" label="操作" min-width="250">
            <template slot-scope="scope">
              <el-button class="yn_text_btn" type="text" @click="edit(scope.row)">编辑</el-button>
              <criminal-register :criminalId="scope.row.id" @dieSubmit="saveEdit"></criminal-register>
              <criminalFile :criminalId="scope.row.id"></criminalFile>
            </template>
          </el-table-column>
      </template>-->
      <!-- </table-view> -->

      <el-dialog
        class="yn_dialog"
        title="编辑罪犯"
        :visible.sync="editFlag"
        center
        width="60%"
        @close="editclose"
      >
        <el-form :model="editform" class="yn_form" label-width="7rem" :rules="rules" ref="editForm">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="罪犯姓名" prop="zfName">
                <el-input class="yn_ipt" v-model="editform.zfName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="罪犯编号" prop="zfNum">
                <el-input class="yn_ipt" v-model="editform.zfNum" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="罪名" prop="zfAccusationValue">
                <el-select class="yn_ipt" v-model="editform.zfAccusationValue">
                  <el-option
                    v-for="(item,i) in CriminalNamelist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="性别" prop="zfGender">
                <el-select class="yn_ipt" v-model="editform.zfGender">
                  <el-option
                    v-for="(item,i) in sexlist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="分管等级" prop="zfTypeValue">
                <el-select class="yn_ipt" v-model="editform.zfTypeValue">
                  <el-option
                    v-for="(item,i) in typelist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="身份证号" prop="zfCard">
                <el-input class="yn_ipt" v-model="editform.zfCard" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="籍贯" prop="zfBornPlace">
                <el-input class="yn_ipt" v-model="editform.zfBornPlace" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="身高(cm)" prop="height">
                <el-input class="yn_ipt" v-model="editform.height" :controls="false"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="体重(kg)" prop="weight">
                <el-input class="yn_ipt" v-model="editform.weight" :controls="false"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="罪犯生日" prop="zfBirth">
                <el-date-picker
                  class="yn_ipt"
                  v-model="editform.zfBirth"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="年龄" prop="age">
                <el-input class="yn_ipt" v-model="editform.age" :controls="false"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(subEdit)">保 存</el-button>
        </div>
      </el-dialog>

      <edit-dialog
        :editVisible="editFlag"
        :handleCloseEdit="handleCloseEdit"
        :editList="editform"
        @updateSuc="query"
      ></edit-dialog>

      <el-dialog
        class="yn_dialog"
        title="绑定摄像头房间"
        :visible.sync="roundFlag"
        center
        width="60%"
        @close="roundClose"
      >
        <el-form ref="searchForm" inline label-width="7rem" class="yn_form">
          <el-form-item label="选择监区:">
            <el-select class="yn_ipt" v-model="roundAreaId" @change="roomSizeChange">
              <el-option
                v-for="(item,i) in arealist"
                :key="i"
                :label="item.departName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间编号:" v-if="roundAreaId">
            <el-input class="yn_ipt" v-model="roomId"></el-input>
          </el-form-item>
          <el-form-item v-if="roundAreaId">
            <el-button class="yn_btn" @click="roomSizeChange" type="primary">查询</el-button>
          </el-form-item>
        </el-form>

        <table-view
          :tableData="roomTableData"
          noBottom
          @sizeChange="roomSizeChange"
          v-loading="loading"
          v-if="roundAreaId"
        >
          <div slot="searchCondition"></div>
          <template slot="table-column">
            <el-table-column align="center" label="房间编号" prop="roomId" />
            <el-table-column align="center" label="操作">
              <template slot-scope="{row}">
                <el-button class="yn_btn" type="text" @click="subRound(row)">选定此房间</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>
        <div class="yn_page_title" v-else>请选择监区</div>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(subEdit)">保 存</el-button>
        </div>
      </el-dialog>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import tableView from '@/components/table_view/'
import _global from '@/utils/global_url'
import { expnoraml, Isname, isIDCard } from '@/utils/form_valid.js'
import { MessageBox, Message, Loading } from 'element-ui'
import deptLayout from '@/components/deptLayout/index.vue'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'

import { getPrisonId } from '@/utils'
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import editDialog from '@/views/prison_management/essential_info/criminal_manegement/edit_dialog.vue'
import { formatDate } from '../../../../utils/date'
export default {
  components: {
    tableView,
    criminalRegister,
    deptLayout,
    criminalFile,
    tab,
    editDialog,
    menuTree
  },
  name: 'index',
  data() {
    return {
      pickerOptions: pickerOptions,
      date: [],
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 9
      },
      loading: true,
      prisonId: getPrisonId(),
      queryParams: {
        deptId: '',
        criminalNum: '',
        areaId: '',
        criminalName: '',
        startTime: '',
        endTime: '',
        gender: '',
        currentPage: 1,
        pageSize: 9
      },
      sexlist: [
        { value: 1, label: '男' },
        { value: 0, label: '女' }
      ],
      typelist: [], // 类型
      CriminalNamelist: [], // 罪名
      arealist: [], // 监区
      selArealist: [],
      deptType: '', // 部门类型
      searchRules: {
        criminalName: [
          { validator: Isname, trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        criminalNum: [
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      rules: {
        zfName: [
          { validator: Isname, trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        zfNum: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        zfCard: [
          { validator: isIDCard, trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        zfBornPlace: [
          { validator: expnoraml('籍贯'), trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      editFlag: false,
      editform: {},
      fileFlag: false,
      criminalId: '',
      keyTypelist: [],
      roundFlag: false,
      roundData: {},
      roundAreaId: '',
      roomTableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      roomId: ''
    }
  },
  created() {
    let prison = sessionStorage.getItem('prisonID')
    if (prison && prison !== undefined) {
      this.prisonId = prison
    }
    this.query()
    this.getType()
    this.getCriminalName()
    this.getDeptType()
  },
  methods: {
    getType() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/CrimeType')
        .then(response => {
          this.typelist = response
        })
        .catch(error => {
          console.log(error)
        })
      this.axios
        .get(this._global.userUrl + '/dictionary/option/KeyCriminalType')
        .then(response => {
          this.keyTypelist = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取部门类型
    getDeptType() {
      let that = this
      this.axios
        .get(this._global.userUrl + '/dictionary/option/ORGANIZATION')
        .then(response => {
          response.forEach(item => {
            item.label == '监区' ? (this.deptType = item.value) : ''
          })
          this.getArea()
        })
        .catch(error => {
          console.log(error)
        })
    },
    getArea() {
      this.axios
        .get(
          this._global.userUrl +
            '/compose/getDeptAreaByPrisonId?prisonId=' +
            this.prisonId
        )
        .then(res => {
          this.selArealist = res.list
        })
      this.axios
        .get(this._global.userUrl + '/compose/getChildrenTree/' + this.prisonId)
        .then(res => {
          console.log([res])
          this.selectArea([res])
        })
        .catch(error => {
          console.log(error)
        })
    },
    selectArea(arr) {
      arr.forEach(item => {
        item.departType == this.deptType ? this.arealist.push(item) : ''
        if (item.list.length > 0) {
          this.selectArea(item.list)
        }
      })
    },
    getCriminalName() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/CriminalName')
        .then(response => {
          this.CriminalNamelist = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    sizeChange() {
      this.queryParams.currentPage = this.tableData.pageNum
      this.query()
    },
    query() {
      this.loading = true
      this.queryParams.deptId = this.prisonId
      let param = {}
      let start = this.queryParams.startTime
      let end = this.queryParams.endTime
      Object.assign(param, this.queryParams)
      param.startTime =
        start == null || start === ''
          ? ''
          : formatDate(this.queryParams.startTime, 'yyyy-MM-dd hh:mm:ss')
      param.endTime =
        end == null || end === ''
          ? ''
          : formatDate(this.queryParams.endTime, 'yyyy-MM-dd hh:mm:ss')
      this.axios
        .post(_global.businessUrl + '/keyCriminal/query', param)
        .then(data => {
          this.tableData.list = data.list
          this.tableData.list.map(data => {
            this.typelist.forEach(item => {
              item.value == data.zfTypeValue ? (data.typeName = item.label) : ''
            })
          })
          this.tableData.total = data.total
          this.loading = false
          console.log(data)
        })
        .catch(() => {
          this.$message.info('系统繁忙，请稍后再试')
        })
    },
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.query()
        } else {
          Message.error({ message: '请正确输入' })
          return false
        }
      })
    },
    timeChange(data) {
      if (data != null) {
        this.queryParams.startTime = data[0]
        this.queryParams.endTime = data[1]
      } else {
        this.queryParams.startTime = ''
        this.queryParams.endTime = ''
      }
    },
    resetInfo() {
      // 重置
      this.queryParams = {
        pageSize: 9,
        currentPage: 1
      }
      this.date = []

      this.$refs['searchForm'].clearValidate()
      this.query()
    },
    edit(row) {
      this.editform = JSON.parse(JSON.stringify(row))
      this.editFlag = true
      console.log(this.editform)
    },
    handleCloseEdit() {
      this.editFlag = false
      this.editform = {}
    },
    // 保存编辑
    subEdit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.axios
            .put(this._global.businessUrl + '/criminalBase/edit', this.editform)
            .then(response => {
              this.editFlag = false
              Message({
                type: 'success',
                message: '修改成功!'
              })
              this.query()
              this.editform = {}
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    editclose() {
      this.editform = {}
      this.$refs['editForm'].clearValidate()
    },

    // 死亡登记
    saveEdit(val) {
      console.log(val)
      val.createUserId = JSON.parse(localStorage.getItem('user')).userGuid
      this.axios
        .post(this._global.businessUrl + '/criminalDeath/deathRecord', val)
        .then(response => {
          Message({
            type: 'success',
            message: '登记完成!'
          })
          this.query()

          val = {}
        })
        .catch(error => {
          console.log(error)
        })
    },
    formCriminalName(row, column, cellValue, index) {
      let str = ''
      console.log(row)

      row.criminalAccusations.map(item => {
        str += item.label + '；'
      })
      str = str.substring(0, str.length - 1)

      return str
    },
    formSex(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '男'
      } else {
        return '女'
      }
    },
    formType(row, column, cellValue, index) {
      let name = ''
      this.typelist.forEach(item => {
        item.value == cellValue ? (name = item.label) : ''
      })
      return name
    },
    formArea(row, column, cellValue, index) {
      let name = ''
      this.arealist.forEach(item => {
        item.id == cellValue ? (name = item.departName) : ''
      })
      return name
    },
    nodeClick(val) {
      this.prisonId = val.id
    },
    disabled() {
      if (this.tableData.total) {
        if (this.tableData.total > this.tableData.pageSize) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    setRound(row) {
      this.roundFlag = true
      this.roundData = JSON.parse(JSON.stringify(row))
    },
    roomSizeChange() {
      let parmas = {}
      parmas.prisonId = this.roundData.prisonId
      parmas.deptId = this.roundAreaId
      parmas.currentPage = this.roomTableData.pageNum
      parmas.pageSize = this.roomTableData.pageSize
      parmas.roomId = this.roomId
      this.axios
        .post(_global.userUrl + '/room/queryRoom', parmas)
        .then(data => {
          this.roomTableData.list = data.rows

          this.roomTableData.total = data.total
          this.loading = false
          console.log(data)
        })
    },
    //选定视频轮询房间
    subRound(row) {
      let str = this.roundData.id + '/' + row.id
      Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios
        .put(_global.businessUrl + '/keyCriminal/fillRoundInfo/' + str)
        .then(data => {
          console.log(data)
          this.roundFlag = false
          Loading.service().close()

          this.query()
          this.$message.success(data)
        })
        .catch(err => {
          Loading.service().close()

          console.log(err.data.msg)
          // this.$message.warning(err)
        })
    },
    roundClose() {
      this.roomTableData = {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
      this.roomId = ''
      this.roundAreaId = ''
      this.query()
    }
  },
  watch: {
    prisonId(val) {
      this.getArea()
      this.query()
    },
    'tableData.pageSize'() {
      this.sizeChange()
    },
    'tableData.pageNum'() {
      this.sizeChange()
    }
  }
}
</script>

<style scoped lang='less'>
/deep/ .el-range-separator {
  width: 10%;
}

/deep/ .el-input-number {
  height: 2.5rem;
  width: 100%;
}
/deep/ .el-date-editor.el-input {
  height: 2.5rem;
  width: 100%;
}
/deep/ .el-date-editor--daterange.el-input__inner {
  font-size: 1.2rem;
  width: 100%;
}
.criCardBox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.2rem;
  padding: 2rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  align-items: center;
  text-align: center;
  .criCard {
    width: 30%;
    padding: 1rem 3rem;
    border-radius: 4px;
    margin: 1rem 1.5%;
    text-align: left;
    color: #333;

    background-image: url('~@/assets/other/card_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .el-col {
      margin: 0.2rem 0;
    }
    .card_head {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.6rem;
      font-weight: 600;
      border-bottom: 1px solid #ccc;
      color: #000;
      padding-bottom: 0.5rem;
    }
  }
}
.pagination-container {
  // margin-top: 8px;
  // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  text-align: right;
  background: #fbfcff;
  padding: 8px 6px;
  border: 1px solid rgba(205, 221, 237, 1);
  border-top: none;
}
.technology {
  .criCardBox {
    color: #fff;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
  .criCard {
    color: #fff;
    background-image: url('~@/assets/other/card_bg_dark.png');
    .card_head {
      color: #fff;
    }
  }
  .pagination-container {
    text-align: right;
    background: transparent;
    padding: 8px 6px;
    color: #fff;
    border: none;
    /deep/.el-pagination__total {
      color: #fff;
    }
    /deep/.btn-prev,
    /deep/.btn-next {
      i {
        color: #3b4f5e;
      }
      background: #052239;
      border: 1px solid #4b94c5;
    }
    /deep/.el-pager {
      li {
        color: #fff;
        background: #052239;
        border: 1px solid #4b94c5;
      }
      .active {
        background: #2eafd8;
      }
    }
    /deep/.el-pagination__jump {
      color: #fff;
      .el-pagination__editor {
        margin-left: 5px;
        margin-right: 5px;
        background: #052239;
        border: 1px solid #4b94c5;
        border-radius: 0;
        .el-input__inner {
          height: 26px;
          padding: 0;
          border: none;
          background: transparent;
          color: #fff;
        }
      }
    }
  }
}
</style>
