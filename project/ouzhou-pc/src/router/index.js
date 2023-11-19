import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from "./routes"
const router = createRouter({
  history: createWebHashHistory(),  // hash 模式
  // history: createWebHistory(),  // history 模式
  routes: routes,
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 没有路由 跳转到首页
  if (!to.name) {
    return next('/home')
  }
  if (to.meta.title) {
    document.title = `${to.meta.title}`;
  }
  next()
})

export default router