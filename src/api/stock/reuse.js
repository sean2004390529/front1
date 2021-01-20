import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/stock/reuse/list',
    method: 'post',
    data
  })
}

export function createReuse(data) {
  return request({
    url: '/stock/reuse',
    method: 'post',
    data
  })
}

export function updateReuse(data) {
  return request({
    url: '/stock/reuse',
    method: 'put',
    data
  })
}

export function deleteReuse(data) {
  return request({
    url: '/stock/reuse',
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

export function fetchReuse() {
  return request({
    url: '/stock/reuse/instock',
    method: 'get'
  })
}
