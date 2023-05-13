<template>
  <div class="register-container">

    <el-form
      ref="ruleForm"
      class="register-form"
      :model="ruleForm"
      :rules="rules"
      autocomplete="off"
      label-position="right"
      label-width="80px"
      hide-required-asterisk="true"
      size="large"
    >

      <div class="title-container" style="margin-right: 10%">
        <h3 class="title">
          <i class="el-icon-user-solid" />
          用户注册</h3>
      </div>

      <el-form-item class="el-form-item" label="输入邮箱" style="font-size: 20px" prop="email">
        <el-col style="width:70%">
          <el-input
            v-model="ruleForm.email"
            placeholder="请输入邮箱并点击发送验证码"
          />
        </el-col>
        <el-col style="width:30%">
          <el-form>
            <el-form-item>
              <el-button
                :loading="codeLoading"
                :disabled="isDisable"
                size="large"
                round
                @click="sendMsg"
              >发送验证码</el-button>
            </el-form-item>
            <el-form-item>
              <span class="status" style="color: white; margin: 5px">{{ statusMsg }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-form-item>

      <el-form-item label="验证码" prop="code">
        <el-col style="width:70%">
          <el-input
            v-model="ruleForm.code"
            maxlength="6"
            placeholder="请登录邮箱接收验证码"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="输入密码" prop="pwd">
        <el-col style="width:70%">
          <el-input v-model="ruleForm.pwd" type="password" placeholder="请输入密码" />
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="cpwd">
        <el-col style="width:70%">
          <el-input v-model="ruleForm.cpwd" type="password" placeholder="请确认密码" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:76%;margin-top:30px;margin-bottom:1px;font-size: 20px"
          @click="register"
        >注 册</el-button>
      </el-form-item>

      <p class="tips">
        <a type="primary" @click="$router.push('/login')">已有账号？立即登陆</a>
      </p>

    </el-form>

    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
import { getEmailCode, register } from '@/api/register'
import md5 from 'js-md5'
// import { encrypt } from '@/utils/rsaEncrypt'
export default {
  name: 'Register',
  data() {
    return {
      statusMsg: '',
      error: '',
      isDisable: false,
      codeLoading: false,
      ruleForm: {
        email: 'zhangbw@sjtu.edu.cn',
        code: '123456',
        pwd: '123456Abc',
        cpwd: '123456Abc'
      },
      rules: {
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          type: 'string',
          message: '请输入验证码',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码必须同时包含数字与字母,且长度为 8-20位' }],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]

      }
    }
  },
  methods: {
    sendMsg: function() {
      const self = this
      let emailPass
      let timerid
      if (timerid) {
        return false
      }
      self.statusMsg = ''
      this.$refs['ruleForm'].validateField('email', (valid) => {
        emailPass = valid
        console.log(valid)
      })
      // 向后台API验证码发送
      if (!emailPass) {
        self.codeLoading = true
        self.statusMsg = '验证码发送中...'
        getEmailCode(self.ruleForm.email).then(res => {
          this.$message({
            showClose: true,
            message: '发送成功，验证码有效期5分钟',
            type: 'success'
          })
          let count = 60
          self.ruleForm.code = ''
          self.codeLoading = false
          self.isDisable = true
          self.statusMsg = `$\n{count--}秒后重新发送`
          timerid = window.setInterval(function() {
            self.statusMsg = `\n${count--}秒后重新发送`
            if (count <= 0) {
              window.clearInterval(timerid)
              self.isDisable = false
              self.statusMsg = ''
            }
          }, 1000)
        }).catch(err => {
          this.isDisable = false
          this.statusMsg = ''
          this.codeLoading = false
          console.log(err.response.data.message)
        })
      }
    },

    // 用户注册
    register: function() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const user = {
            email: this.ruleForm.email,
            code: this.ruleForm.code,
            // password: encrypt(this.ruleForm.pwd)
            password: md5(this.ruleForm.pwd)
          }
          register(this.ruleForm.code, user).then(res => {
            this.$message({
              showClose: true,
              message: '注册成功，正在跳转到登录界面...',
              type: 'success'
            })
            setTimeout(() => {
              // 路由跳转传参，在跳转到 login 界面后自动填充
              this.$router.push({ name: 'login', params: {
                username: this.ruleForm.email,
                password: this.ruleForm.pwd
              }})
            }, 1000)
          }).catch(err => {
            console.log(err.response.data.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 95%;

    input {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      -webkit-appearance: none;
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
    label {
      font-style: normal;
      font-size: 12px;
      color: $light_gray;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  //background-color: $bg;
  background-image: url("../../icons/bg.png");
  background-repeat: no-repeat;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 900px;
    max-width: 100%;
    padding: 200px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    float: right;
    font-size: 18px;
    color: #bbb8b8;
    margin-right: 22%;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 40px;
      color: $light_gray;
      margin: 0px auto 80px auto;
      text-align: center;
      font-weight: bold;
    }
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
