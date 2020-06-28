import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/dept/list',
    method: 'post'
  })
}

export function fetchAllDept() {
  return request({
    url: '/dept/alllist',
    method: 'get'
  })
}

export function createDept(data) {
  return request({
    url: '/dept',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/dept',
    method: 'put',
    data
  })
}
