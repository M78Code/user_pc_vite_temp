import { defineAsyncComponent } from "vue";
const routes = [
  // 主框架
  {
    path: "/",
    name: "main_layout",
    redirect: {
      name: "home",
    },
    component: () => import('../layouts/main-layout.vue'),
    children: [
      // 首页
      {
        path: "/home",
        name: "home",
        component: () => import('../pages/match-list/match-list.vue'),
        meta: {
          keepAlive: true, // 需要缓存,
          title: '体育投注',
          needRemember: true,
          i18n:'ouzhou.match.home',
        },
      },
      //滚球
      {
        path: "/in_play",
        name: "in_play",
        component: () => import('../pages/scroll-ball/index.vue'), 
        meta: {
          keepAlive: true, // 需要缓存
          title: '滚球',
          i18n:'menu.match_playing',
          needRemember: true
        },
      },
      //投注记录
      {
        path: "/bet_record",
        name: "bet_record",
        component: () => import('../pages/bet-record/index.vue'),
        meta: {
          keepAlive: true, // 需要缓存
          title: '投注记录',
          i18n:'common.betting_record',
          needRemember: true
        },
      },
      {
        path: "/text",
        name: "text",
        component: () => import('../pages/test/index.vue'),
        meta: {
          keepAlive: true, // 需要缓存
        },
      },
      {
        path: "/details/:mid/:csid/:tid?",
        name: "details",
        component: () => import('../pages/match-new-detail/index.vue')
      },
      // 搜索
      {
        path: "/search/:keyword/:csid",
        name: "search",
        component: () => import('../pages/search/index.vue'),
        meta: {
          keepAlive: true, // 需要缓存
        }
      },
      {
        path: "/league/:sportId/:tid/:type",
        name: "league",
        component: () => import('../pages/league/index.vue'),
        meta: {
          keepAlive: true, // 需要缓存
        }
      },
      {
        path: "/video/:mid/:tid/:csid/:play_type/:video_size",
        name: "video",
        component: () => import("../pages/video/video.vue")
      },
      {
        path: "/virtual_details/:mid/:tid/:csid",
        name: "virtual_details",
        component: () => import(`../pages/virtual-details/index.vue`),
      },
      //       {
      //         path: "/video/:mid/:tid/:csid/:play_type/:video_size",
      //         name: "video",
      //         component: () => import(`../pages/test/index.vue`),
      //       },
    ],
  },
  //赛事分析
  {
    path: "/analysis_header/:csid/:mid/:euid",
    name: "analysis_header",

    component: () => import('../pages/analysis-header/analysis-header.vue'),
  },

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
  // vr 详情
  {
    path: "/secondary",
    name: "secondary",
    component: () => import("../pages/secondary/index.vue"),
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
  {
    path: '/:catchAll(.*)*',
    redirect: {
      name: 'home'
    },
  }
];

export default routes;
