import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/activity/task/list',
    method: 'post',
  })
}

export function approveRequest(data) {
  return request({
    url: '/activity/task',
    method: 'post',
    data
  })
}