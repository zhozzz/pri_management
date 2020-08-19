<template>
  <el-dialog
    title="警察信息"
    close="yn_dialog"
    center
    :visible="policeVisible"
    width="width"
    @close="close"
  >
    <div>
      <el-table class="yn_table" :data="polices" style="width: 100%">
        <el-table-column label="警察姓名" show-overflow-tooltip align="center">
          <template slot-scope="{row}">
            <police-detail :police="{policeId:row.userId,policeName:row.userName}"></police-detail>
          </template>
        </el-table-column>
        <el-table-column prop="policeCardNo" label="警号" show-overflow-tooltip align="center" />
        <el-table-column prop="workPositionName" label="职务" show-overflow-tooltip align="center" />
        <el-table-column prop="phoneNo" label="联系方式" show-overflow-tooltip align="center" />
        <el-table-column prop="deptIdName" label="部门" show-overflow-tooltip align="center" />
      </el-table>
    </div>
    <div slot="footer">
      <el-button class="yn_btn" type="primary" @click="handleClosePolice">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import policeDetail from '@/components/police_detail'
export default {
  components: { policeDetail },
  props: ['policeVisible', 'handleClosePolice', 'polices'],
  data () {
    return {}
  },
  methods: {
    close () {
      this.handleClosePolice()
    }
  },
  watch: {
    policeVisible (val) {
      if (val === true) {
        console.log(this.polices)
      }
    }
  }
}
</script>
