import Vue from 'vue'
import Router from 'vue-router'
import { getQueryString, pageUrl } from '@/utils/utils'
import config from '@/config/config'
import { checkIsLogin } from '@/utils/login'
import { getStore, removeStore, setStore } from '@/utils/storage';
import Layout from '@/layout'
Vue.use(Router)

// 首页
const Home = (resolve) => {
  import('@/page/home/home').then((module) => {
    resolve(module)
  })
}

// 401
const error401 = (resolve) => {
  import('@/page/error/401').then((module) => {
    resolve(module)
  })
}
let router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      hidden: true,
      children: [
        {
          path: '/',
          name: 'home',
          meta: {
            title: '首页'
          },
          component: Home
        }
      ]
    },
    {
      path: '/401',
      name: '401',
      meta: {
        title: '401'
      },
      component: error401
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 判断环境
  let isIhaier = /Lark/.test(navigator.userAgent)
  localStorage.setItem('client_userAgent', isIhaier)
  debugger
  if (to.name === '401' && to.query.code) {
    next({
      path: '/'
    })
  }
  if (getStore('clientPmpToken') || to.name === '401') {
    debugger
    // token存在或者401路由无权限，可直接访问
    next()
  } else {
    if (config.openUserCenter) {
      // 账户中心对接开启，进行集团账户对接
      checkIsLogin().then(() => {
        // if (isIhaier) {
        //   if (to.name === 'home' && getStore('todoCenterPageInfo')) {
        //     let obj = JSON.parse(getStore('todoCenterPageInfo'))
        //     next({
        //       path: obj.path,
        //       query: obj.query
        //     })
        //     location.reload()
        //     removeStore('todoCenterPageInfo')
        //   } else {
        //     next()
        //   }
        // } else {
        //   next()
        // }
        next()
      }, () => {
        next({
          path: '/401'
        })
      })
    } else {
      next()
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
})


export default router
