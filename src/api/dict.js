import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/dict/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/dict/edit',
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: '/sys/dict/del',
    method: 'post',
    data
  })
}

export function getDataList() {
  return request({
    url: '/sys/dict/list',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/dict/info/' + id,
    method: 'get'
  })
}

