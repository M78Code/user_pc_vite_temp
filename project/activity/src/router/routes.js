
const routes = [
  {
    path: '/project/activity/index.html',
    component: () => import('project/activity/src/layouts/MainLayout.vue'),
    redirect: '',
    children: [
      { path: '', component: () => import('project/activity/src/pages/IndexPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('project/activity/src/pages/ErrorNotFound.vue')
  }
]

export default routes
