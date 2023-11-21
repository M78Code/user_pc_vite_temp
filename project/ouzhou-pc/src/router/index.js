import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from "./routes"
const router = createRouter({
  history: createWebHashHistory(),  // hash 模式
  // history: createWebHistory(),  // history 模式
  routes: routes,
})

// 全局路由守卫
/**
 *
 * */
router.beforeEach((to, from, next) => {
  // 没有路由 跳转到首页
  if (!to.name) {
    return next('/home')
  }
  if (to.meta.title) {
    document.title = `${to.meta.title}`;
  }

  /**
   * bug单  48111 【SIT】【欧洲版二期】【PC】滚球页面，点击赛事详情，菜单导航显示错误
   * 手动记录路由历史记录
   * */
  const historiesTool = window.sessionStorage.getItem('RouteHistory') ? JSON.parse(window.sessionStorage.getItem('RouteHistory')) : new Array()
  const routeData = new Object()
  routeData.name = to.name
  routeData.title = to.meta.title;
  routeData.router = new Object()
  routeData.router.name = to.name;
  routeData.router.params = to.params;
  routeData.router.query = to.query;

  if( !!historiesTool && (historiesTool ?? []).length >= 10){
    historiesTool.pop()
  }
  historiesTool.unshift(routeData)

  window.sessionStorage.setItem('RouteHistory',JSON.stringify(historiesTool))
  console.log(historiesTool,"RouteHistory")
  console.log(to,"RouteHistory")

  next()
})

export default router