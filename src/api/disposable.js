import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/stock/dispo/list',
    method: 'post',
    data
  })
}

export function createDisposable(data) {
  return request({
    url: '/stock/dispo',
    method: 'post',
    data
  })
}

export function updateDisposable(data) {
  return request({
    url: '/stock/dispo',
    method: 'put',
    data
  })
}

export function deleteDisposable(data) {
  return request({
    url: '/stock/dispo',
    method: 'delete',
    data
  })
}
