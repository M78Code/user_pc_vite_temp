
const routes = [
  {
    path: '/project/animation/index.html',
    component: () => import('project/animation/src/layouts/MainLayout.vue'),
    redirect: '/project/animation/index.html',
    children: [
      { 
        path: '/project/animation/index.html', 
        component: () => import('project/animation/src/pages/index.vue') 
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',

  component: () => import('project/animation/src/layouts/MainLayout.vue'),
  }
]

export default routes
