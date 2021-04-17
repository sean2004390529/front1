import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/act/task/list',
    method: 'post',
  })
}