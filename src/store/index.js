import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// 添加permission
import permission from './modules/permission'

import user from './modules/user'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // 添加permission
    permission,
    user
  },
  getters
})

export default store
