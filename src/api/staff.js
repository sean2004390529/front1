import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/stock/staff/list',
    method: 'post',
    data
  })
}

export function createStaff(data) {
  return request({
    url: '/stock/staff',
    method: 'post',
    data
  })
}

export function updateStaff(data) {
  return request({
    url: '/stock/staff',
    method: 'put',
    data
  })
}

export function deleteStaff(data) {
  return request({
    url: '/stock/staff',
    method: 'delete',
    data
  })
}

export function fetchAllDept() {
  return request({
    url: '/depts',
    method: 'get'
  })
}