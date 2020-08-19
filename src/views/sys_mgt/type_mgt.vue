<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-24 14:30:10
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 09:44:22
 -->
<template>
  <menuTree :menuList="['系统管理','类型管理']">
    <!-- <span class="yn_page_title">类型管理</span> -->
    <el-row :gutter="10">
      <el-col :span="14">
        <div>
          <el-button type="primary" class="yn_btn" @click="handleTypeAddClick">新增类型</el-button>
          <el-table
            ref="typeTable"
            highlight-current-row
            :data="dictionaryList"
            style="width: 100%;margin-top:20px"
            @current-change="handleCurrentChange"
            :row-class-name="tableRowClassName"
            v-loading="tableLoating"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)"
            height="500"
            class="yn_table"
            border
          >
            <el-table-column prop="dictionaryCode" label="标识" width="200"></el-table-column>
            <el-table-column prop="dictionaryName" label="名称" width="200"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-show="scope.row.status===0" type="success" disable-transitions>启用</el-tag>
                <el-tag v-show="scope.row.status===1" type="danger" disable-transitions>停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button @click="handleTypeEditClick(scope.row)" type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div>
          <el-button
            type="primary"
            class="yn_btn"
            :disabled="!selectedType"
            @click="handleValueAddClick"
          >新增值</el-button>
          <el-table
            :data="selectedType.subclassList"
            style="width: 100%;margin-top:20px"
            :row-class-name="tableRowClassName"
            v-loading="tableLoating"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)"
            height="500"
            class="yn_table"
            border
          >
            <el-table-column prop="value" label="值" width="200"></el-table-column>
            <el-table-column prop="description" label="说明"></el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-show="scope.row.status===0" type="success" disable-transitions>启用</el-tag>
                <el-tag v-show="scope.row.status===1" type="danger" disable-transitions>停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="编辑" width="80" align="center">
              <template slot-scope="scope">
                <el-button @click="handleValueEditClick(scope.row)" type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      class="yn_dialog"
      center
      :title="typeDialogTitle"
      :visible.sync="typeDialog"
      @closed="resetForm('dictionaryForm')"
      width="30%"
    >
      <div>
        <el-form
          label-position="left"
          label-width="80px"
          :model="dictionaryForm"
          ref="dictionaryForm"
          class="demo-form-inline yn_form"
          :rules="rules"
          @submit.native.prevent
        >
          <el-form-item label="唯一标识" prop="dictionaryCode" v-show="dictionaryForm.createTime==null">
            <el-input class="yn_ipt" v-model="dictionaryForm.dictionaryCode" placeholder="输入类型标识"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="dictionaryName">
            <el-input class="yn_ipt" v-model="dictionaryForm.dictionaryName" placeholder="输入类型名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              class="yn_ipt"
              :rows="2"
              v-model="dictionaryForm.description"
              placeholder="输入类型描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" v-show="dictionaryForm.createTime!=null">
            <el-switch
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="停用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="dictionaryForm.status"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="saveDictionary()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"></div>
    </el-dialog>

    <el-dialog
      :title="subclassDialogTitle"
      class="yn_dialog"
      center
      :visible.sync="subclassDialog"
      width="30%"
      @closed="resetForm('dictionarySubclassForm')"
    >
      <div>
        <el-form
          label-position="left"
          label-width="80px"
          :model="dictionarySubclassForm"
          ref="dictionarySubclassForm"
          class="demo-form-inline yn_form"
          :rules="subclassFormRules"
          @submit.native.prevent
        >
          <el-form-item label="值" prop="value">
            <el-input class="yn_ipt" v-model="dictionarySubclassForm.value" placeholder="输入值"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              class="yn_ipt"
              :rows="2"
              v-model="dictionarySubclassForm.description"
              placeholder="输入值描述"
            ></el-input>
          </el-form-item>
          <el-form-item v-show="dictionarySubclassForm.subclassGuid!=null" label="状态">
            <el-switch
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="停用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="dictionarySubclassForm.status"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button class="yn_btn" type="primary" @click="saveSubclassOfDictionary()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"></div>
    </el-dialog>
  </menuTree>
</template>

<script>
import { inputSpecialCharactersValidator } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'

export default {
  name: 'TypeMgt',
  components: { menuTree },

  data() {
    var dictionaryCodeValidator = (rule, value, callback) => {
      if (this.typeDialogTitle == '编辑类型') {
        callback()
      }
      this.axios
        .get(this._global.userUrl + '/dictionary/checkCode/' + value)
        .then(data => {
          if (data) {
            callback()
          } else {
            callback(new Error('唯一标识不可重复'))
          }
        })
    }
    return {
      tableLoating: false,
      dictionaryList: [],
      typeDialog: false,
      subclassDialog: false,
      subclassDialogTitle: null,
      dictionaryForm: {
        dictionaryCode: '',
        dictionaryName: '',
        status: 0,
        createTime: null,
        description: ''
      },
      dictionarySubclassForm: {
        dictionaryCode: '',
        subclassGuid: null,
        description: '',
        value: '',
        status: 0,
        createTime: null
      },
      rules: {
        dictionaryCode: [
          { required: true, message: '唯一标识不可为空', trigger: 'blur' },
          {
            max: 255,
            message: '长度在255个字符以下',
            trigger: 'blur'
          },
          {
            validator: inputSpecialCharactersValidator,
            trigger: 'blur'
          },
          {
            validator: dictionaryCodeValidator,
            trigger: 'blur'
          }
        ],
        dictionaryName: [
          { required: true, message: '类型名称不可为空', trigger: 'blur' },
          { max: 255, message: '长度在255个字符以下', trigger: 'blur' },
          {
            validator: inputSpecialCharactersValidator,
            trigger: 'blur'
          }
        ]
      },
      subclassFormRules: {
        value: [
          { required: true, message: '类型值不可为空', trigger: 'blur' },
          {
            validator: inputSpecialCharactersValidator,
            trigger: 'blur'
          }
        ]
      },
      typeDialogTitle: '',
      subclassList: [],
      selectedType: []
    }
  },
  created() {
    this.getDictionarCascade()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row == null) {
        return
      }
      if (row.status === 1) {
        return 'dead-row'
      } else {
        return 'default-row'
      }
    },
    handleTypeAddClick() {
      this.typeDialogTitle = '新增类型'
      this.typeDialog = true
      this.dictionaryForm = {
        dictionaryCode: '',
        dictionaryName: '',
        status: 0,
        createTime: null,
        description: ''
      }
    },
    handleTypeEditClick(dictionary) {
      this.typeDialogTitle = '编辑类型'
      // 表单赋值
      this.dictionaryForm = Object.assign({}, dictionary)
      this.typeDialog = true
    },
    handleValueAddClick() {
      this.subclassDialogTitle = '新增值'
      this.dictionarySubclassForm = {
        dictionaryCode: '',
        subclassGuid: null,
        description: '',
        value: '',
        status: 0,
        createTime: null
      }
      this.dictionarySubclassForm.dictionaryCode = this.selectedType.dictionaryCode
      this.subclassDialog = true
    },
    handleValueEditClick(row) {
      this.dictionarySubclassForm = Object.assign({}, row)
      this.subclassDialogTitle = '编辑值'
      this.subclassDialog = true
    },

    getDictionarCascade() {
      this.tableLoating = true
      this.axios
        .get(this._global.userUrl + '/dictionary' + '?' + Math.random())
        .then(data => {
          this.dictionaryList = data
          if (this.dictionaryList && this.dictionaryList.length > 0) {
            this.selectedType = this.dictionaryList[0]
            this.$refs.typeTable.setCurrentRow(this.selectedType)
          }
          this.tableLoating = false
        })
    },

    saveDictionary() {
      this.$refs['dictionaryForm'].validate(valid => {
        if (valid) {
          let dictionary = this.dictionaryForm
          if (dictionary.createTime == null) {
            // 新增
            this.axios
              .post(this._global.userUrl + '/dictionary', dictionary)
              .then(data => {
                this.typeDialog = false
                this.$message.success('新增成功')
                this.getDictionarCascade()
              })
          } else {
            // 编辑
            this.axios
              .put(this._global.userUrl + '/dictionary', dictionary)
              .then(data => {
                this.typeDialog = false
                this.$message.success('编辑成功')
                this.getDictionarCascade()
              })
          }
        } else {
          return false
        }
      })
    },
    saveSubclassOfDictionary() {
      let subclass = this.dictionarySubclassForm
      this.$refs['dictionarySubclassForm'].validate(valid => {
        if (valid) {
          if (subclass.subclassGuid == null) {
            // 新增
            this.axios
              .post(this._global.userUrl + '/dictionarySubclass', subclass)
              .then(data => {
                this.subclassDialog = false
                this.$message.success('新增成功')
                this.getSubclassByCode()
              })
          } else {
            // 编辑
            this.axios
              .put(this._global.userUrl + '/dictionarySubclass', subclass)
              .then(data => {
                this.subclassDialog = false
                this.$message.success('编辑成功')
                this.getSubclassByCode()
              })
          }
        } else {
          return false
        }
      })
    },

    resetForm(formName) {
      console.log(formName)
      if (this.$refs[formName]) {
        console.log(formName)
        this.$refs[formName].resetFields()
      }
    },
    getSubclassByCode() {
      this.axios
        .get(
          this._global.userUrl +
            '/dictionarySubclass/byCode/' +
            this.selectedType.dictionaryCode
        )
        .then(data => {
          this.selectedType.subclassList = data
        })
    },
    handleCurrentChange(val) {
      this.selectedType = val
    }
  }
}
</script>
<style scoped lang='less'>
.el-table .dead-row {
  color: red;
  cursor: pointer;
}
.el-table .default-row {
  cursor: pointer;
}
</style>
