<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2020-04-27 10:25:24
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-29 17:05:16
 -->
<template>
  <div class="export_main">
    <el-button class="yn_btn" type="primary" @click="selFlag=true">导出数据</el-button>
    <el-dialog
      class="yn_dialog"
      center
      title="选择导出项"
      :visible.sync="selFlag"
      width="80%"
      @close="close"
    >
      <el-form
        :model="excelForm"
        ref="excelForm"
        :rules="rules"
        label-width="10rem"
        label-position="right"
        class="yn_form"
      >
        <el-form-item label="所属单位:" prop="deptList">
          <el-checkbox :indeterminate="isDeptAll" v-model="checkDeptAll" @change="selDeptAll">全选</el-checkbox>

          <el-select
            v-model="excelForm.deptList"
            multiple
            placeholder="请选择单位"
            class="yn_ipt yn_long_ipt"
            @change="deptChange"
          >
            <el-option
              v-for="item in sonDeptList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计方式:" prop="exportType">
          <el-select v-model="excelForm.exportType" placeholder="请选择" class="yn_ipt">
            <el-option label="按部门统计" :value="1"></el-option>
            <el-option label="按天统计" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间:" prop="dayRange">
          <el-date-picker
            class="yn_ipt"
            v-model="excelForm.dayRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :unlink-panels="true"
            :clearable="false"
            :picker-options="{
              disabledDate(date){
                return  new Date(date).getTime()>new Date().getTime()
              }
          }"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="选择自定义字段:">
          <el-checkbox :indeterminate="isSelAll" v-model="checkDIYAll" @change="selDIYAll">全选</el-checkbox>

          <el-checkbox-group v-model="checkDIYList" @change="selDIYOne" class="group">
            <el-checkbox v-for="(item,i) in customList" :label="item" :key="i">{{item.fieldName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择字段:">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="selAll">全选</el-checkbox>

          <el-checkbox-group v-model="checkList" @change="selOne" class="group">
            <el-checkbox v-for="(item,i) in jsonList" :label="item" :key="i">{{item.comment}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button class="yn_btn" type="primary" @click="exportExcel">导出</el-button>
        <el-button class="yn_btn" @click="selFlag=false">取消</el-button>
        <!-- <el-button class="yn_btn" type="primary" @click="review">预览</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'

export default {
  props: {
    deptList: {
      type: Object
    },
    customList: {
      type: Array
    }
  },
  data() {
    return {
      selFlag: false,
      checkAll: false,
      checkDIYAll: false,
      jsonList: [],
      checkList: [],
      checkDIYList: [],
      isSelAll: false,
      isIndeterminate: false,
      excelForm: {},
      sonDeptList: [],

      rules: {
        deptList: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        exportType: [
          { required: true, message: '请选择统计方式', trigger: 'blur' }
        ],
        dayRange: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },

      checkDeptAll: false,
      isDeptAll: false
    }
  },
  created() {
    this.getJsonList()
    if (this.deptList.list) {
      this.prisonId = this.deptList.id
      //   this.sonDeptList = JSON.parse(JSON.stringify(this.deptList.list))
      this.sonDeptList = JSON.parse(JSON.stringify(this.deptList.list)).map(
        item => {
          return { id: item.id, name: item.name }
        }
      )
      this.sonDeptList.unshift({
        id: this.deptList.id,
        name: this.deptList.name
      })
      console.log(this.sonDeptList)
    }
    console.log(this.customList)
  },
  methods: {
    // //字段json文件
    getJsonList() {
      this.axios.get('static/baseData/baseData.json').then(res => {
        this.jsonList = res
      })
    },
    close() {
      this.excelForm = {}
      this.isSelAll = false
      this.isIndeterminate = false
      this.checkAll = false
      this.checkDIYAll = false
      this.checkList = []
      this.checkDIYList = []
      this.$refs['excelForm'].resetFields()
    },
    selAll(val) {
      this.checkList = val ? this.jsonList : []
      this.isIndeterminate = false
    },

    selOne(val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.jsonList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.jsonList.length
    },

    selDIYAll(val) {
      this.checkDIYList = val ? this.customList : []
      this.isDeptAll = false
    },
    selDIYOne(val) {
      let checkedCount = val.length
      this.checkDIYAll = checkedCount === this.customList.length
      this.isSelAll = checkedCount > 0 && checkedCount < this.customList.length
    },

    selDeptAll(val) {
      console.log(val)
      if (val) {
        this.excelForm.deptList = this.sonDeptList.map(item => item.id)
      } else {
        this.excelForm.deptList = []
      }
      this.isDeptAll = false
    },
    deptChange(val) {
      let checkedCount = val.length
      this.isDeptAll =
        checkedCount > 0 && checkedCount < this.sonDeptList.length
    },
    review() {
      this.$refs['excelForm'].validate(valid => {
        if (valid) {
          let excelForm = {}
          excelForm.exportType = this.excelForm.exportType
          excelForm.beginDate = this.excelForm.dayRange[0]
          excelForm.endDate = this.excelForm.dayRange[1]
          if (this.prisonId == 1) {
            excelForm.prisonIds = []
            excelForm.deptIds = []
            excelForm.deptsName = []
            this.excelForm.deptList.map(item => {
              excelForm.prisonIds.push(item)

              this.sonDeptList.map(obj => {
                if (obj.id == item) {
                  excelForm.deptsName.push(obj.name)
                }
              })
            })
          } else {
            excelForm.deptsName = []
            excelForm.deptIds = []
            this.excelForm.deptList.map(item => {
              if (item == this.prisonId) {
                excelForm.prisonIds = [item]
              } else {
                excelForm.deptIds.push(item)
              }
              this.sonDeptList.map(obj => {
                if (obj.id == item) {
                  excelForm.deptsName.push(obj.name)
                }
              })
            })
          }

          if (this.prisonId == 1) {
            excelForm.isProvince = true
          } else {
            excelForm.isProvince = false
          }
          excelForm.baseDataNameList = this.checkList
          excelForm.customDataIdList = this.checkDIYList.map(item => {
            return { id: item.id, comment: item.fieldName }
          })
          console.log(excelForm)

          this.$router.push({ name: 'review_excel', params: excelForm })
        } else {
          return false
        }
      })
    },
    exportExcel() {
      this.$refs['excelForm'].validate(valid => {
        if (valid) {
          let excelForm = {}
          excelForm.exportType = this.excelForm.exportType
          excelForm.beginDate = this.excelForm.dayRange[0]
          excelForm.endDate = this.excelForm.dayRange[1]
          if (this.prisonId == 1) {
            excelForm.prisonIds = []
            excelForm.deptIds = []
            excelForm.deptsName = []
            this.excelForm.deptList.map(item => {
              excelForm.prisonIds.push(item)
            })
          } else {
            excelForm.deptsName = []
            excelForm.deptIds = []
            this.excelForm.deptList.map(item => {
              if (item == this.prisonId) {
                excelForm.prisonIds = [item]
              } else {
                excelForm.deptIds.push(item)
              }
            })
          }
          if (this.prisonId == 1) {
            excelForm.isProvince = true
          } else {
            excelForm.isProvince = false
          }
          excelForm.baseDataNameList = this.checkList
          excelForm.customDataIdList = this.checkDIYList.map(item => {
            return { id: item.id, comment: item.fieldName }
          })
          console.log(excelForm)

          this.axios
            .post(_globalUrl.businessUrl + '/dataReport/export', excelForm, {
              responseType: 'blob'
            })
            .then(msg => {
              let url = window.URL.createObjectURL(msg.data) // 表示一个指定的file对象或Blob对象
              console.log(msg)
              let a = document.createElement('a')
              document.body.appendChild(a)

              let fileName =
                '基本数据-' + excelForm.beginDate + '-' + excelForm.endDate
              a.href = url
              a.download = fileName // 命名下载名称
              a.click() // 点击触发下载
              window.URL.revokeObjectURL(url)
            })
        } else {
          return false
        }
      })
    }
  },
  watch: {
    deptList: {
      deep: true,
      handler(val) {
        // this.sonDeptList = JSON.parse(JSON.stringify(val.list))
        this.sonDeptList = JSON.parse(JSON.stringify(val.list)).map(item => {
          return { id: item.id, name: item.name }
        })
        this.prisonId = val.id
        this.sonDeptList.unshift({
          id: this.deptList.id,
          name: this.deptList.name
        })
      }
    },
    customList: {
      deep: true,
      handler(val) {
        console.log(val)
      }
    }
  }
}
</script>
<style lang="less">
.export_main {
  margin-left: 10px;
  /deep/.el-form-item__content {
    line-height: 20px;
  }
  /deep/.el-form-item__label {
    line-height: 20px;
  }
  .el-checkbox {
    width: 25%;
    /deep/.el-checkbox__label {
      font-size: 1.4rem;
    }
  }
  .yn_long_ipt {
    width: 100%;
  }
  .group {
    max-height: 25rem;
    overflow: scroll;
  }
}
.technology {
  .export_main {
    /deep/.el-checkbox__label {
      color: #fff;
    }
  }
}
</style>
