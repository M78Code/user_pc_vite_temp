/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-08-04 13:44:22
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-08-04 13:45:57
 * @FilePath       : \user-pc-vite\project\yazhou-pc\src\router\routes.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const routes = [
  {
    path: '/',
    component: () => import('src/yazhou-pc/src/pages/main_layout.vue'),
    redirect: '/home',
    children: [
    ]
  },

]

export default routes
