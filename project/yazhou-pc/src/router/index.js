/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-08-04 13:44:14
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-08-04 14:24:35
 * @FilePath       : \user-pc-vite\project\yazhou-pc\src\router\index.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
export default route(function (/* { store, ssrContext } */) {
  // const createHistory = '' ? createMemoryHistory : ('history' === 'history' ? createWebHistory : createWebHashHistory)
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory()
  })
  return Router
})
