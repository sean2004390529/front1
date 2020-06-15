import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/basic',
    component: Layout,
    redirect: '/basic/user',
    meta: { title: '后台管理', icon: 'edit', roles: ['admin'] },
    children: [
      {
        path: '/basic/user',
        name: '用户管理',
        component: () => import('@/views/basic/user'),
        meta: { title: '用户管理', icon: 'user', roles: ['admin'] }
      },
      {
        path: '/basic/role',
        name: '角色管理',
        component: () => import('@/views/basic/role'),
        meta: { title: '角色管理', icon: 'guide', roles: ['admin'] }
      }
    ]
  },
  {
    path: 'https://www.baidu.com',
    component: Layout,
    meta: { title: '链接', icon: 'link' }
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router