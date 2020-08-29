<template>
  <div class="login">
    <div class="vue-template animated" v-loading="fullscreenLoading" element-loading-text="登陆中....">
      <div style="font-size: calc(18px + .5vw);font-family: Serif;margin:0;color:#000033">登陆入口</div>
      <el-form label-position="left" :model="LoginForm" ref="LoginForm" :rules="rules">
        <el-form-item label="用户名" class="label-item" prop="username">
          <el-input v-model="LoginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="LoginForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input v-model="LoginForm.domain" placeholder="请输入域名" prefix-icon="el-icon-position"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="LoginWidget('LoginForm')">登陆</el-button>
          <el-button @click="resetForm('LoginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Strophe from 'strophe.js'

export default {
  name: 'LoginWidget',
  data () {
    return {
      fullscreenLoading: false,
      LoginForm: {
        username: '',
        password: '',
        domain: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 0, max: 15, message: '长度在 0 到 15 个字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
        ],
        domain: [
          { required: true, message: '请输入服务器域名', trigger: 'blur' },
          { min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // computed: {
  //   formItemLayout () {
  //     const { formLayout } = this
  //     return formLayout === 'horizontal'
  //       ? {
  //         labelCol: { span: 4 },
  //         wrapperCol: { span: 14 }
  //       }
  //       : {}
  //   },
  //   buttonItemLayout () {
  //     const { formLayout } = this
  //     return formLayout === 'horizontal'
  //       ? {
  //         wrapperCol: { span: 14, offset: 4 }
  //       }
  //       : {}
  //   }
  // },
  methods: {
    LoginWidget (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.connected()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    connectedCallback (status) {
      console.log('connected function')
      console.log(status)
      switch (status) {
        case Strophe.Strophe.Status.CONNECTED:
          this.$message('登陆成功')
          this.$xmpp.connFlag = true
          this.fullscreenLoading = true
          // 首先要发送一个<presence>给服务器（initial presence）
          this.$xmpp.conn.send(Strophe.$pres().tree())
          this.$xmpp.userCode = this.LoginForm.username
          this.$xmpp.password = this.LoginForm.password
          this.$xmpp.domain = this.LoginForm.domain

          // fixed 记录到cookie中
          this.$xmpp.setCookie('userCode', this.LoginForm.username)
          this.$xmpp.setCookie('password', this.LoginForm.password)
          this.$xmpp.setCookie('domain', this.LoginForm.domain)

          this.$router.push({name: 'CesiumMap'})
          break
        case Strophe.Strophe.Status.CONNECTING:
          console.log('正在登陆')
          break
        case Strophe.Strophe.Status.DISCONNECTING:
          this.$message('1111')
          break
        case Strophe.Strophe.Status.DISCONNECTED:
          this.$message('2222')
          this.$xmpp.connFlag = false
          this.$xmpp.delCookie('userCode')
          this.$xmpp.delCookie('password')
          this.$xmpp.delCookie('domain')
          location.reload()
          break
        default:
          this.$xmpp.connFlag = false
          this.$message('登陆失败')
          this.fullscreenLoading = false
          break
      }
    },
    connected () {
      this.fullscreenLoading = true
      console.log(this.$xmpp.userPassword)
      this.$xmpp.conn.connect(this.LoginForm.username + '@' + this.LoginForm.domain, this.LoginForm.password, this.connectedCallback)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .login{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /*align-items:center;*/
    justify-content:center;
    position: absolute;
    //background-color: #FFCC99;
    z-index: 100;
    /*position:relative;*/
  }
  .animated {
    animation-duration: 0.5s; /*动画时间*/
    animation-fill-mode: both; /*播放后的状态*/
  }
  .vue-template {
    float: right;
    margin-left: auto;
    background: linear-gradient(90deg, #F0F0F0, 70%, #BEBEBE);
    padding: 1vw;
    margin-right: 10vw;
    width: 80vw;
    max-width: 600px;
    border-radius: 1vw;
    animation-name:upAnimation; /*动画的名称*/
  }
  @keyframes upAnimation{
    50%{
      transition-timing-function: cubic-bezier(0.755,0.50,0.855,0.060);
      transform: translate3d(0,-30px,0);
    }
    60%{
      transition-timing-function: cubic-bezier(0.755,0.050,0.855,0.060);
      transform: translate3d(0,+30px,0);
    }
    70%{
      transition-timing-function: cubic-bezier(0.755,0.050,0.855,0.060);
      transform: translate3d(0,-15px,0);
    }
    80%{
      transition-timing-function: cubic-bezier(0.755,0.050,0.855,0.060);
      transform: translate3d(0,+15px,0);
    }
    90%{
      transform: translate3d(0,-4px,0);
    }
    95%{
      transform: translate3d(0,+4px,0);
    }
  }
</style>
<style>
  .label-item,.el-form-item__label {
    font-size: calc(12px + .5vw);
    color: #330066;
    justify-content:center;
    font-family: Serif;
  }
</style>
