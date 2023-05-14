import request from '@/utils/request'

export function modelList(params) {
  return request({
    url: '/model/list',
    method: 'get',
    data: params
  })
}

export function modelTestWhite(data) {
  return request({
    url: '/model/white',
    method: 'post',
    data: data
  })
}
