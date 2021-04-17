import request from '@/utils/request'

export function fetchOTHistory(data) {
  return request({
    url: '/act/process/ot/history',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/act/process/ot',
    method: 'post',
    data
  })
}

export function approveOTRequest(data) {
  return request({
    url: '/act/process/ot/approve',
    method: 'post',
    data
  })
}

export function returnOTRequest(data) {
  return request({
    url: '/act/process/ot/return',
    method: 'post',
    data
  })
}

export function rejectOTRequest(data) {
  return request({
    url: '/act/process/ot/reject',
    method: 'post',
    data
  })
}

export function showOTInfo(otId) {
  return request({
    url: `/act/process/ot/show/${otId}`,
    method: 'get'
  })
}

