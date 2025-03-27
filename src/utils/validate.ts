
/**
 * @description 判断是否是数组
 * @param arg
 */
export function isArray(arg: string | (string | number)[]) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}


/**
 * 判断给定的值是否为字符串类型。
 *
 * @param value 需要判断的值
 * @returns 如果给定的值为字符串类型，则返回 true；否则返回 false
 */
export function isString(value: any) {
  return typeof value === 'string' || value instanceof String
}
