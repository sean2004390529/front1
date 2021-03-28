import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/auth/corp/list',
    method: 'post',
    data
  })
}

export function createCorp(data) {
  return request({
    url: '/auth/corp',
    method: 'post',
    data
  })
}

export function updateCorp(data) {
  return request({
    url: '/auth/corp',
    method: 'put',
    data
  })
}


export function deleteCorp(data) {
  return request({
    url: '/auth/corp',
    method: 'delete',
    data
  })
}

export function loadCorpTableList() {
  return request({
    url: '/auth/corp/fetchallcorp',
    method: 'get'
  })
}