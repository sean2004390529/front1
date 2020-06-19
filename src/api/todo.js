import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/todo/list',
    method: 'post',
    data
  })
}

export function createTodo(data) {
  return request({
    url: '/todo',
    method: 'post',
    data
  })
}

export function updateTodo(data) {
  return request({
    url: '/todo',
    method: 'put',
    data
  })
}

export function deleteTodo(data) {
  return request({
    url: '/todo',
    method: 'delete',
    data
  })
}

