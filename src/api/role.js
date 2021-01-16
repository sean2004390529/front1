import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/auth/role/list',
    method: 'post',
    data
  })
}

export function createRole(data) {
  return request({
    url: '/auth/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/auth/role',
    method: 'put',
    data
  })
}


export function deleteRoles(data) {
  return request({
    url: '/auth/role',
    method: 'delete',
    data
  })
}
