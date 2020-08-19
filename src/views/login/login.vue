<!--
 * @Description:
 * @Author:
 * @Date: 2019-08-14 11:38:42
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-11 10:44:14
 -->
 <!--
 @input="e=>loginForm.username = loginValid(e)"
 @input="e=>loginForm.password = wholeValid(e)"
 -->
<template>
  <div id="login-page" v-loading="loginLoading">
    <div class="login_title">
      <img src="../../assets/index/title.png" />
      <!-- <img src="../../assets/beindex/title.png" /> -->
      <span>云南监狱指挥中心综合管理平台</span>
    </div>
    <div class="login_form">
      <span class="form_tip">
        <span>用户登录</span>
        <div class="form_line"></div>
      </span>
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item class="login_form_item" prop="username">
          <i class="id_icon"></i>
          <el-input
            class="yn_ipt"
            type="text"
            size="meddium"
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_form_item" prop="password">
          <i class="pwd_icon"></i>
          <el-input
            class="yn_ipt"
            type="password"
            size="meddium"
            v-model="loginForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_form_item">
          <el-button class="login_submit_btn" type="button" @click="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
require('../../assets/login/background.png')
require('../../assets/login/id.png')
require('../../assets/login/pwd.png')
export default {
  data() {
    return {
      loginLoading: false,
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { trigger: 'blur', required: true, message: '用户名不能为空' }
        ],
        password: [{ trigger: 'blur', required: true, message: '密码不能为空' }]
      }
    }
  },
  mounted() {
    let that = this
    document.onkeypress = function(e) {
      e = window.event || e
      if (
        that.$route.path === '/login' &&
        (e.code === 'Enter' || e.code === 'enter')
      ) {
        // 验证在登录界面和按得键是回车键enter
        that.submit()
      }
    }
  },
  methods: {
    submit() {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.loginLoading = true
          // 加密密码
          this.loginForm.lightPassword = this.loginForm.password
          this.loginForm.password = md5(this.loginForm.password)
          console.log(this.loginForm)

          this.axios
            .post(this._global.userUrl + '/userManage/login', this.loginForm)
            .then(data => {
              localStorage.setItem('user', JSON.stringify(data))
              localStorage.setItem('token', data.token)
              this.$router.push({ name: 'beindex' })
            })
            .catch(() => {
              this.loginLoading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#login-page {
  width: 100%;
  min-width: 1024px;
  height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  top: 0px;
  bottom: 0px;
  background: url('../../assets/login/background.png') no-repeat;
  background-size: 100% 100%;
  .login_title {
    width: 100%;
    position: absolute;
    top: 20%;
    // left: 22%;
    text-align: center;
    color: #fff;
    font-size: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 6rem;
      height: 6rem;
      margin: 0 1rem;
    }
    span {
      letter-spacing: 10px;
    }
  }
}
.login_form {
  position: relative;
  width: 20%;
  height: 0;
  background-color: #c2d1ea;
  margin-left: 60%;
  margin-top: 7%;
  font-size: 1.2rem;
  padding: 5% 2% 14% 2%;
  //   border-radius: 1%;
  .form_tip {
    position: absolute;
    width: 100%;
    top: 7%;
    color: rgb(40, 109, 236);
    font-size: 1.6rem;
    .form_line {
      width: 78%;
      margin-top: 1%;
      height: 1px;
      background: #bbbbbb;
      //   border: 1px solid #bbbbbb;
    }
  }
}
.login_form_item {
  position: relative;
  flex: auto;
  margin-bottom: calc(25% - 3.5rem);
  .id_icon {
    position: absolute;
    left: 8px;
    top: 12px;
    width: 18px;
    height: 18px;
    z-index: 100;
    background: url('../../assets/login/id.png') no-repeat;
    background-size: 100% 100%;
  }
  .pwd_icon {
    position: absolute;
    left: 8px;
    top: 12px;
    width: 18px;
    height: 18px;
    z-index: 100;
    background: url('../../assets/login/pwd.png') no-repeat;
    background-size: 100% 100%;
  }
  /deep/.el-input__inner {
    font-size: 1.1rem;
    padding-left: 35px;
    height: 35px;
    line-height: 35px;
    border-radius: 0;
  }
  .login_submit_btn {
    background: #3b6bbf;
    color: white;
    font-size: 1.3rem;
    // border-radius: 3%;
    margin-top: 1%;
    width: 100%;
    height: 2.7rem;
    border: none;
  }
  .el-button {
    line-height: 0;
  }
  /deep/.el-form-item__error {
    top: 90% !important;
    font-size: 1.2rem;
  }
}
.technology .yn_ipt /deep/.el-input__inner {
  color: #000;
}
</style>
