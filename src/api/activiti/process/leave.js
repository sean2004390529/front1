import request from '@/utils/request'

export function fetchLeaveHistory(data) {
  return request({
    url: '/act/process/leave/history',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/act/process/leave',
    method: 'post',
    data
  })
}

export function approveLeaveRequest(data) {
  return request({
    url: '/act/process/leave/approve',
    method: 'post',
    data
  })
}

export function returnLeaveRequest(data) {
  return request({
    url: '/act/process/leave/return',
    method: 'post',
    data
  })
}

export function rejectLeaveRequest(data) {
  return request({
    url: '/act/process/leave/reject',
    method: 'post',
    data
  })
}

export function showLeaveInfo(leaveId) {
  return request({
    url: `/act/process/leave/show/${leaveId}`,
    method: 'get'
  })
}

