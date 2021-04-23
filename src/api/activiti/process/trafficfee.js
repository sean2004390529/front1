import request from '@/utils/request'

// export function fetchTrafficHistory(data) {
//   return request({
//     url: '/act/process/traffic/history',
//     method: 'post',
//     data
//   })
// }

export function batchSaveTempFee(data) {
  return request({
    url: '/act/process/trafficfee',
    method: 'post',
    data
  })
}

export function showTrafficfeeInfo(trafficId) {
  return request({
    url: `/act/process/trafficfee/show/${trafficId}`,
    method: 'get'
  })
}

