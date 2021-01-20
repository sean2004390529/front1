import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/stock/borrow/list',
    method: 'post',
    data
  })
}

export function createBorrow(data) {
  return request({
    url: '/stock/borrow',
    method: 'post',
    data
  })
}

export function updateBorrow(data) {
  return request({
    url: '/stock/borrow',
    method: 'put',
    data
  })
}

export function deleteBorrow(data) {
  return request({
    url: '/stock/borrow',
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

export function fetchUnreturn() {
  return request({
    url: '/stock/borrow/unreturn',
    method: 'get'
  })
}
