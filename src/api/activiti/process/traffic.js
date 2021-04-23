import request from '@/utils/request'

export function fetchTrafficHistory(data) {
  return request({
    url: '/act/process/traffic/history',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/act/process/traffic',
    method: 'post',
    data
  })
}

export function approveTrafficRequest(data) {
  return request({
    url: '/act/process/traffic/approve',
    method: 'post',
    data
  })
}

export function returnTrafficRequest(data) {
  return request({
    url: '/act/process/traffic/return',
    method: 'post',
    data
  })
}

export function rejectTrafficRequest(data) {
  return request({
    url: '/act/process/traffic/reject',
    method: 'post',
    data
  })
}

export function showTrafficInfo(trafficId) {
  return request({
    url: `/act/process/traffic/show/${trafficId}`,
    method: 'get'
  })
}

