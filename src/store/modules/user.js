const state = {
  token: '',
  name: '',
  isLogin: false
}

const mutations = {
  SET_TOKEN: (state, tokens) => {
    state.token = tokens
  },
  SET_USERINFO: (state, user) => {
    state.name = user
    state.isLogin = true
  }
}

const actions = {
  saveToken({ commit }, tokens) {
    return new Promise(resolve => {
      commit('SET_TOKEN', tokens)
      resolve(tokens)
    })
  },
  setUserInfo({ commit }, userinfo) {
    return new Promise(resolve => {
      commit('SET_USERINFO', userinfo)
      resolve(userinfo)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
