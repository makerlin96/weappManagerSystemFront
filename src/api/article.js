import request from '@/utils/request'

export function getDataList(params) {
  return request({
    url: '/cms/article/list',
    method: 'get',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/cms/article/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/cms/article/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/cms/article/del',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/cms/article/info/' + id,
    method: 'get'
  })
}
