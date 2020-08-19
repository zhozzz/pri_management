<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-12-13 10:51:59
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-29 10:42:01
 -->
<template>
  <td :rowspan="row" :colspan="col">
    <div class="td_box">
      <div class="sql_num">{{ sqlNum }}</div>
      <div :style="{ margin: '0 2px' }">/</div>
      <el-input
        type="Number"
        :value="value"
        @input="iptChange"
        :min="0"
        :disabled="iptFlag"
        class="yn_ipt table_ipt"
        placeholder="0"
      ></el-input>
      <el-popover
        placement="top"
        @show="selSevenDay"
        :width="xpwidth"
        trigger="manual"
        v-model="visible"
        ref="popover"
      >
        <div class="pop_main" v-loading="loading" ref="div1">
          <i class="el-icon-error" @click="visible = false"></i>
          <el-row :gutter="10">
            <el-col :span=" 10 " v-if="!isArea">
              <!-- :span="userPrisonId == 1 || isPrison ? 8 : 24" -->
              <div class="table_head">{{tableFlag?'上报数据近三日汇总':'上报数据对比'}}</div>
              <el-table
                class="yn_table"
                :data="dataList"
                v-loading="tableLoading"
                v-if="tableFlag"
                show-summary
                height="20rem"
              >
                <!-- :height="userPrisonId == 1 || isPrison ? '20rem' : '10rem'" -->
                <el-table-column
                  v-if="userPrisonId == 1&&!isArea"
                  align="center"
                  prop="departName"
                  label="监狱"
                  min-width="150"
                ></el-table-column>
                <el-table-column
                  v-if="userPrisonId != 1&&isPrison&&!isArea"
                  align="center"
                  prop="departName"
                  label="监区"
                  min-width="150"
                ></el-table-column>
                <el-table-column
                  align="center"
                  :prop="item"
                  v-for="(item, i) in dateList"
                  :key="i"
                  :label="item"
                  :width="item.length*12+'px'"
                ></el-table-column>
              </el-table>

              <el-table
                class="yn_table"
                :data="setList"
                v-loading="tableLoading"
                v-if="!tableFlag"
                height="20rem"
                show-summary
              >
                <!-- :height="userPrisonId == 1 || isPrison ? '20rem' : '10rem'" -->
                <el-table-column
                  v-if="userPrisonId == 1&&!isArea"
                  align="center"
                  prop="departName"
                  label="监狱"
                  min-width="150"
                ></el-table-column>
                <el-table-column
                  v-if="userPrisonId != 1&&isPrison&&!isArea"
                  align="center"
                  prop="departName"
                  label="监区"
                  min-width="150"
                ></el-table-column>
                <el-table-column
                  align="center"
                  :prop="item"
                  v-for="(item, i) in setDayList"
                  :key="i"
                  :label="item"
                  :width="item.length*12+'px'"
                ></el-table-column>
                <el-table-column align="center" show-overflow-tooltip label="差值" prop="numVal"></el-table-column>
              </el-table>
              <el-button
                class="yn_btn yn_long_btn"
                type="primary"
                @click="tableFlag=!tableFlag"
              >{{!tableFlag?'切换至三日数据汇总':'切换至数据对比'}}</el-button>
            </el-col>
            <el-col :span="isArea?24:14">
              <!-- :span="userPrisonId == 1 || isPrison ? 16 : 24" -->
              <div class="line_box">
                <!-- <h3>{{isArea?'监区':'监狱'}}上报数据7日变化图</h3> -->
                <lineChart
                  :dataList="lineData"
                  :width="isArea?((xpwidth / 24) * 22-40) + 'px': ((xpwidth / 24) * 14-40) + 'px'"
                />
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="icon" v-show="iptFlag" slot="reference" @click="visible = !visible">
          <span v-if="sel.state == 2" class="noUp">未上报</span>
          <!-- <i
            v-else
            :class="sel.state==0?'el-icon-minus':sel.state==1?'el-icon-top':'el-icon-bottom'"
          ></i>-->
          <img v-else-if="sel.state == 1" :src="require('@/assets/other/up.png')" />
          <img v-else-if="sel.state == -1" :src="require('@/assets/other/down.png')" />
          <i v-else class="el-icon-minus"></i>
          <span
            v-if="sel.state != 2"
            :class="sel.state == 1 ? 'top' : 'bottom'"
          >{{ sel.changeValue }}</span>
        </div>
      </el-popover>
    </div>
  </td>
</template>

<script>
import lineChart from '../line_charts/'
import {
  selSevenDay,
  selProSevenDay,
  selPrisonSevenDay,
  selProvinceSevenDayMap,
  selPrisonSevenDayMap
} from '../server'
import { formatDate } from '@/utils/date'
import { getPrisonId, getUserId, getDeptType, getDeptId } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    iptFlag: {
      type: Boolean,
      default: false
    },
    col: {
      type: Number,
      default: 1
    },
    row: {
      type: Number,
      default: 1
    },
    prisonId: {
      type: String,
      default: '1'
    },
    selData: {
      type: Object,
      default: function() {
        return { state: 2 }
      }
    },
    iptData: 0,
    value: 0,
    sqlData: 0,
    fieldName: ''
  },
  components: {
    lineChart
  },
  data() {
    return {
      chart: null,
      iconFlag: false,
      sel: {},
      dataList: [],
      isPrison: getDeptType() == '监狱' || getDeptType() == '指挥中心',
      sqlNum: 0,
      lineData: [
        { name: 'xx', value: 10 },
        { name: 'x', value: 2 },
        { name: 'xxx', value: 4 }
      ],
      xpwidth: 0,
      dateList: [],
      loading: false,
      userPrisonId: getPrisonId(),
      tableLoading: true,
      isArea: false,
      tableFlag: false,
      setList: [],
      setDayList: [],
      innerScroll: false,
      timer: false,
      visible: false
    }
  },
  created() {
    this.isArea = sessionStorage.getItem('isArea') == 'true'
    this.xpwidth = this.isArea
      ? window.screen.width * 0.3
      : window.screen.width * 0.5
    if (!this.value) {
      this.$emit('input', 0)
    }

    if (!this.selData) {
      this.sel = {
        state: 2,
        name: ''
      }
    } else {
      this.sel = this.selData
    }
  },
  mounted() {
    window.addEventListener('scroll', this.mouseOut, true)
    this.$refs.div1.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleScroll() {
      const self = this
      this.innerScroll = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        self.innerScroll = false
      }, 200)
    },
    mouseOut(e) {
      const self = this
      setTimeout(() => {
        if (self.visible && !self.innerScroll) {
          self.visible = false
        }
      }, 20)
    },
    iptChange(val) {
      val = val.replace('-', '')

      this.$emit('input', val)
    },
    selSevenDay() {
      this.dataList = []
      this.dateList = []
      this.setList = []
      this.setDayList = []

      this.lineData = []
      this.loading = true
      let info = JSON.parse(sessionStorage.getItem('info'))
      let deptId = sessionStorage.getItem('deptId')
      let isArea = sessionStorage.getItem('isArea') == 'true'

      let str = ''
      const doHandleMonth = function(month) {
        var m = month
        if (month.toString().length == 1) {
          m = '0' + month
        }
        return m
      }
      const getDay = function(day) {
        let info = JSON.parse(sessionStorage.getItem('info'))
        if (info.date) {
          var today = new Date(info.date)
        } else {
          var today = new Date()
        }
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
        today.setTime(targetday_milliseconds) //注意，这行是关键代码
        var tYear = today.getFullYear()
        var tMonth = today.getMonth()
        var tDate = today.getDate()
        tMonth = doHandleMonth(tMonth + 1)
        tDate = doHandleMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      }
      if (this.prisonId == 1) {
        str =
          formatDate(new Date(info.date), 'yyyy-MM-dd hh:mm:ss') +
          '/' +
          this.toLine(this.fieldName)
        selProSevenDay(str).then(res => {
          if (res.length) {
            this.dateList.push(getDay(-2))
            this.dateList.push(getDay(-1))
            this.dateList.push(getDay(-0)) // 设置最近三天日期
            this.setDayList.push(getDay(-1))
            this.setDayList.push(getDay(-0)) // 设置最近两天天日期
            res.map((item, j) => {
              let obj = {
                departName: item.departName
              }

              let obj2 = {
                departName: item.departName,
                numVal: 0
              }
              this.dateList.forEach(val => {
                obj[val] = item.value.find(dd => dd.date === val).result
              })
              this.setDayList.forEach((val, i) => {
                obj2[val] = item.value.find(dd => dd.date === val).result
                if (obj2[val] == '未上报' || obj2[val] == null) {
                  obj2.numVal += 0
                } else {
                  obj2.numVal = Number(obj2[val]) - obj2.numVal
                }
              })
              this.dataList.push(obj)
              this.setList.push(obj2)
            })
          } else {
            this.$message.warning('暂无数据')
          }
          this.tableLoading = false
        })

        selProvinceSevenDayMap(str).then(res => {
          res.map(item => {
            if (item.result === '未上报') {
              item.result = 0
            }
            this.lineData.push({ name: item.date, value: item.result })
          })
        })
      } else {
        if (isArea) {
          str =
            formatDate(new Date(info.date), 'yyyy-MM-dd hh:mm:ss') +
            '/' +
            deptId +
            '/' +
            this.toLine(this.fieldName)

          selSevenDay(str).then(res => {
            if (res) {
              this.dateList.push(getDay(-2))
              this.dateList.push(getDay(-1))
              this.dateList.push(getDay(-0)) // 设置最近三天日期
              this.setDayList.push(getDay(-1))
              this.setDayList.push(getDay(-0)) // 设置最近两天天日期
              res.map((item, k) => {
                let lineObj = {}
                lineObj.name = item.date
                if (isNaN(item.result)) {
                  lineObj.value = 0
                } else {
                  lineObj.value = Number(item.result)
                }

                this.lineData.push(lineObj)
                let obj2 = { numVal: 0 }
                let obj = {}

                this.dateList.forEach(val => {
                  obj[val] = item.result
                })
                this.setDayList.forEach((val, i) => {
                  obj2[val] = item.result
                  if (obj2[val] == '未上报' || obj2[val] == null) {
                    obj2.numVal += 0
                  } else {
                    obj2.numVal = Number(obj2[val]) - obj2.numVal
                  }
                })
                this.dataList.push(obj)
                this.setList.push(obj2)
              })
            } else {
              this.$message.warning('暂无数据')
            }
            this.tableLoading = false
          })
        } else {
          str =
            formatDate(new Date(info.date), 'yyyy-MM-dd hh:mm:ss') +
            '/' +
            info.prisonId +
            '/' +
            this.toLine(this.fieldName)

          selPrisonSevenDay(str).then(res => {
            if (res.length) {
              this.dateList.push(getDay(-2))
              this.dateList.push(getDay(-1))
              this.dateList.push(getDay(-0)) // 设置最近三天日期
              this.setDayList.push(getDay(-1))
              this.setDayList.push(getDay(-0)) // 设置最近两天天日期
              res.map((item, j) => {
                let obj = {
                  departName: item.departName
                }

                let obj2 = {
                  departName: item.departName,
                  numVal: 0
                }
                this.dateList.forEach(val => {
                  obj[val] = item.value.find(dd => dd.date === val).result
                })
                this.setDayList.forEach((val, i) => {
                  obj2[val] = item.value.find(dd => dd.date === val).result
                  if (obj2[val] == '未上报' || obj2[val] == null) {
                    obj2.numVal += 0
                  } else {
                    obj2.numVal = Number(obj2[val]) - obj2.numVal
                  }
                })
                this.dataList.push(obj)
                this.setList.push(obj2)
              })
            } else {
              this.$message.warning('暂无数据')
            }
            this.tableLoading = false
          })

          selPrisonSevenDayMap(
            formatDate(new Date(info.date), 'yyyy-MM-dd hh:mm:ss') +
              '/' +
              this.toLine(this.fieldName) +
              '/' +
              info.prisonId
          ).then(res => {
            res.map(item => {
              if (item.result === '未上报') {
                item.result = 0
              }
              this.lineData.push({ name: item.date, value: item.result })
            })
          })
        }
      }
      this.loading = false
    },
    toLine(name) {
      return name.replace(/([A-Z,2])/g, '_$1').toLowerCase()
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.$emit('input', 0)
      }
      this.isArea = sessionStorage.getItem('isArea') == 'true'

      this.xpwidth = this.isArea
        ? window.screen.width * 0.3
        : window.screen.width * 0.5

      this.visible = false
    },
    prisonId(val) {
      this.isArea = sessionStorage.getItem('isArea') == 'true'

      this.xpwidth = this.isArea
        ? window.screen.width * 0.3
        : window.screen.width * 0.5

      this.visible = false
    },
    selData: {
      deep: true,
      handler(val) {
        if (val) {
          this.sel = this.selData
          //   this.selSevenDay()
        }
      }
    },
    sqlData: {
      deep: true,
      handler(val) {
        if (val) {
          this.sqlNum = val
        } else {
          this.sqlNum = 0
        }
      }
    },
    isArea(val) {}
  }
}
</script>

<style lang="less" scoped>
.yn_long_btn {
  width: 12rem;
}
img {
  width: 1.4rem;
  height: 1.4rem;
}
h3 {
  margin: 4px 0;
}
td {
  padding-top: 2px;
  padding-bottom: 2px;
}
.top {
  color: red;
}
.noUp {
  font-size: 1.1rem;
  white-space: nowrap;
}
.bottom {
  color: #05d28c;
}
.pop_main {
  width: 100%;
  position: relative;
  .el-icon-error {
    position: absolute;
    font-size: 18px;
    top: -16px;
    right: -16px;
    color: red;
  }
}
.td_box {
  width: 100%;
  display: flex;
  align-items: center;
  .icon {
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
  }
  .sql_num {
    color: #0067ff;
    font-size: 1.1rem;
    white-space: nowrap;
    font-weight: 600;
  }
  /deep/.el-input__inner {
    padding: 4px 0;
    width: 4rem;
    text-indent: 2px;
    font-weight: 600;
  }
  .table_ipt {
    width: 4rem;

    .el-input__inner {
      width: 4rem;
    }
  }
  .el-input.is-disabled {
    border: none;
    background-color: #fff;
    width: 4rem;
    /deep/ .el-input__inner {
      color: #f7b900 !important;
      background-color: #fff;
      border: none;
    }
  }
}

.table_head {
  width: 100%;
  font-size: 1.6rem;
  text-align: center;
  padding: 0.2rem 0;
}
.line_box {
  width: 100%;
  border: 1px solid rgb(124, 218, 253);
  padding: 10px;
  border-radius: 4px;
}
.technology {
  .td_box {
    .el-input.is-disabled {
      border: none;
      background-color: transparent;
      width: 4rem;
      /deep/ .el-input__inner {
        color: #eb0909 !important;
        background-color: transparent;
        border: none;
      }
    }
  }
  .table_head {
    color: #fff;
  }
  .el-table {
    /deep/.el-table__footer-wrapper tbody td {
      background: transparent;
    }
  }
}
</style>
