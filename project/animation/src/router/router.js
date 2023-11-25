import { defineAsyncComponent } from "vue";
const routes = [
  // 主框架
  {
    path: "/",
    name: "main_layout",
    redirect: {
      name: "home",
    },
    component: () => import('../layouts/main-layout1.vue'),
    children: [
      //       // 首页
      {
        path: "/home",
        name: "home",
        component: () => import('../pages/match-list/match-list.vue'),
        meta: {
          keepAlive: true, // 需要缓存
        },
      },
      //       // 首页
      {
        path: "/bet",
        name: "bet",
        component: () => import('../pages/test/index.vue'),
        meta: {
          keepAlive: true, // 需要缓存
        },
      },
      //       // 搜索
      //       {
      //         path: "/search/:keyword/:time?",
      //         name: "search",
      //         component: () => import(`../pages/test/index.vue`),
      //           meta: {
      //             keepAlive: true // 需要缓存
      //           }
      //       },
      {
        path: "/details/:mid/:tid/:csid",
        name: "details",
        component: () => import('../pages/match-details/details-main.vue')
      },
      {
        path: "/video/:mid/:tid/:csid/:play_type/:video_size",
        name: "video",
        component: () =>import("../pages/video/video.vue")   
      },
      //       {
      //         path: "/virtual_details/:mid/:tid/:csid",
      //         name: "virtual_details",
      //         component: () => import(`../pages/test/index.vue`),
      //       },
      //       {
      //         path: "/video/:mid/:tid/:csid/:play_type/:video_size",
      //         name: "video",
      //         component: () => import(`../pages/test/index.vue`),
      //       },
    ],
  },
];

export default routes;
