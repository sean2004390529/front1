import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/act/specialemp/list',
    method: 'post'
  })
}

export function fecthSpecialemp(code) {
  return request({
    url: `/act/specialemp/${code}`,
    method: 'get'
  })
}

export function createEmp(data) {
  return request({
    url: '/act/specialemp',
    method: 'post',
    data
  })
}

export function updateEmp(data) {
  return request({
    url: '/act/specialemp',
    method: 'put',
    data
  })
}

export function deleteEmp(data) {
  return request({
    url: '/act/specialemp',
    method: 'delete',
    data
  })
}

