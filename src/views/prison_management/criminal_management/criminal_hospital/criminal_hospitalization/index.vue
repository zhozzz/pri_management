<!--
 * @Description: 罪犯住院
 * @Author:
 * @Date: 2019-08-27 10:07:02
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:39:13
 -->
<template>
  <dept-layout @input="nodeClick" v-model="prisonId" :backData="true">
    <menuTree :menuList="['监狱管理','罪犯管理','罪犯住院']">
      <tab slot="heade_btn" name="罪犯住院管理" :right="true" pathName="hospitalization_statisic" />

      <hospital-dialog
        :handleCloseHospital="handleCloseHospital"
        :hospitalVisible="hospitalVisible"
        :criminalId="null"
        @submit="queryInfo"
      ></hospital-dialog>

      <hospitals-dialog
        @submit="queryInfo"
        :handleCloseHospital="handleClosemore"
        :hospitalVisible="moreVisible"
      ></hospitals-dialog>

      <table-view :tableData="tableData" noBottom @sizeChange="sizeChange" v-loading="loading">
        <div slot="searchCondition">
          <el-form
            class="yn_form"
            ref="queryForm"
            :rules="rules"
            inline
            :model="queryParams"
            label-width="8rem"
          >
            <el-form-item label="住院类型" prop="hospitalizeType">
              <el-select
                class="yn_ipt"
                v-model="queryParams.hospitalizeType"
                @change="chageTypeQuery"
              >
                <el-option
                  v-for="(item,i) in hospitalizeTypeOptions"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="罪犯编号" prop="criminalNum">
              <el-input class="yn_ipt" v-model="queryParams.criminalNum"></el-input>
            </el-form-item>

            <el-form-item label="罪犯姓名" prop="criminalName">
              <el-input class="yn_ipt" v-model="queryParams.criminalName"></el-input>
            </el-form-item>

            <el-form-item label="所属监区">
              <depart-select class="yn_ipt" v-model="queryParams.areaId"></depart-select>
            </el-form-item>

            <el-form-item label="住院原因">
              <el-select class="yn_ipt" v-model="queryParams.hospitalizeReason">
                <el-option
                  v-for="(item,i) in hospitalizeReasonOptions"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="罪犯性别">
              <el-select class="yn_ipt" v-model="queryParams.gender">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>-->

            <el-form-item label="开始住院时间">
              <el-date-picker
                class="yn_ipt yn_date_picker"
                v-model="queryTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="是否重点罪犯">
              <el-select class="yn_ipt" v-model="queryParams.ifKeyCriminal">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="yn_btn" @click="queryInfo">查询</el-button>
              <el-button type="primary" class="yn_btn" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item v-if="userPrisonId!=1">
              <el-button type="primary" class="yn_btn" @click="hospitalVisible=true">罪犯住院登记</el-button>
              <el-button type="primary" class="yn_btn" @click="moreVisible=true">批量登记</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template slot="table-column">
          <el-table-column align="center" show-overflow-tooltip prop="zfNum" label="罪犯编号" />
          <!-- <el-table-column align="center" show-overflow-tooltip prop="zfCard" label="身份证号" /> -->
          <el-table-column align="center" prop="zfName" label="姓名" />
          <!-- <el-table-column align="center" prop="zfGender" :formatter="formSex" label="性别" />
          <el-table-column align="center" prop="zfCountry" label="国籍" />
          <el-table-column align="center" prop="zfBornPlace" label="籍贯" />-->
          <el-table-column align="center" prop="zfTypeValue" :formatter="formType" label="分管等级" />
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="hospitalizeTime"
            label="入院时间"
          />
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="lastType"
            :formatter="hospitalType"
            label="住院类型"
          />
          <el-table-column align="center" show-overflow-tooltip prop="lastPlace" label="住院地点" />
          <el-table-column align="center" prop="transferRecords" label="转院记录">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p v-if="scope.row.transferRecords.length==0">无转院记录</p>
                <div v-else>
                  <p
                    v-for="(item,i) of scope.row.transferRecords"
                    :key="i"
                  >在{{ item.transferTime }}转院到{{item.transferPlace}}</p>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">查看</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否重点罪犯">
            <template slot-scope="scope">
              <span
                v-if="scope.row.isKey == 0"
                @click="$markKeyCriminal(scope.row.id,'1',queryInfo)"
              >否</span>
              <span
                v-else-if="scope.row.isKey == 1"
                style="color:red"
                @click="$markKeyCriminal(scope.row.id,'0',queryInfo)"
              >是</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-if="queryParams.hospitalizeType==='6b156e46-ce1e-11e9-a84e-525400e39388'"
            align="center"
            prop="accompanyCriminals"
            label="陪护罪犯"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p
                  v-for="(item,i) of scope.row.accompanyCriminals"
                  :key="i"
                >姓名: {{ item.zfName }}（编号：{{item.zfNum}}）</p>
                <p align="center">
                  <el-button type="text" @click="changeAccompanyCriminals(scope.row)">更换</el-button>
                </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                    size="medium"
                    v-for="(item,i) of scope.row.accompanyCriminals"
                    :key="i"
                  >{{ item.zfName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-if="queryParams.hospitalizeType=='6b156e46-ce1e-11e9-a84e-525400e39388'"
            align="center"
            prop="officers"
            label="责任警察"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" v-if="scope.row.officers">
                <p
                  v-for="(item,i) of scope.row.officers"
                  :key="i"
                >姓名: {{ item.realName }}（电话号码：{{item.phoneNo}}）</p>
                <p align="center">
                  <el-button type="text" @click="changeOfficers(scope.row)">更换</el-button>
                </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                    size="medium"
                    v-for="(item,i) of scope.row.officers"
                    :key="i"
                  >{{ item.realName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            v-if="queryParams.hospitalizeType==='73bdcd03-ce1e-11e9-a84e-525400e39388' || queryParams.hospitalizeType==='783c281b-ce1e-11e9-a84e-525400e39388'"
            align="center"
            label="看押警察"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" v-if="scope.row.officers">
                <p
                  v-for="(item,i) of scope.row.officers"
                  :key="i"
                >姓名: {{ item.realName }}（电话号码：{{item.phoneNo}}）</p>
                <p align="center">
                  <el-button type="text" @click="changeOfficers(scope.row)">更换</el-button>
                </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag
                    size="medium"
                    v-for="(item,i) of scope.row.officers"
                    :key="i"
                  >{{ item.realName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            v-if="queryParams.hospitalizeType==='73bdcd03-ce1e-11e9-a84e-525400e39388' || queryParams.hospitalizeType==='783c281b-ce1e-11e9-a84e-525400e39388'"
            align="center"
            prop="isRegulatoryWard"
            label="是否监管病房"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isRegulatoryWard===0">否</span>
              <span v-else-if="scope.row.isRegulatoryWard===1">是</span>
              <span v-else>未记录</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="restraintToolState"
            :formatter="formType"
            label="戒具使用情况"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.restraintToolState=='0'">暂停使用</span>
              <span v-else-if="scope.row.restraintToolState=='1'">使用中</span>
              <span v-else>未记录</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="zfAccusationValue"
            :formatter="formCriminalName"
            show-overflow-tooltip
            label="罪名"
          />
          <!-- <el-table-column align="center" prop="height" label="身高" />
          <el-table-column align="center" prop="weight" label="体重" />
          <el-table-column align="center" prop="age" label="年龄" />-->
          <!-- <el-table-column align="center" show-overflow-tooltip prop="updateTime" label="最近更新时间" />
          <el-table-column align="center" show-overflow-tooltip prop="createTime" label="创建时间" />-->
          <el-table-column align="center" prop="prop" label="操作" min-width="450">
            <template slot-scope="scope">
              <div class="yn_btn_box_inTable">
                <el-button class="yn_text_btn" type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button
                  v-if="isCenter>=0"
                  class="yn_text_btn yn_long_btn"
                  type="text"
                  @click="editRecord(scope.row)"
                >编辑住院记录</el-button>
                <el-button
                  class="yn_text_btn"
                  type="text"
                  @click="handleTransferHospital(scope.row)"
                >转院</el-button>
                <el-button class="yn_text_btn" type="text" @click="leaveHospital(scope.row)">出院</el-button>
                <criminal-register :prisonId="prisonId" :criminalId="scope.row.id"></criminal-register>
                <criminal-file :criminalId="scope.row.id">查看档案</criminal-file>
                <el-button
                  type="text"
                  class="yn_text_btn yn_long_btn"
                  v-if="queryParams.hospitalizeType==='6b156e46-ce1e-11e9-a84e-525400e39388'"
                  @click="changeAccompanyCriminals(scope.row)"
                >更换陪护罪犯</el-button>
                <el-button
                  type="text"
                  class="yn_text_btn yn_long_btn"
                  v-if="queryParams.hospitalizeType==='73bdcd03-ce1e-11e9-a84e-525400e39388' || queryParams.hospitalizeType==='783c281b-ce1e-11e9-a84e-525400e39388'"
                  @click="changeOfficers(scope.row)"
                >更换看押警察</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </table-view>

      <el-dialog
        class="yn_dialog"
        title="陪护罪犯"
        :visible.sync="changeAccompanyFlag"
        center
        width="60%"
        @close="changeAccompanyClose"
      >
        <el-form
          :model="changeAccompanyform"
          label-width="7rem"
          :rules="changeaccompany"
          ref="changeAccompanyForm"
          class="yn_form"
        >
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="陪护罪犯" prop="accompanyIds">
                <el-select
                  v-model="changeAccompanyform.accompanyIds"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  @change="onChange"
                  class="yn_ipt"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.zfName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="subChangeAccompany">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog
        class="yn_dialog"
        title="责任警察"
        :visible.sync="changeOfficersFlag"
        center
        width="60%"
        @close="changeOfficersClose"
      >
        <el-form
          :model="changeOfficersform"
          label-width="7rem"
          :rules="changeofficers"
          ref="changeOfficersForm"
          class="yn_form"
        >
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="警察姓名" prop="officerIds">
                <police-select v-model="changeOfficersform.officerIds" multiple></police-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="subChangeOfficers">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog
        class="yn_dialog"
        title="转院"
        :visible.sync="transferHospitalFlag"
        center
        width="60%"
        @close="transferHospitalClose"
      >
        <el-form
          :model="transferHospitalform"
          label-width="7rem"
          :rules="transferHospital"
          class="yn_form"
          ref="transferHospitalForm"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="转院类型" prop="transferType">
                <el-select class="yn_ipt" v-model="transferHospitalform.transferType">
                  <el-option
                    v-for="(item,i) in hospitalizeTypeOptions"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="transferHospitalform.transferType=='783c281b-ce1e-11e9-a84e-525400e39388'"
            >
              <el-form-item label="转到医院" prop="transferPlace">
                <el-input class="yn_ipt" v-model="transferHospitalform.transferPlace"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转院时间" prop="transferTime">
                <el-date-picker
                  v-model="transferHospitalform.transferTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="date-picker yn_ipt"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转院原因" prop="transferReason">
                <el-select class="yn_ipt" v-model="transferHospitalform.transferReason">
                  <el-option
                    v-for="(item,i) in transferReasonOptions"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="transferHospitalform.transferType!=='6b156e46-ce1e-11e9-a84e-525400e39388'"
            >
              <el-form-item label="看押警察" prop="officerIds">
                <police-select v-model="transferHospitalform.officerIds" multiple></police-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="subTransferHospital">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog
        class="yn_dialog"
        title="编辑罪犯"
        :visible.sync="editFlag"
        center
        width="60%"
        @close="editclose"
      >
        <el-form
          :model="editform"
          class="yn_form"
          label-width="7rem"
          :rules="editrules"
          ref="editForm"
        >
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="罪犯姓名" prop="zfName">
                <el-input class="yn_ipt" v-model="editform.zfName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="罪犯编号" prop="zfNum">
                <el-input class="yn_ipt" v-model="editform.zfNum" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="罪名" prop="zfAccusationValue">
                <el-select class="yn_ipt" v-model="editform.zfAccusationValue">
                  <el-option
                    v-for="(item,i) in CriminalNamelist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="性别" prop="zfGender">
                <el-select class="yn_ipt" v-model="editform.zfGender">
                  <el-option
                    v-for="(item,i) in sexlist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="分管等级" prop="zfTypeValue">
                <el-select class="yn_ipt" v-model="editform.zfTypeValue">
                  <el-option
                    v-for="(item,i) in typelist"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="身份证号" prop="zfCard">
                <el-input class="yn_ipt" v-model="editform.zfCard" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="籍贯" prop="zfBornPlace">
                <el-input class="yn_ipt" v-model="editform.zfBornPlace" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="身高(cm)" prop="height">
                <el-input class="yn_ipt" v-model="editform.height" :controls="false"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="体重(kg)" prop="weight">
                <el-input class="yn_ipt" v-model="editform.weight" :controls="false"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="罪犯生日" prop="zfBirth">
                <el-date-picker
                  class="yn_ipt"
                  v-model="editform.zfBirth"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="年龄" prop="age">
                <el-input class="yn_ipt" v-model="editform.age" :controls="false"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(subEdit)">保 存</el-button>
        </div>
      </el-dialog>

      <el-dialog
        class="yn_dialog"
        title="住院记录编辑"
        :visible.sync="recordFlag"
        center
        width="60%"
        @close="recordClose"
      >
        <el-form
          ref="editForm"
          :rules="rules"
          :model="recordform"
          label-width="7rem"
          class="yn_form"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="住院原因" prop="hospitalizeReason">
                <el-input class="yn_ipt" v-model="recordform.hospitalizeReason"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="戒具使用情况" prop="restraintToolState">
                <el-select class="yn_ipt" v-model="recordform.restraintToolState">
                  <el-option
                    v-for="(item,i) in toolList"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="住院地点" prop="place">
                <el-input class="yn_ipt" v-model="recordform.place"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="subCenterEdit">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog class="yn_dialog" title="出院登记" :visible.sync="leavlVisible" center width="60%">
        <el-form
          ref="editForm"
          :rules="rules"
          :model="recordform"
          label-width="7rem"
          class="yn_form"
        >
          <el-form-item label="是否返监：" prop="place">
            <el-radio v-model="isBack" :label="true">是</el-radio>
            <el-radio v-model="isBack" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item v-if="!isBack" label="离监类型：" prop="place">
            <el-select class="yn_ipt" v-model="outType">
              <el-option
                v-for="(item,i) in outTypeOptions"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="saveLeavel">保 存</el-button>
        </div>
      </el-dialog>
    </menuTree>
  </dept-layout>
</template>
<script>
import { pickerOptions } from '@/utils/picker_option_config.js'
import departSelect from '@/components/depart_select'
import tableView from '@/components/table_view'
import criminalRegister from '@/components/criminal_dialog/criminal_register_dialog'
import _globalUrl from '@/utils/global_url'
import { resolve, reject } from 'q'
import { expnoraml, Isname, isIDCard } from '@/utils/form_valid.js'
import { MessageBox, Message } from 'element-ui'
import deptLayout from '@/components/deptLayout/index.vue'
import { getPrisonId } from '@/utils'
import policeSelect from '@/components/police_select'
import criminalFile from '@/components/criminal_dialog/criminal_files_dialog/index.vue'
import hospitalDialog from '@/components/criminal_dialog/criminal_register_dialog/hospital_dialog.vue'
import { formatDate } from '../../../../../utils/date'
import _global from '../../../../../utils/global_url'
import tab from '@/components/tab/index.vue'
import menuTree from '@/components/menu_tree/'
import hospitalsDialog from './hospital_dialog.vue'

export default {
  components: {
    tableView,
    criminalRegister,
    departSelect,
    deptLayout,
    policeSelect,
    criminalFile,
    tab,
    menuTree,
    hospitalDialog,
    hospitalsDialog
  },
  data() {
    return {
      outTypeOptions: [],
      outType: '',
      isBack: false,
      pickerOptions: pickerOptions,
      tableData: {
        list: [],
        total: 0,

        pageNum: 1,
        pageSize: 10
      },
      hospitalVisible: false,
      moreVisible: false,
      loading: true,
      sexlist: [
        { value: 1, label: '男' },
        { value: 0, label: '女' }
      ],
      toolList: [
        { value: '1', label: '使用中' },
        { value: '0', label: '暂停使用' }
      ],
      typelist: [], // 类型
      CriminalNamelist: [], // 罪名
      queryParams: {
        currentPage: 1,
        pageSize: 10,
        deptId: getPrisonId(),
        hospitalizeType: '6b156e46-ce1e-11e9-a84e-525400e39388'
      },
      prisonId: getPrisonId(),
      userPrisonId: getPrisonId(),

      // 住院类型选择
      hospitalizeTypeOptions: [
        {
          label: '狱内住院',
          value: '6b156e46-ce1e-11e9-a84e-525400e39388'
        },
        {
          label: '中心医院住院',
          value: '73bdcd03-ce1e-11e9-a84e-525400e39388'
        },
        {
          label: '社会医院住院',
          value: '783c281b-ce1e-11e9-a84e-525400e39388'
        }
      ],
      // 住院原因选择
      hospitalizeReasonOptions: '',
      // 暂时保留查询时间的参数
      queryTime: '',
      rules: {
        hospitalizeType: [
          {
            required: true,
            message: '请选择住院类型',
            trigger: 'blur'
          }
        ],
        criminalNum: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          },
          { validator: expnoraml('罪犯编号'), trigger: 'blur' }
        ],
        criminalName: [
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          },
          { validator: expnoraml('罪犯姓名'), trigger: 'blur' }
        ],
        hospitalizeReason: [
          {
            required: true,
            message: '请填写住院原因',
            trigger: 'blur'
          }
        ]
      },
      // 编辑
      editFlag: false,
      // 更换陪同罪犯
      changeAccompanyFlag: false,
      changeAccompanyform: {
        accompanyIds: []
      },
      changeaccompany: {
        accompanyIds: {
          required: true,
          message: '请选择陪同罪犯',
          trigger: 'blur'
        }
      },
      // 陪同罪犯列表
      options: [],
      // 更换责任警察
      changeOfficersFlag: false,
      changeOfficersform: {
        officerIds: []
      },
      changeofficers: {
        officerIds: {
          required: true,
          message: '请选择责任警察',
          trigger: 'blur'
        }
      },
      // 转院
      transferHospitalFlag: false,
      transferHospitalform: {},
      transferReasonOptions: [], // 转院原因
      transferHospital: {
        transferType: {
          required: true,
          message: '请选择住院类型',
          trigger: 'blur'
        },

        transferTime: {
          required: true,
          message: '请选择转院时间',
          trigger: 'blur'
        },
        transferReason: {
          required: true,
          message: '请填写转院原因',
          trigger: 'blur'
        },
        officerIds: {
          required: true,
          message: '请选择警员',
          trigger: 'blur',
          type: 'array'
        }
      },
      editform: {},
      editrules: {
        zfName: [
          { validator: Isname, trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        zfNum: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        zfCard: [
          { validator: isIDCard, trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        zfBornPlace: [
          { validator: expnoraml('籍贯'), trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        height: [
          { validator: expnoraml('身高'), trigger: 'blur' },
          { min: 2, max: 3, message: '长度在 2 到 3 个字符', trigger: 'blur' }
        ],
        weight: [
          { validator: expnoraml('体重'), trigger: 'blur' },
          { min: 2, max: 3, message: '长度在 2 到 3 个字符', trigger: 'blur' }
        ],
        age: [
          { validator: expnoraml('年龄'), trigger: 'blur' },
          { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }
        ]
      },
      fileFlag: false,
      criminalId: '',
      recordFlag: false,
      recordform: {},
      isCenter: 0,
      leavlVisible: {},
      leavlVisible: false
    }
  },

  mounted() {
    let prisonId = sessionStorage.getItem('prisonID')
    if (prisonId && prisonId !== '1') {
      this.prisonId = prisonId
    }
    this.searchType()
    this.getType()
    this.getCriminalName()
    this.queryInfoType()
    this.isCenter = JSON.parse(
      localStorage.getItem('user')
    ).prisonPermissions.indexOf('criminal_hospitalize_edit')
  },
  methods: {
    queryInfoType() {
      this.axios
        .get(_global.userUrl + '/dictionary/option/OutPrisonType')
        .then(res => {
          this.outTypeOptions = res
        })
    },
    editRecord(val) {
      this.recordFlag = true
      this.recordform.hospitalizeId = val.id
      this.recordform.palce = val.hospitalizePlace
      this.recordform.restraintToolState = val.restraintToolState
    },
    recordClose() {
      this.recordFlag = false
      this.recordform = {}
    },
    subCenterEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.axios
            .put(
              _globalUrl.businessUrl + '/criminalHospitalize/edit',
              this.recordform
            )
            .then(res => {
              this.queryInfo()

              console.log(res)
            })
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    handleCloseHospital() {
      this.hospitalVisible = false
      this.reset()
    },
    handleClosemore() {
      this.moreVisible = false
      this.reset()
    },
    // 改变入院类型查看
    chageTypeQuery() {
      console.log('1111')
      this.queryInfo()
    },
    sizeChange() {
      this.queryParams.currentPage = this.tableData.pageNum
      this.queryInfo()
    },
    // 查询所有
    queryInfo() {
      console.log(this.queryParams)
      this.queryParams.deptId = this.prisonId
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.loading = true

          let param = {}
          let start = this.queryParams.startTime
          let end = this.queryParams.endTime
          Object.assign(param, this.queryParams)
          param.startTime =
            start == null || start === ''
              ? ''
              : formatDate(this.queryParams.startTime, 'yyyy-MM-dd hh:mm:ss')
          param.endTime =
            end == null || end === ''
              ? ''
              : formatDate(this.queryParams.endTime, 'yyyy-MM-dd hh:mm:ss')
          this.axios
            .post(_globalUrl.businessUrl + '/criminalHospitalize/query', param)
            .then(res => {
              this.tableData.list = res.list
              this.tableData.total = res.total
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    onChange(val) {
      console.log(val)
    },
    // 更换陪同罪犯
    changeAccompanyCriminals(row) {
      console.log(row)
      this.changeAccompanyFlag = true
      this.changeAccompanyform = {
        accompanyIds: []
      }
      JSON.parse(JSON.stringify(row)).accompanyCriminals.forEach(el => {
        this.changeAccompanyform.accompanyIds.push(el.id)
      })
      this.changeAccompanyform.hospitalizeId = JSON.parse(
        JSON.stringify(row)
      ).hospitalizeId
      this.axios
        .get(
          this._global.businessUrl +
            '/criminalHospitalize/getCriminalsUnderDept/' +
            row.deptId +
            '/' +
            row.id
        )
        .then(response => {
          console.log(response)
          this.options = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeAccompanyClose() {
      this.changeAccompanyFlag = false
      this.$refs['changeAccompanyForm'].clearValidate()
    },
    subChangeAccompany() {
      console.log(this.changeAccompanyform)
      this.$refs['changeAccompanyForm'].validate(valid => {
        if (valid) {
          this.axios
            .put(
              this._global.businessUrl +
                '/criminalHospitalize/changeAccompanies',
              this.changeAccompanyform
            )
            .then(response => {
              this.editFlag = false
              Message({
                type: 'success',
                message: '更换成功!'
              })
              this.queryInfo()
              this.changeAccompanyform = {
                accompanyIds: []
              }
              this.changeAccompanyFlag = false
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请完整填写' })
          return false
        }
      })
    },
    // 更换责任警员
    changeOfficers(row) {
      this.changeOfficersFlag = true
      this.changeOfficersform = {
        officerIds: []
      }
      JSON.parse(JSON.stringify(row)).officers.forEach(el => {
        this.changeOfficersform.officerIds.push(el.userGuid)
      })
      this.changeOfficersform.hospitalizeId = JSON.parse(
        JSON.stringify(row)
      ).hospitalizeId
    },
    changeOfficersClose() {
      this.changeOfficersFlag = false
      this.$refs['changeOfficersForm'].clearValidate()
    },
    subChangeOfficers() {
      console.log(this.changeOfficersform)
      this.$refs['changeOfficersForm'].validate(valid => {
        if (valid) {
          this.axios
            .put(
              this._global.businessUrl + '/criminalHospitalize/changeOfficers',
              this.changeOfficersform
            )
            .then(response => {
              this.editFlag = false
              Message({
                type: 'success',
                message: '更换成功!'
              })
              this.queryInfo()
              this.changeOfficersform = {
                officerIds: []
              }
              this.changeOfficersFlag = false
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请完整填写' })
          return false
        }
      })
    },
    getType() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/CrimeType')
        .then(response => {
          this.typelist = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCriminalName() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/CriminalName')
        .then(response => {
          this.CriminalNamelist = response
          this.queryInfo()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 查询住院类型和住院原因
    searchType() {
      this.axios
        .get(
          this._global.businessUrl +
            '/dictionary/getDictionaryTypes/HospitalizeReason'
        )
        .then(res => {
          this.hospitalizeReasonOptions = res
        })
      // this.axios
      //   .get(
      //     this._global.businessUrl +
      //     '/dictionary/getDictionaryTypes/HospitalizeType'
      //   )
      //   .then(res => {
      //     console.log(res)
      //     this.hospitalizeTypeOptions = res
      //     this.queryParams.hospitalizeType = '6b156e46-ce1e-11e9-a84e-525400e39388'
      //   })
    },
    // 重置
    reset() {
      this.queryParams = {
        currentPage: 1,
        pageSize: 10,
        deptId: JSON.parse(localStorage.getItem('user')).deptId,
        hospitalizeType: '6b156e46-ce1e-11e9-a84e-525400e39388'
      }
      this.$refs.queryForm.clearValidate()
      this.queryTime = ''
    },
    edit(row) {
      this.editFlag = true
      this.editform = JSON.parse(JSON.stringify(row))
    },
    subEdit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.axios
            .put(this._global.businessUrl + '/criminalBase/edit', this.editform)
            .then(response => {
              this.editFlag = false
              Message({
                type: 'success',
                message: '修改成功!'
              })
              this.queryInfo()
              this.editform = {}
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    editclose() {
      this.editform = {}
      this.$refs['editForm'].clearValidate()
    },
    // 查看档案

    formSex(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '男'
      } else {
        return '女'
      }
    },
    hospitalType(row, column, cellValue, index) {
      if (cellValue === '6b156e46-ce1e-11e9-a84e-525400e39388') {
        return '狱内住院'
      } else if (cellValue === '73bdcd03-ce1e-11e9-a84e-525400e39388') {
        return '中心医院'
      } else {
        return '社会医院住院'
      }
    },
    formCriminalName(row, column, cellValue, index) {
      let str = ''
      row.criminalAccusations.map(item => {
        str += item.label + '；'
      })
      str = str.substring(0, str.length - 1)
      return str
    },
    formType(row, column, cellValue, index) {
      let name = ''
      this.typelist.forEach(item => {
        item.value === cellValue ? (name = item.label) : ''
      })
      return name
    },
    nodeClick(val) {
      console.log(val)
      this.prisonId = val.id
      console.log(this.prisonId)
    },
    // 转院
    handleTransferHospital(val) {
      console.log(val)
      this.transferHospitalFlag = true
      this.axios
        .get(
          this._global.businessUrl +
            '/dictionary/getDictionaryTypes/HospitalizeTransferReason'
        )
        .then(response => {
          console.log(response)
          this.transferReasonOptions = response
        })
      this.transferHospitalform.hospitalizeId = val.hospitalizeId
      this.transferHospitalform.criminalId = val.id
      this.transferHospitalform.createUserId = JSON.parse(
        window.localStorage.getItem('user')
      ).userGuid
    },
    transferHospitalClose() {
      this.transferHospitalFlag = false
    },
    subTransferHospital() {
      console.log(this.transferHospitalform)
      this.transferHospitalform.prisonId = this.prisonId
      if (
        this.transferHospitalform.transferType ===
        '6b156e46-ce1e-11e9-a84e-525400e39388'
      ) {
        // 如果是狱内住院，不需要看押警员
        if (this.transferHospitalform.officerIds) {
          this.transferHospitalform.officerIds.splice(0)
        }
      }
      this.$refs['transferHospitalForm'].validate(valid => {
        if (valid) {
          this.axios
            .post(
              this._global.businessUrl + '/criminalHospitalize/transfer',
              this.transferHospitalform
            )
            .then(response => {
              this.editFlag = false
              Message({
                type: 'success',
                message: '保存成功!'
              })
              this.queryInfo()
              this.transferHospitalform = {}
              this.transferHospitalFlag = false
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请完整填写' })
          return false
        }
      })
    },
    // 出院登记
    leaveHospital(criminal) {
      if (criminal.hospitalizeType == '6b156e46-ce1e-11e9-a84e-525400e39388') {
        this.$confirm('确认罪犯出院?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios
            .put(
              _global.businessUrl +
                '/criminalHospitalize/leaveHospital/' +
                criminal.id +
                '/false/xx'
            )
            .then(res => {
              this.$message.success(res)
              this.queryInfo()
            })
            .catch(() => {
              this.$message.error('系统异常，操作失败')
            })
        })
      } else {
        this.leavlVisible = true
        this.leavlInfo = JSON.parse(JSON.stringify(criminal))
      }
    },
    saveLeavel() {
      if (!this.isBack && !this.outType) {
        this.$message.error('请选择离监类型')
      } else {
        this.$confirm('确认罪犯出院?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let str = ''
          if (this.isBack) {
            str = this.leavlInfo.id + '/' + this.isBack + '/0'
          } else {
            str = this.leavlInfo.id + '/' + this.isBack + '/' + this.outType
          }
          this.axios
            .put(
              _global.businessUrl + '/criminalHospitalize/leaveHospital/' + str
            )
            .then(res => {
              this.$message.success(res)
              this.leavlVisible = false
              this.queryInfo()
            })
            .catch(() => {
              this.$message.error('系统异常，操作失败')
            })
        })
      }
    }
  },
  watch: {
    queryTime(val) {
      this.queryParams.startTime = val[0]
      this.queryParams.endTime = val[1]
    },
    prisonId(val) {
      console.log(val)

      this.queryInfo()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-range-separator {
  width: 10%;
}
/deep/ .el-date-editor--daterange.el-input__inner {
  font-size: 1.2rem;
  width: 100%;
}
</style>
