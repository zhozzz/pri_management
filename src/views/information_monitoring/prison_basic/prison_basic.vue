<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-27 14:48:23
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:15:21
 -->
<template>
  <div class="mainbox">
    <!-- <menuTree :menuList="['信息监测','监狱基本信息']" /> -->

    <el-carousel v-if="imagelist.length>0" indicator-position="outside" height="44.285rem">
      <div v-for="(item,i) in imagelist" :key="i">
        <el-carousel-item v-if="i<9">
          <img class="banner" :src="item.url" alt />
        </el-carousel-item>
      </div>
    </el-carousel>
    <!--<div class="noImg" v-if="imagelist.length==0">暂无图片</div>-->
    <div class="noImg" v-if="imagelist.length==0">
      <img src="@/assets/login/background.png" class="banner" alt />
    </div>
    <div class="main">
      <div class="line_title">
        <div class="moudel_name">监狱信息</div>
        <el-button type="primary" class="yn_btn" @click="openPrisonEdit">修改</el-button>
      </div>

      <el-dialog
        title="部门信息配置"
        center
        :visible.sync="prisonEditFlag"
        width="60%"
        @close="closePrisonDialog"
        class="yn_dialog"
      >
        <el-form :model="prisonEditFrom" class="yn_form" ref="prisonForm" :rules="rules">
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="中文名称" prop="cnName">
                <el-input class="yn_ipt" v-model="prisonEditFrom.cnName" placeholder="请输入部门名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="英文名称" prop="enName">
                <el-input class="yn_ipt" v-model="prisonEditFrom.enName" placeholder="请输入英文名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="部门领导" prop="leader">
                <el-input class="yn_ipt" v-model="prisonEditFrom.leader" placeholder="请输入领导姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="联系方式" prop="mobilePhone">
                <el-input
                  class="yn_ipt"
                  v-model="prisonEditFrom.mobilePhone"
                  placeholder="请输入负责人电话"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="分管领导" prop="chargeLeader">
                <el-input class="yn_ipt" v-model="prisonEditFrom.chargeLeader" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="分管领导编号" prop="chargeLeaderPoliceNo">
                <el-input
                  class="yn_ipt"
                  v-model="prisonEditFrom.chargeLeaderPoliceNo"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="详细地址" prop="address">
                <el-input class="yn_ipt" v-model="prisonEditFrom.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="固定电话" prop="fixedPhone">
                <el-input class="yn_ipt" v-model="prisonEditFrom.fixedPhone" placeholder="请输入固定电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="押犯规模" prop="deptScale">
                <el-input class="yn_ipt" v-model="prisonEditFrom.deptScale" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="率属关系" prop="relation">
                <el-input class="yn_ipt" v-model="prisonEditFrom.relation" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="行政区划" prop="zonePosition">
                <el-input
                  class="yn_ipt"
                  v-model="prisonEditFrom.zonePosition"
                  placeholder="请输入行政区划"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="所属省市" prop="belongTo">
                <el-input class="yn_ipt" v-model="prisonEditFrom.belongTo" placeholder="请输入所属省市"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="创建时间" prop="createTime">
                <!-- <el-input
                  class="yn_ipt"
                  v-model="prisonEditFrom.createTime"
                  placeholder="请输入监狱创建时间"
                ></el-input>-->
                <el-date-picker
                  class="yn_ipt"
                  :value="prisonEditFrom.createTime"
                  type="date"
                  :clearable="false"
                  placeholder="选择日期"
                  @input="(val)=>{prisonEditFrom.createTime=val}"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="机构设置" prop="belongTo">
                <el-input class="yn_ipt" v-model="prisonEditFrom.organization" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="监狱概况" prop="introduction">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="prisonEditFrom.introduction"
              show-word-limit
              class="yn_ipt"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门图片" prop="fileList">
            <el-upload
              class="upload-demo"
              :action="_global.businessUrl+'/file/upload'"
              multiple
              :limit="9"
              :on-success="editupsuccess"
              :on-remove="editremovefile"
              :before-upload="beforeAvatarUpload"
              :file-list="prisonEditFrom.fileList"
              list-type="picture-card"
            >
              <el-button class="yn_btn" type="primary">添加</el-button>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button class="yn_btn" @click="$checkMessage(savePrisonEdit)" type="primary">保存</el-button>
          <el-button class="yn_btn" @click="prisonEditFlag = false">关闭</el-button>
        </div>
      </el-dialog>

      <div class="info_box">
        <div class="head_item">
          <div class="head_title">
            中文名称：
            <span>{{prisonInfo.cnName}}</span>
          </div>

          <div class="head_title">
            英文名称：
            <span>{{prisonInfo.enName?prisonInfo.enName:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            行政区划：
            <span>{{prisonInfo.zonePosition?prisonInfo.zonePosition:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            监狱负责人：
            <span>{{prisonInfo.leader?prisonInfo.leader:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            负责人电话：
            <span>{{prisonInfo.mobilePhone?prisonInfo.mobilePhone:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            所属省市：
            <span>{{prisonInfo.belongTo?prisonInfo.belongTo:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            联系电话：
            <span>{{prisonInfo.fixedPhone?prisonInfo.fixedPhone:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            创建时间：
            <span>{{prisonInfo.createTime?formatDate(new Date(prisonInfo.createTime),'yyyy-MM-dd'):'暂未填写'}}</span>
          </div>
          <div class="head_title">
            机构设置：
            <span>{{prisonInfo.organization?prisonInfo.organization:'暂未填写'}}</span>
          </div>
          <div class="head_title">
            押犯规模：
            <span>{{prisonInfo.deptScale?prisonInfo.deptScale:'暂未填写'}}</span>
          </div>
          <div class="head_title">
            率属关系：
            <span>{{prisonInfo.relation?prisonInfo.relation:'暂未填写'}}</span>
          </div>
          <div class="head_title">
            分管领导：
            <span>{{prisonInfo.chargeLeader?prisonInfo.chargeLeader:'暂未填写'}}</span>
          </div>
          <div class="head_title">
            分管领导编号：
            <span>{{prisonInfo.chargeLeaderPoliceNo?prisonInfo.chargeLeaderPoliceNo:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            地址：
            <span>{{prisonInfo.address?prisonInfo.address:'暂未填写'}}</span>
          </div>
        </div>
      </div>

      <div class="info_box">
        <div class="head_title">监狱概况</div>

        <div class="card_text">
          <span>{{prisonInfo.introduction?prisonInfo.introduction:'暂未填写'}}</span>
        </div>
      </div>
      <div class="line_title">
        <div class="moudel_name">指挥中心</div>

        <el-button type="primary" v-if="centerInfo.cnName" class="yn_btn" @click="openCenterEdit">修改</el-button>
      </div>

      <el-dialog
        title="指挥中心信息配置"
        center
        :visible.sync="centerEditFlag"
        width="60%"
        @close="closeCenterDialog"
        class="yn_dialog"
      >
        <el-form :model="centerEditFrom" class="yn_form" ref="centerForm" :rules="rules">
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="中文名称" prop="cnName">
                <el-input class="yn_ipt" v-model="centerEditFrom.cnName" placeholder="请输入部门名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="11" :offset="1">
              <el-form-item label="所属省市" prop="belongTo">
                <el-input class="yn_ipt" v-model="centerEditFrom.belongTo" placeholder="请输入所属省市"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="部门领导" prop="leader">
                <el-input class="yn_ipt" v-model="centerEditFrom.leader" placeholder="请输入领导姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="联系方式" prop="mobilePhone">
                <el-input
                  class="yn_ipt"
                  v-model="centerEditFrom.mobilePhone"
                  placeholder="请输入负责人电话"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="指挥中心领导编号" prop="leaderPoliceNo">
                <el-input class="yn_ipt" v-model="centerEditFrom.leaderPoliceNo" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="固定电话" prop="fixedPhone">
                <el-input class="yn_ipt" v-model="centerEditFrom.fixedPhone" placeholder="请输入固定电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="人员情况" prop="staffProfile">
                <el-input class="yn_ipt" v-model="centerEditFrom.staffProfile" placeholder="请输入 "></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="专项活动办设置情况" prop="activeSet">
                <el-input class="yn_ipt" v-model="centerEditFrom.activeSet" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head_item">
            <el-col :span="11">
              <el-form-item label="行政区划" prop="zonePosition">
                <el-input
                  class="yn_ipt"
                  v-model="centerEditFrom.zonePosition"
                  placeholder="请输入行政区划"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="11" :offset="1">
              <el-form-item label="创建时间" prop="createTime">
                <!-- <el-input
                  class="yn_ipt"
                  v-model="centerEditFrom.createTime"
                  placeholder="请输入监狱创建时间"
                ></el-input>-->
                <el-date-picker
                  class="yn_ipt"
                  :value="centerEditFrom.createTime"
                  type="date"
                  :clearable="false"
                  @input="(val)=>{centerEditFrom.createTime=val}"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="详细地址" prop="address">
                <el-input class="yn_ipt" v-model="centerEditFrom.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="监狱概况" prop="introduction">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="centerEditFrom.introduction"
              class="yn_ipt"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button class="yn_btn" @click="$checkMessage(saveCenterEdit)" type="primary">保存</el-button>
          <el-button class="yn_btn" @click="centerEditFlag = false">关闭</el-button>
        </div>
      </el-dialog>

      <div class="info_box" v-if="centerInfo.cnName">
        <el-row class="head_item">
          <div class="head_title">
            指挥中心领导：
            <span>{{centerInfo.leader?centerInfo.leader:'暂未填写'}}</span>
          </div>
          <div class="head_title">
            指挥中心领导编号：
            <span>{{centerInfo.leaderPoliceNo?centerInfo.leaderPoliceNo:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            所在位置：
            <span>{{centerInfo.address?centerInfo.address:'暂未填写'}}</span>
          </div>
        </el-row>

        <el-row class="head_item">
          <div class="head_title">
            联系方式：
            <span>{{centerInfo.mobilePhone?centerInfo.mobilePhone:'暂未填写'}}</span>
          </div>
          <div class="head_title">
            人员情况：
            <span>{{centerInfo.staffProfile?centerInfo.staffProfile:'暂未填写'}}</span>
          </div>

          <div class="head_title">
            专项活动办设置情况：
            <span>{{centerInfo.activeSet?centerInfo.activeSet:'暂未填写'}}</span>
          </div>
        </el-row>
      </div>
      <div class="info_box" v-if="!centerInfo.cnName">
        <div class="msg">
          暂未配置指挥中心
          <router-link :to="{name:'dep_mgt'}">前往配置</router-link>
        </div>
      </div>
      <div class="info_box">
        <div class="head_title">指挥中心概况</div>

        <div class="card_text">
          <span>{{centerInfo.introduction?centerInfo.introduction:'暂未填写'}}</span>
        </div>
      </div>
    </div>
    <div class="map_box">
      <!-- 地图组件 -->
      <spuerMap
        :triggerAlarm="{prisonName:emPrisonName,cameraIndexCodes:cameraIndexlist}"
        :height="height"
        @mapReady="getpriList"
        :closeMune="true"
      />
    </div>
  </div>
</template>
<script>
import { MessageBox, Message, Loading } from 'element-ui'
import { expnoraml, isIDCard, Isphone, Isname } from '@/utils/form_valid.js'
import menuTree from '@/components/menu_tree/'
import spuerMap from '@/components/super_map/'
import { getPrisonId, getDeptId, getDeptType } from '@/utils'
import { formatDate } from '@/utils/date'

export default {
  components: { menuTree, spuerMap },

  data() {
    return {
      emPrisonName: '',
      cameraIndexlist: [],
      typelist: [], // 部门类型
      //   deptId: '', // 监狱id
      deptType: '',
      prisonInfo: {}, // 监狱信息
      centerInfo: {}, // 指挥中心信息
      prisonEditFlag: false, // 编辑监狱
      prisonEditFrom: {},
      centerEditFlag: false, // 编辑指挥中心
      centerEditFrom: {},
      imagelist: [],
      // 表单验证
      rules: {
        cnName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
          //   { validator: expnoraml("部门名"), trigger: "blur" }
        ],
        introduction: [
          {
            min: 2,
            max: 300,
            message: '长度在 2到 300 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml("部门说明"), trigger: "blur" }
        ],
        leader: [
          { min: 2, max: 30, message: '长度在 2到 30 个字符', trigger: 'blur' }
          //   { validator: Isname, trigger: "blur" }
        ],
        mobilePhone: [{ validator: Isphone, trigger: 'blur' }],
        address: [
          {
            min: 2,
            max: 300,
            message: '长度在 2到 300 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml("部门地址"), trigger: "blur" }
        ],
        fixedPhone: [
          { min: 2, max: 50, message: '长度在 2到 50 个字符', trigger: 'blur' }
          //   { validator: expnoraml("联系方式"), trigger: "blur" }
        ],
        createTime: [
          //   {
          //     min: 2,
          //     max: 300,
          //     message: '长度在 2到 300 个字符',
          //     trigger: 'blur'
          //   }
          //   { validator: expnoraml(), trigger: "blur" }
        ],
        belongTo: [
          {
            min: 2,
            max: 300,
            message: '长度在 2到 300 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml(), trigger: "blur" }
        ],
        zonePosition: [
          {
            min: 2,
            max: 300,
            message: '长度在 2到 300 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml(), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    // if (this.$route.params.prisonId) {
    //   this.deptId = this.$route.params.prisonId
    // } else if (getPrisonId() != 1) {
    //   this.deptId = getPrisonId()
    // }
    this.height = window.innerHeight - 60 + 'px'
    this.getDeptType()
  },
  props: ['deptId'],
  watch: {
    deptId: {
      deep: true,
      handler(val) {
        this.getDeptType()
      }
    }
  },
  methods: {
    // 获取部门类型
    getDeptType() {
      let that = this
      this.axios
        .get(this._global.userUrl + '/dictionary/option/ORGANIZATION')
        .then(response => {
          that.typelist = response
          // 省局节点只有一个 不能操作更改
          response.forEach(item => {
            item.label == '监狱' ? (that.deptType = item.value) : ''
          })
          that.getpriList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取监狱
    getpriList() {
      let that = this
      let parms = {
        deptId: this.deptId,
        deptType: this.deptType,
        flag: 2
      }
      this.imagelist = []
      this.axios
        .post(this._global.userUrl + '/compose/getDetail', parms)
        .then(response => {
          this.typelist.forEach(item => {
            response.forEach(obj => {
              if (
                (item.label == '监狱' && item.value == obj.deptType) ||
                (item.label == '省局' && item.value == obj.deptType)
              ) {
                this.prisonInfo = obj
                if (this.prisonInfo.imageUrls) {
                  this.imagelist.push(...JSON.parse(this.prisonInfo.imageUrls))
                }

                this.emPrisonName = obj.cnName
              } else if (
                item.label == '指挥中心' &&
                item.value == obj.deptType
              ) {
                this.centerInfo = obj
                if (this.centerInfo.imageUrls) {
                  this.imagelist.push(...JSON.parse(this.centerInfo.imageUrls))
                }
              }
            })
          })
          console.log(this.prisonInfo)
          console.log(this.centerInfo)
        })
    },
    closePrisonDialog() {
      this.prisonEditFrom = {}
      this.$refs['prisonForm'].resetFields()
    },
    // 打开监狱信息编辑
    openPrisonEdit() {
      this.prisonEditFlag = true
      this.prisonEditFrom = JSON.parse(JSON.stringify(this.prisonInfo))

      let imageUrls = JSON.parse(this.prisonInfo.imageUrls)

      if (imageUrls !== null) {
        this.prisonEditFrom.fileList = imageUrls
      } else {
        this.prisonEditFrom.fileList = []
      }
    },
    // 保存更改
    savePrisonEdit() {
      this.$refs['prisonForm'].validate(valid => {
        if (valid) {
          this.prisonEditFrom.imageUrls = JSON.stringify(
            this.prisonEditFrom.fileList
          )
          this.prisonEditFrom.createTime = new Date(
            this.prisonEditFrom.createTime
          ).getTime()
          delete this.prisonEditFrom.fileList
          this.axios
            .post(
              this._global.userUrl + '/compose/editDetail',
              this.prisonEditFrom
            )
            .then(response => {
              console.log(response)

              if (response == 1) {
                this.$message.success('编辑成功')
                this.getpriList()
                this.prisonEditFlag = false
                this.prisonEditFrom = { image: [] }
              } else {
                this.$message.error('编辑失败')
              }
            })
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    },
    closeCenterDialog() {
      this.centerEditFrom = {}
      this.$refs['centerForm'].resetFields()
    },
    editupsuccess(res) {
      this.prisonEditFrom.fileList.push({
        name: res.data.fileName,
        url: res.data.filePath
      })
      this.$message.success('上传成功')

      Loading.service().close()
    },
    editremovefile(file, fileList) {
      this.prisonEditFrom.fileList = fileList
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
    // 打开指挥中心配置
    openCenterEdit() {
      this.centerEditFlag = true
      this.centerEditFrom = JSON.parse(JSON.stringify(this.centerInfo))
      console.log(this.centerEditFrom)
    },

    // 保存更改
    saveCenterEdit() {
      this.$refs['centerForm'].validate(valid => {
        if (valid) {
          this.centerEditFrom.createTime = new Date(
            this.centerEditFrom.createTime
          ).getTime()

          this.axios
            .post(
              this._global.userUrl + '/compose/editDetail',
              this.centerEditFrom
            )
            .then(response => {
              this.getpriList()
              this.centerEditFlag = false
              this.centerEditFrom = {}
              this.$message.success('编辑成功')
            })
        } else {
          Message.error({ message: '请完整填写' })

          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-date-editor.el-input,
/deep/.el-date-editor.el-input__inner {
  width: 100%;
}
.map_box {
  width: 100%;
  background: black;
  margin-top: 5rem;
}

.mainbox {
  width: 100%;
  box-sizing: border-box;
  //   padding: 2rem;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 1.4rem;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}
.noImg {
  width: 100%;
  font-size: 1.8rem;
  text-align: center;
  font-weight: 600;
  padding: 4rem 0;
  height: 44.285rem;
}
.banner {
  width: 100%;
  height: 100%;
}
.main {
  width: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 1rem;
  .line_title {
    border-bottom: 1px solid #ccc;
    width: 100%;
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    box-sizing: border-box;
    .moudel_name {
      font-size: 22/14rem;
    }
  }
}

.info_box {
  width: 100%;
  font-size: 1.4rem;
  box-sizing: border-box;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 10px;
  .head_item {
    margin: 0.8rem 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .head_title {
    margin: 1rem 0.5rem;
    width: 17%;
    font-size: 1.4rem;
    color: #333333;
    span {
      color: #000;
    }
  }
  .head_title:last-child {
    width: 40%;
  }
  .head_title::before {
    width: 3px;
    background: #2b8bef;
    margin-right: 0.5rem;
    content: '.';
    color: #2b8bef;
    border-radius: 2px;
  }
}

.card_text {
  width: 100%;
  height: 10rem;
  overflow: hidden;
  font-size: 1.4rem;
  position: relative;
  box-sizing: border-box;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 10px;
}

.msg {
  width: 100%;
  font-size: 1.4rem;
  margin: 1rem 0;
  text-align: center;
  color: #ccc;
  a {
    // text-decoration: none;
    &:hover {
      color: rgb(15, 37, 236);
    }
  }
}

.technology {
  .noImg,
  .main,
  .msg,
  .head_title,
  .head_title span,
  a {
    color: #fff;
  }
  .main {
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
  }
}
</style>
