import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/activity/deployment/list',
    method: 'post',
  })
}

export function clear() {
  return request({
    url: '/activity/deployment/clear',
    method: 'get'
  })
}

export function deleteDeployment(data) {
  return request({
    url: '/activity/deployment',
    method: 'delete',
    data
  })
}

