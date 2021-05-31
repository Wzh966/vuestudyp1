<template>
  <div v-loading="loading" >
    <el-collapse v-model="activeNames" >
      <el-collapse-item title="基本信息" name="baseInfo">
        <el-form ref="detailRef" :inline="true" :model="menuDetail" >
          <el-row >
            <el-col :span="6">
              <el-form-item prop="name" label="名称">
                <el-input
                  v-model="menuDetail.name"
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
              <el-form-item prop="path" label="path">
                <el-input
                  v-model="menuDetail.path"
                  :readonly ="actiontype!=='add'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter path"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="component" label="component">
                <el-input
                  v-model="menuDetail.component"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter component"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="title" label="标题">
                <el-input
                  v-model="menuDetail.title"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter title"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="desc" label="描述">
                <el-input
                  v-model="menuDetail.desc"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter desc"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="icon" label="图标">
                <el-input
                  v-model="menuDetail.icon"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter icon"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="sort" label="序号">
                <el-input
                  v-model="menuDetail.sort"
                  :readonly ="actiontype==='read'"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="Enter sort"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="type" label="资源类型">
                <el-select :disabled="actiontype==='read'" v-model="menuDetail.type" >
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
              <el-form-item prop="leaf" label="是否只有单子节点">
                <el-radio-group :class="{'el-form-item-readonly':actiontype==='read'}" v-model="menuDetail.leaf">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="hidden" label="是否隐藏">
                <el-radio-group :class="{'el-form-item-readonly':actiontype==='read'}" v-model="menuDetail.hidden">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="parent" label="是否为父资源">
                <!-- :disabled ="actiontype==='read'" -->
                <el-radio-group :class="{'el-form-item-readonly':actiontype==='read'}" v-model="menuDetail.parent">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="parentName" label="父资源">
                <el-select :disabled="actiontype==='read'" v-model="menuDetail.parentName" clearable placeholder="请选择父资源">
                  <el-option
                    v-for="item in parentMenus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="children" label="子资源">
                <el-select :disabled="actiontype==='read'" v-model="menuDetail.children" multiple placeholder="请选择子资源">
                  <el-option
                    v-for="item in childMenus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="actiontype!=='add'">
            <el-col :span="6">
              <el-form-item prop="createdAt" label="创建时间">
                <el-input
                  v-model="menuDetail.createdAt"
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
                  v-model="menuDetail.updatedAt"
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
  name: 'SystemMenuDetail',
  data() {
    return {
      menuDetail: {
        name: '',
        path: '',
        component: '',
        desc: '',
        title: '',
        hidden: '',
        leaf: '',
        icon: '',
        sort: '',
        parent: '',
        parentName: '',
        type: '',
        createdAt: '',
        updatedAt: '',
        children: []
      },
      parentMenus: [],
      childMenus: [],
      actiontype: this.$route.params.actiontype,
      loading: false,
      activeNames: ['baseInfo'],
      types: [
        {
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
    const _this = this
    // getParentMenu
    _this.getMenus()
    if (_this.actiontype !== 'add') {
      _this.getSystemMenu()
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    create() {
      const _this = this
      _this.loading = true
      _this.buildChildren(_this.menuDetail)
      var params = _this.menuDetail
      _this.postRequest('/systemManage/menu/createMenu', params).then(resp => {
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
      _this.buildChildren(_this.menuDetail)
      var params = _this.menuDetail
      params.mid = _this.$route.params.mid
      _this.postRequest('/systemManage/menu/updateMenu', params).then(resp => {
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

    buildChildren(menuDetail) {
      if (menuDetail.children && menuDetail.children.length > 0) {
        const newChildren = []
        menuDetail.children.forEach(child => {
          const newChild = {}
          newChild.name = child
          newChildren.push(newChild)
        })
        menuDetail.children = newChildren
      }
    },
    getSystemMenu() {
      const _this = this
      var params = {}
      _this.loading = true
      params.mid = _this.$route.params.mid
      _this.postRequest('/systemManage/menu/getMenus', params).then(resp => {
        if (resp && resp.code === 200) {
          // current pages size total
          if (resp.data) {
            _this.menuDetail = resp.data[0]
            _this.menuDetail.type = resp.data[0].type + ''
            const newChildern = []
            if (resp.data[0].children && resp.data[0].children.length > 0) {
              resp.data[0].children.forEach(m => {
                newChildern.push(m.name)
              })
            }
            _this.menuDetail.children = newChildern
          }
          _this.loading = false
        }
      })
    },
    getMenus() {
      const _this = this
      const params = {
      }
      _this.postRequest('/systemManage/menu/getMenus', params).then(resp => {
        if (resp && resp.code === 200) {
          if (resp.data && resp.data.length > 0) {
            resp.data.forEach(m => {
              if (m.name !== _this.menuDetail.name) {
                const r = {}
                r.value = m.name
                r.label = m.title
                if (m.parent) {
                  _this.parentMenus.push(r)
                }
                _this.childMenus.push(r)
              }
            })
            // _this.options.sort(_this.compare)
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
