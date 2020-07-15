import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/stock/purchase/list',
    method: 'post',
    data
  })
}

export function createPurchase(data) {
  return request({
    url: '/stock/purchase',
    method: 'post',
    data
  })
}

export function updatePurchase(data) {
  return request({
    url: '/stock/purchase',
    method: 'put',
    data
  })
}

export function deletePurchase(data) {
  return request({
    url: '/stock/purchase',
    method: 'delete',
    data
  })
}

export function fetchUnit() {
  return request({
    url: '/stock/unit',
    method: 'get'
  })
}
