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

export function fetchAllRole() {
  return request({
    url: '/auth/role/fetchallrole',
    method: 'get'
  })
}

export function fetchYourRole(userId) {
  return request({
    url: `/auth/role/yourrole/${userId}`,
    method: 'get'
  })
}

export function updateYourRole(data) {
  return request({
    url: '/auth/role/updateyourrole',
    method: 'post',
    data
  })
}