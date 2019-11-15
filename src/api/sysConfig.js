import request from '@/utils/request'
export function getSysConfigInfo() {
  return request({
    url: '/sys/config/sys',
    method: 'get'
  })
}
export function jinbaoConfigSubmit(data) {
  return request({
    url: '/sys/config/jinbao',
    method: 'post',
    data
  })
}
