<template>
  <div>
    <el-form :inline="true"
             :model="form"
             class="demo-form-inline yn_form">
      <el-form-item label="考核周期">
        <el-date-picker v-model="form.date"
                        type="date"
                        class="yn_ipt"
                        placeholder="选择日期"
                        @change="getCheckDate"
                        size="mini"></el-date-picker>
      </el-form-item>
      <el-form-item label="所有监狱平均分"
                    style="margin-left:20px">
        <el-input v-model="form.score"
                  placeholder
                  class="yn_ipt"
                  size="mini"
                  disabled></el-input>
      </el-form-item>
    </el-form>
    <!-- 监狱列表 -->
    <div class="itemBox">
      <div v-for="(item,index) in itemList"
           :key="item.id"
           class="singleItem"
           :class="{active:isCutItemStyle===index}"
           @mouseenter="showActiveStyle(index)"
           @mouseleave="hideActiveStyle">
        <div class="leftMsg">
          <div class="title">
            {{item.itemName}}
            <img v-show="isCutItemStyle!==index"
                 src="@/assets/other/icon_plaint.png"
                 @mouseenter="showScoreGist(index)"
                 @mouseleave="hideScoreGist" />
            <img v-show="isCutItemStyle===index"
                 src="@/assets/other/icon_plaint_white.png"
                 @mouseenter="showScoreGist(index)"
                 @mouseleave="hideScoreGist" />
            <el-card class="box-card gist"
                     v-show="isScoreGist===index">
              <p style="margin:0"
                 v-for="(value,i) in gist"
                 :key="value.role">({{i+1}})&nbsp;{{value.role}},扣{{value.reduce}}分</p>
            </el-card>
          </div>
          <div class="scoreStatus"
               @mouseenter="showDetails(index)"
               @mouseleave="hideDetails">
            <img v-show="isCutItemStyle!==index"
                 src="@/assets/other/icon_question.png" />
            <img v-show="isCutItemStyle===index"
                 src="@/assets/other/icon_question_white.png" />
            <span>扣分详情</span>
            <el-card class="box-card"
                     style="width:200px;position:relative;z-index:100"
                     v-show="isShowScoreDetails===index">
              <p v-for="(value,i) in item.reduceMsg"
                 :key="value.reason">({{i+1}})&nbsp;{{value.reason}},减{{value.score}}分</p>
            </el-card>
          </div>
        </div>
        <div class="rightScore">
          {{item.totalScore}}
          <span style="font-size:18px">分</span>
        </div>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="yn_charts">
          <h3>月度排名</h3>
          <div id="monthRanking"
               style="height:300px"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/utils/mixins/resize.js'
import color from '@/utils/echarts_color'
export default {
  mixins: [resize],
  data () {
    return {
      form: {
        date: '',
        score: 85
      },
      chart: null,
      // 列表数据
      itemList: [
        {
          id: 1,
          itemName: '云南省临沧监狱',
          totalScore: 97,
          reduceMsg: [
            {
              reason: '扣分原因1',
              score: 5
            },
            {
              reason: '扣分原因2',
              score: 4
            }
          ]
        },
        {
          id: 2,
          itemName: '云南省未成年犯管教所',
          totalScore: 87,
          reduceMsg: [
            {
              reason: '扣分原因1',
              score: 5
            },
            {
              reason: '扣分原因2',
              score: 4
            }
          ]
        },
        {
          id: 3,
          itemName: '云南省楚雄监狱',
          totalScore: 90,
          reduceMsg: [
            {
              reason: '扣分原因1',
              score: 5
            },
            {
              reason: '扣分原因2',
              score: 4
            }
          ]
        },
        {
          id: 4,
          itemName: '云南省中安监狱',
          totalScore: 95,
          reduceMsg: [
            {
              reason: '扣分原因1',
              score: 5
            },
            {
              reason: '扣分原因2',
              score: 4
            }
          ]
        },
        {
          id: 5,
          itemName: '云南省西双版纳监狱',
          totalScore: 88,
          reduceMsg: [
            {
              reason: '扣分原因1',
              score: 5
            },
            {
              reason: '扣分原因2',
              score: 4
            }
          ]
        },
        {
          id: 6,
          itemName: '云南省普洱监狱',
          totalScore: 96,
          reduceMsg: [
            {
              reason: '扣分原因1',
              score: 5
            },
            {
              reason: '扣分原因2',
              score: 4
            }
          ]
        },
        {
          id: 7,
          itemName: '云南省第六监狱',
          totalScore: 83,
          reduceMsg: [
            {
              reason: '扣分原因1',
              score: 5
            },
            {
              reason: '扣分原因2',
              score: 4
            }
          ]
        }
      ],
      gist: [
        {
          role: '规则一',
          reduce: 4
        },
        {
          role: '规则二',
          reduce: 3
        }
      ],
      isCutItemStyle: '', // 列表选中标杆
      isShowScoreDetails: '', // 卡片显示标杆
      isScoreGist: ''
    }
  },
  methods: {
    getCheckDate () {
      console.log(this.form.date)
    },
    showActiveStyle (index) {
      // 单项移入切换样式
      this.isCutItemStyle = index
    },
    hideActiveStyle () {
      // 单项移出切换样式
      this.isCutItemStyle = ''
    },
    showDetails (index) {
      // 移入详情显示扣分详情
      this.isShowScoreDetails = index
    },
    hideDetails () {
      // 移出详情隐藏扣分详情
      this.isShowScoreDetails = ''
    },
    showScoreGist (index) {
      // 移入显示扣分依据详情
      this.isScoreGist = index
    },
    hideScoreGist () {
      // 移出隐藏扣分依据详情
      this.isScoreGist = ''
    },
    getRankEcharts () {
      let xAxisData = []
      let seriesData = []
      for (let key in this.itemList) {
        xAxisData.push(this.itemList[key].itemName)
        seriesData.push(this.itemList[key].totalScore)
      }
      this.chart = echarts.init(document.getElementById('monthRanking'))
      this.chart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: color()
              }
            },
            axisLabel: {
              rotate: 40,
              textStyle: {
                color: color()
              }
            }
          }
        ],
        yAxis: [
          {
            axisLine: {
              lineStyle: {
                color: color()
              }
            },
            type: 'value',
            axisLabel: {
              rotate: 40,
              textStyle: {
                color: color()
              }
            }
          }
        ],
        series: [
          {
            name: '当月分数',
            type: 'bar',
            barWidth: '30%',
            data: seriesData
          }
        ]
      })
    }
  },
  mounted () {
    // 载入echarts
    this.getRankEcharts()
  }
}
</script>

<style lang="less" scoped>
.technology {
  .itemBox .singleItem.active {
    color: #2b8bef;

    .leftMsg {
      .title {
        color: #2b8bef;
      }
    }
    .rightScore {
      color: #2b8bef;

      span {
        color: #2b8bef;
      }
    }
  }
  .itemBox .singleItem {
    color: #fff;
    background: transparent;
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    .leftMsg {
      .title {
        color: #fff;
      }
    }
    .rightScore {
      color: #fff;

      span {
        color: #fff;
      }
    }
  }
}
.el-date-editor.el-input {
  width: 172px;
}
.el-input {
  width: 92px;
}
.grid-content {
  height: 150px;
}
.itemBox {
  display: grid;
  grid-template-columns: repeat(4, 24%);
  grid-column-gap: 1%;
  grid-row-gap: 20px;
  margin-bottom: 30px;
  .singleItem {
    cursor: pointer;
    height: 150px;
    background: rgba(251, 252, 255, 1);
    border: 1px solid rgba(215, 225, 237, 1);
    border-top: 4px solid rgba(43, 139, 239, 1);
    border-radius: 4px;
    display: flex;
    box-sizing: border-box;
    padding: 30px 20px 30px 30px;
    justify-content: space-between;
    .leftMsg {
      width: 70%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      position: relative;
      .title {
        width: 100%;
        height: 56px;
        line-height: 28px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        box-sizing: border-box;
        padding-right: 10px;
        position: relative;
        img {
          width: 15px;
          height: 15px;
        }
        .gist {
          width: 200px;
          position: absolute;
          z-index: 120;
          top: 56px;
          left: 0;
          font-size: 12px;
          font-weight: normal;
          line-height: 24px;
        }
      }
      .scoreStatus {
        position: absolute;
        left: 4px;
        bottom: 4px;
        font-size: 12px;
        font-family: SimSun;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        height: 17px;
        line-height: 17px;
        img {
          width: 17px;
          height: 17px;
          vertical-align: middle;
          margin-bottom: 1px;
        }
      }
    }
    .rightScore {
      position: relative;
      min-width: 100px;
      font-size: 64px;
      color: rgba(43, 139, 239, 1);
      width: 30%;
      box-sizing: border-box;
      padding-top: 14px;
      padding-right: 20px;
      text-align: right;
      span {
        position: absolute;
        bottom: 0;
        right: 0;
        color: #666;
      }
    }
  }
}
// 适配小屏幕一排为三个
@media screen and (max-width: 1500px) {
  .itemBox {
    display: grid;
    grid-template-columns: repeat(3, 32%);
    grid-column-gap: 1%;
    grid-row-gap: 20px;
  }
}
//适配屏幕小于1200px 修改title字体格式
@media screen and (max-width: 1200px) {
  .title {
    font-size: 16px !important;
    line-height: 20px !important;
    padding-top: 12px;
  }
}
.singleItem.active {
  background-color: #2b8bef;
  .leftMsg {
    color: #fff;
    .title {
      color: #fff;
    }
    .scoreStatus {
      color: #fff;
      img {
        width: 17px;
        height: 17px;
        vertical-align: middle;
        margin-bottom: 1px;
      }
    }
  }
  .rightScore {
    color: #fff;
    span {
      color: #fff;
    }
  }
}
</style>
