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
        meta: { title: '角色管理', icon: 'peoples', roles: ['admin'] }
      },
      {
        path: '/basic/permission',
        name: '权限管理',
        component: () => import('@/views/basic/permission'),
        meta: { title: '权限管理', icon: 'tree-table', roles: ['admin'] }
      },
      {
        path: '/basic/dept',
        name: '部门管理',
        component: () => import('@/views/basic/dept'),
        meta: { title: '部门管理', icon: 'tree', roles: ['admin'] }
      },
      {
        path: '/basic/emp',
        name: '员工管理',
        component: () => import('@/views/basic/emp'),
        meta: { title: '员工管理', icon: 'people', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/todo',
    component: Layout,
    redirect: '/todo/todo',
    meta: { title: 'Todo', icon: 'list', roles: ['admin','todoRole'] },
    children: [
      {
        path: '/todo/todo',
        name: 'Todo待办',
        component: () => import('@/views/todo/todo'),
        meta: { title: 'Todo待办', icon: 'list' }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/overall',
    meta: { title: '项目管理', icon: 'skill', roles: ['admin','projectRole'] },
    children: [
      {
        path: '/project/overall',
        name: '项目总览',
        component: () => import('@/views/project/overall'),
        meta: { title: '项目总览', icon: 'skill' }
      },
      {
        path: '/project/demand',
        name: '项目进度',
        component: () => import('@/views/project/demand'),
        meta: { title: '项目进度', icon: 'skill' }
      }
    ]
  },
  {
    path: '/stock',
    component: Layout,
    redirect: '/stock/reuse',
    meta: { title: '物品管理', icon: 'table', roles: ['admin','stockRole'] },
    children: [
      {
        path: '/stock/staff',
        name: '使用人',
        component: () => import('@/views/stock/staff'),
        meta: { title: '使用人', icon: 'peoples' }
      },
      {
        path: '/stock/purchase',
        name: '购买记录',
        component: () => import('@/views/stock/purchase'),
        meta: { title: '购买记录', icon: 'shopping' }
      },
      {
        path: '/stock/disposable',
        name: '在库一次性物品',
        component: () => import('@/views/stock/disposable'),
        meta: { title: '在库一次性物品', icon: 'table' }
      },
      {
        path: '/stock/dispense',
        name: '一次性分发记录',
        component: () => import('@/views/stock/dispense'),
        meta: { title: '一次性分发记录', icon: 'table' }
      },
      {
        path: '/stock/reuse',
        name: '重复使用品',
        component: () => import('@/views/stock/reuse'),
        meta: { title: '重复使用品', icon: 'tab' }
      },
      {
        path: '/stock/borrow',
        name: '借用记录',
        component: () => import('@/views/stock/borrow'),
        meta: { title: '借用记录', icon: 'tab' }
      },
      {
        path: '/stock/common',
        name: '杂项',
        component: () => import('@/views/stock/common'),
        meta: { title: '杂项', icon: 'component' }
      }
    ]
  },
  {
    path: '/calendar',
    component: Layout,
    redirect: '/calendar',
    meta: { title: '日程管理', icon: 'component', roles: ['admin','calendarRole'] },
    children: [
      {
        path: 'calendar',
        component: () => import('@/views/calendar/index'),
        name: 'calendar',
        meta: { title: '日程管理', icon: 'component' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/process',
    meta: { title: '流程管理', icon: 'component', roles: ['admin','activiti_user'] },
    children: [
      {
        path: '/activity/activity',
        component: () => import('@/views/activity/deployment'),
        name: 'activity',
        meta: { title: '流程部署', icon: 'bug', roles: ['activiti_user'] }
      },
      {
        path: '/activity/process',
        meta: { title: '申请', icon: 'bug' },
        component: () => import('@/views/activity/process/index'),
        children: [
          {
            path: '/activity/process/leave',
            name: '请假申请',
            component: () => import('@/views/activity/process/leave'),
            meta: { title: '请假申请', icon: 'bug' }
          },
          {
            path: '/activity/process/OT',
            name: '加班申请',
            component: () => import('@/views/activity/process/ot'),
            meta: { title: '加班申请', icon: 'bug' }
          }
        ]
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
