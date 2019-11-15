import request from '@/utils/request'
export function getGoods(params) {
  return request({
    url: '/goods/getGoods',
    method: 'post',
    params: params
  })
}

export function getCats() {
  return request({
    url: '/goods/getCats',
    method: 'post'
  })
}
