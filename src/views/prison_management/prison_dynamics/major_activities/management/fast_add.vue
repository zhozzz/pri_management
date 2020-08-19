<!--
 * @Description: 快速新增
 * @Author: fylih
 * @Date: 2019-09-09 15:51:41
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:08:41
 -->
<template>
  <menuTree v-loading="chargeLoading" :menuList="['监狱管理','监狱动态','监狱重大活动']">
    <tab slot="heade_btn" right name="快速新增" :pathName="'major_activities_statistics'" back></tab>
    <el-form ref="addForm" class="yn_form" :model="editParams" :rules="rules" label-width="8rem">
      <el-row :gutter="10">
        <el-col :span="7">
          <el-form-item label="活动名称:" prop="eventMainInfo.eventName">
            <el-input class="yn_ipt" v-model="editParams.eventMainInfo.eventName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人:" prop="eventMainInfo.eventInCharge">
            <el-row>
              <el-col :span="11">
                <el-cascader
                  class="yn_ipt"
                  @change="inChargeChange"
                  placeholder="请选择部门"
                  :options="inChargeDepartOption"
                  :props="unitProps"
                  v-model="editParams.eventMainInfo.eventInChargeDepart"
                ></el-cascader>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-select
                  class="yn_ipt"
                  v-model="editParams.eventMainInfo.eventInCharge"
                  placeholder="选择部门后选择人员"
                >
                  <el-option
                    v-for="item in inChargeOption"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="时间:" prop="eventMainInfo.eventTime">
            <el-date-picker
              class="yn_ipt"
              v-model="editParams.eventMainInfo.eventTime"
              @change="timeChange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="7">
          <el-form-item label="所属部门:" prop="eventMainInfo.eventDepartment">
            <el-cascader
              class="yn_ipt"
              placeholder="请选择部门"
              :options="inChargeDepartOption"
              :props="unitProps"
              v-model="editParams.eventMainInfo.eventDepartment"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动类型:" prop="eventMainInfo.eventType">
            <el-select class="yn_ipt" v-model="editParams.eventMainInfo.eventType">
              <el-option
                v-for="item in typeOptions"
                :key="item.subclassGuid"
                :label="item.value"
                :value="item.subclassGuid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="活动地点:" prop="eventMainInfo.eventPosition">
            <el-select class="yn_ipt" v-model="editParams.eventMainInfo.eventPosition">
              <el-option
                v-for="item in positionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="15">
          <el-form-item label="参与警察:" prop="eventMainInfo.eventPoliceList">
            <el-select class="yn_ipt" multiple v-model="editParams.eventMainInfo.eventPoliceList">
              <el-option
                v-for="item in policeList"
                :key="item.policeId"
                :label="item.policeInfo"
                :value="item.policeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="15">
          <el-form-item label="参与罪犯:" prop="criminalTable">
            <i class="el-icon-circle-plus" @click="addCriminal"></i>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item>
            <el-table :data="editParams.criminalTable" class="el_table">
              <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
              <el-table-column align="center" prop="criminalName" label="姓名"></el-table-column>
              <el-table-column align="center" prop="criminalGender" label="性别"></el-table-column>
              <el-table-column align="center" prop="criminalAge" label="年龄"></el-table-column>
              <el-table-column align="center" prop="criminalIsKey" label="是否重点罪犯"></el-table-column>
              <el-table-column align="center" prop="index" label="操作">
                <template slot-scope="{row}">
                  <el-button class="yn_text_btn" @click="delCriminal(row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="15">
          <el-form-item label="参与外部人员:" label-width="10rem">
            <i class="el-icon-circle-plus" @click="addOutPerson"></i>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item>
            <el-table :data="outPersonDetails" class="el_table">
              <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
              <el-table-column align="center" prop="eventVisitorName" label="姓名"></el-table-column>
              <el-table-column align="center" label="性别">
                <template slot-scope="{row}">
                  <span v-if="row.eventVisitorGender == '0'||row.eventVisitorGender =='女'">女</span>
                  <span v-else-if="row.eventVisitorGender == '1'||row.eventVisitorGender =='男'">男</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="eventVisitorContact" label="联系方式"></el-table-column>
              <el-table-column align="center" prop="index" label="操作">
                <template slot-scope="{row}">
                  <el-button class="yn_text_btn" @click="delOutPerson(row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="15">
          <el-form-item label="活动照片:">
            <div>
              <div>
                <div style="width: 300px">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    v-loading="uploadLoading"
                    action
                    list-type="picture"
                    :file-list="fileList"
                    :on-change="onChange"
                    :auto-upload="false"
                  >
                    <i slot="trigger" class="el-icon-circle-plus"></i>
                    <el-button
                      style="margin-left: 10px;"
                      size="small"
                      type="success"
                      @click="submitUpload"
                    >上传到服务器</el-button>
                  </el-upload>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item></el-form-item>
        </el-col>
      </el-row>
      <el-button
        v-loading="uploadLoading"
        class="yn_btn"
        type="primary"
        style="display:table;margin:auto"
        @click="addSubmit"
      >提交</el-button>
    </el-form>
    <el-dialog title="添加罪犯" center :visible.sync="addCriminalVisible" class="yn_dialog">
      <div>
        <el-form
          ref="criminalForm"
          :model="editParams"
          :rules="rules"
          class="yn_form"
          label-width="6rem"
        >
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="监区:">
                <el-cascader
                  class="yn_ipt"
                  :options="areaList"
                  v-model="criminalArea"
                  :props="criminalDepartmentProps"
                  @change="areaChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="姓名:">
                <el-select
                  class="yn_ipt"
                  multiple
                  @change="criminalChange"
                  v-model="beforeCriminalList"
                  placeholder="选择监区后选择罪犯"
                >
                  <el-option
                    v-for="item in criminalList"
                    :key="item.criminalId"
                    :label="item.criminalName"
                    :value="item.criminalId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="criminalSubmit">添 加</el-button>
        <el-button class="yn_btn" @click="addCriminalVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加外部人员"
      :visible.sync="addOutPersonVisible"
      :rules="rules"
      center
      class="yn_dialog"
      width="65%"
    >
      <div>
        <el-form
          ref="OutPersonForm"
          :model="visitorInfoLst"
          label-width="8rem"
          class="yn_form"
          :rules="rules"
        >
          <el-row :gutter="10">
            <el-col :span="10" :offset="1" label-width="10rem">
              <el-form-item label="访客身份证:" prop="eventVisitorIdentityCard">
                <el-input class="yn_ipt" v-model="visitorInfoLst.eventVisitorIdentityCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="访客姓名:" prop="eventVisitorName">
                <el-input class="yn_ipt" v-model="visitorInfoLst.eventVisitorName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="访客性别:" prop="eventVisitorGender">
                <el-select class="yn_ipt" v-model="visitorInfoLst.eventVisitorGender">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="联系方式:" prop="eventVisitorContact">
                <el-input class="yn_ipt" v-model="visitorInfoLst.eventVisitorContact"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="outPersonSubmit">添加访客</el-button>
        <el-button class="yn_btn" @click="addOutPersonVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>
<script>
import {
  getInCharge,
  getDepartDropdownInfo,
  getDic,
  getCriminalDepartmentList,
  getPoliceList,
  getCriminalList,
  addSubmit,
  checkQuery,
  getArea
} from './service'
import { getPrisonId } from '@/utils'
import tab from '@/components/tab'
import { expnoraml, isEnName, isIDCard, Isphone } from '@/utils/form_valid'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tab, menuTree },
  data() {
    return {
      rules: {
        eventMainInfo: {
          eventName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { validator: expnoraml('活动名称') }
          ],
          //   eventInCharge: {
          //     required: true,
          //     message: "选定部门后选择负责人",
          //     trigger: "blur"
          //   },
          eventDepartment: {
            required: true,
            message: '请选择部门',
            trigger: 'blur'
          },
          eventType: {
            required: true,
            message: '请选择活动类型',
            trigger: 'blur'
          },
          eventPosition: {
            required: true,
            message: '请选择活动地点',
            trigger: 'blur'
          },
          eventTime: { required: true, message: '请选择时间', trigger: 'blur' },
          eventPoliceList: {
            required: true,
            message: '请选择参与警察',
            trigger: 'blur'
          }
        },
        eventVisitorGender: {
          required: true,
          message: '请选择访客性别',
          trigger: 'blur'
        },
        eventVisitorContact: [
          { required: true, message: '请输入访客联系方式', trigger: 'blur' },
          { validator: Isphone }
        ],
        eventVisitorName: [
          { required: true, message: '请输入访客名称', trigger: 'blur' },
          { validator: isEnName }
        ],
        eventVisitorIdentityCard: [
          { required: true, message: '请输入访客身份证', trigger: 'blur' },
          { validator: isIDCard }
        ],
        criminalTable: { required: true, message: '请选择罪犯' }
      },
      editParams: {
        eventMainInfo: {
          eventImagePath: '',
          eventPoliceList: '',
          eventCriminalList: '',
          createUser: JSON.parse(localStorage.getItem('user')).userGuid
        },
        visitorInfoLst: [],
        // 展示罪犯的table
        criminalTable: []
      },
      addCriminalVisible: false,
      addOutPersonVisible: false,
      // 暂时存放监区
      criminalArea: [],
      // 暂时存罪犯的数组
      beforeCriminalList: [],
      inChargeDepartOption: [],
      inChargeOption: [],
      typeOptions: [],
      positionOptions: [],
      policeList: [],
      areaList: [],
      // 根据监区查询出来的罪犯列表
      criminalList: [],
      // 根据id在之前拿到的criminalList里面查到的罪犯数据
      criminalDetails: [],
      // 保存弹出框输入的访客的信息
      visitorInfoLst: {},
      // 展示访客的table
      outPersonDetails: [],
      // 上传文件列表
      fileList: [],
      uploadLoading: false,
      chargeLoading: false,
      deptLoading: false,
      unitProps: {
        label: 'departName',
        value: 'id',
        children: 'list',
        checkStrictly: true
      },
      criminalDepartmentProps: {
        label: 'departName',
        value: 'id',
        children: 'list',
        checkStrictly: true
      }
    }
  },
  created() {
    this.getInChargeDepart(() => {
      this.getDetails()
    })
    this.getTypeAndPosition()
    this.getPoliceList()
    this.getCriminalDepartmentList()
  },
  methods: {
    // 清除空的叶子节点
    clearLeafs(data) {
      data.forEach(item => {
        if (item.list.length < 1) {
          item.list = undefined
        } else {
          this.clearLeafs(item.list)
        }
      })
      return data
    },
    timeChange(val) {
      this.editParams.eventMainInfo.eventBeginTime = val[0]
      this.editParams.eventMainInfo.eventEndTime = val[1]
    },
    getDetails() {
      this.chargeLoading = true
      this.deptLoading = true
      checkQuery({ eventId: this.$route.query.eventId, flag: 1 }).then(res => {
        this.editParams = res
        // 警察列表的回显
        let policeList = res.policeInfoLst.map(item => item.policeId)
        this.$set(this.editParams.eventMainInfo, 'eventPoliceList', policeList)
        // 时间的回显
        this.$set(this.editParams.eventMainInfo, 'eventTime', [
          res.eventMainInfo.eventBeginTime,
          res.eventMainInfo.eventEndTime
        ])
        // 罪犯table的回显
        this.editParams.criminalTable = res.criminalInfoLst
        // 外来人员的回显
        this.outPersonDetails = res.visitorInfoLst
        // 负责人部门的回显
        this.editParams.eventMainInfo.eventInChargeDepart =
          res.eventMainInfo.eventInChargeArray
        // 所属部门的回显
        this.editParams.eventMainInfo.eventDepartment =
          res.eventMainInfo.eventDepartmentArray

        this.editParams.eventMainInfo.eventImagePath = ''
        this.editParams.eventMainInfo.imagePath = []
        // 负责人的回显
        getInCharge({
          eventDepartment:
            res.eventMainInfo.eventInChargeArray[
              res.eventMainInfo.eventInChargeArray.length - 1
            ]
        }).then(res => {
          this.inChargeOption = res
        })
        this.chargeLoading = false
        this.deptLoading = false
      })
    },
    getInChargeDepart(callback) {
      getDepartDropdownInfo(getPrisonId()).then(res => {
        this.inChargeDepartOption = this.clearLeafs(res.list)
        callback()
      })
    },
    inChargeChange(val) {
      this.$set(this.editParams.eventMainInfo, 'eventInCharge', undefined)
      getInCharge({ eventDepartment: val[val.length - 1] }).then(res => {
        this.inChargeOption = res
      })
    },
    getTypeAndPosition() {
      getDic('eventType').then(res => {
        this.typeOptions = res
      })
      getArea().then(res => {
        this.positionOptions = res
      })
    },
    getPoliceList() {
      getPoliceList({ eventDepartment: getPrisonId() }).then(res => {
        this.policeList = res.policeInfoLst
      })
    },
    getCriminalDepartmentList() {
      getCriminalDepartmentList(getPrisonId()).then(res => {
        this.areaList = this.clearLeafs(res.list)
      })
    },
    // 参与罪犯的＋号触发事件弹出模态框
    addCriminal() {
      this.beforeCriminalList = []
      this.criminalArea = ''
      this.criminalList = []
      this.addCriminalVisible = true
    },
    // 监区改变
    areaChange(val) {
      this.beforeCriminalList = []
      getCriminalList({ prisonArea: val[val.length - 1] }).then(res => {
        this.criminalList = res
      })
    },
    // 罪犯改变
    criminalChange(val) {
      this.criminalDetails = []
      val.forEach(item => {
        this.criminalDetails.push(
          this.criminalList.filter(g => g.criminalId === item)[0]
        )
      })
    },
    delCriminal(val) {
      this.editParams.criminalTable.splice(
        this.editParams.criminalTable.indexOf(val),
        1
      )
    },
    criminalSubmit() {
      this.criminalDetails.forEach(item => {
        if (
          JSON.stringify(this.editParams.criminalTable).indexOf(
            JSON.stringify(item)
          ) < 0
        ) {
          this.editParams.criminalTable.push(item)
        }
        this.addCriminalVisible = false
      })
    },
    // 外部人员的＋号触发事件弹出模态框
    addOutPerson() {
      this.visitorInfoLst = {}
      this.addOutPersonVisible = true
    },
    outPersonSubmit() {
      this.$refs.OutPersonForm.validate(valid => {
        if (valid) {
          this.outPersonDetails.push(this.visitorInfoLst)
          this.addOutPersonVisible = false
        }
      })
    },
    delOutPerson(val) {
      this.outPersonDetails.splice(this.outPersonDetails.indexOf(val), 1)
    },
    onChange(file, fileList) {
      this.fileTemp = fileList
    },
    submitUpload() {
      let fd = new FormData()
      let temp = this.fileTemp
      for (let i = 0; i < temp.length; i++) {
        let file1 = temp[i]
        fd.append('files', file1.raw, file1.name)
      }
      this.uploadLoading = true
      this.axios
        .post(this._global.businessUrl + '/file/uploadFiles', fd, {
          onUploadProgress: event => {
            event.percent = (event.loaded / event.total) * 100
            this.$refs.upload.onProgress(event)
          }
        })
        .then(res => {
          this.uploadLoading = false
          res.forEach((item, i) => {
            this.editParams.eventMainInfo.eventImagePath += item.fileId
            if (i !== res.length - 1) {
              this.editParams.eventMainInfo.eventImagePath += ','
            }
          })
        })
        .catch(() => {
          this.uploadLoading = false
        })
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let policeList = ''
          let criminalList = ''
          this.editParams.eventMainInfo.eventPoliceList.forEach((item, i) => {
            policeList += item
            if (
              i !==
              this.editParams.eventMainInfo.eventPoliceList.length - 1
            ) {
              policeList += ','
            }
          })
          this.editParams.eventMainInfo.eventPoliceList = policeList
          this.editParams.eventMainInfo.eventDepartment = this.editParams.eventMainInfo.eventDepartment[
            this.editParams.eventMainInfo.eventDepartment.length - 1
          ]
          this.editParams.criminalTable.forEach((item, i) => {
            criminalList += item.criminalId
            if (i !== this.editParams.criminalTable.length - 1) {
              criminalList += ','
            }
          })
          this.editParams.eventMainInfo.eventId = undefined
          this.editParams.eventMainInfo.eventCriminalList = criminalList
          this.editParams.visitorInfoLst = this.outPersonDetails
          addSubmit(this.editParams)
            .then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'major_activities' })
            })
            .catch(() => {
              this.$router.push({ name: 'major_activities' })
              this.uploadLoading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100% !important;
}
.yn_form {
  padding-top: 23px;
  padding-left: 6px;
}
i {
  vertical-align: middle;
}
.el-icon-circle-plus {
  font-size: 2rem;
}
.update_border {
  border: 1px solid #999797;
}
.technology {
  .el-icon-circle-plus {
    color: #fff;
  }
}
</style>
