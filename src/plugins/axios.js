import axios from 'axios'
import { Notify } from 'vant'
import Cookies from 'js-cookie'
import router from '../router'

let baseURL = ''
console.log(process.env.NODE_ENV);
// 根据环境设置 baseURL
switch (process.env.NODE_ENV) {
  case 'dev':
    baseURL = 'https://beautybond.cdhnf.cn/wx'
    break
  case 'dev-local':
    baseURL = 'https://beautybond-dev.cdhnf.cn/wx'
    break
  case 'test':
    baseURL = 'https://beautybond-uat.cdhnf.cn/wx'
    break
  case 'production':
    baseURL = 'https://production.cdhnf.cn/wx'
    break
  // case 'development':
  //   baseURL = 'http://139.196.206.94'
  //       break
  default:
    baseURL = '/ss'
}

const http = axios.create({
  baseURL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

http.defaults.retry = 3 // 重试次数
http.defaults.retryDelay = 2000 // 重试延时
http.defaults.shouldRetry = err => !err.response

// 添加请求拦截器
http.interceptors.request.use(
  // 请求前
  config => {
    // 如果登陆了则为 headers 添加 token 信息
    if (Cookies.getJSON('user')) {
      const { headers } = config
      headers.accessToken = Cookies.getJSON('user').token
    }

    return config
  },
  // 错误
  error => Promise.reject(error)
)

// 响应拦截
/* eslint-disable */
http.interceptors.response.use(
  res => {
    if (res.status >= 200 && res.status < 300) return res.data

    return Promise.reject({
      response: res
    })
  },
  err => {
    console.log(err)
    const { config, response } = err

    // 返回状态码 401 时代表未登录
    if (response.status === 401) {
      router.replace(`/login?url=${escape(router.currentRoute.fullPath)}`)

      Notify({
        message: '请登录',
        duration: 3000,
        background: '#1989fa'
      })

      return Promise.reject(err)
    }

    // 如果没有重试，提示错误信息
    if (!config.__retryCount) {
      Notify({
        message: '服务器错误',
        duration: 3000,
        background: '#f5222d'
      })
    }

    // 判断是否配置了重试
    if (!config || !config.retry) return Promise.reject(err)

    if (!config.shouldRetry || typeof config.shouldRetry !== 'function') {
      return Promise.reject(err)
    }

    // 判断是否满足重试条件
    if (!config.shouldRetry(err)) {
      return Promise.reject(err)
    }

    // 设置重置次数，默认为0
    config.__retryCount = config.__retryCount || 0

    // 判断是否超过了重试次数
    if (config.__retryCount >= config.retry) {
      return Promise.reject(err)
    }

    // 重试次数自增
    config.__retryCount += 1

    // 延时处理，每次都增长
    const backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, config.retryDelay * config.__retryCount)
    })

    // 重新发起axios请求
    return backoff.then(() => http(Object.assign({}, config, { baseURL: '' })))
  }
  /* eslint-enable */
)

export default http
