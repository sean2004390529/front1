import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/project/overall/list',
    method: 'post',
    data
  })
}

export function createOverall(data) {
  return request({
    url: '/project/overall',
    method: 'post',
    data
  })
}

export function updateOverall(data) {
  return request({
    url: '/project/overall',
    method: 'put',
    data
  })
}

export function deleteOverall(data) {
  return request({
    url: '/project/overall',
    method: 'delete',
    data
  })
}

export function fetchUnfinish() {
  return request({
    url: '/project/overall/unfinish',
    method: 'get',
  })
}