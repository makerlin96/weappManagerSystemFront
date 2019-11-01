import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/cms/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
