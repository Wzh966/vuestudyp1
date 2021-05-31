import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import Home from '@/views/Home'
import Logout from '@/views/login/Logout'
// import store from '../store'
// import argv from '../components/server'

Vue.use(Router)

// push
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// // replace
// const originalReplace = Router.prototype.replace
// Router.prototype.replace = function replace(location) {
//   return originalReplace.call(this, location).catch(err => err)
// }

// 公共路由
export const constantRoutes = [
  // 登录
  {
    path: '/',
    name: 'Start',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  }
  // actionrouter
  // {
  //   path: '/systemManage/user/detail',
  //   name: 'SystemUserDetail',
  //   component: () => import(`@/views/systemmanage/user/SystemUserDetail`)
  // }
]
// 动态路由
// export const asyncRoutes = [
//   {
//     path: '/systemHome',
//     name: 'SystemHome',
//     component: Home,
//     // redirect: '/user/list',
//     meta: {
//       title: '系统管理',
//       hidden: true,
//       leaf: false,
//       icon: 'el-icon-s-tools',
//       roles: ['admin', 'editor'] // 普通的用户角色
//     },
//     children: [
//       {
//         path: '/exchangeRate/list',
//         name: 'ExchangeRateList',
//         meta: {
//           icon: 'el-icon-s-tools',
//           title: '汇率管理',
//           roles: ['admin', 'editor'] // 普通的用户角色
//         },
//         component: () => import(/* webpackChunkName: "UserList" */ '@/views/userManage/user/UserList')
//       }
//     ]
//   },
//   {
//     path: '/userHome',
//     name: 'UserHome',
//     component: Home,
//     redirect: '/user/list',
//     meta: {
//       title: '用户管理',
//       hidden: true,
//       leaf: false,
//       icon: 'el-icon-user-solid',
//       roles: ['admin', 'editor'] // 普通的用户角色
//     },
//     children: [
//       {
//         path: '/user/list',
//         name: 'UserList',
//         meta: {
//           title: '用户列表',
//           icon: 'el-icon-user-solid',
//           roles: ['admin', 'editor'] // 普通的用户角色
//         },
//         component: () => import(/* webpackChunkName: "UserList" */ '@/views/userManage/user/UserList')
//       }
//     ]
//   },
//   {
//     path: '/orderHome',
//     name: 'OrderHome',
//     component: Home,
//     redirect: '/chargeorder/list',
//     meta: {
//       title: '订单管理',
//       hidden: true,
//       leaf: false,
//       icon: 'el-icon-s-goods',
//       roles: ['admin', 'editor'] // 普通的用户角色
//     },
//     children: [
//       {
//         path: '/chargeorder/list',
//         name: 'Chargeorder',
//         meta: {
//           title: '充值订单',
//           icon: 'el-icon-s-goods',
//           roles: ['admin', 'editor'] // 普通的用户角色
//         },
//         component: () => import(/* webpackChunkName: "Chargeorder" */ '@/views/order/ChargeOrder')
//       }
//     ]
//   }
// ]

export const defaultRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/common/NotFound')
  },
  { path: '*', redirect: '/404' } // 添加
]
const createRouter = () => new Router({
  // scrollBehavior: () => ({ y: 0 }),
  base: process.env.PROJECTNAME,
  mode: 'history',
  routes: constantRoutes
  // routes: store.getters.permissionRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
