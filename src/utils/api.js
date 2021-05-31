import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
import { myLocalSetItem, myLocalGetItem } from './mystorage'
// import Vue from 'vue'

// axios.defaults.headers.post['Content-type'] = 'application/json'
// 后台接口 'http://localhost:8081/echarge'
// axios.defaults.baseURL = 'https://t01.shangquanshow.com/echarge'
// 'http://localhost:9092/echarge'
const base_url = process.env.HOST
// console.log(process.env)
// console.log(base_url)
axios.defaults.baseURL = base_url

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(function(config) {
  // Do something before request is sent
  // window.localStorage.getItem("accessToken") 获取token的value
  // localStorage.getItem('token')
  // console.log(Vue.prototype.BASE_URL)
  const token = myLocalGetItem('token')
  if (token) {
    // 将token放到请求头发送给服务器,将tokenkey放在请求头中
    config.headers.Authorization = token
    // 也可以这种写法
    // config.headers['accessToken'] = Token;
  }
  config.timeout = 30000
  return config
}, function(error) {
  // Do something with request error
  return Promise.reject(error)
}
)

axios.interceptors.response.use(
  success => {
    if (success.status && success.status === 200 && success.data.code === 500) {
      Message.error({ message: success.data.msg })
      return
    }
    const token = success.headers.token
    if (token) {
      // 将token放到请求头发送给服务器,将tokenkey放在请求头中
      // localStorage.setItem('token', token)
      myLocalSetItem('token', token, 3600)
      // 也可以这种写法
      // config.headers['accessToken'] = Token;
    }
    return success.data
  },
  error => {
    console.log(error.response)
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error({ message: '服务器被吃了( ╯□╰ )' })
    } else if (error.response.status === 500) {
      Message.error({ message: error.response.data.msg })
    } else if (error.response.status === 400) {
      Message.error({ message: 'bad reques or invalid hostname' })
    } else if (error.response.status === 403) {
      Message.error({ message: '权限不足，请联系管理员' })
    } else if (error.response.status === 401) {
      Message.error({ message: '尚未登录，请登录' })
      router.replace('/')
    } else {
      Message.error({ message: error.response.data.msg })
    }
    return
  }
)

const base = ''

export const postKeyValueRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function(data) {
      let ret = ''
      for (const i in data) {
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
