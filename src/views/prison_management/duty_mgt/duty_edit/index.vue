 
<template>
  <div class="yn_page">
    <div class="shift_box">
      <el-row class="row_box">
        <el-col :span="4">
          <el-table
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
        </el-col>
        <el-col :span="20" class="card">
          <el-card shadow="never" class="card" v-if="selectShift&&selectShift!=null">
            <el-form
              class="yn_form"
              :model="shiftForm"
              ref="shiftForm"
              @submit.native.prevent
              :rules="rules"
            >
              <div v-if="isLeader||shiftForm.orgGroup==0">
                <el-form-item label="值班领导" prop="leaders">
                  <el-select
                    class="yn_ipt"
                    v-model="shiftForm.leaders"
                    multiple
                    filterable
                    reserve-keyword
                    @change="function(){$forceUpdate()}"
                    placeholder="请输入姓名"
                  >
                    <el-option
                      v-for="(item,i) in deptUserTree"
                      :key="i"
                      :label="item.userName"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-else>
                <el-row class="from_item">
                  <el-col :span="6">值班警察：</el-col>
                  <el-form-item prop="shiftUserGuids">
                    <el-col :span="18">
                      <!-- <el-cascader
                        :props="props"
                        class="yn_ipt yn_cascader"
                        v-model="shiftForm.shiftUserGuids"
                        filterable
                        placeholder=" "
                        :options="deptUserTree"
                        :show-all-levels="false"
                      ></el-cascader>-->
                      <el-select
                        class="yn_ipt"
                        v-model="shiftForm.shiftUserGuids"
                        multiple
                        filterable
                        reserve-keyword
                        @change="function(){$forceUpdate()}"
                        placeholder="请输入姓名"
                      >
                        <el-option
                          v-for="(item,i) in deptUserTree"
                          :key="i"
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
                    <!-- <el-cascader
                      class="yn_ipt yn_cascader"
                      :props="props"
                      v-model="shiftForm.substituteUserGuids"
                      placeholder=" "
                      filterable
                      :options="deptUserTree"
                      :show-all-levels="false"
                    ></el-cascader>-->
                    <el-select
                      class="yn_ipt"
                      v-model="shiftForm.substituteUserGuids"
                      multiple
                      filterable
                      reserve-keyword
                      @change="function(){$forceUpdate()}"
                      placeholder="请输入姓名"
                    >
                      <el-option
                        v-for="(item,i) in deptUserTree"
                        :key="i"
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
                      <el-col :span="12" v-for="(son,i) in shiftForm.dutyAux" :key="i">
                        <el-form label-width="6rem" class="yn_form aux_form">
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
                      <el-col :span="12" v-for="(son,i) in shiftForm.preAux" :key="i">
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
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="btn_group">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(saveShift)">保存</el-button>
      <el-button class="yn_btn" type="primary" @click="colse">取消</el-button>
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
  props: ['editForm', 'date', 'isLeader', 'colse', 'deptId', 'editIndex'],
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
      ],
      elIndex: 0
    }
  },
  created() {
    this.getType()
    this.getDeptUserTree()
    let type = getDeptType()
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
            item.dutyAux.push(user)
          } else if (user.type == 4) {
            item.preAux.push(user)
          } else if (user.type == 0) {
            item.leaders.push(user.userId)
          }
        })

        return item
      })
      //   if (!this.editIndex) {
      //     this.elIndex = 0
      //   } else {
      //     this.elIndex = this.editIndex
      //   }
      //   this.handleCurrentChange(this.shiftList[this.elIndex])
    } else {
      this.shiftList = []
    }
  },
  watch: {
    deptId: {
      handler(val) {
        console.log(val)

        this.getDeptUserTree()
      }
    },
    editForm: {
      deep: true,
      handler(val) {
        if (val && val.length > 0) {
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
          //   this.handleCurrentChange(this.shiftList[this.elIndex])
        } else {
          this.shiftList = []
        }
      }
    },
    date: {
      deep: true,
      handler(val) {}
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
      console.log(this.deptId)
      if (this.deptId) {
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
      }
    },
    handleCurrentChange(val) {
      this.selectShift = val

      this.editShift()
    },
    change(val) {
      console.log(val)
      this.$forceUpdate()
    },

    editShift() {
      if (this.selectShift) {
        // this.shiftForm = this.selectShift
        this.$set(this, 'shiftForm', this.selectShift)
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
      this.newShiftForm = {}
    },
    saveShift() {
      this.shiftLoading = true

      let list = this.shiftList.map(item => {
        item.date = formatDate(new Date(this.date), 'yyyy-MM-dd hh:mm:ss')
        item.startTime = formatDate(new Date(item.timeRange[0]), 'hh:mm:ss')
        item.endTime = formatDate(new Date(item.timeRange[1]), 'hh:mm:ss')
        item.users = []
        this.deptUserTree.map(users => {
          if (item.shiftUserGuids) {
            item.shiftUserGuids.map(son => {
              if (son == users.userId) {
                users.type = 1
                item.users.push(users)
              }
            })
          }
          if (item.substituteUserGuids) {
            item.substituteUserGuids.map(son => {
              if (son == users.userId) {
                users.type = 2
                item.users.push(users)
              }
            })
          }
          if (item.leaders) {
            item.leaders.map(son => {
              if (son == users.userId) {
                users.type = 0
                item.users.push(users)
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
      })

      this.axios
        .put(this._global.businessUrl + '/duty/resetRota', this.shiftList)
        .then(rep => {
          // 关闭弹窗
          this.shiftDialog = false
          this.shiftLoading = false
          this.$message.success('编辑成功')
          this.shiftForm = {}
          this.colse()
          this.$emit('subSuccess')
        })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-select,
/deep/.el-range-editor {
  width: 100% !important;
}
.from_item {
  font-size: 1.1rem !important;
  margin-bottom: 1rem;
}
.card {
  // border-left: 1px solid #2b8bef;
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
  .el-card {
    background: transparent;
    color: #fff;
  }
  .shift_box {
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
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
  border: 1px solid #cddded;
  box-sizing: border-box;
  padding: 3rem;
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
  /deep/.el-switch__label sapn {
    font-size: 1.1rem;
  }
}
</style>
