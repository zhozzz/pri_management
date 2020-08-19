<!--
 * @Description: 罪犯登记弹出框
 * @Author:
 * @Date: 2019-08-23 20:31:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2019-11-27 14:55:17
 -->
<template>
  <div>
    <el-dialog
      title="罪犯学习登记"
      :visible="studyVisible"
      width="60%"
      append-to-body
      center
      class="yn_dialog"
      @close="close"
    >
      <el-form ref="form" class="yn_form" inline :model="params" label-width="12rem">
        <el-form-item label="学习地点">
          <el-select class="yn_ipt" v-model="params.place">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习内容">
          <el-input class="yn_ipt" v-model="params.content"></el-input>
        </el-form-item>
        <el-form-item label="学习开始时间">
          <el-date-picker class="yn_ipt" v-model="params.startTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="学习结束时间">
          <el-date-picker class="yn_ipt" v-model="params.endTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="带班警察">
          <police-select v-model="params.users" multiple></police-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="yn_ipt" type="textarea" v-model="params.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" @click="handleCloseStudy">取 消</el-button>
        <el-button class="yn_btn" type="primary" @click="$checkMessage(handleCloseStudy)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import policeSelect from '@/components/police_select'
export default {
  components: { policeSelect },
  props: ['studyVisible', 'handleCloseStudy'],
  data() {
    return {
      params: {}
    }
  },
  methods: {
    close() {
      this.handleCloseStudy()
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
