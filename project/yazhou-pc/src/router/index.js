import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import routes from "./routes"

const router = createRouter({ 
  history: createWebHashHistory(),  // hash 模式
  // history: createWebHistory(),  // history 模式
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next)=>{
  // console.log(to, from)
  if (to.meta.title) {
    document.title = `${to.meta.title}`;
  }
  next()
})

router.afterEach((to, from)=>{
  // console.log(to, from)
  console.log('afterEach')
})

export default router