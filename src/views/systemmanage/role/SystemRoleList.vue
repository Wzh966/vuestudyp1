<template>
  <div>
    <!-- 搜索 -->
    <el-button type="primary" style="margin-left: 75%;" size="small" @click="goDetail('','add')">新增</el-button>
    <el-form ref="searchRef" :inline="true" :model="roleSearch" >
      <el-row >
        <el-col :span="6">
          <el-form-item prop="name" label="名称">
            <el-input
              v-model="roleSearch.name"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter name"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="desc" label="描述">
            <el-input
              v-model="roleSearch.desc"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter an title"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
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
      style="width: 75%">
      <el-table-column
        fixed
        prop="name"
        label="名称"
        width="200"/>
      <el-table-column
        prop="desc"
        label="描述"
        width="200"/>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="200"/>
      <el-table-column
        prop="updatedAt"
        label="跟新时间"
        width="200"/>
      <el-table-column
        fixed="right"
        prop="operation"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-tooltip content="查看" placement="top">
            <el-button type="primary" tip="123" icon="el-icon-view" circle size="mini" @click="goDetail(scope.row,'read')"/>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="goDetail(scope.row,'edit')"/>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" circle size="mini" @click="deleteRole(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top: 2%;margin-left: 50%;">
      <el-pagination
        v-if="tableData.length&&tableData.length>4"
        :current-page="page.current"
        :page-sizes="[5, 10, 20, 50, 100, 200]"
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
  name: 'SystemRoleList',
  data() {
    return {
      roleSearch: {
        name: '',
        desc: ''
      },
      tableData: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        totals: 0
      }
    }
  },
  created() {
    var _this = this
    _this.getSystemRoleList()
  },

  methods: {
    getSystemRoleList() {
      var _this = this
      _this.loading = true
      var params = {}
      params.page = _this.page
      params.role = _this.roleSearch
      _this.postRequest('/systemManage/role/getRoleList', params).then(resp => {
        if (resp && resp.data) {
          _this.tableData = resp.data.records
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
      this.getSystemRoleList()
    },
    search() {
      this.getSystemRoleList()
    },
    goDetail(role, type) {
      this.$router.push(
        {
          name: 'SystemRoleDetail',
          params: {
            actiontype: type,
            rid: role === '' ? '' : role.rid
          }
        })
    },
    deleteRole(role) {
      const _this = this
      _this.$confirm('是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.postRequest('/systemManage/role/deleteRole', role).then(resp => {
          if (resp && resp.code === 200) {
            _this.$message({
              type: 'success',
              message: resp.msg
            })
          }
          _this.getSystemRoleList()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getSystemRoleList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getSystemRoleList()
    },
    formatBoolean(row, column, cellValue) {
      var ret = '' // 你想在页面展示的值
      if (cellValue) {
        ret = '是' // 根据自己的需求设定
      } else {
        ret = '否'
      }
      return ret
    }
  }
}
</script>
