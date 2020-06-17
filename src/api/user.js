import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function fetchList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function fetchRoles(userId) {
  return request({
    url: `/user/roles/${userId}`,
    method: 'get'
  })
}

export function updateRoles(data) {
  return request({
    url: '/user/roles',
    method: 'put',
    data
  })
}

export function deleteUsers(data) {
  return request({
    url: '/user',
    method: 'delete',
    data
  })
}
