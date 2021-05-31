<template>
  <div>
    <!-- 搜索 -->
    <el-form ref="searchRef" :inline="true" :model="tagSearch" >
      <el-row >
        <el-col :span="6">
          <el-form-item prop="name" label="名称">
            <el-input
              v-model="tagSearch.name"
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
              v-model="tagSearch.description"
              size="normal"
              type="text"
              auto-complete="off"
              placeholder="Enter an title"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" size="mini" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="clearSearch">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="goDetail('','add')">新建</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="goDetail('','add')">导入</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 数据 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 75%">
      <el-table-column
        prop="name"
        label="名称"
        width="180"/>
      <el-table-column
        prop="description"
        label="描述"
        width="250"/>
      <el-table-column
        :formatter="formatStatus"
        prop="status"
        label="状态"
        width="100"/>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="200"/>
      <el-table-column
        prop="updatedAt"
        label="更新时间"
        width="200"/>
      <el-table-column
        prop="operation"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-tooltip content="查看" placement="top">
            <el-button type="primary" icon="el-icon-view" circle size="mini" @click="goDetail(scope.row,'read')"/>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="goDetail(scope.row,'edit')"/>
          </el-tooltip>
          <el-tooltip content="执行" placement="top">
            <!-- v-if ="scope.row.status!=='1'" -->
            <el-button type="primary" icon="el-icon-position" circle size="mini" @click="excute(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" circle size="mini" @click="deleteTag(scope.row)"/>
          </el-tooltip>
          <!-- <el-dialog
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            title="执行周期"
            width="30%">
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog> -->
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
  name: 'UserTagList',
  data() {
    return {
      tagSearch: {
        name: '',
        description: ''
      },
      tableData: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        totals: 0
      },
      dialogVisible: false,
      runType: '',
      runTypes: [
        {
          key: '0', label: '立即执行', value: '0'
        },
        {
          key: '1', label: '周期执行', value: '1'
        },
        {
          key: '2', label: '定时', value: '2'
        }]

    }
  },
  created() {
    var _this = this
    _this.getTagList()
  },

  methods: {
    getTagList() {
      var _this = this
      _this.loading = true
      var params = {}
      params.page = _this.page
      params.tag = _this.tagSearch
      _this.postRequest('/userManage/tag/getTagList', params).then(resp => {
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
      this.getTagList()
    },
    search() {
      this.getTagList()
    },
    goDetail(tag, type) {
      this.$router.push(
        {
          name: 'UserTagDetail',
          params: {
            actiontype: type,
            id: tag === '' ? '' : tag.id
          }
        })
    },
    deleteTag(tag) {
      const _this = this
      _this.$confirm('是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.postRequest('/userManage/tag/deleteTag', tag).then(resp => {
          if (resp && resp.code === 200) {
            _this.$message({
              type: 'success',
              message: resp.msg
            })
          }
          _this.getTagList()
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
      this.getTagList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTagList()
    },
    formatStatus(row, column, cellValue) {
      var ret = '' // 你想在页面展示的值
      if (cellValue === '0') {
        ret = '未执行' // 根据自己的需求设定
      }
      if (cellValue === '1') {
        ret = '执行中'
      }
      if (cellValue === '2') {
        ret = '执行完毕'
      }
      if (cellValue === '3') {
        ret = '执行失败'
      }
      return ret
    },
    excute(tag) {
      const _this = this
      _this.$confirm('是否执行该标签任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tag.switchOn = true
        _this.postRequest('/userManage/tag/runTagTask', tag).then(resp => {
          if (resp && resp.code === 200) {
            _this.$message({
              type: 'success',
              message: resp.msg
            })
          }
          _this.getTagList()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
