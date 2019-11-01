import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/permission/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/permission/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/sys/permission/del',
    method: 'post',
    data
  })
}

export function getDataList() {
  return request({
    url: '/sys/permission/list',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/permission/info/' + id,
    method: 'get'
  })
}
