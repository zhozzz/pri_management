<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-17 16:09:00
 -->
<template>
  <div>
    <el-dialog
      title="罪犯死亡登记"
      :visible="dieVisible"
      width="60%"
      append-to-body
      center
      class="yn_dialog"
      @close="close"
    >
      <el-form ref="form" class="yn_form" :model="params" label-width="10rem" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="12" v-if="criminalId===null">
            <el-form-item label="选择罪犯">
              <div
                v-if="criminalInfo.zfName"
                class="yn_page_title"
              >{{criminalInfo.zfName}}-{{criminalInfo.zfNum}}</div>
              <criminalTable @input="selCriId" :isOnly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="死亡时间" prop="deathTime">
              <el-date-picker class="yn_ipt" v-model="params.deathTime" type="datetime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="死亡地点类型" prop="deathPlaceType">
              <el-select class="yn_ipt" v-model="params.deathPlaceType">
                <el-option
                  v-for="(item,i) in deathTypelist"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="23">
            <el-form-item label="备注">
              <el-input class="yn_ipt" type="textarea" v-model="params.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button v-loading="loading" class="yn_btn" @click="handleCloseDie">取 消</el-button>
        <el-button class="yn_btn" type="primary" @click="$checkMessage(handleDie)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import { formatDate } from '../../../utils/date'
import criminalTable from '@/components/criminal_table'

export default {
  props: ['dieVisible', 'handleCloseDie', 'criminalId'],
  data() {
    return {
      loading: false,
      criminalInfo: {},
      deathTypelist: [],
      params: {
        deathTime: '',
        ifInPrison: '',
        remark: ''
      },
      rules: {
        deathTime: [
          {
            type: 'date',
            required: true,
            message: '请输入死亡时间',
            trigger: 'change'
          }
        ],
        ifInPrison: [
          { required: true, message: '请选择是否狱内死亡', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    criminalTable
  },
  watch: {
    dieVisible(val) {
      if (val) {
        this.getType()
      }
    }
  },
  methods: {
    getType() {
      this.axios
        .get(this._global.userUrl + '/dictionary/option/DeathPlaceType')
        .then(response => {
          this.deathTypelist = response
          console.log(this.deathTypelist)
        })
        .catch(error => {
          console.log(error)
        })
    },
    selCriId(val) {
      this.criminalInfo = val
      this.params.criminalId = val.id
      console.log(val)
    },
    close() {
      this.criminalInfo = {}

      this.handleCloseDie()
    },
    handleDie() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.criminalId !== null) {
            this.params.criminalId = this.criminalId
          }
          let param = {}
          Object.assign(param, this.params)
          param.deathTime = formatDate(
            this.params.deathTime,
            'yyyy-MM-dd hh:mm:ss'
          )
          this.$emit('dieSubmit', param)
          this.loading = true
          this.axios
            .post(_globalUrl.businessUrl + '/criminalDeath/deathRecord', param)
            .then(res => {
              this.$message.info(res)
              this.loading = false
              this.$emit('submit', res)
              this.handleCloseDie()
            })
            .catch(() => {
              this.loading = false
              this.$message.error('系统繁忙,操作失败')
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dialog_transfer {
  display: table;
  margin: 0 auto;
}
.yn_ipt {
  width: 100%;
}
</style>
