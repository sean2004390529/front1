import request from '@/utils/request'

export function fetchLateHistory(data) {
  return request({
    url: '/act/process/late/history',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/act/process/late',
    method: 'post',
    data
  })
}

export function approveLateRequest(data) {
  return request({
    url: '/act/process/late/approve',
    method: 'post',
    data
  })
}

export function returnLateRequest(data) {
  return request({
    url: '/act/process/late/return',
    method: 'post',
    data
  })
}

export function rejectLateRequest(data) {
  return request({
    url: '/act/process/late/reject',
    method: 'post',
    data
  })
}

export function showLateInfo(lateId) {
  return request({
    url: `/act/process/late/show/${lateId}`,
    method: 'get'
  })
}

