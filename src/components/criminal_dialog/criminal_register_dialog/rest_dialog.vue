<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-02 11:34:29
 -->
<template>
  <div>
    <el-dialog
      title="罪犯休息登记"
      :visible="restVisible"
      width="60%"
      append-to-body
      center
      class="yn_dialog"
      @close="close"
    >
      <el-form ref="form" inline :model="params" label-width="12rem">
        <el-form-item label="休息地点">
          <el-select class="yn_ipt" v-model="params.place">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休息开始时间">
          <el-date-picker class="yn_ipt" v-model="params.startTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="休息结束时间">
          <el-date-picker class="yn_ipt" v-model="params.endTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="责任警察">
          <police-select class="yn_ipt" v-model="params.officerIds" multiple></police-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="yn_ipt" type="textarea" v-model="params.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button v-loading="loading" type="primary" @click="$checkMessage(handleCloseRest)">确 定</el-button>
        <el-button @click="handleCloseRest">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import policeSelect from '@/components/police_select'
export default {
  components: { policeSelect },
  props: ['restVisible', 'handleCloseRest'],
  data() {
    return {
      loading: false,
      params: {}
    }
  },
  methods: {
    close() {
      this.handleCloseRest()
    }
  }
}
</script>

<style lang="less" scoped>
.dialog_transfer {
  display: table;
  margin: 0 auto;
}
</style>
