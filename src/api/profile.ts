import request from '@/utils/request'

export function profile(data: any) {
  return request({
    url: '/company/auth/profile',
    method: 'post',
    data,
  })
}