<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-05 14:20:26
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-08 17:51:05
 -->
<template>
  <menuTree :menuList="['工作辅助','报表新增']">
    <div class="yn_page_title">模板名称：{{templateName}}</div>
    <el-form class="yn_form" label-width="14rem">
      <el-form-item label=" 填报周期:">
        <el-select class="yn_ipt" v-model="reportType">
          <el-option v-for="(item,i) in typeList" :key="i" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" 周期内是否重复填报:">
        <el-switch
          v-model="fillType"
          active-text="是"
          inactive-text="否"
          active-value="1"
          inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label=" 模板描述:">
        <el-input class="yn_ipt" type="textarea" v-model="desc" :maxlength="500"></el-input>
      </el-form-item>

      <el-form-item label=" 添加表头:">
        <div class="add_box">
          <i class="el-icon-circle-plus" @click="addTabs"></i>
        </div>
        <div class="main_box">
          <div class="tab_box" v-for="(item,i) in tabs" :key="i">
            <el-input class="yn_ipt" v-model="item.fieldName" placeholder="请输入表头" maxlength="40"></el-input>
            <div class="info_box">
              <div>
                <el-radio v-model="item.fieldType" :label="0">文字</el-radio>
                <el-radio v-model="item.fieldType" :label="1">数字</el-radio>
              </div>

              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="del(i)"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <el-button
      class="yn_btn subBtn"
      type="primary"
      :disabled="tabs.length==0"
      @click="subFlag=true"
    >预 览</el-button>

    <el-dialog class="yn_dialog" center :title="templateName" :visible.sync="subFlag" width="50%">
      <table-view noBottom noSearch noIndex noPage :tableData="tableData">
        <template slot="table-column">
          <el-table-column
            v-for="(col,i) in tabs"
            :key="i"
            :prop="col.fieldName"
            :label="col.fieldName"
            align="center"
          ></el-table-column>
        </template>
      </table-view>
      <div slot="footer">
        <el-button class="yn_btn" @click="submit" type="primary">确定保存</el-button>
      </div>
    </el-dialog>
  </menuTree>
</template>
<script>
import { add } from './service'
import { getUserId, getPrisonId } from '@/utils'
import { expnoraml } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'
import tableView from '@/components/table_view'

var special = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /[`~!@#$%^&*_\-+=<>?"{}|/'\\[\]·~！@#￥……&*——\|《》？]/
  //   /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/
)
var blank = new RegExp(/^\S*$/)
var noNumber = new RegExp(/\d+/)

export default {
  components: {
    menuTree,
    tableView
  },
  data() {
    return {
      templateName: '',
      tabs: [],
      desc: '',
      subing: false,
      reportType: 0,
      fillType: 0,
      typeList: [
        { name: '每日', value: 0 },
        { name: '每周', value: 1 },
        { name: '每月', value: 2 }
      ],
      subFlag: false,
      tableData: {
        list: [],
        total: null
      }
    }
  },
  methods: {
    addTabs() {
      this.tabs.push({ fieldName: '', fieldType: 0 })
    },
    del(val) {
      this.tabs.splice(val, 1)
    },
    submit() {
      let flag = true
      this.tabs.map((item, i) => {
        if (special.test(item.fieldName)) {
          this.$message({
            type: 'error',
            message: '表头不能包含特殊字符'
          })
          flag = false
          return false
          // } else if (!blank.test(item.fieldName)) {
          //   this.$message({
          //     type: 'error',
          //     message: '表头不能包含空格'
          //   })
          //   flag = false
          //   return false
        } else if (item.fieldName == '' || !item.fieldName) {
          this.$message.error('请完整填写')
          flag = false
          return false
          // } else if (noNumber.test(item.fieldName)) {
          //   this.$message.error('表头不能包含数字')
          //   flag = false
          //   return false
          // } else if (i > 0 && item.fieldName == this.tabs[i - 1].fieldName) {
          //   this.$message.error('表头重复')
          //   flag = false
          //   return false
        }
        item.sort = i + 1
      })
      if (!this.desc) {
        this.$message.error('描述不能为空')
        flag = false
        return false
      }
      if (flag) {
        this.subing = true
        let params = {}
        params.templateName = this.templateName
        params.templateFields = this.tabs
        params.cycleType = this.reportType
        params.desc = this.desc
        params.fillType = this.fillType

        add(params).then(res => {
          this.subing = false
          this.$message.success('成功')
          this.$router.push({
            name: 'template_table'
          })
        })
      }
    }
  },
  mounted() {
    if (this.$route.query.templateName) {
      this.templateName = this.$route.query.templateName
    }
  }
}
</script>
<style lang="less" scoped>
.technology {
  .tab_box {
    color: #fff;
    background: transparent;
    border: 1px solid #7cdafd;
    box-shadow: 14px 0 14px -14px #8fdcf9 inset, 0 14px 14px -14px #8fdcf9 inset,
      0 -14px 14px -14px #8fdcf9 inset, -14px 0 14px -14px #8fdcf9 inset;
  }

  .add_box {
    color: #fff;
  }
}
.subBtn {
  margin: 2rem 0 0 90%;
}
.main_box {
  width: 100%;
  display: flex;
  align-items: center;
  //   flex-wrap: wrap;
  overflow: scroll;
  //   border: 1px solid #7cdafd;
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 4px;
  .tab_box {
    width: 20rem;
    min-width: 20rem;
    border: 1px solid #cddded;
    border-right: none;
    padding: 1rem;

    // margin: 0.5rem;
    .info_box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      /deep/.el-radio__label {
        font-size: 1.2rem;
      }
    }
  }
}
.add_box {
  color: #409eff;
  font-size: 4rem;
  margin-left: 2rem;
}
.tab_box:last-child {
  border-right: 1px solid #cddded;
}
</style>
