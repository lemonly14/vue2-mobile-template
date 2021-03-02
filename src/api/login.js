import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/account/mobile/login',
    method: 'post',
    data
  })
}

export function verifyCode(token) {
  return request({
    url: '/v1/account/verify_code',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/v1/account/logout',
    method: 'post'
  })
}
