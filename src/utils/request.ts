import axios from 'axios';
import qs from 'qs'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user'
import { logout } from '@/api/logout'
import { isArray } from '@/utils/validate'
import state from '@/config';

const messageName = state.messageName
const statusName = state.statusName
const successCode = state.successCode
const debounce = state.debounce

import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { getToken } from '@/utils/token'
import { ElNotification } from 'element-plus';


// 定义业务错误结构
interface BusinessError {
  code: number;
  message: string;
  data?: any;
}

// 扩展请求配置
interface RequestConfig extends AxiosRequestConfig {
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟时间
  enableCancel?: boolean; // 是否启用取消
  showLoading?: boolean; // 是否显示loading
}

let loadingInstance: any;

// 定义响应结构
interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

const router = useRouter();

// 操作正常Code数组
const codeVerificationArray = isArray(successCode)
  ? [...successCode]
  : [...[successCode]]

const CODE_MESSAGE: any = {
  200: '服务器成功返回请求数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队(异步任务)',
  204: '删除数据成功',
  400: '发出信息有误',
  401: '用户没有权限(令牌失效、用户名、密码错误、登录过期)',
  402: '令牌过期',
  403: '用户得到授权，但是访问是被禁止的',
  404: '访问资源不存在',
  406: '请求格式不可得',
  410: '请求资源被永久删除，且不会被看到',
  500: '服务器发生错误',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
}

const instance = axios.create({
  baseURL: 'https://doujia-api.luerdog.com/api',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
})

let pendingRequests: Map<string, AbortController> = new Map();
/**
 * 刷新刷新令牌
 */
// const tryRefreshToken = async (config: any) => {
//   if (!refreshToking) {
//     refreshToking = true
//     try {
//       const {
//         data: { token },
//         // 模拟刷新token接口返回的格式
//       }: any = await refreshToken()
//       if (token) {
//         const { setToken } = useUserStore()
//         setToken(token)
//         // 已经刷新了token，将所有队列中的请求进行重试
//         requests.forEach((cb: any) => cb(token))
//         requests = []
//         return instance(requestConf(config))
//       }
//     } catch (error) {
//       router.push({ path: '/login', replace: true }).then(() => { })
//     } finally {
//       refreshToking = false
//     }
//   } else {
//     return new Promise((resolve) => {
//       // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
//       requests.push(() => {
//         resolve(instance(requestConf(config)))
//       })
//     })
//   }
// }

// 响应拦截器
const handleData = async (response: any) => {
  const { config, data, status, statusText } = response
  console.log(response, 'response');
  const { resetAll } = useUserStore()
  if (loadingInstance) loadingInstance.close()
  // 若data.code存在，覆盖默认code
  let code = data && data[statusName] ? data[statusName] : status
  // 若code属于操作正常code，则status修改为200
  if (codeVerificationArray.indexOf(data[statusName]) + 1) code = 200
  switch (code) {
    case 10000:
      // localStorage.setItem('miya-admin-token', data.data.token)
      if (data.code === 10000) {
        return response
      } else if (data.code === 10001) {
        ElNotification({
          title: 'Error',
          message: data.errors || '登陆失败请重新登录！',
          type: 'error',
        })
        return { msg: data.errors, code: 10001 }
      }
      return data
    case 401:
      logout()
      router.push({ path: '/login', replace: true }).then(() => {
        resetAll().then(() => { })
      })
      break
    case 402:
      return await tryRefreshToken(config)
    case 403:
      router.push({ path: '/403' }).then(() => { })
      break
  }
  // 异常处理
  // 若data.msg存在，覆盖默认提醒消息
  const errMsg = `${data && data[messageName]
    ? data[messageName]
    : CODE_MESSAGE[code]
      ? CODE_MESSAGE[code]
      : statusText
    }`
  // 是否显示高亮错误(与errorHandler钩子触发逻辑一致)
  // gp.$baseMessage(errMsg, 'error', 'vab-hey-message-error', false)
  // if (needErrorLog())
  //   addErrorLog({ message: errMsg, stack: data, isRequest: true })
  return Promise.reject(data)
}

// 请求拦截器
const requestConf: any = (config: any) => {
  const token: any = getToken()// 添加认证token
  console.log(token, 'token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Content-Encoding'] = 'gzip'
  }


  // 处理取消请求
  if (config.enableCancel) {
    const controller = new AbortController();
    config.signal = controller.signal;
    const requestKey = generateRequestKey(config);
    pendingRequests.set(requestKey, controller);
  }

  if (
    config.data &&
    config.headers['Content-Type'] ===
    'application/x-www-form-urlencoded;charset=UTF-8'
  )
    config.data = qs.stringify(config.data)
  if (debounce.some((item: any) => config.url.includes(item)))
    // 加载Loding
    loadingInstance = alert('加载中...')
  return config
}

// 请求拦截器
instance.interceptors.request.use(requestConf, (error) => {
  return Promise.reject(error)
})

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response } = error
    if (response === undefined) {
      if (loadingInstance) loadingInstance.close()
      // 消息弹框
      alert('连接后台接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等，请联系管理员排查后端接口问题 ');
      // gp.$baseMessage(
      //   '连接后台接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等，请联系管理员排查后端接口问题 ',
      //   'error',
      //   'vab-hey-message-error',
      //   false
      // )
      return {}
    } else return handleData(response)
  }
)

// 生成请求唯一标识
function generateRequestKey(config: AxiosRequestConfig): string {
  return [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&');
}

export default instance
function tryRefreshToken(config: any) {
  throw new Error('Function not implemented.');
}

