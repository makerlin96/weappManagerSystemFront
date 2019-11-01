import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/job/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/job/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/sys/job/del',
    method: 'post',
    data
  })
}

export function getDataList(params) {
  return request({
    url: '/sys/job/list',
    method: 'get',
    params: params
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/job/info/' + id,
    method: 'get'
  })
}

export function run(id) {
  return request({
    url: '/sys/job/run/' + id,
    method: 'put'
  })
}

export function resume(id) {
  return request({
    url: '/sys/job/resume/' + id,
    method: 'put'
  })
}

export function pause(id) {
  return request({
    url: '/sys/job/pause/' + id,
    method: 'put'
  })
}
