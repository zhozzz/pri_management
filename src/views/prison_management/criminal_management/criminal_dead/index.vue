<!--
 * @Description: 罪犯死亡管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:43:20
 * @todo:查询未整合入组织架构id
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯死亡']">
      <tab slot="heade_btn" name="罪犯死亡管理" :right="true" pathName="dead_statisic" />
      <table-view :tableData="tableData" noBottom @sizeChange="sizeChange" v-loading="loadingFlag">
        <div slot="searchCondition">
          <el-form
            ref="searchForm"
            class="yn_form"
            :model="queryParams"
            label-width="8rem"
            :rules="searchRules"
            inline
          >
            <el-form-item label="罪犯姓名:" prop="criminalName">
              <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
            </el-form-item>

            <el-form-item label="罪犯编号:" prop="criminalNum">
              <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
            </el-form-item>

            <!-- <el-form-item label="性别:" prop="zfGender">
              <el-select class="yn_ipt" v-model="queryParams.gender">
                <el-option
                  v-for="(item,i) in sexlist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="是否重点罪犯:" label-width="8rem" prop="ifKeyCriminal">
              <el-select class="yn_ipt" v-model="queryParams.ifKeyCriminal">
                <el-option
                  v-for="(item,i) in keylist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属监区:" prop="areaId">
              <!-- <el-select class="yn_ipt" v-model="queryParams.areaId">
                <el-option
                  v-for="(item,i) in selArealist"
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

            <el-form-item label="死亡地点类型:" label-width="8rem" prop="deathPlaceType">
              <el-select class="yn_ipt" v-model="queryParams.deathPlaceType">
                <el-option
                  v-for="(item,i) in deathTypelist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="死亡时间:" prop="date">
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
            <el-form-item>
              <el-button class="yn_btn" @click="search" type="primary">查询</el-button>
              <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
            </el-form-item>
            <el-form-item v-if="userPrisonId!=1">
              <el-button type="primary" class="yn_btn yn_long_btn" @click="dieVisible=true">罪犯死亡登记</el-button>
            </el-form-item>
          </el-form>
          <die-dialog
            :handleCloseDie="handleCloseDie"
            :dieVisible="dieVisible"
            :criminalId="null"
            @dieSubmit="dieSubmit"
          ></die-dialog>
        </div>
        <template slot="table-column">
          <el-table-column align="center" show-overflow-tooltip prop="zfNum" label="罪犯编号" />
          <el-table-column align="center" prop="zfName" label="姓名" />
          <!-- <el-table-column align="center" show-overflow-tooltip prop="zfCard" label="身份证号" /> -->
          <!-- <el-table-column align="center" prop="zfGender" :formatter="formSex" label="性别" /> -->
          <el-table-column align="center" prop="zfTypeValue" :formatter="formType" label="分管等级" />
          <el-table-column align="center" show-overflow-tooltip prop="deathTime" label="死亡时间" />
          <el-table-column align="center" show-overflow-tooltip prop="intoTime" label="入监时间" />
          <el-table-column
            min-width="100"
            align="center"
            prop="deptId"
            :formatter="formArea"
            label="所属监区"
          />
          <el-table-column
            align="center"
            prop="zfAccusationValue"
            :formatter="formCriminalName"
            show-overflow-tooltip
            label="罪名"
          />
          <el-table-column align="center" prop="deathPlaceType" :formatter="formIN" label="死亡地点类型" />
          <el-table-column align="center" prop="isKey" :formatter="formISkey" label="是否重点罪犯" />
          <el-table-column align="center" show-overflow-tooltip prop="remark" label="备注" />
          <el-table-column align="center" label="责任警员" />
          <el-table-column align="center" prop="prop" label="操作">
            <template slot-scope="scope">
              <criminalFile :criminalId="scope.row.id">查看档案</criminalFile>
            </template>
          </el-table-column>
        </template>
      </table-view>
    </menuTree>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import tableView from '@/components/table_view/'
import _global from '@/utils/global_url'
import { expnoraml, Isname, isIDCard } from '@/utils/form_valid.js'
import { MessageBox, Message } from 'element-ui'
import deptLayout from '@/components/deptLayout/index.vue'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'
import dieDialog from '@/components/criminal_dialog/criminal_register_dialog/die_dialog.vue'

import { getPrisonId } from '@/utils'
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import { formatDate } from '../../../../utils/date'
export default {
  components: {
    tableView,
    deptLayout,
    criminalFile,
    tab,
    menuTree,
    dieDialog
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
        pageSize: 5
      },
      loadingFlag: true,
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      queryParams: {
        deptId: '',
        criminalNum: '',
        areaId: '',
        criminalName: '',
        startTime: '',
        endTime: '',
        gender: '',
        currentPage: 1,
        pageSize: 5
      },
      sexlist: [
        { value: 1, label: '男' },
        { value: 0, label: '女' }
      ],
      keylist: [
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      inlist: [
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      typelist: [], // 类型
      CriminalNamelist: [], // 罪名
      arealist: [], // 监区
      selArealist: [],
      deptType: '', // 部门类型
      searchRules: {
        criminalName: [
          { validator: Isname, trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2到 15 个字符', trigger: 'blur' }
        ],
        criminalNum: [
          { min: 2, max: 20, message: '长度在 2到 20 个字符', trigger: 'blur' }
        ]
      },
      fileFlag: false,
      criminalId: '',
      dieVisible: false,
      deathTypelist: []
    }
  },
  created() {
    if (this.$route.params.ifInPrison) {
      this.queryParams.ifInPrison = this.$route.params.ifInPrison
    }
    this.query()
    this.getType()
    this.getCriminalName()
    this.getDeptType()
  },
  methods: {
    handleCloseDie() {
      this.dieVisible = false
      this.resetInfo()
    },
    dieSubmit(val) {
      this.$emit('dieSubmit', val)
    },
    topage() {
      this.$router.push({ name: 'dead_statisic' })
    },
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
        .get(this._global.userUrl + '/dictionary/option/DeathPlaceType')
        .then(response => {
          this.deathTypelist = response
          console.log(this.deathTypelist)
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
          // 获取监区
          this.getArea()
        })
        .catch(error => {
          console.log(error)
        })
    },
    getArea() {
      let user = JSON.parse(localStorage.getItem('user'))

      this.axios
        .get(
          this._global.userUrl +
            '/compose/getDeptAreaByPrisonId?prisonId=' +
            user.prisonId
        )
        .then(res => {
          this.selArealist = res.list
        })
      this.axios
        .get(this._global.userUrl + '/compose/getChildrenTree/' + user.prisonId)
        .then(res => {
          this.selectArea([res])
        })
    },
    selectArea(arr) {
      arr.forEach(item => {
        item.departType == this.deptType ? this.arealist.push(item) : ''
        if (item.list) {
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
    // 查询
    query() {
      this.queryParams.deptId = this.prisonId
      let param = {}
      let start = this.queryParams.startTime
      let end = this.queryParams.endTime
      Object.assign(param, this.queryParams)
      this.loadingFlag = true
      param.startTime =
        start == null || start === ''
          ? ''
          : formatDate(this.queryParams.startTime, 'yyyy-MM-dd hh:mm:ss')
      param.endTime =
        end == null || end === ''
          ? ''
          : formatDate(this.queryParams.endTime, 'yyyy-MM-dd hh:mm:ss')
      this.axios
        .post(_global.businessUrl + '/criminalDeath/query', param)
        .then(data => {
          this.tableData.list = data.list
          this.tableData.total = data.total
          this.loadingFlag = false
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
        pageSize: 5,
        currentPage: 1
      }
      this.date = []

      this.$refs['searchForm'].clearValidate()
      this.query()
    },

    // 格式化数据
    formCriminalName(row, column, cellValue, index) {
      let str = ''
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
    formIN(row, column, cellValue, index) {
      let name = ''
      this.deathTypelist.forEach(item => {
        item.value == cellValue ? (name = item.label) : ''
      })
      return name
    },
    formISkey(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '是'
      } else {
        return '否'
      }
    },
    nodeClick(val) {
      console.log(val)
      this.prisonId = val.id
      console.log(this.prisonId)
    }
  },
  watch: {
    prisonId(val) {
      console.log(val)

      this.query()
    }
  }
}
</script>

<style scoped lang='less'>
.yn_ipt {
  width: 100%;
}
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
  width: 100%;
  font-size: 1.2rem;
}
</style>
