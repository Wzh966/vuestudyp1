<template>
  <div v-loading="loading" >
    <el-collapse v-model="activeNames" >
      <el-collapse-item title="基本信息" name="baseInfo">
        <el-form ref="detailRef" :inline="true" :model="tagDetail" >
          <el-row >
            <el-col :span="6">
              <el-form-item prop="name" label="名称">
                <el-input
                  v-model="tagDetail.name"
                  :readonly ="actiontype!=='add'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter an name"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="description" label="描述">
                <el-input
                  v-model="tagDetail.description"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="textarea"
                  auto-complete="off"
                  placeholder="Enter description"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item prop="description" label="执行周期">
                <div class="cron">
                  <el-popover v-model="cronPopover">
                    <el-input slot="reference" v-model="tagDetail.cron" :readonly ="true" placeholder="请选择定时策略" @click="cronPopover=true"/>
                    <cron hide-component="year" @change="changeCron" @close="cronPopover=false"/>
                  </el-popover>
                </div>
              </el-form-item>
            </el-col> -->
            <!-- <vcrontab :expression="expression" @hide="showCron=false" @fill="crontabFill"/> -->
            <el-col :span="8">
              <el-form-item prop="cron" label="执行周期">
                <el-input v-model="tagDetail.cron" :readonly ="true" placeholder="请选择定时策略" @click.native="showDialog"/>
                <!-- <el-button type="primary" @click="showDialog">生成 cron</el-button> -->
                <el-dialog :visible.sync="showCron" title="生成 cron">
                  <vcrontab :expression="expression" hide-component="[year]" @hide="showCron=false" @fill="crontabFill"/>
                </el-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if = "actiontype!=='add'" prop="creator" label="创建人">
                <el-input
                  v-model="tagDetail.creator"
                  :readonly ="true"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="6">
              <el-form-item prop="active" label="是否激活">
                <el-select :disabled="actiontype==='read'" v-model="tagDetail.active" >
                  <el-option
                    v-for="type in activeTypes"
                    :key="type.key"
                    :value="type.value"
                    :label="type.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="registerTime" label="注册时间">
                <el-date-picker
                  :disabled="actiontype==='read'"
                  v-model="tagDetail.registerTime"
                  :picker-options="registerOptions"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="tagDetail.active">
            <el-col :span="6">
              <el-form-item prop="tradeType" label="交易类型">
                <el-select :disabled="actiontype==='read'" v-model="tagDetail.tradeType" clearable >
                  <el-option
                    v-for="type in tradeTypes"
                    :key="type.key"
                    :value="type.value"
                    :label="type.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="tradeTime" label="交易活跃时间">
                <el-date-picker
                  :disabled="actiontype==='read'"
                  v-model="tagDetail.tradeTime"
                  :picker-options="tradeOptions"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="actiontype!=='add'">
            <el-col :span="6">
              <el-form-item prop="createdAt" label="创建时间">
                <el-input
                  v-model="tagDetail.createdAt"
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
                  v-model="tagDetail.updatedAt"
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
import { cron } from 'vue-cron'
export default {
  name: 'UserTagDetail',
  components: { cron },
  data() {
    return {
      input: '',
      expression: '',
      showCron: false,
      tagDetail: {
        name: '',
        description: '',
        registerTime: [],
        tradetype: '',
        active: true,
        tradeTime: [],
        cron: '',
        creator: '',
        createdAt: '',
        updatedAt: ''
      },
      resourceList: [],
      actiontype: this.$route.params.actiontype,
      loading: false,
      activeNames: ['baseInfo'],
      cronPopover: false,
      tradeTypes: [{
        key: '0', label: '双向', value: ''
      },
      {
        key: '1', label: 'CNY', value: 'CNY'
      },
      {
        key: '2', label: 'CAD', value: 'CAD'
      }],
      activeTypes: [
        {
          key: '0', label: 'YES', value: true
        },
        {
          key: '1', label: 'NO', value: false
        }],
      registerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tradeOptions: {
        shortcuts: [{
          text: '最近半月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    const _this = this

    if (_this.actiontype !== 'add') {
      _this.getTag()
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    create() {
      const _this = this
      _this.loading = true
      var params = _this.tagDetail
      params.creator = localStorage.getItem('user')
      _this.postRequest('/userManage/tag/createTag', params).then(resp => {
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
      var params = _this.tagDetail
      params.id = _this.$route.params.id
      _this.postRequest('/userManage/tag/updateTag', params).then(resp => {
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

    getTag() {
      const _this = this
      _this.loading = true
      var params = {}
      params.id = _this.$route.params.id
      _this.postRequest('/userManage/tag/getTag', params).then(resp => {
        if (resp && resp.code === 200) {
          // current pages size total
          if (resp.data) {
            _this.tagDetail = resp.data
          }
          _this.loading = false
        }
      })
    },
    changeCron(val) {
      const _this = this
      _this.tagDetail.cron = val
    },
    crontabFill(value) {
      const _this = this
      // 确定后回传的值
      _this.tagDetail.cron = value
    },
    showDialog() {
      const _this = this
      _this.expression = _this.tagDetail.cron// 传入的 cron 表达式，可以反解析到 UI 上
      _this.showCron = true
    }
  }
}
</script>

<style>
</style>
