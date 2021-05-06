import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/calendar/calendar/list',
    method: 'get',
  })
}

export function createEvent(data) {
  return request({
    url: '/calendar/calendar',
    method: 'post',
    data
  })
}

export function updateEvent(data) {
  return request({
    url: '/calendar/calendar',
    method: 'put',
    data
  })
}

export function deleteEvent(data) {
  return request({
    url: '/calendar/calendar',
    method: 'delete',
    data
  })
}

export function queryEmpCalendar(data) {
  return request({
    url: '/calendar/calendar/queryEmpCalendar',
    method: 'post',
    data
  })
}

export function changeColor(data) {
  return request({
    url: `/calendar/calendar/changecolor`,
    method: 'post',
    data
  })
}

export function updateFromPretrip(data) {
  return request({
    url: '/calendar/calendar/updateFromPretrip',
    method: 'post',
    data
  })
}