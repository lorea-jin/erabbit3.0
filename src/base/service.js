// 请求工具
// 创建实例，拦截，返回

import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

const service = axios.create({
  baseURL,
  timeout: 5000
})

service.interceptors.request.use(config => {
  // 如果vuex中有profile这个字段，那么就是登录了，增加token
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(config => config.data, err => {
  // 401部分: 清空信息token,跳转登录页,并带上来的页面路径作为参数

  if (err.response && err.response.state === 401) {
    store.commit('user/setUser', {})
    const fullPath = encodeURIComponent(router.currentRoute.fullPath.value)
    router.push('/login?redirectUrl=' + fullPath)
  }

  return Promise.reject(err)
})

export default (url, method, submitData) => {
  return service({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
