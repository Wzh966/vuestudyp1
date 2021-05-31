<template>
  <div>
    <h1 class="loginTitle">BankMan</h1>
    <el-form
      v-loading="loading"
      ref="loginForm"
      :rules="rules"
      :model="loginForm"
      element-loading-text="正在登录..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="loginContainer"
    >
      <h4 class="loginTips">Sign in to start your session</h4>
      <el-form-item prop="userName">
        <el-input
          v-model="loginForm.userName"
          size="normal"
          type="text"
          auto-complete="off"
          placeholder="Phone or Name"
          suffix-icon="el-icon-mobile-phone"
          clearable
        />
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input
          v-model="loginForm.passWord"
          size="normal"
          type="password"
          auto-complete="off"
          placeholder="Password"
          suffix-icon="el-icon-lock"
          clearable
        />
      </el-form-item>
      <el-form-item prop="verificationCode">
        <el-input
          v-model="loginForm.verificationCode"
          size="normal"
          type="text"
          auto-complete="off"
          placeholder="Verification Code"
          suffix-icon="el-icon-setting"
          clearable
        />
      </el-form-item>
      <el-button
        size="normal"
        type="primary"
        style="width: 100%;"
        @click="submitLogin"
      >Sign in</el-button
      >
    </el-form>
</div></template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        userName: '',
        passWord: ''
      },
      checked: true,
      rules: {
        userName: [
          { required: true, message: 'The login field is required.', trigger: 'blur' }
        ],
        passWord: [{ required: true, message: 'The password field is required.', trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  methods: {
    submitLogin() {
      const _this = this
      localStorage.clear()
      _this.$refs.loginForm.validate(valid => {
        if (valid) {
          _this.loading = true
          _this.postRequest('/manage/login', _this.loginForm).then(resp => {
            _this.loading = false
            if (resp) {
              localStorage.setItem('user', resp.data.user)
              localStorage.setItem('roles', JSON.stringify(resp.data.roles))
              localStorage.setItem('secret', JSON.stringify(resp.data.secret))
              localStorage.setItem('routers', JSON.stringify(resp.data.routers))
              localStorage.setItem('newLogin', JSON.stringify(true))
              const path = _this.$route.query.redirect
              _this.$router.push(path === '/' || path === undefined ? '/home' : path)
            }
          })
        } else {
          _this.$message.error('输入后登录')
          return false
        }
      })
    },

    refresh() {
      var _this = this
      _this.$router.go(0)
    }

  }
}
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin:auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin-top: 10%;
  text-align: center;
  color: #505458;
}

.loginTips {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #8a9096;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}
</style>
