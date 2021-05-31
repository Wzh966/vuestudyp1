<template>
  <div style="margin-top: 2%">
    <!-- 搜索 -->
    <div>
      <el-form ref="searchRef" :inline="true" :model="formInline">
        <el-form-item label="国家:">
          <el-select v-model="userSearch.country" placeholder="请选择">
            <el-option
              v-for="item in countrys"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="userSearch.status" placeholder="请选择">
            <el-option
              v-for="item in statuss"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="信息匹配度:">
          <el-select v-model="userSearch.match" placeholder="请选择">
            <el-option
              v-for="item in matches"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查询条件:">
          <el-input v-model="userSearch.keyWord" placeholder="关键字" class="input-with-select">
            <el-select slot="prepend" v-model="userSearch.queryType" placeholder="请选择">
              <el-option
                v-for="type in queryTypes"
                :key="type.key"
                :value="type.value"
                :label="type.label"
              />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="APP版本号:">
          <el-input v-model="userSearch.appVersion" placeholder="APP版本号" class="input-with-select">
            <el-select slot="prepend" v-model="userSearch.system" placeholder="手机系统">
              <el-option
                v-for="type in systems"
                :key="type.key"
                :value="type.value"
                :label="type.label"
              />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="认证方式:">
          <el-select v-model="userSearch.kycType" placeholder="请选择">
            <el-option
              v-for="item in kycTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker
            v-model="userSearch.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <!-- fixed -->
      <el-table-column prop="ID" label="ID" width="50" />
      <el-table-column prop="countryCode" label="区号" width="50" />
      <el-table-column prop="phone" label="手机" width="50" />
      <el-table-column prop="nickName" label="昵称" width="50" />
      <el-table-column prop="level" label="等级" width="50" />
      <el-table-column prop="name" label="真实姓名" width="100" />
      <el-table-column prop="systemVersion" label="系统版本" width="100" />
      <el-table-column prop="phoneVersion" label="手机型号" width="100" />
      <el-table-column prop="appVersion" label="app版本号" width="100" />
      <el-table-column prop="sex" label="性别" width="50" />
      <el-table-column prop="country" label="国家" width="50" />
      <el-table-column prop="idType" label="证件类型" width="100" />
      <el-table-column prop="status" label="状态" width="50" />
      <el-table-column prop="remarks" label="备注" width="50" />
      <el-table-column prop="match" label="信息匹配度" width="100" />
      <el-table-column prop="kycType" label="kyc类型" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="100" />
      <el-table-column prop="updateTime" label="更新时间" width="100" />
      <el-table-column
        fixed="right"
        prop="operation"
        label="操作"
        width="100"
      />
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top: 2%">
      <el-pagination
        :current-page="page.currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="page.pizeSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
.el-table__empty-text {
      height:400px;
      border:none;
    }
</style>
<script>
export default {
  name: 'UseList',
  data() {
    return {
      userSearch: {
        country: '',
        status: '',
        match: '',
        queryType: '',
        keyWord: '',
        system: '',
        appVersion: '',
        kycType: '',
        date: ''
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
      statuss: [
        {
          key: '0',
          label: '全部',
          value: ''
        },
        {
          key: '1',
          label: '待审核',
          value: 'pending'
        },
        {
          key: '2',
          label: '认证成功',
          value: 'success'
        }
      ],
      matches: [
        {
          key: '0',
          label: '全部',
          value: ''
        },
        {
          key: '1',
          label: '完全不匹配',
          value: 'allNotMatch'
        },
        {
          key: '2',
          label: '生日匹配',
          value: 'birthMath'
        },
        {
          key: '3',
          label: '姓名匹配',
          value: 'nameMath'
        },
        {
          key: '4',
          label: '全匹配',
          value: 'allMatch'
        },
        {
          key: '5',
          label: '不匹配',
          value: 'notMatch'
        }
      ],
      countrys: this.GLOBAL.countrys,
      queryTypes: [
        {
          key: '0',
          label: '手机号',
          value: 'phone'
        },
        {
          key: '1',
          label: '昵称',
          value: 'nickname'
        },
        {
          key: '2',
          label: '姓名',
          value: 'name'
        }
      ],
      systems: [
        {
          key: '0',
          label: 'Android',
          value: 'android'
        },
        {
          key: '1',
          label: 'iOS',
          value: 'ios'
        }
      ],
      kycTypes: [
        {
          key: '0',
          label: 'helloSoda',
          value: 'hellosoda'
        },
        {
          key: '1',
          label: 'jumio',
          value: 'jumio'
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
      _this.postRequest('/getUserList', []).then((resp) => {
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
