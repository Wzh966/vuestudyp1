<template>
  <div>
    <!-- 数据 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="180"/>
      <el-table-column
        prop="phone"
        label="手机"
        width="200"/>
      <el-table-column
        prop="email"
        label="邮箱"
        width="400"/>
      <el-table-column
        prop="view"
        label="查看二维码"
        width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.secret!=null && scope.row.secret.length > 0" >
            <el-tooltip content="查看二维码" placement="top">
              <el-button type="primary" tip="123" icon="el-icon-view" circle size="mini" @click="getQRCode(scope.row)"/>
            </el-tooltip>
          </div>
          <el-dialog
            :visible.sync="dialogVisible"
            title="谷歌二维码"
            width="30%">
            <div ref="qrcodeContainer" />
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">返回</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column
        prop="update"
        label="更新/获取"
        width="200">
        <template slot-scope="scope">
          <el-tooltip content="获得二维码" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="genQRCode(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="delete"
        label="删除"
        width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.secret!=null && scope.row.secret.length > 0" >
            <el-tooltip content="删除二维码" placement="top">
              <el-button type="primary" icon="el-icon-delete" circle size="mini" @click="deleteQRCode(scope.row)"/>
            </el-tooltip>
          </div>
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
  .el-dialog .el-dialog__body{
      display: flex;
      justify-content: center;
      align-items: center;
}
  </style>
<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'SystemUseList',
  data() {
    return {
      userSearch: {
        name: '',
        phone: '',
        countryCode: '',
        email: '',
        status: '',
        secret: ''
      },
      tableData: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        totals: 0
      },
      dialogVisible: false,
      qrC: null
    }
  },
  created() {
    var _this = this
    _this.getSystemUserList()
  },

  methods: {
    getSystemUserList() {
      const _this = this
      _this.loading = true
      var params = {}
      var roles = []
      roles = JSON.parse(localStorage.getItem('roles'))
      if (roles.indexOf('admin') === -1) {
        _this.userSearch.name = localStorage.getItem('user')
      }
      params.page = _this.page
      params.user = _this.userSearch
      _this.postRequest('/systemManage/user/getSystemUserList', params).then(resp => {
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
    getQRCode(user) {
      var _this = this
      _this.dialogVisible = true
      var params = {}
      params = user
      _this.postRequest('/systemManage/user/getQRCode', params).then(resp => {
        if (resp && resp.code === 200) {
          if (resp.data) {
            _this.$nextTick(function() {
              if (_this.qrC == null) {
                _this.qrC = new QRCode(_this.$refs.qrcodeContainer, {
                  width: 250,
                  height: 250,
                  text: resp.data.qr,
                  colorDark: '#000', // 二维码的颜色
                  colorLight: '#fff',
                  correctLevel: QRCode.CorrectLevel.H
                })
                _this.qrC._el.title = ''
              } else {
                _this.qrC.clear()
                _this.qrC.makeCode(resp.data.qr)
              }
            })
          }
        }
      })
    },
    genQRCode(user) {
      var _this = this
      _this.$confirm('是否生成二维码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {}
        params = user
        _this.postRequest('/systemManage/user/genQRCode', params).then(resp => {
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
    deleteQRCode(user) {
      const _this = this
      _this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // var params = {}
        // params.user = user
        _this.postRequest('/systemManage/user/deleteQRCode', user).then(resp => {
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
    handleClose() {
      const _this = this
      _this.dialogVisible = false
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
