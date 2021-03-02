import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/auth/permission/list',
    method: 'post',
    data
  })
}

export function createPermission(data) {
  return request({
    url: '/auth/permission',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/auth/permission',
    method: 'put',
    data
  })
}


export function deletePermission(data) {
  return request({
    url: '/auth/permission',
    method: 'delete',
    data
  })
}

export function fetchAllPermission() {
  return request({
    url: '/auth/permission/fetchallpermission',
    method: 'get'
  })
}

export function fetchYourPermission(userId) {
  return request({
    url: `/auth/permission/yourPermission/${userId}`,
    method: 'get'
  })
}

export function updateYourPermission(data) {
  return request({
    url: '/auth/permission/updateyourpermission',
    method: 'post',
    data
  })
}