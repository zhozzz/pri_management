<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-28 17:05:28
 * @LastEditTime: 2020-03-24 16:45:56
 * @LastEditors: zhuhao
 -->
<template>
  <menuTree :menuList="['系统管理','班次管理']">
    <div v-if="typeFlag">
      <dutyEdit
        :editForm="editForm"
        :date="selDate"
        :isLeader="false"
        :deptId="deptId"
        @subSuccess="getShiftList"
      />
    </div>
    <div v-else class="yn_page_title">暂无权限</div>
  </menuTree>
</template>

<script>
import { inputSpecialCharactersValidator } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'
import dutyEdit from '@/components/duty_edit/'
import { getPrisonId, getDeptId, getDeptType } from '@/utils'

export default {
  name: 'ShiftMgt',
  components: { menuTree, dutyEdit },

  data() {
    return {
      deptId: getDeptId(),
      deptGuId: getDeptId(),
      selDate: new Date(),
      editForm: [],
      typeFlag: false
    }
  },
  created() {
    let type = getDeptType()
    if (type == '指挥中心') {
      this.deptId = getPrisonId()
    } else {
      this.deptId = getDeptId()
    }
    if (
      type == '指挥中心' ||
      type == '特警队' ||
      type == '监区' ||
      type == '医院'
    ) {
      this.typeFlag = true
    }
    this.getShiftList()
  },
  methods: {
    getShiftList() {
      this.axios
        .get(
          this._global.businessUrl + '/duty/checkRotaConfig/' + this.deptGuId
        )
        .then(response => {
          console.log(response)
          this.editForm = response
        })
    }
  }
}
</script>
<style lang="less" scoped>
.from_item {
  font-size: 1.2rem !important;
}
.technology {
  .shift_box,
  .row_box,
  .el-card {
    background: transparent;
    color: #fff;
  }
  .shift_box {
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
  .row_box {
    border: 1px solid #7cdafd;
  }
  .el-checkbox {
    color: #fff;
  }
}
.el-table .dead-row {
  color: red;
  cursor: pointer;
}
/deep/.el-table .default-row {
  cursor: pointer;
}
.el-checkbox {
  margin: 0;
  font-size: 1.2rem;
  border-radius: 0;
}
.el-checkbox.is-bordered.el-checkbox--medium {
  border-radius: 0;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin: 0;
}
.first {
  margin-left: 10px;
}
.shift_name_column {
  height: 80px;
  background: red;
}
.shift_box {
  width: 100%;
  background: #fbfcff;
  border: 1px solid #cddded;
  box-sizing: border-box;
  padding: 3rem;
}
.row_box {
  background: #fff;
  border: 1px solid #cddded;
  .el-card {
    border-radius: 0;
    border: none;
  }
  /deep/ .el-table__body tr.current-row > td {
    background: #2b8bef;
    color: #fff;
  }
  /deep/.cell {
    font-size: 1.4rem;
    padding: 1rem 0;
  }
  .el-cascader {
    width: 100%;

    /deep/.el-input__inner {
      border: 1px solid #fff;
    }
    /deep/.el-tag.el-tag--info {
      background: #a0c7f8;
      color: #333;
      font-size: 1.4rem;
      height: 2.5rem;
    }
    /deep/.el-cascader__tags .el-tag .el-icon-close {
      background: #fff;
      color: #333;
    }
  }
  .btn_group {
    width: 100%;
    margin: 2rem 0;
  }
  .from_item {
    border-bottom: 1px solid #aacce8;
    margin-bottom: 1rem;
    padding: 1rem 0 2rem;
  }
  /deep/.el-radio__label,
  /deep/.el-switch__label sapn {
    font-size: 1.2rem;
  }
}
</style>
