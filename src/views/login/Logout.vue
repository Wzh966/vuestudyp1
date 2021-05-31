<template>
  <div class="logout" style="margin-top:15%;">
    <!-- <img src="../assets/logo.png"> -->
    <h1>{{ msg }}</h1>
    <el-link type="primary" style="margin-left:45%;" @click="login">登录</el-link>
  </div>
</template>

<script>
export default {
  name: 'Logout',
  data() {
    return {
      msg: 'Thank you for using! :)'
    }
  },
  methods: {
    login() {
      var _this = this
      _this.$router.push('/')
    }
  }
}
</script>

    <style scoped>
    h1, h2 {
      font-weight: normal;
    }
    .logout {
        border-radius: 15px;
        background-clip: padding-box;
        margin:auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    </style>

