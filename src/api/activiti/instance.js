import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/activity/instance/list',
    method: 'post',
  })
}

export function deleteInstance(data) {
    return request({
      url: `/activity/instance`,
      method: 'delete',
      data
    })
  }
  