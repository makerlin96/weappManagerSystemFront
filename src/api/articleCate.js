import request from '@/utils/request'

export function getDataList(params) {
  return request({
    url: '/cms/cate/list',
    method: 'get',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/cms/cate/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/cms/cate/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/cms/cate/del',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/cms/cate/info/' + id,
    method: 'get'
  })
}
