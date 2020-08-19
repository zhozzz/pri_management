<!--
 * @Description: 罪犯更新模态框
 * @Author: fylih
 * @Date: 2019-09-20 11:38:45
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-02 17:17:15
 -->
<template>
  <el-dialog
    :title="dialogTitle"
    :visible="updateVisible"
    center
    class="yn_dialog"
    width="60%"
    @close="close"
  >
    <div>
      <el-row :gutter="10" v-if="isEdit">
        <el-col class="name" :span="4">{{params.type === 'police' ? '警察列表:' : '罪犯列表:'}}</el-col>
        <el-col :span="20">
          <el-form ref="form" :model="form" label-width="0">
            <span class="name" v-for="(item,i) in nameList" :key="i">
              {{item}}
              <span v-if="i!==nameList.length-1">、</span>
            </span>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="20">
          <el-button
            class="yn_btn"
            v-if="isEdit"
            style="margin-top:10px"
            type="primary"
            @click="isEdit=false"
            :disabled="disabled"
          >打开编辑</el-button>
        </el-col>
      </el-row>
      <el-transfer
        v-if="!isEdit"
        style="display:table;margin:auto"
        v-model="selectedList"
        :titles="title"
        filterable
        class="yn_transfer"
        :data="list"
      ></el-transfer>
    </div>
    <div slot="footer">
      <el-button class="yn_btn" type="primary" @click="$checkMessage(submit)">确 定</el-button>
      <el-button class="yn_btn" @click="handleCloseUpdateDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _global from '@/utils/global_url'
export default {
  props: {
    handleCloseUpdateDialog: {
      required: true,
      type: Function
    },
    updateVisible: {
      required: true,
      type: Boolean
    },
    params: {
      required: true,
      type: Object
    },
    submitAPI: {
      required: true,
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      list: [],
      selectedList: [],
      url: '',
      title: [],
      dialogTitle: '',
      nameList: [],
      isEdit: true,
      form: {}
    }
  },
  methods: {
    close() {
      this.isEdit = true
      this.handleCloseUpdateDialog()
    },
    queryInfo() {
      let url1 = ''
      let url2 = ''
      this.list = []
      if (this.params.type === 'criminal') {
        url1 =
          _global.businessUrl +
          '/criminalBase/selCriminal/' +
          this.params.deptId
        if (this.params.isStudy !== undefined) {
          url2 = _global.businessUrl + '/study/selStudyCriminals'
        } else if (this.params.isLabor !== undefined) {
          url2 = _global.businessUrl + '/labour/selLaborCriminals'
        } else {
          url2 = _global.businessUrl + '/rest/selRestCriminals'
        }
      } else if (this.params.type === 'police') {
        url1 = _global.userUrl + '/userManage/selPolice/' + this.params.deptId
        if (this.params.isStudy !== undefined) {
          url2 = _global.businessUrl + '/study/selStudyPolices'
        } else if (this.params.isLabor !== undefined) {
          url2 = _global.businessUrl + '/labour/selLaborPolices'
        } else {
          url2 = _global.businessUrl + '/rest/selRestPolices'
        }
      }
      this.axios.get(url1).then(res => {
        if (res.length > 0) {
          if (this.params.type === 'criminal') {
            this.list = res.map(item => {
              return { key: item.id, label: item.zfName }
            })
          } else if (this.params.type === 'police') {
            this.list = res.map(item => {
              return { key: item.userGuid, label: item.realName }
            })
          }
        }
      })
      this.axios
        .get(url2, { params: { flag: 0, relateId: this.params.id } })
        .then(res => {
          if (res.rows.length > 0) {
            this.nameList = []
            if (this.params.type === 'criminal') {
              this.selectedList = res.rows.map(item => item.id)
              this.nameList = res.rows.map(item => item.zfName)
            } else if (this.params.type === 'police') {
              this.selectedList = res.rows.map(item => item.userId)
              this.nameList = res.rows.map(item => item.realName)
            }
          }
        })
    },
    submit() {
      if (this.selectedList.length < 1) {
        this.$message.warning(
          `请保留至少一名${this.params.type === 'criminal' ? '罪犯' : '警察'}`
        )
        return
      }
      let params = {}
      params.id = this.params.id
      if (this.params.type === 'criminal') {
        params.criminalList = this.selectedList
        params.flag = 0
      } else if (this.params.type === 'police') {
        params.policeList = this.selectedList
        params.flag = 1
      }
      let url = _global.businessUrl + this.submitAPI
      this.axios.post(url, params).then(res => {
        this.$message.success('更新成功')
        this.handleCloseUpdateDialog()
        this.$emit('updateSuccess', true)
      })
    }
  },
  watch: {
    updateVisible(val) {
      if (val === true) {
        this.dialogTitle =
          this.params.type === 'police' ? '警察列表修改' : '罪犯列表修改'
        this.title =
          this.params.type === 'police'
            ? ['全部警察', '已选警察']
            : ['全部罪犯', '已选罪犯']
        this.queryInfo()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.name_box {
  max-height: 10rem;
  overflow: auto;
}
.name {
  font-size: 1.4rem;
}
.technology {
  .name {
    color: #fff;
  }
}
</style>
