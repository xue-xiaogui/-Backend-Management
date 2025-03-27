import request from '@/utils/request'

export async function login(data: any) {
  // 如果定义了loginRSA，则对数据进行加密
  // if (loginRSA) {
  //   // 对数据进行加密
  //   data = await encryptedData(data)
  // }
  // 发起请求
  return request({
    // 请求的URL
    url: '/company/auth/login',
    // 请求的方法
    method: 'post',
    // 请求的数据
    data,
  })
}
