import { defineAsyncComponent } from "vue";
const routes = [
  // 主框架
  {
    path: "/",
    name: "main_layout",
    // redirect: {
    //   name: "home",
    // },
    component: () => import(`../layouts/main-layout1.vue`),
    children: [
      //       // 首页
      {
        path: "/home",
        name: "home",
        // component: () => import(`../pages/test/index.vue`),
        component: () => import(`../pages/match-list/match-list.vue`),
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
        component: () =>
          import(`../pages/match-details/details_main.vue`),
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
  // //赛事分析
  // {
  //   path: "/analysis_header/:csid/:mid",
  //   name: "analysis_header",
  //   component: () => import(`../pages/test/index.vue`),
  // },
  // //投注记录
  // {
  //   path: "/bet_record",
  //   name: "bet_record",
  //   component: () => import(`../pages/test/index.vue`),
  // },
  // 赛果
  // {
  //   path: "/match_results",
  //   name: "match_results",
  //   component: () => import('project_path/src/pages/match_results/match_results.vue'),
  // },
  // // 公告
  // {
  //   path: "/announce",
  //   name: "announce",
  //   component: () => import("project_path/src/pages/announce/index.vue"),
  // },
  // 体育规则
  {
    path: "/rule",
    name: "rule",
    component: () => import("project_path/src/pages/rule/index.vue"),
  },
  // // 每日成长任务
  // {
  //   path: '/activity',
  //   name: "activity",
  //   component: () => import(`../pages/test/index.vue`),
  // },
  // // 活动维护页面
  // {
  //   path: '/activity_aegis',
  //   name: "activity_aegis",
  //   component: () => import(`../pages/test/index.vue`),
  // },
  // {
  //   path: '/article_details/:id/:count',
  //   name: "article_details",
  //   component: () => import(`../pages/test/index.vue`),
  // },
  // {
  //   path: "/no_network",
  //   name: "no_network",

  //   component: () => import(`../pages/test/index.vue`),
  // },
  // {
  //   path: "/error404",
  //   name: "error404",
  //   redirect: {
  //     name: "home"
  //   },
  //   component: () => import(`../pages/test/index.vue`),
  // },
];

export default routes;
