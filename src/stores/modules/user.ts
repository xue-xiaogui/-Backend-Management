import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from '@/utils/token'
import { login } from '@/api/login'

declare interface UserModuleType {
  token: string | boolean
  username: string
  fileUrl: string
}

export const useUserStore = defineStore('user', {
  state: (): UserModuleType => ({
    token: getToken() as string,
    username: 'miya',
    fileUrl: '',
  }),
  getters: {
    getToken: (state) => state.token
  },
  actions: {
    /**
     * @description 设置token
     * @param {*} token
     */
    setToken(token: string) {
      this.token = token
    },
    /**
     * @description 设置用户名
     * @param {*} username
     */
    setUsername(username: string) {
      this.username = username
    },
    /**
     * @description 重置token、roles、permission、router、tabsBar等
     */
    async logout() {
      // await logout()
      await this.resetAll()
      // 解决横向布局退出登录显示不全的bug
      location.reload()
    },
    async resetAll() {
      removeToken()
    },

    async login(userInfo: any) {
      const {
        data: { token },
      } = await login(userInfo)
      setToken(token, 1)
    },
  }
})