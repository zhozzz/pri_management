<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-12 10:10:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-16 18:02:32
 -->
<template>
  <div class="main_page daily" v-loading="tableLoading">
    <el-form ref="form" inline label-width="80px">
      <!-- <el-form-item>
        <el-select class="yn_ipt" v-model="type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-date-picker
          class="yn_ipt"
          v-model="queryTime"
          type="date"
          :clearable="false"
          @change="query"
          placeholder="选择日期"
          :picker-options="{
              disabledDate(date){
                return date.getTime()>new Date().getTime()
              }
          }"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="yn_btn yesterday_btn" @click="yesterday">前一天</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="yn_btn nextday_btn"
          :disabled="queryTime.getTime()>new Date().getTime()-24*3600*1000"
          @click="tomorrow"
        >后一天</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="yn_btn" @click="today">今天</el-button>
      </el-form-item>
      <!-- <el-form-item v-if="prisonId!=='1'">
        <el-button
          type="primary"
          class="yn_btn"
          v-if="btnPermissions"
          @click="$router.push({name:'safety_daily_push'})"
        >上报</el-button>
      </el-form-item>-->
    </el-form>
    <div class="yn_page_title">当前单位值班领导:{{dutyLeader}}</div>
    <el-row>
      <el-col :span="4">
        <div class="tab" :class="activeName==0?'active':''" @click="handleClick(0)">午间上报</div>
      </el-col>
      <el-col :span="4">
        <div class="tab" :class="activeName==1?'active':''" @click="handleClick(1)">晚间上报</div>
      </el-col>

      <el-col :span="6" :offset="1">
        <el-button
          type="primary"
          class="yn_btn"
          v-if="btnPermissions&&prisonId!=1"
          @click="keyWordVisible=true"
        >关键词管理</el-button>
      </el-col>
    </el-row>
    <div class="daliy_main">{{activeMain.reportContent}}</div>
    <el-button
      type="primary"
      v-if="prisonId!=1&&btnPermissions&&inTime"
      :disabled="(activeMain.reportStatus==2&&activeName==0)||(activeMain.reportStatus==3&&activeName==1)"
      class="yn_btn"
      @click="reportVisible=true"
    >上报</el-button>
    <el-dialog :visible.sync="keyWordVisible" class="yn_dialog" title="关键词对照表" center>
      <table-view noBottom noPage noIndex noSearch :tableData="{list:KeyWordList}">
        <template slot="table-column">
          <el-table-column label="含义" prop="intro" />
          <el-table-column label="占位符" prop="placeholder" />
          <el-table-column label="实际内容">
            <template slot-scope="{row}">
              <el-input
                class="yn_ipt"
                maxlength="10"
                v-model="row.substitution"
                placeholder="请输入实际内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="primary" class="yn_btn" @click="subKeyWord(row)">保存</el-button>
            </template>
          </el-table-column>
        </template>
      </table-view>
      <div slot="footer"></div>
    </el-dialog>

    <el-dialog :visible.sync="reportVisible" class="yn_dialog" title="确认上报" center>
      <div class="daliy_main">{{activeMain.reportContent}}</div>
      <div slot="footer">
        <el-button type="primary" class="yn_btn" @click="report">确认上报</el-button>
        <el-button type="primary" class="yn_btn" @click="reportVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableView from '@/components/table_view'
// import deptLayout from '@/components/deptLayout/dailyIndex.vue'
import { listDailyReport, upDataKey, report, getLeader } from './service'
import { formatDate } from '@/utils/date'
import { getPrisonId } from '@/utils'
import permissions from '@/utils/permission.js'

export default {
  components: { tableView },
  props: ['changePrisonId', 'date', 'time'],
  data() {
    return {
      btnPermissions: permissions('safety_daily_push_button'),
      tableLoading: false,
      prisonId: getPrisonId(),
      queryTime: this.date ? this.date : new Date(),
      type: '',
      options: [
        { label: '普通值班人员', value: 1 },
        { label: '值班长', value: 0 }
      ],
      activeName: 0,
      activeMain: '',
      keyWordVisible: false,
      reportVisible: false,
      dailyList: [],
      KeyWordList: [],
      inTime: true,
      dutyLeader: ''
    }
  },

  methods: {
    today() {
      this.queryTime = new Date()
      this.query()
    },
    yesterday() {
      let queryTime = this.queryTime.getTime() - 24 * 60 * 60 * 1000

      this.queryTime = new Date(queryTime)
      this.query()
    },
    tomorrow() {
      let queryTime = this.queryTime.getTime() + 24 * 60 * 60 * 1000
      this.queryTime = new Date(queryTime)
      this.query()
    },
    getLeader() {
      let str =
        this.changePrisonId + '/' + formatDate(this.queryTime, 'yyyy-MM-dd')
      getLeader(str).then(res => {
        console.log(res)
        if (res.departs[0].rotas.length) {
          this.dutyLeader = ''
          res.departs[0].rotas.map((item, i) => {
            if (item.users) {
              item.users.map((user, j) => {
                if (i < res.departs[0].rotas.length - 1) {
                  this.dutyLeader = user.userName + '、'
                } else {
                  this.dutyLeader = user.userName
                }
              })
            }
          })
        } else {
          this.dutyLeader = '暂无领导'
        }
      })
    },
    query() {
      this.tableLoading = true
      //   let a = this.activeName
      //   this.activeName = null
      this.getLeader()
      this.dailyList = ['', '']
      listDailyReport({
        reportTime: formatDate(this.queryTime, 'yyyy-MM-dd'),
        prisonId: this.changePrisonId
      }).then(
        res => {
          if (res) {
            res.map(item => {
              if (item.status == 2) {
                this.dailyList[0] = item
              } else if (item.status == 3) {
                this.dailyList[1] = item
              }
            })
            // this.activeName = a

            this.activeMain = this.dailyList[this.activeName]
            this.KeyWordList = this.dailyList[this.activeName].list
          }

          this.tableLoading = false
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    breakinspectMembers(v) {
      return JSON.parse(v)
    },
    handleClick(val) {
      this.activeName = val
      this.activeMain = this.dailyList[val]
      this.KeyWordList = this.dailyList[val].list
    },
    subKeyWord(row) {
      upDataKey(row).then(res => {
        this.$message.success('已保存')
        this.query()
      })
    },
    report() {
      let params = {}
      //   params.id = this.activeMain.id
      params.superviseId = this.activeMain.id
      params.status = this.activeMain.status
      params.list = this.activeMain.list
      params.reportContent = this.activeMain.reportContent

      params.prisonId = this.prisonId
      params.reportTime = formatDate(this.queryTime, 'yyyy-MM-dd')
      report(params).then(res => {
        this.reportVisible = false
        this.$message.success('完成上报')
        this.query()
      })
    }
  },
  mounted() {
    this.query()
  },
  watch: {
    changePrisonId() {
      this.query()
    },
    time: {
      deep: true,
      handler(val) {
        let a = this.activeName
        this.activeName = a
        console.log(this.inTime)
        this.query()
      }
    },

    activeName(val) {
      if (
        new Date(this.queryTime).getTime() <
        new Date().getTime() - 23 * 1000 * 3600
      ) {
        this.inTime = true
      } else {
        if (val == 0) {
          let now = new Date(
            new Date('2020/01/01 ' + formatDate(new Date(), 'hh:mm:ss'))
          ).getTime()

          let begin = new Date(
            new Date(
              '2020/01/01 ' +
                formatDate(new Date(this.time[2].beginTime), 'hh:mm:ss')
            )
          ).getTime()
          let end = new Date(
            new Date(
              '2020/01/01 ' +
                formatDate(new Date(this.time[2].endTime), 'hh:mm:ss')
            )
          ).getTime()

          if (now > begin && now < end) {
            this.inTime = true
          } else {
            this.inTime = false
          }
        } else {
          let now = new Date(
            new Date('2020/01/01 ' + formatDate(new Date(), 'hh:mm:ss'))
          ).getTime()

          let begin = new Date(
            new Date(
              '2020/01/01 ' +
                formatDate(new Date(this.time[3].beginTime), 'hh:mm:ss')
            )
          ).getTime()
          let end = new Date(
            new Date(
              '2020/01/01 ' +
                formatDate(new Date(this.time[3].endTime), 'hh:mm:ss')
            )
          ).getTime()
          if (now > begin && now < end) {
            this.inTime = true
          } else {
            this.inTime = false
          }
        }
      }

      console.log(this.inTime)
    }
  }
}
</script>
<style lang="less" scoped>
.tab {
  text-align: center;
  font-size: 1.4rem;
  padding: 1rem;
}
.daliy_main {
  width: 100%;
  border: 1px solid #409eff;
  margin: 1rem 0;
  padding: 2rem;
  box-sizing: border-box;
  font-size: 1.2rem;
  border-radius: 4px;
}
.technology {
  .el-tabs {
    color: #fff;

    /deep/.el-tabs__item {
      color: #fff;
    }
    /deep/.el-tabs__item.is-active,
    /deep/.el-tabs__item:hover {
      color: #409eff;
    }
  }
  .daliy_main,
  .tab {
    color: #fff;
  }
}
.active {
  border-bottom: 2px solid #409eff;
  color: #409eff;
}
</style>
