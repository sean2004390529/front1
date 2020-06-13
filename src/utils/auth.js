import Cookies from 'js-cookie'

const TokenKey = 'authorization'
const RefreshTokey = 'refreshToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRefreshToken(refreshToken){
  return Cookies.set(RefreshTokey, refreshToken)
}