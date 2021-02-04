import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/basic/emp/list',
    method: 'post',
    data
  })
}

export function createEmp(data) {
  return request({
    url: '/basic/emp',
    method: 'post',
    data
  })
}

export function updateEmp(data) {
  return request({
    url: '/basic/emp',
    method: 'put',
    data
  })
}

export function deleteEmp(data) {
  return request({
    url: `/basic/emp/`,
    method: 'delete',
    data
  })
}

export function fetchsubDeptEmp(deptId) {
  return request({
    url: `/basic/emp/${deptId}`,
    method: 'get'
  })
}