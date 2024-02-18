import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
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
    /**
     * 48111 【SIT】【欧洲版二期】【PC】滚球页面，点击赛事详情，菜单导航显示错误
     * 48448 【SIT】【欧洲版二期】【PC】经常访问，足球，详情页面，没有菜单导航
     * 手动记录路由历史记录
     * 手动刷新以后同一路由会重复添加
     * */
    const historiesTool = window.sessionStorage.getItem('RouteHistory') ? JSON.parse(window.sessionStorage.getItem('RouteHistory')) : new Array()
    const routeData = new Object()
    routeData.name = to.name
    routeData.title = to.meta.title;
    routeData.i18n = to.meta.i18n;
    routeData.router = new Object()
    routeData.router.name = to.name;
    routeData.router.params = to.params;
    routeData.router.query = to.query;

    if( historiesTool.length ){
        if((historiesTool ?? []).length > 3) historiesTool.pop()
        if(to.name != historiesTool[0].name) historiesTool.unshift(routeData)
    }else {
        historiesTool.push(routeData)
    }
    window.sessionStorage.setItem('RouteHistory', JSON.stringify(historiesTool))
    next()

})

export default router