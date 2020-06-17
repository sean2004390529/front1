import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/role/list',
    method: 'post',
    data
  })
}

export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}

export function deleteRoles(data) {
  return request({
    url: '/role',
    method: 'delete',
    data
  })
}
