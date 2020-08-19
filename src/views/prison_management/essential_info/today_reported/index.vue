<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-29 11:11:38
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-02 11:46:22
 -->

<template>
  <div :class="cheackFlag?'':'history_box'">
    <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
      <menuTree :menuList="['监狱管理','值班管理','基本数据','数据上报']" />

      <div class="yn_page_title">{{cheackFlag?'上报表单填写':'历史上报查看'}}</div>
      <div>
        <el-button
          class="yn_btn btn_pad head_btn"
          v-if="userPrisonId!=1"
          type="primary"
          @click="topage"
        >基本数据管理</el-button>
      </div>
      <!-- <el-switch
        v-if="userPrisonId!=1"
        v-model="cheackFlag"
        active-text="打开上报"
        inactive-text="查看历史"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="switchChange"
      ></el-switch> -->
      <div class="time_box" v-if="!cheackFlag">
        <div>选择查看日期</div>
        <el-date-picker
          class="yn_ipt yn_date_picker"
          v-model="date"
          type="date"
          placeholder="开始日期"
          value-format="timestamp"
          :clearable="false"
          :picker-options="{
              disabledDate(date){
                return  new Date(date).getTime()>new Date().getTime()
              }
          }"
        ></el-date-picker>
        <el-button class="yn_btn btn_pad" type="primary" @click="select">查询</el-button>
        <el-button class="yn_btn btn_pad" v-if="userPrisonId==1" @click="backpage">返回</el-button>
      </div>
      <div class="btn_box" v-if="cheackFlag">
        <el-button class="yn_btn" type="primary" @click="submit">上报</el-button>
      </div>
      <!-- 值班情况 -->
      <!-- <div class="moudek_head">
      <i class="el-icon-postcard icon_img"></i>

      <div class="head_name">值班情况</div>
      </div>-->

      <!-- <table class="police_table" rules="all" cellpadding="10">
      <tr>
        <th>在岗警察数</th>
        <td colspan="3">
          <el-input
            v-model="formData.activePoliceNum"
            :disabled="!cheackFlag"
            class="yn_ipt table_ipt"
            placeholder="在岗警察数"
          ></el-input>
        </td>
      </tr>
      <tr>
        <th>监狱值班警察数</th>

        <td>
          <el-input
            v-model="formData.dutyPrisonNum"
            :disabled="!cheackFlag"
            class="yn_ipt table_ipt"
            placeholder="监狱值班警察数"
          ></el-input>
        </td>
        <th>夜间值班警察数</th>

        <td>
          <el-input
            v-model="formData.nightDutyPoliceNum"
            :disabled="!cheackFlag"
            class="yn_ipt table_ipt"
            placeholder="夜间值班警察数"
          ></el-input>
        </td>
      </tr>

      <tr>
        <th>夜间备勤警察数</th>
        <td colspan="3">
          <el-input
            v-model="formData.nightSubstitutePoliceNum"
            :disabled="!cheackFlag"
            class="yn_ipt table_ipt"
            placeholder="夜间备勤警察数"
          ></el-input>
        </td>
      </tr>
      </table>-->

      <!-- 警察基本情况 -->
      <div class="moudek_head">
        <i class="el-icon-postcard icon_img"></i>

        <div class="head_name">警察基本情况</div>
      </div>

      <table class="police_table" rules="all" cellpadding="10">
        <tr>
          <th rowspan="5">
            <el-popover placement="top" trigger="hover" :disabled="cheackFlag">
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">前一日上报</td>
                </tr>

                <tr>
                  <th rowspan="5">警察总数</th>
                  <td rowspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.activePoliceNum}}/</div>
                      <el-input
                        v-model="lastAllPoliceNum"
                        :disabled="true"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <th rowspan="2">其中</th>
                  <td>监狱男警</td>
                  <td colspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.malePoliceNum}}/</div>
                      <el-input
                        v-model="lastformData.malePoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>监狱女警</td>
                  <td colspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.femalePoliceNum}}/</div>
                      <el-input
                        v-model="lastformData.femalePoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th rowspan="3">其中</th>
                  <td>机关警察数</td>
                  <td>
                    <el-input
                      v-model="lastformData.officePoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>监区警察数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.jianquPoliceNum}}/</div>
                      <el-input
                        v-model="lastformData.jianquPoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>监狱医院人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.hospitalPoliceNum}}/</div>
                      <el-input
                        v-model="lastformData.hospitalPoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>指挥中心人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.cmdCenterPoliceNum}}/</div>
                      <el-input
                        v-model="lastformData.cmdCenterPoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>特警队人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.regimentalPoliceTeamNum}}/</div>
                      <el-input
                        v-model="lastformData.regimentalPoliceTeamNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>警示教育基地人数</td>
                  <td>
                    <el-input
                      v-model="lastformData.warningEduBasePoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>长期在编不在岗人员</td>
                  <td colspan="5">
                    <el-input
                      v-model="lastformData.alwaysOffDutyPoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">本日上报</td>
                </tr>
                <tr>
                  <th rowspan="5">警察总数</th>
                  <td rowspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.activePoliceNum}}/</div>
                      <el-input
                        v-model="allPoliceNum"
                        :disabled="true"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <th rowspan="2">其中</th>
                  <td>监狱男警</td>
                  <td colspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.malePoliceNum}}/</div>
                      <el-input
                        v-model="formData.malePoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>监狱女警</td>
                  <td colspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.femalePoliceNum}}/</div>
                      <el-input
                        v-model="formData.femalePoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th rowspan="3">其中</th>
                  <td>机关警察数</td>
                  <td>
                    <el-input
                      v-model="formData.officePoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>监区警察数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.jianquPoliceNum}}/</div>
                      <el-input
                        v-model="formData.jianquPoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>监狱医院人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.hospitalPoliceNum}}/</div>
                      <el-input
                        v-model="formData.hospitalPoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>指挥中心人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.cmdCenterPoliceNum}}/</div>
                      <el-input
                        v-model="formData.cmdCenterPoliceNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>特警队人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.regimentalPoliceTeamNum}}/</div>
                      <el-input
                        v-model="formData.regimentalPoliceTeamNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>警示教育基地人数</td>
                  <td>
                    <el-input
                      v-model="formData.warningEduBasePoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>长期在编不在岗人员</td>
                  <td colspan="5">
                    <el-input
                      v-model="formData.alwaysOffDutyPoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <div slot="reference">警察总数</div>
            </el-popover>
          </th>
          <td rowspan="5">
            <div class="td_box">
              <div class="sql_num">{{SqlData.activePoliceNum}}/</div>
              <el-input
                v-model="allPoliceNum"
                :disabled="true"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <th rowspan="2">其中</th>
          <td>监狱男警</td>
          <td colspan="5">
            <div class="td_box">
              <div class="sql_num">{{SqlData.malePoliceNum}}/</div>
              <el-input
                v-model="formData.malePoliceNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>
        <tr>
          <td>监狱女警</td>
          <td colspan="5">
            <div class="td_box">
              <div class="sql_num">{{SqlData.femalePoliceNum}}/</div>
              <el-input
                v-model="formData.femalePoliceNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>

        <tr>
          <th rowspan="3">其中</th>
          <td>机关警察数</td>
          <td>
            <el-input
              v-model="formData.officePoliceNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>监区警察数</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.jianquPoliceNum}}/</div>
              <el-input
                v-model="formData.jianquPoliceNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>监狱医院人数</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.hospitalPoliceNum}}/</div>
              <el-input
                v-model="formData.hospitalPoliceNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>

        <tr>
          <td>指挥中心人数</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.cmdCenterPoliceNum}}/</div>
              <el-input
                v-model="formData.cmdCenterPoliceNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>特警队人数</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.regimentalPoliceTeamNum}}/</div>
              <el-input
                v-model="formData.regimentalPoliceTeamNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>警示教育基地人数</td>
          <td>
            <el-input
              v-model="formData.warningEduBasePoliceNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>

        <tr>
          <td>长期在编不在岗人员</td>
          <td colspan="5">
            <el-input
              v-model="formData.alwaysOffDutyPoliceNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
      </table>
      <!-- 三岗（辅警）人员情况 -->
      <div class="moudek_head">
        <i class="el-icon-postcard icon_img"></i>

        <div class="head_name">三岗（辅警）人员情况</div>
      </div>

      <table class="police_table" rules="all" cellpadding="10">
        <tr>
          <th rowspan="2">
            <el-popover placement="top" trigger="hover" :disabled="cheackFlag">
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="5">前一日上报</td>
                </tr>
                <tr>
                  <th rowspan="2">三岗（辅警）人员情况</th>
                  <td>男性人数</td>
                  <td>
                    <el-input
                      v-model="lastformData.maleAuxiliaryPoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>女性人数</td>
                  <td>
                    <el-input
                      v-model="lastformData.femaleAuxiliaryPoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>值班人数</td>
                  <td>
                    <el-input
                      v-model="lastformData.auxiliaryPoliceDutyNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>备勤人数</td>
                  <td>
                    <el-input
                      v-model="lastformData.auxiliaryPoliceSubstituteNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>

              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="5">本日上报</td>
                </tr>
                <tr>
                  <th rowspan="2">三岗（辅警）人员情况</th>
                  <td>男性人数</td>
                  <td>
                    <el-input
                      v-model="formData.maleAuxiliaryPoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>女性人数</td>
                  <td>
                    <el-input
                      v-model="formData.femaleAuxiliaryPoliceNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>值班人数</td>
                  <td>
                    <el-input
                      v-model="formData.auxiliaryPoliceDutyNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>备勤人数</td>
                  <td>
                    <el-input
                      v-model="formData.auxiliaryPoliceSubstituteNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <div slot="reference">三岗（辅警）人员情况</div>
            </el-popover>
          </th>
          <td>男性人数</td>
          <td>
            <el-input
              v-model="formData.maleAuxiliaryPoliceNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>女性人数</td>
          <td>
            <el-input
              v-model="formData.femaleAuxiliaryPoliceNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>值班人数</td>
          <td>
            <el-input
              v-model="formData.auxiliaryPoliceDutyNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>备勤人数</td>
          <td>
            <el-input
              v-model="formData.auxiliaryPoliceSubstituteNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
      </table>

      <!-- 罪犯基本情况 -->
      <div class="moudek_head">
        <i class="el-icon-postcard icon_img"></i>

        <div class="head_name">罪犯基本情况</div>
      </div>

      <table class="police_table" rules="all" cellpadding="10">
        <tr>
          <th>监狱在册犯人总数</th>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.registeredCriminalNum}}/</div>
              <el-input
                v-model="formData.registeredCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <th>其中</th>
          <td>暂予监外执行（含保外就医）</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.temporaryOutsidePrisonCriminalNum}}/</div>
              <el-input
                v-model="formData.temporaryOutsidePrisonCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>历年在逃</td>
          <td colspan="4">
            <el-input
              v-model="formData.longTimeEscapeCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>

        <tr>
          <th rowspan="6">
            <el-popover placement="top" trigger="hover" :disabled="cheackFlag">
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="10">上一日上报</td>
                </tr>
                <tr>
                  <th>监狱在册犯人总数</th>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.registeredCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.registeredCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <th>其中</th>
                  <td>暂予监外执行（含保外就医）</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.temporaryOutsidePrisonCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.temporaryOutsidePrisonCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>历年在逃</td>
                  <td colspan="4">
                    <el-input
                      v-model="lastformData.longTimeEscapeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <th rowspan="6">监狱在押犯人总数</th>
                  <td rowspan="6">
                    <el-input
                      v-model="lastformData.inPrisonTotalCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <th rowspan="4">其中</th>
                  <td rowspan="2">劳动数</td>
                  <td rowspan="2">
                    <el-input
                      v-model="lastformData.laborCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td rowspan="2">留监数</td>
                  <td>学习数</td>
                  <td>
                    <el-input
                      v-model="lastformData.criminalStudyNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td rowspan="2">禁闭/隔离</td>
                  <td rowspan="2">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.lockDownCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.lockDownCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>休息数</td>
                  <td>
                    <el-input
                      v-model="lastformData.criminalRestNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>狱内住院</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.beHospitalInPrisonCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.beHospitalInPrisonCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>局中心住院</td>
                  <td colspan="2">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.juCenterInHospitalCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.juCenterInHospitalCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>住社会医院</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.inSocietyHospitalCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.inSocietyHospitalCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>其他</td>
                  <td colspan="6">
                    <el-input
                      v-model="lastformData.otherCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <th rowspan="2">其中</th>
                  <td>宽管级罪犯</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.slackManageCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.slackManageCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>普管级罪犯</td>
                  <td colspan="2">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.normalManageCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.normalManageCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>严管级罪犯</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.hardManageCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.hardManageCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>未定级罪犯</td>
                  <td colspan="6">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.noLevelCriminalNum}}/</div>
                      <el-input
                        v-model="lastformData.noLevelCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
              </table>
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="10">本日上报</td>
                </tr>
                <tr>
                  <th>监狱在册犯人总数</th>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.registeredCriminalNum}}/</div>
                      <el-input
                        v-model="formData.registeredCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <th>其中</th>
                  <td>暂予监外执行（含保外就医）</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.temporaryOutsidePrisonCriminalNum}}/</div>
                      <el-input
                        v-model="formData.temporaryOutsidePrisonCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>历年在逃</td>
                  <td colspan="4">
                    <el-input
                      v-model="formData.longTimeEscapeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <th rowspan="6">监狱在押犯人总数</th>
                  <td rowspan="6">
                    <el-input
                      v-model="formData.inPrisonTotalCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <th rowspan="4">其中</th>
                  <td rowspan="2">劳动数</td>
                  <td rowspan="2">
                    <el-input
                      v-model="formData.laborCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td rowspan="2">留监数</td>
                  <td>学习数</td>
                  <td>
                    <el-input
                      v-model="formData.criminalStudyNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td rowspan="2">禁闭/隔离</td>
                  <td rowspan="2">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.lockDownCriminalNum}}/</div>
                      <el-input
                        v-model="formData.lockDownCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>休息数</td>
                  <td>
                    <el-input
                      v-model="formData.criminalRestNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>狱内住院</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.beHospitalInPrisonCriminalNum}}/</div>
                      <el-input
                        v-model="formData.beHospitalInPrisonCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>局中心住院</td>
                  <td colspan="2">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.juCenterInHospitalCriminalNum}}/</div>
                      <el-input
                        v-model="formData.juCenterInHospitalCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>住社会医院</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.inSocietyHospitalCriminalNum}}/</div>
                      <el-input
                        v-model="formData.inSocietyHospitalCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>其他</td>
                  <td colspan="6">
                    <el-input
                      v-model="formData.otherCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <th rowspan="2">其中</th>
                  <td>宽管级罪犯</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.slackManageCriminalNum}}/</div>
                      <el-input
                        v-model="formData.slackManageCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>普管级罪犯</td>
                  <td colspan="2">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.normalManageCriminalNum}}/</div>
                      <el-input
                        v-model="formData.normalManageCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>严管级罪犯</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.hardManageCriminalNum}}/</div>
                      <el-input
                        v-model="formData.hardManageCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>未定级罪犯</td>
                  <td colspan="6">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.noLevelCriminalNum}}/</div>
                      <el-input
                        v-model="formData.noLevelCriminalNum"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>
              </table>
              <div slot="reference">监狱在押犯人总数</div>
            </el-popover>
          </th>
          <td rowspan="6">
            <el-input
              v-model="formData.inPrisonTotalCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <th rowspan="4">其中</th>
          <td rowspan="2">劳动数</td>
          <td rowspan="2">
            <el-input
              v-model="formData.laborCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td rowspan="2">留监数</td>
          <td>学习数</td>
          <td>
            <el-input
              v-model="formData.criminalStudyNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td rowspan="2">禁闭/隔离</td>
          <td rowspan="2">
            <div class="td_box">
              <div class="sql_num">{{SqlData.lockDownCriminalNum}}/</div>
              <el-input
                v-model="formData.lockDownCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>
        <tr>
          <td>休息数</td>
          <td>
            <el-input
              v-model="formData.criminalRestNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>狱内住院</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.beHospitalInPrisonCriminalNum}}/</div>
              <el-input
                v-model="formData.beHospitalInPrisonCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>局中心住院</td>
          <td colspan="2">
            <div class="td_box">
              <div class="sql_num">{{SqlData.juCenterInHospitalCriminalNum}}/</div>
              <el-input
                v-model="formData.juCenterInHospitalCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>住社会医院</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.inSocietyHospitalCriminalNum}}/</div>
              <el-input
                v-model="formData.inSocietyHospitalCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>
        <tr>
          <td>其他</td>
          <td colspan="6">
            <el-input
              v-model="formData.otherCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>

        <tr>
          <th rowspan="2">其中</th>
          <td>宽管级罪犯</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.slackManageCriminalNum}}/</div>
              <el-input
                v-model="formData.slackManageCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>普管级罪犯</td>
          <td colspan="2">
            <div class="td_box">
              <div class="sql_num">{{SqlData.normalManageCriminalNum}}/</div>
              <el-input
                v-model="formData.normalManageCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>严管级罪犯</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.hardManageCriminalNum}}/</div>
              <el-input
                v-model="formData.hardManageCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>

        <tr>
          <td>未定级罪犯</td>
          <td colspan="6">
            <div class="td_box">
              <div class="sql_num">{{SqlData.noLevelCriminalNum}}/</div>
              <el-input
                v-model="formData.noLevelCriminalNum"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>
      </table>

      <!-- 罪犯变动情况 -->
      <div class="moudek_head">
        <i class="el-icon-postcard icon_img"></i>

        <div class="head_name">罪犯变动情况</div>
      </div>

      <table class="police_table" rules="all" cellpadding="10">
        <tr>
          <th rowspan="3">
            <el-popover placement="top" trigger="hover" :disabled="cheackFlag">
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="7">前一日上报</td>
                </tr>
                <tr>
                  <th rowspan="3">24小时内增加总数</th>
                  <td rowspan="3">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.addCriminalTotal24h}}/</div>
                      <el-input
                        v-model="lastformData.addCriminalTotal24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <th rowspan="3">其中</th>
                  <td>新收押</td>
                  <td>
                    <el-input
                      v-model="lastformData.newCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>其他（含从省外调入）</td>
                  <td colspan="3">
                    <el-input
                      v-model="lastformData.otherAddCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>从省内其他监狱调入</td>
                  <td colspan="5">
                    <el-input
                      v-model="lastformData.fromOtherPrisonInProvinceAddCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>从省内其他监区调入</td>
                  <td colspan="5">
                    <el-input
                      v-model="lastformData.fromOtherJianquInProvinceAddCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="7">本日上报</td>
                </tr>
                <tr>
                  <th rowspan="3">24小时内增加总数</th>
                  <td rowspan="3">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.addCriminalTotal24h}}/</div>
                      <el-input
                        v-model="formData.addCriminalTotal24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <th rowspan="3">其中</th>
                  <td>新收押</td>
                  <td>
                    <el-input
                      v-model="formData.newCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>其他（含从省外调入）</td>
                  <td colspan="3">
                    <el-input
                      v-model="formData.otherAddCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>从省内其他监狱调入</td>
                  <td colspan="5">
                    <el-input
                      v-model="formData.fromOtherPrisonInProvinceAddCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>从省内其他监区调入</td>
                  <td colspan="5">
                    <el-input
                      v-model="formData.fromOtherJianquInProvinceAddCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <div slot="reference">24小时内增加总数</div>
            </el-popover>
          </th>
          <td rowspan="3">
            <div class="td_box">
              <div class="sql_num">{{SqlData.addCriminalTotal24h}}/</div>
              <el-input
                v-model="formData.addCriminalTotal24h"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <th rowspan="3">其中</th>
          <td>新收押</td>
          <td>
            <el-input
              v-model="formData.newCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>其他（含从省外调入）</td>
          <td colspan="3">
            <el-input
              v-model="formData.otherAddCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>从省内其他监狱调入</td>
          <td colspan="5">
            <el-input
              v-model="formData.fromOtherPrisonInProvinceAddCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>从省内其他监区调入</td>
          <td colspan="5">
            <el-input
              v-model="formData.fromOtherJianquInProvinceAddCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
      </table>

      <table class="police_table" rules="all" cellpadding="10">
        <tr>
          <th rowspan="5">
            <el-popover placement="top" trigger="hover" :disabled="cheackFlag">
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">前一日上报</td>
                </tr>
                <tr>
                  <th rowspan="5">24小时内减少总数</th>
                  <td rowspan="5">
                    <el-input
                      v-model="lastformData.reduceCriminalTotal24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <th rowspan="5">其中</th>
                  <td>一般刑释</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.normalReleaseCriminalNum24h}}/</div>
                      <el-input
                        v-model="lastformData.normalReleaseCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>暂予监外刑释</td>
                  <td>
                    <el-input
                      v-model="lastformData.temporaryOutsidePrisonCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>假释</td>
                  <td>
                    <el-input
                      v-model="lastformData.releaseOnParoleCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>死亡</td>
                  <td colspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.dieCriminalNum24h}}/</div>
                      <el-input
                        v-model="lastformData.dieCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>调往省内其他监狱</td>
                  <td colspan="5">
                    <el-input
                      v-model="lastformData.toOtherPrisonInProvinceCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>调往狱内其他监区</td>
                  <td colspan="5">
                    <el-input
                      v-model="lastformData.toOtherJianquInProvinceCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>其他（含调往省外）</td>
                  <td colspan="5">
                    <el-input
                      v-model="lastformData.otherReduceCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">本日上报</td>
                </tr>
                <tr>
                  <th rowspan="5">24小时内减少总数</th>
                  <td rowspan="5">
                    <el-input
                      v-model="formData.reduceCriminalTotal24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <th rowspan="5">其中</th>
                  <td>一般刑释</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.normalReleaseCriminalNum24h}}/</div>
                      <el-input
                        v-model="formData.normalReleaseCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>暂予监外刑释</td>
                  <td>
                    <el-input
                      v-model="formData.temporaryOutsidePrisonCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>假释</td>
                  <td>
                    <el-input
                      v-model="formData.releaseOnParoleCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>死亡</td>
                  <td colspan="5">
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.dieCriminalNum24h}}/</div>
                      <el-input
                        v-model="formData.dieCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>调往省内其他监狱</td>
                  <td colspan="5">
                    <el-input
                      v-model="formData.toOtherPrisonInProvinceCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>调往狱内其他监区</td>
                  <td colspan="5">
                    <el-input
                      v-model="formData.toOtherJianquInProvinceCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>其他（含调往省外）</td>
                  <td colspan="5">
                    <el-input
                      v-model="formData.otherReduceCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <div slot="reference">24小时内减少总数</div>
            </el-popover>
          </th>
          <td rowspan="5">
            <el-input
              v-model="formData.reduceCriminalTotal24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <th rowspan="5">其中</th>
          <td>一般刑释</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.normalReleaseCriminalNum24h}}/</div>
              <el-input
                v-model="formData.normalReleaseCriminalNum24h"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>暂予监外刑释</td>
          <td>
            <el-input
              v-model="formData.temporaryOutsidePrisonCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>假释</td>
          <td>
            <el-input
              v-model="formData.releaseOnParoleCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>死亡</td>
          <td colspan="5">
            <div class="td_box">
              <div class="sql_num">{{SqlData.dieCriminalNum24h}}/</div>
              <el-input
                v-model="formData.dieCriminalNum24h"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
        </tr>

        <tr>
          <td>调往省内其他监狱</td>
          <td colspan="5">
            <el-input
              v-model="formData.toOtherPrisonInProvinceCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>

        <tr>
          <td>调往狱内其他监区</td>
          <td colspan="5">
            <el-input
              v-model="formData.toOtherJianquInProvinceCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>其他（含调往省外）</td>
          <td colspan="5">
            <el-input
              v-model="formData.otherReduceCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
      </table>

      <table class="police_table" rules="all" cellpadding="10">
        <tr>
          <th rowspan="3">
            <el-popover placement="top" trigger="hover" :disabled="cheackFlag">
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">前一日上报</td>
                </tr>
                <tr>
                  <th rowspan="3">24小时内其他情况</th>
                  <td rowspan="3">
                    <el-input
                      v-model="lastformData.otherCriminalChangeTotal24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <th rowspan="3">其中</th>
                  <td>外出就医</td>
                  <td>
                    <el-input
                      v-model="lastformData.medicalParoleCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>特许离监</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.specialPermissionOutPrisonCriminalNum24h}}/</div>
                      <el-input
                        v-model="lastformData.specialPermissionOutPrisonCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>捕回在逃</td>
                  <td>
                    <el-input
                      v-model="lastformData.catchBackCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>新增禁闭/隔离人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.newLockDownCriminalNum24h}}/</div>
                      <el-input
                        v-model="lastformData.newLockDownCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>解除禁闭/隔离人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{lastSqlData.relieveLockDownCriminalNum24h}}/</div>
                      <el-input
                        v-model="lastformData.relieveLockDownCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>罪犯违纪违规人数</td>
                  <td>
                    <el-input
                      v-model="lastformData.illegalCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>新增暂予监外执行</td>
                  <td>
                    <div class="td_box">
                      <!-- <div class="sql_num">{{lastSqlData.newTemporaryOutsidePrisonCriminalNum24h}}/</div> -->
                      <el-input
                        v-model="lastformData.newTemporaryOutsidePrisonCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>其他</td>
                  <td colspan="3">
                    <el-input
                      v-model="lastformData.otherCriminalNumChange24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">本日上报</td>
                </tr>
                <tr>
                  <th rowspan="3">24小时内其他情况</th>
                  <td rowspan="3">
                    <el-input
                      v-model="formData.otherCriminalChangeTotal24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <th rowspan="3">其中</th>
                  <td>外出就医</td>
                  <td>
                    <el-input
                      v-model="formData.medicalParoleCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>特许离监</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.specialPermissionOutPrisonCriminalNum24h}}/</div>
                      <el-input
                        v-model="formData.specialPermissionOutPrisonCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>捕回在逃</td>
                  <td>
                    <el-input
                      v-model="formData.catchBackCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
                <tr>
                  <td>新增禁闭/隔离人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.newLockDownCriminalNum24h}}/</div>
                      <el-input
                        v-model="formData.newLockDownCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>解除禁闭/隔离人数</td>
                  <td>
                    <div class="td_box">
                      <div class="sql_num">{{SqlData.relieveLockDownCriminalNum24h}}/</div>
                      <el-input
                        v-model="formData.relieveLockDownCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>罪犯违纪违规人数</td>
                  <td>
                    <el-input
                      v-model="formData.illegalCriminalNum24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>新增暂予监外执行</td>
                  <td>
                    <div class="td_box">
                      <!-- <div class="sql_num">{{SqlData.newTemporaryOutsidePrisonCriminalNum24h}}/</div> -->
                      <el-input
                        v-model="formData.newTemporaryOutsidePrisonCriminalNum24h"
                        :disabled="!cheackFlag"
                        class="yn_ipt table_ipt"
                        placeholder="0"
                      ></el-input>
                    </div>
                  </td>
                  <td>其他</td>
                  <td colspan="3">
                    <el-input
                      v-model="formData.otherCriminalNumChange24h"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <div slot="reference">24小时内其他情况</div>
            </el-popover>
          </th>
          <td rowspan="3">
            <el-input
              v-model="formData.otherCriminalChangeTotal24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <th rowspan="3">其中</th>
          <td>外出就医</td>
          <td>
            <el-input
              v-model="formData.medicalParoleCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>特许离监</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.specialPermissionOutPrisonCriminalNum24h}}/</div>
              <el-input
                v-model="formData.specialPermissionOutPrisonCriminalNum24h"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>捕回在逃</td>
          <td>
            <el-input
              v-model="formData.catchBackCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>新增禁闭/隔离人数</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.newLockDownCriminalNum24h}}/</div>
              <el-input
                v-model="formData.newLockDownCriminalNum24h"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>解除禁闭/隔离人数</td>
          <td>
            <div class="td_box">
              <div class="sql_num">{{SqlData.relieveLockDownCriminalNum24h}}/</div>
              <el-input
                v-model="formData.relieveLockDownCriminalNum24h"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>罪犯违纪违规人数</td>
          <td>
            <el-input
              v-model="formData.illegalCriminalNum24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>

        <tr>
          <td>新增暂予监外执行</td>
          <td>
            <div class="td_box">
              <!-- <div class="sql_num">{{SqlData.newTemporaryOutsidePrisonCriminalNum24h}}/</div> -->
              <el-input
                v-model="formData.newTemporaryOutsidePrisonCriminalNum24h"
                :disabled="!cheackFlag"
                class="yn_ipt table_ipt"
                placeholder="0"
              ></el-input>
            </div>
          </td>
          <td>其他</td>
          <td colspan="3">
            <el-input
              v-model="formData.otherCriminalNumChange24h"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
      </table>

      <!-- 押犯类型 -->
      <div class="moudek_head">
        <i class="el-icon-postcard icon_img"></i>

        <div class="head_name">押犯类型</div>
      </div>

      <table class="police_table" rules="all" cellpadding="10">
        <tr>
          <td rowspan="3">
            <el-popover placement="top" trigger="hover" :disabled="cheackFlag">
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">前一日上报</td>
                </tr>
                <tr>
                  <td>涉毒罪犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.drugCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>女犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.femaleCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>外国籍罪犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.foreignCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>艾滋病罪犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.hivCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>职务犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.dutyCrimeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>未成年犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.nonageCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>涉黑犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.sheheiCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>涉恶犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.sheeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>具有军、警、特经历罪犯</td>
                  <td>
                    <el-input
                      v-model="lastformData.hasMilitaryPoliceTeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>限制减刑犯</td>
                  <td colspan="5">
                    <el-input
                      v-model="lastformData.limitReducePrisonTermCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <table class="police_table" rules="all" cellpadding="10">
                <tr>
                  <td colspan="9">本日上报</td>
                </tr>
                <tr>
                  <td>涉毒罪犯</td>
                  <td>
                    <el-input
                      v-model="formData.drugCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>女犯</td>
                  <td>
                    <el-input
                      v-model="formData.femaleCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>外国籍罪犯</td>
                  <td>
                    <el-input
                      v-model="formData.foreignCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>艾滋病罪犯</td>
                  <td>
                    <el-input
                      v-model="formData.hivCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>职务犯</td>
                  <td>
                    <el-input
                      v-model="formData.dutyCrimeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>未成年犯</td>
                  <td>
                    <el-input
                      v-model="formData.nonageCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>涉黑犯</td>
                  <td>
                    <el-input
                      v-model="formData.sheheiCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>涉恶犯</td>
                  <td>
                    <el-input
                      v-model="formData.sheeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td>具有军、警、特经历罪犯</td>
                  <td>
                    <el-input
                      v-model="formData.hasMilitaryPoliceTeCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                  <td>限制减刑犯</td>
                  <td colspan="5">
                    <el-input
                      v-model="formData.limitReducePrisonTermCriminalNum"
                      :disabled="!cheackFlag"
                      class="yn_ipt table_ipt"
                      placeholder="0"
                    ></el-input>
                  </td>
                </tr>
              </table>
              <div slot="reference">押犯类型</div>
            </el-popover>
          </td>

          <td>涉毒罪犯</td>
          <td>
            <el-input
              v-model="formData.drugCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>女犯</td>
          <td>
            <el-input
              v-model="formData.femaleCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>外国籍罪犯</td>
          <td>
            <el-input
              v-model="formData.foreignCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>艾滋病罪犯</td>
          <td>
            <el-input
              v-model="formData.hivCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>

        <tr>
          <td>职务犯</td>
          <td>
            <el-input
              v-model="formData.dutyCrimeCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>未成年犯</td>
          <td>
            <el-input
              v-model="formData.nonageCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>涉黑犯</td>
          <td>
            <el-input
              v-model="formData.sheheiCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>涉恶犯</td>
          <td>
            <el-input
              v-model="formData.sheeCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>

        <tr>
          <td>具有军、警、特经历罪犯</td>
          <td>
            <el-input
              v-model="formData.hasMilitaryPoliceTeCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
          <td>限制减刑犯</td>
          <td colspan="5">
            <el-input
              v-model="formData.limitReducePrisonTermCriminalNum"
              :disabled="!cheackFlag"
              class="yn_ipt table_ipt"
              placeholder="0"
            ></el-input>
          </td>
        </tr>
      </table>

      <!-- 监狱动态 -->
      <!-- <div class="moudek_head">
      <i class="el-icon-postcard icon_img"></i>

      <div class="head_name">监狱动态</div>
    </div>

    <table class="police_table" rules="all" cellpadding="10">
      <tr>
        <td colspan="3">进出外来（协）人员总数</td>
        <td>
          <el-input
            v-model="formData"
            :disabled="!cheackFlag"
            class="yn_ipt table_ipt"
            placeholder="进出外来（协）人员总数"
          ></el-input>
        </td>
        <td colspan="3">进出外来车辆总数</td>
        <td colspan="2">
          <el-input
            v-model="formData"
            :disabled="!cheackFlag"
            class="yn_ipt table_ipt"
            placeholder="进出外来车辆总数"
          ></el-input>
        </td>
      </tr>

      <tr>
        <td rowspan="2">组织警示教育</td>
        <td>批次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="批次"></el-input>
        </td>
        <td rowspan="2">入监开展社会帮教及亲情帮教</td>
        <td>批次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="批次"></el-input>
        </td>
        <td rowspan="2">接受社会帮教及亲情帮教罪犯</td>
        <td>批次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="批次"></el-input>
        </td>
      </tr>

      <tr>
        <td>人数</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="人数"></el-input>
        </td>
        <td>人数</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="人数"></el-input>
        </td>
        <td>人次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="人次"></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="2">开展法律援助</td>
        <td>批次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="批次"></el-input>
        </td>
        <td rowspan="2">接受法律援助罪犯</td>
        <td>批次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="批次"></el-input>
        </td>
        <td rowspan="2">就业推荐会</td>
        <td>批次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="批次"></el-input>
        </td>
      </tr>

      <tr>
        <td>人数</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="人数"></el-input>
        </td>
        <td>人次</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="人数"></el-input>
        </td>
        <td>人数</td>
        <td>
          <el-input v-model="num" :disabled="!cheackFlag" class="yn_ipt table_ipt" placeholder="人次"></el-input>
        </td>
      </tr>
      </table>-->
    </dept-layout>
  </div>
</template>

<script>
import { getPrisonId } from '@/utils'
import deptLayout from '@/components/deptLayout/index.vue'
import menuTree from '@/components/menu_tree/'
let time = new Date().getTime()
let day = time - (time % (24 * 60 * 60 * 1000)) - 8 * 60 * 60 * 1000
let yesterday = day - 24 * 3600 * 1000

export default {
  data() {
    return {
      date: yesterday,
      cheackFlag: false,
      num: '',
      formData: {},
      lastformData: {},
      SqlData: {},
      lastSqlData: {},
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId()
    }
  },
  components: { menuTree, deptLayout },
  created() {
    if (this.$route.params.prisonId) {
      this.cheackFlag = this.$route.params.type
      this.prisonId = this.$route.params.prisonId
    }
    console.log(this.$route.params)

    if (!this.cheackFlag) {
      this.select()
    }
    this.getSqlData()
  },
  methods: {
    switchChange(val) {
      if (!val) {
        this.select()
        this.getSqlData()
      }
    },
    nodeClick(val) {
      this.prisonId = val.id
      this.getSqlData()
    },
    topage() {
      this.$router.push({ name: 'police_management' })
    },
    backpage() {
      this.$router.back(-1)
    },
    getSqlData() {
      this.SqlData = {}
      this.lastSqlData = {}
      let lastDate = this.date - 24 * 3600 * 1000
      this.axios
        .get(
          this._global.businessUrl +
            '/dataReport/database/' +
            this.prisonId +
            '/' +
            this.date
        )
        .then(res => {
          if (res) {
            this.SqlData = res.data
            console.log(this.SqlData)
          }
        })
      this.axios
        .get(
          this._global.businessUrl +
            '/dataReport/database/' +
            this.prisonId +
            '/' +
            lastDate
        )
        .then(res => {
          if (res) {
            this.lastSqlData = res.data
            console.log(this.SqlData)
          }
        })
    },
    select() {
      this.formData = {}
      this.getSqlData()

      this.axios
        .get(
          this._global.businessUrl +
            '/dataReport/byPrisonAndDate/' +
            this.prisonId +
            '/' +
            this.date
        )
        .then(res => {
          if (res) {
            this.formData = res
            for (const key in this.formData) {
              this.formData[key] == null ? (this.formData[key] = 0) : ''
            }
          }
        })
      this.lastSelect()
    },
    lastSelect() {
      this.lastformData = {}
      let date = this.date - 24 * 3600 * 1000
      this.axios
        .get(
          this._global.businessUrl +
            '/dataReport/byPrisonAndDate/' +
            this.prisonId +
            '/' +
            date
        )
        .then(res => {
          if (res) {
            this.lastformData = res
            for (const key in this.lastformData) {
              this.lastformData[key] == null ? (this.lastformData[key] = 0) : ''
            }
          }
        })
    },
    submit() {
      this.formData.prisonId = this.userPrisonId
      this.axios
        .post(this._global.businessUrl + '/dataReport', this.formData)
        .then(res => {
          console.log(res)
          this.$message.success(res)
          this.date = new Date().getTime()
          this.getSqlData()
          this.select()
        })
    }
  },
  computed: {
    allPoliceNum() {
      if (this.formData.malePoliceNum || this.formData.femalePoliceNum) {
        let man = Number(this.formData.malePoliceNum)
        let woman = Number(this.formData.femalePoliceNum)
        if (!woman) {
          woman = 0
        }
        if (!man) {
          man = 0
        }
        return man + woman
      } else {
        return 0
      }
    },
    allPoliceSqlNum() {
      if (this.SqlData.malePoliceNum || this.SqlData.femalePoliceNum) {
        let man = Number(this.SqlData.malePoliceNum)
        let woman = Number(this.SqlData.femalePoliceNum)
        if (!woman) {
          woman = 0
        }
        if (!man) {
          man = 0
        }
        return man + woman
      } else {
        return 0
      }
    },
    lastAllPoliceNum() {
      if (
        this.lastformData.malePoliceNum ||
        this.lastformData.femalePoliceNum
      ) {
        let man = Number(this.lastformData.malePoliceNum)
        let woman = Number(this.lastformData.femalePoliceNum)
        if (!woman) {
          woman = 0
        }
        if (!man) {
          man = 0
        }
        return man + woman
      } else {
        return 0
      }
    },
    lastAllPoliceSqlNum() {
      if (this.lastSqlData.malePoliceNum || this.lastSqlData.femalePoliceNum) {
        let man = Number(this.lastSqlData.malePoliceNum)
        let woman = Number(this.lastSqlData.femalePoliceNum)
        if (!woman) {
          woman = 0
        }
        if (!man) {
          man = 0
        }
        return man + woman
      } else {
        return 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
.head_btn {
  margin-bottom: 10px;
}
/deep/.el-switch__label * {
  font-size: 1.1rem;
  font-weight: 600;
}

.time_box {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  margin: 1rem 1rem;
  .yn_date_picker {
    margin: 0 1rem;
    width: 12rem;
  }
}

.moudek_head {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin: 1rem;
  .icon_img {
    font-size: 2.5rem;
    margin-right: 0.5rem;
  }
  .head_name {
    border: 1px solid #ccc;
    padding: 0.2rem 0.5rem;
  }
}
.police_table {
  width: 90%;
  height: 100%;
  border: 1px solid #ccc;
  font-size: 1.1rem;
  margin: 2rem 5%;
  /deep/.table_ipt input {
    border: none;
    background-color: #dadbdc;
  }
  /deep/.el-input.is-disabled {
    background-color: #fff;

    width: 5rem;
    /deep/ .el-input__inner {
      color: #fd9b0b !important;
    }
  }
  /deep/.yn_ipt .table_ipt .el-input {
    width: 5rem;
  }
  /deep/.el-input__inner {
    padding: 4px 0;
    width: 5rem;
    background-color: #d4eaff;
    text-indent: 2px;
  }
}
.btn_box {
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  padding: 1rem 2rem 5px 2rem;
}
.sql_num {
  color: #4a8ae8;
  font-size: 1.1rem;
  white-space: nowrap;
}
.td_box {
  width: 100%;
  display: flex;
  align-items: center;
  /deep/.el-input__inner {
    padding: 4px 0;
    width: 5rem;
    background-color: #dadbdc;
    text-indent: 2px;
  }
  /deep/.yn_ipt .table_ipt .el-input {
    width: 5rem;
  }
}
.history_box {
  /deep/.el-input__inner {
    background-color: #fff !important;
  }
}
.technology {
  .moudek_head .icon_img,
  .time_box,
  .head_name,
  .police_table {
    color: #fff;
  }
  .history_box /deep/.el-input__inner,
  .police_table /deep/.el-input.is-disabled {
    background: transparent !important;
    color: #606266;
  }
  .police_table {
    border: 1px solid #7cdafd;
  }
  .police_table /deep/.table_ipt input {
    background: rgba(75, 173, 238, 0.5);
  }
}
</style>
