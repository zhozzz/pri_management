<!--
 * @Description: 劳动新增模态框
 * @Author: fylih
 * @Date: 2019-09-09 15:51:41
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-18 18:01:23
 -->
<template>
  <el-dialog
    title="劳动信息新增"
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
            <depart-select class="yn_ipt" v-model="addParams.deptId"></depart-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="劳动类型" prop="laborName">
            <el-cascader
              v-model="addParams.laborName"
              class="yn_ipt"
              :options="labourTypeOptions"
              :show-all-levels="false"
              :props="{emitPath:false}"
            ></el-cascader>
            <!-- <el-select >
              <el-option
                v-for="item in labourTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>-->
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="劳动日期" prop="date">
            <el-date-picker
              v-model="addParams.date"
              class="yn_ipt"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="劳动地点" prop="laborPlace">
            <el-input class="yn_ipt" v-model="addParams.laborPlace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开/收工时间" prop="workTime">
            <el-time-picker
              v-model="addParams.workTime"
              is-range
              @change="changeTime"
              class="yn_ipt"
              value-format="HH:mm:ss"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间类型" prop="laborType">
            <el-radio-group v-model="addParams.laborType">
              <el-radio-button label="1">全天</el-radio-button>
              <el-radio-button label="0">半天</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否加班" prop="isOverTime">
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
          <el-form-item label="劳动罪犯" prop="groupList">
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
                :criSelct="true"
                :groupList="groupList"
                @selectionchange="selectionchange"
              />
              <div slot="footer">
                <el-button class="yn_btn" @click="groupVisible=false">确定</el-button>
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
  props: ['handleCloseAdd', 'addDetail', 'addVisible', 'labourTypeOptions'],
  data() {
    return {
      prisonId: getPrisonId(),
      addLoading: false,
      groupVisible: false,
      groupList: [],
      addParams: {
        laborType: 1,
        isOverTime: 0,
        deptId: getDeptId(),
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
        groupList: {
          required: true,
          message: '请选择罪犯',
          trigger: 'change'
        },
        laborType: {
          required: true,
          message: '请选择时间类型',
          trigger: 'change'
        }
      }
    }
  },
  methods: {
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

    getGroupList() {
      this.groupList = []
      this.axios
        .get(_global.businessUrl + '/labour/getGroup/' + this.addParams.deptId)
        .then(res => {
          if (res) {
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
          this.addParams.workTime = null
          this.addParams.prisonId = this.prisonId
          this.addParams.groupList.map((item, i) => {
            if (!item) {
              this.addParams.groupList.splice(i, 1)
            }
          })
          this.axios
            .post(_global.businessUrl + '/labour/add', this.addParams)
            .then(res => {
              console.log(res)

              this.$message.success(res)
              this.addLoading = false
              this.$emit('addSuccess', '1')
              this.handleCloseAdd()
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
          laborType: 1,
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
      this.$set(this.addParams, 'policeList', [])
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
