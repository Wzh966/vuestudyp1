// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import './permission'
import GLOBAL from './global_variable'
// import axios from 'axios'
// import './components/mystorage'

import { postRequest } from './utils/api'
import { postKeyValueRequest } from './utils/api'
import { putRequest } from './utils/api'
import { deleteRequest } from './utils/api'
import { getRequest } from './utils/api'

import { myLocalSetItem } from './utils/mystorage'
import { myLocalGetItem } from './utils/mystorage'
import { myLocalRemoveItem } from './utils/mystorage'
import { myLocalClear } from './utils/mystorage'

// 折叠插件
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

// cron表达
import VueCron from 'vue-cron'
Vue.use(VueCron)

import vcrontab from 'vcrontab'
Vue.use(vcrontab) // 使用方式：

// import 'vue-cron-generator/src/styles/global.less'

// 请求
Vue.prototype.postRequest = postRequest
Vue.prototype.postKeyValueRequest = postKeyValueRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.getRequest = getRequest

// storage 存储
Vue.prototype.myLocalSetItem = myLocalSetItem
Vue.prototype.myLocalGetItem = myLocalGetItem
Vue.prototype.myLocalRemoveItem = myLocalRemoveItem
Vue.prototype.myLocalClear = myLocalClear
Vue.prototype.GLOBAL = GLOBAL

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Vuex)

/* eslint-disable no-new */
// function getServerConfig() {
//   return new Promise((resolve
//     , reject) => {
//     axios.get('./static/server.config.json').then((result) => {
//       const list = result.data
//       for (const key in list) {
//         Vue.prototype[key] = list[key]
//       }
//     })
//     resolve()
//   })
// }
// async function main() {
//   await getServerConfig()
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
// }
// main()
