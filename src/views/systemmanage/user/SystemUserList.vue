<template>
  <div>
    <!-- 搜索 -->
    <el-button type="primary" style="margin-left: 75%;" size="small" @click="goDetail('','add')">新增</el-button>
    <el-form ref="searchRef" :inline="true" :model="userSearch" >
      <el-row >
        <!-- <el-col :span="6">
          <el-form-item prop="countryCode" label="区号">
            <el-input
              v-model="userSearch.countryCode"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter countryCode"
              clearable
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item prop="name" label="姓名">
            <el-input
              v-model="userSearch.name"
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
              v-model="userSearch.phone"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter phone number"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="userSearch.email"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter email"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="6">
          <el-form-item prop="status" label="状态">
            <el-input
              v-model="userSearch.status"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter an Name"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row style="margin-left: 75%;">
        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="clearSearch">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 数据 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        prop="countryCode"
        label="区号"
        width="100"/>
      <el-table-column
        prop="phone"
        label="手机"
        width="180"/>
      <el-table-column
        prop="name"
        label="姓名"
        width="180"/>
      <el-table-column
        prop="status"
        label="状态"
        width="100"/>
      <el-table-column
        prop="roles"
        label="角色"
        width="180"/>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200"/>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="180"/>
      <el-table-column
        prop="updatedAt"
        label="跟新时间"
        width="180"/>
      <el-table-column
        fixed="right"
        prop="operation"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-tooltip content="查看" placement="top">
            <el-button type="primary" icon="el-icon-view" circle size="mini" @click="goDetail(scope.row,'read')"/>
          </el-tooltip>
          <el-tooltip content="解锁" placement="top">
            <el-button v-if= "scope.row.attempts&& scope.row.attempts>=5" type="primary" icon="el-icon-unlock" circle size="mini" @click="unlock(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="goDetail(scope.row,'edit')"/>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" circle size="mini" @click="deleteUser(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top: 2%;margin-left: 70%;">
      <el-pagination
        v-if="tableData.length&&tableData.length>4"
        :current-page="page.current"
        :page-sizes="[5, 10 , 20, 50, 100, 200]"
        :page-size="page.size"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

  <style>
      .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  </style>
<script>
export default {
  name: 'SystemUseList',
  data() {
    return {
      userSearch: {
        name: '',
        phone: '',
        countryCode: '',
        email: '',
        status: ''
      },
      tableData: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        totals: 0
      },
      selectSystem: [{
        key: '0', label: 'android', value: 'android'
      },
      {
        key: '1', label: 'ios', value: 'ios'
      }],
      isPrivateServerType: [{
        key: '0', label: '全部', value: ''
      },
      {
        key: '1', label: '是', value: 'yes'
      },
      {
        key: '2', label: '否', value: 'no'
      }]
    }
  },
  created() {
    var _this = this
    _this.getSystemUserList()
  },

  methods: {
    getSystemUserList() {
      var _this = this
      _this.loading = true
      var params = {}
      params.page = _this.page
      params.user = _this.userSearch
      _this.postRequest('/systemManage/user/getSystemUserList', params).then(resp => {
        if (resp && resp.data) {
          _this.tableData = resp.data.records
          if (_this.tableData.length > 0) {
            _this.tableData.forEach(data => {
              var roleArray = []
              if (data.roles && data.roles.length > 0) {
                data.roles.forEach(r => {
                  roleArray.push(r.name)
                })
              }
              data.roles = roleArray.join(', ')
            })
          }
          // current pages size total
          _this.page.current = resp.data.current
          _this.page.size = resp.data.size
          _this.page.total = resp.data.total
        }
        _this.loading = false
      })
    },
    clearSearch() {
      this.$refs.searchRef.resetFields()
      this.page.current = 1
      this.page.size = 10
      this.getSystemUserList()
    },
    search() {
      this.getSystemUserList()
    },
    goDetail(user, type) {
      // 字符串
      // this.$router.push('/home/first')

      // 对象
      // this.$router.push({ path: '/home/first' })

      // 命名的路由

      this.$router.push(
        {
          name: 'SystemUserDetail',
          params: {
            actiontype: type,
            uid: user === '' ? '' : user.uid
          }
        })
    },
    deleteUser(user) {
      const _this = this
      _this.$confirm('是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // var params = {}
        // params.user = user
        _this.postRequest('/systemManage/user/deleteSystemUser', user).then(resp => {
          if (resp && resp.code === 200) {
            _this.$message({
              type: 'success',
              message: resp.msg
            })
          }
          _this.getSystemUserList()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    unlock(user) {
      const _this = this
      _this.loading = true
      var params = user
      params.attempts = 0
      _this.postRequest('/systemManage/user/unlockSystemUser', params).then(resp => {
        if (resp && resp.code === 200) {
          _this.$message({
            type: 'success',
            message: '用户已解锁'
          })
        }
        _this.getSystemUserList()
        _this.loading = false
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getSystemUserList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getSystemUserList()
    }
  }
}
</script>
