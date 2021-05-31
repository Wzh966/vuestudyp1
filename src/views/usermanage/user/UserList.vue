<template>
  <div style="margin-top: 2%;">
    <!-- 搜索 -->
    <div>
      <el-form ref="searchRef" :inline="true" :model="formInline">
        <el-row type="flex">
          <el-col :span="6">
            <el-form-item label="搜索类型">
              <el-input v-model="userSearch.keyWord" placeholder="关键字" class="input-with-select">
                <el-select slot="prepend" v-model="userSearch.searchType" placeholder="请选择">
                  <el-option
                    v-for="type in searchTypes"
                    :key="type.key"
                    :value="type.value"
                    :label="type.label"
                  />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item>
              <el-date-picker
                v-model="userSearch.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
          </el-form-item></el-col>
          <el-col :span="4">
            <el-form-item label="是否私服">
              <el-select v-model="userSearch.selectPrivate" >
                <el-option
                  v-for="privatetype in isPrivateServerType"
                  :key="privatetype.key"
                  :value="privatetype.value"
                  :label="privatetype.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="userSearch.appkeyWord" placeholder="App版本号" class="input-with-select">
                <el-select slot="prepend" v-model="userSearch.system" placeholder="手机系统">
                  <el-option
                    v-for="system in selectSystem"
                    :key="system.key"
                    :value="system.value"
                    :label="system.label"
                  />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: 75%;">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clearSearch">重置</el-button>
          </el-form-item>
        </el-row>
    </el-form></div>
    <!-- 数据 -->
    <el-table
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
        width="150"/>
      <el-table-column
        prop="nickName"
        label="昵称"
        width="150"/>
      <el-table-column
        prop="name"
        label="姓名"
        width="150"/>
      <el-table-column
        prop="inviteCode"
        label="邀请码"
        width="150"/>
      <el-table-column
        prop="deviceId"
        label="deviceId"
        width="150"/>
      <el-table-column
        prop="biometricStatus"
        label="认证状态"
        width="100"/>
      <el-table-column
        prop="banker"
        label="banker资质"
        width="100"/>
      <el-table-column
        prop="cashDelivery"
        label="cash delivery服务"
        width="100"/>
      <el-table-column
        prop="level"
        label="等级"
        width="100"/>
      <el-table-column
        prop="systemVersion"
        label="手机系统"
        width="100"/>
      <el-table-column
        prop="phoneModel"
        label="手机型号"
        width="100"/>
      <el-table-column
        prop="appVersion"
        label="App版本"
        width="100"/>
      <el-table-column
        prop="isPrivateServer"
        label="是否私服"
        width="100"/>
      <el-table-column
        prop="exchangeLlimit"
        label="个人额度"
        width="100"/>
      <el-table-column
        prop="createdTime"
        label="注册时间"
        width="100"/>
      <el-table-column
        prop="lastLoginTime"
        label="最后登录时间"
        width="100"/>
      <el-table-column
        prop="remark"
        label="备注"
        width="100"/>
      <el-table-column
        fixed="right"
        prop="operation"
        label="操作"
        width="180"/>
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top: 2%;margin-left: 75%;">
      <el-pagination
        :current-page="page.currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="page.pizeSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
</div></template>

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
  name: 'UseList',
  data() {
    return {
      userSearch: {
        keyWord: '',
        searchType: '',
        date: '',
        selectPrivate: '',
        appkeyWord: '',
        system: ''
      },
      formInline: {
        user: '',
        region: ''
      },
      tableData: [],
      page: {
        currentPage: 1,
        pizeSize: 50,
        totalCount: 0
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
      }],
      searchTypes: [
        {
          key: '0', label: '全部', value: ''
        },
        {
          key: '1', label: '手机号', value: 'phone'
        },
        {
          key: '2', label: '昵称', value: 'nickName'
        },
        {
          key: '3', label: 'diviceId', value: 'diviceId'
        },
        {
          key: '4', label: '邀请码', value: 'inviteCode'
        },
        {
          key: '5', label: '用户email', value: 'email'
        }, {
          key: '6', label: '收款邮箱', value: 'receiveEmail'
        }, {
          key: '7', label: '姓名', value: 'name'
        }
      ]
    }
  },
  created() {
    var _this = this
    _this.getUserList()
  },

  methods: {

    getUserList() {
      var _this = this
      _this.postRequest('/getUserList', []).then(resp => {
        console.log('test!')
      })
    },
    clearSearch() {
      this.$refs.searchRef.resetFields()
    },
    onSubmit() {
      this.getUserList()
      console.log('submit!')
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
