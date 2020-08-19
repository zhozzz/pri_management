<!--
 * @Description: olor:red
 * @Author: 
 * @Date: 2019-09-10 14:28:30
 * @LastEditors: fylih
 * @LastEditTime: 2019-09-20 17:21:49
 -->
<template>
  <el-dialog title="罪犯信息"
             center
             class="yn_dialog"
             :visible="criminalVisible"
             width="60%"
             @close="close">
    <div>
      <el-table :data="criminal"
                style="width: 100%">
        <el-table-column prop="zfName"
                         label="罪犯姓名"
                         show-overflow-tooltip
                         align="center" />
        <el-table-column prop="zfNum"
                         label="罪犯编号"
                         show-overflow-tooltip
                         align="center" />
        <el-table-column prop="deptName"
                         label="所属监区"
                         show-overflow-tooltip
                         align="center" />
        <el-table-column prop="isKey"
                         label="是否重点罪犯"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="{row}">
            <span v-if="row.isKey === 0">否</span>
            <span style="color:red"
                  v-else-if="row.isKey === 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="事务/生产性劳动"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="{row}">
            <span v-if="row.laborState === 0">生产</span>
            <span v-else-if="row.laborState === 1">事务</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button class="yn_btn"
                 type="primary"
                 @click="handleCloseCriminal">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['criminalVisible', 'handleCloseCriminal', 'criminal'],
  data () {
    return {

    }
  },
  methods: {
    close () { this.handleCloseCriminal() }
  }
}
</script>
