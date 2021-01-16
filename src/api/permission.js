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
