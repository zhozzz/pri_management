<!--
 * @Description: In User Settings Edit
 * @Author: gance
 * @Date: 2019-08-28 17:05:28
 * @LastEditTime: 2020-04-01 16:52:32
 * @LastEditors: zhuhao
 -->
<template slot-scope="scope">
  <menuTree :menuList="['监狱管理', '值班管理', '值班设置']">
    <el-select
      class="yn_ipt"
      v-if="typeNum !== 3"
      v-model="typeNum"
      @change="getContent"
      :style="{'margin-bottom':'1rem'}"
    >
      <el-option v-for="(item, i) in deptOption" :key="i" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <!-- <span class="yn_page_title">值班设置</span> -->
    <el-calendar v-model="calendarValue">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div class="cards_fa" style="font-size:1.1rem">
          <div :class="data.isSelected ? 'is-selected' : ''">
            <el-row>
              <el-col :span="21">
                {{
                data.day
                .split("-")
                .slice(1)
                .join("-")
                }}
                {{ data.isSelected ? "✔️" : "" }}
              </el-col>
              <el-col :span="3">
                <i
                  @click="eidtduty(date)"
                  v-show="typeFlag && data.isSelected && checkDate(date)"
                  class="el-icon-edit"
                ></i>
              </el-col>
            </el-row>
          </div>
          <div v-if="dayList[formatDate(date, 'yyyy-MM-dd')]" class="card_img">
            <div
              class="card_box"
              v-for="(item, i) in dayList[formatDate(date, 'yyyy-MM-dd')].rotas"
              :key="i"
            >
              <el-tooltip class="item" effect="dark" placement="right" :open-delay="300">
                <div slot="content" style="width:200px">
                  <el-row>
                    <el-col :span="10">时间周期：</el-col>
                    <el-col :span="14">{{ item.startTime }}-{{ item.endTime }}</el-col>
                  </el-row>
                  <el-row style="margin-top:20px">
                    <el-col :span="10">值班人：</el-col>
                    <el-col :span="14">
                      <el-tag
                        v-show="user.type == 1 || user.type == 3"
                        v-for="(user, i) in item.users"
                        :key="i"
                        type="info"
                      >{{ user.userName }}</el-tag>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top:20px">
                    <el-col :span="10">备勤人员：</el-col>
                    <el-col :span="14">
                      <el-tag
                        v-show="user.type == 2 || user.type == 4"
                        v-for="(user, i) in item.users"
                        :key="i"
                        type="info"
                      >{{ user.userName }}</el-tag>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top:20px" v-if="typeNum !== 3">
                    <el-col :span="10">值班领导：</el-col>
                    <el-col :span="14">
                      <el-tag
                        v-show="user.type == 0"
                        v-for="(user, i) in item.users"
                        :key="i"
                        type="info"
                      >{{ user.userName }}</el-tag>
                    </el-col>
                  </el-row>
                </div>
                <div shadow="hover" class="card">
                  <!-- <div shadow="hover" :class="item.executeTime == null ? 'card' : 'card1'"> -->
                  <el-row :gutter="10">
                    <el-col
                      :span="20"
                      style="overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;"
                      :title="item.shiftName"
                    >
                      <span style="font-size:1.2rem">{{ item.shiftName }}</span>
                    </el-col>
                    <!-- <el-col :span="3">
                      <i
                        @click="eidtduty(date, i)"
                        v-show="typeFlag && data.isSelected && checkDate(date)"
                        class="el-icon-edit"
                      ></i>
                    </el-col>-->
                    <el-col
                      :span="24"
                      style="font-size:1.2rem"
                    >{{ item.startTime }}-{{ item.endTime }}</el-col>
                  </el-row>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>

    <el-dialog class="yn_dialog" :visible.sync="editVisible" title="编辑" width="70%" center>
      <dutyEdit
        :editForm="editForm"
        :date="selDate"
        :colse="colse"
        :isLeader="false"
        :deptId="deptid"
        :editIndex="editIndex"
        @subSuccess="getContent"
      />
      <div slot="footer"></div>
    </el-dialog>
  </menuTree>
</template>
<script>
import menuTree from '@/components/menu_tree/'
import { formatDate } from '@/utils/date'
import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import dutyEdit from './duty_edit'

let time = new Date()
let day = time - (time % (24 * 60 * 60 * 1000)) - 8 * 60 * 60 * 1000
export default {
  name: 'Duty_mgt',
  components: {
    menuTree,
    dutyEdit
  },
  data() {
    return {
      dayStart: '',

      deptGuid: getDeptId(),
      deptid: getDeptId(),
      calendarValue: new Date(),

      dayList: {},
      editVisible: false,
      selDate: '',
      editForm: {},
      typeFlag: false,
      deptOption: [
        { label: '值班领导', value: 0 },
        { label: '指挥中心', value: 2 },
        { label: '科室', value: 1 }
      ],
      typeNum: 3,
      editIndex: null
    }
  },
  watch: {
    calendarValue(newValue, oldValue) {
      if (newValue.getMonth() != oldValue.getMonth()) {
        this.getContent()
      }
    },
    dayList: {
      deep: true,
      handler(val) {
        // console.log(val)
      }
    }
  },
  created() {
    let time = new Date()
    this.dayStart = time - (time % (24 * 60 * 60 * 1000)) - 8 * 60 * 60 * 1000
    console.log(this.dayStart)
    let type = getDeptType()
    if (
      type == '指挥中心' ||
      type == '特警队' ||
      type == '监区' ||
      type == '医院'
    ) {
      this.typeFlag = true
    }
    switch (type) {
      case '指挥中心':
        this.typeNum = 2
        this.deptid = getPrisonId()
        break
      case '值班领导':
        this.typeNum = 0
        break
      case '科室':
        this.typeNum = 1
        break
      default:
        this.typeNum = 3
        break
    }

    this.getContent()
  },
  methods: {
    checkDate(date) {
      return new Date(date).getTime() >= this.dayStart
    },

    eidtduty(date, i) {
      this.selDate = date
      this.$set(
        this,
        'editForm',
        JSON.parse(
          JSON.stringify(this.dayList[formatDate(date, 'yyyy-MM-dd')].rotas)
        )
      )
      this.editIndex = i
      this.editVisible = true
      console.log(this.editForm)
    },

    // 获取此部门班次

    getContent() {
      let mouth = ''
      if (new Date(this.calendarValue).getMonth() == 11) {
        mouth =
          new Date(this.calendarValue).getFullYear() +
          '-' +
          (new Date(this.calendarValue).getMonth() + 1) +
          '-' +
          '01'
      } else {
        mouth =
          new Date(this.calendarValue).getFullYear() +
          '-' +
          (new Date(this.calendarValue).getMonth() + 2) +
          '-' +
          '01'
      }

      this.axios
        .get(
          this._global.businessUrl +
            '/duty/departCheckRota/' +
            this.deptGuid +
            '/' +
            mouth +
            '/' +
            this.typeNum
        )
        .then(res => {
          mouth = new Date(mouth).getTime() - 24 * 3600 * 1000

          let startday = formatDate(this.calendarValue, 'yyyy/MM') + '/01'
          startday = new Date(startday).getTime()

          for (let index = 1; index; index++) {
            if (startday < mouth) {
              startday += 24 * 3600 * 1000
              let day = formatDate(new Date(startday), 'yyyy-MM-dd')

              this.getOneDay(formatDate(new Date(day), 'yyyy-MM-dd'))
            } else {
              break
            }
          }
        })
      this.$forceUpdate()
    },
    async getOneDay(day) {
      await this.axios
        .get(
          this._global.businessUrl +
            '/duty/departCheckRota/' +
            this.deptGuid +
            '/' +
            day +
            '/' +
            this.typeNum
        )
        .then(res => {
          this.$set(this.dayList, day, res)
        })
    },
    openEdit(row) {
      //   this.editForm = JSON.parse(JSON.stringify(row.rotas))
      this.$set(this, 'editForm', JSON.parse(JSON.stringify(row.rotas)))

      this.editVisible = true
      console.log(this.editForm)
    },
    colse() {
      this.editVisible = false
    }
  }
}
</script>
<style scoped lang="less">
.el-table .dead-row {
  color: red;
  cursor: pointer;
}
.el-table .default-row {
  cursor: pointer;
}
.el-icon-edit {
  font-size: 1.2rem;
  //   color: #fff;
}
.el-icon-delete {
  font-size: 1.2rem;
  color: #fff;
}
.is-selected {
  color: #1989fa;
}
.card {
  background: transparent;
  //   background: url('~@/assets/other/light_unfinish.png');
  //   background-size: 100% 100%;

  //   background-repeat: no-repeat;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  color: #fff;
}
.card1 {
  //   background: url('~@/assets/other/light_finish.png');
  background: transparent;
  //   background-size: 100% 100%;
  //   background-repeat: no-repeat;
  border: none;
}
.yn_date_picker {
  width: 100% !important;
}
/deep/.el-cascader__tags {
  input {
    display: none;
  }
}
.card_img {
  width: 100%;
  background: url('~@/assets/other/light_unfinish.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
}
.card_box {
  width: 100%;
}
.technology {
  .el-icon-edit,
  .el-icon-delete {
    color: #fff;
  }
  .card_box {
    width: 100%;
  }
  .card_img {
    background: url('~@/assets/other/dark_finish.png');

    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .cards_fa > .card_box > .card {
    border-bottom: none;
  }
  .cards_fa > .card_box:last-child > .card {
    border-bottom: 1px solid #2c82ca;
  }
  .el-calendar {
    background: transparent;
    /deep/.el-calendar__header {
      border-bottom: 1px solid transparent;
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
  .card {
    // background: url('~@/assets/other/dark_unfinish.png');

    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    color: #fff;
    // border: 1px solid #2c82ca;
  }
  .card1 {
    // background: url('~@/assets/other/dark_finish.png');

    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    color: #fff;
    // border: 1px solid #0068ae;
  }
}
</style>
