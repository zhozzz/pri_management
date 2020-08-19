<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-27 15:06:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-23 14:49:11
 -->
<template>
  <div class="map_page technology">
    <!-- <menuTree :menuList="['指挥调度','应急指挥']" /> -->
    <div
      class="event_title"
      :style="{top:xMove+'px',left:yMove+'px'}"
      draggable="true"
      @dragend="dargIt"
      @dragstart="dargStart"
      v-if="showAll"
    >
      <!-- @drag="dargIt" -->
      <div @click="changeIt" class="open_btn">
        <!-- {{changeFlag?'收起':''}} -->
        <span class="color_b" v-if="changeFlag">
          <img :src="require('@/assets/beindex/left-icon.png')" class="lefticon" />
          收起
        </span>
        <el-button v-if="!changeFlag" class="yn_btn show_btn" type="primary">展开</el-button>
      </div>
      <div class="info_main" :class="changeFlag?'open':'close'">
        <div class="event_item">
          <span class="color_b">
            <img :src="require('@/assets/command/当前事件.png')" class="title_icon" /> 当前事件：
          </span>
          {{eventInfo.alarmEventName}}
        </div>
        <div class="event_item">
          <span class="color_b">
            <img :src="require('@/assets/command/报警时间.png')" class="title_icon" /> 报警时间：
          </span>
          {{eventInfo.alarmTime}}
        </div>
        <div class="event_item">
          <span class="color_b">
            <img :src="require('@/assets/command/警情级别.png')" class="title_icon" />警情级别：
          </span>
          {{levelList[eventInfo.alarmType]}}
        </div>
        <div class="event_item">
          <span class="color_b">
            <img :src="require('@/assets/command/报警地点.png')" class="title_icon" />
            报警地点：
          </span>
          {{eventInfo.alarmAddress}}
        </div>
        <div class="event_item">
          <span class="color_b">
            <img :src="require('@/assets/command/预案名称.png')" class="title_icon" />流程名称：
          </span>
          {{eventInfo.planName}}
        </div>
      </div>
    </div>
    <div class="map_box">
      <!-- 地图组件 -->
      <spuerMap
        :triggerAlarm="{prisonName:emPrisonName,cameraIndexCodes:cameraIndexlist}"
        @mapReady="getExerciseData"
        :height="height"
        :closeMune="true"
      />
    </div>

    <div
      class="info_box"
      :style="{top:xAsyis+'px',left:yAsyis+'px'}"
      draggable="true"
      @dragend="moveIt"
      @dragstart="moveStart"
      v-if="showAll"
    >
      <!-- <div class="info_main" :class="openFlag?'open':'close'">
        <div class="step_title title">
          <span class="color_b">第{{activeIndex+1}}步:</span>
          {{stepInfo.stepName}}
        </div>
        <div class="title">
          <span class="color_b">
            <img :src="require('@/assets/command/应急队伍.png')" class="title_icon" />处置队伍:
          </span>
          {{stepInfo.teamName}}
        </div>
        <div class="step_info">
          <div class="title color_b">
            <img :src="require('@/assets/command/处理措施.png')" class="title_icon" />处理措施：
          </div>
          {{stepInfo.detail}}
        </div>

        <div class="btn_group">
          <el-button
            v-if="isCommand"
            class="yn_btn"
            type="primary"
            @click="nextStep"
          >{{isFinish?'已完成指挥':activeIndex==stepList.length-1?'完成指挥':'执行指挥'}}</el-button>
          <el-button v-if="isCommand" class="yn_btn" @click="openCall" type="primary">呼叫对讲</el-button>
          <el-button
            v-if="activeIndex>0&&!isCommand"
            class="yn_btn"
            @click="seeLastStep"
            type="primary"
          >查看上一步</el-button>
          <el-button
            v-if="activeIndex!==stepList.length-1&&!isCommand"
            class="yn_btn"
            @click="seeNextStep"
            type="primary"
          >查看下一步</el-button>
        </div>

        <el-input
          type="textarea"
          class="yn_ipt"
          v-if="isCommand"
          v-model="remark"
          placeholder="请输入内容"
          :autosize="{ minRows: 3, maxRows: 20 }"
        />

        <div class="step_index_box">
          <div class="step_index" v-for="(step,i) in stepList" :key="i">
            <div class="index_point" :class="activeIndex==i?'active':''"></div>
          </div>
        </div>
      </div>-->

      <div class="info_main" :class="openFlag?'open':'close'">
        <div class="main">
          <div class="step_box" v-for="(item,i) in stepList" :key="i">
            <div class="title">
              <span class="color_b">第{{i+1}}步：</span>
              <div>{{item.stepName}}</div>：
              <div>{{item.detail}}</div>
              <div v-if="item.teamName">({{item.teamName}})</div>
            </div>
            <!-- <div class="title">
              <span class="color_b">
                <img :src="require('@/assets/command/应急队伍.png')" class="title_icon" />处置队伍:
              </span>
              <div>{{item.teamName}}</div>
            </div>-->
            <!-- <div class="step_info">
              <div class="title color_b">
                <img :src="require('@/assets/command/处理措施.png')" class="title_icon" />处理措施：
              </div>
              <div>{{item.detail}}</div>
            </div>-->

            <!-- <el-input
              type="textarea"
              class="yn_ipt"
              v-if="isCommand"
              v-model="remark"
              placeholder="请输入内容"
              :autosize="{ minRows: 3, maxRows: 20 }"
            />-->

            <div class="btn_group">
              <el-button
                v-if="isCommand"
                class="yn_text_btn color_b"
                type="text"
                @click="nextStep(i)"
                :disabled="isFinish"
              >{{isFinish?'已完成指挥':i==stepList.length-1?'完成指挥':'执行指挥'}}</el-button>
              <el-button
                v-if="isCommand"
                class="yn_text_btn color_b"
                type="text"
                @click="openCall"
              >呼叫对讲</el-button>
            </div>
          </div>
        </div>
      </div>

      <div @click="openIt" class="open_btn">
        <!-- {{openFlag?'收起':''}} -->
        <span class="color_b" v-if="openFlag">
          <img :src="require('@/assets/beindex/left-icon.png')" class="lefticon" />
          收起
        </span>

        <el-button v-else class="yn_btn show_btn" type="primary">展开</el-button>
      </div>
    </div>

    <div class="table_box tables" :style="{'left':pageIsOpen?'0':'-40rem'}">
      <img
        class="arrow"
        :src="pageIsOpen ? require('@/assets/index/closearrow.png') : require('@/assets/index/openarrow.png')"
        @click="pageIsOpen=!pageIsOpen"
      />
      <div class="technology">
        <table-view
          noBottom
          noIndex
          :tableData="tableData"
          v-loading="tableLoading"
          height="20rem"
          @sizeChange="getEmergencyPlan"
        >
          <div slot="searchCondition">
            <el-form class="yn_form" ref="form" inline>
              <el-form-item label="预案名:">
                <el-input class="yn_ipt" :maxlength="60" v-model="planName"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button class="yn_btn" @click="getEmergencyPlan" type="primary">查询</el-button>
                <el-button class="yn_btn" @click="resetInfo" type="primary">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template slot="table-column">
            <el-table-column prop="planName" label="预案名" width="width" align="center">
              <template slot-scope="{row}">
                <div @click="showPlan(row)">{{row.planName}}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="width" align="center">
              <template slot-scope="scope">
              </template>
            </el-table-column>-->
          </template>
        </table-view>
      </div>
    </div>

    <el-dialog class="yn_dialog" :visible.sync="planVisible" title="查看" width="60%" center>
      <div class="infos">预案名：{{planObj.planName}}</div>
      <div class="infos">创建时间：{{planObj.createTime}}</div>
      <div class="infos" v-if="planObj.firstCommand">指挥长：{{planObj.firstCommand.realName}}</div>
      <div class="infos" v-if="planObj.secondCommands">
        副指挥长：
        <span v-for="(item,i) in planObj.secondCommands" :key="i">
          {{item.realName}}
          <span v-if="i<planObj.secondCommands.length-1">、</span>
        </span>
      </div>
      <div class="infos">预案小组:</div>
      <div class="tableNobor">
        <table-view :tableData="{list:planObj.group}" noPage noBottom noIndex noSearch>
          <template slot="table-column">
            <el-table-column prop="groupName" label="小组名" width="width" align="center" />
            <el-table-column prop="groupDuty" label="小组职责" width="width" align="center" />
            <el-table-column prop="leader" label="小组领导" width="width" align="center">
              <template slot-scope="{row}">
                <div v-if="row.leader">{{row.leader.realName}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="members" label="小组成员" width="width" align="center">
              <template slot-scope="{row}">
                <div v-if="row.members">
                  <span v-for="(user,i ) in row.members" :key="i">
                    {{user.realName}}
                    <span v-if="i<row.members.length-1">、</span>
                  </span>
                </div>
              </template>
            </el-table-column>
          </template>
        </table-view>
      </div>
      <div class="infos">预案详情:</div>
      <div class="infos" v-html="planObj.planContent"></div>
      <div slot="footer"></div>
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox, Message } from 'element-ui'
import spuerMap from '@/components/super_map/'
import menuTree from '@/components/menu_tree/'
import formatDate from '@/utils/date.js'
import tableView from '@/components/table_view'

import {
  getPlanDetail,
  getEventInsert,
  setFinish,
  getExerciseData,
  getEmergencyPlan
} from './service.js'
import { getPrisonId } from '@/utils'
let MaxWidth = window.innerwidth
export default {
  components: {
    spuerMap,
    menuTree,
    tableView
  },
  data() {
    return {
      height: '',
      eventInfo: {},
      emPrisonName: '',
      cameraIndexlist: [],
      stepInfo: {},
      remark: '',
      stepList: [],
      isCommand: true,
      pageIsOpen: true,
      activeIndex: 0,
      prisonId: getPrisonId(),
      //   levelList: [
      //     { name: '轻微', value: 1 },
      //     { name: '较低', value: 2 },
      //     { name: '中等', value: 3 },
      //     { name: '较高', value: 4 },
      //     { name: '严重', value: 5 }
      //   ]
      levelList: {
        1: '轻微',
        2: '较低',
        3: '中等',
        4: '较高',
        5: '严重'
      },
      showAll: true,
      openFlag: true,
      changeFlag: true,
      xAsyis: 500,
      yAsyis: null,
      xMove: 100,
      yMove: null,
      isFinish: false,
      tableData: {
        list: [],

        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      tableLoading: true,
      planName: '',
      planVisible: false,
      planObj: {}
    }
  },

  created() {
    this.height = window.innerHeight - 60 + 'px'
    if (this.$route.params.emergencyEventId) {
      this.eventInfo = this.$route.params
      this.emPrisonName = this.$route.params.emPrisonName
      this.cameraIndexlist = this.$route.params.cameraIndexlist

      this.eventInfo.alarmTime = formatDate(
        new Date(this.eventInfo.alarmTime),
        'yyyy-MM-dd h:m:s'
      )

      this.getPlanInfo(this.eventInfo.planId)
      this.getEventInsert('开始指挥', this.eventInfo.emergencyEventId)
    } else {
      this.isCommand = false
      //   this.getExerciseData()
    }
    this.getEmergencyPlan()
  },

  methods: {
    openIt() {
      this.openFlag = !this.openFlag
    },
    openCall() {
      if ((this.prisonId = '13607F06968146AC86D195C27784CB94')) {
        window.open('http://10.31.119.250/html/pub/login.html')
      }
    },
    // nextStep() {
    nextStep(i) {
      //   if (this.activeIndex < this.stepList.length - 1) {
      if (i < this.stepList.length - 1) {
        // this.activeIndex += 1
        // this.stepInfo = this.stepList[this.activeIndex]
        this.stepInfo = this.stepList[i]
        this.getEventInsert(
          this.stepInfo.detail,
          this.eventInfo.emergencyEventId,
          this.remark
        )
        this.remark = ''
      } else {
        this.getEventInsert(
          this.stepInfo.detail,
          this.eventInfo.emergencyEventId,
          this.remark
        )
        this.getEventInsert('完成指挥', this.eventInfo.emergencyEventId)
        setFinish({
          emergencyEventId: this.eventInfo.emergencyEventId,
          handleTime: new Date().getTime(),
          status: 2
        }).then(res => {
          this.$message.success('完成指挥')
          this.isFinish = true
          //   this.$router.push({ name: 'sudden_events' })
        })
      }
    },
    seeNextStep() {
      if (this.activeIndex < this.stepList.length - 1) {
        this.activeIndex += 1
        this.stepInfo = this.stepList[this.activeIndex]
      }
    },
    seeLastStep() {
      if (this.activeIndex > 0) {
        this.activeIndex -= 1
        this.stepInfo = this.stepList[this.activeIndex]
      }
    },
    getPlanInfo(data) {
      getPlanDetail(data).then(res => {
        this.stepList = res.steps
        this.stepInfo = this.stepList[0]
      })
    },
    getEventInsert(content, val, remark) {
      let data = {
        operateContent: content,
        emergencyEventId: val,
        remark: remark
      }
      getEventInsert(data).then(res => {})
    },
    getExerciseData() {
      let parmas = {
        currentPage: 1,
        pageSize: 1,
        status: 0,
        emPrisonId: this.prisonId
      }
      getExerciseData(parmas)
        .then(res => {
          if (res.total !== 0) {
            this.eventInfo = res.rows[0]
            this.emPrisonName = res.rows[0].emPrisonName
            this.cameraIndexlist = res.rows[0].cameraIndexlist
            this.eventInfo.alarmTime = formatDate(
              new Date(this.eventInfo.alarmTime),
              'yyyy-MM-dd h:m:s'
            )
            this.getPlanInfo(this.eventInfo.planId)
          } else {
            this.showAll = false
            this.$message.warning('暂无突发事件')
          }
        })
        .catch(err => {
          console.log(err)

          this.showAll = false
        })
    },

    moveStart(e) {
      this.moveStartX = e.offsetX
      this.moveStartY = e.offsetY
    },
    moveIt(e) {
      this.xAsyis = e.clientY - this.moveStartY
      this.yAsyis = e.clientX - this.moveStartX
    },
    dargStart(e) {
      this.dargStartX = e.offsetX
      this.dargStartY = e.offsetY
    },
    dargIt(e) {
      this.xMove = e.clientY - this.dargStartY
      this.yMove = e.clientX - this.dargStartX
    },
    changeIt() {
      this.changeFlag = !this.changeFlag
    },
    resetInfo() {
      this.tableData.pageSize = 10
      this.tableData.pageNum = 1
      this.planName = ''
    },
    getEmergencyPlan() {
      let params = {}
      this.tableLoading = true
      params.pageSize = this.tableData.pageSize
      params.currentPage = this.tableData.pageNum
      params.prisonId = this.prisonId
      params.planName = this.planName
      getEmergencyPlan(params).then(res => {
        console.log(res)
        this.tableLoading = false
        this.tableData.list = res.rows
        this.tableData.total = res.total
      })
    },
    showPlan(row) {
      console.log(row)
      this.planVisible = true
      this.planObj = row
    }
  }
}
</script>
<style lang="less" scoped>
.infos {
  color: #fff;
  font-size: 1.1rem;
  margin: 1rem;
}
.tableNobor {
  /deep/.el-table {
    background-color: transparent !important;
  }
  /deep/.eltable-container {
    background-color: transparent !important;
  }
}
.tables {
  color: #fff;
  background-color: transparent;
  border: 1px solid #7cdafd;
  box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 -28px 28px -28px #8fdcf9 inset,
    -28px 0 28px -28px #8fdcf9 inset;
  /deep/.el-table {
    background-color: transparent !important;
  }
  /deep/.eltable-container {
    background-color: transparent !important;
  }
}
.table_box {
  width: 40rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  padding: 1rem;

  .arrow {
    position: fixed;
    top: 50%;
    right: -15px;
    width: 20px;
    transform: translateY(-50%);
    height: 40px;
    z-index: 999;
  }
  /deep/.el-table {
    background-color: transparent !important;
  }
  /deep/.eltable-container {
    background-color: transparent !important;
  }
}
.map_page {
  position: relative;
  height: 100%;
  width: 100%;
  font-size: 1.1rem;
}
.color_b {
  color: #03fdfe;
}
.lefticon {
  width: 1.5rem;
  height: 1rem;
  transform: rotateY(180deg);
}
.title_icon {
  width: 1rem;
  height: 1rem;
  margin-right: 4px;
}
.event_title {
  width: 30rem;
  position: fixed;
  top: 10%;
  right: 10px;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.4rem;
  font-weight: bold;
  z-index: 999;
  .event_item {
    margin: 1rem 0;
    padding: 0.5rem;
    border-radius: 4px;
  }
}
.map_box {
  width: 100%;
  background: black;
  height: 100%;
}

.info_box {
  position: fixed;
  top: 50%;
  //   left: 10px;
  right: 10px;

  z-index: 999;
}
.open_btn {
  position: absolute;
  top: 0;
  left: 2%;
  padding: 4px 10px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  z-index: 1000;
}
.info_main {
  width: 30rem;
  //   border: 1px solid #ccc;
  padding: 3rem 2rem;
  border-radius: 4px;
  background: url('../../assets/beindex/regroupgb.png') no-repeat center center;
  background-size: 100% 100%;
  height: 24rem;
  .main {
    width: 100%;
    overflow-y: scroll;
    height: 100%;
  }
  .step_box {
    width: 100%;
    margin: 2rem 0;
  }
  .title {
    font-weight: bold;
    font-size: 1.4rem;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .step_info {
    font-size: 1.1rem;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
  }
  .btn_group {
    margin: 0.5rem 0;
  }
  .step_index_box {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem 2rem;
    .step_index {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 1px solid #333;
      margin: 0 1rem;
      padding: 2px;
      .index_point {
        width: 100%;
        height: 100%;
        border-radius: 50%;

        background: #fff;
      }
      .active {
        background: rgb(79, 170, 255);
      }
    }
  }
}
@keyframes closeMove {
  0% {
    transform-origin: 0 0 0;
    transform: scale(1);
    opacity: 1;
  }
  20% {
    transform-origin: 0 0 0;
    transform: scale(0.8, 0.8);
    opacity: 0.8;
  }
  40% {
    transform-origin: 0 0 0;
    transform: scale(0.6, 0.6);
    opacity: 0.6;
  }
  60% {
    transform: scale(0.4, 0.4);
    transform-origin: 0 0 0;
    opacity: 0.4;
  }
  80% {
    transform: scale(0.2, 0.2);
    transform-origin: 0 0 0;
    opacity: 0.2;
  }
  100% {
    transform: scale(0.1, 0.1);
    transform-origin: 0 0 0;
    opacity: 0.1;
  }
}
@keyframes openMove {
  100% {
    transform-origin: 0 0 0;
    transform: scale(1, 1);
    opacity: 1;
  }
  80% {
    transform-origin: 0 0 0;
    transform: scale(0.8, 0.8);
    opacity: 0.8;
  }
  60% {
    transform-origin: 0 0 0;
    transform: scale(0.6, 0.6);
    opacity: 0.6;
  }
  40% {
    transform: scale(0.4, 0.4);
    transform-origin: 0 0 0;
    opacity: 0.4;
  }
  20% {
    transform: scale(0.2, 0.2);
    transform-origin: 0 0 0;
    opacity: 0.2;
  }
  0% {
    transform: scale(0.1, 0.1);
    transform-origin: 0 0 0;
    opacity: 0.1;
  }
}
@keyframes showMove {
  100% {
    transform-origin: 0 0 0;
    transform: scale(1, 1);
    opacity: 1;
  }
  80% {
    transform-origin: 0 0 0;
    transform: scale(0.8, 0.8);
    opacity: 0.8;
  }
  60% {
    transform-origin: 0 0 0;
    transform: scale(0.6, 0.6);
    opacity: 0.6;
  }
  40% {
    transform: scale(0.4, 0.4);
    transform-origin: 0 0 0;
    opacity: 0.4;
  }
  20% {
    transform: scale(0.2, 0.2);
    transform-origin: 0 0 0;
    opacity: 0.2;
  }
  0% {
    transform: scale(0.1, 0.1);
    transform-origin: 0 0 0;
    opacity: 0.1;
  }
}
@keyframes hideMove {
  0% {
    transform-origin: 0 0 0;
    transform: scale(1);
    opacity: 1;
  }
  20% {
    transform-origin: 0 0 0;
    transform: scale(0.8, 0.8);
    opacity: 0.8;
  }
  40% {
    transform-origin: 0 0 0;
    transform: scale(0.6, 0.6);
    opacity: 0.6;
  }
  60% {
    transform: scale(0.4, 0.4);
    transform-origin: 0 0 0;
    opacity: 0.4;
  }
  80% {
    transform: scale(0.2, 0.2);
    transform-origin: 0 0 0;
    opacity: 0.2;
  }
  100% {
    transform: scale(0.1, 0.1);
    transform-origin: 0 0 0;
    opacity: 0.1;
  }
}
.open {
  animation: openMove 0.5s forwards;
}
.close {
  animation: closeMove 0.5s forwards;
}

.show_btn {
  animation: showMove 0.5s forwards;
}
.hide_btn {
  animation: hideMove 0.5s forwards;
}

.event_item,
.step_info,
.info_box {
  color: #fff;
}

// .event_item {
//   border: 1px solid #7cdafd;
//   box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
//     0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
// }
</style>
