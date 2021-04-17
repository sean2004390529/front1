import request from '@/utils/request'

export function fetchAbsentHistory(data) {
  return request({
    url: '/act/process/absent/history',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/act/process/absent',
    method: 'post',
    data
  })
}

export function approveAbsentRequest(data) {
  return request({
    url: '/act/process/absent/approve',
    method: 'post',
    data
  })
}

export function returnAbsentRequest(data) {
  return request({
    url: '/act/process/absent/return',
    method: 'post',
    data
  })
}

export function rejectAbsentRequest(data) {
  return request({
    url: '/act/process/absent/reject',
    method: 'post',
    data
  })
}

export function showAbsentInfo(absentId) {
  return request({
    url: `/act/process/absent/show/${absentId}`,
    method: 'get'
  })
}

