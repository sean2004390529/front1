import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/todo/todo/list',
    method: 'post',
    data
  })
}

export function createTodo(data) {
  return request({
    url: '/todo/todo',
    method: 'post',
    data
  })
}

export function updateTodo(data) {
  return request({
    url: '/todo/todo',
    method: 'put',
    data
  })
}

export function deleteTodo(data) {
  return request({
    url: '/todo/todo',
    method: 'delete',
    data
  })
}

