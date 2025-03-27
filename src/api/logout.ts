import request from '@/utils/request'

export function logout() {
  return request({
    url: '/company/auth/logout',
    method: 'DELETE',
  })
}