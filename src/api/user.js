import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/getRouters',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/user/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/user/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/sys/user/del',
    method: 'post',
    data
  })
}

export function getDataList(params) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: params
  })
}

export function exportExcel(params) {
  return request({
    url: '/sys/user/export',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export function getUserInfo(id) {
  return request({
    url: '/sys/user/info/' + id,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
