import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  // withCredentials: true, // 跨域请求时发送cookie
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    const config = response.config
    // 二进制流处理
    if (config && config.responseType === 'blob') {
      return response
    }
    if (res.code === 401) {
      MessageBox.confirm('登录状态已过期，请您重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        location.reload()
      })
      return Promise.reject(new Error(res.msg || '系统异常'))
    } else {
      if (res.code === 200) {
        return res
      } else {
        Message({
          message: res.msg || '系统异常',
          type: 'error',
          duration: 2000
        })
      }
    }
  },
  error => {
    console.log('请求异常：' + error)
    Message({
      message: '请求异常',
      type: 'error',
      duration: 2000
    })
    return Promise.reject(error)
  }
)

export default service
