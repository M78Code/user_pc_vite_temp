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
