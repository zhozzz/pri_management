<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-12-13 10:51:59
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-25 18:48:07
 -->
<template>
  <td :rowspan="row" :colspan="col">
    <el-popover
      popper-class="td-pop"
      placement="top"
      trigger="click"
      :width="xpwidth"
      ref="popover"
    >
      <div class="pop_main" ref="div1">
        <div v-if="!editFLag">
          <span>{{attentions}}</span>
          <span class="icon">
            <i class="el-icon-edit-outline" v-if="userPrisonId==1" @click="editFLag=true"></i>
          </span>
        </div>
        <div v-else>
          <el-input
            class="yn_ipt"
            type="textarea"
            autosize
            :maxlength="300"
            placeholder="无"
            v-model="attentions"
          ></el-input>
          <div class="yn_btn_box_inTable">
            <el-button class="yn_btn yn_text_btn" type="primary" @click="subDesc">保存</el-button>
            <el-button class="yn_btn yn_text_btn" @click="chancl">取消</el-button>
          </div>
        </div>
      </div>
      <div class="td_box" slot="reference">
        <div class="title_name">{{titleName}}</div>
        <i class="el-icon-warning-outline"></i>
      </div>
    </el-popover>
    <!-- <el-dialog class="yn_dialog" center title="编辑说明" :visible.sync="editFLag" width="50%">
      <el-form label-width="8rem" class="yn_form" ref="addform">
        <el-form-item label="说明内容:">
          <el-input
            class="yn_ipt"
            type="textarea"
            autosize
            :maxlength="300"
            placeholder="无"
            v-model="attentions"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="subDesc">保存</el-button>
        <el-button class="yn_btn" @click="chancl">取消</el-button>
      </div>
    </el-dialog>-->
  </td>
</template>

<script>
import { getPrisonId } from '@/utils'
import { editDIY } from '../server.js'
import { Loading } from 'element-ui'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    iptFlag: {
      type: Boolean,
      default: false
    },
    col: {
      type: Number,
      default: 1
    },
    row: {
      type: Number,
      default: 1
    },
    titleName: null,
    titleTip: null
  },

  data() {
    return {
      chart: null,
      iconFlag: false,
      dataList: [],
      lineData: [
        { name: 'xx', value: 10 },
        { name: 'x', value: 2 },
        { name: 'xxx', value: 4 }
      ],
      xpwidth: 0,
      userPrisonId: getPrisonId(),
      editFLag: false,
      attentions: '',
      visible: false
    }
  },
  created() {
    this.xpwidth = window.screen.width * 0.2
    this.attentions = this.titleTip.fieldDescribe
  },
  mounted() {
    window.addEventListener('scroll', this.mouseOut, true)
  },
  methods: {
    mouseOut(e) {
      const self = this
      if (this.$refs['popover']) {
        this.$refs['popover'].doClose()
      }
    },
    subDesc() {
      let params = {
        fieldDescribe: this.attentions,
        id: this.titleTip.id
      }
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      editDIY(params).then(res => {
        loadingInstance.close()

        this.$message.success('修改成功')
        this.editFLag = false
      })
    },
    chancl() {
      this.editFLag = false

      this.attentions = this.titleTip.fieldDescribe
    }
  },
  watch: {
    titleTip: {
      deep: true,
      handler(val) {
        console.log('titleTip:' + val)

        if (val) {
          this.attentions = this.titleTip.fieldDescribe
        }
        if (this.$refs['popover']) {
          this.$refs['popover'].doClose()
        }
        this.editFLag = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pop_main {
  width: 100%;
  font-size: 1.4rem;
  padding: 1rem;
}
.icon {
  font-size: 1.8rem;
  cursor: pointer;
}
.yn_btn_box_inTable {
  margin-top: 1rem;
}
.td_box {
  width: 100%;
  display: flex;
  align-items: center;

  .el-icon-warning-outline {
    color: #333;
    margin: 0 4px;
  }
  .sql_num {
    color: #4a8ae8;
    font-size: 1.1rem;
    white-space: nowrap;
  }
  /deep/.el-input__inner {
    padding: 4px 0;
    width: 5rem;
    text-indent: 2px;
  }
  .table_ipt {
    width: 5rem;

    .el-input__inner {
      width: 5rem;
    }
  }
  .el-input.is-disabled {
    border: none;
    background-color: #fff;
    width: 5rem;
    /deep/ .el-input__inner {
      color: #fd9b0b !important;
      background-color: #fff;
      border: none;
    }
  }
}
.technology {
  .td_box {
    .el-input.is-disabled {
      border: none;
      background-color: transparent;
      width: 5rem;
      /deep/ .el-input__inner {
        color: #fd9b0b !important;
        background-color: transparent;
        border: none;
      }
    }
  }
}
.column {
  flex-direction: column;
}
</style>
