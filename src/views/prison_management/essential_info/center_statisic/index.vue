<!--
 * :
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-29 10:58:40
 -->

<template>
  <dept-layout
    @input="nodeClick"
    v-model="prisonId"
    :noPadding="true"
    :backData="true"
    :prisonList="prisonList"
    v-loading="loading"
  >
    <!-- 总览 -->
    <!-- <div class="header" @mousewheel.prevent @touchmove.prevent> -->
    <menuTree :menuList="['监狱管理','值班管理','基本数据']">
      <!-- <div class="yn_page_title">{{!cheackFlag?'上报表单填写':'历史上报查看'}}</div> -->
      <el-row class="header_box" type="flex" align="top">
        <el-col :span="14">
          <div class="time_box">
            <div>选择查看日期</div>
            <el-date-picker
              class="yn_ipt yn_date_picker"
              v-model="date"
              type="date"
              @change="getForm"
              placeholder="开始日期"
              :clearable="false"
              :picker-options="{
              disabledDate(date){
                return  new Date(date).getTime()>new Date().getTime()
              }
          }"
            ></el-date-picker>
            <el-button class="yn_btn btn_pad" type="primary" @click="preDay">前一天</el-button>

            <el-button
              class="yn_btn btn_pad"
              type="primary"
              :disabled="new Date(
            formatDate(new Date(date), 'yyyy-MM-dd 00:00:00')
            ).getTime() >=
            new Date(formatDate(new Date(), 'yyyy-MM-dd 00:00:00')).getTime()"
              @click="nextDay"
            >后一天</el-button>
            <el-button class="yn_btn btn_pad" type="primary" @click="selToday">查看今天</el-button>
            <el-button class="yn_btn yn_long_btn" type="primary" @click="resetData">更新实时数据</el-button>
            <!-- <el-button class="yn_btn btn_pad" type="primary" @click="topage">基本数据管理</el-button> -->

            <!-- 导出组件 -->
            <exportExcel
              :deptList="deptList"
              :customList="customList"
              v-if="isReport||prisonId==1"
            />
          </div>
          <div class="yn_page_title">{{formatDate(new Date(date),'yyyy-MM-dd')}}上报</div>
          <div class="time_box">
            <div>各单位上报时限</div>
            <div :style="{'margin':'0 10px'}">{{editTime.beginTime}}-{{editTime.endTime}}</div>
            <div v-if="userPrisonId==1" @click="editFLag=true">
              <i :style="{'color':'#409EFF','fontSize':'1.6rem'}" class="el-icon-edit-outline"></i>
            </div>
          </div>
          <!-- <div v-if="rejectReason" class="yn_page_title">打回上报原因:{{rejectReason}}</div> -->

          <!-- <el-switch
            v-if="(deptId==userDeptId&&isArea||prisonId==userPrisonId&&!isArea)"
            v-model="cheackFlag"
            active-text="查看上报"
            inactive-text="上报填写"
            active-color="#13ce66"
            inactive-color="#409EFF"
          ></el-switch>-->
        </el-col>
        <el-col :span="10">
          <!-- 右上方日期选择 -->
          <div class="right_date">
            <div class="calendar" v-show="calendarFlag">
              <i class="el-icon-error" @click="calendarShow"></i>
              <el-calendar v-model="date">
                <template slot="dateCell" slot-scope="{date}">
                  <div
                    :class="date.getTime()<=new Date().getTime()?'inDate':'outDate'"
                  >{{formatDate(date,'dd')}}</div>
                </template>
              </el-calendar>
            </div>
            <el-button
              class="yn_btn calendar_btn"
              type="primary"
              v-show="!calendarFlag"
              @click="calendarShow"
            >{{formatDate(new Date(date),'yyyy-MM-dd')}}</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="split_line">
        <div>
          当前部门：{{deptName}}
          <span v-if="userPrisonId!=1&&isArea&&!isPrison">
            <span v-if="isReport">
              <span v-if="noError" class="sucState">已上报</span>
              <span class="errState" v-else>数据异常</span>
            </span>
            <span class="noState" v-if="!isReport">未上报</span>
          </span>
          <el-button
            class="yn_btn btn_pad"
            type="primary"
            v-if="(userPrisonId==1&&!isReport&&prisonId!=1&&!isArea&&inTime)||(userPrisonId!=1&&!isReport&&isArea&&inTime&&isPrison)"
            @click="cheackFlag=!cheackFlag"
          >{{cheackFlag?'打开':'关闭'}}代上报</el-button>
        </div>

        <div class="split_info">
          <span :style="{'color':'#4a8ae8'}">蓝色字体</span>
          代表实时数据；
          <span :style="{'color':'#f7b900'}">黄色字体</span>
          代表上报数据；
          <img :src="require('@/assets/other/up.png')" />
          <i class="el-icon-minus"></i>
          <img :src="require('@/assets/other/down.png')" />
          后数据为与上次上报数据对比值
        </div>
      </div>
      <div class="pages" id="pages" refs="dataPage">
        <div class="menus" :style="{right: pageIsOpen ? '0%' : '-12rem' }">
          <div class="arrow" :style="{left:'-13px',width: '13px'}">
            <img
              v-if="theme==2"
              :src="pageIsOpen ? require('@/assets/index/closearrow.png') : require('@/assets/index/openarrow.png')"
              @click="pageIsOpen=!pageIsOpen"
              style="width:100%"
            />
            <img
              v-else-if="theme==1"
              :src="pageIsOpen ? require('@/assets/index/closearrow2.png') : require('@/assets/index/openarrow2.png')"
              @click="pageIsOpen=!pageIsOpen"
              style="width:100%"
            />
          </div>
          <div @click="scoll('prison_dept')" v-if="!isArea">
            <!-- <a href="#police_info">监狱机构及警察情况</a> -->
            监狱机构及警察情况
          </div>
          <div @click="scoll('prison_dept')" v-if="isArea">
            <!-- <a href="#police_info">监狱机构及警察情况</a> -->
            警察情况
          </div>
          <div @click="scoll('criminal_info')">
            {{isArea?'监区罪犯基本数据':'监狱罪犯基本数据'}}
            <!-- <a href="#criminal_info">监狱罪犯基本数据</a> -->
          </div>
          <div @click="scoll('criminal_type')">
            {{isArea?'监区押犯构成情况':'监狱押犯构成情况'}}
            <!-- <a href="#criminal_type">监狱押犯构成情况</a> -->
          </div>
          <div @click="scoll('prison_info')">{{isArea?'当日监区管理情况':'当日监狱管理情况'}}</div>
          <div @click="scoll('diy_table')">自定义项</div>
        </div>

        <el-dialog class="yn_dialog" center title="编辑上报时限" :visible.sync="editFLag" width="50%">
          <el-form label-width="6rem" class="yn_form" inline ref="addform">
            <el-form-item label="上报时限:">
              <el-time-picker
                class="yn_ipt"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择开始时间"
                v-model="timer"
                :clearable="false"
              ></el-time-picker>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button class="yn_btn" type="primary" @click="subTime">保存</el-button>
            <el-button class="yn_btn" @click="editFLag=false">取消</el-button>
          </div>
        </el-dialog>

        <div class="moudek_head" id="police_info">
          <i class="el-icon-postcard icon_img"></i>

          <div class="head_name" id="prison_dept" v-if="!isArea">监狱机构及警察情况</div>
          <div class="head_name" id="prison_dept" v-if="isArea">警察情况</div>
        </div>
        <!-- 监狱机构 -->
        <table class="police_table setInputWidth" rules="all" cellpadding="10" v-show="!isArea">
          <tr>
            <td :rowspan="3">监狱机构</td>
            <titleTd titleName="机关部门数" :titleTip="descData.officeDeptNum" />
            <reporTd
              fieldName="officeDeptNum"
              :selData="selData.officeDeptNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.officeDeptNum"
              v-model="iptData.officeDeptNum"
            />
            <titleTd titleName="“三定方案”监区机构编制数" :col="2" :titleTip="descData.threeProjectNum" />
            <reporTd
              fieldName="threeProjectNum"
              :selData="selData.threeProjectNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.threeProjectNum"
              v-model="iptData.threeProjectNum"
            />
          </tr>
          <tr>
            <titleTd
              titleName="实有监区数"
              :titleTip="descData.trueAreaNum"
              :msgInfo="AreaNumCheckInfo"
              :dataErrorFlag="selData.isTrueAreaNum"
            />
            <reporTd
              fieldName="trueAreaNum"
              :selData="selData.trueAreaNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.trueAreaNum"
              v-model="iptData.trueAreaNum"
            />
            <titleTd titleName="押犯监区数" :titleTip="descData.criminalAreaNum" />
            <reporTd
              fieldName="criminalAreaNum"
              :selData="selData.criminalAreaNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.criminalAreaNum"
              v-model="iptData.criminalAreaNum"
            />
            <titleTd titleName="非押犯监区数" :titleTip="descData.noCriminalAreaNum" />
            <reporTd
              fieldName="noCriminalAreaNum"
              :selData="selData.noCriminalAreaNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.noCriminalAreaNum"
              v-model="iptData.noCriminalAreaNum"
            />
          </tr>
          <tr>
            <td :colspan="1" align="center">备注</td>
            <!-- <td :colspan="3">
              <el-popover placement="top" trigger="click">
                <div class="pop_main">{{selData.policeRemark}}</div>

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.policeRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.policeRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>-->
            <td :colspan="7">
              <span>实有监区数=押犯监区数+非押犯监区数；</span>
            </td>
          </tr>
        </table>
        <!-- 监狱省局警察基本情况 -->
        <table class="police_table setInputWidth" rules="all" cellpadding="10" v-show="!isArea">
          <tr>
            <td :rowspan="9">警察基本情况</td>

            <titleTd
              titleName="警察总数"
              :row="6"
              :msgInfo="PoliceNumCheckInfo"
              :titleTip="descData.allPoliceNum"
              :dataErrorFlag="selData.isAllPolice"
            />
            <reporTd
              fieldName="allPoliceNum"
              :selData="selData.allPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :row="6"
              :sqlData="sqlData.allPoliceNum"
              v-model="iptData.allPoliceNum"
            />
            <td :rowspan="2">其中</td>
            <titleTd titleName="监狱男警" :titleTip="descData.malePoliceNum" />
            <reporTd
              fieldName="malePoliceNum"
              :selData="selData.malePoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="4"
              :sqlData="sqlData.malePoliceNum"
              v-model="iptData.malePoliceNum"
            />
          </tr>
          <tr>
            <titleTd titleName="监狱女警" :titleTip="descData.femalePoliceNum" />
            <reporTd
              fieldName="femalePoliceNum"
              :selData="selData.femalePoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="4"
              :sqlData="sqlData.femalePoliceNum"
              v-model="iptData.femalePoliceNum"
            />
          </tr>

          <tr>
            <td>机关</td>
            <titleTd titleName="机关警察数" :titleTip="descData.officePoliceNum" />
            <reporTd
              fieldName="officePoliceNum"
              :selData="selData.officePoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.officePoliceNum"
              v-model="iptData.officePoliceNum"
            />
            <titleTd titleName="其中，长期在基层岗位数" :col="2" :titleTip="descData.basePoliceNum" />
            <reporTd
              fieldName="basePoliceNum"
              :selData="selData.basePoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.basePoliceNum"
              v-model="iptData.basePoliceNum"
            />
          </tr>
          <tr>
            <td :rowspan="3">基层</td>
            <titleTd titleName="监区警察数" :titleTip="descData.jianquPoliceNum" />
            <reporTd
              fieldName="jianquPoliceNum"
              :selData="selData.jianquPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="5"
              :sqlData="sqlData.jianquPoliceNum"
              v-model="iptData.jianquPoliceNum"
            />
          </tr>

          <tr>
            <titleTd titleName="指挥中心人数" :titleTip="descData.cmdCenterPoliceNum" />
            <reporTd
              fieldName="cmdCenterPoliceNum"
              :selData="selData.cmdCenterPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.cmdCenterPoliceNum"
              v-model="iptData.cmdCenterPoliceNum"
            />
            <titleTd titleName="特警队人数" :titleTip="descData.regimentalPoliceTeamNum" />
            <reporTd
              fieldName="regimentalPoliceTeamNum"
              :selData="selData.regimentalPoliceTeamNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.regimentalPoliceTeamNum"
              :col="2"
              v-model="iptData.regimentalPoliceTeamNum"
            />
          </tr>
          <tr>
            <titleTd titleName="监狱医院人数" :titleTip="descData.hospitalPoliceNum" />
            <reporTd
              fieldName="hospitalPoliceNum"
              :selData="selData.hospitalPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.hospitalPoliceNum"
              v-model="iptData.hospitalPoliceNum"
            />
            <titleTd titleName="警示教育基地人数(专职)" :titleTip="descData.warningEduBasePoliceNum" />
            <reporTd
              fieldName="warningEduBasePoliceNum"
              :selData="selData.warningEduBasePoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.warningEduBasePoliceNum"
              v-model="iptData.warningEduBasePoliceNum"
            />
          </tr>
          <tr>
            <titleTd
              titleName="其他(长期在编不在岗人员)"
              :col="3"
              :titleTip="descData.alwaysOffDutyPoliceNum"
            />
            <reporTd
              fieldName="alwaysOffDutyPoliceNum"
              :selData="selData.alwaysOffDutyPoliceNum"
              :prisonId="prisonId"
              :col="2"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.alwaysOffDutyPoliceNum"
              v-model="iptData.alwaysOffDutyPoliceNum"
            />
            <titleTd titleName="备注" :col="1" :titleTip="descData.alwaysOffDutyPoliceRemark" />
            <td :colspan="2">
              <el-popover placement="top" trigger="click">
                <div class="pop_main">{{selData.alwaysOffDutyPoliceRemark}}</div>
                <!-- <el-table
                  :data="remarkMap.alwaysOffDutyPoliceRemark"
                  border
                  height="300"
                  v-if="selData.alwaysOffDutyPoliceRemark ==null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.alwaysOffDutyPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.alwaysOffDutyPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
          </tr>
          <!-- 新增公务员（非警察）人数 -->
          <tr>
            <titleTd titleName="公务员（非警察）人数" :col="3" :titleTip="descData.civilServantNotPoliceNum" />
            <reporTd
              fieldName="civilServantNotPoliceNum"
              :selData="selData.civilServantNotPoliceNum"
              :prisonId="prisonId"
              :col="2"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.civilServantNotPoliceNum"
              v-model="iptData.civilServantNotPoliceNum"
            />
            <titleTd titleName="备注" :col="1" :titleTip="descData.civilServantNotPoliceRemark" />
            <td :colspan="2">
              <el-popover placement="top" trigger="click">
                <div class="pop_main">{{selData.civilServantNotPoliceRemark}}</div>
                <!-- <el-table
                  :data="remarkMap.civilServantNotPoliceRemark"
                  border
                  height="300"
                  v-if="selData.civilServantNotPoliceRemark ==null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->
                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.civilServantNotPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.civilServantNotPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
          </tr>
          <!-- 新增备注tr -->
          <tr>
            <!-- <td :colspan="1" align="center">备注</td> -->
            <titleTd titleName="备注" :col="1" :titleTip="descData.policeBaseInformationRemark" />
            <td :colspan="3">
              <el-popover placement="top" trigger="click">
                <div class="pop_main">{{selData.policeBaseInformationRemark}}</div>

                <!-- <el-table
                  :data="remarkMap.policeBaseInformationRemark"
                  border
                  height="300"
                  v-if="selData.policeBaseInformationRemark ==null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.policeBaseInformationRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.policeBaseInformationRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
            <td :colspan="4">
              <span style="display:block">监狱警察总数=监狱男警+监狱女警；</span>
              <span style="display:block">
                监狱警察总数=机关警察数+监区警察数+监狱医院人数+指挥中心人数+特警队人数+
                <br />警示教育基地人数(专职)；
              </span>
            </td>
          </tr>
        </table>
        <!-- 监区警察基本情况 -->
        <table class="police_table setInputWidth" rules="all" cellpadding="10" v-show="isArea">
          <tr>
            <td :rowspan="4">警察基本情况</td>

            <titleTd
              titleName="警察总数"
              :row="3"
              :msgInfo="PoliceNumCheckInfo"
              :titleTip="descData.allPoliceNum"
              :dataErrorFlag="selData.isAllPolice"
            />
            <reporTd
              fieldName="allPoliceNum"
              :selData="selData.allPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :row="3"
              :sqlData="sqlData.allPoliceNum"
              v-model="iptData.allPoliceNum"
            />
            <td :rowspan="2">其中</td>
            <titleTd titleName="监区男警" :titleTip="descData.malePoliceNum" />
            <reporTd
              fieldName="malePoliceNum"
              :selData="selData.malePoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="4"
              :sqlData="sqlData.malePoliceNum"
              v-model="iptData.malePoliceNum"
            />
          </tr>
          <tr>
            <titleTd titleName="监区女警" :titleTip="descData.femalePoliceNum" />
            <reporTd
              fieldName="femalePoliceNum"
              :selData="selData.femalePoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="4"
              :sqlData="sqlData.femalePoliceNum"
              v-model="iptData.femalePoliceNum"
            />
          </tr>

          <tr>
            <td :rowspan="1">基层</td>
            <titleTd titleName="监区警察数" :titleTip="descData.jianquPoliceNum" />
            <reporTd
              fieldName="jianquPoliceNum"
              :selData="selData.jianquPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="5"
              :sqlData="sqlData.jianquPoliceNum"
              v-model="iptData.jianquPoliceNum"
            />
          </tr>
          <tr>
            <titleTd titleName="公务员（非警察）人数" :col="1" :titleTip="descData.civilServantNotPoliceNum" />
            <reporTd
              fieldName="civilServantNotPoliceNum"
              :selData="selData.civilServantNotPoliceNum"
              :prisonId="prisonId"
              :col="2"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.civilServantNotPoliceNum"
              v-model="iptData.civilServantNotPoliceNum"
            />
            <titleTd titleName="备注" :col="1" :titleTip="descData.civilServantNotPoliceRemark" />
            <td :colspan="2">
              <el-popover placement="top" trigger="click">
                <div class="pop_main">{{selData.civilServantNotPoliceRemark}}</div>

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.civilServantNotPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.civilServantNotPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
          </tr>
          <tr>
            <!-- <td :colspan="1" align="center">备注</td> -->
            <titleTd titleName="备注" :col="1" :titleTip="descData.policeBaseInformationRemark" />
            <td :colspan="3">
              <el-popover placement="top" trigger="click">
                <div class="pop_main">{{selData.policeBaseInformationRemark}}</div>

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.policeBaseInformationRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.policeBaseInformationRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
            <td :colspan="4">
              <span style="display:block">监区警察总数=监区男警+监区女警；</span>
            </td>
          </tr>
        </table>
        <!-- 三岗”人员(辅警)情况 -->
        <table class="police_table setInputWidth" rules="all" cellpadding="10">
          <tr>
            <td :rowspan="6">“三岗”人员(辅警)情况</td>
            <titleTd
              :titleName="isArea?'监区辅警总数':'监狱辅警总数'"
              :row="5"
              :titleTip="descData.prisonPoliceNumTwo"
              :msgInfo="PoliceNumTwoCheckInfo"
              :dataErrorFlag="selData.isPrisonPoliceNumTwo"
            />
            <reporTd
              fieldName="prisonPoliceNumTwo"
              :selData="selData.prisonPoliceNumTwo"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :row="5"
              :sqlData="sqlData.prisonPoliceNumTwo"
              v-model="iptData.prisonPoliceNumTwo"
            />
            <td :rowspan="2">其中</td>
            <titleTd titleName="男性辅警" :col="2" :titleTip="descData.maleAuxiliaryPoliceNum" />
            <reporTd
              fieldName="maleAuxiliaryPoliceNum"
              :selData="selData.maleAuxiliaryPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="4"
              :sqlData="sqlData.maleAuxiliaryPoliceNum"
              v-model="iptData.maleAuxiliaryPoliceNum"
            />
          </tr>
          <tr>
            <titleTd titleName="女性辅警" :col="2" :titleTip="descData.femaleAuxiliaryPoliceNum" />
            <reporTd
              fieldName="femaleAuxiliaryPoliceNum"
              :selData="selData.femaleAuxiliaryPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="4"
              :sqlData="sqlData.femaleAuxiliaryPoliceNum"
              v-model="iptData.femaleAuxiliaryPoliceNum"
            />
          </tr>
          <tr>
            <td :rowspan="3">分布</td>
            <titleTd titleName="监区" :titleTip="descData.areaAuxiliaryPoliceNum" />
            <reporTd
              fieldName="areaAuxiliaryPoliceNum"
              :selData="selData.areaAuxiliaryPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.areaAuxiliaryPoliceNum"
              v-model="iptData.areaAuxiliaryPoliceNum"
            />
            <titleTd titleName="指挥中心" :titleTip="descData.centerAuxiliaryPoliceNum" />
            <reporTd
              fieldName="centerAuxiliaryPoliceNum"
              :selData="selData.centerAuxiliaryPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="3"
              :sqlData="sqlData.centerAuxiliaryPoliceNum"
              v-model="iptData.centerAuxiliaryPoliceNum"
            />
          </tr>
          <tr>
            <titleTd titleName="特警队" :titleTip="descData.swatTeamAuxiliaryPolieNum" />
            <reporTd
              fieldName="swatTeamAuxiliaryPolieNum"
              :selData="selData.swatTeamAuxiliaryPolieNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.swatTeamAuxiliaryPolieNum"
              v-model="iptData.swatTeamAuxiliaryPolieNum"
            />
            <titleTd titleName="监狱医院" :titleTip="descData.prisonHospitalAuxiliaryPoliceNum" />
            <reporTd
              fieldName="prisonHospitalAuxiliaryPoliceNum"
              :selData="selData.prisonHospitalAuxiliaryPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.prisonHospitalAuxiliaryPoliceNum"
              v-model="iptData.prisonHospitalAuxiliaryPoliceNum"
            />
          </tr>
          <tr>
            <titleTd titleName="其他" :titleTip="descData.elseAuxiliaryPoliceNum" />
            <reporTd
              fieldName="elseAuxiliaryPoliceNum"
              :selData="selData.elseAuxiliaryPoliceNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.elseAuxiliaryPoliceNum"
              v-model="iptData.elseAuxiliaryPoliceNum"
            />
            <titleTd titleName="备注" :titleTip="descData.assistantPoliceOtherRemark" />
            <td :colspan="3">
              <div v-if="isArea">
                <el-input
                  v-if="cheackFlag"
                  :disabled="cheackFlag"
                  v-model="selData.assistantPoliceOtherRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
                <el-input
                  v-else
                  :disabled="cheackFlag"
                  v-model="iptData.assistantPoliceOtherRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
              </div>
              <el-popover placement="top" trigger="click" v-if="!isArea">
                <div class="pop_main">{{selData.assistantPoliceOtherRemark}}</div>
                <!-- <el-table
                  :data="remarkMap.assistantPoliceOtherRemark"
                  border
                  height="300"
                  v-if="selData.assistantPoliceOtherRemark ==null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.assistantPoliceOtherRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.assistantPoliceOtherRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
          </tr>
          <!-- 新增备注tr -->
          <tr>
            <!-- <td :colspan="1" align="center">备注</td> -->
            <titleTd titleName="备注" :titleTip="descData.assistantPoliceRemark" />
            <td :colspan="3">
              <div v-if="isArea">
                <el-input
                  v-if="cheackFlag"
                  :disabled="cheackFlag"
                  v-model="selData.assistantPoliceRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
                <el-input
                  v-else
                  :disabled="cheackFlag"
                  v-model="iptData.assistantPoliceRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
              </div>
              <el-popover placement="top" trigger="click" v-if="!isArea">
                <div class="pop_main">{{selData.assistantPoliceRemark}}</div>
                <!-- <el-table
                  :data="remarkMap.assistantPoliceRemark"
                  border
                  height="300"
                  v-if="selData.assistantPoliceRemark == null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->
                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.assistantPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.assistantPoliceRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
            <td :colspan="4" v-if="isArea">
              <span style="display:block">监区辅警总数=男性辅警+女性辅警；</span>
            </td>
            <td :colspan="4" v-else>
              <span style="display:block">监狱辅警总数=男性辅警+女性辅警；</span>
              <span style="display:block">监狱辅警总数=监区辅警数+监狱医院辅警数+指挥中心辅警数+特警队辅警数+其它；</span>
            </td>
          </tr>
        </table>

        <div class="moudek_head" id="criminal_info">
          <i class="el-icon-s-custom icon_img"></i>

          <div class="head_name">{{isArea?'监区罪犯基本数据及其增减情况':'监狱罪犯基本数据及其增减情况'}}</div>
        </div>

        <div class="row_box">
          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="6">
              <div class="card_box card_box_org">
                <div class="td_row">
                  <titleTd titleName="从省外调入" :titleTip="descData.otherAddCriminalNum24h" />
                  <reporTd
                    fieldName="otherAddCriminalNum24h"
                    :selData="selData.otherAddCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.otherAddCriminalNum24h"
                    v-model="iptData.otherAddCriminalNum24h"
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="img_box">
                <div class="red">新增</div>
                <img :src="require('@/assets/other/arrow_red.png')" />
              </div>
            </el-col>
            <el-col :span="10">
              <div class="card_box card_box_deepblue">
                <div class="card_head">
                  <titleTd
                    :titleName="isArea?'监区在册犯人总数':'监狱在册犯人总数'"
                    :titleTip="descData.registeredCriminalNum"
                    :msgInfo="registeredCriminalNumInfo"
                    :dataErrorFlag="selData.isRegisteredCriminal"
                  />
                  <reporTd
                    fieldName="registeredCriminalNum"
                    :selData="selData.registeredCriminalNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.registeredCriminalNum"
                    v-model="iptData.registeredCriminalNum"
                  />
                </div>

                <el-row :gutter="10">
                  <el-col :span="12">
                    <div class="td_row">
                      <titleTd
                        titleName="暂予监外执行"
                        :titleTip="descData.temporaryOutsidePrisonCriminalNum"
                      />
                      <reporTd
                        fieldName="temporaryOutsidePrisonCriminalNum"
                        :selData="selData.temporaryOutsidePrisonCriminalNum"
                        :prisonId="prisonId"
                        :iptFlag="cheackFlag"
                        :sqlData="sqlData.temporaryOutsidePrisonCriminalNum"
                        v-model="iptData.temporaryOutsidePrisonCriminalNum"
                      />
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="td_row">
                      <titleTd titleName="历年在逃" :titleTip="descData.longTimeEscapeCriminalNum" />
                      <reporTd
                        fieldName="longTimeEscapeCriminalNum"
                        :selData="selData.longTimeEscapeCriminalNum"
                        :prisonId="prisonId"
                        :iptFlag="cheackFlag"
                        :sqlData="sqlData.longTimeEscapeCriminalNum"
                        v-model="iptData.longTimeEscapeCriminalNum"
                      />
                    </div>
                  </el-col>
                </el-row>
                <!-- 监狱罪犯基本数据及其增减情况备注 -->
                <div class="criminalRemarks">
                  <!-- <div class="criminalRemarksLable">
                    <p>备注</p>
                  </div>-->
                  <div class="criminalRemarksList" v-if="isArea">
                    <p>今日在册罪犯总数=前一日在册罪犯总数+24小时新增总数（新增1+新增2）-24小时减少总数（减少1+减少2）</p>
                  </div>
                  <div class="criminalRemarksList" v-else>
                    <p>今日在册罪犯总数=前一日在册罪犯总数+24小时新增总数（新增1+新增2-调入2）-24小时减少总数（减少1+减少2—调出1）</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="img_box">
                <div class="green">减少</div>
                <img :src="require('@/assets/other/arrow_green.png')" />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="card_box card_box_green">
                <div class="td_row">
                  <titleTd titleName="监外执行刑释" :titleTip="descData.outsideReleaseNum" />
                  <reporTd
                    fieldName="outsideReleaseNum"
                    :selData="selData.outsideReleaseNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.outsideReleaseNum"
                    v-model="iptData.outsideReleaseNum"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="监外执行死亡" :titleTip="descData.outsideDeathNum" />
                  <reporTd
                    fieldName="outsideDeathNum"
                    :selData="selData.outsideDeathNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.outsideDeathNum"
                    v-model="iptData.outsideDeathNum"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="监外执行其他情况" :titleTip="descData.outsideElseNum" />
                  <reporTd
                    fieldName="outsideElseNum"
                    :selData="selData.outsideElseNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.outsideElseNum"
                    v-model="iptData.outsideElseNum"
                  />
                </div>
                <!-- 监外执行其他情况备注 -->
                <div class="td_row">
                  <titleTd titleName="备注" :titleTip="descData.prisonExecuteOtherRemark" />
                  <td :colspan="2">
                    <div v-if="isArea">
                      <el-input
                        v-if="cheackFlag"
                        :disabled="cheackFlag"
                        v-model="selData.prisonExecuteOtherRemark"
                        class="yn_ipt"
                        placeholder
                      ></el-input>
                      <el-input
                        v-else
                        :disabled="cheackFlag"
                        v-model="iptData.prisonExecuteOtherRemark"
                        class="yn_ipt"
                        placeholder
                      ></el-input>
                    </div>
                    <el-popover placement="top" trigger="click" v-if="!isArea">
                      <div class="pop_main">{{selData.prisonExecuteOtherRemark}}</div>
                      <!-- <el-table
                        :data="remarkMap.prisonExecuteOtherRemark"
                        border
                        height="300"
                        v-if="selData.prisonExecuteOtherRemark ==null"
                      >
                        <el-table-column
                          prop="name"
                          label="监狱/监区"
                          show-overflow-tooltip
                          width="180"
                        ></el-table-column>
                        <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                      </el-table>-->

                      <div slot="reference">
                        <el-input
                          v-if="cheackFlag"
                          :disabled="cheackFlag"
                          v-model="selData.prisonExecuteOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                        <el-input
                          v-else
                          :disabled="cheackFlag"
                          v-model="iptData.prisonExecuteOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                      </div>
                    </el-popover>
                  </td>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="6" :offset="7">
              <div class="img_box col_img">
                <el-row>
                  <el-col :span="24">
                    <titleTd
                      titleName="新增暂予监外执行"
                      :titleTip="descData.addTemporaryOutsidePrisonCriminalNum"
                    />
                    <reporTd
                      fieldName="addTemporaryOutsidePrisonCriminalNum"
                      :selData="selData.addTemporaryOutsidePrisonCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.addTemporaryOutsidePrisonCriminalNum"
                      v-model="iptData.addTemporaryOutsidePrisonCriminalNum"
                    />
                  </el-col>
                  <el-col :span="24">
                    <titleTd titleName="其他" :titleTip="descData.elseOutsideNum" />
                    <reporTd
                      fieldName="elseOutsideNum"
                      :selData="selData.elseOutsideNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.elseOutsideNum"
                      v-model="iptData.elseOutsideNum"
                    />
                  </el-col>
                  <el-col :span="24">
                    <!-- 新增暂予监外执行备注 -->
                    <titleTd titleName="备注" :titleTip="descData.registeredPrisonerSumOtherRemark" />
                    <td :colspan="2">
                      <div v-if="isArea">
                        <el-input
                          v-if="cheackFlag"
                          :disabled="cheackFlag"
                          v-model="selData.registeredPrisonerSumOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                        <el-input
                          v-else
                          :disabled="cheackFlag"
                          v-model="iptData.registeredPrisonerSumOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                      </div>
                      <el-popover placement="top" trigger="click" v-if="!isArea">
                        <div class="pop_main">{{selData.registeredPrisonerSumOtherRemark}}</div>
                        <!-- <el-table
                          :data="remarkMap.registeredPrisonerSumOtherRemark"
                          border
                          height="300"
                          v-if="selData.registeredPrisonerSumOtherRemark == null"
                        >
                          <el-table-column
                            prop="name"
                            label="监狱/监区"
                            show-overflow-tooltip
                            width="180"
                          ></el-table-column>
                          <el-table-column
                            prop="remark"
                            label="备注"
                            show-overflow-tooltip
                            width="300"
                          ></el-table-column>
                        </el-table>-->
                        <div slot="reference">
                          <el-input
                            v-if="cheackFlag"
                            :disabled="cheackFlag"
                            v-model="selData.registeredPrisonerSumOtherRemark"
                            class="yn_ipt"
                            placeholder
                          ></el-input>
                          <el-input
                            v-else
                            :disabled="cheackFlag"
                            v-model="iptData.registeredPrisonerSumOtherRemark"
                            class="yn_ipt"
                            placeholder
                          ></el-input>
                        </div>
                      </el-popover>
                    </td>
                  </el-col>
                </el-row>
                <img :src="require('@/assets/other/arrow_blue.png')" />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="img_box col_img">
                <img :src="require('@/assets/other/arrow_blueUp.png')" />
                <el-row>
                  <el-col :span="24">
                    <titleTd titleName="监外执行再收押" :titleTip="descData.againDetainNum" />
                    <reporTd
                      fieldName="againDetainNum"
                      :selData="selData.againDetainNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.againDetainNum"
                      v-model="iptData.againDetainNum"
                    />
                  </el-col>
                  <el-col :span="24">
                    <titleTd titleName="捕回在逃" :titleTip="descData.catchBackCriminalNum24h" />
                    <reporTd
                      fieldName="catchBackCriminalNum24h"
                      :selData="selData.catchBackCriminalNum24h"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.catchBackCriminalNum24h"
                      v-model="iptData.catchBackCriminalNum24h"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="6">
              <div class="card_box card_box_org">
                <div class="td_row">
                  <titleTd titleName="新收押" :titleTip="descData.newCriminalNum24h" />
                  <reporTd
                    fieldName="newCriminalNum24h"
                    :selData="selData.newCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.newCriminalNum24h"
                    v-model="iptData.newCriminalNum24h"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="从狱内其他监区调入" :titleTip="descData.fromOtherAreaInNum" />
                  <reporTd
                    fieldName="fromOtherAreaInNum"
                    :selData="selData.fromOtherAreaInNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.fromOtherAreaInNum"
                    v-model="iptData.fromOtherAreaInNum"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="从省内其他监狱调入" :titleTip="descData.fromOtherPrisonInNum" />
                  <reporTd
                    fieldName="fromOtherPrisonInNum"
                    :selData="selData.fromOtherPrisonInNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.fromOtherPrisonInNum"
                    v-model="iptData.fromOtherPrisonInNum"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="从省外其他监狱调入" :titleTip="descData.fromOutsideInCount" />
                  <reporTd
                    fieldName="fromOutsideInCount"
                    :selData="selData.fromOutsideInCount"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.fromOutsideInCount"
                    v-model="iptData.fromOutsideInCount"
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="img_box">
                <div class="red">新增</div>
                <img :src="require('@/assets/other/arrow_red.png')" />
              </div>
            </el-col>
            <el-col :span="10">
              <div class="card_box card_box_deepblue">
                <div class="card_head">
                  <titleTd
                    :titleName="isArea?'监区在押罪犯':'监狱在押罪犯'"
                    :titleTip="descData.inPrisonTotalCriminalNum"
                    :msgInfo="inPrisonTotalCriminalNumInfo"
                    :dataErrorFlag="selData.isInPrisonTotalCriminal"
                  />
                  <reporTd
                    fieldName="inPrisonTotalCriminalNum"
                    :selData="selData.inPrisonTotalCriminalNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.inPrisonTotalCriminalNum"
                    v-model="iptData.inPrisonTotalCriminalNum"
                  />
                </div>

                <el-row :gutter="10">
                  <el-col :span="12">住院</el-col>
                  <el-col :span="12" class="td_row">
                    <titleTd titleName="罪犯学习数" :titleTip="descData.criminalStudyNum" />
                    <reporTd
                      fieldName="criminalStudyNum"
                      :selData="selData.criminalStudyNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.criminalStudyNum"
                      v-model="iptData.criminalStudyNum"
                    />
                  </el-col>
                  <el-col :span="12" class="td_row">
                    <titleTd titleName="狱内住院" :titleTip="descData.beHospitalInPrisonCriminalNum" />
                    <reporTd
                      fieldName="beHospitalInPrisonCriminalNum"
                      :selData="selData.beHospitalInPrisonCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.beHospitalInPrisonCriminalNum"
                      v-model="iptData.beHospitalInPrisonCriminalNum"
                    />
                  </el-col>

                  <el-col :span="12" class="td_row">
                    <titleTd titleName="罪犯休息数" :titleTip="descData.criminalRestNum" />
                    <reporTd
                      fieldName="criminalRestNum"
                      :selData="selData.criminalRestNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.criminalRestNum"
                      v-model="iptData.criminalRestNum"
                    />
                  </el-col>

                  <el-col :span="12" class="td_row">
                    <titleTd titleName="局中心住院" :titleTip="descData.juCenterInHospitalCriminalNum" />
                    <reporTd
                      fieldName="juCenterInHospitalCriminalNum"
                      :selData="selData.juCenterInHospitalCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.juCenterInHospitalCriminalNum"
                      v-model="iptData.juCenterInHospitalCriminalNum"
                    />
                  </el-col>

                  <el-col :span="12" class="td_row">
                    <titleTd titleName="禁闭" :titleTip="descData.lockCriminalNum" />
                    <reporTd
                      fieldName="lockCriminalNum"
                      :selData="selData.lockCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.lockCriminalNum"
                      v-model="iptData.lockCriminalNum"
                    />
                  </el-col>
                  <el-col :span="12" class="td_row">
                    <titleTd titleName="住社会医院" :titleTip="descData.inSocietyHospitalCriminalNum" />
                    <reporTd
                      fieldName="inSocietyHospitalCriminalNum"
                      :selData="selData.inSocietyHospitalCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.inSocietyHospitalCriminalNum"
                      v-model="iptData.inSocietyHospitalCriminalNum"
                    />
                  </el-col>
                  <el-col :span="12" class="td_row">
                    <titleTd titleName="隔离" :titleTip="descData.isolationCriminalNum" />
                    <reporTd
                      fieldName="isolationCriminalNum"
                      :selData="selData.isolationCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.isolationCriminalNum"
                      v-model="iptData.isolationCriminalNum"
                    />
                  </el-col>
                  <el-col :span="12">劳动</el-col>
                  <el-col :span="12">其他</el-col>

                  <el-col :span="12" class="td_row">
                    <titleTd titleName="生产性劳动" :titleTip="descData.produceLaborCriminalNum" />
                    <reporTd
                      fieldName="produceLaborCriminalNum"
                      :selData="selData.produceLaborCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.produceLaborCriminalNum"
                      v-model="iptData.produceLaborCriminalNum"
                    />
                  </el-col>
                  <el-col :span="12" class="td_row">
                    <titleTd titleName="外出看病" :titleTip="descData.outsideSeePatientNum" />
                    <reporTd
                      fieldName="outsideSeePatientNum"
                      :selData="selData.outsideSeePatientNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.outsideSeePatientNum"
                      v-model="iptData.outsideSeePatientNum"
                    />
                  </el-col>
                  <el-col :span="12" class="td_row">
                    <titleTd titleName="事务性劳动" :titleTip="descData.businessLaborCriminalNum" />
                    <reporTd
                      fieldName="businessLaborCriminalNum"
                      :selData="selData.businessLaborCriminalNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.businessLaborCriminalNum"
                      v-model="iptData.businessLaborCriminalNum"
                    />
                  </el-col>

                  <el-col :span="12" class="td_row">
                    <titleTd titleName="特许离监" :titleTip="descData.especiallyOutPrisonCount" />
                    <reporTd
                      fieldName="especiallyOutPrisonCount"
                      :selData="selData.especiallyOutPrisonCount"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.especiallyOutPrisonCount"
                      v-model="iptData.especiallyOutPrisonCount"
                    />
                  </el-col>
                  <el-col :span="12" :offset="12" class="td_row">
                    <titleTd titleName="未管所收容教养犯罪少年" :titleTip="descData.younthNum" />
                    <reporTd
                      fieldName="younthNum"
                      :selData="selData.younthNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.younthNum"
                      v-model="iptData.younthNum"
                    />
                  </el-col>
                  <el-col :span="12" :offset="12" class="td_row">
                    <titleTd titleName="其他（如陪护等）" :titleTip="descData.accompanyNum" />
                    <reporTd
                      fieldName="accompanyNum"
                      :selData="selData.accompanyNum"
                      :prisonId="prisonId"
                      :iptFlag="cheackFlag"
                      :sqlData="sqlData.accompanyNum"
                      v-model="iptData.accompanyNum"
                    />
                  </el-col>
                  <el-col :span="12" :offset="12" class="td_row">
                    <titleTd titleName="备注" :titleTip="descData.inPrisonCriminalOtherRemark" />
                    <td :colspan="2">
                      <div v-if="isArea">
                        <el-input
                          v-if="cheackFlag"
                          :disabled="cheackFlag"
                          v-model="selData.inPrisonCriminalOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                        <el-input
                          v-else
                          :disabled="cheackFlag"
                          v-model="iptData.inPrisonCriminalOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                      </div>
                      <el-popover placement="top" trigger="click" v-if="!isArea">
                        <div class="pop_main">{{selData.inPrisonCriminalOtherRemark}}</div>
                        <!-- <el-table
                          :data="remarkMap.inPrisonCriminalOtherRemark"
                          border
                          height="300"
                          v-if="selData.inPrisonCriminalOtherRemark ==null"
                        >
                          <el-table-column
                            prop="name"
                            label="监狱/监区"
                            show-overflow-tooltip
                            width="180"
                          ></el-table-column>
                          <el-table-column
                            prop="remark"
                            label="备注"
                            show-overflow-tooltip
                            width="300"
                          ></el-table-column>
                        </el-table>-->

                        <div slot="reference">
                          <el-input
                            v-if="cheackFlag"
                            :disabled="cheackFlag"
                            v-model="selData.inPrisonCriminalOtherRemark"
                            class="yn_ipt"
                            placeholder
                          ></el-input>
                          <el-input
                            v-else
                            :disabled="cheackFlag"
                            v-model="iptData.inPrisonCriminalOtherRemark"
                            class="yn_ipt"
                            placeholder
                          ></el-input>
                        </div>
                      </el-popover>
                    </td>
                  </el-col>
                </el-row>

                <!-- 监狱罪犯基本数据及其增减情况备注 -->
                <div class="criminalRemarks">
                  <!-- <div class="criminalRemarksLable">
                    <p>备注</p>
                  </div>-->
                  <div class="criminalRemarksList" v-if="isArea">
                    <p>今日在押罪犯总数=前一日在押罪犯总数+24小时新增在押总数（新增2+变化1）-24小时在押减少总数（减少2+变化2）</p>
                  </div>
                  <div class="criminalRemarksList" v-else>
                    <p>今日在押罪犯总数=前一日在押罪犯总数+24小时新增在押总数（新增2+变化1-调入2）-24小时在押减少总数（减少2+变化2—调出1）</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="img_box">
                <div class="green">减少</div>
                <img :src="require('@/assets/other/arrow_green.png')" />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="card_box card_box_green">
                <div class="td_row">
                  <titleTd titleName="一般刑释" :titleTip="descData.normalReleaseCriminalNum24h" />
                  <reporTd
                    fieldName="normalReleaseCriminalNum24h"
                    :selData="selData.normalReleaseCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.normalReleaseCriminalNum24h"
                    v-model="iptData.normalReleaseCriminalNum24h"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="假释" :titleTip="descData.releaseOnParoleCriminalNum24h" />
                  <reporTd
                    fieldName="releaseOnParoleCriminalNum24h"
                    :selData="selData.releaseOnParoleCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.releaseOnParoleCriminalNum24h"
                    v-model="iptData.releaseOnParoleCriminalNum24h"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="死亡" :titleTip="descData.dieCriminalNum24h" />
                  <reporTd
                    fieldName="dieCriminalNum24h"
                    :selData="selData.dieCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.dieCriminalNum24h"
                    v-model="iptData.dieCriminalNum24h"
                  />
                </div>
                <div class="td_row">
                  <titleTd
                    titleName="调往狱内其他监区"
                    :titleTip="descData.toOtherJianquInProvinceCriminalNum24h"
                  />
                  <reporTd
                    fieldName="toOtherJianquInProvinceCriminalNum24h"
                    :selData="selData.toOtherJianquInProvinceCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.toOtherJianquInProvinceCriminalNum24h"
                    v-model="iptData.toOtherJianquInProvinceCriminalNum24h"
                  />
                </div>
                <div class="td_row">
                  <titleTd
                    titleName="调往省内其他监狱"
                    :titleTip="descData.toOtherPrisonInProvinceCriminalNum24h"
                  />
                  <reporTd
                    fieldName="toOtherPrisonInProvinceCriminalNum24h"
                    :selData="selData.toOtherPrisonInProvinceCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.toOtherPrisonInProvinceCriminalNum24h"
                    v-model="iptData.toOtherPrisonInProvinceCriminalNum24h"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="调往省外其他监狱" :titleTip="descData.toOutsideCriminalNum24h" />
                  <reporTd
                    fieldName="toOutsideCriminalNum24h"
                    :selData="selData.toOutsideCriminalNum24h"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.toOutsideCriminalNum24h"
                    v-model="iptData.toOutsideCriminalNum24h"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="调往新疆" :titleTip="descData.toOutsideXinjiangNum" />
                  <reporTd
                    fieldName="toOutsideXinjiangNum"
                    :selData="selData.toOutsideXinjiangNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.toOutsideXinjiangNum"
                    v-model="iptData.toOutsideXinjiangNum"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="解回重审" :titleTip="descData.solutionToReviewNum" />
                  <reporTd
                    fieldName="solutionToReviewNum"
                    :selData="selData.solutionToReviewNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.solutionToReviewNum"
                    v-model="iptData.solutionToReviewNum"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="其他" :titleTip="descData.otherCriminalNum" />
                  <reporTd
                    fieldName="otherCriminalNum"
                    :selData="selData.otherCriminalNum"
                    :prisonId="prisonId"
                    :iptFlag="cheackFlag"
                    :sqlData="sqlData.otherCriminalNum"
                    v-model="iptData.otherCriminalNum"
                  />
                </div>
                <div class="td_row">
                  <titleTd titleName="备注" :titleTip="descData.outOfPrisonOtherRemark" />
                  <td :colspan="2">
                    <div v-if="isArea">
                      <el-input
                        v-if="cheackFlag"
                        :disabled="cheackFlag"
                        v-model="selData.outOfPrisonOtherRemark"
                        class="yn_ipt"
                        placeholder
                      ></el-input>
                      <el-input
                        v-else
                        :disabled="cheackFlag"
                        v-model="iptData.outOfPrisonOtherRemark"
                        class="yn_ipt"
                        placeholder
                      ></el-input>
                    </div>
                    <el-popover placement="top" trigger="click" v-if="!isArea">
                      <div class="pop_main">{{selData.outOfPrisonOtherRemark}}</div>
                      <!-- <el-table
                        :data="remarkMap.outOfPrisonOtherRemark"
                        border
                        height="300"
                        v-if="selData.outOfPrisonOtherRemark ==null"
                      >
                        <el-table-column
                          prop="name"
                          label="监狱/监区"
                          show-overflow-tooltip
                          width="180"
                        ></el-table-column>
                        <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                      </el-table>-->

                      <div slot="reference">
                        <el-input
                          v-if="cheackFlag"
                          :disabled="cheackFlag"
                          v-model="selData.outOfPrisonOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                        <el-input
                          v-else
                          :disabled="cheackFlag"
                          v-model="iptData.outOfPrisonOtherRemark"
                          class="yn_ipt"
                          placeholder
                        ></el-input>
                      </div>
                    </el-popover>
                  </td>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="moudek_head" id="criminal_type">
          <i class="el-icon-s-data icon_img"></i>

          <div class="head_name">{{isArea?'监区押犯构成情况':'监狱押犯构成情况'}}</div>
        </div>

        <table class="police_table setInputWidth" rules="all" cellpadding="10">
          <tr>
            <td :rowspan="7">
              <span :class="selData.isInPrisonTotalCriminal?'':'errTitle'">押犯构成情况</span>
            </td>
            <td :rowspan="3">按严管等级</td>

            <titleTd titleName="宽管级罪犯" :col="2" :titleTip="descData.slackManageCriminalNum" />
            <reporTd
              fieldName="slackManageCriminalNum"
              :selData="selData.slackManageCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.slackManageCriminalNum"
              v-model="iptData.slackManageCriminalNum"
            />
            <titleTd titleName="普管级罪犯" :col="2" :titleTip="descData.normalManageCriminalNum" />
            <reporTd
              fieldName="normalManageCriminalNum"
              :selData="selData.normalManageCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.normalManageCriminalNum"
              v-model="iptData.normalManageCriminalNum"
            />
          </tr>
          <tr>
            <titleTd titleName="严管级罪犯" :col="2" :titleTip="descData.hardManageCriminalNum" />
            <reporTd
              fieldName="hardManageCriminalNum"
              :selData="selData.hardManageCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.hardManageCriminalNum"
              v-model="iptData.hardManageCriminalNum"
            />
            <titleTd titleName="未定级罪犯" :col="2" :titleTip="descData.noLevelCriminalNum" />
            <reporTd
              fieldName="noLevelCriminalNum"
              :selData="selData.noLevelCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.noLevelCriminalNum"
              v-model="iptData.noLevelCriminalNum"
            />
          </tr>
          <tr>
            <!-- 分管等级的备注 -->
            <titleTd titleName="备注" :col="2" :titleTip="descData.levelRemark" />
            <td :colspan="6">
              <div v-if="isArea">
                <el-input
                  v-if="cheackFlag"
                  :disabled="cheackFlag"
                  v-model="selData.levelRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
                <el-input
                  v-else
                  :disabled="cheackFlag"
                  v-model="iptData.levelRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
              </div>
              <el-popover placement="top" trigger="click" v-if="!isArea">
                <div class="pop_main">{{selData.levelRemark}}</div>
                <!-- <el-table
                  :data="remarkMap.levelRemark"
                  border
                  height="300"
                  v-if="selData.levelRemark == null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.levelRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.levelRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
            <!-- <reporTd fieldName='xx':selData='selData.xx' :prisonId='prisonId' :iptFlag="cheackFlag" :col="6" :sqlData="sqlData" v-model="iptData" /> -->
          </tr>
          <tr>
            <td :rowspan="3">按严管等级</td>

            <titleTd titleName="涉毒罪犯" :titleTip="descData.drugCriminalNum" />
            <reporTd
              fieldName="drugCriminalNum"
              :selData="selData.drugCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.drugCriminalNum"
              v-model="iptData.drugCriminalNum"
            />
            <titleTd titleName="女犯人数" :titleTip="descData.femaleCriminalNum" />
            <reporTd
              fieldName="femaleCriminalNum"
              :selData="selData.femaleCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.femaleCriminalNum"
              v-model="iptData.femaleCriminalNum"
            />
            <titleTd titleName="外国籍罪犯" :titleTip="descData.foreignCriminalNum" />
            <reporTd
              fieldName="foreignCriminalNum"
              :selData="selData.foreignCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.foreignCriminalNum"
              v-model="iptData.foreignCriminalNum"
            />
            <titleTd titleName="艾滋病犯" :titleTip="descData.hivCriminalNum" />
            <reporTd
              fieldName="hivCriminalNum"
              :selData="selData.hivCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.hivCriminalNum"
              v-model="iptData.hivCriminalNum"
            />
          </tr>
          <tr>
            <titleTd titleName="职务犯" :titleTip="descData.dutyCrimeCriminalNum" />
            <reporTd
              fieldName="dutyCrimeCriminalNum"
              :selData="selData.dutyCrimeCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.dutyCrimeCriminalNum"
              v-model="iptData.dutyCrimeCriminalNum"
            />
            <titleTd titleName="未成年犯" :titleTip="descData.nonageCriminalNum" />
            <reporTd
              fieldName="nonageCriminalNum"
              :selData="selData.nonageCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.nonageCriminalNum"
              v-model="iptData.nonageCriminalNum"
            />
            <titleTd titleName="涉黑犯" :titleTip="descData.sheheiCriminalNum" />
            <reporTd
              fieldName="sheheiCriminalNum"
              :selData="selData.sheheiCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.sheheiCriminalNum"
              v-model="iptData.sheheiCriminalNum"
            />
            <titleTd titleName="涉恶犯" :titleTip="descData.sheeCriminalNum" />
            <reporTd
              fieldName="sheeCriminalNum"
              :selData="selData.sheeCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.sheeCriminalNum"
              v-model="iptData.sheeCriminalNum"
            />
          </tr>
          <tr>
            <titleTd titleName="具有军警特经历罪犯" :titleTip="descData.hasMilitaryPoliceTeCriminalNum" />
            <reporTd
              fieldName="hasMilitaryPoliceTeCriminalNum"
              :selData="selData.hasMilitaryPoliceTeCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.hasMilitaryPoliceTeCriminalNum"
              v-model="iptData.hasMilitaryPoliceTeCriminalNum"
            />
            <titleTd titleName="限制减刑犯" :titleTip="descData.limitReducePrisonTermCriminalNum" />
            <reporTd
              fieldName="limitReducePrisonTermCriminalNum"
              :selData="selData.limitReducePrisonTermCriminalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.limitReducePrisonTermCriminalNum"
              v-model="iptData.limitReducePrisonTermCriminalNum"
            />
            <titleTd titleName="其他" :titleTip="descData.otherCriminalTypeNum" />
            <reporTd
              fieldName="otherCriminalTypeNum"
              :selData="selData.otherCriminalTypeNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.otherCriminalTypeNum"
              v-model="iptData.otherCriminalTypeNum"
            />
            <!-- 罪犯类型备注 -->
            <titleTd titleName="备注" :titleTip="descData.criminalTypeRemark" />
            <td>
              <div v-if="isArea">
                <el-input
                  v-if="cheackFlag"
                  :disabled="cheackFlag"
                  v-model="selData.criminalTypeRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
                <el-input
                  v-else
                  :disabled="cheackFlag"
                  v-model="iptData.criminalTypeRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
              </div>
              <el-popover placement="top" trigger="click" v-if="!isArea">
                <div class="pop_main">{{selData.criminalTypeRemark}}</div>
                <!-- <el-table
                  :data="remarkMap.criminalTypeRemark"
                  border
                  height="300"
                  v-if="selData.criminalTypeRemark == null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.criminalTypeRemark"
                    class="yn_ipt table_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.criminalTypeRemark"
                    class="yn_ipt table_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>

            <!-- <reporTd fieldName='xx':selData='selData.xx' :prisonId='prisonId' :iptFlag="cheackFlag" :sqlData="sqlData" v-model="iptData" /> -->
          </tr>
          <!-- 新增备注tr -->
          <tr>
            <td :colspan="1" align="center">备注</td>
            <td :colspan="8">
              <p>押犯总数=宽管级+普管级+严管级+未定级；</p>
              <!-- <p>押犯总数=涉毒罪犯+女犯人数+外国籍罪犯+艾滋病犯+职务犯+未成年犯+涉黑犯+涉恶犯+具有军警特经历罪犯+限制减刑犯+其他；</p> -->
            </td>
          </tr>
        </table>

        <div class="moudek_head" id="prison_info">
          <i class="el-icon-s-release icon_img"></i>

          <div class="head_name" v-if="!isArea">当日监狱管理情况</div>
          <div class="head_name" v-if="isArea">当日监区管理情况</div>
        </div>

        <table class="police_table setInputWidth" rules="all" cellpadding="10">
          <tr>
            <td :rowspan="10" v-if="!isArea">当日监狱管理情况</td>
            <td :rowspan="10" v-if="isArea">当日监区管理情况</td>
            <titleTd titleName="罪犯违纪违规总人数" :titleTip="descData.allIllegalNum" />
            <reporTd
              fieldName="allIllegalNum"
              :selData="selData.allIllegalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.allIllegalNum"
              v-model="iptData.allIllegalNum"
            />
            <titleTd titleName="普通违规违纪人数" :col="3" :titleTip="descData.normalIllegalNum" />
            <reporTd
              fieldName="normalIllegalNum"
              :selData="selData.normalIllegalNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="4"
              :sqlData="sqlData.normalIllegalNum"
              v-model="iptData.normalIllegalNum"
            />
          </tr>
          <tr>
            <titleTd titleName="新增禁闭人数" :titleTip="descData.addLockNum" />
            <reporTd
              fieldName="addLockNum"
              :selData="selData.addLockNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.addLockNum"
              v-model="iptData.addLockNum"
            />
            <titleTd titleName="解除禁闭人数" :titleTip="descData.reduceLockNum" />
            <reporTd
              fieldName="reduceLockNum"
              :selData="selData.reduceLockNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.reduceLockNum"
              v-model="iptData.reduceLockNum"
            />
            <titleTd titleName="禁闭转隔离人数" :col="2" :titleTip="descData.lockToIsolationNum" />
            <reporTd
              fieldName="lockToIsolationNum"
              :selData="selData.lockToIsolationNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.lockToIsolationNum"
              v-model="iptData.lockToIsolationNum"
            />
          </tr>
          <tr>
            <titleTd titleName="新增隔离人数" :titleTip="descData.addIsolaltionNum" />
            <reporTd
              fieldName="addIsolaltionNum"
              :selData="selData.addIsolaltionNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.addIsolaltionNum"
              v-model="iptData.addIsolaltionNum"
            />
            <titleTd titleName="解除隔离人数" :titleTip="descData.reduceIsolationNum" />
            <reporTd
              fieldName="reduceIsolationNum"
              :selData="selData.reduceIsolationNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.reduceIsolationNum"
              v-model="iptData.reduceIsolationNum"
            />
            <titleTd titleName="隔离转禁闭人数" :col="2" :titleTip="descData.isolationToLockNum" />
            <reporTd
              fieldName="isolationToLockNum"
              :selData="selData.isolationToLockNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.isolationToLockNum"
              v-model="iptData.isolationToLockNum"
            />
          </tr>
          <tr>
            <titleTd titleName="罪犯“两违”数量" :row="2" :titleTip="descData.liangWeiNum" />
            <reporTd
              fieldName="liangWeiNum"
              :selData="selData.liangWeiNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :row="2"
              :sqlData="sqlData.liangWeiNum"
              v-model="iptData.liangWeiNum"
            />
            <td :rowspan="2">其中，部门发现</td>
            <titleTd titleName="监区" :titleTip="descData.liangWeiAreaNum" />
            <reporTd
              fieldName="liangWeiAreaNum"
              :selData="selData.liangWeiAreaNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.liangWeiAreaNum"
              v-model="iptData.liangWeiAreaNum"
            />
            <titleTd titleName="特警队" :titleTip="descData.liangWeiTejingNum" />
            <reporTd
              fieldName="liangWeiTejingNum"
              :selData="selData.liangWeiTejingNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.liangWeiTejingNum"
              v-model="iptData.liangWeiTejingNum"
            />
            <titleTd titleName="指挥中心" :titleTip="descData.liangWeiCenterNum" />
            <reporTd
              fieldName="liangWeiCenterNum"
              :selData="selData.liangWeiCenterNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.liangWeiCenterNum"
              v-model="iptData.liangWeiCenterNum"
            />
          </tr>
          <tr>
            <titleTd titleName="职能部门" :titleTip="descData.liangWeiDeptNum" />
            <reporTd
              fieldName="liangWeiDeptNum"
              :selData="selData.liangWeiDeptNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.liangWeiDeptNum"
              v-model="iptData.liangWeiDeptNum"
            />
            <titleTd titleName="上级部门" :col="2" :titleTip="descData.liangWeiSuperNum" />
            <reporTd
              fieldName="liangWeiSuperNum"
              :selData="selData.liangWeiSuperNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.liangWeiSuperNum"
              v-model="iptData.liangWeiSuperNum"
            />
          </tr>
          <tr>
            <titleTd titleName="罪犯“三单”数量" :row="2" :titleTip="descData.sanDanNum" />
            <reporTd
              fieldName="sanDanNum"
              :selData="selData.sanDanNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :row="2"
              :sqlData="sqlData.sanDanNum"
              v-model="iptData.sanDanNum"
            />
            <td :rowspan="2">其中，部门发现</td>
            <titleTd titleName="监区" :titleTip="descData.sanDanAreaNum" />
            <reporTd
              fieldName="sanDanAreaNum"
              :selData="selData.sanDanAreaNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.sanDanAreaNum"
              v-model="iptData.sanDanAreaNum"
            />
            <titleTd titleName="特警队" :titleTip="descData.sanDanTejingNum" />
            <reporTd
              fieldName="sanDanTejingNum"
              :selData="selData.sanDanTejingNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.sanDanTejingNum"
              v-model="iptData.sanDanTejingNum"
            />
            <titleTd titleName="指挥中心" :titleTip="descData.sanDanCenterNum" />
            <reporTd
              fieldName="sanDanCenterNum"
              :selData="selData.sanDanCenterNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.sanDanCenterNum"
              v-model="iptData.sanDanCenterNum"
            />
          </tr>
          <tr>
            <titleTd titleName="职能部门" :titleTip="descData.sanDanDeptNum" />
            <reporTd
              fieldName="sanDanDeptNum"
              :selData="selData.sanDanDeptNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.sanDanDeptNum"
              v-model="iptData.sanDanDeptNum"
            />
            <titleTd titleName="上级部门" :col="2" :titleTip="descData.sanDanSuperNum" />
            <reporTd
              fieldName="sanDanSuperNum"
              :selData="selData.sanDanSuperNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.sanDanSuperNum"
              v-model="iptData.sanDanSuperNum"
            />
          </tr>
          <tr>
            <titleTd titleName="罪犯“四碰”数量" :row="2" :titleTip="descData.siPengNum" />
            <reporTd
              fieldName="siPengNum"
              :selData="selData.siPengNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :row="2"
              :sqlData="sqlData.siPengNum"
              v-model="iptData.siPengNum"
            />
            <td :rowspan="2">其中，部门发现</td>
            <titleTd titleName="监区" :titleTip="descData.siPengAreaNum" />
            <reporTd
              fieldName="siPengAreaNum"
              :selData="selData.siPengAreaNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.siPengAreaNum"
              v-model="iptData.siPengAreaNum"
            />
            <titleTd titleName="特警队" :titleTip="descData.siPengTejingNum" />
            <reporTd
              fieldName="siPengTejingNum"
              :selData="selData.siPengTejingNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.siPengTejingNum"
              v-model="iptData.siPengTejingNum"
            />
            <titleTd titleName="指挥中心" :titleTip="descData.siPengCenterNum" />
            <reporTd
              fieldName="siPengCenterNum"
              :selData="selData.siPengCenterNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.siPengCenterNum"
              v-model="iptData.siPengCenterNum"
            />
          </tr>
          <tr>
            <titleTd titleName="职能部门" :titleTip="descData.siPengDeptNum" />
            <reporTd
              fieldName="siPengDeptNum"
              :selData="selData.siPengDeptNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :sqlData="sqlData.siPengDeptNum"
              v-model="iptData.siPengDeptNum"
            />
            <titleTd titleName="上级部门" :col="2" :titleTip="descData.siPengSuperNum" />
            <reporTd
              fieldName="siPengSuperNum"
              :selData="selData.siPengSuperNum"
              :prisonId="prisonId"
              :iptFlag="cheackFlag"
              :col="2"
              :sqlData="sqlData.siPengSuperNum"
              v-model="iptData.siPengSuperNum"
            />
          </tr>
          <!-- 新增备注tr -->
          <tr>
            <titleTd titleName="备注" :col="1" :titleTip="descData.todayPrisonManageRemark" />
            <td :colspan="8">
              <div v-if="isArea">
                <el-input
                  v-if="cheackFlag"
                  :disabled="cheackFlag"
                  v-model="selData.todayPrisonManageRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
                <el-input
                  v-else
                  :disabled="cheackFlag"
                  v-model="iptData.todayPrisonManageRemark"
                  class="yn_ipt"
                  placeholder
                ></el-input>
              </div>
              <el-popover placement="top" trigger="click" v-if="!isArea">
                <div class="pop_main">{{selData.todayPrisonManageRemark}}</div>
                <!-- <el-table
                  :data="remarkMap.todayPrisonManageRemark"
                  border
                  height="300"
                  v-if="selData.todayPrisonManageRemark == null"
                >
                  <el-table-column prop="name" label="监狱/监区" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="remark" label="备注" show-overflow-tooltip width="300"></el-table-column>
                </el-table>-->

                <div slot="reference">
                  <el-input
                    v-if="cheackFlag"
                    :disabled="cheackFlag"
                    v-model="selData.todayPrisonManageRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                  <el-input
                    v-else
                    :disabled="cheackFlag"
                    v-model="iptData.todayPrisonManageRemark"
                    class="yn_ipt"
                    placeholder
                  ></el-input>
                </div>
              </el-popover>
            </td>
          </tr>
        </table>

        <div class="moudek_head" id="diy_table">
          <i class="el-icon-s-order icon_img"></i>

          <div class="head_name">自定义项</div>
          <el-button
            :style="{'margin-left':'2rem'}"
            class="yn_long_btn yn_btn"
            type="primary"
            @click="openDIY"
            v-if="userPrisonId==1"
          >自定义项管理</el-button>
        </div>

        <!-- 编辑自定义项 -->
        <el-dialog class="yn_dialog" center title="自定义项管理" :visible.sync="DIYflag" width="50%">
          <div class="diy_items" v-for="(item,i) in DIYlist" :key="i">
            <div class="items_name">
              <!-- <el-input v-model="item.value" class="yn_ipt" placeholder="自定义项目名"></el-input> -->
              {{item.fieldName}}
            </div>
            <div class="items_type">
              <!-- <el-select class="yn_ipt" v-model="item.fieldType" placeholder="请选择">
                <el-option label="数字" value="int"></el-option>
                <el-option label="文字" value="str"></el-option>
              </el-select>-->
              {{item.fieldType=='int'?'数字':'文字'}}
            </div>
            <div class="items_icon">
              <i class="el-icon-delete" @click="delOne(item.id)"></i>
            </div>
          </div>
          <el-button class="yn_btn" type="primary" @click="addDIYflag=true">新增自定义项</el-button>

          <div slot="footer">
            <el-button class="yn_btn" type="primary" @click="DIYflag=false">确定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          append-to-body
          class="yn_dialog"
          center
          title="新增自定义项"
          :visible.sync="addDIYflag"
          @close="addDIYlist=[{ fieldName: '', fieldType: 'int' }]"
          width="50%"
        >
          <div class="diy_items" v-for="(item,i) in addDIYlist" :key="i">
            <div class="items_name">
              <el-input v-model="item.fieldName" class="yn_ipt" placeholder="自定义项目名"></el-input>
            </div>
            <div class="items_type">
              <el-select class="yn_ipt" v-model="item.fieldType" placeholder="请选择">
                <el-option label="数字" value="int"></el-option>
                <el-option label="文字" value="str"></el-option>
              </el-select>
            </div>
            <div class="items_icon">
              <i class="el-icon-delete" @click="delAddOne(i)"></i>
            </div>
          </div>
          <el-button class="yn_btn" type="primary" @click="addDIYOne">添加</el-button>

          <div slot="footer">
            <el-button class="yn_btn" type="primary" @click="subADD">保存</el-button>
          </div>
        </el-dialog>

        <table class="police_table" rules="all" cellpadding="10">
          <!-- 获取 customList后   把每四项放入一个小数组arr 组成大数组customArrList  tr-td-->
          <tr v-for="(arr,i) in customArrList" :key="i+'cust'">
            <template :style="{'padding':0}" v-for="(item,j) in arr">
              <!-- eslint提示报错 但template无法用key标记-->
              <titleDIYTd :titleName="item.fieldName" :col="2" :titleTip="item" :key="'til'+j" />
              <reporDIYTd
                :key="'rep'+j"
                :fieldName="item.fieldName"
                :iptType="item.fieldType"
                :prisonId="prisonId"
                :iptFlag="cheackFlag"
                :status="item.status"
                :changeValue="item.changeValue"
                :col="2"
                v-model="item.fieldValue"
              />
            </template>
          </tr>
        </table>

        <el-row :gutter="10" type="flex" justify="center" align="middle" v-if="prisonId!=1">
          <el-col :span="8">
            <el-row :gutter="10" type="flex" justify="center" align="middle">
              <el-col :span="8" class="yn_title">数据上报人：</el-col>
              <el-col :span="12">
                <el-input
                  v-if="cheackFlag"
                  :disabled="cheackFlag"
                  v-model="selData.reporterName"
                  class="yn_ipt"
                  placeholder
                ></el-input>
                <el-input
                  v-else
                  :disabled="cheackFlag"
                  v-model="iptData.reporterName"
                  class="yn_ipt"
                  :maxlength="20"
                  placeholder
                ></el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="10" type="flex" justify="center" align="middle">
              <el-col :span="8" class="yn_title">数据审核人：</el-col>
              <el-col :span="12">
                <el-input
                  v-if="cheackFlag"
                  :disabled="cheackFlag"
                  v-model="selData.reviewerName"
                  class="yn_ipt"
                  placeholder
                ></el-input>
                <el-input
                  v-else
                  :disabled="cheackFlag"
                  v-model="iptData.reviewerName"
                  class="yn_ipt"
                  placeholder
                  :maxlength="20"
                ></el-input>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="btn_box">
          <!-- 省局打回监狱，监狱打回监区 -->
          <el-button
            :style="{'margin-left':'2rem'}"
            class="yn_long_btn yn_btn"
            type="primary"
            @click="openBack"
            v-if="(prisonId!=1&&userPrisonId==1&&!isArea&&formatDate(new Date(date),'yyyy-MM-dd')==formatDate(new Date(),'yyyy-MM-dd')&&isReport)||(prisonId==userPrisonId&&isArea&&isReport&&formatDate(new Date(date),'yyyy-MM-dd')==formatDate(new Date(),'yyyy-MM-dd')&&isPrison)"
          >打回上报</el-button>
          <el-button
            class="yn_btn"
            type="primary"
            v-if="userPrisonId!=1&&formatDate(new Date(date),'yyyy-MM-dd')==formatDate(new Date(),'yyyy-MM-dd')&&!cheackFlag&&deptId==userDeptId"
            @click="subForm"
            :disabled="isReport"
          >{{isReport?'已上报':isArea?'上报监狱':'上报省局'}}</el-button>
          <!-- <el-button
            class="yn_btn"
            type="primary"
            v-if="prisonId==1&&!cheackFlag"
            :disabled="isReport"
            @click="subForm"
          >{{isReport?'已编辑':'省局编辑'}}</el-button>-->
          <!-- 调试按钮 -->
          <!-- <el-button
            class="yn_btn"
            type="primary"
            :disabled="isReport"
            @click="subForm"
          >省局编辑</el-button>-->
          <el-button
            class="yn_btn"
            type="primary"
            v-if="userPrisonId!=1&&permission&&deptId==userDeptId&&formatDate(new Date(date),'yyyy-MM-dd')!==formatDate(new Date(),'yyyy-MM-dd')"
            @click="subForm"
          >补报</el-button>
          <!-- <el-button
            class="yn_btn"
            type="success"
            v-if="userPrisonId!=1&&!isReport&&formatDate(new Date(date),'yyyy-MM-dd')!==formatDate(new Date(),'yyyy-MM-dd')&&!permission&&!isArea"
            @click="applyPermission"
          >申请授权</el-button>-->

          <!-- 省局授权监狱补报 -->
          <el-button
            class="yn_btn"
            type="success"
            v-if="userPrisonId==1&&prisonId!=1&&formatDate(new Date(date),'yyyy-MM-dd')!==formatDate(new Date(),'yyyy-MM-dd')&&!isReport&&!permission"
            @click="getPermission"
          >授权补报</el-button>
          <!-- 监狱授权监区补报 -->

          <el-button
            class="yn_btn"
            type="success"
            v-if="userPrisonId!=1&&isPrison&&formatDate(new Date(date),'yyyy-MM-dd')!==formatDate(new Date(),'yyyy-MM-dd')&&!isReport&&!permission&&isArea"
            @click="getPermission"
          >授权补报</el-button>

          <el-button
            class="yn_btn"
            type="primary"
            v-if="userPrisonId==1&&!isReport&&!cheackFlag&&prisonId!=1&&!isArea&&(formatDate(new Date(date),'yyyy-MM-dd')==formatDate(new Date(),'yyyy-MM-dd')||permission)"
            @click="helpSubForm"
          >省局代报</el-button>

          <el-button
            class="yn_btn"
            type="primary"
            v-if="userPrisonId!=1&&!isReport&&!cheackFlag&&deptId!=userDeptId&&isArea&&(formatDate(new Date(date),'yyyy-MM-dd')==formatDate(new Date(),'yyyy-MM-dd')||permission)"
            @click="helpSubForm"
          >监狱代报</el-button>
          <el-button
            class="yn_btn"
            type="primary"
            v-if="(isArea || isPrisonC)&&userPrisonId!=1&&!isReport&&deptId==userDeptId&&formatDate(new Date(date),'yyyy-MM-dd')==formatDate(new Date(),'yyyy-MM-dd')"
            @click="subFormLocal"
          >保存本地</el-button>

          <!-- 省局授权监狱非当日重报 -->
          <el-button
            class="yn_btn"
            type="success"
            v-if="userPrisonId==1&&!noError&&prisonId!=1&&formatDate(new Date(date),'yyyy-MM-dd')!==formatDate(new Date(),'yyyy-MM-dd')&&isReport&&!permission"
            @click="subAgain"
          >授权重报</el-button>
          <!-- 监狱授权监区重报 -->

          <el-button
            class="yn_btn"
            type="success"
            v-if="userPrisonId!=1&&!noError&&isPrison&&formatDate(new Date(date),'yyyy-MM-dd')!==formatDate(new Date(),'yyyy-MM-dd')&&isReport&&!permission&&isArea"
            @click="subAgain"
          >授权重报</el-button>
        </div>
      </div>

      <!-- 打回上报原因 -->
      <el-dialog
        append-to-body
        class="yn_dialog"
        center
        title="打回上报"
        :visible.sync="bakcFlag"
        width="50%"
      >
        <el-form label-width="8rem" class="yn_form" ref="addform">
          <el-form-item label="打回原因:">
            <el-input
              class="yn_ipt"
              type="textarea"
              autosize
              :maxlength="300"
              placeholder="无"
              v-model="backDetail"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button class="yn_btn" type="primary" @click="subBack">确认打回</el-button>
        </div>
      </el-dialog>
    </menuTree>
    <div id="test"></div>
  </dept-layout>
</template>

<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import PieChart from './pie_charts/pie_charts.vue'
import LineChart from './line_charts/'
import reporTd from './repor_td/'
import titleTd from './title_td/'
import titleDIYTd from './title_td_diy/'
import reporDIYTd from './repor_td_diy/'
import deptLayout from './layout'
import exportExcel from './export_excel/'
import {
  getPrisonId,
  getUserId,
  getDeptType,
  getDeptId,
  getDeptName
} from '@/utils'
import { formatDate } from '@/utils/date'
import {
  subForm,
  subTime,
  getTime,
  getForm,
  getDesc,
  getDeptTreeForBaseData,
  selPermission,
  applyPermission,
  authorizePermission,
  selLibrary,
  selIsReport,
  findFieldListData,
  getAreaList,
  addDIY,
  deleteDIY,
  editDIY,
  getDIYList,
  rejectReport,
  seeReject,
  queryReportValue,
  updateFieldValue,
  prisonAreaLocalSaveData,
  localSave,
  getLocalData
} from './server'

import tableView from '@/components/table_view/'
import _global from '@/utils/global_url'
import menuTree from '@/components/menu_tree/'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
let today = new Date().getTime()
var special = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /[`~!@#$%^&*_\-+=<>?"{}|/'\\[\]·~！@#￥……&*——\|《》？]/
  //   /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/
)
// import faildList from 'static/baseData/baseData.json'

export default {
  data() {
    return {
      cheackFlag: true,
      date: new Date(), // 时间
      userPrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      deptId: getDeptType() == '指挥中心' ? getPrisonId() : getDeptId(),
      userDeptId: getDeptType() == '指挥中心' ? getPrisonId() : getDeptId(),
      isPrison:
        getDeptType() == '指挥中心' ||
        getDeptType() == '监狱' ||
        getDeptType() == '省局',
      isArea:
        getDeptType() != '指挥中心' &&
        getDeptType() != '监狱' &&
        getDeptType() != '省局',
      sqlData: {},
      iptData: {},
      selData: {},
      editFLag: false,
      timer: [new Date(), new Date()],
      editTime: {},
      descData: {},
      prisonList: [],
      remarkMap: [],
      loading: false,
      noReport: false,
      permission: false,
      isReport: false,
      isPrisonC:
        (getDeptType() == '指挥中心' || getDeptType() == '监狱') &&
        getPrisonId() != 1,
      dataId: '',

      //自定义项相关
      DIYflag: false,
      DIYlist: [],
      customList: [],
      customArrList: [],
      addDIYflag: false,
      addDIYlist: [],

      //打回上报相关
      bakcFlag: false,
      backDetail: '',
      upState: '',
      rejectReason: '',
      //部门名
      deptName:
        getDeptType() == '指挥中心'
          ? JSON.parse(localStorage.getItem('user')).prisonName
          : getDeptName(),

      //悬浮菜单
      theme: localStorage.getItem('theme'),
      pageIsOpen: true,

      //定时查询实时数据
      dataTimer: null,
      calendarFlag: false,
      inTime: false,
      noError: false,

      //  导出所需数据
      deptList: {},

      //校验公式提示信息
      lastRegisteredCriminalNum: 0,
      lastInPrisonTotalCriminalNum: 0,
      AreaNumCheckInfo: [], // 监区数校验信息
      PoliceNumCheckInfo: [], // 警察总数校验信息
      PoliceNumTwoCheckInfo: [], // 辅警总数校验信息
      registeredCriminalNumInfo: [], // 在册罪犯校验
      inPrisonTotalCriminalNumInfo: [] // 在押罪犯校验
    }
  },
  components: {
    PieChart,
    deptLayout,
    LineChart,
    tableView,
    menuTree,
    reporTd,
    titleTd,
    reporDIYTd,
    titleDIYTd,
    exportExcel
  },
  mounted() {
    window.addEventListener('scroll', this.mouseOut, true)
  },
  created() {
    let info = { prisonId: this.prisonId, date: this.date }
    sessionStorage.setItem('info', JSON.stringify(info))
    sessionStorage.setItem('isArea', this.isArea)
    sessionStorage.setItem('deptId', this.deptId)
    if (this.$route.params.date) {
      this.date = formatDate(new Date(this.$route.params.date), 'yyyy-MM-dd')
      this.cheackFlag = false
    }
    this.getTime()
    // this.getForm()
    this.getDesc()
    this.getDeptTreeForBaseData()
    // this.selIsReport()  放入getTime内，避免checkTime出错
  },
  methods: {
    mouseOut(e) {
      document.getElementById('test').click()
    },
    topage() {
      this.$router.push({ name: 'police_management' })
    },
    selIsReport() {
      let str =
        formatDate(new Date(this.date), 'yyyy-MM-dd') +
        '/' +
        this.prisonId +
        '?isDept=' +
        this.isArea +
        '&deptId=' +
        this.deptId
      this.loading = true
      selIsReport(str).then(res => {
        this.isReport = res > 0
        this.upState = res
        if (this.isReport) {
          this.cheackFlag = true
          this.getForm()
        } else {
          this.cheackFlag = this.checkTime()
          //   this.prisonAreaLocalSaveData()
          this.getForm()

          let data =
            formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss') +
            '/' +
            this.prisonId +
            '/' +
            this.deptId
          selPermission(data).then(res => {
            if (res == 0) {
              this.permission = false
            } else {
              this.permission = true
              this.cheackFlag = false
              clearInterval(this.dataTimer)
              this.dataTimer = null
            }
            this.loading = false
          })
        }
      })
      const queryData = {
        date:
          formatDate(
            new Date(new Date().getTime() - 24 * 3600 * 1000),
            'yyyy-MM-dd'
          ) + ' 23:59:59',
        fieldList: ['registeredCriminalNum', 'inPrisonTotalCriminalNum'],
        deptId: this.isArea ? this.deptId : '',
        prisonId: this.prisonId
      }
      this.lastRegisteredCriminalNum = 0
      this.lastInPrisonTotalCriminalNum = 0
      findFieldListData(queryData).then(res => {
        if (res && res.length > 0) {
          this.lastRegisteredCriminalNum = res.find(
            item => item.fieldName === 'registeredCriminalNum'
          ).fieldValue
          this.lastInPrisonTotalCriminalNum = res.find(
            item => item.fieldName === 'inPrisonTotalCriminalNum'
          ).fieldValue
        }
      })
      this.getDIYList()
    },
    getDeptTreeForBaseData() {
      this.prisonList = []
      //判断部门类型
      let makeTreeParamDeptId = getDeptId()
      if (JSON.parse(localStorage.getItem('user')).deptType == '指挥中心') {
        makeTreeParamDeptId = JSON.parse(localStorage.getItem('user')).prisonId
      }
      getDeptTreeForBaseData(
        makeTreeParamDeptId,
        formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      ).then(res => {
        this.prisonList = res
        console.log(this.deptList)

        if (!this.deptList.id) {
          this.deptList = res[0]
        }
      })
    },
    scoll(val) {
      document.getElementById(val).scrollIntoView()
    },
    selToday() {
      this.date = new Date()
      // this.getForm()
      //   this.getDeptTreeForBaseData()
    },
    preDay() {
      this.date = new Date(new Date(this.date).getTime() - 24 * 60 * 60 * 1000)
      // this.getForm()
      //   this.getDeptTreeForBaseData()
    },
    nextDay() {
      if (
        new Date(
          formatDate(new Date(this.date), 'yyyy-MM-dd 00:00:00')
        ).getTime() <
        new Date(formatDate(new Date(), 'yyyy-MM-dd 00:00:00')).getTime()
      ) {
        this.date = new Date(
          new Date(this.date).getTime() + 24 * 60 * 60 * 1000
        )
        // this.getForm()
        // this.getDeptTreeForBaseData()
      }
    },
    nodeClick(val) {
      this.deptList = val
      if (val.parentId != '0') {
        this.isPrisonC = true
      } else {
        this.isPrisonC = false
      }
      this.deptName = val.name
      if (this.userPrisonId == 1) {
        if (val.parentId != 1 && val.parentId != 0) {
          this.isArea = true
          this.prisonId = val.parentId
          this.deptId = val.id
        } else {
          this.prisonId = val.id
          this.deptId = val.id
          this.isArea = false
        }
      } else {
        this.prisonId = getPrisonId()
        this.deptId = val.id
        if (val.id == this.prisonId) {
          this.isArea = false
        } else {
          this.isArea = true
        }
      }
      this.upState = val.state
      sessionStorage.setItem('isArea', this.isArea)
      sessionStorage.setItem('deptId', this.deptId)
      let info = { prisonId: this.prisonId, date: this.date }
      sessionStorage.setItem('info', JSON.stringify(info))
      this.calendarFlag = false
      this.cheackFlag = true
      this.permission = false
      //   this.getForm()
      this.getDesc()
      this.selIsReport()
    },
    getDesc() {
      this.descData = {}
      getDesc().then(res => {
        res.map(item => {
          this.descData[item.id] = item
        })
      })
    },
    getTime() {
      getTime().then(res => {
        if (res) {
          this.timer = [new Date(res.beginTime), new Date(res.endTime)]

          this.editTime.beginTime = formatDate(
            new Date(res.beginTime.replace(/-/g, '/')),
            'hh:mm'
          )
          this.editTime.endTime = formatDate(
            new Date(res.endTime.replace(/-/g, '/')),
            'hh:mm'
          )
        }
        this.selIsReport()
      })
    },
    subTime() {
      if (this.timer.length) {
        let str =
          formatDate(this.timer[0], 'yyyy-MM-dd hh:mm:ss') +
          '/' +
          formatDate(this.timer[1], 'yyyy-MM-dd hh:mm:ss')
        subTime(str).then(res => {
          this.$message.success('修改成功')
          this.editFLag = false
          this.getTime()
          this.checkTime()
        })
      }
    },
    subForm() {
      this.iptData.prisonId = this.userPrisonId
      this.iptData.date = formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      if (this.iptData.state) {
        delete this.iptData.state
      }
      if (this.isArea) {
        this.iptData.deptId = this.deptId
      } else {
        this.iptData.deptId = null
      }
      //上报为1
      this.iptData.state = 1
      this.loading = true
      subForm(this.iptData)
        .then(res => {
          this.$message.success('上报完成')
          // this.getForm()
          this.cheackFlag = true
          this.selIsReport()
          //   this.getDeptTreeForBaseData()
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          //   this.getDeptTreeForBaseData()
          this.selIsReport()
        })
      this.subDIY()
    },

    getForm() {
      this.iptData = {}
      this.selData = {}
      this.loading = true
      this.remarkMap = []
      this.dataId = ''
      let info = JSON.parse(sessionStorage.getItem('info'))

      if (info) {
        info.prisonId = this.prisonId
        info.date = this.date
        sessionStorage.setItem('info', JSON.stringify(info))
      }
      let str =
        formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss') +
        '/' +
        this.prisonId +
        '?isDept=' +
        this.isArea +
        '&deptId=' +
        this.deptId

      getForm(str)
        .then(res => {
          this.getDeptTreeForBaseData()

          this.selData = res

          if (res) {
            for (const key in res) {
              let data = JSON.parse(JSON.stringify(res[key]))
              if (
                data != null &&
                typeof data == 'object' &&
                key != 'remarkMap'
              ) {
                this.$set(this.iptData, key, data.todayReport)
              } else {
                this.$set(this.iptData, key, data)
              }
            }

            if (res.remarkMap) {
              this.remarkMap = res.remarkMap
            } else {
              this.remarkMap = {}
            }
            this.dataId = res.id
            this.loading = false

            //查询是否有数据异常
            this.checkError()
          }
        })
        .catch(err => {
          this.getDeptTreeForBaseData()

          this.noReport = true
          this.loading = false
          this.iptData = {}
          this.selData = {}
          this.remarkMap = {}
          this.dataId = ''
        })
      selLibrary(str).then(res => {
        this.sqlData = res
        this.$forceUpdate()
      })
    },
    applyPermission() {
      let str =
        formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss') +
        '/' +
        this.prisonId +
        '/' +
        this.deptId +
        '/' +
        getUserId()
      applyPermission(str).then(res => {
        console.log(res)
        this.$message.success('申请已提交,请等待处理')
      })
    },

    getPermission() {
      let str =
        formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss') +
        '/' +
        this.prisonId +
        '/' +
        this.deptId +
        '/' +
        1 +
        '/' +
        getUserId()
      this.loading = true
      authorizePermission(str).then(res => {
        this.loading = false
        console.log(res)
        this.$message.success('已授权该监狱/监区该日补报权限')
        this.resetData()
      })
    },
    formtime(row, column, cellValue, index) {
      if (cellValue != null) {
        let date = new Date(cellValue)
        let y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? '0' + MM : MM
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        let h = date.getHours()
        h = h < 10 ? '0' + h : h
        let m = date.getMinutes()
        m = m < 10 ? '0' + m : m
        let s = date.getSeconds()
        s = s < 10 ? '0' + s : s
        // return y + '-' + MM + '-' + d ;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
    },
    openDIY() {
      this.DIYflag = true
    },
    addDIYOne() {
      this.addDIYlist.push({ fieldName: '', fieldType: 'int' })

      console.log(this.addDIYlist)
    },
    delOne(i) {
      this.$confirm(`确认删除记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDIY(i).then(res => {
            console.log(res)
            this.$message.success('删除完成')
            this.getDIYList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    delAddOne(i) {
      this.addDIYlist.splice(i, 1)
    },

    subADD() {
      let flag = true
      this.addDIYlist.map((item, i) => {
        if (flag) {
          if (special.test(item.fieldName)) {
            this.$message({
              type: 'error',
              message: '表头不能包含特殊字符'
            })
            flag = false
          } else if (item.fieldName == '' || !item.fieldName) {
            this.$message.error('请完整填写')
            flag = false
          }
        }
      })
      if (flag) {
        addDIY(this.addDIYlist).then(res => {
          console.log(res)
          this.$message.success(res)
          this.addDIYflag = false
          this.getDIYList()
        })
      }
    },
    getDIYList() {
      this.$set(this, 'customList', [])
      this.$set(this, 'customArrList', [])
      getDIYList().then(res => {
        this.DIYlist = res

        let data =
          'createTime=' +
          formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss') +
          '&prisonId=' +
          this.prisonId

        if (this.isArea) {
          data += '&deptId=' + this.deptId
        }
        queryReportValue(data)
          .then(res => {
            if (typeof res !== 'string') {
              res.map(item => {
                if (item.fieldId) {
                  item.id = item.fieldId
                }
                this.DIYlist.map(obj => {
                  if (obj.id == item.id) {
                    item.fieldDescribe = obj.fieldDescribe
                  }
                })
                this.customList.push(item)
              })

              for (let index = 0; index < this.customList.length / 4; index++) {
                let arr = []
                this.customList.map((item, j) => {
                  if (j < (index + 1) * 4 && j >= index * 4) {
                    arr.push(item)
                  }
                })
                this.customArrList.push(arr)
              }
            } else {
              this.getLocalData()
            }
          })
          .catch(err => {
            console.log(err)

            this.getLocalData()
          })
      })
    },
    //自定义项上报
    subDIY() {
      let data = this.customList.map(item => {
        item.prisonId = this.prisonId
        item.createTime = formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
        if (this.isArea) {
          item.deptId = this.deptId
        } else {
          item.deptId = this.prisonId
        }
        if (item.id) {
          item.fieldId = item.id
        }
        return item
      })

      updateFieldValue(data).then(res => {
        // this.getDIYList()
      })
    },
    //打回上报功能
    //打开打回上报弹框
    openBack() {
      this.bakcFlag = true
      this.backDetail = ''
    },

    subBack() {
      if (this.backDetail) {
        let params = {
          id: this.dataId,
          prisonId: this.prisonId,
          rejectReason: this.backDetail,
          deptId: this.deptId,
          date: formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss'),
          rejectUserId: getUserId(),
          rejectDeptId: getDeptId(),
          rejectDeptType: getDeptType()
        }
        this.loading = true
        rejectReport(params)
          .then(res => {
            this.bakcFlag = false
            this.loading = false
            this.$message.success('已通知')

            this.resetData()
          })
          .catch(err => {
            this.loading = false
          })
      } else {
        this.$message.warning('请填写打回原因')
      }
    },

    //查看打回原因
    seeReject() {
      this.rejectReason = ''
      let str =
        this.prisonId +
        '/' +
        this.deptId +
        '/' +
        formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      seeReject(str).then(res => {
        if (res) {
          this.rejectReason = res.rejectReason
        }
      })
    },
    //代上报
    helpSubForm() {
      this.iptData.prisonId = this.prisonId
      this.iptData.date = formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      if (this.iptData.state) {
        delete this.iptData.state
      }

      if (this.isArea) {
        this.iptData.deptId = this.deptId
      } else {
        this.iptData.deptId = null
      }
      this.loading = true
      this.iptData.state = 1
      subForm(this.iptData).then(res => {
        this.$message.success('上报完成')
        this.resetData()
      })
      this.subDIY()
    },
    calendarShow() {
      this.calendarFlag = !this.calendarFlag
    },
    // 保存本地
    subFormLocal() {
      this.iptData.prisonId = this.userPrisonId
      this.iptData.date = formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      if (this.isArea) {
        this.iptData.deptId = this.deptId
      } else {
        this.iptData.deptId = null
      }
      this.loading = true

      this.iptData.state = -1
      subForm(this.iptData).then(res => {
        this.$message.success('本地保存成功')
        this.loading = false
        this.resetData()
      })
      this.localSave()
      //   this.subDIY()
    },
    // 应用本地
    prisonAreaLocalSaveData() {
      this.iptData = {}
      let str1 =
        this.deptId +
        '/' +
        formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      prisonAreaLocalSaveData(str1).then(res => {
        if (res != null) {
          this.iptData = res
        } else {
          let str =
            formatDate(
              new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
              'yyyy-MM-dd hh:mm:ss'
            ) +
            '/' +
            this.prisonId +
            '?isDept=' +
            this.isArea +
            '&deptId=' +
            this.deptId
          if (new Date(this.date).getDate() == new Date().getDate()) {
            getForm(str)
              .then(res => {
                let iptDataOne = {}
                let iptDataTwo = {}
                iptDataOne = res.remarkMapInBaseData
                for (let key in res) {
                  if (res[key] && res[key].hasOwnProperty('todayReport')) {
                    iptDataTwo[key] = res[key].todayReport
                  }
                }
                this.iptData = Object.assign(iptDataOne, iptDataTwo)
                this.selData = res
                this.remarkMap = res.remarkMap
                this.dataId = res.id
                this.loading = false
                this.noReport = false
              })
              .catch(err => {
                this.noReport = true
                this.loading = false
                // let data =
                //   formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss') +
                //   '/' +
                //   this.prisonId +
                //   '/' +
                //   this.deptId
                // selPermission(data).then(res => {
                //   if (res == 0) {
                //     this.permission = false
                //   } else {
                //     this.permission = true
                //   }
                // })
              })
          }
        }
      })
    },

    //判断能否上报
    checkTime() {
      let flag
      if (this.prisonId == 1) {
        flag = false
      } else if (this.userPrisonId == 1 && this.isArea) {
        flag = false
      } else {
        if (
          formatDate(new Date(this.date), 'yyyy-MM-dd') !==
          formatDate(new Date(), 'yyyy-MM-dd')
        ) {
          //非当天 有授权 打开上报
          if (this.permission) {
            flag = true
          } else {
            flag = false
          }
        } else {
          let now = formatDate(new Date(), 'hh:mm:ss')
          now = new Date('2000-01-01 ' + now).getTime()
          let beginTime = new Date(
            '2000-01-01 ' + this.editTime.beginTime
          ).getTime()
          let endTime = new Date(
            '2000-01-01 ' + this.editTime.endTime
          ).getTime()
          flag = now > beginTime && now < endTime
        }
        this.inTime = flag
      }
      return !flag
    },

    //自定义项保存本地
    localSave() {
      let data = this.customList.map(item => {
        item.prisonId = this.prisonId
        item.createTime = formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
        item.deptId = this.deptId
        if (item.id) {
          item.fieldId = item.id
        }
        return item
      })
      localSave(data).then(res => {})
    },
    getLocalData() {
      let str =
        this.deptId +
        '/' +
        formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      getLocalData(str).then(res => {
        let custom = []
        this.DIYlist.map(item => {
          res.map(val => {
            if (val.fieldName == item.fieldName) {
              item.fieldDescribe = val.fieldDescribe

              this.$set(item, 'fieldValue', val.fieldValue)
            }
          })
          custom.push(item)
        })
        this.$set(this, 'customList', custom)

        let customArr = []
        for (let index = 0; index < custom.length / 4; index++) {
          let arr = []
          custom.map((item, j) => {
            if (j < (index + 1) * 4 && j >= index * 4) {
              arr.push(item)
            }
          })
          customArr.push(arr)
        }
        this.$set(this, 'customArrList', customArr)
      })
    },

    //刷新实时数据
    resetData() {
      this.selIsReport()
    },

    checkError() {
      if (
        this.selData.isAllPolice &&
        this.selData.isInPrisonTotalCriminal &&
        this.selData.isPrisonPoliceNumTwo &&
        this.selData.isRegisteredCriminal &&
        this.selData.isTrueAreaNum
      ) {
        this.noError = true
      } else {
        this.noError = false
      }
    },

    //非当日重报
    subAgain() {
      let params = {
        id: this.dataId,
        prisonId: this.prisonId,
        rejectReason: '数据异常',
        deptId: this.deptId,
        date: formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss'),
        rejectUserId: getUserId(),
        rejectDeptId: getDeptId(),
        rejectDeptType: getDeptType()
      }
      this.loading = true
      rejectReport(params)
        .then(res => {
          this.getPermission()
        })
        .catch(err => {
          this.loading = false
        })
    }
  },

  //监听打开上报，避免上报中刷新实时数据导致填报数据丢失
  watch: {
    // cheackFlag(val) {
    //   let that = this
    //   if (!val) {
    //     clearInterval(this.dataTimer)
    //     this.dataTimer = null
    //   } else {
    //     clearInterval(this.dataTimer)
    //     this.dataTimer = null
    //     this.dataTimer = setInterval(function() {
    //       that.getForm()
    //       that.selIsReport()
    //       that.getDeptTreeForBaseData()
    //     }, 60000)
    //   }
    // },
    iptData: {
      handler(newObj, old) {
        this.AreaNumCheckInfo = []
        this.PoliceNumCheckInfo = []
        this.PoliceNumTwoCheckInfo = []
        this.registeredCriminalNumInfo = []
        this.inPrisonTotalCriminalNumInfo = []

        const add1 = parseInt(newObj.otherAddCriminalNum24h) // 省外调入
        const add2 =
          parseInt(newObj.newCriminalNum24h) +
          parseInt(newObj.fromOtherAreaInNum) +
          parseInt(newObj.fromOtherPrisonInNum) +
          parseInt(newObj.fromOutsideInCount) // 新收押+从狱内其他监区调入+从省内其他监狱调入+从省外其他监狱调入
        const reduce1 =
          parseInt(newObj.outsideReleaseNum) +
          parseInt(newObj.outsideDeathNum) +
          parseInt(newObj.outsideElseNum) // 监外执行刑释+监外执行死亡+监外执行其他情况
        const reduce2 =
          parseInt(newObj.normalReleaseCriminalNum24h) +
          parseInt(newObj.releaseOnParoleCriminalNum24h) +
          parseInt(newObj.dieCriminalNum24h) +
          parseInt(newObj.toOtherJianquInProvinceCriminalNum24h) +
          parseInt(newObj.toOtherPrisonInProvinceCriminalNum24h) +
          parseInt(newObj.toOutsideCriminalNum24h) +
          parseInt(newObj.toOutsideXinjiangNum) +
          parseInt(newObj.solutionToReviewNum) +
          parseInt(newObj.otherCriminalNum)
        const modify1 =
          parseInt(newObj.againDetainNum) +
          parseInt(newObj.catchBackCriminalNum24h)
        const modify2 =
          parseInt(newObj.addTemporaryOutsidePrisonCriminalNum) +
          parseInt(newObj.elseOutsideNum)

        if (!this.isArea) {
          // 实有监区数数据校验  实有监区数=押犯监区数+非押犯监区数；
          if (
            parseInt(newObj.trueAreaNum) ===
            parseInt(newObj.criminalAreaNum) +
              parseInt(newObj.noCriminalAreaNum)
          ) {
            this.selData.isTrueAreaNum = true
          } else {
            this.selData.isTrueAreaNum = false
            this.AreaNumCheckInfo.push(
              `实有监区数(${parseInt(
                newObj.trueAreaNum
              )})≠ 押犯监区数(${parseInt(
                newObj.criminalAreaNum
              )})+非押犯监区数(${parseInt(newObj.noCriminalAreaNum)})`
            )
          }
          // 警察总数数据校验（监狱）
          // 监狱警察总数=监狱男警+监狱女警；
          // 监狱警察总数=机关警察数+监区警察数+监狱医院人数+指挥中心人数+特警队人数+警示教育基地人数(专职)；
          if (
            parseInt(newObj.allPoliceNum) ===
              parseInt(newObj.malePoliceNum) +
                parseInt(newObj.femalePoliceNum) &&
            parseInt(newObj.allPoliceNum) ===
              parseInt(newObj.officePoliceNum) +
                parseInt(newObj.jianquPoliceNum) +
                parseInt(newObj.hospitalPoliceNum) +
                parseInt(newObj.cmdCenterPoliceNum) +
                parseInt(newObj.regimentalPoliceTeamNum) +
                parseInt(newObj.warningEduBasePoliceNum)
          ) {
            this.selData.isAllPolice = true
          } else {
            this.selData.isAllPolice = false
            if (
              parseInt(newObj.allPoliceNum) !==
              parseInt(newObj.malePoliceNum) + parseInt(newObj.femalePoliceNum)
            ) {
              this.PoliceNumCheckInfo.push(
                `监狱警察总数(${parseInt(
                  newObj.allPoliceNum
                )})≠ 监狱男警(${parseInt(
                  newObj.malePoliceNum
                )})+监狱女警(${parseInt(newObj.femalePoliceNum)})`
              )
            }
            if (
              parseInt(newObj.allPoliceNum) !==
              parseInt(newObj.officePoliceNum) +
                parseInt(newObj.jianquPoliceNum) +
                parseInt(newObj.hospitalPoliceNum) +
                parseInt(newObj.cmdCenterPoliceNum) +
                parseInt(newObj.regimentalPoliceTeamNum) +
                parseInt(newObj.warningEduBasePoliceNum)
            ) {
              this.PoliceNumCheckInfo.push(
                `监狱警察总数(${parseInt(
                  newObj.allPoliceNum
                )})≠ 机关警察数(${parseInt(
                  newObj.officePoliceNum
                )})+监区警察数(${parseInt(
                  newObj.jianquPoliceNum
                )})+监狱医院人数(${parseInt(
                  newObj.hospitalPoliceNum
                )})+指挥中心人数(${parseInt(
                  newObj.cmdCenterPoliceNum
                )})+特警队人数(${parseInt(
                  newObj.regimentalPoliceTeamNum
                )})+警示教育基地人数(专职)(${parseInt(
                  newObj.warningEduBasePoliceNum
                )})`
              )
            }
          }

          // 监狱辅警总数校验 （监狱）
          // 监狱辅警总数=男性辅警+女性辅警
          // 监狱辅警总数=监区辅警数+监狱医院辅警数+指挥中心辅警数+特警队辅警数+其它；
          if (
            parseInt(newObj.prisonPoliceNumTwo) ===
              parseInt(newObj.maleAuxiliaryPoliceNum) +
                parseInt(newObj.femaleAuxiliaryPoliceNum) &&
            parseInt(newObj.prisonPoliceNumTwo) ===
              parseInt(newObj.areaAuxiliaryPoliceNum) +
                parseInt(newObj.centerAuxiliaryPoliceNum) +
                parseInt(newObj.prisonHospitalAuxiliaryPoliceNum) +
                parseInt(newObj.swatTeamAuxiliaryPolieNum) +
                parseInt(newObj.elseAuxiliaryPoliceNum)
          ) {
            this.selData.isPrisonPoliceNumTwo = true
          } else {
            this.selData.isPrisonPoliceNumTwo = false
            if (
              parseInt(newObj.prisonPoliceNumTwo) !==
              parseInt(newObj.maleAuxiliaryPoliceNum) +
                parseInt(newObj.femaleAuxiliaryPoliceNum)
            ) {
              this.PoliceNumTwoCheckInfo.push(
                `监狱辅警总数(${parseInt(
                  newObj.prisonPoliceNumTwo
                )})≠ 男性辅警(${parseInt(
                  newObj.maleAuxiliaryPoliceNum
                )})+女性辅警(${parseInt(newObj.femaleAuxiliaryPoliceNum)})`
              )
            }
            if (
              parseInt(newObj.prisonPoliceNumTwo) !==
              parseInt(newObj.areaAuxiliaryPoliceNum) +
                parseInt(newObj.centerAuxiliaryPoliceNum) +
                parseInt(newObj.prisonHospitalAuxiliaryPoliceNum) +
                parseInt(newObj.swatTeamAuxiliaryPolieNum) +
                parseInt(newObj.elseAuxiliaryPoliceNum)
            ) {
              this.PoliceNumTwoCheckInfo.push(
                `监狱辅警总数(${parseInt(
                  newObj.prisonPoliceNumTwo
                )})≠ 监区辅警数(${parseInt(
                  newObj.areaAuxiliaryPoliceNum
                )})+监狱医院辅警数(${parseInt(
                  newObj.prisonHospitalAuxiliaryPoliceNum
                )})+指挥中心辅警数(${parseInt(
                  newObj.centerAuxiliaryPoliceNum
                )})+特警队辅警数(${parseInt(
                  newObj.swatTeamAuxiliaryPolieNum
                )})+其它(${parseInt(newObj.elseAuxiliaryPoliceNum)})`
              )
            }
          }

          // 今日在册罪犯总数校验
          // 今日在册罪犯总数=前一日在册罪犯总数+24小时新增总数（新增1+新增2-调入2-调入3）-24小时减少总数（减少1+减少2-调出1-调出2）
          if (
            parseInt(newObj.registeredCriminalNum) ===
            parseInt(this.lastRegisteredCriminalNum) +
              add1 +
              add2 -
              parseInt(newObj.fromOtherAreaInNum) -
              (reduce1 +
                reduce2 -
                parseInt(newObj.toOtherJianquInProvinceCriminalNum24h))
          ) {
            this.selData.isRegisteredCriminal = true
          } else {
            this.selData.isRegisteredCriminal = false
            this.registeredCriminalNumInfo.push(
              `今日在册罪犯总数(${parseInt(
                newObj.registeredCriminalNum
              )})≠前一日在册罪犯总数(${parseInt(
                this.lastRegisteredCriminalNum
              )})+24小时新增总数（新增1(${parseInt(add1)})+新增2(${parseInt(
                add2
              )})-调入2(${parseInt(
                newObj.fromOtherAreaInNum
              )})）-24小时减少总数（减少1(${parseInt(
                reduce1
              )})+减少2(${parseInt(reduce2)})-调出1(${parseInt(
                newObj.toOtherJianquInProvinceCriminalNum24h
              )})）`
            )
          }

          // 今日在押罪犯总数=前一日在押罪犯总数+24小时新增在押总数（新增2+变化1-调入2-调入3-24小时在押减少总数（减少2+变化2-调出1-调出2）
          if (
            parseInt(newObj.inPrisonTotalCriminalNum) ===
              parseInt(this.lastInPrisonTotalCriminalNum) +
                add2 +
                modify1 -
                parseInt(newObj.fromOtherAreaInNum) -
                (reduce2 +
                  modify2 -
                  parseInt(newObj.toOtherJianquInProvinceCriminalNum24h)) &&
            parseInt(newObj.inPrisonTotalCriminalNum) ===
              parseInt(newObj.slackManageCriminalNum) +
                parseInt(newObj.normalManageCriminalNum) +
                parseInt(newObj.hardManageCriminalNum) +
                parseInt(newObj.noLevelCriminalNum)
          ) {
            this.selData.isInPrisonTotalCriminal = true
          } else {
            this.selData.isInPrisonTotalCriminal = false
            if (
              parseInt(newObj.inPrisonTotalCriminalNum) !==
              parseInt(this.lastInPrisonTotalCriminalNum) +
                add2 +
                modify1 -
                parseInt(newObj.fromOtherAreaInNum) -
                (reduce2 +
                  modify2 -
                  parseInt(newObj.toOtherJianquInProvinceCriminalNum24h))
            ) {
              this.inPrisonTotalCriminalNumInfo.push(
                `今日在押罪犯总数(${parseInt(
                  newObj.inPrisonTotalCriminalNum
                )})≠前一日在押罪犯总数(${parseInt(
                  this.lastInPrisonTotalCriminalNum
                )})+24小时新增总数（新增2(${add2})+变化1(${modify1})-调入2(${parseInt(
                  newObj.fromOtherAreaInNum
                )})）-24小时减少总数（减少2(${reduce2})+变化2(${modify2})-调出1(${parseInt(
                  newObj.toOtherJianquInProvinceCriminalNum24h
                )})）`
              )
            }

            if (
              parseInt(newObj.inPrisonTotalCriminalNum) !==
              parseInt(newObj.slackManageCriminalNum) +
                parseInt(newObj.normalManageCriminalNum) +
                parseInt(newObj.hardManageCriminalNum) +
                parseInt(newObj.noLevelCriminalNum)
            ) {
              this.inPrisonTotalCriminalNumInfo.push(
                `押犯总数(${parseInt(
                  newObj.inPrisonTotalCriminalNum
                )})≠宽管级(${parseInt(
                  newObj.slackManageCriminalNum
                )})+普管级(${parseInt(
                  newObj.normalManageCriminalNum
                )})+严管级(${parseInt(
                  newObj.hardManageCriminalNum
                )})+未定级(${parseInt(newObj.noLevelCriminalNum)})`
              )
            }

            // if (parseInt(newObj.inPrisonTotalCriminalNum) !== parseInt(newObj.drugCriminalNum) + parseInt(newObj.femaleCriminalNum) + parseInt(newObj.foreignCriminalNum) + parseInt(newObj.hivCriminalNum) + parseInt(newObj.dutyCrimeCriminalNum) + parseInt(newObj.nonageCriminalNum) + parseInt(newObj.sheheiCriminalNum) + parseInt(newObj.sheeCriminalNum) + parseInt(newObj.hasMilitaryPoliceTeCriminalNum) + parseInt(newObj.limitReducePrisonTermCriminalNum) + parseInt(newObj.otherCriminalTypeNum)){
            //   this.inPrisonTotalCriminalNumInfo.push(`押犯总数(${parseInt(newObj.inPrisonTotalCriminalNum)})=涉毒罪犯(${parseInt(newObj.drugCriminalNum)})+女犯人数(${parseInt(newObj.femaleCriminalNum)})+外国籍罪犯(${parseInt(newObj.foreignCriminalNum)})+艾滋病犯(${parseInt(newObj.hivCriminalNum)})+职务犯(${parseInt(newObj.dutyCrimeCriminalNum)})+未成年犯(${parseInt(newObj.nonageCriminalNum)})+涉黑犯(${parseInt(newObj.sheheiCriminalNum)})+涉恶犯(${parseInt(newObj.sheeCriminalNum)})+具有军警特经历罪犯(${parseInt(newObj.hasMilitaryPoliceTeCriminalNum)})+限制减刑犯(${parseInt(newObj.limitReducePrisonTermCriminalNum)})+其他(${parseInt(newObj.otherCriminalTypeNum)})`)
            // }
          }
        }

        if (this.isArea) {
          // 警察总数数据校验（监区）
          // 监区警察总数=监区男警+监区女警
          if (
            parseInt(newObj.allPoliceNum) ===
            parseInt(newObj.malePoliceNum) + parseInt(newObj.femalePoliceNum)
          ) {
            this.selData.isAllPolice = true
          } else {
            this.selData.isAllPolice = false
            this.PoliceNumCheckInfo.push(
              `监区警察总数(${parseInt(
                newObj.allPoliceNum
              )})≠ 监区男警(${parseInt(
                newObj.malePoliceNum
              )})+监区女警(${parseInt(newObj.femalePoliceNum)})`
            )
          }

          // 监狱辅警总数校验 （监区）
          // 监区辅警总数=男性辅警+女性辅警；
          if (
            parseInt(newObj.prisonPoliceNumTwo) ===
            parseInt(newObj.maleAuxiliaryPoliceNum) +
              parseInt(newObj.femaleAuxiliaryPoliceNum)
          ) {
            this.selData.isPrisonPoliceNumTwo = true
          } else {
            this.selData.isPrisonPoliceNumTwo = false
            this.PoliceNumTwoCheckInfo.push(
              `监区辅警总数(${parseInt(
                newObj.prisonPoliceNumTwo
              )})≠ 男性辅警(${parseInt(
                newObj.maleAuxiliaryPoliceNum
              )})+女性辅警(${parseInt(newObj.femaleAuxiliaryPoliceNum)})`
            )
          }

          // 今日在册罪犯总数校验
          // 今日在册罪犯总数=前一日在册罪犯总数+24小时新增总数（新增1+新增2）-24小时减少总数（减少1+减少2）
          if (
            parseInt(newObj.registeredCriminalNum) ===
            parseInt(this.lastRegisteredCriminalNum) +
              add1 +
              add2 -
              parseInt(newObj.fromOtherAreaInNum) -
              (reduce1 +
                reduce2 -
                parseInt(newObj.toOtherJianquInProvinceCriminalNum24h))
          ) {
            this.selData.isRegisteredCriminal = true
          } else {
            this.selData.isRegisteredCriminal = false
            this.registeredCriminalNumInfo.push(
              `今日在册罪犯总数(${parseInt(
                newObj.registeredCriminalNum
              )})≠前一日在册罪犯总数(${parseInt(
                this.lastRegisteredCriminalNum
              )})+24小时新增总数（新增1(${parseInt(add1)})+新增2(${parseInt(
                add2
              )})）-24小时减少总数（减少1(${parseInt(
                reduce1
              )})+减少2(${parseInt(reduce2)})）`
            )
          }

          // 今日在押罪犯总数=前一日在押罪犯总数+24小时新增在押总数（新增2+变化1-24小时在押减少总数（减少2+变化2）
          if (
            parseInt(newObj.inPrisonTotalCriminalNum) ===
              parseInt(this.lastInPrisonTotalCriminalNum) +
                add2 +
                modify1 -
                (reduce2 + modify2) &&
            parseInt(newObj.inPrisonTotalCriminalNum) ===
              parseInt(newObj.slackManageCriminalNum) +
                parseInt(newObj.normalManageCriminalNum) +
                parseInt(newObj.hardManageCriminalNum) +
                parseInt(newObj.noLevelCriminalNum)
          ) {
            this.selData.isInPrisonTotalCriminal = true
          } else {
            this.selData.isInPrisonTotalCriminal = false
            if (
              parseInt(newObj.inPrisonTotalCriminalNum) !==
              parseInt(this.lastInPrisonTotalCriminalNum) +
                add2 +
                modify1 -
                (reduce2 + modify2)
            ) {
              this.inPrisonTotalCriminalNumInfo.push(
                `今日在押罪犯总数(${parseInt(
                  newObj.inPrisonTotalCriminalNum
                )})≠前一日在押罪犯总数(${parseInt(
                  this.lastInPrisonTotalCriminalNum
                )})+24小时新增总数（新增2(${add2})+变化1(${modify1})）-24小时减少总数（减少2(${reduce2})+变化2(${modify2})）`
              )
            }

            if (
              parseInt(newObj.inPrisonTotalCriminalNum) !==
              parseInt(newObj.slackManageCriminalNum) +
                parseInt(newObj.normalManageCriminalNum) +
                parseInt(newObj.hardManageCriminalNum) +
                parseInt(newObj.noLevelCriminalNum)
            ) {
              this.inPrisonTotalCriminalNumInfo.push(
                `押犯总数(${parseInt(
                  newObj.inPrisonTotalCriminalNum
                )})≠宽管级(${parseInt(
                  newObj.slackManageCriminalNum
                )})+普管级(${parseInt(
                  newObj.normalManageCriminalNum
                )})+严管级(${parseInt(
                  newObj.hardManageCriminalNum
                )})+未定级(${parseInt(newObj.noLevelCriminalNum)})`
              )
            }

            // if (parseInt(newObj.inPrisonTotalCriminalNum) !== parseInt(newObj.drugCriminalNum) + parseInt(newObj.femaleCriminalNum) + parseInt(newObj.foreignCriminalNum) + parseInt(newObj.hivCriminalNum) + parseInt(newObj.dutyCrimeCriminalNum) + parseInt(newObj.nonageCriminalNum) + parseInt(newObj.sheheiCriminalNum) + parseInt(newObj.sheeCriminalNum) + parseInt(newObj.hasMilitaryPoliceTeCriminalNum) + parseInt(newObj.limitReducePrisonTermCriminalNum) + parseInt(newObj.otherCriminalTypeNum)){
            //   this.inPrisonTotalCriminalNumInfo.push(`押犯总数(${parseInt(newObj.inPrisonTotalCriminalNum)})=涉毒罪犯(${parseInt(newObj.drugCriminalNum)})+女犯人数(${parseInt(newObj.femaleCriminalNum)})+外国籍罪犯(${parseInt(newObj.foreignCriminalNum)})+艾滋病犯(${parseInt(newObj.hivCriminalNum)})+职务犯(${parseInt(newObj.dutyCrimeCriminalNum)})+未成年犯(${parseInt(newObj.nonageCriminalNum)})+涉黑犯(${parseInt(newObj.sheheiCriminalNum)})+涉恶犯(${parseInt(newObj.sheeCriminalNum)})+具有军警特经历罪犯(${parseInt(newObj.hasMilitaryPoliceTeCriminalNum)})+限制减刑犯(${parseInt(newObj.limitReducePrisonTermCriminalNum)})+其他(${parseInt(newObj.otherCriminalTypeNum)})`)
            // }
          }
        }
      },
      deep: true
    },
    date(val) {
      //   this.getForm()
      let info = { prisonId: this.prisonId, date: this.date }
      sessionStorage.setItem('info', JSON.stringify(info))
      if (val.getTime() < new Date().getTime()) {
        this.selIsReport()
      } else {
        this.date = new Date()
      }
      //   let str =
      //     formatDate(new Date(this.date), 'yyyy-MM-dd') +
      //     '/' +
      //     this.prisonId +
      //     '?isDept=' +
      //     this.isArea +
      //     '&deptId=' +
      //     this.deptId
      //   this.loading = true
      //   selIsReport(str).then(res => {
      //     this.isReport = res > 0
      //     this.upState = res
      //     if (this.isReport) {
      //       this.cheackFlag = true
      //       this.getForm()
      //     } else {
      //       this.cheackFlag = this.checkTime()
      //       let data =
      //         formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss') +
      //         '/' +
      //         this.prisonId +
      //         '/' +
      //         this.deptId
      //       selPermission(data).then(res => {
      //         if (res == 0) {
      //           this.permission = false
      //         } else {
      //           this.permission = true
      //           this.cheackFlag = false
      //           clearInterval(this.dataTimer)
      //           this.dataTimer = null
      //         }
      //         this.loading = false
      //       })
      //     }
      //     this.getDIYList()
      //   })
    }
  },
  beforeDestroy() {
    clearInterval(this.dataTimer)
    this.dataTimer = null
    sessionStorage.clear()
  }
}
</script>
<style lang="less" scoped>
@import './center.less';
.pages {
  height: calc(100vh - 30rem);
}
</style>
