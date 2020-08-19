<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-22 09:21:15
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-24 16:28:45
 -->
<template>
  <menuTree :menuList="['系统管理','组织架构管理']">
    <div class="mainbox">
      <div class="right_box">
        <el-tree
          :data="prisondata"
          :props="defaultProps"
          :highlight-current="true"
          node-key="id"
          :expand-on-click-node="false"
          @node-click="showinfo"
        >
          <!-- @node-contextmenu="showMenu" -->
          <!-- 右键菜单插槽 -->
          <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <div class="menu" v-if="muneflag&&data.id==muneid&&data.id!=0">
            <div @click.stop="edit(data)">编辑部门</div>
            <div @click.stop="appendSon(data)">新建子部门</div>
            <div v-if="data.parentId!=0" @click.stop="delDep(data)">删除部门</div>
          </div>
          </span>-->
        </el-tree>

        <el-dialog
          title="新增部门"
          :visible.sync="depfalg"
          center
          class="yn_dialog"
          width="60%"
          @close="dialogClose"
        >
          <el-form
            :model="addform"
            class="yn_form"
            label-width="10rem"
            :rules="rules"
            ref="addForm"
          >
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门名称" prop="departName">
                  <el-input class="yn_ipt" v-model="addform.departName" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="英文名称" prop="departEnname">
                  <el-input class="yn_ipt" v-model="addform.departEnname" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门简称" prop="shortName">
                  <el-input class="yn_ipt" v-model="addform.shortName" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="说明">
                  <el-input class="yn_ipt" v-model="addform.departDesc" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="负责人姓名" prop="leader">
                  <el-input class="yn_ipt" v-model="addform.leader" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人电话" prop="leaderContact">
                  <el-input class="yn_ipt" v-model="addform.leaderContact" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门地址" prop="address">
                  <el-input class="yn_ipt" v-model="addform.address" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contact">
                  <el-input class="yn_ipt" v-model="addform.contact" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门类型" prop="departType">
                  <el-select class="yn_ipt" v-model="addform.departType">
                    <el-option
                      v-for="(item,i) in typelist"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门序列">
                  <el-input-number
                    :controls="false"
                    v-model="addform.orderSeq"
                    :min="1"
                    :max="10"
                    label="同级部门排序"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门图片" prop="fileList">
                  <el-upload
                    class="upload-demo"
                    :action="_global.businessUrl+'/file/upload'"
                    multiple
                    :limit="9"
                    :on-success="upsuccess"
                    :on-remove="removefile"
                    :before-upload="beforeAvatarUpload"
                    :file-list="addform.fileList"
                  >
                    <el-button class="yn_btn" type="primary">添加</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="yn_btn" type="primary" @click="$checkMessage(subAddPri)">保 存</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="编辑部门"
          class="yn_dialog"
          :visible.sync="editflag"
          center
          width="60%"
          @close="editclose"
        >
          <el-form
            class="yn_form"
            :model="editform"
            label-width="10rem"
            :rules="rules"
            ref="editForm"
          >
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门名称" prop="departName">
                  <el-input class="yn_ipt" v-model="editform.departName" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="英文名称" prop="departEnname">
                  <el-input class="yn_ipt" v-model="editform.departEnname" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门简称" prop="shortName">
                  <el-input class="yn_ipt" v-model="editform.shortName" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="说明">
                  <el-input class="yn_ipt" v-model="editform.departDesc" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="负责人姓名" prop="leader">
                  <el-input class="yn_ipt" v-model="editform.leader" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人电话" prop="leaderContact">
                  <el-input class="yn_ipt" v-model="editform.leaderContact" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门地址" prop="address">
                  <el-input class="yn_ipt" v-model="editform.address" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contact">
                  <el-input class="yn_ipt" v-model="editform.contact" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门类型" prop="departType">
                  <el-select
                    class="yn_ipt"
                    v-model="editform.departType"
                    :disabled="editform.TypeFlag"
                  >
                    <el-option
                      v-for="(item,i) in typelist"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门序列">
                  <el-input-number
                    :controls="false"
                    v-model="editform.orderSeq"
                    :min="1"
                    :max="10"
                    label="同级部门排序"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="部门图片" prop="fileList">
                  <el-upload
                    class="upload-demo"
                    :action="_global.businessUrl+'/file/upload'"
                    multiple
                    :limit="9"
                    :on-success="editupsuccess"
                    :on-remove="editremovefile"
                    :before-upload="beforeAvatarUpload"
                    :file-list="editform.fileList"
                    list-type="picture-card"
                  >
                    <el-button class="yn_btn" type="primary">添加</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="yn_btn" type="primary" @click="$checkMessage(subEdit)">保 存</el-button>
          </div>
        </el-dialog>
      </div>

      <div class="left_box">
        <div class="depTable" v-if="prisonInfo.departName!=''&&prisonInfo.departName!=null">
          <div class="dep_title">
            {{prisonInfo.departName}}
            <el-button
              style="marginLeft:5rem"
              class="yn_btn"
              type="primary"
              @click="appendSon"
            >新建子部门</el-button>
            <el-button class="yn_btn" type="primary" @click="edit">编辑部门</el-button>
            <el-button
              v-if="this.prisonInfo.id!=1"
              class="yn_btn"
              type="primary"
              @click="delDep"
            >删除部门</el-button>
            <el-button
              v-if="prisonInfo.departTypeName=='监区'||prisonInfo.departTypeName=='指挥中心'"
              class="yn_btn"
              type="primary"
              @click="openCameraBindDialog"
            >监控节点绑定</el-button>
          </div>
          <div class="dep_info">
            <div class="dep_info_item">简称:{{prisonInfo.shortName}}</div>
            <div class="dep_info_item">地址:{{prisonInfo.address}}</div>
            <div class="dep_info_item">部门类型:{{prisonInfo.departTypeName}}</div>
            <div class="dep_info_item">联系电话:{{prisonInfo.contact}}</div>
            <div class="dep_info_item">负责人:{{prisonInfo.leader}}</div>
            <div class="dep_info_item">负责人电话:{{prisonInfo.leaderContact}}</div>
            <div
              class="dep_info_item"
            >说明:{{prisonInfo.departDesc==null||prisonInfo.departDesc==''?'暂无':prisonInfo.departDesc}}</div>
            <div class="dep_info_item">绑定监控:{{currentDeptCameraInfo.cameraName}}</div>
            <div class="dep_info_item">代理用户:{{currentDeptCameraInfo.proxyUserName}}</div>
          </div>

          <!-- <div class="noDep" v-if="prisonDepInfo.length==0||prisonInfo.prisonName==''">暂无人员信息</div> -->
        </div>
      </div>
      <el-dialog
        title="监控点绑定"
        class="yn_dialog"
        :visible.sync="cameraBindDialog"
        center
        width="30%"
        @closed="resetForm('cameraBindForm')"
      >
        <div>
          <el-form
            :model="cameraBindForm"
            :rules="cameraBindFormRule"
            @submit.native.prevent
            ref="cameraBindForm"
            class="yn_form"
          >
            <el-form-item label="绑定点位" prop="cameraId">
              <el-select
                :remote-method="searchCamera"
                filterable
                v-model="cameraBindForm.cameraId"
                placeholder
                reserve-keyword
                remote
                class="yn_ipt"
              >
                <el-option
                  v-for="(item,i) in cameraOption"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="绑定用户" prop="proxyUserId">
              <el-select class="yn_ipt" filterable v-model="cameraBindForm.proxyUserId" placeholder>
                <el-option
                  v-for="(item,i) in deptUserOption"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="yn_btn" type="primary" @click="$checkMessage(updateDeptCameraBind)">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </menuTree>
</template>
<script>
import { MessageBox, Message, Loading } from 'element-ui'
import { expnoraml, IDCard, Isphone, Isname } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'

export default {
  components: { menuTree },

  data() {
    return {
      // 监狱数据
      prisondata: [],
      defaultProps: {
        children: 'list',
        label: 'departName'
      },
      // 部门类别
      typelist: [],
      // 排序
      ranklist: [1, 2, 3, 4, 5],
      // 监狱信息
      prisonInfo: {},
      // 监狱部门列表
      prisonDepInfo: [],
      muneflag: false, // 右键菜单
      muneid: '',
      depfalg: false, // 新增部门
      addform: {
        fileList: []
      },
      // 表单验证
      rules: {
        departName: [
          { min: 2, max: 50, message: '长度在 2到 50 个字符', trigger: 'blur' },
          { required: true, message: '请输入部门名称', trigger: 'blur' }
          //   { validator: expnoraml("部门名"), trigger: "blur" }
        ],
        departEnname: [
          { min: 2, max: 50, message: '长度在 2到 50 个字符', trigger: 'blur' }
          //   { validator: expnoraml("英文名称"), trigger: "blur" }
        ],
        shortName: [
          { min: 2, max: 50, message: '长度在 2到 50 个字符', trigger: 'blur' }
          //   { validator: expnoraml("部门简称"), trigger: "blur" }
        ],
        leader: [
          { min: 2, max: 8, message: '长度在 2到 8 个字符', trigger: 'blur' },
          { validator: Isname, trigger: 'blur' }
        ],
        leaderContact: [{ validator: Isphone, trigger: 'blur' }],
        address: [
          {
            min: 2,
            max: 300,
            message: '长度在 2到 300 个字符',
            trigger: 'blur'
          }
        ],
        contact: [
          {
            min: 2,
            max: 200,
            message: '长度在 2到 200 个字符',
            trigger: 'blur'
          }
        ],
        departType: [
          { required: true, message: '请选择部门类型', trigger: 'blur' }
        ]
      },

      editflag: false, // 编辑部门
      editform: {
        fileList: []
      }, // 修改部门
      editDepflag: false,
      cameraBindDialog: false,
      cameraBindForm: {
        deptId: '',
        cameraId: '',
        proxyUserId: ''
      },
      cameraBindFormRule: {
        cameraId: [
          { required: true, message: '请选择监控点位', trigger: 'blur' }
        ],
        proxyUserId: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ]
      },
      currentDeptCameraInfo: {
        proxyUserId: '',
        proxyUserName: '',
        cameraId: ''
      },
      deptUserOption: [],
      cameraOption: []
    }
  },
  created() {
    this.getpridata()
    this.getDeptType()
  },
  methods: {
    resetForm() {
      this.$refs.cameraBindForm.resetFields()
    },
    searchCamera(query) {
      let parentId = this.prisonInfo.parentId
      if (query !== '') {
        this.axios
          .get(
            this._global.userUrl +
              '/department/searchCamera/' +
              query +
              '/' +
              parentId
          )
          .then(rep => {
            rep == null ? (this.cameraOption = []) : (this.cameraOption = rep)
          })
      } else {
        this.options = []
      }
    },
    openCameraBindDialog() {
      this.axios
        .get(
          this._global.userUrl +
            '/department/enableUserOption/' +
            this.cameraBindForm.deptId
        )
        .then(rep => {
          rep == null ? (this.deptUserOption = []) : (this.deptUserOption = rep)
        })
      this.cameraBindDialog = true
    },
    updateDeptCameraBind() {
      this.$refs.cameraBindForm.validate(valid => {
        if (valid) {
          this.axios
            .put(
              this._global.userUrl + '/department/cameraBind',
              this.cameraBindForm
            )
            .then(rep => {
              this.getDeptCameraBindInfo()
              this.cameraBindDialog = false
            })
        } else {
          return false
        }
      })
    },
    // 获取部门类型
    getDeptType() {
      let that = this
      this.axios
        .get(this._global.userUrl + '/dictionary/option/ORGANIZATION')
        .then(response => {
          that.typelist = response
          that.typelist[0].disabled = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取全部监狱
    getpridata() {
      let that = this
      let user = JSON.parse(localStorage.getItem('user'))

      let loadingInstance = this.$loading({
        text: '加载中',
        background: 'rgba(0,0,0,0.7)'
      })

      if (user) {
        this.axios
          .get(
            this._global.userUrl + '/compose/getChildrenTree/' + user.prisonId
          )
          .then(response => {
            that.prisondata = [response]
            that.prisonInfo = response
            if (user.deptGuid == 1) {
              that.prisonInfo.departTypeName = '省局'
            }
            that.typelist.forEach(item => {
              item.value == that.prisonInfo.departType
                ? (that.prisonInfo.departTypeName = item.label)
                : ''
            })
            that.rank(that.prisondata[0])
            loadingInstance.close()
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        Message.error({ message: '未登录' })

        return false
      }
    },
    // 部门排序
    rank(data) {
      if (data.list) {
        data.list.sort((a, b) => {
          return a.orderSeq - b.orderSeq
        })
        data.list.forEach((item, i) => {
          this.rank(item)
        })
      }
    },
    // 关闭右键菜单
    hideMenu() {
      this.muneflag = false
    },
    // 打开右键菜单
    showMenu: function(parameter, obj, node, el) {
      parameter.preventDefault()
      this.muneflag = true
      this.muneid = obj.id
    },
    // 图片上传
    upsuccess(res) {
      this.addform.fileList.push({
        name: res.data.fileName,
        url: res.data.filePath
      })
      this.$message.success('上传成功')

      Loading.service().close()
    },
    editupsuccess(res) {
      this.editform.fileList.push({
        name: res.data.fileName,
        url: res.data.filePath
      })
      this.$message.success('上传成功')

      Loading.service().close()
    },
    removefile(file, fileList) {
      this.addform.fileList = fileList
      this.axios
        .delete(
          this._global.businessUrl + '/file/delete/' + file.response.data.fileId
        )
        .then(res => {
          console.log(res)
          this.$message.success(res)
        })
    },
    editremovefile(file, fileList) {
      this.editform.fileList = fileList
      this.axios
        .delete(
          this._global.businessUrl + '/file/delete/' + file.response.data.fileId
        )
        .then(res => {
          console.log(res)
          this.$message.success(res)
        })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式和 PNG 格式!')
      } else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      } else {
        console.log(Loading)

        Loading.service({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      return isJPG && isLt2M
    },
    // 打开修改
    edit(node, data) {
      this.editflag = true
      this.editform = JSON.parse(JSON.stringify(this.prisonInfo))
      console.log(this.prisonInfo)
      if (this.editform.image) {
        this.editform.fileList = JSON.parse(this.editform.image)
      } else {
        this.editform.fileList = []
      }
      if (this.prisonInfo.id == 1) {
        this.editform.TypeFlag = true
      }
    },

    // 保存部门修改
    subEdit() {
      let that = this
      let prison = this.editform
      prison.image = JSON.stringify(prison.fileList)
      delete prison.fileList
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.axios
            .post(this._global.userUrl + '/compose/editDepart', prison)
            .then(response => {
              that.editflag = false
              Message({
                type: 'success',
                message: '编辑成功!'
              })
              that.getpridata()
              that.editform = {}
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    // 打开新增部门
    appendSon(data) {
      this.addform.parentId = this.prisonInfo.id
      this.depfalg = true
    },
    // 保存新增部门
    subAddPri() {
      let that = this
      let depart = this.addform
      depart.image = JSON.stringify(depart.fileList)
      delete depart.fileList
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.axios
            .put(this._global.userUrl + '/compose/addDepart', depart)
            .then(response => {
              that.depfalg = false
              Message({
                type: 'success',
                message: '添加成功!'
              })
              that.getpridata()
              that.addform = {}
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    dialogClose() {
      this.addform = {
        fileList: []
      }
      this.$refs['addForm'].clearValidate()
    },
    editclose() {
      this.editform = {
        fileList: []
      }
      this.$refs['editForm'].clearValidate()
    },
    // 部门信息
    showinfo(data) {
      this.muneflag = false
      this.prisonInfo = JSON.parse(JSON.stringify(data))
      this.cameraBindForm.deptId = this.prisonInfo.id
      this.typelist.forEach(item => {
        item.value == this.prisonInfo.departType
          ? (this.prisonInfo.departTypeName = item.label)
          : ''
      })
      this.getDeptCameraBindInfo()
    },
    getDeptCameraBindInfo() {
      // 获取部门的监控点绑定信息
      this.deptUserOption = []
      this.cameraOption = []
      this.currentDeptCameraInfo = {}
      this.cameraBindForm.cameraId = ''
      this.cameraBindForm.proxyUserId = ''
      this.axios
        .get(
          this._global.userUrl +
            '/department/cameraInfo/' +
            this.cameraBindForm.deptId
        )
        .then(rep => {
          if (rep != null) {
            this.currentDeptCameraInfo = rep
            this.cameraBindForm.proxyUserId = this.currentDeptCameraInfo.proxyUserId
            this.cameraBindForm.cameraId = this.currentDeptCameraInfo.cameraId
            this.cameraOption.push({
              label: this.currentDeptCameraInfo.cameraName,
              value: this.currentDeptCameraInfo.cameraId
            })
          }
        })
    },

    // 删除部门
    delDep(data) {
      let that = this
      if (this.prisonInfo.list.length > 0) {
        this.hideMenu()
        Message({
          type: 'warning',
          message: '此部门内含有下属部门!'
        })
      } else {
        let ids = this.prisonInfo.id

        this.axios
          .get(this._global.userUrl + '/userManage/getUserCountByDeptId/' + ids)
          .then(res => {
            console.log(res)
            if (res < 1) {
              MessageBox.confirm('此操作将永久删除, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.axios
                    .delete(this._global.userUrl + '/compose/delDepart/' + ids)
                    .then(response => {
                      that.getpridata()
                      Message({
                        type: 'success',
                        message: '删除成功!'
                      })
                    })
                    .catch(error => {
                      console.log(error)
                    })
                })
                .catch(() => {
                  Message({
                    type: 'info',
                    message: '已取消删除'
                  })
                })
            } else {
              this.hideMenu()
              Message({
                type: 'warning',
                message: '此部门内含有用户!'
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.technology {
  .dep_title,
  .dep_info {
    color: #fff;
  }
  /deep/ .el-input-number {
    .el-input__inner {
      background: transparent !important;
    }
  }

  .el-tree {
    background: transparent;
    color: #fff;
    /deep/.el-tree-node__content:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}
/deep/.el-tree-node__label {
  font-size: 1.4rem;
}
.mainbox {
  width: 100%;
  display: flex;
  .right_box {
    width: 30%;
    position: relative;
    box-sizing: border-box;
    padding: 1rem 1rem 1rem 0;
  }
  .left_box {
    width: 70%;
    border-left: 1px solid #aacce8;
    .dep_title {
      box-sizing: border-box;
      padding: 2rem 1rem;
      width: 100%;
      font-size: 1.4rem;
      border-bottom: 1px solid #aacce8;
      font-weight: bold;
    }
    .dep_info {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem 1rem;
      .dep_info_item {
        margin: 1rem 0;
      }
    }
  }
}
.menu {
  position: absolute;
  border: 1px solid #ccc;
  font-size: 1.1rem;
  padding: 0.6rem 0.5rem;
  background-color: #fff;
  color: #409eff;
  z-index: 90;
  right: 0;
  border-radius: 5px;
  div {
    margin: 0.8rem 0;
  }
}
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.el-table {
  padding: 1rem;
  box-sizing: border-box;
}

.noDep {
  font-size: 1.4rem;
  text-align: center;
  margin: 4rem 0;
}
.tab_btn {
  display: block;
  margin: 0.5rem;
}

// /deep/ .el-input-number__decrease {
//   height: 90%;
//   line-height: 2.5rem;
//   font-size: 1.1rem;
//   top: 0.1rem;
// }
// /deep/ .el-input-number__increase {
//   height: 90%;
//   line-height: 2.5rem;
//   font-size: 1.1rem;
//   top: 0.1rem;
// }
// /deep/ .el-input-number {
//   height: 2.5rem;
//   width: 100%;
//   .el-input {
//     height: 2.5rem;
//     line-height: 30px;
//   }
//   .el-input__inner {
//     height: 2.5rem;
//   }
// }
</style>
