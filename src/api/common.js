import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/stock/common/units',
    method: 'post',
    data
  })
}

export function fetchUnit() {
  return request({
    url: '/stock/common/units/nopage',
    method: 'get'
  })
}

export function createUnit(data) {
  return request({
    url: '/stock/common/unit',
    method: 'post',
    data
  })
}

export function updateUnit(data) {
  return request({
    url: '/stock/common/unit',
    method: 'put',
    data
  })
}

export function deleteUnit(data) {
  return request({
    url: '/stock/common/unit',
    method: 'delete',
    data
  })
}

