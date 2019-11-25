import request from '@/utils/request';
export function getCommissionRate() {
  return request({
    url: '/settings/getCommissionRate',
    method: 'get'
  })
}

export function setCommissionRate(params) {
  return request({
    url: '/settings/setCommissionRate',
    method: 'post',
    params: params
  })
}
