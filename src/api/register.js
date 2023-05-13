import request from '@/utils/request'

// 在注册时根据邮箱名获取验证码
export function getEmailCode(email) {
  return request({
    url: '/user/register/getEmailCode',
    method: 'post',
    data: { 'email': email }
  })
}

// 提交注册
export function register(code, data) {
  return request({
    url: '/user/register?code=' + code,
    method: 'post',
    data: data
  })
}
