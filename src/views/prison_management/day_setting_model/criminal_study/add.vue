<!--
 * @Description: r
 * @Author: r
 * @Date: 2019-09-10 15:22:59
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-19 18:16:57
 -->
<template>
  <el-dialog
    title="罪犯学习新增"
    class="yn_dialog"
    :visible="addVisible"
    center
    width="60%"
    @close="close"
  >
    <div>
      <el-form ref="addForm" class="yn_form" :rules="rules" :model="addParams" label-width="10rem">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="所属监区" prop="deptId">
              <depart-select class="yn_ipt" v-model="addParams.deptId"></depart-select>
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
          <el-col v-if="addParams.deptId" :span="12">
            <el-form-item label="警察列表" prop="policeList">
              <police-select
                class="yn_ipt"
                multiple
                :departId="addParams.deptId"
                v-model="addParams.policeList"
              ></police-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="addParams.deptId">
            <el-form-item label="学习罪犯" prop="criminalList">
              <!-- <criminal-table multiple :deptId="addParams.deptId" v-model="addParams.criminalList"></criminal-table> -->
              <el-button class="yn_btn" type="primary" @click="openGroup">选择罪犯</el-button>
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
                  :criSelct="true"
                  @selectionchange="selectionchange"
                />
                <div slot="footer">
                  <el-button class="yn_btn" @click="groupVisible=false">确定</el-button>
                </div>
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" :rows="2" class="yn_ipt" v-model="addParams.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" v-loading="addLoading">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(addSubmit)">确 定</el-button>
      <el-button class="yn_btn" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import criminalSelect from '@/components/criminal_select'
import policeSelect from '@/components/depart_police_select'
import _global from '@/utils/global_url'
import departSelect from '@/components/depart_select'
import criminalTable from '@/components/criminal_table'
import criminalGroupInfo from '@/components/criminal_group_info'
import { getPrisonId, getDeptId } from '@/utils'
import formatDate from '@/utils/date.js'

export default {
  props: ['addVisible', 'handleCloseAdd'],
  components: {
    criminalSelect,
    policeSelect,
    departSelect,
    criminalTable,
    criminalGroupInfo
  },
  data() {
    return {
      addLoading: false,
      groupVisible: false,
      prisonId: getPrisonId(),

      addParams: { timeType: 1, isOverTime: 0 },
      studyTime: '',
      rules: {
        date: [{ required: true, message: '请选择日期' }],
        studyTime: [{ required: true, message: '请选择时间' }],
        studyTitle: [
          { required: true, message: '请填写标题' },
          { max: 100, message: '最多输入100个字符' }
        ],
        studyPlace: [{ max: 100, message: '最多输入100个字符' }],
        policeList: [{ required: true, message: '请选择警察' }],
        criminalList: [{ required: true, message: '请选择罪犯' }],
        deptId: { required: true, message: '请选择监区', trigger: 'blur' },
        timeType: { required: true, message: '请选择', trigger: 'blur' },
        isOverTime: { required: true, message: '请选择', trigger: 'blur' }
      },
      studyList: [],
      groupList: []
    }
  },
  created() {
    this.getStudyList()
  },
  methods: {
    openGroup() {
      this.groupVisible = true
    },

    getGroupList() {
      this.groupList = []
      this.axios
        .get(_global.businessUrl + '/labour/getGroup/' + this.addParams.deptId)
        .then(res => {
          if (res) {
            console.log(res)

            this.groupList.push(...res)
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

    changeTime(val) {
      this.addParams.beginTime = val[0]
      this.addParams.endTime = val[1]
    },
    close() {
      this.handleCloseAdd()
      this.$refs.addForm.clearValidate()
    },
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
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addLoading = true
          this.addParams.prisonId = this.prisonId
          this.addParams.groupList.map((item, i) => {
            if (!item) {
              this.addParams.groupList.splice(i, 1)
            }
          })
          this.axios
            .post(_global.businessUrl + '/study/add', this.addParams)
            .then(res => {
              this.$message.success('学习登记成功')
              this.addLoading = false
              this.close()
              this.$emit('addSuccess', 1)
            })
        } else {
          return false
        }
      })
    }
  },
  watch: {
    addVisible(val) {
      if (val === true) {
        this.addParams = {
          timeType: 1,
          isOverTime: 0,
          deptId: getDeptId(),
          date: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        this.getGroupList()
      }
    },
    'addParams.deptId'() {
      this.$set(this.addParams, 'groupList', [])
      this.$set(this.addParams, 'criminalList', [])
      this.getGroupList()
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100% !important;
}
</style>
