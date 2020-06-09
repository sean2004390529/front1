import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // 如果路由有meta属性，且有meta.roles
  if (route.meta && route.meta.roles) {
    // 遍历roles中，是否包括该role
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 如果没写route.meta或route.meta.roles,则表示没有role限制，返回true
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // 遍历
  routes.forEach(route => {
    const tmp = { ...route }  //浅拷贝
    if (hasPermission(roles, tmp)) { //校验是否有权限，如果返回false则跳出，true则继续遍历children
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
    state.routes = constantRoutes.concat(routes) //合并constantRoutes与accessedRoutes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 如果roles中包括admin,则可以访问所有asyncRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
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
