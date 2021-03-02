import request from '@/utils/request'

export function login(data) {
  const clientId = 'nginx'
  const clientSecret = 'nginx'
  const tokenBase64 = "Basic " + Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')
  const username = data.username
  const password = data.password

  return request({
    url: `/auth/login?username=${username}&password=${password}`,
    method: 'post',
    headers:{
      Authorization: tokenBase64
    },
    data
  })
}

export function loginOauth(data) {
  const clientId = 'nginx'
  const clientSecret = 'nginx'
  const tokenBase64 = "Basic " + Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')
  const username = data.username
  const password = data.password

  return request({
    url: `/auth/oauth/token?grant_type=password&scope=all&username=${username}&password=${password}`,
    // url: `/auth/oauth/token?grant_type=password&scope=all`,
    method: 'post',
    headers:{
      Authorization: tokenBase64
    }
    // data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/user/logout',
    method: 'post'
  })
}

export function fetchList(data) {
  return request({
    url: '/auth/user/list',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/auth/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/auth/user',
    method: 'put',
    data
  })
}

export function deleteUsers(data) {
  return request({
    url: '/auth/user',
    method: 'delete',
    data
  })
}
