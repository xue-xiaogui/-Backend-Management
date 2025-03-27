import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/token'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/index',
    component: () => import('@/views/index/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(''),
  routes
})

router.beforeEach(
  async (to: { path: string; fullPath: string }, from: any, next: any) => {
    let token: string | undefined | null
    console.log('-------------------------------');
    token = getToken()
    let hasToken = token
    if (hasToken) {
      if (routes.length) {
        // 禁止已登录用户返回登录页
        if (to.path === '/login') {
          next({ path: '/index' })
        } else next()
      } else {
        next()
      }
    } else {
      if (to.path === '/login') {
        next()
      } else next('/login')
    }
  }
)

router.afterEach((to) => {
  console.log('=============================');

  // 页面标题
  document.title = `${to.meta.title} | 默认标题`
  // 滚动到页面顶部
  window.scrollTo(0, 0)
  // 关闭所有弹出层
  // store.commit('closeAllPopups')

  // 统计访问
  // if (process.env.NODE_ENV === 'production') {
  //   analytics.trackPageView(to.path)
  // }
})

export default router
