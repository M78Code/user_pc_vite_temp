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
      {
        path: "/details/:mid/:csid/:tid?",
        name: "details",
        component: () => import('../pages/match-details/details-main.vue')
      },
      {
        path: "/video/:mid/:tid/:csid/:play_type/:video_size",
        name: "video",
        component: () =>import("../pages/video/video.vue")   
      },
    ],
  },
  //赛事分析
  {
    path: "/analysis_header/:csid/:mid/:euid",
    name: "analysis_header",

    component: () => import('../pages/analysis-header/analysis-header.vue'),
  },
  // //投注记录
  // {
  //   path: "/bet_record",
  //   name: "bet_record",
  //   component: () => import('../pages/bet-record/index.vue'), // project/yazhou-pc/src/pages/bet-record/index.vue
  // },
  // 赛果
  {
    path: "/match_results",
    name: "match_results",
    component: () => import('../pages/match-results/match-results.vue'),
  },
  // 公告
  {
    path: "/announce",
    name: "announce",
    component: () => import("../pages/announce/index.vue"),
  },
  // 体育规则
  {
    path: "/rule",
    name: "rule",
    component: () => import("../pages/rule/index.vue"),
  },
  {
    path: '/:catchAll(.*)*',
    redirect: {
      name: 'home'
    },
  }
];

export default routes;
