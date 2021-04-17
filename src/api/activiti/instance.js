import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/act/instance/list',
    method: 'post',
    data
  })
}

export function deleteInstance(data) {
    return request({
      url: `/act/instance`,
      method: 'delete',
      data
    })
  }
  