<template>
  <div v-loading="loading" >
    <el-collapse v-model="activeNames" >
      <el-collapse-item title="基本信息" name="baseInfo">
        <el-form ref="detailRef" :inline="true" :model="roleDetail" >
          <el-row >
            <el-col :span="6">
              <el-form-item prop="name" label="名称">
                <el-input
                  v-model="roleDetail.name"
                  :readonly ="actiontype!=='add'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter an name"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="desc" label="描述">
                <el-input
                  v-model="roleDetail.desc"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter description"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <div class="block">
              <el-form-item prop="roles" label="资源">
                <el-cascader
                  :disabled ="actiontype==='read'"
                  v-model="roleDetail.roles"
                  :options="resourceList"
                  :props="{ value:'mid',label:'title',multiple: true, checkStrictly: true }"/>
              </el-form-item>
            </div>
          </el-row>
          <el-row v-if="actiontype!=='add'">
            <el-col :span="6">
              <el-form-item prop="createdAt" label="创建时间">
                <el-input
                  v-model="roleDetail.createdAt"
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
                  v-model="roleDetail.updatedAt"
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
  name: 'SystemRoleDetail',
  data() {
    return {
      roleDetail: {
        name: '',
        desc: '',
        roles: [],
        createdAt: '',
        updatedAt: ''
      },
      resourceList: [],
      actiontype: this.$route.params.actiontype,
      loading: false,
      activeNames: ['baseInfo']
    }
  },

  created() {
    const _this = this

    _this.getResourceList()
    // getParentRole
    if (_this.actiontype !== 'add') {
      _this.getSystemRole()
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    create() {
      const _this = this
      _this.loading = true
      var params = _this.roleDetail
      _this.buildRoles(params)
      _this.postRequest('/systemManage/role/createRole', params).then(resp => {
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
      var params = _this.roleDetail
      params.rid = _this.$route.params.rid
      _this.buildRoles(params)
      _this.postRequest('/systemManage/role/updateRole', params).then(resp => {
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

    buildRoles(params) {
      if (params.roles && params.roles.length > 0) {
        const newRoles = []
        const allMids = []
        params.roles.forEach(f => {
          if (f && f.length > 0) {
            f.forEach(n => {
              allMids.push(n)
            })
          }
        })
        const mids = Array.from(new Set(allMids))
        if (mids && mids.length > 0) {
          mids.forEach(m => {
            const r = {}
            r.mid = m
            newRoles.push(r)
          })
        }
        params.roles = newRoles
      }
    },

    getSystemRole() {
      const _this = this
      _this.loading = true
      var params = {}
      // var role = {}
      params.rid = _this.$route.params.rid
      // params.role = role
      _this.postRequest('/systemManage/role/getRole', params).then(resp => {
        if (resp && resp.code === 200) {
          // current pages size total
          if (resp.data) {
            _this.roleDetail = resp.data[0]
            if (resp.data[0].resources && resp.data[0].resources.length > 0) {
              _this.roleDetail.roles = this.buildSelected(resp.data[0].resources)
            }
          }
          // _this.roleDetail.roles = resp.data.roles
          _this.loading = false
        }
      })
    },

    buildSelected(resources, parentId) {
      const _this = this
      const res = []
      if (resources && resources.length > 0) {
        resources.forEach(r => {
          const m = []
          if (parentId && parentId.length > 0) {
            m.push(...parentId)
          }
          m.push(r.mid)
          res.push(m)
          // m.push(r.parentId)
          if (r.children && r.children.length > 0) {
            res.push(..._this.buildSelected(r.children, m))
          }
        })
      }
      return res
    },
    getResourceList() {
      const _this = this
      const params = {}
      params.type = 1
      _this.postRequest('/systemManage/menu/getMenus', params).then(resp => {
        if (resp && resp.code === 200) {
          if (resp.data && resp.data.length > 0) {
            _this.resourceList = _this.buildResource(resp.data)
          }
        }
      })
    },
    buildResource(resource) {
      const _this = this
      const res = []
      if (resource && resource.length > 0) {
        resource.forEach(r => {
          const m = {}
          m.mid = r.mid
          m.title = r.title
          if (r.children && r.children.length > 0) {
            m.children = _this.buildResource(r.children)
          }
          res.push(m)
        })
      }
      return res
    }
  }
}
</script>

<style>
</style>
