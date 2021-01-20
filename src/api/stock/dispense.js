import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/stock/dispense/list',
    method: 'post',
    data
  })
}

export function createDispense(data) {
  return request({
    url: '/stock/dispense',
    method: 'post',
    data
  })
}

export function updateDispense(data) {
  return request({
    url: '/stock/dispense',
    method: 'put',
    data
  })
}

export function deleteDispense(data) {
  return request({
    url: '/stock/dispense',
    method: 'delete',
    data
  })
}

export function fetchAllStaff() {
  return request({
    url: '/stock/staff/nopage',
    method: 'get'
  })
}
