<!--
 * @Description: r
 * @Author:  r
 * @Date: 2019-09-10 19:20:45
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-19 18:03:55
 -->
<template>
  <el-dialog
    title="罪犯休息新增"
    class="yn_dialog"
    :visible="addVisible"
    center
    width="60%"
    @close="close"
  >
    <div>
      <el-form ref="addForm" class="yn_form" :rules="rules" :model="addParams" label-width="10rem">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item label="所属监区" prop="deptId">
              <depart-select class="yn_ipt" v-model="addParams.deptId"></depart-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="开始/结束时间" prop="restTime">
              <el-time-picker
                class="yn_ipt"
                is-range
                @change="changeTime"
                v-model="addParams.restTime"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="休息日期" prop="date">
              <el-date-picker
                class="yn_ipt"
                v-model="addParams.date"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="时间类型" prop="timeType">
              <el-radio-group v-model="addParams.timeType">
                <el-radio-button label="1">全天</el-radio-button>
                <el-radio-button label="0">半天</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="是否延时" prop="isOverTime">
              <el-radio-group v-model="addParams.isOverTime">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="addParams.deptId" :span="11" :offset="1">
            <el-form-item label="警察列表" prop="policeList">
              <police-select
                class="yn_ipt"
                :departId="addParams.deptId"
                multiple
                v-model="addParams.policeList"
              ></police-select>
            </el-form-item>
          </el-col>
          <el-col v-if="addParams.deptId" :span="11">
            <el-form-item label="休息罪犯" prop="criminalList">
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
          <el-col :span="23">
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
import criminalGroupInfo from '@/components/criminal_group_info'
import { getPrisonId, getDeptId } from '@/utils'
import formatDate from '@/utils/date.js'

export default {
  props: ['addVisible', 'handleCloseAdd'],
  components: { criminalSelect, policeSelect, departSelect, criminalGroupInfo },
  data() {
    return {
      addLoading: false,
      addParams: { timeType: 1, isOverTime: 0 },
      studyTime: '',
      prisonId: getPrisonId(),
      groupVisible: false,
      groupList: [],
      rules: {
        date: [{ required: true, message: '请选择日期' }],
        restTime: [{ required: true, message: '请选择时间' }],
        policeList: [{ required: true, message: '请选择警察' }],
        criminalList: [{ required: true, message: '请选择罪犯' }],
        deptId: { required: true, message: '请选择监区', trigger: 'blur' }
      }
    }
  },
  methods: {
    changeTime(val) {
      this.addParams.beginTime = val[0]
      this.addParams.endTime = val[1]
    },

    close() {
      this.handleCloseAdd()
      this.$refs.addForm.clearValidate()
    },

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
            .post(_global.businessUrl + '/rest/add', this.addParams)
            .then(res => {
              this.$message.success('休息登记成功')
              this.close()
              this.$emit('addSuccess', 1)
              this.addLoading = false
            })
            .catch(() => {
              this.addLoading = false
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

        // this.addParams.deptId = JSON.parse(localStorage.getItem('user')).deptGuid
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
