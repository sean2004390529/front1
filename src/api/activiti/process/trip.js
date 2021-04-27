import request from '@/utils/request'

export function fetchTripHistory(data) {
  return request({
    url: '/act/process/trip/history',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/act/process/trip',
    method: 'post',
    data
  })
}

export function approveTripRequest(data) {
  return request({
    url: '/act/process/trip/approve',
    method: 'post',
    data
  })
}

export function returnTripRequest(data) {
  return request({
    url: '/act/process/trip/return',
    method: 'post',
    data
  })
}

export function rejectTripRequest(data) {
  return request({
    url: '/act/process/trip/reject',
    method: 'post',
    data
  })
}

export function showTripInfo(tripId) {
  return request({
    url: `/act/process/trip/show/${tripId}`,
    method: 'get'
  })
}

