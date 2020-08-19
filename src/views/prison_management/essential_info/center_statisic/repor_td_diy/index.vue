<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-12-13 10:51:59
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-29 10:42:12
 -->
<template>
  <td :rowspan="row" :colspan="col">
    <div class="td_box">
      <el-input
        :type="iptType=='str'?'text':'Number'"
        :value="value"
        @input="iptChange"
        :min="0"
        class="yn_ipt table_ipt"
        :placeholder="iptType=='str'?'无':0"
        v-if="!iptFlag"
      ></el-input>
      <div v-else class="valTil">
        <el-popover
          placement="top"
          trigger="click"
          :width="xpwidth"
          ref="popover"
          popper-class="td-pop"
        >
          <div>{{value}}</div>
          <div class="valTilTxt" slot="reference">{{value}}</div>
        </el-popover>
      </div>
      <el-popover
        placement="top"
        trigger="manual"
        v-model="visible"
        @show="selSevenDay"
        :width="xpwidth"
        ref="popover"
        popper-class="td-pop"
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
                  label="部门"
                  min-width="150"
                ></el-table-column>
                <el-table-column
                  v-if="userPrisonId != 1&&isPrison&&isArea"
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
              <div class="line_box">
                <lineChart
                  :dataList="lineData"
                  :width="isArea?((xpwidth / 24) * 22-40) + 'px': ((xpwidth / 24) * 14-40) + 'px'"
                />
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          class="icon"
          v-show="iptFlag&&iptType=='int'"
          slot="reference"
          @click="visible = !visible"
        >
          <span v-if="status == 2" class="noUp">未上报</span>
          <!-- <i
            v-else
            :class="state==0?'el-icon-minus':state==1?'el-icon-top':'el-icon-bottom'"
          ></i>-->
          <img v-else-if="status == 1" :src="require('@/assets/other/up.png')" />
          <img v-else-if="status == -1" :src="require('@/assets/other/down.png')" />
          <i v-else class="el-icon-minus"></i>
          <span
            v-if="status != 2&&status != 3"
            :class="status == 1 ? 'top':status == -1 ?  'bottom': ''"
          >{{ changeValue==null?'昨日未上报': changeValue}}</span>
        </div>
      </el-popover>
    </div>
  </td>
</template>

<script>
import lineChart from '../line_charts/'
import {
  queryChartList,
  queryTreeAndChartList,
  queryPrisonTreeAndChartList,
  queryJqChartList
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

    iptData: 0,
    value: 0,
    fieldName: '',
    iptType: {
      type: String,
      default: 'int'
    },
    status: {
      type: Number,
      default: 2
    },
    changeValue: {
      type: Number,
      default: 0
    }
  },
  components: {
    lineChart
  },
  data() {
    return {
      chart: null,
      iconFlag: false,
      dataList: [],
      isPrison: getDeptType() == '监狱' || getDeptType() == '指挥中心',
      sqlNum: 0,
      lineData: [],
      xpwidth: 0,
      dateList: [],
      loading: false,
      userPrisonId: getPrisonId(),
      tableLoading: true,
      isArea: false,
      tableFlag: false,
      setList: [],
      setDayList: [],
      visible: false
    }
  },
  created() {
    this.xpwidth = window.screen.width * 0.5
    this.isArea = sessionStorage.getItem('isArea') == 'true'
    this.xpwidth = this.isArea
      ? window.screen.width * 0.3
      : window.screen.width * 0.5
    this.$nextTick(() => {
      if (!this.value) {
        this.$emit('input', 0)
      }
    })
  },
  mounted() {
    window.addEventListener('scroll', this.mouseOut, true)
    this.$refs.div1.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    // handleScroll() {
    //   const self = this
    //   this.innerScroll = true
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(() => {
    //     self.innerScroll = false
    //   }, 200)
    // },
    // mouseOut(e) {
    //   const self = this
    //   setTimeout(() => {
    //     if (!self.innerScroll) {
    //       self.$refs['popover'].doClose()
    //     }
    //   }, 20)
    // },
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

      if (isArea) {
        let strDept =
          'beginDate=' +
          formatDate(new Date(info.date), 'yyyy-MM-dd hh:mm:ss') +
          '&fieldName=' +
          this.fieldName +
          '&deptId=' +
          deptId
        queryJqChartList(strDept).then(res => {
          if (res) {
            let obj = {}
            let obj2 = { numVal: 0 }
            res.map((item, i) => {
              let lineData = { name: item.date }
              if (isNaN(item.result)) {
                lineData.value = 0
              } else {
                lineData.value = Number(item.result)
              }
              this.lineData.push(lineData)
              if (i > 3) {
                this.dateList.push(item.date)
                obj[item.date] = item.result
                obj2[item.date] = item.result
                if (item.result == '未上报' || item.result == null) {
                  obj2.numVal += 0
                } else {
                  obj2.numVal = Number(item.result) - obj2.numVal
                }
              }
            })
            this.dataList.push(obj)
            this.setList.push(obj2)
          } else {
            this.$message.warning('暂无数据')
          }
        })
      } else {
        str =
          'beginDate=' +
          formatDate(new Date(info.date), 'yyyy-MM-dd hh:mm:ss') +
          '&fieldName=' +
          this.fieldName +
          '&prisonId=' +
          this.prisonId

        queryChartList(str).then(res => {
          res.map(item => {
            if (item.result === '未上报') {
              item.result = 0
            }
            this.lineData.push({ name: item.date, value: item.result })
          })
        })

        if (this.prisonId == 1) {
          let strPro =
            'beginDate=' +
            formatDate(new Date(info.date), 'yyyy-MM-dd hh:mm:ss') +
            '&fieldName=' +
            this.fieldName
          queryTreeAndChartList(strPro).then(res => {
            if (res.length) {
              this.setArr(res)
            } else {
              this.$message.warning('暂无数据')
            }
          })
        } else {
          queryPrisonTreeAndChartList(str).then(res => {
            if (res.length) {
              this.setArr(res)
            } else {
              this.$message.warning('暂无数据')
            }
          })
        }
      }
      this.loading = false
      this.tableLoading = false
    },
    toLine(name) {
      return name.replace(/([A-Z,2])/g, '_$1').toLowerCase()
    },
    setArr(arr) {
      arr[0].value.map((item, i) => {
        this.dateList.push(item.date)
        if (i > 0) {
          this.setDayList.push(item.date)
        }
      })
      arr.map((item, j) => {
        let obj = {
          departName: item.departName
        }

        let obj2 = {
          departName: item.departName,
          numVal: 0
        }
        this.dateList.forEach((val, i) => {
          obj[val] = item.value[i].result
          if (i > 0) {
            obj2[val] = item.value[i].result

            if (
              item.value[i].result == '未上报' ||
              item.value[i].result == null
            ) {
              obj2.numVal += 0
            } else {
              obj2.numVal = Number(item.value[i].result) - obj2.numVal
            }
          }
        })
        this.dataList.push(obj)
        this.setList.push(obj2)
      })
    }
  },
  watch: {
    value(val) {
      this.isArea = sessionStorage.getItem('isArea') == 'true'
      this.xpwidth = this.isArea
        ? window.screen.width * 0.3
        : window.screen.width * 0.5
      if (!val) {
        this.$emit('input', 0)
      }
      this.visible = false
    },
    prisonId(val) {
      this.isArea = sessionStorage.getItem('isArea') == 'true'
      this.xpwidth = this.isArea
        ? window.screen.width * 0.3
        : window.screen.width * 0.5
      this.visible = false
    },
    status(val) {},
    changeValue(val) {}
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
.valTil {
  font-size: 1.1rem;
  margin: 0 4px;
  color: #f7b900;
  font-weight: 600;
  .valTilTxt {
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.top {
  color: red;
}
.noUp {
  font-size: 1.1rem;
  white-space: nowrap;
}
.bottom {
  color: green;
}
.pop_main {
  width: 100%;
  position: relative;
  .el-icon-error {
    position: absolute;
    font-size: 16px;
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
    font-weight: 600;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
  }
  .sql_num {
    color: #4a8ae8;
    font-size: 1.1rem;
    white-space: nowrap;
  }
  /deep/.el-input__inner {
    padding: 4px 0;
    min-width: 4rem;
    text-indent: 2px;
  }
  .table_ipt {
    min-width: 4rem;

    .el-input__inner {
      min-width: 4rem;
    }
  }
  .el-input.is-disabled {
    border: none;
    background-color: #fff;
    min-width: 4rem;
    /deep/ .el-input__inner {
      color: #fd9b0b !important;
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
      min-width: 4rem;
      /deep/ .el-input__inner {
        color: #f7b900 !important;
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
