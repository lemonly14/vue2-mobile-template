import axios from 'axios'
import { Dialog, Notify } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['x-auth-token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['x-auth-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response
    if (res.data.code !== 200) {
      Notify({
        message: res.data.msg || 'Error',
        type: 'warning',
        duration: 5 * 1000
      })
      if (res.data.code === 401) {
        // to re-login
        Dialog.confirm('您的登录已失效，请重新登录', 'Confirm logout', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.data.msg || 'Error'))
    } else {
      if (res.headers['x-auth-token']) {
        // 登录接口返回
        return res
      } else {
        // 普通接口返回
        return res.data
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Notify({
      message: error.message,
      type: 'danger',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
