<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 11:15:16
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-08 16:20:52
 -->
<template>
  <el-dialog class="yn_dialog" title="编辑" center :visible="editVisible" width="60%" @close="close">
    <div>
      <el-form class="yn_form" :model="editParams" :rules="rules" ref="editForm" label-width="8rem">
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="罪犯编号">
              <el-input class="yn_ipt" v-model="editParams.zfNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="身份证号" prop="zfCard">
              <el-input class="yn_ipt" v-model="editParams.zfCard"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="罪犯姓名" prop="zfName">
              <el-input class="yn_ipt" v-model="editParams.zfName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="性别">
              <el-select class="yn_ipt" v-model="editParams.zfGender">
                <el-option
                  v-for="item in genders"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="所属监区">
              <depart-select class="yn_ipt" @input="deptChange" v-model="editParams.deptId"></depart-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="所在房间">
              <el-select class="yn_ipt" v-loading="roomLoading" v-model="editParams.roomId">
                <el-option
                  v-for="item in roomList"
                  :key="item.id"
                  :label="item.roomId"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="国籍">
              <el-input class="yn_ipt" v-model="editParams.zfCountry"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="籍贯">
              <el-input class="yn_ipt" v-model="editParams.zfBornPlace"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="分管等级">
              <el-select class="yn_ipt" v-model="editParams.zfTypeValue">
                <el-option
                  v-for="item in zfTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="入监时间">
              <el-input class="yn_ipt" disabled v-model="editParams.intoTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="罪名">
              <el-select
                class="yn_ipt"
                filterable
                multiple
                v-model="editParams.criminalAccusations"
              >
                <el-option
                  v-for="item in zfAccusationOPtions"
                  :key="item.value"
                  :label="item.label"
                  :value="{value:item.value,label:item.label}"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="创建时间">
              <el-input class="yn_ipt" disabled v-model="editParams.createTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="身高">
              <el-input class="yn_ipt" v-model="editParams.height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="年龄">
              <el-input class="yn_ipt" v-model="editParams.age"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="体重">
              <el-input class="yn_ipt" v-model="editParams.weight"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="生日">
              <!-- <el-date-picker
                class="yn_ipt"
                v-model="editParams.zfBirth"
                value-format="yyyy-MM-dd"
                type="date"
              ></el-date-picker>-->
              <div
                class="el-form-item__label"
                v-if="editParams.zfBirth"
              >{{editParams.zfBirth}}-{{formatDate(new Date(),'yyyy-MM-dd')}}</div>
              <div class="el-form-item__label" v-else>无</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="最近更新时间">
              <el-input class="yn_ipt" disabled v-model="editParams.updateTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(editSubmit)">确 定</el-button>
      <el-button class="yn_btn" @click="handleCloseEdit">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { genders } from '@/utils/option_label'
import _globalUrl from '@/utils/global_url'
import departSelect from '@/components/depart_select'
import { expnoraml, isIDCard } from '@/utils/form_valid'
import { formatDate } from '@/utils/date'

export default {
  components: { departSelect },
  props: ['editVisible', 'handleCloseEdit', 'editList'],
  data() {
    return {
      rules: {
        zfName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: expnoraml('姓名'), trigger: 'blur' }
        ],
        zfCard: [{ validator: isIDCard, trigger: 'blur' }],
        zfNum: [
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        zfCountry: [
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          },
          { validator: expnoraml('国籍'), trigger: 'blur' }
        ],
        zfBornPlace: [
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur'
          },
          { validator: expnoraml('籍贯'), trigger: 'blur' }
        ]
      },
      editParams: {},
      genders: genders,
      deptOptions: {},
      isKeyOptions: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否'
        }
      ],
      zfAccusationOPtions: [],
      zfTypeOptions: [],
      roomList: [],
      roomLoading: false
    }
  },
  methods: {
    close() {
      this.handleCloseEdit()
      this.$refs.editForm.clearValidate()
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          return false
        } else {
          this.axios
            .put(_globalUrl.businessUrl + '/criminalBase/edit', this.editParams)
            .then(res => {
              this.$message.success('更新成功')
              this.handleCloseEdit()
              this.$emit('updateSuc')
            })
        }
      })
    },
    queryCriminalType() {
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/CrimeType')
        .then(res => {
          this.zfTypeOptions = res
        })
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/options/CriminalName')
        .then(res => {
          this.zfAccusationOPtions = res
        })
    },
    queryRoom(data) {
      this.roomLoading = true
      this.axios
        .get(_globalUrl.userUrl + '/room/getRoomsUnderWard/' + data)
        .then(res => {
          this.roomLoading = false

          this.roomList = res
        })
    },
    deptChange(val) {
      this.queryRoom(val)
    }
  },
  watch: {
    editVisible(val) {
      if (val === true) {
        this.queryCriminalType()
        this.editParams = Object.assign({}, this.editList)
        this.editParams.updateUser = JSON.parse(
          localStorage.getItem('user')
        ).userGuid
        this.queryRoom(this.editParams.deptId)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100%;
}
/deep/.el-form__item {
  width: 100%;
}
</style>
