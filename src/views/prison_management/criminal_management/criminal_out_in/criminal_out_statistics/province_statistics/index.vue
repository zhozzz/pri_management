<!--
 * @Description: 禁闭隔离统计
 * @Author: fylih
 * @Github:
 * @Date: 2019-08-21 10:20:54
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-12-04 15:28:30
 -->
<template>
  <div>
    <headIcon :list="headIconList"></headIcon>
    <el-form ref="form" class="yn_form" inline label-width="4rem">
      <el-form-item label="日期:">
        <el-date-picker
          class="yn_ipt"
          v-model="formData"
          :clearable="false"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
        <el-button type="primary" class="yn_btn" @click="getChartData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="yn_charts">
          <h3>全省离监类型人数分析</h3>
          <!-- <el-form ref="form" class="yn_form" inline label-width="4rem">
            <el-form-item label="日期:">
              <el-date-picker
                class="yn_ipt"
                v-model="formData"
                :clearable="false"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd hh:mm:ss"
                @change="pickerChange"
              ></el-date-picker>
            </el-form-item>
          </el-form>-->
          <number-analysis v-loading="loading" :chartData="barChartData"></number-analysis>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts">
          <h3>全省离监类型人数分析</h3>
          <!-- <el-row>
            <el-form ref="form" class="yn_form" inline label-width="4rem">
              <el-form-item label="日期:">
                <el-date-picker
                  class="yn_ipt yn_date_picker"
                  v-model="pieDate"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  :clearable="false"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  @change="pieChange"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </el-row>-->
          <pie-type-chart
            v-loading="loading"
            :centerTitle="'离监罪犯'"
            :pieTotal="pieTotal"
            :pieTypeData="pieTypeData"
          ></pie-type-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="yn_charts in-ranking">
          <h3>犯人离监排名</h3>
          <ul>
            <li
              v-for="(item,i) of inRankingList"
              :key="i"
              @click="jumpToPrison(item.id,item.prisonName)"
            >
              <p>
                <img
                  v-if="i===0"
                  :src="require('@/assets/index/cup_1.gif')"
                  style="height:20px;width:25px;vertical-align:middle"
                />
                <img
                  v-if="i===1"
                  :src="require('@/assets/index/cup_2.png')"
                  style="height:20px;width:25px;vertical-align:middle"
                />
                <img
                  v-if="i===2"
                  :src="require('@/assets/index/cup_3.png')"
                  style="height:20px;width:25px;vertical-align:middle"
                />
                <span v-if="i>2" class="ranking_num" :class="{ranking_num_grey:i>2}">{{i+1}}</span>
                <span>{{item.name}}</span>
              </p>
              <p>
                <span>{{item.num}}</span>
                <i class="el-icon-arrow-right"></i>
              </p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import numberAnalysis from '../../criminal_in_statistics/province_statistics/number_analysis'
import pieTypeChart from '../../criminal_in_statistics/province_statistics/pie_type_analysis'
import timeSelect from '@/components/time_select/index.vue'
import headIcon from '@/components/head_icon'
import formatDate from '@/utils/date'
let today = new Date().getTime()
let yesterday = today - 24 * 3600 * 1000
export default {
  components: {
    numberAnalysis,
    pieTypeChart,
    timeSelect,
    headIcon
  },
  data () {
    return {
      pickerOptions: pickerOptions,
      loading: false,
      formData: [],
      barChartData: {
        xAxis: [],
        yAxis: []
      },
      pieDate: [],
      pieTypeData: [],
      // 离监类型总人数
      pieTotal: 0,
      lineReasonData: {
        xAxis: [],
        yAxis: []
      },
      headIconList: [
        {
          url: require('@/assets/index/crimal_sucess.png'),
          info: '本省今日离监',
          text: null,
          isRouter: true,
          routerString: 'criminal_check_out',
          params: {
            datePicker: [
              formatDate(new Date(), 'yyyy-MM-dd ') + '00:00:00',
              formatDate(new Date(), 'yyyy-MM-dd ') + '23:59:59'
            ]
          }
        },
        {
          url: require('@/assets/index/crimal_err.png'),
          info: '离监总人数',
          text: null,
          isRouter: true,
          routerString: 'criminal_check_out',
          params: {}
        }
      ],
      inRankingList: []
    }
  },
  methods: {
    pickerChange (val) {
      if (val) {
        this.formData = val
        // val.forEach(item => {
        //   let day = this.selectDate(new Date(item))
        //   this.formData.push(day)
        // })
        this.getChartData()
      }
    },
    pieChange (val) {
      if (val) {
        this.pieDate = val

        // val.forEach(item => {
        //   let day = this.selectDate(new Date(item))
        //   this.pieDate.push(day)
        // })

        // this.getPieData()
      }
    },
    selectDate (date) {
      let year = date.getFullYear()
      let mounth = date.getMonth() + 1
      if (mounth < 10) {
        mounth = '0' + mounth
      }
      let day = date.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return year + '-' + mounth + '-' + day + ' 00:00:00'
    },
    // 获得入监人数和增减比
    getInData () {
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalInOut/queryCriminalOutAddAndTotalProvince'
        )
        .then(response => {
          this.$set(this.headIconList[0], 'text', response.todayAdd)
          this.$set(this.headIconList[1], 'text', response.prisonAll)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 数组对象排序
    creatCompare (propertyName) {
      return function (obj1, obj2) {
        var value1 = obj1[propertyName]
        var value2 = obj2[propertyName]
        if (value1 < value2) {
          return 1
        } else if (value1 > value2) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 查询
    queryData () {
      this.getChartData()
    },
    // 获得图形数据
    // getPieData () {
    //   let params = {
    //     beginDay: null,
    //     endDay: null
    //   }
    //   if (this.formData && this.formData.length > 0) {
    //     //   if (this.pieDate && this.pieDate.length > 0) {
    //     // params.beginDay = this.pieDate[0]
    //     // params.endDay = this.pieDate[1]
    //     params.beginDay = this.formData[0]
    //     params.endDay = this.formData[1]
    //   }
    //   this.loading = true
    //   this.axios
    //     .post(
    //       this._global.businessUrl + '/criminalInOut/queryCriminalOutProvince',
    //       params
    //     )
    //     .then(response => {
    //       this.pieTypeData = response.types
    //       this.pieTotal = 0
    //       this.pieTypeData.forEach(el => {
    //         // 入监总数
    //         this.pieTotal += parseInt(el.value)
    //       })

    //       this.loading = false
    //     })
    //     .catch(error => {
    //       this.loading = false
    //       console.log(error)
    //     })
    // },
    getChartData () {
      let params = {
        beginDay: null,
        endDay: null
      }
      if (this.formData && this.formData.length > 0) {
        params.beginDay = this.formData[0]
        params.endDay = this.formData[1]
      }
      this.loading = true
      this.axios
        .post(
          this._global.businessUrl + '/criminalInOut/queryCriminalOutProvince',
          params
        )
        .then(response => {
          this.barChartData = {
            xAxis: [],
            yAxis: []
          }
          this.inRankingList = []
          response.columnDiagram.forEach((el, i) => {
            this.barChartData.xAxis.push(el.prisonName)
            let total = 0
            total = el.zfCount
            if (el.sub) {
              el.sub.forEach(item => {
                if (item.prisonName.indexOf('分监狱') !== -1) {
                  total = parseInt(el.zfCount) + parseInt(item.zfCount)
                }
              })
            }
            this.barChartData.yAxis.push(total)
            // 排名
            let obj = {
              name: el.prisonName,
              num: total,
              id: el.deptId,
              prisonName: el.prisonName
            }
            this.inRankingList.push(obj)
          })
          this.inRankingList.sort(this.creatCompare('num'))
          //   this.pieTypeData = response.types;
          //   this.pieTotal = 0;
          //   this.pieTypeData.forEach(el => {
          //     // 入监总数
          //     this.pieTotal += parseInt(el.value);
          //   });
          // response.trends.forEach(el => {
          //   this.lineReasonData.xAxis.push(el.name)
          //   this.lineReasonData.yAxis.push(el.value)
          // })
          this.pieTypeData = response.types
          this.pieTotal = 0
          this.pieTypeData.forEach(el => {
            // 入监总数
            this.pieTotal += parseInt(el.value)
          })

          this.loading = false
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    },
    jumpToPrison (id, prisonName) {
      // this.$router.push({
      //   name: 'criminal_out_prison_statistics',
      //   query: {
      //     id,
      //     prisonName
      //   }
      // })
      this.$emit('getRankingPrisonId', id, prisonName)
    }
  },
  created () {
    this.formData[0] = this.selectDate(new Date(yesterday))
    this.formData[1] = this.selectDate(new Date(today))
    this.pieDate[0] = this.selectDate(new Date(yesterday))
    this.pieDate[1] = this.selectDate(new Date(today))

    this.getInData()
    this.getChartData()
    // this.getPieData()
  }
}
</script>
<style lang="less" scoped>
.standard {
  .in-ranking {
    padding: 0 20px;
    li {
      margin: 0;
      padding: 0;
    }
    ul {
      height: 25rem;
      overflow-y: scroll;
      padding-left: 10px;
      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        p {
          margin: 5px 0;
          .ranking_num {
            display: inline-block;
            width: 25px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            // background: #314659;
            border-radius: 50%;
          }
          .ranking_num_grey {
            background: #f0f2f5;
          }
        }
      }
    }
  }
}
.technology {
  .in-ranking {
    padding: 0 20px;
    li {
      margin: 0;
      padding: 0;
    }
    ul {
      height: 25rem;
      overflow-y: scroll;
      padding-left: 10px;
      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        p {
          margin: 5px 0;
          .ranking_num {
            display: inline-block;
            width: 25px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
          }
          .ranking_num_grey {
            background: #15448b;
          }
        }
      }
    }
  }
}
</style>
