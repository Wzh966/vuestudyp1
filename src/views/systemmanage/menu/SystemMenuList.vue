<template>
  <div>
    <!-- 搜索 -->
    <el-button type="primary" style="margin-left: 75%;" size="small" @click="goDetail('','add')">新增</el-button>
    <el-form ref="searchRef" :inline="true" :model="menuSearch" >
      <el-row >
        <el-col :span="6">
          <el-form-item prop="name" label="名称">
            <el-input
              v-model="menuSearch.name"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter name"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="title" label="标题">
            <el-input
              v-model="menuSearch.title"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter an title"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="type" label="资源类型">
            <el-select v-model="menuSearch.type" >
              <el-option
                v-for="t in types"
                :key="t.key"
                :value="t.value"
                :label="t.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="parent" label="是否父资源">
            <el-radio-group v-model="menuSearch.parent">
              <el-radio label="">全部</el-radio>
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="parentName" label="父资源名称">
            <el-input
              v-model="menuSearch.parentName"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter an Name"
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
      style="width: 100%">
      <el-table-column
        fixed
        prop="name"
        label="名称"
        width="100"/>
      <el-table-column
        prop="path"
        label="path"
        width="180"/>
      <el-table-column
        prop="component"
        label="component"
        width="180"/>
      <el-table-column
        prop="desc"
        label="描述"
        width="180"/>
      <el-table-column
        prop="title"
        label="标题"
        width="180"/>
      <el-table-column
        prop="icon"
        label="icon"
        width="180"/>
      <el-table-column
        prop="sort"
        label="序号"
        width="180"/>
      <el-table-column
        :formatter="formatBoolean"
        prop="parent"
        label="是否父资源"
        width="180"/>
      <el-table-column
        prop="parentName"
        label="父资源"
        width="180"/>
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
            <el-button type="primary" tip="123" icon="el-icon-view" circle size="mini" @click="goDetail(scope.row,'read')"/>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="goDetail(scope.row,'edit')"/>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" circle size="mini" @click="deleteMenu(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top: 2%;margin-left: 70%;">
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
  name: 'SystemMenuList',
  data() {
    return {
      menuSearch: {
        name: '',
        title: '',
        parent: '',
        type: '',
        parentName: ''
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
      types: [{
        key: '0', label: '全部', value: ''
      }, {
        key: '1', label: '菜单', value: '1'
      },
      {
        key: '2', label: '页面', value: '2'
      },
      {
        key: '3', label: '功能', value: '3'
      }]
    }
  },
  created() {
    var _this = this
    _this.getSystemMenuList()
  },

  methods: {
    getSystemMenuList() {
      var _this = this
      _this.loading = true
      var params = {}
      params.page = _this.page
      params.menu = _this.menuSearch
      _this.postRequest('/systemManage/menu/getMenuList', params).then(resp => {
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
      this.getSystemMenuList()
    },
    search() {
      this.getSystemMenuList()
    },
    goDetail(menu, type) {
      this.$router.push(
        {
          name: 'SystemMenuDetail',
          params: {
            actiontype: type,
            mid: menu === '' ? '' : menu.mid
          }
        })
    },
    deleteMenu(menu) {
      const _this = this
      _this.$confirm('是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.postRequest('/systemManage/menu/deleteMenu', menu).then(resp => {
          if (resp && resp.code === 200) {
            _this.$message({
              type: 'success',
              message: resp.msg
            })
          }
          _this.getSystemMenuList()
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
      this.getSystemMenuList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getSystemMenuList()
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
