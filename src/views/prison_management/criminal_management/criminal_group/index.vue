<!--
 * @Description: 狱局 警察进出查看
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-28 14:31:05
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 15:34:17
 -->

<template>
  <el-row>
    <el-col :span="4" class="trees">
      <el-tree
        v-loading="treeLoading"
        ref="tree"
        :highlight-current="true"
        :data="deptList"
        :props="defaultProps"
        :default-expanded-keys="[currentNode]"
        accordion
        node-key="id"
        :lazy="true"
        :load="load"
        @node-click="handleNodeClick"
      >
        <div class="node_box" slot-scope="{ node, data }">
          <div>{{node.label}}</div>
          <div class="count">{{data.count}}</div>
        </div>
      </el-tree>
    </el-col>
    <el-col :span="20">
      <menuTree :menuList="['监狱管理','罪犯管理','罪犯分组']">
        <table-view
          v-loading="tableLoading"
          noBottom
          v-if="currentNode"
          @sizeChange="getGroupList"
          :tableData="tableData"
        >
          <div slot="searchCondition">
            <el-button
              type="primary"
              :style="{'margin-bottom':'1rem'}"
              class="yn_btn"
              v-if="userPrisonId!=1"
              @click="()=>{dialogVisible=true;queryCriminal()}"
            >新增分组</el-button>
          </div>
          <template slot="table-column">
            <el-table-column align="center" min-width="150" prop="groupName" label="分组名">
              <template slot-scope="{row}">
                <div v-if="!row.editName" @click="openEditName(row)">
                  {{row.groupName}}
                  <i v-if="userPrisonId!=1" class="el-icon-edit"></i>
                </div>
                <el-input
                  v-show="row.editName"
                  :id="'ipt'+row.id"
                  class="yn_ipt"
                  :maxlength="50"
                  v-model="row.groupName"
                  @blur="row.editName=false"
                  @change="changeName(row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="remark" label="备注">
              <template slot-scope="{row}">
                <div v-if="!row.editDesc" @click="openEditRemark(row)">
                  {{row.remark}}
                  <i v-if="userPrisonId!=1" class="el-icon-edit"></i>
                </div>
                <el-input
                  v-show="row.editDesc"
                  :id="'desc'+row.id"
                  class="yn_ipt"
                  :maxlength="200"
                  v-model="row.remark"
                  @blur="row.editDesc=false"
                  @change="changeRemark(row)"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="criminalCount" label="包含罪犯">
              <template slot-scope="{row}">
                <el-button
                  type="text"
                  @click="openCrminal(row)"
                  class="yn_text_btn"
                >{{row.criminalCount}}</el-button>
              </template>
            </el-table-column>

            <el-table-column min-width="200" v-if="userPrisonId!=1" align="center" label="操作">
              <template slot-scope="{row}">
                <el-button type="text" @click="openEditData(row)" class="yn_text_btn">编辑</el-button>
                <el-button type="text" class="yn_text_btn" @click="delGroup(row)">解散该组</el-button>
              </template>
            </el-table-column>
          </template>
        </table-view>

        <div class="not_area" v-else>请选择监区</div>
        <el-dialog
          :title="isEdit?'编辑分组':'新增分组'"
          :visible="dialogVisible"
          @close="close"
          center
          class="yn_dialog"
          width="70%"
        >
          <el-form
            ref="createForm"
            :model="createData"
            :rules="rule"
            class="yn_form"
            label-width="9rem"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="分组名：" prop="groupName">
                  <el-input class="yn_ipt" placeholder="请输入" v-model="createData.groupName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    class="yn_ipt"
                    type="textarea"
                    placeholder="请输入"
                    v-model="createData.remark"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="已选中罪犯：" prop="criminalIdList">
                  <span
                    v-for="(item,i) in selList"
                    :key="i"
                    class="criminalName"
                  >{{item.criminalName}}{{i==selList.length-1?'。':' 、'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <h3 :style="{'text-align':'center'}">罪犯列表</h3>
          <table-view
            height="50rem"
            v-loading="criLoading"
            noBottom
            noIndex
            @sizeChange="queryCriminal"
            @selectionchange="selCriminalAll"
            :tableData="criminalData"
          >
            <div slot="searchCondition">
              <el-form class="yn_form" ref="form" inline :model="searchData">
                <el-form-item label="罪犯编号:">
                  <el-input class="yn_ipt" v-model="searchData.criminalNum"></el-input>
                </el-form-item>
                <el-form-item label="罪犯姓名:">
                  <el-input class="yn_ipt" v-model="searchData.criminalName"></el-input>
                </el-form-item>
                <el-form-item label="是否显示已有分组的罪犯:">
                  <el-radio v-model="searchData.isGroup" label="1">是</el-radio>
                  <el-radio v-model="searchData.isGroup" label="0">否</el-radio>
                </el-form-item>
                <el-form-item>
                  <el-button class="yn_btn" @click="queryCriminal" type="primary">查询</el-button>

                  <el-button class="yn_btn" @click="rest" type="primary">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <template slot="table-column">
              <el-table-column type="selection" :selectable="selectable"></el-table-column>
              <el-table-column align="center" prop="criminalName" label="罪犯名称"></el-table-column>
              <el-table-column align="center" prop="criminalNum" label="罪犯编号"></el-table-column>
              <el-table-column align="center" prop="groupName" label="所在分组" />
              <el-table-column align="center" prop="station" label="工位" />

              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button
                    v-if="createData.criminalIdList.includes(row.id)"
                    type="text"
                    class="yn_text_btn"
                    @click="delCri(row)"
                  >移除</el-button>
                  <el-button v-else type="text" class="yn_text_btn" @click="selCri(row)">选中</el-button>
                </template>
              </el-table-column>
            </template>
          </table-view>
          <el-button type="primary" class="yn_btn" @click="selCriAll">添加多选</el-button>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="isEdit" class="yn_btn" @click="subEdit(createData)">保存编辑</el-button>
            <el-button type="primary" v-else class="yn_btn" @click="subCreate">保 存</el-button>
            <el-button type="primary" class="yn_btn" @click="close">取 消</el-button>
          </span>
        </el-dialog>

        <el-dialog
          @close="criClose"
          title="罪犯列表"
          :visible.sync="criVisible"
          center
          class="yn_dialog"
          width="70%"
        >
          <table-view
            v-loading="groupCriLoading"
            height="40rem"
            noSearch
            noBottom
            noPage
            noIndex
            :tableData="inGroupCriData"
            @selectionchange="removeCriminalAll"
          >
            <template slot="table-column">
              <el-table-column type="selection" :selectable="selectable" reserve-selection></el-table-column>

              <el-table-column align="center" prop="criminalName" label="罪犯名称"></el-table-column>
              <el-table-column align="center" prop="criminalNum" label="罪犯编号"></el-table-column>
              <el-table-column align="center" prop="station" label="工位" />

              <el-table-column align="center" label="操作" v-if="userPrisonId!=1">
                <template slot-scope="{row}">
                  <el-button type="text" class="yn_text_btn" @click="delOneCri(row)">移除</el-button>
                </template>
              </el-table-column>
            </template>
          </table-view>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="yn_btn" @click="removeAll">批量移除</el-button>
          </span>
        </el-dialog>
      </menuTree>
    </el-col>
  </el-row>
</template>
<script>
import tableView from '@/components/table_view'
import departSelect from '@/components/depart_select'
import deptLayout from '@/components/deptLayout/index.vue'
import { MessageBox, Message } from 'element-ui'

import { getPrisonId, getDeptId } from '@/utils'
import menuTree from '@/components/menu_tree/'
import tab from '@/components/tab/index.vue'
import { formatDate } from '@/utils/date'
import {
  getPrisonTree,
  getDeptType,
  getAreaCriminalList,
  addGroup,
  getGroupList,
  selGroupCriminal,
  deleteGroup,
  upGroup,
  deleteOne,
  getNogroup,
  deleteList
} from './server'
export default {
  components: {
    tableView,
    menuTree,
    tab
  },
  data() {
    return {
      userPrisonId: getPrisonId(),
      prisonId: getPrisonId(),
      userGuid: getDeptId(),
      tableData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      defaultProps: {
        children: 'list',
        label: 'name',
        isLeaf: 'leaf'
      },
      typeValue: '',
      deptList: [],
      currentNode: '',
      dialogVisible: false,
      createData: { criminalIdList: [] },
      rule: {
        groupName: [
          { required: true, message: '请输入', trigger: 'change' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'change' },
          {
            min: 2,
            max: 200,
            message: '长度在 2 到 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      searchData: { isGroup: '0' },
      criminalData: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      },
      selList: [],
      isEdit: false,
      criVisible: false,
      inGroupCriData: {
        list: []
      },
      criGroupData: {},
      treeLoading: false,
      tableLoading: false,
      criLoading: false,
      groupCriLoading: false,
      teCriminalIdList: [],
      removeList: []
    }
  },
  created() {
    this.getDeptType()
    this.getPrisonTree(this.prisonId)
  },
  methods: {
    getDeptType() {
      getDeptType().then(res => {
        res.map(item => {
          if (item.label === '监区') {
            this.typeValue = item.value
          }
        })
      })
    },

    load(node, resolve) {
      this.treeLoading = true
      if (node.data.id) {
        getNogroup(node.data.id).then(res => {
          console.log(res)

          if (res) {
            res.map(item => {
              item.children == 0 ? (item.leaf = true) : (item.leaf = false)
            })
          } else {
            res = []
          }
          this.treeLoading = false

          return resolve(res)
        })
      }
    },
    handleNodeClick(data, node) {
      console.log(data)

      if (data.deptType === '监区') {
        this.currentNode = data.id
        this.getGroupList()

        this.queryCriminal()
      } else {
        this.currentNode = ''
      }
    },

    async getPrisonTree(id) {
      this.treeLoading = true
      this.deptList = []
      await getNogroup(id).then(res => {
        if (res) {
          res.map(item => {
            item.children == 0 ? (item.leaf = true) : (item.leaf = false)
            this.deptList.push(item)
          })
          //   this.getCurrentNode(res)
        }
        this.treeLoading = false
      })
    },

    getCurrentNode(val) {
      console.log(val)

      if (val.length > 0) {
        this.getPrisonTree(val[0].id)
      } else {
        this.currentNode = val.id
        this.$nextTick(function() {
          this.$refs['tree'].setCurrentKey(this.currentNode)
        })

        this.queryCriminal()
        this.getGroupList()
      }
    },
    getGroupList() {
      this.tableLoading = true
      console.log(this.tableData)

      let str =
        this.currentNode +
        '/' +
        this.tableData.pageNum +
        '/' +
        this.tableData.pageSize
      getGroupList(str).then(res => {
        this.tableData.list = res.rows.map(item => {
          item.editName = false
          item.editDesc = false
          return item
        })
        this.tableData.total = res.total
        this.tableLoading = false
      })
    },
    openEditName(row) {
      if (this.userPrisonId != 1) {
        row.editName = true
        row.oldName = row.groupName
        this.$nextTick(function() {
          let ipt = document.getElementById(`ipt${row.id}`)
          ipt.focus()
        })
      }
    },
    openEditRemark(row) {
      if (this.userPrisonId != 1) {
        row.editDesc = true
        row.oldRemark = row.remark
        this.$nextTick(function() {
          let ipt = document.getElementById(`desc${row.id}`)
          ipt.focus()
        })
      }
    },
    changeName(val) {
      MessageBox.confirm('确认保存修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.subEditOne(val)
          val.editName = false
        })
        .catch(err => {
          val.editName = false
          val.groupName = val.oldName
          Message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    changeRemark(val) {
      MessageBox.confirm('确认保存修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.subEditOne(val)
          val.editDesc = false
        })
        .catch(err => {
          val.editDesc = false
          val.remark = val.oldRemark
          Message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    openEditData(row) {
      this.createData = JSON.parse(JSON.stringify(row))
      this.createData.criminalIdList = []
      this.dialogVisible = true
      this.isEdit = true
      this.selGroupCriminal(this.createData)
    },
    delGroup(row) {
      MessageBox.confirm('确认解散小组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteGroup(row.id).then(res => {
            this.$message.success(res)
            this.getGroupList()
            this.getPrisonTree(this.prisonId)
          })
        })
        .catch(err => {
          Message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    selGroupCriminal(val) {
      this.selList = []
      selGroupCriminal(val.id).then(res => {
        val.criminalIdList = res.map(item => {
          return item.id
        })
        this.selList = res
        console.log(val)
      })
    },
    close() {
      this.criminalData = {
        pageNum: 1,
        pageSize: 10,
        total: null,
        list: []
      }
      this.dialogVisible = false
      this.createData = { criminalIdList: [] }
      this.selList = []
      this.searchData = { isGroup: '0' }
      this.isEdit = false
      this.$refs['createForm'].resetFields()
      this.teCriminalIdList = []
      this.getGroupList()
    },
    queryCriminal() {
      let params = {}
      this.criLoading = true
      params.currentPage = this.criminalData.pageNum
      params.pageSize = this.criminalData.pageSize
      params.deptId = this.currentNode
      params.criminalNum = this.searchData.criminalNum
      params.criminalName = this.searchData.criminalName
      params.isGroup = this.searchData.isGroup
      getAreaCriminalList(params).then(res => {
        console.log(res)
        this.criminalData.list = res.rows
        this.criminalData.total = res.total
        this.criLoading = false
      })
    },
    selCri(row) {
      this.createData.criminalIdList.push(row.id)
      this.selList.push(row)
    },
    delCri(row) {
      let i = this.createData.criminalIdList.indexOf(row.id)
      this.createData.criminalIdList.splice(i, 1)
      this.selList.splice(i, 1)
    },
    rest() {
      this.searchData = { isGroup: '0' }
      this.queryCriminal()
    },
    subCreate() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          if (this.createData.criminalIdList.length > 0) {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.createData.deptId = this.currentNode
            addGroup(this.createData).then(res => {
              this.close()
              this.$message.success(res)
              loading.close()
              this.getPrisonTree(this.prisonId)
            })
          } else {
            this.$message.warning('请选择罪犯')
          }
        } else {
          this.$message.warning('请正确输入')
        }
      })
    },
    subEdit(val) {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          if (this.createData.criminalIdList.length > 0) {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            upGroup(val).then(res => {
              this.close()
              loading.close()
              this.$message.success('完成修改')
            })
          } else {
            this.$message.warning('请选择罪犯')
          }
        } else {
          this.$message.warning('请正确输入')
        }
      })
    },
    subEditOne(val) {
      upGroup(val).then(res => {
        this.getGroupList()
        this.$message.success('完成修改')
      })
    },
    openCrminal(row) {
      this.criVisible = true
      this.criGroupData = JSON.parse(JSON.stringify(row))
      this.groupCriLoading = true
      selGroupCriminal(row.id).then(res => {
        this.inGroupCriData.list = res
        this.groupCriLoading = false
      })
    },
    delOneCri(row) {
      let str = this.criGroupData.id + '/' + row.id
      deleteOne(str).then(res => {
        this.$message.success('移除成功')
        this.openCrminal(this.criGroupData)
      })
    },

    //罪犯是否可选中
    selectable(row) {
      return !this.createData.criminalIdList.includes(row.id)
    },
    selCriminalAll(arr) {
      this.teCriminalIdList = arr
    },
    //多选
    selCriAll() {
      this.createData.criminalIdList.push(
        ...this.teCriminalIdList.map(item => item.id)
      )
      this.selList.push(...this.teCriminalIdList)
    },
    criClose() {
      this.getGroupList()
      this.getPrisonTree(this.prisonId)
    },

    //批量移除
    removeAll() {
      MessageBox.confirm('确认解散小组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteList({
            groupId: this.criGroupData.id,
            criminalIds: this.removeList
          }).then(res => {
            this.$message.success(res)
            this.criVisible = false
          })
        })
        .catch(err => {
          Message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    removeCriminalAll(arr) {
      this.removeList = arr.map(item => item.id)
    }
  }
}
</script>
<style lang="less" scoped>
.not_area {
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
  margin: 2rem 0;
  font-weight: 600;
  color: #333;
}
.trees {
  padding-top: 1rem;
}
.technology {
  .el-textarea.is-disabled /deep/.el-textarea__inner {
    background: rgba(10, 10, 10, 0.5);
    color: #d1d3d3;
    border: 1px solid #1471bd;
  }
  .not_area,
  .criminalName,
  h3 {
    color: #fff;
  }
  .trees {
    padding-top: 0.2rem;
    .el-tree {
      color: #fff;
      box-shadow: 4px 0px 6px 0px rgba(11, 28, 61, 0.15);
      background: #054284;
      /deep/.el-tree-node__content:hover {
        background: rgba(7, 43, 91, 0.5);
      }
    }
  }
}
/deep/.el-tree-node {
  padding: 0.5rem 0;
}
.node_box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .count {
    background: #f56c6c;
    color: #fff;
    border-radius: 2px;
    padding: 2px;
    width: 3rem;
    font-size: 1.1rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
