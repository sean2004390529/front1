import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/act/deploy/list',
    method: 'post'
  })
}

export function clear() {
  return request({
    url: '/act/deploy/clear',
    method: 'get'
  })
}

export function deleteDeployment(data) {
  return request({
    url: '/act/deploy',
    method: 'delete',
    data
  })
}

export function getDefinition(deploymentId) {
  return request({
    url: `/act/deploy/${deploymentId}`,
    method: 'get'
  })
}

// export function enableLeave() {
//   return request({
//     url: '/act/deploy/enableleave',
//     method: 'post',
//   })
// }