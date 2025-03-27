/**
 * @description 导出网络配置
 **/
export default {
  baseURL: `'https://doujia-api.luerdog.com`,
  contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
  // 最长请求时间
  requestTimeout: 100000,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, '200', '0'],
  // 数据状态的字段名称
  statusName: 'code',
  // 状态信息的字段名称
  messageName: 'msg',
}
