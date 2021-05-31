// asyncRoutes
import { constantRoutes } from '@/router'
import Home from '@/views/Home'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export function buildRoter(routers) {
  const res = []
  if (!routers || routers.length < 0) {
    return
  }
  // 定义路由中需要的自定名
  const keys = ['path', 'name', 'children']
  const metakeys = ['title', 'hidden', 'leaf', 'icon']
  // 遍历路由数组去重组可用的路由
  routers.forEach(item => {
    const newItem = {}
    const meta = {}
    // 判断 item.component 是否等于 'Layout',若是则直接替换成引入的 Layout 组件
    if (item.component === 'Home') {
      newItem.component = Home
    } else {
      //  item.component 不等于 'Layout',则说明它是组件路径地址，因此直接替换成路由引入的方法
      // newItem.component = resolve => require([`@/views${item.component}`], resolve)

      // 此处用reqiure比较好，import引入变量会有各种莫名的错误 /* webpackChunkName: "" */
      newItem.component = () => import(`@/views${item.component}`)
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
      if (metakeys.includes(key)) {
        meta[key] = item[key]
      }
    }
    newItem.meta = meta
    // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
    if (newItem.children && newItem.children.length) {
      newItem.children = buildRoter(item.children).reverse()
    }
    res.push(newItem)
  })
  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     commit('SET_ROUTES1', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // },

  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = buildRoter(JSON.parse(localStorage.getItem('routers')))
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
