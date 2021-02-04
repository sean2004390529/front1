import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/basic/dept/list',
    method: 'post'
  })
}

export function createDept(data) {
  return request({
    url: '/basic/dept',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/basic/dept',
    method: 'put',
    data
  })
}

export function deleteDept(deptId) {
  return request({
    url: `/basic/dept/${deptId}`,
    method: 'delete',
  })
}

export function fetchDeptFlat() {
  return request({
    url: '/basic/dept/flat',
    method: 'get'
  })
}