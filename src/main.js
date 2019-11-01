import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS重置的现代替代方案

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 全局 css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // 权限控制
import './utils/error-log' // 错误日志
import './directive/permission/index'
import * as filters from './filters' // 全局过滤器

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // 设置 element-ui 默认字体大小
})

// 注册全局filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
