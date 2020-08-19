<!--
 * @Description:
 * @Author:
 * @Date: 2020-01-15 17:34:28
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-02 10:41:26
 -->
<template>
  <div>
    <el-dialog
      :title="mod=='add'?'新增预案':'编辑预案'"
      class="yn_dialog"
      center
      @open="searchGroup"
      @close="$refs.form.resetFields()"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form :model="params" ref="form" label-position="left" label-width="100px" class="yn_form">
        <el-form-item
          label="预案名称"
          prop="planName"
          :rules="[{required:true,message:'请输入预案名称',trigger:'blur'}]"
        >
          <el-input class="yn_ipt" v-model="params.planName"></el-input>
        </el-form-item>
        <el-form-item
          label="预案类型"
          prop="planType"
          :rules="[{required:true,message:'请选择预案类型',trigger:'blur'}]"
        >
          <el-select class="yn_ipt" v-model="params.planType">
            <el-option
              v-for="item in planOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="指挥长"
          prop="firstCommandId"
          :rules="[{required:true,message:'请选择指挥长',trigger:'input'}]"
        >
          <police-sel class="yn_ipt" :isPrison="true" v-model="params.firstCommandId"></police-sel>
        </el-form-item>
        <el-form-item
          label="副指挥"
          prop="secondCommandIds"
          :rules="[{required:true,message:'请选择指挥长',trigger:'input'}]"
        >
          <police-sel class="yn_ipt" multiple :isPrison="true" v-model="params.secondCommandIds"></police-sel>
        </el-form-item>
        <el-form-item
          label="预案小组"
          prop="groupIds"
          :rules="[{required:true,message:'请选择预案小组',trigger:'input'}]"
        >
          <el-select class="yn_ipt" multiple v-model="params.groupIds">
            <el-option
              v-for="item in planGroupOptions"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="预案详情"
          prop="planContent"
          :rules="[{required:true,message:'请输入',trigger:'blur'},
          {max:10000,message:'请不要超过一万字',trigger:'blur'}]"
        >
          <quill-editor v-model="params.planContent" id="quill" :options="editorOption"></quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="submit">确 定</el-button>
        <el-button class="yn_btn" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import policeSel from '@/components/police_select'
import tableView from '@/components/table_view/'
import { getPrisonId } from '@/utils'
import {
  getIntercom,
  addGroup,
  editGroup,
  getPlanType,
  addReserve,
  updateReserve,
  getPlanGroupType
} from '../server.js'
export default {
  components: {
    policeSel,
    tableView
  },
  data() {
    return {
      prisonId: getPrisonId(),
      mod: 'add',
      params: {
        planName: '',
        planType: '',
        firstCommandId: '',
        prisonId: getPrisonId(),
        secondCommandIds: [],
        groupIds: []
      },
      dialogVisible: false,
      tableData: { list: [], total: 0, pageSize: 10, pageNum: 1 },
      tableParams: {},
      groupId: null,
      planOptions: [],
      planGroupOptions: [],
      editorOption: {
        // 富文本配置
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link']
          ]
        },
        theme: 'snow',
        placeholder: '富文本编辑框，支持文字、图片、公式等'
      }
    }
  },
  mounted() {
    this.searchType()
    this.searchGroup()
  },
  methods: {
    searchType() {
      getPlanType().then(res => {
        this.planOptions = res
        console.log(this.planOptions)
      })
    },
    searchGroup() {
      getPlanGroupType(this.prisonId).then(res => {
        this.planGroupOptions = res
      })
    },
    submit() {
      this.$refs.form.validate(value => {
        if (value) {
          if (this.mod == 'add') {
            addReserve(this.params).then(res => {
              this.$message.success('新增成功')
              this.dialogVisible = false
              this.$emit('submit')
            })
          } else {
            updateReserve(this.params).then(res => {
              this.$message.success('编辑成功')
              this.dialogVisible = false
              this.$emit('submit')
            })
          }
        }
      })
    }
  }
}
</script>
