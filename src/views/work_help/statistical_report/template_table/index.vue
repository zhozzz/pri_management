<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-18 10:58:40
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-09 14:27:33
 -->
<template>
  <menuTree :menuList="['工作辅助','数据统计报表']">
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="table_list" v-loading="loading">
          <div class="btns">
            <el-button
              type="primary"
              class="yn_btn"
              v-if="prisonId==1"
              @click="insertFlag=true"
            >新增模板</el-button>

            <!-- <el-switch
              class="yn_ipt"
              v-model="tableFlag"
              active-text="查看全部"
              inactive-text="查看已删除"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>-->
            <el-select v-model="tableFlag" placeholder="请选择" class="yn_ipt">
              <el-option label="查看全部" :value="1"></el-option>
              <el-option label="查看已删除" :value="0"></el-option>
            </el-select>
          </div>
          <div class="noMsg" v-if="tableList.length==0">暂无模板</div>
          <div
            class="items"
            @click="sel(i,item)"
            :class="active==i?'active':''"
            v-for="(item,i) in tableList"
            :key="i"
          >
            <div>{{item.templateName}}</div>

            <div class="yn_btn_box_inTable">
              <i class="el-icon-info" v-if="!item.isOld"></i>
              <el-button
                class="yn_text_btn"
                :style="{'color':'red'}"
                type="text"
                v-if="prisonId==1&&item.flag!=0&&item.isDown!=1"
                @click="delTemplate(item.id)"
              >删除</el-button>
              <!-- <el-button
                class="yn_text_btn"
                type="text"
                v-if="prisonId==1"
                @click="check(item.id)"
                :disabled="item.isDown==1"
              >{{item.isDown==0?'下发':'已下发'}}</el-button>-->
              <el-button
                class="yn_text_btn"
                :class="item.isDown==1?'suc':'war'"
                type="text"
                v-if="prisonId==1&&item.flag!=0"
                @click.stop="check(item)"
              >{{item.isDown==1?'已启用':'未启用'}}</el-button>
            </div>
          </div>

          <div class="pagination">
            <el-pagination
              :current-page.sync="tableListData.pageNum"
              :disabled="disabled()"
              small
              class="pagination-position"
              :page-size="tableListData.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="tableListData.total"
              @size-change="getTemplateList"
              @current-change="getTemplateList"
            ></el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="18" v-loading="tableLoading">
        <div class="info_box" v-if="column.length">
          <div class="table_title">当前日期:{{formatDate(new Date(),'yyyy-MM-dd')}}</div>
          <div class="table_title">填报周期:{{cycleName}}</div>
          <div class="table_title">是否重复填报:{{tableType==0?'否':'是'}}</div>
          <div class="table_title">模板描述:{{desc}}</div>
          <div class="btns">
            <el-button type="primary" class="yn_btn" @click="exportTemplate">报表生成</el-button>
            <el-button type="primary" class="yn_btn" v-if="prisonId!=1" @click="report">填报</el-button>
          </div>
        </div>
        <table-view
          v-if="column.length"
          noBottom
          noIndex
          noPage
          :tableData="tableData"
          v-loading="tableLoading"
          :spanMethod="arraySpanMethod"
          :haveTeBorder="true"
        >
          <div slot="searchCondition">
            <el-form class="yn_form" inline>
              <el-form-item v-if="prisonId==1" label="选择监狱:">
                <el-select filterable v-model="params.aimPrisonId" placeholder="请选择" class="yn_ipt">
                  <el-option
                    v-for="item in prisonList"
                    :key="item.id"
                    :label="item.departName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="填报时间:">
                <el-date-picker
                  v-model="params.date"
                  type="date"
                  align="right"
                  :picker-options="pickerOptions"
                  :clearable="false"
                  class="yn_ipt"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="yn_btn" @click="reset">重置</el-button>
                <el-button type="primary" class="yn_btn" @click="select">查询</el-button>
              </el-form-item>
            </el-form>
            <div class="yn_page_title" v-if="weekDays">当前查询周期为：{{weekDays}}</div>
          </div>
          <template slot="table-column">
            <el-table-column
              v-if="prisonId==1"
              prop="prison_name"
              label="监狱名"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              v-if="prisonId==1&&tableType==1"
              prop="spanNum"
              label="填报次数"
              align="center"
            ></el-table-column>
            <el-table-column prop="date" label="填报时间" align="center">
              <template slot-scope="{row}">
                <div v-if="row.id">{{formatDate(new Date(row.date),'yyyy-MM-dd')}}</div>
              </template>
            </el-table-column>

            <!-- 复杂表头使用组件，组件内如有子级，自己调用自己 -->
            <my-column v-for="(item,i) in column" :key="i" :col="item" />

            <!-- 简单表头 -->
            <!-- <el-table-column
              show-overflow-tooltip
              v-for="(item,i) in column"
              :key="i"
              :prop="item.fieldNameTrue"
              :label="item.fieldName"
              align="center"
              :min-width="item.fieldName.length*20+20"
            ></el-table-column>-->

            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <div class="yn_btn_box_inTable" v-if="row.flag!=0">
                  <!-- <el-button type="text" class="yn_text_btn" @click="delOne(row.id)">删除</el-button> -->
                  <el-button
                    type="text"
                    v-if="row.ifCanEdit==0&&prisonId==1"
                    @click="handleAuthorize(row)"
                    class="yn_text_btn"
                  >授权</el-button>
                  <!-- <el-button
                    type="text"
                    v-if="row.ifCanEdit==0&&prisonId!=1"
                    class="yn_text_btn"
                  >申请授权</el-button>-->
                  <el-button
                    v-if="row.ifCanEdit==1&&row.prison_id != 0&&prisonId !=1"
                    type="text"
                    class="yn_text_btn"
                    @click="editOne(row)"
                  >修改</el-button>
                  <el-button
                    v-if="prisonId==1"
                    type="text"
                    class="yn_text_btn"
                    @click="editOne(row)"
                  >修改</el-button>
                </div>
              </template>
            </el-table-column>
          </template>
        </table-view>

        <div class="msg_title" v-else>请选择查看模板</div>
      </el-col>
    </el-row>

    <el-dialog title="新建模板" center :visible.sync="insertFlag" width="40%" class="yn_dialog">
      <el-form class="yn_form" ref="form">
        <el-form-item label="模板名称" prop="templateName">
          <el-input class="yn_ipt" maxlength="40" v-model="templateName" placeholder="请输入模板名称"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" type="primary" @click="goPage">确 定</el-button>
        <el-button class="yn_btn" type="primary" @click="insertFlag=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="isEdit?'修改':'填报'"
      center
      :visible.sync="reportVisible"
      width="60%"
      class="yn_dialog"
      :before-close="handleClose"
    >
      <el-form class="yn_form" ref="form" label-width="20rem">
        <el-form-item
          v-for="(item,i) in column"
          :key="i"
          :prop="item.fieldName"
          :label="item.fieldName"
        >
          <el-input
            class="yn_ipt"
            :maxlength="item.fieldType==1?20:500"
            :type="item.fieldType==1?'number':'text'"
            v-model="reportData[item.fieldName]"
            placeholder="请输入"
          ></el-input>
          <div class="tips" v-if="item.fieldType==1">请输入数字</div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" type="primary" @click="subReport">确 定</el-button>
        <el-button class="yn_btn" type="primary" @click="reportVisible=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改"
      center
      :visible.sync="reportEidtVisible"
      width="60%"
      class="yn_dialog"
      :before-close="handleClose"
    >
      <el-form class="yn_form" ref="form" label-width="20rem">
        <el-form-item
          v-for="(item,i) in column"
          :key="i"
          :prop="item.fieldNameTrue"
          :label="item.fieldName"
        >
          <el-input
            class="yn_ipt"
            :maxlength="item.fieldType==1?20:500"
            :type="item.fieldType==1?'number':'text'"
            v-model="reportData[item.fieldNameTrue]"
            placeholder="请输入"
          ></el-input>
          <div class="tips" v-if="item.fieldType==1">请输入数字</div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button class="yn_btn" v-loading="btnLoading" type="primary" @click="subReport">确 定</el-button>
        <el-button class="yn_btn" type="primary" @click="reportEidtVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import menuTree from '@/components/menu_tree/'
import myColumn from './column.vue'
import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import formatDate from '@/utils/date.js'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
import {
  getTemplateList,
  getReportInfo,
  delTemplate,
  exportTemplate,
  selOneDetail,
  downReport,
  postReport,
  deleteOneRecord,
  updateOneRecord,
  toOld,
  selOneDetailByParam,
  getWeekDay,
  handleAuthorize
} from './service'
var special = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/
)
var blank = new RegExp(/^\S*$/)

var noNumber = new RegExp(/\d+/)

export default {
  components: { tableView, menuTree, myColumn },
  data() {
    return {
      tableData: {
        list: [],
        total: null
      },
      tableList: [],
      prisonList: [],
      prisonId: getPrisonId(),
      templateName: '',
      tableName: '',
      loading: false,
      insertFlag: false,
      column: [],
      active: null,
      reportVisible: false,
      reportEidtVisible: false,
      reportData: {},
      activeID: '',
      isEdit: false,
      tableLoading: false,
      desc: '',
      cycleName: '',
      typeList: [
        { name: '每日', value: 0 },
        { name: '每周', value: 1 },
        { name: '每月', value: 2 }
      ],
      selStr: '',
      params: { date: new Date() },
      pickerOptions: {
        disabledDate: function(date) {
          return date.getTime() > new Date().getTime()
        }
      },
      tableType: null,
      weekDays: null,
      btnLoading: false,
      tableListData: { total: 0, pageSize: 10, pageNum: 1 },
      tableFlag: 1 //没有软删正常状态，软删后为0
    }
  },
  methods: {
    getpridata() {
      let that = this
      if (sessionStorage.getItem('prisonTree')) {
        that.prisonList = JSON.parse(
          sessionStorage.getItem('prisonTree')
        )[0].list
      } else {
        this.axios
          .get(this._global.userUrl + '/compose/getLeftTree/')
          .then(response => {
            that.prisonList = response.list
          })
      }
    },
    getTemplateList() {
      this.loading = true
      //   let str = this.prisonId
      let data = {
        prisonId: this.prisonId,
        currentPage: this.tableListData.pageNum,
        pageSize: this.tableListData.pageSize,
        flag: this.tableFlag
      }
      getTemplateList(data).then(res => {
        if (res) {
          this.tableList = res.rows.map(item => {
            // item.templateName = item.templateName.slice(16)
            return item
          })
          this.tableListData.total = res.total
          this.loading = false

          if (this.tableList.length && this.active != null) {
            this.sel(this.active, this.tableList[this.active])
          }
        }
      })
    },

    //表格行列合并函数
    arraySpanMethod({ row, col, rowIndex, columnIndex }) {
      //非重复填报表格 合并合计列
      if (this.prisonId == 1) {
        if (this.tableType == 0) {
          if (row.prison_id == 0 && columnIndex == 0) {
            return [1, 2]
          } else if (row.prison_id == 0 && columnIndex == 1) {
            return [0, 0]
          }
        } else {
          if (columnIndex == 0 || columnIndex == 1) {
            if (row.spanNum == 0) {
              return [0, 0]
            } else {
              return [row.spanNum, 1]
            }
          }
        }
      } else {
        return [1, 1]
      }
    },

    //重复填报表格合并同一监狱的多次记录
    setSpan(arr, index) {
      if (arr[index - 1]) {
        if (arr[index - 1].prison_id == arr[index].prison_id) {
          arr[index].spanNum = 0
        } else {
          arr[index].spanNum = 0
          arr.map((item, i) => {
            if (item.prison_id == arr[index].prison_id) {
              arr[index].spanNum += 1
            }
          })
        }
      } else {
        arr[index].spanNum = 0
        arr.map((item, i) => {
          if (item.prison_id == arr[index].prison_id) {
            arr[index].spanNum += 1
          }
        })
      }
      if (index < arr.length - 1) {
        this.setSpan(arr, index + 1)
      }
    },
    sel(i, obj) {
      this.column = []
      this.params = { date: new Date() }
      this.active = i
      this.activeID = obj.id
      this.desc = obj.desc
      this.tableName = obj.templateName
      this.cycleName = this.typeList.filter(item => {
        return item.value == obj.cycleType
      })[0].name

      let str = obj.id + '/' + this.prisonId
      this.selStr = str
      this.tableLoading = true
      if (!obj.isOld) {
        toOld(str).then(res => {
          this.getTemplateList()
        })
      }
      getReportInfo(obj.id).then(res => {
        if (res) {
          //单一表头
          this.column = res

          //复杂表头
          //   this.column = res.fieldTree
          //   this.column.map(item => {
          //     if (item.children.length) {
          //       item.children.map(son => {
          //         item.childHTML = this.createEL(son)
          //       })
          //     }
          //   })
          //   console.log(this.column)
        }

        this.select()
        // selOneDetail(str).then(res2 => {
        //   this.tableData.list = res2
        //   this.tableLoading = false
        // })
      })
    },
    createEL(val) {
      //创建vnode
      const h = this.$createElement
      return h(
        'el-table-column',
        {
          props: {
            prop: val.fieldNameTrue,
            label: val.fieldName
          }
        },
        [val.children ? val.children.map(item => this.createEL(item)) : '']
      )

      //模板字符串，递归调用
      //   return `<el-table-column prop="${val.fieldNameTrue}" :label="${
      //     val.fieldName
      //   }" align="center">${
      //     val.children ? val.children.map(item => this.createEL(item)) : ''
      //   }</el-table-column>`
    },
    check(val) {
      let str = val.id + '/' + (val.isDown == 0 ? 1 : 0)
      downReport(str).then(res => {
        this.$message.success('修改成功')
        this.active = null
        this.activeID = ''
        this.column = []
        this.tableData.list = []
        this.getTemplateList()
      })
    },
    report() {
      this.reportVisible = true
      this.isEdit = false

      this.reportData = {}
    },
    subReport() {
      let record = {}
      let flag = true

      if (flag) {
        if (this.isEdit) {
          this.column.map(key => {
            if (!this.reportData[key.fieldNameTrue]) {
              flag = false
              return
            } else if (
              key.fieldType == 1 &&
              isNaN(this.reportData[key.fieldNameTrue])
            ) {
              flag = false
              return
            } else {
              record[key.fieldNameTrue] = this.reportData[key.fieldNameTrue]
            }
          })
          let params = {}
          params.templateId = this.activeID
          params.recordId = this.reportData.id
          params.fieldList = []
          for (const key in record) {
            params.fieldList.push({ fieldName: key, fieldValue: record[key] })
          }
          this.btnLoading = true

          updateOneRecord(params)
            .then(res => {
              this.$message.info('修改完成')
              this.reportEidtVisible = false
              this.btnLoading = false

              this.getTemplateList()
            })
            .catch(err => {
              this.btnLoading = false
              this.reportVisible = false
            })
        } else {
          this.column.map(key => {
            if (!this.reportData[key.fieldName]) {
              flag = false
              return
            } else if (
              key.fieldType == 1 &&
              isNaN(this.reportData[key.fieldName])
            ) {
              flag = false
              return
            } else {
              record[key.fieldName] = this.reportData[key.fieldName]
            }
          })
          let str = this.tableList[this.active].id + '/' + this.prisonId
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })

          postReport(str, [record])
            .then(res => {
              this.select()
              this.$message.success('填报完成')

              this.reportVisible = false
              loading.close()
            })
            .catch(err => {
              this.reportVisible = false

              loading.close()
            })
        }
      } else {
        this.$message.error('请正确填写')
      }
    },
    delTemplate(id) {
      // this.$refs.tree.getCurrentKey
      this.$confirm(`删除将失去已填报数据，是否删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTemplate(id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTemplateList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    delOne(id) {
      this.$confirm(`确认删除记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let str = this.tableList[this.active].id + '/' + id
          deleteOneRecord(str).then(res => {
            this.$message.success('删除完成')
            this.getTemplateList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    editOne(val) {
      this.reportData = JSON.parse(JSON.stringify(val))
      this.reportEidtVisible = true
      this.isEdit = true
    },
    goPage() {
      if (this.templateName) {
        // if (special.test(this.templateName)) {
        //   this.$message({
        //     type: 'error',
        //     message: '模板名称不能包含特殊字符'
        //   })
        // } else
        // if (!blank.test(this.templateName)) {
        //   this.$message({
        //     type: 'error',
        //     message: '模板名称不能包含空格'
        //   })
        // } else
        // if (noNumber.test(this.templateName)) {
        //   this.$message({
        //     type: 'error',
        //     message: '模板名称不能包含数字'
        //   })
        // } else {
        this.$router.push({
          name: 'edit_template',
          query: { templateName: this.templateName, insert: 1 }
        })
        // }
      } else {
        this.$message({
          type: 'error',
          message: '模板名称不能为空'
        })
      }
    },

    exportTemplate() {
      //纯前端导出
      //   var wb = XLSX.utils.table_to_book(document.querySelector('.eltable'))
      //   /* get binary string as output */
      //   var wbout = XLSX.write(
      //     wb,
      //     {
      //       bookType: 'xlsx',
      //       bookSST: true,
      //       type: 'array'
      //     },
      //     {
      //       alignment: {
      //         vertical: 'center',
      //         horizontal: 'center'
      //       }
      //     }
      //   )
      //   try {
      //     FileSaver.saveAs(
      //       new Blob([wbout], { type: 'application/octet-stream' }),
      //       this.tableName +
      //         '-' +
      //         formatDate(new Date(this.params.date), 'yyyy-MM-dd') +
      //         '.xlsx'
      //     )
      //   } catch (e) {
      //     if (typeof console !== 'undefined') console.log(e, wbout)
      //   }
      //   return wbout

      let str = this.activeID + '/' + this.prisonId
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      exportTemplate(str)
      setTimeout(() => {
        loading.close()
      }, 2000)
    },
    select() {
      let params = this.params
      this.weekDays = null
      this.tableLoading = true
      params.id = this.activeID
      params.prisonId = this.prisonId
      //   if (this.params.date && this.params.date.length > 0) {
      //     params.beginDate =
      //       formatDate(this.params.date[0], 'yyyy-MM-dd') + ' 00:00:00'
      //     params.endDate =
      //       formatDate(this.params.date[1], 'yyyy-MM-dd') + ' 23:59:59'
      //   }
      params.date =
        formatDate(new Date(this.params.date), 'yyyy-MM-dd') + ' 00:00:00'

      //获取周起始日期
      if (this.cycleName == '每周') {
        getWeekDay(params.date).then(res => {
          console.log(res)
          this.weekDays =
            formatDate(new Date(res.beginDate), 'yyyy-MM-dd') +
            '-' +
            formatDate(new Date(res.endDate), 'yyyy-MM-dd')
        })
      } else if (this.cycleName == '每月') {
        this.weekDays = new Date(this.params.date).getMonth() + 1 + '月'
      }

      selOneDetailByParam(params).then(res => {
        this.tableData.list = res.data
        this.tableLoading = false
        this.tableType = res.fillType
        if (
          this.prisonId == 1 &&
          this.tableType == 1 &&
          this.tableData.list.length > 0
        ) {
          this.setSpan(this.tableData.list, 0)
        }
      })
    },
    reset() {
      this.tableLoading = true
      this.params = { date: new Date() }
      this.select()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    //省局授权
    handleAuthorize(row) {
      handleAuthorize(row.id).then(res => {
        this.$message.success('操作完成')
        this.select()
      })
    },

    disabled() {
      if (this.tableListData.total) {
        if (this.tableListData.total > this.tableListData.pageSize) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  },
  mounted() {
    this.getTemplateList()
    if (this.prisonId == 1) {
      this.getpridata()
    }
  },
  watch: {
    tableFlag() {
      this.getTemplateList()
    }
  }
}
</script>
<style lang="less" scoped>
.msg_title {
  width: 100%;
  font-size: 2rem;
  font-weight: 600;
  color: #ccc;
  text-align: center;
}
.el-icon-info {
  font-size: 1.2rem;
  color: red;
}
.suc {
  color: #67c23a;
}
.war {
  color: red;
}

.table_title {
  margin: 0.5rem 0;
  font-size: 16/14rem;
  padding: 0 1rem;
}
.btns {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
  padding-right: 1rem 0.5rem;
}

.yn_page {
  .info_box {
    box-shadow: #9cbef7 0px 0px 5px inset;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    color: #333;
  }

  .table_list {
    width: 100%;
    box-shadow: #9cbef7 0px 0px 10px inset;
    padding: 1rem 0;
    border-radius: 4px;
    max-height: 100vh;
    overflow: scroll;
    .noMsg {
      width: 100%;
      text-align: center;
      color: #ccc;
      font-size: 1.1rem;
      margin: 1rem 0;
    }
    .items {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      padding: 1rem;
      margin: 0.2rem 0;
      &:hover {
        background: #dfedfe;
        color: #333;
      }
    }
    .active {
      background: #dfedfe;
    }
  }
  .tips {
    font-size: 1.1rem;
    color: rgb(255, 109, 109);
    line-height: 1rem;
  }
  /deep/.el-form-item {
    margin-bottom: 1rem;
  }
  .pagination {
    /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      background: #333;
    }
  }
}

.technology {
  .yn_page {
    .table_list,
    .info_box {
      background: transparent;
      color: white;
      border: 1px solid #7cdafd;
      box-shadow: 28px 0 28px -28px #8fdcf9 inset,
        0 28px 28px -28px #8fdcf9 inset, 0 -28px 28px -28px #8fdcf9 inset,
        -28px 0 28px -28px #8fdcf9 inset;

      .active {
        background: radial-gradient(#104087, #5ca8f7) !important;
        &:hover {
          color: #fff;
        }
      }
      .items {
        &:hover {
          background: radial-gradient(#104087, #5ca8f7) !important;
          color: #fff;
        }
      }
    }
  }
  .msg_title,
  .table_title {
    color: #fff;
  }
  .pagination {
    /deep/.el-pagination__total,
    /deep/.el-pagination__jump {
      color: #fff;
    }
    /deep/.btn-prev,
    /deep/ .btn-next {
      color: #fff;

      background: transparent;
      border: 1px solid #4b94c5;
    }
    /deep/.el-pager {
      li {
        color: #fff;
        background: transparent;
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
        background: transparent;
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
