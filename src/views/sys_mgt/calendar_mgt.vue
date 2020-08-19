<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 14:13:42
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 16:44:56
 -->
<template>
  <!-- <span class="yn_page_title">节假日管理</span> -->
  <menuTree :menuList="['系统管理','节假日管理']">
    <el-calendar>
      <template slot="dateCell" slot-scope="{date, data}">
        <div :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(1).join('-') }}
          <div v-if="data.isSelected" @click="openChange(date)" class="open_btn">新增</div>
        </div>

        <div v-for="(item,i) in daysList" :key="i">
          <div v-if="formatDate(new Date(item.date),'yyyy-MM-dd')==formatDate(date,'yyyy-MM-dd')">
            <div v-if="item.type===0" class="holiday">
              <div>{{item.status==0?'已设为节假日':'已停用节假日'}}</div>

              <!-- <el-switch
                :active-value="0"
                :inactive-value="1"
                active-color="#f3763e"
                inactive-color="#ccc"
                v-model="item.status"
                @change="changeHoliday(item)"
              ></el-switch>-->
              <div v-if="data.isSelected" @click="openEdit(date,item)" class="open_btn">编辑</div>

              <div class="desc">{{item.description}}</div>
            </div>
            <div v-else-if="item.type===1" class="workday">
              <div>{{item.status==0?'已设为工作日':'已停用工作日'}}</div>
              <div v-if="data.isSelected" @click="openEdit(date,item)" class="open_btn">编辑</div>

              <!-- <el-switch
                :active-value="0"
                :inactive-value="1"
                active-color="#13ce66"
                inactive-color="#ccc"
                v-model="item.status"
                @change="changeHoliday(item)"
              ></el-switch>-->
              <div class="desc">{{item.description}}</div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    <!-- <el-row :gutter="10" style="margin-top:30px">
      <el-col :span="12">
        <div>
          <div>
            <el-button
              type="primary"
              class="yn_btn yn_long_btn"
              @click="newWorkDay2Holiday"
            >新增工作日转节假日</el-button>
          </div>
          <el-table
            :data="workDay2HolidayList"
            style="width: 100%;margin-top:20px"
            :row-class-name="tableRowClassName"
            height="500px"
            v-loading="tableLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)"
            class="yn_table"
            border
          >
            <el-table-column prop="date" label="日期" width="230">
              <template slot-scope="scope">{{scope.row.date | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="description" label="说明"></el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-show="scope.row.status===0" type="success" disable-transitions>启用</el-tag>
                <el-tag v-show="scope.row.status===1" type="danger" disable-transitions>停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="editWorkDay2Holiday(scope.row)"
                  type="text"
                  class="yn_text_btn"
                  size="small"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <div>
            <el-button
              type="primary"
              class="yn_btn yn_long_btn"
              @click="newHoliday2WorkDay"
            >新增节假日转工作日</el-button>
          </div>
          <el-table
            :data="holiday2WorkDayList"
            style="width: 100%;margin-top:20px"
            v-loading="tableLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)"
            :row-class-name="tableRowClassName"
            class="yn_table"
            border
          >
            <el-table-column prop="date" label="日期" width="230">
              <template slot-scope="scope">{{scope.row.date | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="description" label="说明"></el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-show="scope.row.status===0" type="success" disable-transitions>启用</el-tag>
                <el-tag v-show="scope.row.status===1" type="danger" disable-transitions>停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="editHoliday2WorkDay(scope.row)"
                  type="text"
                  class="yn_text_btn"
                  size="small"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>-->
    <el-dialog
      class="yn_dialog"
      center
      :title="calendarDialogTitle"
      :visible.sync="calendarDialog"
      @closed="resetForm()"
      width="30%"
    >
      <div>
        <el-form
          label-position="left"
          label-width="5rem"
          :model="calendarForm"
          ref="calendarForm"
          :rules="rules"
          class="yn_form"
          @submit.native.prevent
        >
          <!-- <el-form-item prop="date" label="日期">
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="calendarForm.date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>-->
          <el-form-item prop="description" label="说明">
            <el-input
              class="yn_ipt"
              type="textarea"
              :rows="2"
              v-model="calendarForm.description"
              placeholder="输入说明"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" v-show="calendarForm.calendarGuid!=null">
            <el-switch
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="停用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="calendarForm.status"
            ></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="saveCalendar">确定</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>

<script>
import menuTree from '@/components/menu_tree/'
import { formatDate } from '@/utils/date.js'

export default {
  name: 'CalendarMgt',
  filters: {
    // formatDate: function (value) {
    //   let date = new Date(value)
    //   let y = date.getFullYear()
    //   let MM = date.getMonth() + 1
    //   MM = MM < 10 ? '0' + MM : MM
    //   let d = date.getDate()
    //   d = d < 10 ? '0' + d : d
    //   return y + '-' + MM + '-' + d
    // }
  },
  components: { menuTree },

  data() {
    var dateCheckAgainValidator = (rule, value, callback) => {
      if (
        (this.calendarDialogTitle == '编辑工作日为节假日' ||
          this.calendarDialogTitle == '编辑节假日为工作日') &&
        value == this.date_edit_cache
      ) {
        callback()
        return
      }
      this.axios
        .get(
          this._global.businessUrl + '/prisonCalendar/dateCheckAgain/' + value
        )
        .then(data => {
          if (data) {
            callback()
          } else {
            callback(new Error('此日期已被转换'))
          }
        })
    }
    var weekDayCheckValidator = (rule, value, callback) => {
      let day = new Date(value).getDay()
      if (
        this.calendarDialogTitle == '编辑工作日为节假日' ||
        this.calendarDialogTitle == '新增工作日为节假日'
      ) {
        if (day == 0 || day == 6) {
          callback(new Error('不可把节假日转换为节假日'))
        } else {
          callback()
        }
      } else if (
        this.calendarDialogTitle == '编辑节假日为工作日' ||
        this.calendarDialogTitle == '新增节假日为工作日'
      ) {
        if (day == 0 || day == 6) {
          callback()
        } else {
          callback(new Error('不可把工作日转换为工作日'))
        }
      }
    }
    return {
      tableLoading: false,
      holiday2WorkDayList: [],
      workDay2HolidayList: [],
      calendarDialog: false,
      calendarDialogTitle: '',
      calendarForm: {
        date: '',
        description: '',
        type: 0,
        status: 0,
        calendarGuid: null
      },
      rules: {
        date: [
          { required: true, message: '时间不可为空', trigger: 'blur' },
          { validator: dateCheckAgainValidator, trigger: 'blur' },
          { validator: weekDayCheckValidator, trigger: 'blur' }
        ],
        description: [{ max: 255, message: '最多 255 个字符', trigger: 'blur' }]
      },
      date_edit_cache: '',
      daysList: []
    }
  },
  created() {
    this.getCalendarConfigList()
  },
  methods: {
    getCalendarConfigList() {
      this.tableLoading = true
      this.axios
        .get(this._global.businessUrl + '/prisonCalendar' + '?' + Math.random())
        .then(data => {
          this.holiday2WorkDayList = []
          this.workDay2HolidayList = []
          this.daysList = data
          data.forEach(item => {
            if (item.type == 0) {
              this.workDay2HolidayList.push(item)
            } else {
              this.holiday2WorkDayList.push(item)
            }
          })
          this.tableLoading = false
        })
    },
    changeHoliday(item) {
      this.axios
        .put(this._global.businessUrl + '/prisonCalendar', item)
        .then(data => {
          this.getCalendarConfigList()
          this.$message.success('编辑成功')
        })
    },
    openChange(date) {
      let day = new Date(date).getDay()

      this.axios
        .get(
          this._global.businessUrl +
            '/prisonCalendar/dateCheckAgain/' +
            date.getTime()
        )
        .then(data => {
          if (data) {
            if (day == 0 || day == 6) {
              this.calendarForm.type = 1
              this.calendarDialogTitle = '新增节假日为工作日'
            } else {
              this.calendarForm.type = 0
              this.calendarDialogTitle = '新增工作日为节假日'
            }
            this.calendarForm.date = date.getTime()
            this.calendarDialog = true
          } else {
            this.$message.error('日期已被转换')
          }
        })
    },
    openEdit(date, val) {
      let day = new Date(date).getDay()
      if (day === 0 || day === 6) {
        this.calendarDialogTitle = '编辑节假日为工作日'
      } else {
        this.calendarDialogTitle = '编辑工作日为节假日'
      }
      this.calendarForm = JSON.parse(JSON.stringify(val))

      this.calendarDialog = true
    },
    newWorkDay2Holiday() {
      this.calendarForm.type = 0
      this.calendarDialogTitle = '新增工作日为节假日'
      this.calendarDialog = true
    },
    newHoliday2WorkDay() {
      this.calendarForm.type = 1
      this.calendarDialogTitle = '新增节假日为工作日'
      this.calendarDialog = true
    },
    editWorkDay2Holiday(calendar) {
      this.date_edit_cache = calendar.date
      //   console.log(JSON.stringify(calendar))
      this.calendarForm = JSON.parse(JSON.stringify(calendar))
      this.calendarDialogTitle = '编辑工作日为节假日'
      this.calendarDialog = true
    },
    editHoliday2WorkDay(calendar) {
      this.date_edit_cache = calendar.date
      this.calendarForm = JSON.parse(JSON.stringify(calendar))
      this.calendarDialogTitle = '编辑节假日为工作日'
      this.calendarDialog = true
    },
    saveCalendar() {
      this.$refs['calendarForm'].validate(valid => {
        if (valid) {
          if (this.calendarForm.calendarGuid == null) {
            this.axios
              .post(
                this._global.businessUrl + '/prisonCalendar',
                this.calendarForm
              )
              .then(data => {
                this.getCalendarConfigList()
                this.$message.success('新增成功')
                this.calendarDialog = false
              })
          } else {
            this.axios
              .put(
                this._global.businessUrl + '/prisonCalendar',
                this.calendarForm
              )
              .then(data => {
                this.getCalendarConfigList()
                this.$message.success('编辑成功')
                this.calendarDialog = false
              })
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.calendarForm.resetFields()
      this.calendarForm = {
        date: '',
        description: '',
        type: 0,
        status: 0,
        calendarGuid: null
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1) {
        return 'dead-row'
      } else {
        return 'default-row'
      }
    }
  }
}
</script>
<style scoped lang='less'>
.el-table .dead-row {
  color: red;
  cursor: pointer;
}
.el-table .default-row {
  cursor: pointer;
}
.holiday {
  color: #f3763e;
}
.workday {
  color: greenyellow;
}
.holiday,
.workday {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
}
.is-selected {
  position: relative;
  margin: 4px 0;
}
.open_btn {
  position: absolute;
  top: 0;
  right: 0;
  color: #333;
}
.yn_date_picker {
  width: 100% !important;
}
.desc {
  width: 100%;
  color: #333;
}
.technology {
  .el-icon-edit,
  .el-icon-delete,
  .desc,
  .open_btn {
    color: #fff;
  }
  .el-calendar {
    background: transparent;
    border: none;
    box-shadow: none;
    /deep/.el-calendar__header {
      border-bottom: 1px solid #2c82ca;
    }
    /deep/.el-calendar-table {
      tr:first-child td {
        border-top: 1px solid #2c82ca;
      }
      .is-selected {
        background: #045295;
        color: #fff;
      }
      .el-calendar-day:hover {
        background: #045295;
      }
      tr td:first-child {
        border-left: 1px solid #2c82ca;
      }
      tr td {
        border-bottom: 1px solid #2c82ca;
        border-right: 1px solid #2c82ca;
      }
    }
  }
}
</style>
