import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/basic/emp/list',
    method: 'post',
    data
  })
}

export function createEmp(data) {
  return request({
    url: '/basic/emp',
    method: 'post',
    data
  })
}

export function updateEmp(data) {
  return request({
    url: '/basic/emp',
    method: 'put',
    data
  })
}

export function deleteEmp(data) {
  return request({
    url: `/basic/emp/`,
    method: 'delete',
    data
  })
}

export function fetchsubDeptEmp(deptId) {
  return request({
    url: `/basic/emp/${deptId}`,
    method: 'get'
  })
}

export function fetchManagerEmp() {
  return request({
    url: `/basic/emp/manager`,
    method: 'get'
  })
}

export function fetchMemberEmp() {
  return request({
    url: `/basic/emp/member`,
    method: 'get'
  })
}

export function loadEmpList(corpCode) {
  return request({
    url: `/basic/emp/corp/${corpCode}`,
    method: 'get'
  })
}

// fetchEmpColor
export function fetchEmpColor() {
  return request({
    url: '/basic/emp/color/',
    method: 'get'
  })
}

// fetchEmpColor
export function fetchOtherEmpColor(empName) {
  return request({
    url: `/basic/emp/color/other/${empName}`,
    method: 'get'
  })
}


export function fetchYourself() {
  return request({
    url: '/basic/emp/yourself',
    method: 'get'
  })
}