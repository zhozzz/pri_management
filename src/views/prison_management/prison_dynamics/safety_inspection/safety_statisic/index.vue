<!--
 * @Description: 隐患排查管理
 * @Author:fzw
 * @Date: 2019-08-31 11:01
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:29:03

 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','监狱动态','隐患排查报表']">
      <tab slot="heade_btn" name="隐患排查管理" :left="true" pathName="safety_inspection" />
      <el-row :gutter="10">
        <el-col :span="8">
          <headIcon :list="headIconList" :span="12"></headIcon>
        </el-col>
        <el-col :span="16">
          <div class="big_cards">
            <div class="card_item">
              <img :src="require('@/assets/other/icon_plaint.png')" />
              <div style="margin:1rem 0">尚未整改</div>
              <div class="num">{{cradInfo.notCorrected}}</div>
            </div>
            <div class="card_item dashed">
              <div class="item_title">
                <div class="cri"></div>整改进行中
              </div>
              <div class="num">{{cradInfo.proceed}}</div>
              <div class="detail_nums">
                <div>
                  非长期
                  <span>{{cradInfo.notLongTerm}}</span>
                </div>
                <div>
                  长期
                  <span>{{cradInfo.longTerm}}</span>
                </div>
                <div>
                  未上报进度
                  <span>{{cradInfo.longTermNotReport}}</span>
                </div>
              </div>
            </div>
            <div class="card_item">
              <div class="item_title">
                <div class="cri err"></div>已超时
              </div>
              <div class="num">{{cradInfo.notProceed}}</div>
              <div class="detail_nums">
                <div>
                  未上报进度
                  <span>{{cradInfo.outTimeNotReport}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="chart_box yn_charts" v-if="prisonId==1">
        <h3>各监狱数量排名统计</h3>
        <el-row>
          <el-col :span="14" :offset="4">
            <timeSel selName="各监狱数量排名统计" @selcetTime="rankTime" :prisonId="prisonId" />
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <h3>排查总数:{{checkTotal}}</h3>
            <colnumBar :chartData="checkRankData" chartName="各监狱排查总数排名统计" />
          </el-col>
          <el-col :span="12">
            <h3>整改总数:{{aimTotal}}</h3>

            <colnumBar :chartData="aimRankData" chartName="各监狱整改总数排名统计" />
          </el-col>
        </el-row>
      </div>
      <div class="chart_box yn_charts">
        <h3>隐患等级分布</h3>

        <el-row>
          <el-col :span="14" :offset="4">
            <timeSel selName="隐患等级分布" @selcetTime="pieTime" :prisonId="prisonId" />
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <h3>排查总数:</h3>
            <pieCharts
              :chartData="checkPie"
              :dataList="checkPie"
              :centerTitle="['总计','次']"
              :radius="['0','60%']"
              :isAnnulus="false"
            />
          </el-col>
          <el-col :span="12">
            <h3>整改总数:</h3>

            <pieCharts
              :chartData="aimPie"
              :dataList="aimPie"
              :centerTitle="['总计','次']"
              :radius="['0','60%']"
              :isAnnulus="false"
            />
          </el-col>
        </el-row>
      </div>

      <div class="chart_box yn_charts">
        <h3>隐患性质排名统计</h3>

        <el-row>
          <el-col :span="14" :offset="4">
            <timeSel @selcetTime=" twoColTime" :prisonId="prisonId" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <barCharts :chartData="typeCountData" chartName="隐患性质排名统计" />
          </el-col>
        </el-row>
      </div>
      <div class="chart_box yn_charts">
        <h3>隐患整改率同期对比</h3>

        <el-row>
          <el-col :span="14" :offset="4">
            <timeSel :noSel="true" @selcetTime="lineTime" :prisonId="prisonId" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <lineCharts :lineReasonData="lineData" />
          </el-col>
        </el-row>
      </div>

      <div class="chart_box yn_charts" v-if="prisonId==1">
        <h3>整治率排名</h3>
        <el-row>
          <el-col :span="14" :offset="4">
            <timeSel @selcetTime="rateTime" :prisonId="prisonId" />
            <div class="yn_page_title" style="textAlign:center">全省平均整治率{{allRank}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <barCharts
              :isNumber="false"
              :chartData="rateRanktData"
              chartName="整治率排名"
              :dimensions="['prison', '整改率']"
            />
          </el-col>
        </el-row>
      </div>

      <div class="chart_box yn_charts">
        <h3>每月排查、整改数</h3>

        <el-row>
          <el-col :span="14" :offset="4">
            <timeSel :noSel="true" @selcetTime="yearTime" :prisonId="prisonId" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <yearBar
              :chartData="yearData"
              chartName="每月排查、整改数"
              :dimensions="['prison', '整改数','排查数']"
            />
          </el-col>
        </el-row>
      </div>
    </menuTree>
  </dept-layout>
</template>

<script>
import _global from '@/utils/global_url'
import deptLayout from '@/components/deptLayout/index.vue'
import tab from '@/components/tab/index.vue'
import pieCharts from '@/components/pie_charts/pie_charts.vue'
import colnumBar from './colnum_bar.vue'
import lineCharts from './line_charts.vue'
import timeSel from './time_sel.vue'
import { Loading } from 'element-ui'
import headIcon from './head_icon.vue'
import barCharts from './bar_charts.vue'
import yearBar from './year_bar.vue'
import menuTree from '@/components/menu_tree/'

import { getPrisonId, getDeptId } from '@/utils'
import {
  getCards,
  getProvince,
  getLevel,
  getLineData,
  getTypeCount,
  getRectifyRateRank,
  getRankAll,
  getYearData
} from './service.js'

export default {
  components: {
    deptLayout,
    tab,
    timeSel,
    colnumBar,
    headIcon,
    pieCharts,
    lineCharts,
    barCharts,
    yearBar,
    menuTree
  },
  name: 'index',
  data() {
    return {
      prisonId: getPrisonId(),
      deptId: getDeptId(),

      rankData: {},
      cradInfo: {},
      headIconList: [
        {
          url: require('@/assets/other/icon_plaint.png'),
          info: '总数',
          text: 0,
          isRouter: true,
          routerString: 'safety_inspection',
          params: {}
        },
        {
          url: require('@/assets/other/icon_plaint.png'),
          info: '整改率',
          text: 0
        },
        {
          url: require('@/assets/other/icon_plaint.png'),
          info: '已整改',
          text: 0,
          isRouter: true,
          routerString: 'safety_inspection',
          params: { checked: true }
        },
        {
          url: require('@/assets/other/icon_plaint.png'),
          info: '未整改',
          text: 0,
          isRouter: true,
          routerString: 'safety_inspection',
          params: {}
        }
      ],
      checkRankData: {},
      aimRankData: {},
      checkTotal: 0,
      aimTotal: 0,
      rankArr: [],
      pieArr: [],
      checkPie: [],
      aimPie: [],
      lineData: { xAxis: [], yAxis: [] },
      typeCountData: [],
      rateRanktData: [],
      allRank: 0,
      yearData: []
    }
  },
  created() {
    this.getCards()
  },
  methods: {
    nodeClick(val) {
      this.prisonId = val.id
      this.getCards()
    },
    getCards() {
      getCards(this.prisonId).then(res => {
        this.cradInfo = res

        this.$set(this.headIconList[0], 'text', res.total)
        this.$set(this.headIconList[1], 'text', res.percent + '%')
        this.$set(this.headIconList[2], 'text', res.corrected)
        this.$set(this.headIconList[3], 'text', res.notCorrected)
      })
    },
    getLevel(val) {
      getLevel(val, this.prisonId).then(res => {
        this.checkPie = []
        this.aimPie = []
        res.checkCount.map(item => {
          if (item.result !== 0) {
            this.checkPie.push({ name: item.name, value: item.result })
          }
        })
        res.aimCount.map(item => {
          if (item.result !== 0) {
            this.aimPie.push({ name: item.name, value: item.result })
          }
          //   return { name: item.name, value: item.result }
        })
      })
    },
    getProvince(val) {
      getProvince(val).then(res => {
        this.checkRankData = { xAxis: [], yAxis: [] }
        this.checkTotal = 0
        this.aimTotal = 0
        res.checkCount.map(item => {
          this.checkRankData.xAxis.push(item.name)
          this.checkRankData.yAxis.push(item.result)
          this.checkTotal += item.result
        })
        this.checkRankData.xAxis = this.checkRankData.xAxis.reverse()
        this.checkRankData.yAxis = this.checkRankData.yAxis.reverse()

        this.aimRankData = { xAxis: [], yAxis: [] }

        res.aimCount.map(item => {
          this.aimRankData.xAxis.push(item.name)
          this.aimRankData.yAxis.push(item.result)
          this.aimTotal += item.result
        })
        this.aimRankData.xAxis = this.aimRankData.xAxis.reverse()
        this.aimRankData.yAxis = this.aimRankData.yAxis.reverse()
      })
    },
    getRateRank(val) {
      getRectifyRateRank(val).then(res => {
        this.rateRanktData = res.map(item => {
          return {
            prison: item.name,
            整改率: item.rate * 100
          }
        })
        this.rateRanktData.reverse()
      })
    },
    getDoubleCol(val) {
      getTypeCount(val, this.prisonId).then(res => {
        this.typeCountData = res.map(item => {
          return {
            prison: item.name,
            已排查: item.checkCount,
            已整改: item.aimCount
          }
        })
        this.typeCountData.reverse()
      })
    },
    rankTime(val) {
      this.rankArr = []
      this.rankArr = val.month.map(item => {
        return val.year + '-' + item
      })
      this.getProvince(this.rankArr)
    },
    rateTime(val) {
      let arr = []

      arr = val.month.map(item => {
        return val.year + '-' + item
      })
      this.getRankAll(arr)
      this.getRateRank(arr, val.isQuarter)
    },
    getRankAll(val) {
      getRankAll(val).then(res => {
        this.allRank = res * 100 + '%'
      })
    },
    pieTime(val) {
      this.pieArr = []
      this.pieArr = val.month.map(item => {
        return val.year + '-' + item
      })
      this.getLevel(this.pieArr)
    },
    lineTime(val) {
      this.getLine(val.year + '-01-01 00:00:00', val.isQuarter)
    },
    twoColTime(val) {
      let arr = []
      arr = val.month.map(item => {
        return val.year + '-' + item
      })
      this.getDoubleCol(arr, val.isQuarter)
    },
    getLine(val, isQuarter) {
      this.lineData = { xAxis: [], yAxis: { rate: [], yearRate: [] } }
      getLineData(this.prisonId + '/' + val).then(res => {
        res.map((item, i) => {
          if (isQuarter) {
            if ((i + 1) % 3 === 0) {
              this.lineData.xAxis.push('第' + (i + 1) / 3 + '季度')
              this.lineData.yAxis.rate.push(item.rate * 100)
              this.lineData.yAxis.yearRate.push(item.yearRate * 100)
            }
          } else {
            this.lineData.xAxis.push(item.monthName)
            this.lineData.yAxis.rate.push(item.rate * 100)
            this.lineData.yAxis.yearRate.push(item.yearRate * 100)
          }
        })
      })
    },
    yearTime(val) {
      this.getYearData(val.year + '-01-01 00:00:00', val.isQuarter)
    },
    getYearData(val, isQuarter) {
      this.yearData = []
      getYearData(this.prisonId + '/' + val).then(res => {
        res.map((item, i) => {
          if (isQuarter) {
            if ((i + 1) % 3 === 0) {
              this.yearData.push({
                prison: '第' + (i + 1) / 3 + '季度',
                整改数:
                  res[i].checkCount +
                  res[i - 1].checkCount +
                  res[i - 2].checkCount,
                排查数:
                  res[i].aimCount + res[i - 1].aimCount + res[i - 2].aimCount
              })
            }
          } else {
            this.yearData.push({
              prison: item.monthName,
              整改数: item.checkCount,
              排查数: item.aimCount
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.chart_box {
  width: 100%;
  margin: 2rem 1rem;
  font-size: 1.2rem;
}
.big_cards {
  width: 100%;
  height: 100%;
  display: flex;
  background: #fbfcff;
  border: 1px solid rgba(205, 221, 237, 1);

  .card_item {
    width: 30%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: space-around;
    align-items: center;
    padding: 2rem 1rem;
    font-size: 1.2rem;
    img {
      width: 2rem;
      height: 2rem;
    }
    .num {
      font-size: 2.4rem;
      font-weight: 600;
      margin: 0.7rem 0;
    }

    .item_title {
      display: flex;
      align-items: center;
      .cri {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #4099ed;
        margin: 0 1rem;
      }
      .err {
        background: #f59a24;
      }
    }
    .detail_nums {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      span {
        font-size: 1.6rem;
      }
    }
  }
  .dashed {
    border: 1px dashed rgba(205, 221, 237, 1);
    border-top: none;
    border-bottom: none;
    width: 40%;
  }
}

.cards_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.technology {
  .big_cards {
    color: #fff;
    background: transparent;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    .num {
      color: #4099ed;
    }
    .detail_nums span {
      color: #4099ed;
    }
    .dashed {
      border: 1px dashed #7cdafd;
    }
  }
}
</style>
