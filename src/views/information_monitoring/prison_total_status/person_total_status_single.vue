<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline yn_form">
      <el-form-item label="考核周期">
        <el-date-picker
          v-model="form.date"
          class="yn_ipt"
          type="date"
          placeholder="选择日期"
          @change="getCheckDate"
          size="mini"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="本次得分" style="margin-left:20px">
        <el-input class="yn_ipt" v-model="form.score" placeholder size="mini" disabled></el-input>
      </el-form-item>
    </el-form>
    <div class="itemBox">
      <div
        v-for="(item,index) in itemList"
        :key="item.id"
        class="singleItem"
        :class="{active:isCutItemStyle===index}"
        @mouseenter="showActiveStyle(index)"
        @mouseleave="hideActiveStyle"
      >
        <div class="leftMsg">
          <div class="title">
            {{item.itemName}}
            <img
              v-show="isCutItemStyle!==index"
              @mouseenter="showScoreGist(index)"
              @mouseleave="hideScoreGist"
              src="@/assets/other/icon_plaint.png"
            />
            <img
              v-show="isCutItemStyle===index"
              @mouseenter="showScoreGist(index)"
              @mouseleave="hideScoreGist"
              src="@/assets/other/icon_plaint_white.png"
            />
            <el-card class="box-card gist" v-show="isScoreGist===index">
              <p
                style="margin:0"
                v-for="(value,i) in gist"
                :key="value.role"
              >({{i+1}})&nbsp;{{value.role}},扣{{value.reduce}}分</p>
            </el-card>
          </div>
          <div class="scoreStatus" @mouseenter="showDetails(index)" @mouseleave="hideDetails">
            <img v-show="isCutItemStyle!==index" src="@/assets/other/icon_question.png" />
            <img v-show="isCutItemStyle===index" src="@/assets/other/icon_question_white.png" />
            <span>扣分详情</span>
            <el-card
              class="box-card"
              style="width:200px;position:relative;z-index:100"
              v-show="isShowScoreDetails===index"
            >
              <p
                v-for="(value,i) in item.reduceMsg"
                :key="value.reason"
              >({{i+1}})&nbsp;{{value.reason}},减{{value.score}}分</p>
            </el-card>
          </div>
        </div>

        <div class="rightScore">
          {{item.itemScore}}/{{item.totalScore}}
          <span style="font-size:16/14rem">分</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['prisonId'],
  data() {
    return {
      form: {
        date: '',
        score: 85
      },
      itemList: [
        {
          id: 1,
          itemName: '监狱值班警力配置',
          itemScore: 9,
          totalScore: 10,
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
          itemName: '监狱值班领导值班在岗及巡查情况',
          itemScore: 9,
          totalScore: 10,
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
          itemName: '监狱关押能力',
          itemScore: 9,
          totalScore: 10,
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
          itemName: '监狱押犯类型',
          itemScore: 9,
          totalScore: 10,
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
          itemName: '监狱警囚及警察占比',
          itemScore: 9,
          totalScore: 10,
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
          itemName: '监狱罪犯离监情况',
          itemScore: 9,
          totalScore: 10,
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
          itemName: '罪犯禁闭隔离情况',
          itemScore: 9,
          totalScore: 10,
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
          id: 8,
          itemName: '外来（协）人员进入监管区',
          itemScore: 9,
          totalScore: 10,
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
          id: 9,
          itemName: '罪犯死亡情况',
          itemScore: 9,
          totalScore: 10,
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
          id: 10,
          itemName: '技防系统运行情况',
          itemScore: 9,
          totalScore: 10,
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
          id: 11,
          itemName: '外来车辆进入监管区',
          itemScore: 9,
          totalScore: 10,
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
          id: 12,
          itemName: '巡查督查情况',
          itemScore: 9,
          totalScore: 10,
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
          id: 13,
          itemName: '监狱突发事件',
          itemScore: 9,
          totalScore: 10,
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
      isShowScoreDetails: '',
      isCutItemStyle: '',
      isScoreGist: ''
    }
  },
  methods: {
    getCheckDate() {
      console.log(this.form.date)
    },
    showActiveStyle(index) {
      // 单项移入切换样式
      this.isCutItemStyle = index
    },
    hideActiveStyle() {
      // 单项移出切换样式
      this.isCutItemStyle = ''
    },
    showDetails(index) {
      // 移入详情显示扣分详情
      this.isShowScoreDetails = index
    },
    hideDetails() {
      // 移出详情隐藏扣分详情
      this.isShowScoreDetails = ''
    },
    showScoreGist(index) {
      // 移入显示扣分依据详情
      this.isScoreGist = index
    },
    hideScoreGist() {
      // 移出隐藏扣分依据详情
      this.isScoreGist = ''
    }
  },
  mounted() {
    console.log(this.$props.prisonId)
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
  grid-template-columns: 25% 38% 25%;
  grid-column-gap: 6%;
  grid-row-gap: 20px;
  margin-bottom: 60px;
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
    position: relative;
    .leftMsg {
      width: 62%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      position: relative;
      .title {
        width: 100%;
        height: 56px;
        line-height: 28px;
        font-size: 16/14rem;
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
          z-index: 100;
          top: 56px;
          left: 0;
          font-size: 1.1rem;
          font-weight: normal;
          line-height: 24px;
        }
      }
      .scoreStatus {
        position: absolute;
        left: 4px;
        bottom: 4px;
        font-size: 1.1rem;
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
      min-width: 140px;
      font-size: 55px;
      color: rgba(43, 139, 239, 1);
      width: 30%;
      box-sizing: border-box;
      padding-top: 20px;
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
// 适配 1150-1500分辨率
@media screen and (min-width: 1150px) and (max-width: 1500px) {
  .itemBox {
    .title {
      font-size: 18px !important;
      line-height: 20px !important;
    }
    .rightScore {
      min-width: 100px !important;
      font-size: 50px !important;
      padding-top: 5px !important;
    }
  }
}
// 适配 1150以下分辨率
@media screen and (max-width: 1150px) {
  .itemBox {
    .title {
      font-size: 16px !important;
      line-height: 18px !important;
    }
    .rightScore {
      min-width: 80px !important;
      font-size: 40px !important;
      padding-top: 5px !important;
    }
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
