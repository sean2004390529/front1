import request from '@/utils/request'

export function fetchList(projectId) {
  return request({
    url: `/project/demand/${projectId}`,
    method: 'get',
  })
}


export function createDemand(data) {
  return request({
    url: '/project/demand',
    method: 'post',
    data
  })
}

export function updateDemand(data) {
  return request({
    url: '/project/demand',
    method: 'put',
    data
  })
}

export function deleteDemand(data) {
  return request({
    url: '/project/demand',
    method: 'delete',
    data
  })
}

