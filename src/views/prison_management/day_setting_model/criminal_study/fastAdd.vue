<!--
 * @Description: 劳动新增模态框
 * @Author: fylih
 * @Date: 2019-09-09 15:51:41
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-19 17:51:57
 -->
<template>
  <el-dialog
    title="学习信息新增"
    class="yn_dialog"
    center
    :visible="addVisible"
    width="60%"
    @close="close"
  >
    <el-form ref="addForm" class="yn_form" :model="addParams" :rules="rules" label-width="8rem">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="所属监区" prop="deptId">
            <depart-select :disabled="true" class="yn_ipt" v-model="addParams.deptId"></depart-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学习标题" prop="studyTitle">
            <el-input class="yn_ipt" v-model="addParams.studyTitle"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="学习日期" prop="date">
            <el-date-picker
              class="yn_ipt"
              v-model="addParams.date"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始/结束时间" prop="studyTime">
            <el-time-picker
              class="yn_ipt"
              is-range
              @change="changeTime"
              v-model="addParams.studyTime"
              value-format="HH:mm:ss"
            ></el-time-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="学习地点" prop="studyPlace">
            <el-input class="yn_ipt" v-model="addParams.studyPlace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学习类型">
            <el-select v-model="addParams.studyType" class="yn_ipt" placeholder="请选择学习类型">
              <el-option
                v-for="item in studyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间类型" prop="timeType">
            <el-radio-group v-model="addParams.timeType">
              <el-radio-button label="1">全天</el-radio-button>
              <el-radio-button label="0">半天</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否延时" prop="isOverTime">
            <el-radio-group v-model="addParams.isOverTime">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="addParams.deptId" :span="20">
          <el-form-item label="带班警察" prop="policeList">
            <police-select
              class="yn_ipt"
              :departId="addParams.deptId"
              v-model="addParams.policeList"
              multiple
            ></police-select>
          </el-form-item>
        </el-col>
        <el-col :span="20" v-if="addParams.deptId">
          <el-form-item label="学习罪犯" prop="groupList">
            <el-button type="text" class="yn_text_btn" @click="openGroup">编辑罪犯</el-button>
            <el-dialog
              title="选择罪犯"
              append-to-body
              class="yn_dialog"
              center
              :visible.sync="groupVisible"
              width="60%"
            >
              <criminalGroupInfo
                :groupList="groupList"
                :laborId="addParams.id"
                @selectionchange="groupChange"
                @openCri="openCri"
                :showSel="false"
              >
                <template slot="dialog_btns">
                  <el-table-column align="center" label="操作">
                    <template slot-scope="{row,$index}">
                      <el-button type="text" class="yn_text_btn" @click="removeCri(row,$index)">移除</el-button>
                    </template>
                  </el-table-column>
                </template>
              </criminalGroupInfo>
              <div slot="footer">
                <el-button type="primary" class="yn_btn" @click="openNewGroup()">添加罪犯</el-button>
                <el-button
                  type="primary"
                  class="yn_btn"
                  v-if="selGroups.length > 0"
                  @click="$checkMessage(() => delGroups())"
                >移除罪犯</el-button>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="备注">
            <el-input type="textarea" class="yn_ipt" :rows="2" v-model="addParams.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" v-loading="addLoading">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(addSubmit)">确 定</el-button>
      <el-button class="yn_btn" @click="handleCloseAdd">取 消</el-button>
    </div>

    <el-dialog
      title="添加罪犯"
      append-to-body
      class="yn_dialog"
      center
      :visible.sync="addNewVisible"
      width="60%"
    >
      <criminalGroupInfo
        :groupList="newGroupList"
        :laborId="addParams.id"
        :selct="true"
        :criSelct="true"
        :showSel="false"
        @selectionchange="newGroupChange"
      ></criminalGroupInfo>

      <div slot="footer">
        <el-button type="primary" class="yn_btn" @click="addGroups">添加</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import _global from '@/utils/global_url'
import policeSelect from '@/components/depart_police_select'
import criminalSelect from '@/components/criminal_select'
import criminalTable from '@/components/criminal_table'
import departSelect from '@/components/depart_select'
import criminalGroupInfo from '@/components/criminal_group_info'
import { getPrisonId, getDeptId } from '@/utils'
import formatDate from '@/utils/date.js'

export default {
  components: {
    policeSelect,
    criminalSelect,
    departSelect,
    criminalTable,
    criminalGroupInfo
  },
  props: ['handleCloseAdd', 'addVisible', 'fastAddForm'],
  data() {
    return {
      prisonId: getPrisonId(),
      addLoading: false,
      groupVisible: false,
      groupList: [],
      addParams: {
        laborType: 1,
        isOverTime: 0,
        date: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      },
      rules: {
        policeList: {
          required: true,
          message: '请选择带班警察',
          trigger: 'blur'
        },
        laborPlace: [
          {
            required: true,
            message: '请输入地点',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur'
          }
        ],

        workTime: {
          required: true,
          message: '请选择开/收工时间',
          trigger: 'blur'
        },
        laborName: {
          required: true,
          message: '请选择劳动项目',
          trigger: 'blur'
        },
        date: { required: true, message: '请选择劳动日期', trigger: 'blur' },
        deptId: { required: true, message: '请选择监区', trigger: 'blur' },
        // groupList: {
        //   required: true,
        //   message: "请选择罪犯",
        //   trigger: "change"
        // },
        laborType: {
          required: true,
          message: '请选择时间类型',
          trigger: 'change'
        }
      },
      addNewVisible: false,
      newGroupList: [],
      selNewGroups: [],
      selGroups: [],
      studyList: [],
      openGroopData: {}
    }
  },
  created() {
    this.getStudyList()
  },
  methods: {
    getStudyList() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/studyType')
        .then(res => {
          console.log(res)
          this.studyList = res
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    changeTime(val) {
      this.addParams.beginTime = val[0]
      this.addParams.endTime = val[1]
    },
    close() {
      this.$refs.addForm.resetFields()
      this.handleCloseAdd()
    },
    openGroup() {
      this.groupVisible = true
    },
    getNewList() {
      this.axios
        .get(
          _global.businessUrl +
            '/labour/getNoChooseGroup/' +
            this.addParams.deptId +
            '/' +
            this.addParams.id
        )
        .then(res => {
          console.log(res)
          this.newGroupList = res
        })
    },
    openNewGroup() {
      this.addNewVisible = true
    },
    getGroupList(id) {
      this.groupList = []
      this.axios
        .get(_global.businessUrl + '/labour/criminalInfoByGroup/' + id)
        .then(res => {
          this.groupList = res
        })

      this.axios
        .get(_global.businessUrl + '/study/selStudyPolices', {
          params: { flag: 0, relateId: id }
        })
        .then(res => {
          if (res.rows) {
            let arr = []
            arr = res.rows.map(item => item.userId)
            console.log(this.addParams)

            this.$set(this.addParams, 'policeList', arr)
          }
        })
    },
    selectionchange(val) {
      if (val) {
        let arr = val.map(item => {
          return item.id
        })
        this.$set(this.addParams, 'groupList', arr)

        let idList = []
        val.map(item => {
          if (item.criminalIdList && item.criminalIdList.length > 0) {
            idList.push(...item.criminalIdList)
          } else {
            item.criminalList.map(son => {
              idList.push(son.id)
            })
          }
        })

        this.$set(this.addParams, 'criminalList', idList)
      }
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addLoading = true
          this.addParams.workTime = null
          this.addParams.prisonId = this.prisonId
          delete this.addParams.id
          this.addParams.groupList = []
          this.groupList.map((item, i) => {
            if (item.id) {
              this.addParams.groupList.push(item.id)
            }
          })

          let idList = []

          this.groupList.map(item => {
            // if (item.criminalIdList && item.criminalIdList.length > 0) {
            //   idList.push(...item.criminalIdList)
            // } else {
            item.criminalList.map(son => {
              idList.push(son.id)
            })
            // }
            this.$set(this.addParams, 'criminalList', idList)
          })
          this.axios
            .post(_global.businessUrl + '/study/add', this.addParams)
            .then(res => {
              this.$message.success(res)
              this.addLoading = false
              this.$emit('addSuccess', '1')
              this.handleCloseAdd()
            })
        } else {
          return false
        }
      })
    },
    addGroups() {
      console.log('selNewGroups:', this.selNewGroups)
      console.log('groupList:', this.groupList)

      this.selNewGroups.map(item => {
        let flag = false
        this.groupList.map(obj => {
          delete obj.selCriminalList
          if (!obj.criminalIdList) {
            obj.criminalIdList = []
          }
          if (obj.id == item.id) {
            flag = true
            if (item.criminalIdList && item.criminalIdList.length > 0) {
              item.criminalIdList.map(newCri => {
                // let criFlag = false
                item.criminalList.map(oldCri => {
                  if (newCri == oldCri.id) {
                    // criFlag = true
                    obj.criminalList.push(oldCri)
                    obj.criminalIdList.push(newCri)
                  }
                })
                // if (!criFlag) {
                //   obj.criminalList.push(newCri)
                // }
              })
            } else {
              item.criminalList.map(newCri => {
                let criFlag = false
                obj.criminalList.map(oldCri => {
                  if (newCri.id == oldCri) {
                    criFlag = true
                  }
                })
                if (!criFlag) {
                  obj.criminalList.push(newCri)
                }
              })
            }
          }
        })
        if (!flag) {
          let data = JSON.parse(JSON.stringify(item))
          if (item.criminalIdList && item.criminalIdList.length > 0) {
            data.criminalList = []
            item.criminalList.map(k => {
              item.criminalIdList.map(obj => {
                if (k.id == obj) {
                  data.criminalList.push(k)
                }
              })
            })
          }

          this.groupList.push(data)
        }
      })

      //删除未选列表中选中的
      this.selNewGroups.map((obj, j) => {
        this.newGroupList.map((item, a) => {
          if (obj.id == item.id) {
            if (obj.criminalIdList && obj.criminalIdList.length > 0) {
              obj.criminalIdList.map(cri => {
                item.criminalList.map((oldCri, i) => {
                  if (oldCri.id == cri) {
                    item.criminalList.splice(i, 1)
                  }
                })
              })
            } else {
              obj.criminalList.map(cri => {
                item.criminalList.map((oldCri, i) => {
                  if (oldCri.id == cri.id) {
                    item.criminalList.splice(i, 1)
                  }
                })
              })
            }
          }
          if (item.criminalList.length == 0) {
            this.newGroupList.splice(a, 1)
          }
        })
      })
      this.addNewVisible = false
    },
    newGroupChange(val) {
      this.selNewGroups = val
    },
    delGroups() {
      this.selGroups.map(son => {
        this.groupList.map((item, i) => {
          if (item.id == son.id) {
            this.groupList.splice(i, 1)
          }
        })
      })

      this.selGroups.map(delGroup => {
        let flag = false
        this.newGroupList.map(newGroup => {
          if (newGroup.id == delGroup.id) {
            flag = true
            newGroup.criminalList.push(...delGroup.criminalList)
          }
        })
        if (!flag) {
          this.newGroupList.push(delGroup)
        }
      })
    },
    groupChange(val) {
      this.selGroups = val
    },
    removeCri(val, i) {
      let flag = false
      this.newGroupList.map(item => {
        if (item.id == this.openGroopData.id) {
          flag = true
          item.criminalList.push(val)
        }
      })
      if (!flag) {
        let data = JSON.parse(JSON.stringify(this.openGroopData))
        data.criminalList = [val]
        this.newGroupList.push(data)
      }
      this.groupList.map((item, j) => {
        if (item.id == this.openGroopData.id) {
          item.criminalList.splice(i, 1)
        }
        if (item.criminalList.length == 0) {
          this.groupList.splice(j, 1)
        }
      })
    },
    openCri(val) {
      console.log(val)
      this.openGroopData = val
      //   this.openGroopData = JSON.parse(JSON.stringify(val))
    }
  },
  watch: {
    addVisible(val) {},
    fastAddForm: {
      deep: true,
      handler(val) {
        if (val) {
          this.addParams = JSON.parse(JSON.stringify(val))
          this.addParams.date = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')

          this.$set(this.addParams, 'studyTime', [
            this.addParams.beginTime,
            this.addParams.endTime
          ])

          this.getGroupList(val.id)
          this.getNewList()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100% !important;
}
</style>
