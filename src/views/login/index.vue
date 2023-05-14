<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <p>SMART 神经网络鲁棒性评估平台</p>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入您的邮箱"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入您的密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        plain
        style="width:100%;margin-bottom:10px;font-size: 15px"
        @click.native.prevent="handleLogin"
      >登 录
      </el-button>

      <p class="tips">
        <a type="primary" @click="$router.push('/register')">还没有帐号？立即注册</a>
      </p>

    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import md5 from 'js-md5'
// import { encrypt } from '@/utils/rsaEncrypt'
export default {
  name: 'Login',
  data() {
    // 邮箱验证的函数写在这里
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'pandada@sjtu.edu.cn',
        password: '123456Abc'
      },
      loginRules: {
        username: [{
          // type: 'email',
          required: true,
          trigger: 'blur',
          // message: '请输入邮箱',
          validator: validateEmail
        }],
        password: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码必须同时包含数字与字母,且长度为 8-20位' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        // 从注册界面过来时，自动填充为对应的值
        if (this.$route.params.username != null) {
          console.log(this.$route.params.username)
          console.log(this.$route.params.password)
          this.loginForm.username = this.$route.params.username
          this.loginForm.password = this.$route.params.password
        }
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          // console.log('valid:' + valid)
          const user = {
            username: this.loginForm.username,
            password: md5(this.loginForm.password)
          }
          this.loading = true
          this.$store.dispatch('user/login', user).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    //padding: 10px 10px 10px 10px;
    font-size: 14px;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url("../../icons/bg.png");
  background-repeat: round;
  overflow: hidden;
  padding-top: 80px;

  .login-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    float: right;
    font-size: 12px;
    color: #bbb8b8;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 10px 5px 10px;
    font-size: 20px;
    color: $dark_gray;
    vertical-align: middle;
    width: 40px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    color: white;
    padding-bottom: 20px;
    font-weight: bold;
    font-size: 30px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<style scoped>
/* 修改验证器样式 */
/deep/ .el-form-item.is-error .el-input__inner {
  border-color: #889aa4;
}
/deep/ .el-form-item.is-error .el-input__validateIcon {
  color: #889aa4;
}
/deep/ .el-form-item__error {
  color: #e6a23c;
}
</style>
