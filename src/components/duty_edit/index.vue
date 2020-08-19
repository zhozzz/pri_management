<template>
  <div class>
    <div class="shift_box">
      <el-row class="row_box">
        <el-col :span="4">
          <div v-if="isCenter" class="yn_table">
            <div class="group_title">值班领导</div>
            <div
              class="groups"
              :class="selectShift == item ? 'active' : ''"
              @click="handleCurrentChange(item)"
              v-show="item.orgGroup == 0"
              v-for="(item, i) in shiftList"
              :key="'a' + i"
            >{{ item.shiftName }}</div>
            <div class="group_title">指挥中心</div>
            <div
              :class="selectShift == item ? 'active' : ''"
              class="groups"
              @click="handleCurrentChange(item)"
              v-show="item.orgGroup == 2"
              v-for="(item, i) in shiftList"
              :key="'b' + i"
            >{{ item.shiftName }}</div>
            <div class="group_title">值班科室</div>
            <div
              :class="selectShift == item ? 'active' : ''"
              class="groups"
              v-show="item.orgGroup == 1"
              @click="handleCurrentChange(item)"
              v-for="(item, i) in shiftList"
              :key="'c' + i"
            >{{ item.shiftName }}</div>
          </div>
          <el-table
            v-else
            class="yn_table"
            :show-header="false"
            :data="shiftList"
            @current-change="handleCurrentChange"
            highlight-current-row
            ref="shiftTable"
            :row-class-name="tableRowClassName"
          >
            <el-table-column align="center" prop="shiftName"></el-table-column>
          </el-table>
          <div style="width:100%;text-align:center;margin-top:20px">
            <el-button class="yn_btn" type="primary" @click="newShift">新增班次</el-button>
          </div>
        </el-col>
        <el-col :span="20">
          <el-card shadow="never" v-if="selectShift && selectShift != null">
            <el-form
              class="yn_form"
              :model="shiftForm"
              ref="shiftForm"
              @submit.native.prevent
              :rules="rules"
            >
              <el-row class="from_item">
                <el-col :span="6">设置时间：</el-col>
                <el-form-item prop="timeRange">
                  <el-col :span="18">
                    <el-time-picker
                      is-range
                      class="yn_ipt"
                      v-model="shiftForm.timeRange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                      @input="timeChange"
                    ></el-time-picker>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row class="from_item">
                <el-col :span="6">重复周期：</el-col>
                <el-form-item prop="repeatType">
                  <el-col :span="18">
                    <el-checkbox-group v-model="shiftForm.repeatType" size="medium">
                      <el-checkbox border label="周一"></el-checkbox>
                      <el-checkbox border label="周二"></el-checkbox>
                      <el-checkbox border label="周三"></el-checkbox>
                      <el-checkbox border label="周四"></el-checkbox>
                      <el-checkbox border label="周五"></el-checkbox>
                      <el-checkbox border label="周六"></el-checkbox>
                      <el-checkbox border label="周日"></el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row class="from_item">
                <el-col :span="6">是否跳过节假日：</el-col>
                <el-form-item prop="isSkipHoliday">
                  <el-col :span="18">
                    <el-radio v-model="shiftForm.isSkipHoliday" :label="0">是</el-radio>
                    <el-radio v-model="shiftForm.isSkipHoliday" :label="1">否</el-radio>
                  </el-col>
                </el-form-item>
              </el-row>
              <div v-if="shiftForm.orgGroup == 0">
                <el-row class="from_item">
                  <el-col :span="6">值班领导：</el-col>

                  <el-form-item prop="leaders">
                    <el-col :span="18">
                      <el-select
                        class="yn_ipt"
                        v-model="shiftForm.leaders"
                        multiple
                        filterable
                        reserve-keyword
                        @change="function(){ $forceUpdate()}"
                        placeholder="请输入姓名"
                      >
                        <el-option
                          v-for="item in deptUserTree"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                        ></el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                </el-row>
              </div>
              <div v-else>
                <el-row class="from_item">
                  <el-col :span="6">值班警察：</el-col>
                  <el-form-item prop="shiftUserGuids">
                    <el-col :span="18">
                      <el-select
                        class="yn_ipt"
                        v-model="shiftForm.shiftUserGuids"
                        multiple
                        filterable
                        reserve-keyword
                        @change="function(){ $forceUpdate()}"
                        placeholder="请输入姓名"
                      >
                        <el-option
                          v-for="item in deptUserTree"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                        ></el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row class="from_item">
                  <el-col :span="6">备勤警察：</el-col>
                  <el-col :span="18">
                    <el-select
                      class="yn_ipt"
                      v-model="shiftForm.substituteUserGuids"
                      multiple
                      filterable
                      reserve-keyword
                      @change="function() {$forceUpdate()}"
                      placeholder="请输入姓名"
                    >
                      <el-option
                        v-for="item in deptUserTree"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <el-row class="from_item">
                  <el-col :span="6">值班辅警：</el-col>
                  <el-col :span="18">
                    <el-row :gutter="10">
                      <el-col :span="24">
                        <el-button class="yn_btn" type="primary" @click="addDutyAux">添加</el-button>
                      </el-col>

                      <el-col :span="12" v-for="(son, i) in shiftForm.dutyAux" :key="i">
                        <el-form label-width="5rem" class="yn_form aux_form">
                          <el-form-item label="姓名：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.userName"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="编号：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.policeNumber"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="电话：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.phoneNumber"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="职位：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.workPosition"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                        </el-form>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row class="from_item">
                  <el-col :span="6">备勤辅警：</el-col>
                  <el-col :span="18">
                    <el-row :gutter="10">
                      <el-col :span="24">
                        <el-button class="yn_btn" type="primary" @click="addPreAux">添加</el-button>
                      </el-col>

                      <el-col :span="12" v-for="(son, i) in shiftForm.preAux" :key="i">
                        <el-form label-width="5rem" class="yn_form aux_form">
                          <el-form-item label="姓名：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.userName"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="编号：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.policeNumber"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="电话：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.phoneNumber"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="职位：">
                            <el-input
                              class="yn_ipt"
                              v-model="son.workPosition"
                              @input="$forceUpdate()"
                              placeholder
                            ></el-input>
                          </el-form-item>
                        </el-form>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
              <el-row class="from_item">
                <el-col :span="6">是否启用</el-col>
                <el-form-item prop="status">
                  <el-col :span="18">
                    <el-switch
                      :active-value="0"
                      :inactive-value="1"
                      active-text="启用"
                      inactive-text="停用"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      v-model="shiftForm.status"
                    ></el-switch>
                  </el-col>
                </el-form-item>
              </el-row>
              <div class="btn_group">
                <el-button class="yn_btn" type="primary" @click="$checkMessage(saveShift)">保存</el-button>
                <el-button class="yn_btn" type="primary" @click="editShift">取消</el-button>
              </div>
            </el-form>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog
        class="yn_dialog"
        center
        :title="shiftFormTitle"
        :visible.sync="shiftDialog"
        @closed="resetForm('newShiftForm')"
        append-to-body
      >
        <div>
          <el-form
            class="yn_form"
            :model="newShiftForm"
            label-width="10rem"
            ref="newShiftForm"
            @submit.native.prevent
            :rules="rules"
          >
            <el-form-item label="班次名称" prop="shiftName">
              <el-input class="yn_ipt" v-model="newShiftForm.shiftName" placeholder></el-input>
            </el-form-item>
            <el-form-item v-if="isCenter" label="选择部门" prop="repeatType">
              <el-select class="yn_ipt" v-model="newShiftForm.orgGroup">
                <el-option
                  v-for="(item, i) in typeList"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间周期" prop="timeRange">
              <el-time-picker
                class="yn_ipt"
                is-range
                v-model="newShiftForm.timeRange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
              ></el-time-picker>
            </el-form-item>
            <el-form-item label="重复周期" prop="repeatType">
              <el-checkbox-group v-model="newShiftForm.repeatType" size="medium">
                <el-checkbox border label="周一"></el-checkbox>
                <el-checkbox border label="周二"></el-checkbox>
                <el-checkbox border label="周三"></el-checkbox>
                <el-checkbox border label="周四"></el-checkbox>
                <el-checkbox border label="周五"></el-checkbox>
                <el-checkbox border label="周六"></el-checkbox>
                <el-checkbox border label="周日"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否跳过节假日" prop="repeatType">
              <el-radio v-model="newShiftForm.isSkipHoliday" :label="0">是</el-radio>
              <el-radio v-model="newShiftForm.isSkipHoliday" :label="1">否</el-radio>
            </el-form-item>

            <el-form-item label="值班类型" prop="type">
              <el-select class="yn_ipt" filterable v-model="newShiftForm.type">
                <el-option
                  v-for="(item, i) in typelist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-if="isLeader || newShiftForm.orgGroup == 0">
              <el-form-item label="值班领导" prop="leaders">
                <el-select
                  class="yn_ipt"
                  v-model="newShiftForm.leaders"
                  multiple
                  filterable
                  placeholder="请输入姓名"
                >
                  <el-option
                    v-for="item in deptUserTree"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="值班警察" prop="shiftUserGuids">
                <el-select
                  class="yn_ipt"
                  v-model="newShiftForm.shiftUserGuids"
                  multiple
                  filterable
                  placeholder="请输入姓名"
                >
                  <el-option
                    v-for="item in deptUserTree"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备勤警察" prop="substituteUserGuids">
                <el-select
                  class="yn_ipt"
                  v-model="newShiftForm.substituteUserGuids"
                  multiple
                  filterable
                  placeholder="请输入姓名"
                >
                  <el-option
                    v-for="item in deptUserTree"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="值班辅警" prop="dutyAux">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-button class="yn_btn" type="primary" @click="addNewDutyAux">添加</el-button>
                  </el-col>

                  <el-col :span="12" v-for="(son, i) in newShiftForm.dutyAux" :key="i">
                    <el-form label-width="5rem" class="yn_form aux_form">
                      <el-form-item label="姓名：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.userName"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="编号：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.policeNumber"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="电话：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.phoneNumber"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="岗位：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.workPosition"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="备勤辅警" prop="preAux">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-button class="yn_btn" type="primary" @click="addNewPreAux">添加</el-button>
                  </el-col>

                  <el-col :span="12" v-for="(son, i) in newShiftForm.preAux" :key="i">
                    <el-form label-width="5rem" class="yn_form aux_form">
                      <el-form-item label="姓名：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.userName"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="编号：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.policeNumber"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="电话：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.phoneNumber"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="岗位：">
                        <el-input
                          class="yn_ipt"
                          v-model="son.workPosition"
                          @input="$forceUpdate()"
                          placeholder
                        ></el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="是否启用" prop="status">
                <el-switch
                  :active-value="0"
                  :inactive-value="1"
                  active-text="启用"
                  inactive-text="停用"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  v-model="newShiftForm.status"
                ></el-switch>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="footer">
          <el-button class="yn_btn" type="primary" @click="saveNewShift">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { inputSpecialCharactersValidator } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'
import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import { formatDate } from '@/utils/date'

export default {
  name: 'ShiftMgt',
  components: { menuTree },
  props: ['editForm', 'date', 'isLeader', 'deptId'],
  data() {
    return {
      shiftDialog: false,
      showInput: false,
      shiftFormTitle: '',
      props: {
        emitPath: false,
        multiple: true,
        value: 'userId',
        label: 'userName'
      },
      timeRange: [],
      shiftForm: {},
      newShiftForm: {},
      rules: {
        shiftName: [
          { required: true, message: '值班名称不可为空', trigger: 'blur' },
          { max: 255, message: '长度在255个字符以下', trigger: 'blur' },
          {
            validator: inputSpecialCharactersValidator,
            trigger: 'blur'
          }
        ],
        timeRange: [
          { required: true, message: '值班时间段不可为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '值班类型不可为空', trigger: 'blur' }
        ],
        // shiftUserGuids: [
        //   { required: true, message: '值班人不可为空', trigger: 'blur' }
        // ],
        shiftLeaderGuid: [
          { required: true, message: '值班领导不可为空', trigger: 'blur' }
        ]
      },
      shiftList: [],
      selectShift: '',
      deptUserTree: [],
      shiftLoading: false,
      typelist: [],
      dutyAux: [{ userName: '', type: 3 }],
      preAux: [{ userName: '', type: 4 }],
      isCenter: false,
      typeList: [
        { name: '值班领导', value: 0 },
        { name: '值班科室', value: 1 },
        { name: '指挥中心', value: 2 }
      ]
    }
  },
  created() {
    this.getType()
    this.getDeptUserTree()
    let type = getDeptType()
    console.log(type)
    if (type === '指挥中心') {
      this.isCenter = true
    } else {
      this.isCenter = false
    }
    if (this.editForm) {
      this.shiftList = this.editForm.map(item => {
        item.timeRange = []
        item.timeRange.push(new Date('2020/01/01 ' + item.startTime))
        item.timeRange.push(new Date('2020/01/01 ' + item.endTime))
        item.preAux = []
        item.dutyAux = []
        item.substituteUserGuids = []
        item.shiftUserGuids = []
        item.leaders = []
        item.users.forEach(user => {
          if (user.type == 1) {
            item.shiftUserGuids.push(user.userId)
          } else if (user.type == 2) {
            item.substituteUserGuids.push(user.userId)
          } else if (user.type == 3) {
            item.dutyAux.push({ userName: user.userName, type: 3 })
          } else if (user.type == 4) {
            item.preAux.push({ userName: user.userName, type: 4 })
          } else if (user.type == 0) {
            item.leaders.push(user.userId)
          }
        })

        return item
      })
      this.handleCurrentChange(this.shiftList[0])
    }
  },
  watch: {
    editForm: {
      deep: true,
      handler(val) {
        if (val) {
          this.shiftList = val.map(item => {
            item.timeRange = []
            item.timeRange.push(new Date('2020/01/01 ' + item.startTime))
            item.timeRange.push(new Date('2020/01/01 ' + item.endTime))
            item.preAux = []
            item.dutyAux = []
            item.substituteUserGuids = []
            item.shiftUserGuids = []
            item.leaders = []
            item.users.forEach(user => {
              if (user.type == 1) {
                item.shiftUserGuids.push(user.userId)
              } else if (user.type == 2) {
                item.substituteUserGuids.push(user.userId)
              } else if (user.type == 3) {
                item.dutyAux.push(user)
              } else if (user.type == 4) {
                item.preAux.push(user)
              } else if (user.type == 0) {
                item.leaders.push(user.userId)
              }
            })

            return item
          })
          //   this.handleCurrentChange(this.shiftList[0]);
        }
        console.log(this.shiftList)
      }
    },
    date: {
      deep: true,
      handler(val) {}
    },
    deptId: {
      deep: true,
      handler(val) {
        this.getDeptUserTree()
      }
    },
    isLeader: {
      deep: true,
      handler(val) {
        this.getDeptUserTree()
      }
    }
  },
  methods: {
    timeChange(val) {
      console.log(val)
      this.$forceUpdate()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row == null) {
        return
      }
      if (row.status === 1) {
        return 'dead-row'
      } else {
        return 'default-row'
      }
    },
    getType() {
      let that = this
      this.axios
        .get(this._global.userUrl + '/dictionary/option/shift_type')
        .then(response => {
          that.typelist = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    getDeptUserTree() {
      this.deptUserTree = []
      this.axios
        .get(
          this._global.businessUrl +
            '/duty/queryPolice/' +
            this.deptId +
            '/' +
            this.isLeader
        )
        .then(response => {
          this.deptUserTree.push(...response)
        })
    },
    handleCurrentChange(val) {
      this.selectShift = val

      this.editShift()
    },

    newShift() {
      this.shiftFormTitle = '新增班次'
      this.shiftDialog = true
      this.newShiftForm = {
        dutyAux: [],
        preAux: [],
        repeatType: [],
        isSkipHoliday: 0
      }
    },
    editShift() {
      if (this.selectShift) {
        this.shiftForm = this.selectShift
      }
      this.shiftFormTitle = '编辑班次'
    },
    addPreAux() {
      let arr = this.shiftForm.preAux
      arr.push({ userName: '', type: 4 })
      this.$set(this.shiftForm, 'preAux', arr)
      this.$forceUpdate()
    },
    addDutyAux() {
      this.shiftForm.dutyAux.push({ userName: '', type: 3 })
      this.$forceUpdate()
    },
    addNewDutyAux() {
      this.newShiftForm.dutyAux.push({ userName: '', type: 3 })
      this.$forceUpdate()
    },
    addNewPreAux() {
      this.newShiftForm.preAux.push({ userName: '', type: 4 })
      this.$forceUpdate()
    },
    resetForm() {
      this.$refs.newShiftForm.resetFields()
      this.newShiftForm = {
        dutyAux: [],
        preAux: [],
        repeatType: [],
        isSkipHoliday: 0
      }
    },
    saveShift() {
      this.$refs.shiftForm.validate(valid => {
        if (valid) {
          this.shiftLoading = true
          let shiftForm = this.setParam(this.shiftForm)

          this.axios
            .put(this._global.businessUrl + '/duty/editRotaConfig', shiftForm)
            .then(rep => {
              // 关闭弹窗
              this.shiftDialog = false
              this.shiftLoading = false
              this.$message.success('编辑成功')
              //   this.shiftForm = {}
              this.$emit('subSuccess')
            })
        } else {
          return false
        }
      })
    },

    saveNewShift() {
      this.$refs.newShiftForm.validate(valid => {
        if (valid) {
          this.shiftLoading = true
          if (this.isCenter) {
            this.newShiftForm.deptId = getPrisonId()
          } else {
            this.newShiftForm.deptId = this.deptId
            this.newShiftForm.orgGroup = 3
          }
          if (
            this.newShiftForm.dutyAux.length > 0 ||
            this.newShiftForm.dutyAux.length > 0 ||
            (this.newShiftForm.shiftUserGuids &&
              this.newShiftForm.shiftUserGuids.length) ||
            (this.newShiftForm.leaders && this.newShiftForm.leaders.length) ||
            (this.newShiftForm.substituteUserGuids &&
              this.newShiftForm.substituteUserGuids.length)
          ) {
            this.newShiftForm = this.setParam(this.newShiftForm)

            this.axios
              .post(
                this._global.businessUrl + '/duty/createRotaConfig',
                this.newShiftForm
              )
              .then(rep => {
                // 关闭弹窗
                this.shiftDialog = false
                this.shiftLoading = false
                this.$message.success('编辑成功')
                this.$emit('subSuccess')
              })
          } else {
            this.$message.error('请选择人员')
          }
        } else {
          return false
        }
      })
    },
    setParam(item) {
      item.date = formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
      item.startTime = formatDate(new Date(item.timeRange[0]), 'hh:mm:ss')
      item.endTime = formatDate(new Date(item.timeRange[1]), 'hh:mm:ss')
      item.users = []
      this.deptUserTree.map(users => {
        if (item.shiftUserGuids) {
          item.shiftUserGuids.map(son => {
            if (son == users.userId) {
              let user = JSON.parse(JSON.stringify(users))
              user.type = 1
              item.users.push(user)
            }
          })
        }
        if (item.substituteUserGuids) {
          item.substituteUserGuids.map(son => {
            if (son == users.userId) {
              let user = JSON.parse(JSON.stringify(users))
              user.type = 2
              item.users.push(user)
            }
          })
        }
        if (item.leaders) {
          item.leaders.map(son => {
            if (son == users.userId) {
              let user = JSON.parse(JSON.stringify(users))
              user.type = 0
              item.users.push(user)
            }
          })
        }
      })
      item.dutyAux.map(user => {
        item.users.push(user)
      })
      item.preAux.map(user => {
        item.users.push(user)
      })
      delete item.timeRange
      delete item.shiftUserGuids
      delete item.substituteUserGuids
      return item
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-select,
/deep/.el-range-editor {
  width: 100% !important;
}
/deep/.el-radio__label,
/deep/.el-checkbox-button__inner,
/deep/.el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__label {
  font-size: 1.1rem;
}
.from_item {
  font-size: 1.1rem !important;
}
.groups {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  cursor: pointer;
  &:hover {
    background: #dfedfe;
  }
}
.active {
  background: #2b8bef !important;
  color: #fff;
}
.group_title {
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
  padding: 1rem;
  background: #e4f3fd;
}
.aux_form {
  border: 1px solid #2b8bef;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  /deep/.el-form-item {
    margin-bottom: 1rem;
  }
}
.technology {
  .shift_box,
  .row_box,
  .el-card,
  .groups,
  .group_title {
    background: transparent;
    color: #fff;
  }
  //   .shift_box {
  //     border: 1px solid #7cdafd;
  //     box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
  //       0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  //   }
  .row_box {
    border: 1px solid #7cdafd;
  }
  .el-checkbox {
    color: #fff;
  }
}
.el-table .dead-row {
  color: red;
  cursor: pointer;
}
/deep/.el-table .default-row {
  cursor: pointer;
}
.el-checkbox {
  margin: 0;
  font-size: 1.1rem;
  border-radius: 0;
}
.el-checkbox.is-bordered.el-checkbox--medium {
  border-radius: 0;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin: 0;
}
.first {
  margin-left: 10px;
}
.shift_name_column {
  height: 80px;
  background: red;
}
.shift_box {
  width: 100%;
  background: #fbfcff;
  //   border: 1px solid #cddded;
  box-sizing: border-box;
  padding: 1rem;
}
.btn_group {
  width: 100%;
  margin: 2rem 0;
  text-align: center;
}
.row_box {
  background: #fff;
  border: 1px solid #cddded;
  .el-card {
    border-radius: 0;
    border: none;
  }
  /deep/ .el-table__body tr.current-row > td {
    background: #2b8bef;
    color: #fff;
  }
  /deep/.cell {
    font-size: 1.4rem;
    padding: 1rem 0;
  }
  .el-cascader {
    width: 100%;

    /deep/.el-input__inner {
      border: 1px solid #fff;
    }
    /deep/.el-tag.el-tag--info {
      background: #a0c7f8;
      color: #333;
      font-size: 1.4rem;
      height: 2.5rem;
    }
    /deep/.el-cascader__tags .el-tag .el-icon-close {
      background: #fff;
      color: #333;
    }
  }

  .from_item {
    border-bottom: 1px solid #aacce8;
    margin-bottom: 1rem;
    padding: 1rem 0 2rem;
  }
  /deep/.el-radio__label,
  /deep/.el-switch__label sapn,
  /deep/.el-tag {
    font-size: 1.1rem;
  }
}
</style>
