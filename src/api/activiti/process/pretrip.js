import request from '@/utils/request'

export function fetchPretripHistory(data) {
  return request({
    url: '/act/process/pretrip/history',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/act/process/pretrip',
    method: 'post',
    data
  })
}

export function approvePretripRequest(data) {
  return request({
    url: '/act/process/pretrip/approve',
    method: 'post',
    data
  })
}

export function returnPretripRequest(data) {
  return request({
    url: '/act/process/pretrip/return',
    method: 'post',
    data
  })
}

export function rejectPretripRequest(data) {
  return request({
    url: '/act/process/pretrip/reject',
    method: 'post',
    data
  })
}

export function showPretripInfo(pretripId) {
  return request({
    url: `/act/process/pretrip/show/${pretripId}`,
    method: 'get'
  })
}

