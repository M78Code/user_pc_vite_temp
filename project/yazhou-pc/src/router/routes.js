import { defineAsyncComponent } from 'vue'
const routes = [
    // 主框架 @Amor 2020-01-14 22:12:45
    {
      path: "/",
      name: "main_layout",
      // redirect: {
      //   name: "home"
      // },
      component: defineAsyncComponent(() => import(`project_path/src/layouts/main-layout.vue`)),
      children: [
        // 首页 @Amor 2020-01-14 22:12:45
        // {
        //   path: "/home",
        //   name: "home",
        //   component: defineAsyncComponent(() => import(`project_path/src/pages/match_list.vue`)),
        //   meta: {
        //     keepAlive: true // 需要缓存
        //   },
        // },
        // 搜索 @Amor 2020-01-14 22:12:45
        // {
        //   path: "/search/:keyword/:time?",
        //   name: "search",
        //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/match_list/search_match_list.vue`)),
        //     meta: {
        //       keepAlive: true // 需要缓存
        //     }
        // },
        // {
        //   path: "/details/:mid/:tid/:csid",
        //   name: "details",
        //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
        // },
        // {
        //   path: "/virtual_details/:mid/:tid/:csid",
        //   name: "virtual_details",
        //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
        // },
        // {
        //   path: "/video/:mid/:tid/:csid/:play_type/:video_size",
        //   name: "video",
        //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
        // },
      ]
    },
  //赛事分析
  // {
  //   path: "/analysis_header/:csid/:mid",
  //   name: "analysis_header",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // //投注记录
  // {
  //   path: "/bet_record",
  //   name: "bet_record",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // // 赛果
  // {
  //   path: "/match_results",
  //   name: "match_results",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // // 公告 @shoket 2020-01-23 20:27:45
  // {
  //   path: "/announce",
  //   name: "announce",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // // 体育规则 @shoket 2020-01-23 20:27:45
  // {
  //   path: "/rule",
  //   name: "rule",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // // 每日成长任务
  // {
  //   path: '/activity',
  //   name: "activity",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // // 活动维护页面
  // {
  //   path: '/activity_aegis',
  //   name: "activity_aegis",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // {
  //   path: '/article_details/:id/:count',
  //   name: "article_details",
  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  // {
  //   path: "/no_network",
  //   name: "no_network",

  //   component: defineAsyncComponent(() => import(`src/project/yabo/pages/details/details_main.vue`)),
  // },
  {
    path: "/error404",
    name: "error404",
    redirect: {
      name: "home"
    },
    // component: () => import( /* webpackChunkName: "other" */ "src/project/yabo/pages/error/no_network.vue")
  },
]

export default routes
