import request from '@/utils/request'

export function getComment(instanceId) {
  return request({
    url: `/act/comment/list/${instanceId}`,
    method: 'get',
  })
}