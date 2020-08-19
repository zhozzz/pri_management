<!--
 * @Description:
 * @Author:
 * @Date: 2019-09-05 17:24:28
 * @LastEditors: fylih
 * @LastEditTime: 2019-10-16 16:23:40
 -->
<template>
  <dept-layout v-model="changePrisonId">
    <div class="main-page">
      <div class="main_head">
        <div class="page_head">
          <div class="head_content"
               :style="note">
            <div class="content_people">
              <!-- <img class="people_icon"
              src="@/assets/index/people.png">-->
              <div class="content_main"
                   v-loading="allCriminalLoading"
                   element-loading-text="加载中"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.3)">
                <span class="content_title">{{isRoot?'全省':''}}实时罪犯数</span>
                <span class="content_font"
                      v-text="headData.allCriminal"></span>
              </div>
            </div>
          </div>
          <div class="head_content"
               :style="note">
            <div class="content_people">
              <!-- <img class="people_icon"
              src="@/assets/index/people.png">-->
              <div class="content_main"
                   v-loading="importCriminalLodding"
                   element-loading-text="加载中"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.3)">
                <span class="content_title">重点罪犯</span>
                <span class="content_font"
                      v-text="headData.importCriminal">208</span>
                <el-button class="head_btn yn_btn"
                           type="primary">查看详情</el-button>
              </div>
            </div>
          </div>
          <div class="head_content"
               :style="note">
            <div class="content_people">
              <!-- <img class="people_icon"
              src="@/assets/index/warning1.png">-->
              <div class="content_main">
                <span class="content_title">当前异常情况数</span>
                <span class="content_font">0</span>
                <el-button class="head_btn yn_btn"
                           type="primary">查看详情</el-button>
              </div>
            </div>
          </div>
          <div class="head_content"
               :style="note">
            <div class="content_people">
              <!-- <img class="people_icon"
              src="@/assets/index/people.png">-->
              <div class="content_main">
                <span class="content_title">当前突发事故</span>
                <span class="content_font"
                      v-text="headData.suddenAccident"></span>
              </div>
            </div>
          </div>
          <div class="head_content"
               :style="note">
            <div class="content_people">
              <!-- <img class="people_icon"
              src="@/assets/index/people.png">-->
              <div class="content_main">
                <span class="content_title">值班警察数</span>
                <span class="content_font"
                      v-text="headData.prisonCop"></span>
              </div>
            </div>
          </div>
          <div class="head_content"
               :style="note">
            <div class="content_people">
              <!-- <img class="people_icon"
              src="@/assets/index/people.png">-->
              <div class="content_main">
                <span class="content_title">监控设备损坏数</span>
                <span class="content_font">0</span>
              </div>
            </div>
          </div>
          <div class="head_content"
               :style="note">
            <div class="content_people">
              <!-- <img class="people_icon"
              src="@/assets/index/warning2.png">-->
              <div class="content_main">
                <span class="content_title">当前系统工单数</span>
                <span class="content_font">0</span>
                <el-button class="head_btn yn_btn"
                           type="primary">查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="echarts">
        <!-- <el-col :gutter="10">
        <el-col :span="9">-->
        <div class="echarts_left"
             :style="left"
             v-loading="countCriminalByPrisonLodding"
             element-loading-text="加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.3)">
          <div class="echarts_distribution">
            <span>{{isRoot?'全省':'监区'}}罪犯分布</span>
            <criminal-distribution :pieData="pieDistributionData"></criminal-distribution>
          </div>
        </div>
        <!-- </el-col> -->
        <!-- <el-col :span="15"> -->
        <!-- </el-col> -->
        <!-- </el-col> -->
        <!-- <el-col>
        <el-col :span="9">-->
        <div class="echarts_left left_table"
             :style="left">
          <div class="prison_ranking">
            <span>各{{isRoot?'监狱':'监区'}}考评排行</span>
            <el-button class="ranking_btn"
                       type="text">查看所有</el-button>
            <el-table class="yn_table"
                      :data="changePrisonId==1?rankingData:rankingData2"
                      :style="{background:'#0d386b'}"
                      :row-style="{background:'#0d386b',color:'white'}"
                      :header-cell-style="{background:'#0d386b',color:'white'}"
                      :row-cell-style="{border:'none'}">
              <el-table-column prop="ranking"
                               align="center"
                               label="排名"
                               width="60px">
                <template slot-scope="scope"
                          prop="ranking">
                  <img :src="td_1"
                       v-if="scope.row.ranking==1"
                       style="height:16px;" />
                  <img :src="td_2"
                       v-if="scope.row.ranking==2"
                       style="height:16px;" />
                  <img :src="td_3"
                       v-if="scope.row.ranking==3"
                       style="height:16px;" />
                  <span v-if="scope.row.ranking==4">{{scope.row.ranking}}</span>
                  <span v-if="scope.row.ranking==5">{{scope.row.ranking}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prison"
                               align="center"
                               label="监狱"
                               minWidth="150"></el-table-column>
              <el-table-column prop="previous"
                               align="center"
                               label="相比上月"
                               minWidth="150"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="echarts_right"
             :style="right"
             v-loading="safetyDataLoddiing"
             element-loading-text="加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.3)">
          <div class="echarts_safety">
            <span>{{isRoot?'全省':''}}监狱实时安全指标</span>
            <safety-indicators :chartData="safety"></safety-indicators>
          </div>
        </div>
        <!-- </el-col>
        </el-col>-->
      </div>
      <!-- <super-map></super-map> -->
      <iframe src="http://10.9.152.66/Apps/PrisonVisualizationViewer/index.html"
              frameborder="0"
              height="800px"
              width="100%"></iframe>
    </div>
  </dept-layout>
</template>
<script>
import superMap from '@/components/super_map'
import criminalDistribution from './echarts/criminal_distribution'
import formatDate from '@/utils/date'
import safetyIndicators from './echarts/safety_indicators'
import { getPrisonId, getUserId } from '@/utils'
import deptLayout from '@/components/deptLayout/index.vue'
import {
  getCriminal,
  allCriminal,
  countCriminalByPrison,
  prisonCriminal,
  countDutyPoliceByPrison,
  getSuddenAccident
} from './service'
import _global from '@/utils/global_url'
export default {
  components: { superMap, criminalDistribution, safetyIndicators, deptLayout },
  data () {
    return {
      td_1: `${require('../../assets/index/cup_1.gif')}`,
      td_2: `${require('../../assets/index/cup_2.png')}`,
      td_3: `${require('../../assets/index/cup_3.png')}`,
      note: {
        backgroundImage:
          'url(' + require('../../assets/index/bg_car1.png') + ') ',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        // backgroundRepeat: "inherit",
        // backgroundSize: "cover"
        backgroundSize: 'contain'
      },
      left: {
        backgroundImage:
          'url(' + require('../../assets/index/bg_car6.png') + ') ',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        // backgroundRepeat: "inherit",
        // backgroundSize: "cover"
        backgroundSize: '100% 100%'
      },
      right: {
        backgroundImage:
          'url(' + require('../../assets/index/bg_car3.png') + ') ',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        // backgroundRepeat: "inherit",
        // backgroundSize: "cover"
        backgroundSize: '100% 100%'
      },
      changePrisonId: getPrisonId(),
      headData: {
        allCriminal: 0, // 犯人数
        importCriminal: 0, // 重点犯人数
        prisonCop: 0, // 值班狱警人数
        suddenAccident: 0 // 突发事件数
      },
      pieDistributionData: [],
      rankingData: [
        { ranking: 1, prison: '监狱一', previous: '10%' },
        { ranking: 2, prison: '监狱二', previous: '10%' },
        { ranking: 3, prison: '监狱三', previous: '10%' },
        { ranking: 4, prison: '监狱四', previous: '10%' },
        { ranking: 5, prison: '监狱五', previous: '10%' }
      ],
      rankingData2: [
        { ranking: 1, prison: '监区一', previous: '12%' },
        { ranking: 2, prison: '监区二', previous: '15%' },
        { ranking: 3, prison: '监区三', previous: '11%' },
        { ranking: 4, prison: '监区四', previous: '12%' },
        { ranking: 5, prison: '监区五', previous: '14%' }
      ],
      pieReasonData: [
        { name: '第八监狱', value: 1200 },
        { name: '第二监狱', value: 1300 },
        { name: '第三监狱', value: 1400 },
        { name: '第四监狱', value: 2000 }
      ],
      safetyData: {
        xAxis: [
          '云南省第一女子监狱',
          '云南省第二女子监狱',
          '小龙潭监狱',
          '监狱一',
          '监狱二',
          '监狱三',
          '监狱四',
          '监狱五'
        ],
        yAxis: [10, 20, 30, 30, 15, 40, 24, 58]
      },
      safetyData2: {
        xAxis: [
          '一监区',
          '二监区',
          '三监区',
          '四监区',
          '五监区',
          '六监区',
          '七监区'
        ],
        yAxis: [22, 42, 32, 10, 15, 40, 24, 58]
      },
      allCriminalLoading: false,
      importCriminalLodding: false,
      prisonCopLodding: false,
      countCriminalByPrisonLodding: false,
      safetyDataLoddiing: false
    }
  },
  methods: {
    getHeadData () {
      this.allCriminalLoading = true
      this.importCriminalLodding = true
      //   this.prisonCopLodding = true
      let { changePrisonId } = this
      // let fromData = { prisonId: changePrisonId }
      // 值班警察
      countDutyPoliceByPrison(changePrisonId).then(res => {
        this.headData.prisonCop = res
      })
      // 突发事件
      getSuddenAccident({
        emPrisonId: changePrisonId,
        startTime: new Date(formatDate(new Date(), 'yyyy-MM-dd') + ' 00:00:00').getTime(),
        endTime: new Date(formatDate(new Date(), 'yyyy-MM-dd') + ' 23:59:59').getTime()
      }).then(res => {
        this.headData.suddenAccident = res.total
      })
      getCriminal(changePrisonId).then(res => {
        this.headData.importCriminal = res
        this.importCriminalLodding = false
      }) // 重点罪犯
      allCriminal(changePrisonId).then(res => {
        this.headData.allCriminal = res
        this.allCriminalLoading = false
      }) // 全部罪犯
      this.countCriminalByPrisonLodding = true
      if (changePrisonId == 1) {
        countCriminalByPrison().then(res => {
          this.pieDistributionData = res.map(item => {
            let k = Object.keys(item)[0]
            // let val = item[k] == 0 ? null : item[k];
            if (item[k] > 0 && item[k]) {
              return { name: k, value: item[k] }
            }
            this.countCriminalByPrisonLodding = false
          })
        }) // 全部罪犯
      } else {
        prisonCriminal(changePrisonId).then(res => {
          this.pieDistributionData = res.map(item => {
            if (item.zfCount > 0) {
              this.countCriminalByPrisonLodding = false
              return { name: item.prisonName, value: item.zfCount }
            }
          })
          this.countCriminalByPrisonLodding = false
        })
      }
    }
  },
  mounted () {
    this.getHeadData()
  },
  watch: {
    changePrisonId () {
      this.getHeadData()
    }
  },
  computed: {
    isRoot () {
      return this.changePrisonId === '1'
    },
    safety () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.safetyDataLoddiing = true
      let data = {}
      this.changePrisonId === '1'
        ? (data = this.safetyData)
        : (data = this.safetyData2)
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.safetyDataLoddiing = false
      return data
    }
  }
}
</script>
<style lang="less" scoped>
.main-page {
  position: relative;
  width: 100%;
  background: #0d386b;
  // .main_head {
  // height: 195px;
  // box-sizing: border-box;
  // padding-top: 45px;
  // padding-bottom: 30px;
  // }
  .page_head {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    .head_content {
      text-align: center;
      width: 13rem;
      height: 10rem;
      // .content_font {
      // }
      .head_btn {
        width: 80px;
        padding: 4px 0;
      }
    }
    .content_title {
      color: #fff;
      font-weight: 600;
      display: block;
    }
    .content_font {
      font-size: 2rem;
      color: #43d3ff;
      font-weight: 800;
    }
    .content_people {
      height: 100%;
      width: 100%;
      .content_main {
        padding: 2rem 0;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }
      .people_icon {
        width: 25%;
        float: left;
        margin-top: 0.8rem;
        margin-right: 0.2rem;
      }
    }
  }
  .echarts {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-around;
    .echarts_left {
      width: 50%;
      position: relative;
      .echarts_distribution {
        span {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          top: 4%;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }
      }
      .prison_ranking {
        padding-bottom: 20px;
        /deep/.el-table__row:hover {
          color: black !important;
        }
        .ranking_btn {
          float: right;
          margin-right: 2rem;
          margin-top: 3rem;
          font-size: 1.2rem;
          color: white;
          &:hover {
            color: rgb(199, 33, 33);
          }
        }
        span {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          top: 4%;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }
      }
    }
    .left_table {
      .el-table {
        margin-left: auto;
        margin-right: auto;
        margin-top: 8px;
        width: 90%;
        .bg {
          background: #0d386b;
        }
      }
    }
    .echarts_right {
      width: 100%;
      position: relative;
      .echarts_safety {
        span {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          top: 4%;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }
}
/deep/.yn_table.el-table th {
  background: #0d386b !important;
}
/deep/.yn_table.el-table .el-table__header,
/deep/.yn_table.el-table .el-table__body {
  width: 100% !important;
}
</style>
