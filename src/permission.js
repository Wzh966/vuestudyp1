// resetRouter
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router, { constantRoutes, defaultRoutes } from './router'
import store from './store'
import { myLocalGetItem } from './utils/mystorage'

// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/logout'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  const token = myLocalGetItem('token')
  if (token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/home' })
      NProgress.done()
    } else {
      try {
        // get user info
        // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
        // await store.dispatch('user/getInfo')
        // || to.name != null
        if (!JSON.parse(localStorage.getItem('newLogin')) && store.getters.permissionRoutes.length) {
          next()
        } else {
          // const { roles } = await store.dispatch('user/getInfo')
          // const roles = ['admin']
          // generate accessible routes map based on roles
          // resetRouter()
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // dynamically add accessible routes
          router.options.routes = constantRoutes.concat(accessRoutes)
          router.options.accessRoutes = accessRoutes
          router.addRoutes(accessRoutes)
          router.addRoutes(defaultRoutes)
          localStorage.setItem('newLogin', false)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        }
      } catch (error) {
        // remove token and go to login page to re-login
        // await store.dispatch('user/resetToken')
        // Message.error(error || 'Has Error')
        localStorage.clear()
        Message.error({ message: error })
        // next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  // }
  } else {
    // console.log(localStorage)
    //   /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // router.push({ name: 'Login' })
      next('/')
    }
    NProgress.done()
    // resetRouter()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
