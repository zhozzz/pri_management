<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-08-27 15:06:50
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-25 11:15:01
 -->
<template>
  <div>
    <dept-layout v-model="prisonId">
      <menuTree :menuList="['信息监测','监狱基本信息']">
        <prisonBasic :deptId="this.prisonId" />
        <!-- <div class="msg" v-if="prisonInfo == {}">
        暂未配置指挥中心
        <router-link :to="{ name: 'dep_mgt' }">前往配置</router-link>
      </div>

      <div class="info_box" v-if="prisonInfo !== {}" v-loading="infoLoading">
        <div class="title">
          {{ prisonInfo.departName }}
          <el-button type="primary" class="edit_btn yn_btn" @click="openEdit" v-if="theme == 1">修改</el-button>
        </div>
        <div class="info_bady">
          <el-row class="head_item">
            <div class="head_title">主管领导：{{ prisonInfo.leader }}</div>

            <div class="head_title">联系方式：{{ prisonInfo.leaderContact }}</div>

            <div class="head_title">位置：{{ prisonInfo.address }}</div>

            <div class="head_title">固定电话：{{ prisonInfo.contact }}</div>
            <el-button type="primary" class="edit_btn yn_btn" @click="openEdit" v-if="theme == 2">修改</el-button>
          </el-row>

          <div class="line_title">部门概况</div>

          <div class="introduction">{{ prisonInfo.departDesc ? prisonInfo.departDesc : "暂无信息" }}</div>
        </div>
        <div class="info_footer"></div>
      </div>
      <el-dialog
        title="部门信息配置"
        center
        class="yn_dialog"
        :visible.sync="editflag"
        width="50%"
        @close="colseDialog"
      >
        <el-form :model="editfrom" class="yn_form" ref="editForm" :rules="rules">
          <el-form-item label="指挥中心领导" prop="leader">
            <el-input class="yn_ipt" v-model="editfrom.leader" placeholder="请输入领导姓名"></el-input>
          </el-form-item>

          <el-form-item label="联系方式" prop="leaderContact">
            <el-input class="yn_ipt" v-model="editfrom.leaderContact" placeholder="请输入负责人电话"></el-input>
          </el-form-item>

          <el-form-item label="指挥中心位置" prop="address">
            <el-input class="yn_ipt" v-model="editfrom.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>

          <el-form-item label="固定电话" prop="contact">
            <el-input class="yn_ipt" v-model="editfrom.contact" placeholder="请输入固定电话"></el-input>
          </el-form-item>

          <el-form-item label="指挥中心位置概况" prop="introduction">
            <el-input
              :autosize="{ minRows: 6 }"
              type="textarea"
              placeholder="请输入内容"
              v-model="editfrom.departDesc"
              show-word-limit
              class="yn_ipt"
            ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button class="yn_btn" @click="$checkMessage(saveEdit)" type="primary">保存</el-button>
          <el-button class="yn_btn" @click="editflag = false">放弃</el-button>
        </div>
      </el-dialog>
      <div class="infinite-list-wrapper" style="overflow:auto" v-loading="listLoading">
        <ul class="list">
          <div v-for="(obj, i) in prisonArr" :key="i">
            <li v-if="obj.deptId == prisonId" class="list-item" @click="toprison(obj)">
              <div class="info_card">
                <div class="prison_img">
                  <img
                    v-if="obj.imageUrls!==null&&obj.imageUrls.length>0"
                    :src="obj.imageUrls[0].url"
                    alt
                  />
                </div>
                <div class="prison_info">
                  <div class="prison_name">{{ obj.cnName }}</div>
                  <div class="card_head">
                    <div class="head_item">联系电话： {{ obj.fixedPhone }}</div>
                    <div class="head_item">指挥中心领导： {{ obj.leader }}</div>

                    <div class="head_item">地址： {{ obj.address }}</div>
                  </div>

                  <div class="card_text">{{ obj.introduction }}</div>
                </div>
              </div>
            </li>
          </div>
        </ul>
        </div>-->
      </menuTree>
    </dept-layout>
  </div>
</template>
<script>
import { MessageBox, Message } from 'element-ui'
import { expnoraml, isIDCard, Isphone, Isname } from '@/utils/form_valid.js'
import deptLayout from '@/components/deptLayout'
import menuTree from '@/components/menu_tree/'
import { getPrisonId } from '@/utils'
import prisonBasic from '../prison_basic/prison_basic'

export default {
  components: { deptLayout, menuTree, prisonBasic },
  data() {
    return {
      prisonId: getPrisonId(),
      theme: 1,
      // 监狱数据
      prisondata: [],
      prisonInfo: {},
      // 部门类别
      typelist: [],
      infoLoading: true,
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      deptType: '', // 监狱类型部门字段
      centerType: '',
      editflag: false, // 编辑
      editfrom: {},
      // 表单验证
      rules: {
        cnName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
          //   { min: 2, max: 10, message: "长度在 2到 10 个字符", trigger: "blur" },
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
          {
            min: 2,
            max: 300,
            message: '长度在 2到 300 个字符',
            trigger: 'blur'
          }
          //   { validator: expnoraml("联系方式"), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getDeptType()
    this.theme = localStorage.getItem('theme')
    // this.getpriList();
  },
  beforeCreate() {
    // let prisonID = JSON.parse(localStorage.getItem('user')).prisonId
    // if (prisonID != 1) {
    //   this.$router.push({
    //     name: 'prison_basic',
    //     params: {
    //       prisonId: prisonID,
    //       deptType: this.deptType
    //     }
    //   })
    // }
  },
  computed: {
    prisonArr() {
      return this.prisondata
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
            item.label == '指挥中心' ? (that.centerType = item.value) : ''
          })
          that.getpriList()

          let times = new Date().getTime()

          that.getcenter(times)
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 获取监狱
    getpriList() {
      let that = this
      that.listLoading = true
      let parms = {
        deptType: this.deptType,
        flag: 1 // 省局1 监狱2
      }
      this.axios
        .post(this._global.userUrl + '/compose/getDetail', parms)
        .then(response => {
          response.forEach((item, i) => {
            item.deptType == this.centerType ? response.splice(i, 1) : ''

            item.imageUrls = JSON.parse(item.imageUrls)
          })
          that.prisondata = response
          that.listLoading = false
        })
    },
    getcenter(times) {
      let that = this
      that.infoLoading = true
      this.axios
        .get(this._global.userUrl + '/compose/getBuMenById/1?' + times)
        .then(response => {
          response.list.forEach(item => {
            item.departType == this.centerType ? (that.prisonInfo = item) : ''
          })
          that.prisonInfo.deptId = that.prisonInfo.id
          that.infoLoading = false
        })
    },
    // 打开编辑
    openEdit() {
      this.editflag = true
      this.editfrom = JSON.parse(JSON.stringify(this.prisonInfo))
    },
    // 保存编辑
    saveEdit() {
      this.editfrom.mobilePhone = this.editfrom.leaderContact
      this.editfrom.fixedPhone = this.editfrom.contact
      this.editfrom.introduction = this.editfrom.departDesc
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.axios
            // .post("http://10.64.81.59:8769/user/compose/editDetail",this.editfrom)
            .post(this._global.userUrl + '/compose/editDetail', this.editfrom)
            .then(response => {
              let times = new Date().getTime()
              this.getcenter(times)
              this.editflag = false
              this.editfrom = {}
              Message.success({ message: '修改成功' })
            })
        } else {
          Message.error({ message: '请完整填写' })
          return false
        }
      })
    },
    colseDialog() {
      this.editfrom = {}
      this.$refs['editForm'].resetFields()
    },
    // 前往监狱信息详情
    toprison(obj) {
      this.$router.push({
        name: 'prison_basic',
        params: {
          prisonId: obj.deptId
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.technology {
  .info_box {
    color: #fff;
    padding: 0;
    border: none;
    .title {
      background: url('~@/assets/technology/dialog_title_rest.png') center
        center;
      background-size: 100% 100%;
      background-color: transparent;
      font-weight: bold;
      padding: 0px 10px 15px;
      text-align: center;
      border: none;
      &:after {
        content: '';
        position: absolute;
        top: -9px;
        left: 0;
        height: 9px;
        width: 100%;
        background: no-repeat url('~@/assets/technology/dialog_title_top.png')
          center center;
        background-size: 100% 100%;
        background-color: transparent;
      }
    }
    .info_bady {
      box-sizing: border-box;
      padding: 1rem 8rem 0;
      border-left: 1px solid #0abcff;
      border-right: 1px solid #0abcff;
      box-shadow: 2.8rem 0 2.8rem -2.8rem #8fdcf9 inset,
        -2.8rem 0 2.8rem -2.8rem #8fdcf9 inset;
    }
    .info_footer {
      background: url('~@/assets/technology/dialog_bottom.png') center center;
      background-size: 100% 100%;
      padding-left: 4.17%;
      padding-bottom: 20px;
    }
    .head_item {
      .head_title {
        color: #fff;
      }
    }
  }
  .msg {
    color: #fff;
  }
  .infinite-list-wrapper .list-item {
    border: 1px solid #7cdafd;
    box-shadow: 28px 0 28px -28px #8fdcf9 inset, 0 28px 28px -28px #8fdcf9 inset,
      0 -28px 28px -28px #8fdcf9 inset, -28px 0 28px -28px #8fdcf9 inset;
    .info_card {
      color: #fff;
      .card_head {
        .head_item {
          color: #fff !important;
        }
      }
    }
  }
}
.title {
  width: 100%;
  padding: 1rem 0 2rem;
  font-size: 1.5rem;
  line-height: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.info_box {
  width: 100%;
  font-size: 1.3rem;
  position: relative;
  border: 1px solid #cddded;
  padding: 2rem 4rem 4rem;
  box-sizing: border-box;
  border-radius: 2px;
  margin: 1rem 0;
  .info_bady {
    width: 100%;
  }
  .head_item {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 1rem 0 2rem;
    .head_title {
      width: 20%;
      height: 1.4rem;
      font-size: 1.4rem;
      line-height: 1.4rem;
      color: #333;
    }
    .head_title::before {
      width: 2px;
      background: #2b8bef;
      margin-right: 0.5rem;
      content: '.';
      color: #2b8bef;
      border-radius: 2px;
    }
  }
  .edit_btn {
    margin: 0 2rem;
  }
}
.msg {
  width: 100%;
  font-size: 1.4rem;
  margin: 1rem 0;
  text-align: center;
  color: #ccc;
  a {
    text-decoration: none;
    &:hover {
      color: rgb(15, 37, 236);
    }
  }
}
.line_title {
  margin: 2rem 0;
  font-size: 1.4rem;
}
.line_title::before {
  width: 2px;
  background: #2b8bef;
  margin-right: 0.5rem;
  content: '.';
  color: #2b8bef;
  border-radius: 2px;
}
.introduction {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
}
.infinite-list-wrapper {
  width: 100%;
  height: 35rem;
  margin: 0;
  position: relative;

  .list {
    padding: 0 1rem;
    font-size: 1.2rem;
  }
  .list-item:hover {
    border: 2px solid #2b8bef;
  }
  .list-item {
    margin: 0;
    list-style: none;
    border: 1px solid #ccc;
    border-radius: 2px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .info_card {
      width: 100%;
      box-sizing: border-box;
      padding: 1rem;
      display: flex;
      align-items: center;
      .prison_img {
        width: 30%;
        height: 20rem;
        padding: 3rem;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .prison_info {
        width: 70%;
        .prison_name {
          width: 100%;
          margin: 2rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .card_head {
          width: 100%;
          display: flex;
          .head_item {
            width: 33%;
            margin: 0.2rem 0;
            color: #333;
            // border-left: 4px solid #2b8bef;
            font-size: 1.4rem;

            padding: 0 0.5rem;
            box-sizing: border-box;
          }
          .head_item::before {
            width: 2px;
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
          margin-top: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1.3rem;
          position: relative;
          box-sizing: border-box;
          padding: 1rem;
          box-sizing: border-box;
          border-radius: 2px;
        }
      }
    }
  }
  .loadmsg {
    width: 100%;
    font-size: 1.2rem;
    text-align: center;
    margin: 1rem 0;
    color: #ccc;
  }
}
</style>
