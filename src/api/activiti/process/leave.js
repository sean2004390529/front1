import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/activity/process/leave',
    method: 'post',
    data
  })
}

// export function clear() {
//   return request({
//     url: '/activity/deployment/clear',
//     method: 'get'
//   })
// }

// export function deleteDeployment(data) {
//   return request({
//     url: '/activity/deployment',
//     method: 'delete',
//     data
//   })
// }