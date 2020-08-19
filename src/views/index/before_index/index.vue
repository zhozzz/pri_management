<!--
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-10-23 16:10:56
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-27 17:27:19
 -->
<template>
  <div class="beindex_page" v-loading="loading">
    <div class="head_nav">
      <div class="prison_name yn_page_title" v-if="prisonId!=1">{{prisonName}}—{{deptName}}</div>
      <div class="head_menu">
        <div
          class="nav_item"
          @mouseenter="item.flag = true"
          @mouseleave="item.flag = false"
          v-for="(item,i) in menuData"
          :key="i"
        >
          <div class="nav_icon">
            <img :src="require('@/assets/technology/'+item.imgUrl+'.png')" />
            <span @click="openPage(item.menuEnName)">{{item.menuName}}</span>
          </div>
          <transition name="fade" v-if="item.flag&&item.children.length!=0">
            <div
              class="nav_menu"
              v-if="item.children[0].children.length!=0"
              :class="menuData.length<4&&i==0?'min_menu':'menu_child'+i"
            >
              <div class="menu_item" v-for="(obj,j) in item.children" :key="j">
                <div>
                  <div class="menu_title">{{obj.menuName}}</div>
                  <div
                    class="menu_list"
                    v-for="(son,k) in obj.children"
                    :key="k"
                    @click="openPage(son.menuEnName)"
                  >{{son.menuName}}</div>
                </div>
              </div>
            </div>
            <div class="nav_menu" v-if="item.children[0].children.length==0">
              <div class="menu_item">
                <div
                  class="menu_list"
                  v-for="(bro,p) in item.children"
                  :key="p"
                  @click="openPage(bro.menuEnName)"
                >{{bro.menuName}}</div>
              </div>
            </div>
          </transition>
        </div>
        <!-- <div class="nav_item" @click="openHKrole">
          <div class="nav_icon">
            <img :src="require('@/assets/technology/setting.png')" />

            <span>技防权限</span>
          </div>
        </div>-->
      </div>
      <div class="head_light"></div>
      <div class="head_right">
        <div class="head_video">
          <div class="video_icon"></div>
          <div class="video_title">
            <a :href="'openExeTest://'+hkUserinfo">视频监控</a>
          </div>
        </div>
        <!-- <div class="head_hk" v-if="user.deptType=='指挥中心'||user.deptType=='监狱'" @click="openHKrole">
          <div class="nav_icon">
            <img :src="require('@/assets/technology/setting.png')" />

            <span>技防权限</span>
          </div>
        </div>-->
        <div class="head_home" @click="turnToIndex">
          <div class="home_icon"></div>
          <div class="home_title">技防系统运行情况</div>
        </div>
        <div class="head_time">{{getTime()}}</div>
        <div class="head_date">{{getDate()}}</div>
        <div class="head_week">{{getWeek()}}</div>

        <a class="head_download" target="_blank" href="https://10.1.10.55/portal/download">
          <i class="el-icon-download"></i>
        </a>
        <div class="head_time" @click="show">{{ user.realName }}</div>

        <div class="head_quit" @click="logout">
          <div class="quit_icon"></div>
          <!-- <div class="quit_title">退出</div> -->
        </div>
      </div>

      <div class="head_hk" v-if="user.deptType=='指挥中心'||user.deptType=='监狱'" @click="openHKrole">
        <div class="nav_icon">
          <img :src="require('@/assets/technology/setting.png')" />
        </div>
      </div>
    </div>
    <div class="main" :style="{'left':openTab?'69.7%':'100%'}">
      <div class="openImgs">
        <img
          :src="openTab ? require('@/assets/index/openarrow.png') : require('@/assets/index/closearrow.png')"
          @click="openTab=!openTab"
          style="width:100%"
        />
      </div>
      <div class="tab_btn" v-show="!centerFlag">
        <el-button class="yn_btn" type="primary" @click="showCenter(true)">展开</el-button>
      </div>
      <div class="main_tab" v-show="centerFlag" @click="showCenter(false)">
        <div class="tab_title hander" @click="openPage('center_statisic')">警察罪犯人数</div>
        <div class="tab_title_icon_left"></div>
        <div class="tab_title_icon_right"></div>
        <div class="flex">
          <div class="detail hander" @click.stop="openPage('police_management')">
            <div class="detail_title">
              <span class="detail_title_title">警察人数</span>
              <span class="detail_title_num">{{tabInfo.criminalAndPoliceNum.policeNum}}</span>
              <span class="detail_title_g">人</span>
            </div>
            <div class="police_detail_img"></div>
          </div>
          <div class="detail hander" @click.stop="openPage('criminal_manegement')">
            <div class="detail_title">
              <span class="detail_title_title">罪犯人数</span>
              <span class="detail_title_num">{{tabInfo.criminalAndPoliceNum.criminalNum}}</span>
              <span class="detail_title_g">人</span>
            </div>
            <div class="criminal_detail_img"></div>
          </div>
        </div>
      </div>
      <div class="tab_btn" v-show="!rankFlag">
        <el-button class="yn_btn" type="primary" @click.stop="showRank(true)">展开</el-button>
      </div>
      <div class="main_tab" v-show="rankFlag" @click.stop="showRank(false)">
        <!-- <div class="tab_title">通知公告</div>
        <div class="tab_title_icon_left"></div>
        <div class="tab_title_icon_right"></div>
        <div class="rank_table"></div>-->
        <div class="tab_title hander" @click.stop="openPage('prison_total_status')">各监狱考评排行</div>
        <div class="tab_title_icon_left"></div>
        <div class="tab_title_icon_right"></div>
        <div class="rank_table">
          <el-table :data="rankingData">
            <el-table-column prop="ranking" label="排名" width="70px">
              <template slot-scope="scope" prop="ranking">
                <img :src="td_1" v-if="scope.row.ranking==1" style="height:16px;" />
                <img :src="td_2" v-if="scope.row.ranking==2" style="height:16px;" />
                <img :src="td_3" v-if="scope.row.ranking==3" style="height:16px;" />
                <span v-if="scope.row.ranking==4">{{scope.row.ranking}}</span>
                <span v-if="scope.row.ranking==5">{{scope.row.ranking}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="prison" label="监狱" minWidth="150"></el-table-column>
            <el-table-column prop="previous" label="相比上月" minWidth="150"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="tab_btn" v-show="!lineFlag">
        <el-button class="yn_btn" type="primary" @click="showLine(true)">展开</el-button>
      </div>
      <div class="main_tab" v-show="lineFlag" id="main_tab" @click="showLine(false)">
        <!-- <div class="tab_title">一日工作流程</div>
        <div class="tab_title_icon_left"></div>
        <div class="tab_title_icon_right"></div>
        <div class="line_echarts">
        </div>-->
        <div class="tab_title hander" @click.stop="openPage('criminal_in_statistics')">罪犯数目曲线图</div>
        <div class="tab_title_icon_left"></div>
        <div class="tab_title_icon_right"></div>
        <div class="line_echarts">
          <line-echarts :height="lineHeight()" :lineData="lineData"></line-echarts>
        </div>
      </div>
    </div>
    <div class="map" :style="{'width':openTab?'69.7%':'100%'}">
      <superMap></superMap>
    </div>

    <el-dialog
      title="个人信息修改"
      :visible.sync="dialogVisible"
      center
      close="yn_dialog"
      @close="resetForm('ruleForm')"
      width="30%"
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
  </div>
</template>
<script>
import { formatDate } from '@/utils/date'
import lineEcharts from './line'
import superMap from '@/components/super_map'
import { quit } from '../index/logout'
import {
  getCriminalNum,
  getPoliceNum,
  getmunedata,
  prisonName
} from './service'
import { getPrisonId, getDeptType, getUserId } from '@/utils'
import globalUrl from '@/utils/global_url'
import {
  expnoraml,
  isIDCard,
  Isphone,
  Isname,
  passwordStrengthValidator
} from '@/utils/form_valid.js'
require('@/assets/beindex/head-nav.png')
require('@/assets/beindex/criminal.png')
require('@/assets/beindex/groupbg.png')
require('@/assets/beindex/home.png')
require('@/assets/beindex/police.png')
require('@/assets/beindex/table.png')
require('@/assets/beindex/title.png')

export default {
  components: {
    lineEcharts,
    superMap
  },
  data() {
    var validateOldPass = (rule, value, callback) => {
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.passWord !== '') {
          this.$refs.ruleForm.validateField('passWord')
        }
        callback()
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
      openTab: false,
      menuData: [],
      loading: false,
      nowDate: new Date(),
      prisonId: JSON.parse(localStorage.getItem('user')).prisonId,
      prisonName: '',
      tabInfo: {
        criminalAndPoliceNum: {
          criminalNum: 0,
          policeNum: 0
        }
      },
      rankingData: [
        { ranking: 1, prison: '监狱一', previous: '10%' },
        { ranking: 2, prison: '监狱二', previous: '10%' },
        { ranking: 3, prison: '监狱三', previous: '10%' },
        { ranking: 4, prison: '监狱四', previous: '10%' },
        { ranking: 5, prison: '监狱五', previous: '10%' }
      ],
      td_1: `${require('@/assets/index/cup_1.gif')}`,
      td_2: `${require('@/assets/index/cup_2.png')}`,
      td_3: `${require('@/assets/index/cup_3.png')}`,
      lineData: {
        xAxis: [
          '01月',
          '02月',
          '03月',
          '04月',
          '05月',
          '06月',
          '07月',
          '08月',
          '09月',
          '10月',
          '11月',
          '12月'
        ],
        yAxis: {
          lastYear: [
            '20',
            '30',
            '40',
            '30',
            '20',
            '10',
            '50',
            '44',
            '33',
            '22',
            '15',
            '53'
          ],
          thisYear: [
            '25',
            '66',
            '46',
            '30',
            '26',
            '16',
            '50',
            '42',
            '33',
            '42',
            '55',
            '15'
          ]
        }
      },
      lineFlag: true,
      centerFlag: true,
      rankFlag: true,
      deptName: '',
      hkUserinfo: '',
      user: {},
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
        //   { validator: validatePass, trigger: 'blur' },
        //   { validator: passwordStrengthValidator, trigger: 'blur' }
        // ],
        // passWord: [{ validator: validatePass2, trigger: 'blur' }],
        address: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      ruleForm: {},
      dialogVisible: false
    }
  },
  created() {
    this.getHKuserInfo()
    this.user = JSON.parse(localStorage.getItem('user'))

    console.log(this.user)
  },
  mounted() {
    let that = this
    this.timer = setInterval(() => {
      that.nowDate = new Date()
    }, 1000)
    this.getInfo()
    this.getmunedata()
    this.getPrisonName()
    this.deptName = JSON.parse(localStorage.getItem('user')).deptName
  },
  methods: {
    showLine(boolean) {
      this.lineFlag = boolean
    },
    showRank(boolean) {
      this.rankFlag = boolean
    },
    showCenter(boolean) {
      this.centerFlag = boolean
    },
    // 获取菜单
    getmunedata() {
      let userId = JSON.parse(localStorage.getItem('user')).userGuid
      getmunedata(userId).then(res => {
        let index = null
        let mgtindex = null
        console.log(res)
        res.forEach((item, i) => {
          item.flag = false

          console.log(item.menuName)

          if (item.menuName === '监狱管理') {
            item.imgUrl = 'prison'
          } else if (item.menuName === '指挥调度') {
            item.imgUrl = 'arrow'
          } else if (item.menuName === '信息监测') {
            item.imgUrl = 'computer'
          } else if (item.menuName === '工作辅助') {
            item.imgUrl = 'setting'
          } else {
            item.imgUrl = 'prison'
          }
          if (item.menuName === '工作台') {
            index = i
          }
          if (item.menuName === '系统管理') {
            mgtindex = i
          }
        })
        console.log(index)
        console.log(mgtindex)
        if (index !== null) {
          res.splice(index, 1)
        }
        if (mgtindex !== null) {
          res.splice(mgtindex, 1)
        }

        this.$set(this, 'menuData', res)
        console.log(res)
      })
    },
    getInfo() {
      this.getCriminalAndPoliceNum()
    },
    getCriminalAndPoliceNum() {
      let prisonId = this.prisonId
      getCriminalNum(prisonId).then(res => {
        this.tabInfo.criminalAndPoliceNum.criminalNum = res
      })
      getPoliceNum(prisonId).then(res => {
        this.tabInfo.criminalAndPoliceNum.policeNum = res
      })
    },
    getHKuserInfo() {
      //51服务器暂时注释
      this.axios({
        method: 'get',
        url: globalUrl.videoUrl2 + '/application/fetchLoginInfo/' + getUserId(),
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

    //跳转海康权限管理
    openHKrole() {
      let xpwidth = window.screen.width - 10
      let xpheight = window.screen.height - 35
      this.axios({
        method: 'get',
        url: globalUrl.videoUrl2 + '/login/' + getPrisonId(),
        withCredentials: true
      })
        .then(response => {
          console.log('response:' + response)

          let midpage = window.open(response)
          let self = ''
          setTimeout(() => {
            let host = response.split('//bic')[0]

            let win = window.open(
              host + '/portal/config',
              //   '_top',
              `height=${xpheight}, width=${xpwidth},toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no`
            )
            midpage.close()
          }, 1000)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    turnToIndex() {
      //   this.$router.push({ name: 'index' })
      //   let url =
      //     window.location.href.split('beindex')[0] +
      //     'index/technical_prevention_sys_summary'
      //   window.open(url)

      let xpwidth = window.screen.width - 10
      let xpheight = window.screen.height - 35
      this.axios({
        method: 'get',
        url: globalUrl.videoUrl2 + '/login/' + getPrisonId(),
        withCredentials: true
      })
        .then(response => {
          console.log('response:' + response)

          let midpage = window.open(response)
          let self = ''
          setTimeout(() => {
            let host = response.split('//bic')[0]

            let win = window.open(
              host + '/nms/views/home',
              //   '_top',
              `height=${xpheight}, width=${xpwidth},toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no`
            )
            midpage.close()
          }, 3000)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    turnToVideo() {
      let url = window.location.href.split('beindex')[0] + 'index/check_video'
      window.open(url)
      //   this.$router.push({ name: 'check_video' })
    },
    lineHeight() {
      if (document.getElementById('main_tab')) {
        let lineH =
          document.getElementById('main_tab').clientHeight * 0.9 + 'px'
        return lineH
      }
    },
    getTime() {
      let hours =
        this.nowDate.getHours() >= 10
          ? this.nowDate.getHours()
          : '0' + this.nowDate.getHours()
      let minutes =
        this.nowDate.getMinutes() >= 10
          ? this.nowDate.getMinutes()
          : '0' + this.nowDate.getMinutes()
      return hours + ':' + minutes
    },
    getWeek() {
      var weekday = new Array(7)
      weekday[0] = '星期日'
      weekday[1] = '星期一'
      weekday[2] = '星期二'
      weekday[3] = '星期三'
      weekday[4] = '星期四'
      weekday[5] = '星期五'
      weekday[6] = '星期六'
      return weekday[this.nowDate.getDay()]
    },
    getDate() {
      return formatDate(this.nowDate, 'yyyy-MM-dd')
    },
    getPrisonName() {
      prisonName(this.prisonId).then(res => {
        this.prisonName = res
        let user = JSON.parse(localStorage.getItem('user'))
        user.prisonName = res
        localStorage.setItem('user', JSON.stringify(user))
      })
    },
    logout() {
      quit()
    },
    openPage(val) {
      console.log(val)
      let url = window.location.href.split('beindex')[0] + 'index/' + val
      console.log(url)

      //4月9日技防平台上线后 暂时屏蔽跳转
      //   window.open(url)
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
                            globalUrl.userUrl + '/userManage/editUser',
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
              .post(globalUrl.userUrl + '/userManage/editUser', this.ruleForm)
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
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style lang="less" scoped>
@import './less/animation.less';
@import './less/head.less';
@import './less/tab.less';
@import './less/map.less';
.beindex_page {
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
  position: relative;
}
.hander {
  cursor: pointer;
}
.menu_list {
  //4月9日技防平台上线后 暂时屏蔽跳转

  cursor: not-allowed !important;
  color: #333 !important;
}
</style>
