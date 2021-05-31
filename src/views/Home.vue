<template>
  <div>
    <el-container>
      <el-aside height ="100%" style="background-color: rgb(238, 241, 246)">
        <el-header style="text-align: center; font-size: 20px">
          <span>BankMan</span>
        </el-header>
        <!-- :collapse="isCollapse" class="el-menu-vertical-demo" router -->
        <el-menu :default-active ="this.$router.currentRoute.path" @open="handleOpen" @close="handleClose">
          <el-submenu v-for = "router in accessroutes" :key="router.path" :index="router.path">
            <template slot="title"><i :class="router.meta.icon"/>{{ router.meta.title }}</template>
            <el-menu-item-group v-if = "router.children" :key="router.path" :index="router.path">
              <!-- <el-menu-item v-for = "children in router.children" v-if="!children.meta.hidden" :key="children.path" :index="children.path" >
                <template slot="title"><i :class="children.meta.icon"/>{{ children.meta.title }}</template>
              </el-menu-item> -->
              <el-menu-item v-for = "children in router.children" v-if="!children.meta.hidden" :key="children.path" :index="children.path" >
                <router-link :to="children.path" tag="a" class="item border-bottom"> <i :class="children.meta.icon" />{{ children.meta.title }}
                </router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 25px">
          <!-- <el-button :label="false" icon="el-icon-menu" style="margin-right: 100%;background-color: #0da1db;"/> -->
          <!-- <el-radio-group v-model="isCollapse" style="margin-right: 85%;background-color: #0da1db;">
            <el-radio-button :label="false" icon="el-icon-menu">展开</el-radio-button>
            <el-radio-button :label="true" icon="el-icon-menu">收起</el-radio-button>
          </el-radio-group> -->
          <el-dropdown @command="handleCommand">
            <i class="el-icon-setting" style="margin-top:1%;font-size: 25px"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ username }}</span>
        </el-header>

        <el-main>
          <el-breadcrumb v-if="this.$router.currentRoute.path!='/home'" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div v-if="this.$router.currentRoute.path =='/home'">
            Wellcome to bankman management system !
          </div>
          <router-view style="margin-top: 1%;"/>
        </el-main>
        <el-dialog
          :visible.sync="dialogVisible"
          :before-close="handleCloseDialog"
          width="20%">
          <span> <i class="el-icon-warning-outline" style="font-size:70px;margin-left: 40%;color:#0da1db"/>
          <h3>你还没有设置谷歌验证码，即将跳转至设置验证码页面，请点击生成谷歌验证码</h3></span>
          <span
            slot="footer"
            class="dialog-footer"
            style=" display: flex;
          justify-content: center;
          align-items: center;">
            <el-button type="primary" size="small" @click="goQRcodePage">确定</el-button>
            <el-button size="small" @click="handleCloseDialog">返回</el-button>
          </span>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>
  <style>
    .el-header {
      background-color: #0da1db;
      color: #333;
      line-height: 60px;
    }
    .el-aside {
      color: #333;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  /* .el-dialog .el-dialog__body{
      display: flex;
      justify-content: center;
      align-items: center;
} */

  /*改变router-link样式*/
  a {
    text-decoration: none;
    color: inherit;
  }
  .el-submenu .el-menu-item a {
    position: absolute;
    height: 100%;
    width: calc(100% - 50px);
    left: 0;
    padding-left: 50px;
  }
  .el-menu-item a {
    position: absolute;
    height: 100%;
    width: calc(100% - 60px);
    left: 0;
    padding-left: 60px;
  }
  </style>

<script>
// import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      accessroutes: this.$router.options.accessRoutes,
      username: localStorage.getItem('user'),
      secret: JSON.parse(localStorage.getItem('secret')),
      dialogVisible: false,
      isCollapse: true
    }
  },
  computed: {
  },
  created() {
    const _this = this
    if (!_this.secret && _this.$router.currentRoute.path === '/home') {
      _this.dialogVisible = true
    }
  },
  methods: {
    handleCommand(command) {
      const _this = this

      _this.$confirm('此操作将注销登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.getRequest("/logout");
        localStorage.clear()
        _this.$router.push('/logout')
        // 触发后禁止浏览器的后退键
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', function(e) {
          history.pushState(null, null, document.URL)
        }, false)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    goQRcodePage() {
      const _this = this
      _this.dialogVisible = false
      _this.$router.push(
        {
          name: 'GoogleQR',
          params: {
          }
        })
    },
    handleCloseDialog() {
      const _this = this
      _this.dialogVisible = false
      if (_this.accessroutes.length > 0) {
        const romveList = []
        _this.accessroutes.forEach(r => {
          if (r.name === 'SystemHome' && r.children && r.children.length === 1) {
            if (r.children[0].name === 'GoogleQR') {
              romveList.push(r)
            }
          }
        })
        _this.accessroutes = _this.accessroutes.filter(function(item) {
          return romveList.indexOf(item) === -1
        })
      }
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    }
  }

}
</script>
