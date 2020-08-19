<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-08 10:21:52
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 17:25:22
 -->

<template slot-scope="scope">
  <!-- 预案库 -->
  <menuTree :menuList="['监狱管理','指挥中心','监管安全日报']">
    <tab
      slot="heade_btn"
      name="模板管理"
      :right="true"
      pathName="safety_daily_statistic"
      leftName="日报统计"
    />

    <table-view
      :tableData="tableData"
      noBottom
      v-loading="tableLoading"
      @sizeChange="getTemplateData"
    >
      <div slot="searchCondition">
        <el-form ref="form" class="yn_form" inline>
          <el-form-item label="创建时间:">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="searchData.date"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="模板名称:">
            <el-input
              class="yn_ipt"
              maxlength="10"
              v-model="searchData.reportName"
              placeholder="请输入模板名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" @click="getTemplateData" type="primary">查询</el-button>
            <el-button class="yn_btn" @click="reset" type="primary">重置</el-button>

            <el-button class="yn_btn" @click="downVisble=true" type="primary">新增模板</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="table-column">
        <el-table-column
          show-overflow-tooltip
          prop="reportName"
          label="模板名称"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="创建时间"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="reportContent"
          label="模板内容"
          width="width"
          align="center"
        ></el-table-column>

        <el-table-column show-overflow-tooltip label="包含关键字" width="width" align="center">
          <template slot-scope="{row}">
            <span v-for="(word,i) in row.list" :key="i">{{word.intro}}、</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <!-- <el-popover placement="top" trigger="manual" v-model="scope.row.visible"> -->
            <el-popover placement="top" trigger="hover">
              <div :style="{'text-align':'center'}">
                <el-button class="yn_text_btn moon" type="text" @click="setMoon(scope.row)">设为午间模板</el-button>
              </div>
              <div :style="{'text-align':'center'}">
                <el-button type="text" class="yn_text_btn night" @click="setnight(scope.row)">设为晚间模板</el-button>
              </div>
              <el-button
                slot="reference"
                type="text"
                class="yn_text_btn"
                v-show="scope.row.status==1"
                @click="openSet(scope.row)"
              >启用</el-button>
            </el-popover>
            <span class="moon" v-if="scope.row.status==2">已设为午间模板</span>
            <span class="night" v-if="scope.row.status==3">已设为晚间模板</span>

            <el-button
              type="text"
              :style="{'margin':'0 1rem'}"
              class="yn_text_btn"
              @click="editTemplate(scope.row)"
            >编辑</el-button>
            <el-button type="text" class="yn_text_btn" @click="delTemplate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <el-dialog
      :visible.sync="downVisble"
      class="yn_dialog"
      :title="isEidt?'编辑模板':'新建模板'"
      center
      width="70%"
      @close="dowmClose"
    >
      <el-form ref="form" class="yn_form" label-width="10rem" :model="transmitData" :rules="rules">
        <el-form-item prop="reportName" label="模板名称：">
          <el-input
            class="yn_ipt"
            :maxlength="1000"
            v-model="transmitData.reportName"
            placeholder="请输入模板名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="reportContent" label="上报内容：">
          <el-input
            class="yn_ipt"
            :maxlength="1000"
            type="textarea"
            v-model="transmitData.reportContent"
            placeholder="请输入模板内容"
          ></el-input>
        </el-form-item>

        <el-form-item label="关键词对照表：">
          <table-view :tableData="keyWordData" noBottom noPage noIndex height="40rem">
            <div slot="searchCondition">
              <el-button type="primary" class="yn_btn" @click="addNew">新增</el-button>
            </div>
            <template slot="table-column">
              <el-table-column show-overflow-tooltip label="含义" prop="intro" align="center">
                <template slot-scope="{row}">
                  <div v-show="!row.eidt">{{row.intro}}</div>
                  <el-input :maxlength="50" v-show="row.eidt" class="yn_ipt" v-model="row.intro"></el-input>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="占位符" prop="placeholder" align="center">
                <template slot-scope="{row}">
                  <div v-show="!row.eidt">{{row.placeholder}}</div>
                  <el-input
                    :maxlength="50"
                    v-show="row.eidt"
                    class="yn_ipt"
                    v-model="row.placeholder"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{row,$index}">
                  <el-button
                    v-show="!row.eidt"
                    type="text"
                    class="yn_text_btn"
                    @click="eidtKeyWord(row)"
                  >编辑</el-button>
                  <el-button
                    v-show="!row.eidt"
                    type="text"
                    class="yn_text_btn"
                    @click="delKeyWord($index)"
                  >删除</el-button>
                  <el-button
                    v-show="row.eidt"
                    type="text"
                    class="yn_text_btn"
                    @click="saveKeyWord(row)"
                  >保存</el-button>
                </template>
              </el-table-column>
            </template>
          </table-view>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(subTransmit)">确定</el-button>
        <el-button class="yn_btn" @click="downVisble=false">取消</el-button>
      </span>
    </el-dialog>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view/'
import { getPrisonId } from '@/utils'
import formatDate from '@/utils/date'
import tab from '@/components/tab/index.vue'
import { pickerOptions } from '@/utils/picker_option_config.js'
import menuTree from '@/components/menu_tree/'
import { Loading } from 'element-ui'
import {
  creatTemplate,
  useTemplates,
  editTemplates,
  delTemplate,
  getDailyDataList
} from './service.js'
var blank = new RegExp(/^\S*$/)
var special = new RegExp(
  /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/
)
export default {
  components: { tableView, tab, menuTree },

  data() {
    return {
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),
      tableData: { list: [], total: 0, pageNum: 1, pageSize: 10 },
      keyWordData: { list: [] },
      tableLoading: false,
      date: [],
      transmitData: {},

      rules: {
        reportName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        reportContent: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      downVisble: false,
      isEidt: false,
      searchData: {}
    }
  },
  created() {
    this.getTemplateData()
  },
  methods: {
    addNew() {
      this.keyWordData.list.push({ eidt: true })
    },
    eidtKeyWord(row) {
      row.eidt = true
    },
    setMoon(row) {
      let params = {}
      params.id = row.id
      params.status = 2
      useTemplates(params).then(res => {
        this.$message.success('设定成功')
        this.tableData.list.map(row => {
          row.visible = false
        })
        this.getTemplateData()
      })
    },
    setnight(row) {
      let params = {}
      params.id = row.id
      params.status = 3
      useTemplates(params).then(res => {
        this.$message.success('设定成功')
        this.tableData.list.map(row => {
          row.visible = false
        })
        this.getTemplateData()
      })
    },
    openSet(row) {
      this.tableData.list.map(item => {
        if (item.id != row.id) {
          item.visible = false
        } else {
          row.visible = !row.visible
        }
      })
      console.log(row)
    },
    saveKeyWord(row) {
      if (row.placeholder && row.intro) {
        if (!blank.test(row.placeholder) || !blank.test(row.intro)) {
          this.$message.error({ message: '不能包含空格,请重新输入' })
        } else if (special.test(row.placeholder) || special.test(row.intro)) {
          this.$message.error({ message: '不能包含特殊字符,请重新输入' })
        } else {
          row.eidt = false
          return true
        }
      } else {
        this.$message.error('请完整填写')
        return false
      }
    },
    delKeyWord(row) {
      this.keyWordData.list.splice(row, 1)
    },
    getTemplateData() {
      let params = {}
      params.currentPage = this.tableData.pageNum
      params.pageSize = this.tableData.pageSize
      getDailyDataList(params).then(res => {
        if (res) {
          this.tableData.list = res.rows
          this.tableData.total = res.total
        }
      })
    },

    // 重置查询参数
    reset() {
      this.tableData.pageNum = 1
      this.tableData.pageSize = 10
      this.tableData.list = []
      this.tableData.total = 0
      this.getTemplateData()
    },

    // 保存下达
    subTransmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isEidt) {
            let flag = true
            this.keyWordData.list.map(item => {
              if (item.eidt) {
                flag = this.saveKeyWord(item)
              }
            })
            if (flag) {
              this.transmitData.list = this.keyWordData.list
              editTemplates(this.transmitData).then(res => {
                this.$message.success('更新成功')
                this.downVisble = false
                this.reset()
              })
            }
          } else {
            let flag = true
            this.keyWordData.list.map(item => {
              if (item.eidt) {
                flag = this.saveKeyWord(item)
                console.log(flag)
              }
            })
            if (flag) {
              this.transmitData.list = this.keyWordData.list
              creatTemplate(this.transmitData).then(res => {
                this.$message.success('新增成功')
                this.downVisble = false
                this.reset()
              })
            }
          }
        } else {
          this.$message.error({ message: '请完整填写' })

          return false
        }
      })
    },

    delTemplate(val) {
      console.log(val)
      this.$confirm('此操作将永久删除, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTemplate(val.id).then(res => {
            this.$message.success('删除成功')
            this.getTemplateData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editTemplate(val) {
      console.log(val)
      this.downVisble = true
      this.transmitData = JSON.parse(JSON.stringify(val))
      this.keyWordData.list = JSON.parse(JSON.stringify(val)).list.map(item => {
        item.eidt = false
        return item
      })
      this.isEidt = true
    },

    dowmClose() {
      this.transmitData = {}
      this.keyWordData = { list: [] }
      this.isEidt = false
      this.$refs['form'].clearValidate()
    }
  },
  computed: {
    pickerOptions() {
      return pickerOptions
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .el-range-separator {
  width: 10%;
}
/deep/.el-select {
  width: 100%;
}
.detail_item {
  margin: 2rem 0;
  font-size: 1.4rem;
}
.moon {
  color: #e6a23c;
  font-size: 1.2rem;
}
.night {
  color: #f56c6c;
  font-size: 1.2rem;
}
.technology {
  .el-checkbox {
    color: #fff;

    .el-checkbox__label {
      color: #fff;
    }
  }
}
</style>
