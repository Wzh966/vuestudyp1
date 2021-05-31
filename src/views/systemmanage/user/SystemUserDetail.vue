<template>
  <div v-loading="loading" >
    <el-collapse v-model="activeNames" >
      <el-collapse-item title="基本信息" name="baseInfo">
        <el-form ref="detailRef" :inline="true" :model="userDetail" >
          <el-row >
            <el-col :span="6">
              <el-form-item prop="countryCode" label="区号">
                <el-input
                  v-model="userDetail.countryCode"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter countryCode"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="name" label="姓名">
                <el-input
                  v-model="userDetail.name"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter an name"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="phone" label="手机">
                <el-input
                  v-model="userDetail.phone"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter phone number"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="email" label="邮箱">
                <el-input
                  v-model="userDetail.email"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter email"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item v-if="actiontype!=='read'" prop="passWord" label="密码">
                <el-input
                  v-model="userDetail.passWord"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter password"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item v-if="actiontype!=='add'" prop="status" label="状态">
                <el-input
                  v-model="userDetail.status"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <div class="block">
              <el-form-item prop="roles" label="角色">
                <el-cascader
                  :disabled ="actiontype==='read'"
                  v-model="userDetail.roles"
                  :options="options"
                  :props="{ value:'rid',label:'name',multiple: true, checkStrictly: true }"
                  clearable/>
              </el-form-item>
            </div>
          </el-row>
          <el-row v-if="actiontype!=='add'">
            <el-col :span="6">
              <el-form-item prop="createdAt" label="创建时间">
                <el-input
                  v-model="userDetail.createdAt"
                  :readonly ="true"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="updatedAt" label="跟新时间">
                <el-input
                  v-model="userDetail.updatedAt"
                  :readonly ="true"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div style="margin-left: 60%;margin-top: 2%;">
      <el-button v-if="actiontype==='add'" type="primary" size="small" @click="create">提交 </el-button>
      <el-button v-if="actiontype==='edit'" type="primary" size="small" @click="update">提交 </el-button>
      <el-button size="small" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemUserDetail',
  data() {
    return {
      userDetail: {
        name: '',
        phone: '',
        countryCode: '',
        email: '',
        status: '',
        passWord: '',
        createdAt: '',
        updatedAt: '',
        roles: []
      },
      options: [],
      actiontype: this.$route.params.actiontype,
      loading: false,
      activeNames: ['baseInfo']
    }
  },

  created() {
    const _this = this
    if (_this.actiontype !== 'add') {
      _this.getSystemUser()
    }
    // get roles
    _this.getRoleList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    create() {
      const _this = this
      _this.loading = true
      _this.buildRoles(_this.userDetail)
      var params = _this.userDetail
      _this.postRequest('/systemManage/user/createSystemUser', params).then(resp => {
        if (resp && resp.code === 200) {
          _this.$message({
            type: 'success',
            message: '新增成功'
          })
          _this.goBack()
        }
        _this.loading = false
      })
    },

    update() {
      const _this = this
      _this.loading = true
      _this.buildRoles(_this.userDetail)
      var params = _this.userDetail
      params.uid = _this.$route.params.uid
      _this.postRequest('/systemManage/user/updateSystemUser', params).then(resp => {
        if (resp && resp.code === 200) {
          _this.$message({
            type: 'success',
            message: '更新成功'
          })
          _this.goBack()
        }
        _this.loading = false
      })
    },

    getSystemUser() {
      const _this = this
      var params = {}

      params.uid = _this.$route.params.uid
      _this.postRequest('/systemManage/user/getSystemUser', params).then(resp => {
        if (resp && resp.code === 200) {
          // current pages size total
          if (resp.data) {
            _this.userDetail.name = resp.data.name
            _this.userDetail.phone = resp.data.phone
            _this.userDetail.countryCode = resp.data.countryCode
            _this.userDetail.email = resp.data.email
            _this.userDetail.status = resp.data.status
            _this.userDetail.createdAt = resp.data.createdAt
            _this.userDetail.updatedAt = resp.data.updatedAt
            _this.userDetail.roles = resp.data.roles
            if (resp.data.roles && resp.data.roles.length > 0) {
              resp.data.roles.forEach(role => {
                const r = []
                r.push(role.rid)
                _this.userDetail.roles.push(r)
              })
            }
          }
        }
        _this.loading = false
      })
    },
    getRoleList() {
      const _this = this
      const params = {}
      _this.postRequest('/systemManage/role/getRoles', params).then(resp => {
        if (resp && resp.code === 200) {
          if (resp.data && resp.data.length > 0) {
            resp.data.forEach(role => {
              const r = {}
              r.rid = role.rid
              r.name = role.name
              _this.options.push(r)
            })
            _this.options.sort(_this.compare)
          }
        }
      })
    },
    compare(obj1, obj2) {
      var val1 = obj1['rid']
      var val2 = obj2['rid']
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1)
        val2 = Number(val2)
      }
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    },
    buildRoles(user) {
      if (user.roles && user.roles.length > 0) {
        const newRoles = []
        user.roles.forEach(role => {
          if (role[0]) {
            const r = {}
            r.rid = role[0]
            newRoles.push(r)
          }
        })
        user.roles = newRoles
      }
    }
  }
}
</script>

<style></style>
