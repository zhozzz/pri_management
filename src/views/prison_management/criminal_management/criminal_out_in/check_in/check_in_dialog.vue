<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-27 11:15:16
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-27 15:03:34
 -->
<template>
  <el-dialog
    class="yn_dialog"
    title="入监登记"
    center
    :visible="checkInVisible"
    width="width"
    @close="close"
  >
    <div>
      <el-form
        class="yn_form"
        :model="addParams"
        inline
        :rules="rules"
        ref="addForm"
        label-width="10rem"
      >
        <el-form-item label="姓名" prop="zfName">
          <el-input class="yn_ipt" v-model="addParams.zfName"></el-input>
        </el-form-item>
        <el-form-item label="罪犯编号" prop="zfNum">
          <el-input class="yn_ipt" v-model="addParams.zfNum"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="zfCard">
          <el-input class="yn_ipt" v-model="addParams.zfCard"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(addSubmit)">确 定</el-button>
      <el-button class="yn_btn" @click="handleCloseCheckIn">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { expnoraml, isIDCard, isEnName, noChinese } from '@/utils/form_valid'
import _globalUrl from '@/utils/global_url'
export default {
  props: ['checkInVisible', 'handleCloseCheckIn'],
  data () {
    return {
      rules: {
        zfName: [
          { required: true, message: '姓名不能为空' },
          { validator: expnoraml('姓名') },
          { validator: isEnName },
          { max: 20, message: '姓名不能超过20个字符' }
        ],
        zfCard: [{ validator: isIDCard }],
        zfNum: [
          { max: 40, message: '罪犯编号长度不能超过40' },
          { validator: noChinese }
        ]
      },
      addParams: {
        zfName: '',
        zfNum: '',
        zfCard: ''
      }
    }
  },
  methods: {
    close () {
      this.handleCloseCheckIn()
    },
    addSubmit () {
      if (this.addParams.zfCard === '') {
        this.addParams.zfCard = null
      }
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          return false
        } else {
          this.axios
            .post(_globalUrl.businessUrl + '/criminalInOut/add', this.addParams)
            .then(res => {
              this.$message.success('新增成功')
              this.handleCloseCheckIn()
              this.$emit('addSuc')
            })
        }
      })
    }
  },
  watch: {
    checkInVisible (val) {
      if (val === true) {
        this.addParams = {
          createUser: JSON.parse(localStorage.getItem('user')).userGuid,
          deptId: JSON.parse(localStorage.getItem('user')).prisonId
        }
      }
    }
  }
}
</script>
