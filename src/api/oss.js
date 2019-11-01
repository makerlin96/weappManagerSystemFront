import request from '@/utils/request'

export function getDataList(params) {
  return request({
    url: '/sys/oss/list',
    method: 'get',
    params: params
  })
}

export function del(data) {
  return request({
    url: '/sys/oss/del',
    method: 'post',
    data
  })
}
