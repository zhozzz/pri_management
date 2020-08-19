<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 11:15:16
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-27 15:03:19
 -->
<template>
  <el-dialog class="yn_dialog" title="编辑" center :visible="editVisible" width="60%" @close="close">
    <div>
      <el-form
        class="yn_form"
        :model="editParams"
        inline
        :rules="rules"
        ref="editForm"
        label-width="7rem"
      >
        <el-row :gutter="1">
          <el-col :span="11">
            <el-form-item label="罪犯编号" prop="zfNum">
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
              <depart-select v-model="editParams.deptId"></depart-select>
              <!-- <el-cascader :options="deptOptions"
                           v-model="editParams.deptId"
                           :props="deptProp"
                           @change="deptIdChange">
              </el-cascader>-->
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="生日">
              <el-date-picker
                class="yn_ipt"
                v-model="editParams.zfBirth"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
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
              <el-select class="yn_ipt" v-model="editParams.zfAccusationValue">
                <el-option
                  v-for="item in zfAccusationOPtions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
              <el-input class="yn_ipt" v-model="editParams.height" placeholder="cm"></el-input>
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
              <el-input class="yn_ipt" v-model="editParams.weight" placeholder="kg"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
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
import { expnoraml, isIDCard, isEnName } from '@/utils/form_valid'
export default {
  components: { departSelect },
  props: ['editVisible', 'handleCloseEdit', 'editList'],
  data () {
    return {
      rules: {
        zfName: [
          { required: true, message: '姓名不能为空' },
          { validator: expnoraml('姓名') },
          { validator: isEnName },
          { max: 20, message: '姓名不能超过20个字符' }
        ],
        zfCard: [{ validator: isIDCard, trigger: 'blur' }],
        zfNum: [{ max: 40, message: '编号长度最大为40' }]
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
      deptProp: {
        value: 'id',
        label: 'departName',
        children: 'list',
        checkStrictly: true
      }
    }
  },
  methods: {
    close () {
      this.handleCloseEdit()
    },
    editSubmit () {
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
    queryCriminalType () {
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/CrimeType')
        .then(res => {
          this.zfTypeOptions = res
        })
      this.axios
        .get(_globalUrl.userUrl + '/dictionary/option/CriminalName')
        .then(res => {
          this.zfAccusationOPtions = res
        })
    }
  },
  watch: {
    editVisible (val) {
      if (val === true) {
        this.queryCriminalType()
        this.editParams = Object.assign({}, this.editList)
        this.editParams.updateUser = JSON.parse(
          localStorage.getItem('user')
        ).userGuid
      }
    }
  }
}
</script>
<style lang="less" scoped>
.yn_ipt {
  width: 100% !important;
}
/deep/.el-form__item {
  width: 100%;
}
</style>
