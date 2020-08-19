<!--
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 09:40:41

 -->
<template>
  <div id="index_page">
    <el-container>
      <el-header class="index_head" :class="isMainPage ? '' : 'main_head'">
        <div class="index_head_title">
          <img src="@/assets/index/title.png" class="headIMG" />
          <router-link class="head_title_content" :to="{ name: 'beindex' }">
            <!-- <img src="@/assets/beindex/title-inside.png" class="headIMG" /> -->

            <div class="headName">云南监狱指挥中心综合管理平台(业务系统)</div>
            <div class="deptName" v-if="user.prisonId != 1">{{ deptName }}</div>
          </router-link>
        </div>
        <div class="index_head_nav">
          <div class="nav_item">
            <div class="nav_icon">
              <router-link class="head_title_content" :to="{ name: 'beindex' }">首页</router-link>
            </div>
          </div>
          <div
            class="nav_item"
            v-for="(item, i) in menuData"
            :key="i"
            @mouseover="item.flag = true"
            @mouseleave="item.flag = false"
          >
            <div class="nav_icon">
              <span @click="$router.push({ name: item.menuEnName })">{{ item.menuName }}</span>
            </div>
            <transition name="fade" v-if="item.flag && item.children.length != 0">
              <div class="nav_menu menu_prison" v-if="item.children[0].children.length != 0">
                <div class="menu_item" v-for="(obj, j) in item.children" :key="j">
                  <div>
                    <div class="menu_title menu_father">{{ obj.menuName }}</div>
                    <router-link
                      class="menu_list"
                      v-for="(son, k) in obj.children"
                      :key="k"
                      :to="{ name: son.menuEnName }"
                    >{{ son.menuName }}</router-link>
                  </div>
                </div>
              </div>
              <div class="nav_menu" v-if="item.children[0].children.length == 0">
                <div class="menu_item">
                  <router-link
                    class="menu_list"
                    v-for="(bro, p) in item.children"
                    :key="p"
                    :to="{ name: bro.menuEnName }"
                  >{{ bro.menuName }}</router-link>
                </div>
              </div>
            </transition>
          </div>
          <div class="nav_item">
            <div class="nav_icon">
              <!--<span @click="checkVideo">视频监控</span>-->
              <a :href="'openExeTest://'+hkUserinfo">视频监控</a>
            </div>
          </div>
          <div class="nav_item">
            <div class="nav_icon">
              <a target="_blank" href="https://10.1.10.55/portal/download">
                <i class="el-icon-download"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="index_head_notice">
          <el-badge :value="noticeBadge" class="item">
            <div @click="noticeToggle = true">
              <i class="el-icon-message-solid"></i>
            </div>
          </el-badge>
        </div>
        <div class="index_head_emp">
          <div @click="show">{{ username }}</div>
        </div>
        <div class="index_head_logout">
          <div @click="logout">
            <i class="el-icon-switch-button"></i>
          </div>
        </div>

        <!-- <div class="info_runner" v-if="noticeBadge > 0&&showFlag" @click="hideRun">
          <div class="run_way">
            <span class="medium" v-for="(item, i) in noticeRow" :key="i">
              {{
              item.title
              }}
            </span>
          </div>
        </div>-->
      </el-header>
      <el-container>
        <el-main class="yn_main" style="padding:0;">
          <router-view @getNewMenu="newMenu"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="个人信息修改"
      :visible.sync="dialogVisible"
      center
      @close="resetForm('ruleForm')"
      width="30%"
      close="yn_dialog"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model.number="ruleForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardNo">
          <el-input v-model.number="ruleForm.cardNo"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNo">
          <el-input v-model.number="ruleForm.phoneNo"></el-input>
        </el-form-item>
        <el-form-item label="工作地址" prop="address">
          <el-input v-model.number="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passWord">
          <el-input type="password" v-model="ruleForm.passWord" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <notice v-model="noticeToggle" @upNotice="getNoticeBadge"></notice>
  </div>
</template>
<script>
import _globalUrl from '@/utils/global_url'
import {
  expnoraml,
  isIDCard,
  Isphone,
  Isname,
  passwordStrengthValidator
} from '@/utils/form_valid.js'
import notice from './notice'
import { quit } from './logout'
import { getPrisonId, getUserId } from '@/utils'
import { alertUndo } from '@/utils/alertUndo'
import { getDeptId } from '../../../utils'
import md5 from 'js-md5'
import formatDate from '@/utils/date'

export default {
  components: { notice },
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (this.ruleForm.pass) {
        console.log(this.ruleForm.pass)

        if (value === '') {
          callback(new Error('请输入旧密码'))
        } else {
          this.axios
            .get(
              this._global.userUrl +
                '/userManage/getUserById/' +
                this.ruleForm.userGuid
            )
            .then(data => {
              if (md5(value) !== data.passWord) {
                callback(new Error('与旧密码不一致'))
              } else {
                callback()
              }
            })
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      const pwdReg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)
      if (value == '') {
        callback(new Error('请输入密码'))
      } else if (value) {
        console.log(this.ruleForm.pass)

        if (!pwdReg.test(value)) {
          console.log(value)
          callback(new Error('密码必须包含数字和字母组合'))
        } else {
          if (this.ruleForm.passWord !== '') {
            this.$refs.ruleForm.validateField('passWord')
          }
          callback()
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      deptId: getDeptId(),
      showFlag: true,
      callDialog: false,
      target: '',
      noticeBadge: 0,
      noticeRow: [],
      noticeToggle: false, // 通知页面
      username: '',
      user: {},
      ruleForm: {
        oldPass: '',
        pass: '',
        passWord: '',
        phoneNo: '',
        address: '',
        cardNo: '',
        realName: '',
        userGuid: JSON.parse(localStorage.getItem('user')).userGuid
      },
      rules: {
        realName: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
          { validator: Isname, trigger: 'blur' }
        ],
        // phoneNo: [
        //   { required: true, message: '请输入联系方式', trigger: 'blur' },
        //   { validator: Isphone, trigger: 'blur' }
        // ],
        // cardNo: [
        //   { required: true, message: '请输入用户身份证号', trigger: 'blur' },
        //   { validator: isIDCard, trigger: 'blur' }
        // ],
        // oldPass: [{ validator: validateOldPass, trigger: 'blur' }],
        // pass: [
        //   {
        //     min: 8,
        //     max: 15,
        //     message: '长度在 8 到 15 个字符',
        //     trigger: 'blur'
        //   },
        //   { validator: validatePass, trigger: 'blur' }
        //   //   { validator: passwordStrengthValidator, trigger: 'blur' }
        // ],
        // passWord: [{ validator: validatePass2, trigger: 'blur' }],
        address: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      prsVisible: false,
      cmdVisible: false,
      monitorVisible: false,
      assistVisible: false,
      sysVisible: false,
      left: '',
      menuData: [],
      isMainPage: false, // 是否首页
      deptName: '',
      timer: null,
      timeNum: 0,
      hkUserinfo: ''
    }
  },
  destroyed() {
    if (this.timer) {
      this.timer = null
    }
  },
  created() {
    this.username = JSON.parse(localStorage.getItem('user')).realName
    this.user = JSON.parse(localStorage.getItem('user'))
    this.deptName = this.user.prisonName + '-' + this.user.deptName
    this.getmunedata()
    this.getHKuserInfo()
    // this.hkUserinfo = '-s:10.1.10.55;-u:admin;-p:BTBUAICOCPBXJCDEJAAK;-t:0;'
  },
  mounted() {
    this.getNoticeBadge()
    this.wsLogin()
    if (!this.wsInterVal) {
      let testNum = 0
      this.wsInterVal = setInterval(() => {
        testNum++
        if (this._globalWs.ws.readyState == 3 && testNum < 5) {
          this.wsLogin()
        }
      }, 2000)
    }
    // 每分钟检查一日工作流程事宜并提醒

    // if (!this.AlertInterval) {
    //   this.AlertInterval = setInterval(this.alertDayWorkInfo, 60 * 1000)
    // }

    // this.timer = setInterval(this.alertDayWorkInfo, 60 * 1000)
  },
  beforeDestroy() {
    if (this.wsInterVal) {
      clearInterval(this.wsInterVal)
    }
  },
  methods: {
    getHKuserInfo() {
      //51服务器暂时注释
      this.axios({
        method: 'get',
        url:
          _globalUrl.videoUrl2 + '/application/fetchLoginInfo/' + getUserId(),
        // url: 'http://10.1.10.50:9999/application/fetchLoginInfo/' + getUserId(),
        withCredentials: true
      })
        .then(res => {
          console.log('hkinfo' + res)
          this.hkUserinfo =
            '-s:' +
            res.host +
            ':443' +
            ';-u:' +
            res.username +
            ';-p:' +
            JSON.parse(localStorage.getItem('user')).mpassword +
            ';-t:0;'
          console.log(this.hkUserinfo)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    //避免走马灯消息滚动挡住页面交互
    hideRun() {
      this.showFlag = false
      let that = this
      setTimeout(function() {
        that.showFlag = true
      }, 2000)
    },
    makeSounds() {
      let audio = new Audio()
      audio.src = '../../../../static/audio/10880.mp3'
      audio.play()
    },
    wsLogin() {
      if (this._globalWs.ws && this._globalWs.ws.readyState == 1) {
        return
      }
      let userId = getUserId()
      let ws = null
      if ('WebSocket' in window) {
        ws = new WebSocket(this._global.wsUrl + '/socketServer/' + userId)
        console.log(ws)

        this._globalWs.setWs(ws)
      } else {
        this.$message.error('浏览器不支持websocket')
      }
      // 接受来自服务端推送的信息
      ws.onmessage = evt => {
        let message = ''

        try {
          message = JSON.parse(evt.data)
          console.log(message)
          if (message.event == 'warning') {
            this.sudEvent(message)
          }
          // eslint-disable-next-line eqeqeq
          if (message.type == 'rtc') {
            switch (message.event) {
              // 实时保持人数更新，可以看到最新得总人数信息和是否在通话信息
              case 'list':
                this._globalWsUsers.setWsUsers(
                  message.data.filter(user => user.userId != userId)
                )
                break
              case 'call':
                this.handleCall(message)
                break
              default:
                break
            }
            this.bus.$emit('message', message)
          } else if (message.type == 'hk') {
            switch (message.event) {
              // 实时保持人数更新，可以看到最新得总人数信息和是否在通话信息
              case 'list':
                this._globalWsUsers.setHkWsUsers(
                  message.data.filter(user => user.userId != userId)
                )
                break
              case 'call':
                this.handleCall(message)
                break
              default:
                break
            }
            this.bus.$emit('av_hk', message)
          } else if (message.type == 'download') {
            //下载完成提示
            this.$message.success(message.data)
          } else if (message.type == 'baseData') {
            //基本数据授权
            this.permission(message)
          } else if (message.type == 'rejectReport') {
            //基本数据 打回上报
            console.log(message.data)

            this.rejectReport(message)
          } else if (message.type == '511') {
            //5+1+1提示
            this.$notify({
              title: message.data.date,
              message: message.data.tittle,
              duration: 0
            })
          }
        } catch (e) {
          message = evt.data
          console.log(message)
          this.makeSounds()

          if (evt.data.indexOf('未读消息') != -1) {
            let unReadNum = this.noticeBadge
            this.noticeBadge = parseInt(unReadNum) - 1
          } else {
            let unReadNum = this.noticeBadge
            this.noticeBadge = unReadNum + 1
            this.$notify({
              title: '通知',
              message: message,
              type: 'warning'
            })
          }
        }
      }
      // 断开连接触发
      ws.onclose = evt => {
        // console.log('%s:服务端断开', userId)
        let message = {
          event: 'wsClose'
        }
        this.bus.$emit('message', message)
      }
      // 和服务端连接成功触发
      ws.onopen = function(evt) {
        // console.log('%s:服务端连接', userId)
      }
    },
    handleCall(message) {
      console.log('call')
      console.log(message)
      // 收到通话邀请
      this.$notify({
        title: '有新的通话邀请',
        dangerouslyUseHTMLString: true,
        message: '<p>点击前往处理</p>',
        onClick: () => {
          this.accept(message)
        }
      })
    },

    //基本数据申请授权

    permission(val) {
      let data = val.data
      this.$confirm(data.tittle, '提示', {
        confirmButtonText: '允许授权',
        cancelButtonText: '拒绝授权',
        type: 'warning'
      })
        .then(() => {
          let str =
            data.date +
            '/' +
            data.prisonId +
            '/' +
            data.deptId +
            '/' +
            1 +
            '/' +
            data.userId
          this.axios
            .get(
              _globalUrl.businessUrl + '/dataReport/disposePermission/' + str
            )
            .then(res => {
              this.$message.success('处理成功')
              this.$router.go(0)
            })
        })
        .catch(() => {
          let str =
            data.date +
            '/' +
            data.prisonId +
            '/' +
            data.deptId +
            '/' +
            0 +
            '/' +
            data.userId

          this.axios
            .get(
              _globalUrl.businessUrl + '/dataReport/disposePermission/' + str
            )
            .then(res => {
              this.$message.success(res)
              this.$router.go(0)
            })
        })
    },

    //基本数据打回上报
    rejectReport(val) {
      let data = val.data
      console.log('打回上报' + data)
      this.$message.warning(data)
      this.$notify({
        title: '警告',
        message: data,
        type: 'warning'
      })
      this.$confirm(data, '提示', {
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(
              _globalUrl.businessUrl +
                '/dataReport/confirmRejectedReport/' +
                getPrisonId() +
                '/' +
                getDeptId()
            )
            .then(res => {
              this.$message.success('已确认')
              this.$router.go(0)
            })
        })
        .catch(() => {
          this.axios
            .post(
              _globalUrl.businessUrl +
                '/dataReport/confirmRejectedReport/' +
                getPrisonId() +
                '/' +
                getDeptId()
            )
            .then(res => {
              this.$router.go(0)
              //   this.$message.success('已确认')
            })
          //   this.$message.warning('未确认打回上报')
        })
    },

    //查看打回原因
    seeReject() {},
    sudEvent(val) {
      let data = val.data
      console.log(data)
      let type = data.alarmType == 1 ? '手动报警' : '自动报警'
      let level = ''
      switch (data.alarmLevel) {
        case '1':
          level = '轻微'
          break
        case '2':
          level = '较低'

          break
        case '3':
          level = '中等'

          break
        case '4':
          level = '较高'

          break
        case '5':
          level = '严重'

          break
        default:
          break
      }
      this.$confirm(
        `${data.emPrisonName}${data.alarmAddress}通过${type}发生${level}${data.alarmEventName}事件`,
        '提示',
        {
          confirmButtonText: '关闭',
          //   confirmButtonText: '前往指挥',
          cancelButtonText: '标记为误报',
          type: 'warning'
        }
      )
        .then(() => {
          this.$message.success('关闭')
          //   this.axios
          //     .post(_globalUrl.businessUrl + '/emergencyEvent/getAlarmUserId', {
          //       emergencyEventId: data.emergencyEventId,
          //       alarmUserId: this.user.userGuid
          //     })
          //     .then(res => {
          //   console.log(res)
          //   if (res) {
          //     this.axios
          //       .put(_globalUrl.businessUrl + '/emergencyEvent/update', {
          //         emergencyEventId: data.emergencyEventId,
          //         alarmUserId: this.user.userGuid,
          //         status: 0
          //       })
          //       .then(response => {
          //         this.$router.push({
          //           name: 'emergency_command',
          //           params: data
          //         })
          //       })
          //   } else {
          //     this.$message.warning('已有指挥人员正在处理')
          //   }
          // })
        })
        .catch(() => {
          this.axios
            .put(_globalUrl.businessUrl + '/emergencyEvent/update', {
              emergencyEventId: data.emergencyEventId,
              isMisreport: 1
            })
            .then(res => {
              //   this.$message.success('成功')
            })
            .catch(error => {
              this.$message.error('报错')
            })

          this.axios
            .post(_globalUrl.businessUrl + '/emergencyEvent/insertDetail', {
              emergencyEventId: data.emergencyEventId,
              operateContent: '标记为误报'
            })
            .then(res => this.$message.success('成功'))
        })
    },
    accept(message) {
      if (message.type == 'hk') {
        this.$router.push({
          name: 'av_hk',
          params: { message: JSON.stringify(message) }
        })
      }
    },

    getNoticeBadge() {
      this.axios
        .get(
          //   _globalUrl.baseUrl +
          //     `/base/message/unReadNum/${getDeptId()}/${getUserId()}`
          _globalUrl.NoSSLUrl +
            `/message/unReadNum/${getDeptId()}/${getUserId()}`
        )
        .then(response => {
          this.noticeBadge = response
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    newMenu(val) {
      this.getmunedata()
    },
    openMenu(val) {
      this.val = true
    },
    show() {
      this.dialogVisible = true
      this.ruleForm = JSON.parse(JSON.stringify(this.user))
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        const pwdReg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)

        if (valid) {
          if (this.ruleForm.pass) {
            if (!pwdReg.test(this.ruleForm.pass)) {
              this.$message.success('密码必须包含数字和字母组合!')
            } else {
              if (this.ruleForm.pass !== this.ruleForm.passWord) {
                this.$message.warning('两次输入密码不一致')
              } else {
                if (this.ruleForm.oldPass === '') {
                  this.$message.warning('请输入旧密码')
                } else {
                  this.axios
                    .get(
                      this._global.userUrl +
                        '/userManage/getUserById/' +
                        this.ruleForm.userGuid
                    )
                    .then(data => {
                      if (md5(this.ruleForm.oldPass) !== data.passWord) {
                        this.$message.warning('与旧密码不一致')
                      } else {
                        this.axios
                          .post(
                            _globalUrl.userUrl + '/userManage/editUser',
                            this.ruleForm
                          )
                          .then(data => {
                            this.$message.success('修改成功!')

                            this.dialogVisible = false
                            this.resetForm(formName)
                          })
                      }
                    })
                }
              }
            }
          } else {
            this.axios
              .post(_globalUrl.userUrl + '/userManage/editUser', this.ruleForm)
              .then(data => {
                this.$message.success('修改成功!')

                this.dialogVisible = false
                this.resetForm(formName)
              })
          }
        } else {
          this.$message.warning('请完整填写')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取导航菜单
    getmunedata() {
      let userId = this.user.userGuid
      this.axios
        .get(_globalUrl.userUrl + '/menu/getMyMenuTree/' + userId)
        .then(data => {
          data.forEach(item => {
            item.flag = false
          })
          this.menuData = data
        })
    },
    // 注销
    logout() {
      quit()
    },
    // 视频监控
    checkVideo() {
      let url = window.location.href.split('index')[0] + 'index/check_video'
      console.log(url)
      window.open(url)
      //   this.$router.push({ name: 'check_video' })
    },
    // 获取一日工作流程信息对象
    async getDayWorkInfo() {
      let dayWorkInfo = JSON.parse(localStorage.getItem('dayWorkInfo'))
      if (dayWorkInfo == null || dayWorkInfo === '') {
        dayWorkInfo = await this.fetchDayWorkInfo()
      }
      console.log(dayWorkInfo)

      return dayWorkInfo
    },
    // 根据用户id,获取当前用户的一日工作流程,并且保存到localStorage中
    fetchDayWorkInfo() {
      let userId = this.user.userGuid
      let info = null
      this.axios
        .get(
          _globalUrl.businessUrl + '/dayWork/fetchDayWorkInfoByUserId/' + userId
        )
        .then(data => {
          // 将每一个工作事宜的'是否已提醒'标记为false
          data.forEach(item => {
            item.flag = false
          })
          info = data
          localStorage.setItem('dayWorkInfo', JSON.stringify(info)) // 存入localStorage
          console.log(info)
          return info
        })
    },
    // 检查工作流程中是否有十分钟以内的未提醒事宜,将其提示出来
    async alertDayWorkInfo() {
      //   let dayWorkInfo = this.getDayWorkInfo()
      let dayWorkInfo = null
      this.timeNum += 1
      if (this.timeNum > 10) {
        this.timeNum = 0
      } else {
        dayWorkInfo = JSON.parse(localStorage.getItem('dayWorkInfo'))
      }
      if (
        dayWorkInfo == null ||
        dayWorkInfo === '' ||
        dayWorkInfo.length == 0
      ) {
        // dayWorkInfo = this.fetchDayWorkInfo()
        let str = this.deptId + '/' + formatDate(new Date(), 'yyyy-MM-dd')
        let info = null
        await this.axios
          .get(_globalUrl.businessUrl + '/dayWork/queryDayWorkFlow/' + str)
          .then(data => {
            // 将每一个工作事宜的'是否已提醒'标记为false
            if (data) {
              data.repeatUndos.forEach(item => {
                item.flag = false
              })
              info = data.repeatUndos
              localStorage.setItem('dayWorkInfo', JSON.stringify(info)) // 存入localStorage

              dayWorkInfo = info
            }
          })
      }

      if (dayWorkInfo != null && dayWorkInfo) {
        for (let i = 0; i < dayWorkInfo.length; i++) {
          // 如果其dayDate在当前时间的十分钟内,并且flag为false,则提醒出来
          if (dayWorkInfo[i].flag) {
            continue
          }
          let workStartTime = new Date(
            formatDate(new Date(), 'yyyy-MM-dd ') + dayWorkInfo[i].startTime
          ).getTime()
          let currentTime = new Date().getTime()

          if (
            workStartTime - currentTime > 0 &&
            workStartTime - currentTime <= 1000 * 60
          ) {
            this.showAlert(dayWorkInfo[i])
            dayWorkInfo[i].flag = true
            localStorage.setItem('dayWorkInfo', JSON.stringify(dayWorkInfo)) // 重新将flag被改的数据再存一次

            break
          }
        }
      }
    },
    // 将当前需要提醒的未做事项显示出来
    showAlert(info) {
      let remark = info.detail == null || info.detail === '' ? '' : info.detail
      this.$notify({
        title: '接下来的工作事项',
        message: info.startTime + '\n' + remark,
        duration: 0
      })
    }
  },
  watch: {
    // 获取菜单下拉栏的宽度，设置其在图标的中间
    prsVisible(val) {
      if (val === true) {
        this.$nextTick(() => {
          const menuPrison = document.getElementsByClassName('menu_prison')[0]
          this.left = -menuPrison.clientWidth / 2 + 30 + 'px'
        })
      }
    },
    noticeBadge(val) {
      if (val > 0) {
        this.axios
          .post(_globalUrl.NoSSLUrl + '/message/list', {
            //   .post(_globalUrl.baseUrl + '/base/message/list', {
            receiveUserId: getUserId(),
            receiveDeptId: getDeptId(),
            currentPage: 1,
            pageSize: 10
          })
          .then(response => {
            let rows = []
            response.rows.forEach(item => {
              if (item != null) {
                rows.push(item)
              }
            })
            console.log(rows)

            this.noticeRow = rows
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
@keyframes myMove {
  0% {
    transform: translateX(30%);
  }
  100% {
    transform: translateX(-95%);
  }
}

.info_runner {
  position: absolute;
  width: 100%;
  height: 30px;
  overflow: hidden;
  top: 5.71429rem;
  background: rgba(230, 162, 60, 0.4);
  z-index: 998;

  .run_way {
    position: absolute;
    animation: myMove 30s linear infinite;
    animation-fill-mode: forwards;
    white-space: nowrap;
  }
  .medium {
    z-index: 999;
    color: #fff;
    font-size: 1.4rem;
    height: 30px;
    line-height: 30px;
    margin: 0 10rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // width: 20rem;
  }
}
.standard {
  #index_page {
    width: 100%;
    font-size: 1.1rem;
    min-width: 1024px;
    position: absolute;
    top: 0;
    bottom: 0;
    .head_title_content {
      text-decoration: none;
      color: white;
    }
    .headBox {
      display: flex;
      align-items: center;
    }
    .el-container {
      height: 100%;
    }
    // 头部flex布局
    .index_head {
      height: 5.71429rem !important;
      display: flex;
      display: -ms-flexbox;
      background: #000;
      justify-content: space-around;
      align-items: center;
      // 左边的标题flex布局
      .index_head_title {
        display: flex;
        justify-content: space-between;
        font-size: 2rem;
        font-weight: 400;
        color: white;
        flex: 20;
        .headIMG {
          // width: 38rem;
          // height: 4rem;
          // margin-right: 1.07rem;
          // margin-top: 0.7rem;
          height: 44/14rem;
          width: 44/14rem;
          // margin-right: 1rem;
        }
        .head_title_content {
          text-decoration: none;
          color: white;
          position: relative;
          .headName {
            font-size: 2rem;
            font-weight: bold;
            white-space: nowrap;
          }

          .deptName {
            // position: absolute;
            // left: 20%;
            color: #dfdfdf;
            white-space: nowrap;

            // left: 20%;
            // bottom: -2px;
            font-size: 1.2rem;
            font-weight: 600;
            text-align: center;
          }
        }
      }
      // 导航flex布局
      .index_head_nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 1.285rem;
        font-weight: 400;
        color: white;
        flex: 32;
        // 导航的详细菜单
        .nav_item {
          text-align: center;
          position: relative;
          flex: 1;
          height: 5.714rem;
          align-items: center;
          .nav_icon {
            line-height: 5.71429rem;
            white-space: nowrap;

            &:hover {
              background: #194796;
            }
            cursor: pointer;
            a {
              text-decoration: none;
              color: #fff;
            }
          }
          .nav_menu {
            position: absolute;
            top: 5.71429rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            display: flex;
            font-size: 1.1rem;
            border-radius: 2px;
            color: white;
            background: #194796;
            .menu_item {
              flex: 1;
              min-width: 11rem;
              padding-left: 1.1rem;
              padding-right: 1.1rem;
              text-align: center;
              color: white;
              .menu_title {
                font-weight: bold;
                margin-top: 1.8rem;
                margin-bottom: 1.8rem;
              }
              .menu_father {
                font-size: 1.2rem;
                color: #8cc8ff;
              }
              .menu_list {
                display: block;
                text-decoration: none;
                color: #fff;
                margin-top: 1.6rem;
                margin-bottom: 1.6rem;
                &:hover {
                  color: #43d3ff;
                }
              }
            }
          }
        }
      }
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.3s;
      }
      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
      // 通知
      .index_head_notice {
        display: flex;
        justify-content: space-around;
        font-size: 1.28571rem;
        color: white;
        flex: 5;
        cursor: pointer;
      }
      // 员工信息
      .index_head_emp {
        display: flex;
        justify-content: space-around;
        font-size: 1.28571rem;
        color: white;
        flex: 5;
        cursor: pointer;
      }
      // 注销
      .index_head_logout {
        display: flex;
        justify-content: space-around;
        font-size: 1.2rem;
        color: white;
        flex: 3;
        cursor: pointer;
      }
    }
    .main_head {
      background: #1f54af;
    }
  }
}
.technology {
  #index_page {
    width: 100%;
    font-size: 1.1rem;
    min-width: 1024px;
    position: absolute;
    top: 0;
    bottom: 0;

    .head_title_content {
      text-decoration: none;
      color: white;
    }
    .headBox {
      display: flex;
      align-items: center;
    }
    .el-container {
      height: 100%;
    }
    // 头部flex布局
    .index_head {
      height: 5.71429rem !important;
      display: flex;
      justify-content: space-around;
      align-items: top;
      background-color: #052652;
      background-image: url('~@/assets/technology/main_title_bg.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      // 左边的标题flex布局
      .index_head_title {
        display: flex;
        display: -ms-flexbox;
        justify-content: start;
        font-size: 2rem;
        font-weight: 400;
        color: white;
        flex: 25;
        .headIMG {
          // width: 90%;
          // height: 4rem;
          height: 44/14rem;
          width: 44/14rem;
          margin-right: 1rem;
          margin-top: 1rem;
        }
        .head_title_content {
          text-decoration: none;
          position: relative;
          color: white;
          margin-top: 1rem;

          .deptName {
            // position: absolute;
            // left: 20%;
            color: #dfdfdf;
            font-size: 1.2rem;
            white-space: nowrap;

            // bottom: 10%;
            font-weight: 600;
            text-align: center;
          }
        }
      }
      // 导航flex布局
      .index_head_nav {
        display: flex;
        height: 5rem;
        justify-content: space-around;
        align-items: center;
        font-size: 1.285rem;
        font-weight: 600;
        color: #8cc8ff;
        flex: 32;
        .head_title_content {
          color: #8cc8ff;
          font-weight: 600;
        }
        // 导航的详细菜单
        .nav_item {
          text-align: center;
          position: relative;
          flex: 1;
          height: 5rem;
          align-items: center;
          .nav_icon {
            height: 5rem;
            line-height: 5rem;
            white-space: nowrap;

            &:hover {
              .head_title_content {
                color: #fff;
              }
              color: #fff;
              text-shadow: 0 0 20px #fff;
              box-shadow: 28px 0 28px -28px #8fdcf9 inset,
                0 28px 28px -28px #8fdcf9 inset,
                0 -28px 28px -28px #8fdcf9 inset,
                -28px 0 28px -28px #8fdcf9 inset;
            }
            cursor: pointer;
            a {
              text-decoration: none;
              color: #8cc8ff;
            }
          }
          .nav_menu {
            position: absolute;
            top: 5rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            display: flex;
            font-size: 1.1rem;
            border-radius: 2px;
            background: rgba(12, 84, 139, 0.8);
            box-shadow: 9px 16px 15px 0px rgba(11, 19, 48, 1),
              0 0 50px 0 rgb(32, 114, 207) inset;
            .menu_item {
              flex: 1;
              min-width: 11rem;
              padding-left: 1.1rem;
              padding-right: 1.1rem;
              text-align: center;
              color: white;
              .menu_title {
                font-weight: bold;
                margin-top: 1.8rem;
                margin-bottom: 1.8rem;
              }
              .menu_father {
                font-size: 1.2rem;
                color: #f5db69;
              }
              .menu_list {
                display: block;
                text-decoration: none;
                color: #43d3ff;
                margin-top: 1.6rem;
                margin-bottom: 1.6rem;
                &:hover {
                  color: #fff;
                }
              }
            }
          }
        }
      }
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.2s;
      }
      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
      // 通知
      .index_head_notice {
        height: 5rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 1.28571rem;
        color: #8cc8ff;
        flex: 5;
        cursor: pointer;
        .el-badge__content.is-fixed {
          top: 2rem;
        }
      }
      // 员工信息
      .index_head_emp {
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 1.28571rem;
        color: #8cc8ff;
        flex: 5;
        cursor: pointer;
      }
      // 注销
      .index_head_logout {
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 1.2rem;
        color: white;
        flex: 3;
        cursor: pointer;
        .el-icon-switch-button {
          font-size: 1.5rem;
          color: red;
        }
      }
    }

    .info_runner {
      background: rgba(143, 220, 249, 0.4);
    }
  }
}
</style>
