<!--
 * @Description: 权限管理
 * @Author: fylih
 * @Date: 2019-08-19 11:05:48
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 16:03:35
 -->
<template>
  <menuTree :menuList="['系统管理','权限管理']">
    <table-view
      :tableData="tableData"
      noSearch
      noIndex
      noBottom
      v-loading="tableLoating"
      @sizeChange="getRoles"
    >
      <template slot="table-column">
        <el-table-column prop="roleName" label="角色名称" align="center" min-width="180"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button class="yn_btn" type="primary" @click="show(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </template>
    </table-view>

    <el-drawer title="权限分配" :closable="false" :visible.sync="visible">
      <el-tree
        :data="menusData"
        show-checkbox
        multiple
        ref="tree"
        :default-checked-keys="checkedArray"
        node-key="menuId"
        :props="defaultProps"
      ></el-tree>
      <div class="submit_btn">
        <el-button class="yn_btn" type="primary" @click="$checkMessage(save)">保存</el-button>
      </div>
    </el-drawer>
  </menuTree>
</template>
<script>
import tableView from '@/components/table_view'
import menuTree from '@/components/menu_tree/'

export default {
  components: { tableView, menuTree },
  data() {
    return {
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      dataCount: 0,
      tableLoating: true,
      queryParams: {
        currentPage: 1,
        pageSize: 10
      },
      visible: false,
      rolesData: [],
      menusData: [],
      checked: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      checkedArray: [],
      roleId: '',
      deptId: ''
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 点分配权限，显示当前行权限
    show(row) {
      this.checkedArray = []
      this.roleId = row.roleId
      let params = {
        roleId: this.roleId,
        deptId: this.deptId
      }
      this.axios
        .post(this._global.userUrl + '/permission/getPermission', params)
        .then(data => {
          console.log(data)
          for (let k in data) {
            if (data[k].checked == true) {
              this.checkedArray.push(data[k].menuId)
            }
            if (data[k].children) {
              if (data[k].children.length > 0) {
                this.setChecked(data[k].children)
              }
            }
          }
          this.visible = true
          this.menusData = data
        })
    },
    setChecked(par) {
      for (let k in par) {
        if (par[k].checked == true) {
          this.checkedArray.push(par[k].menuId)
        }
        console.log(par[k].children)
        if (par[k].children) {
          if (par[k].children.length > 0) {
            this.setChecked(par[k].children)
          }
        }
      }
    },
    // 获取所有角色
    getRoles() {
      this.tableLoating = true
      this.queryParams.pageSize = this.tableData.pageSize
      this.queryParams.currentPage = this.tableData.pageNum
      this.axios
        .post(
          this._global.userUrl + '/roleManage/getRoleByQueryPage',
          this.queryParams
        )
        .then(data => {
          this.tableData.total = data.total
          this.tableData.list = data.list
          this.tableLoating = false
        })
    },
    // 保存已分配的权限
    save() {
      this.checked = this.$refs.tree.getCheckedNodes()

      let params = {
        deptId: '',
        roleId: this.roleId,
        children: this.checked,
        parentId: this.parentId
      }
      this.axios
        .put(this._global.userUrl + '/permission/updatePermission', params)
        .then(data => {
          this.visible = false
          this.$message.success(data + '')
        })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-drawer__header span {
  font-size: 1.4rem;
}
.submit_btn {
  width: 100%;
  text-align: center;
}
/deep/.el-drawer__body {
  overflow: auto;
}
/deep/.el-tree-node__label {
  font-size: 1.1rem;
}
</style>
