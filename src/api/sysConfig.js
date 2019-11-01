import request from '@/utils/request'
export function getSysConfigInfo() {
  return request({
    url: '/sys/config/sys',
    method: 'get'
  })
}
