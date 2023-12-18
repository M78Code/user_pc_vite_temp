import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: {
        name: 'matchList'
      },
      name: "main",
      component: () => import("../layouts/index.vue"),
      children: [
          {
            path: "/match",
            name: "matchList",
            component: () => import("../pages/match-list/index.vue"),
            meta: {
              keepAlive: true // 需要缓存
            },
          },
          {
            path: "/handicap",
            name: "handicapTutorial",
            component: () => import("../pages/handicap-tutorial/index.vue"),
            meta: {
              keepAlive: true // 需要缓存
            },
          },
          {
            path: "/matchResults",
            name: "matchResults",
            component: () => import("../pages/match-results/index.vue"),
            meta: {
              keepAlive: true // 需要缓存
            },
          },
          {
            path: "/home",
            name: "home",
            component: () => import("../pages/home/index.vue")
          },
          // {
          //   path: "/activity_task",
          //   name: "activity_task",
          //   component: () => import("../activity-page/activity-task/index.vue")
          // },
        {
          path: "/virtual",  // vr体育
          name: "virtual_sports",
          component: () => import("src/base-h5/vr/pages/virtual/virtual.vue"),
        },
        {
          path: "/esports", // 电竞
          name: "esports_sports",
          component: () => import("../pages/esports/index.vue"),
        },
        {
          path: "/collect", // 收藏
          name: "collect",
          component: () => import("../pages/collect/index.vue"),
        },
        {
          path: "/menu",
          name: "menu",
          component: () => import("../pages/menu/index.vue"),
        },
        {
          path: "/notice",
          name: "notice",
          component: () => import("../pages/notice/index.vue"),
        },
       
        {
          path: "/rule_description/:name",
          name: "rule_description",
          component: () =>
            import(
              "../pages/rule-description/description-main.vue"
            ),
        },
          // {
          //   path: '/category_loading/:mid',
          //   name: 'category_loading',
          //   component: () => import("。。/pages/details/category-loading.vue")
          // },
          // 常规赛事和电竞赛事详情页,赛事id必传，玩法集id可选
        {
          path: "/details/:mid/:csid/:mcid?",
          name: "category",
          component: () => import("../pages/details/details.vue"),
        },
          // 赛果详情页
          {
            path: "/result_details/:mid/:csid/:mcid?",
            name: "result_details",
            component: () => import("../pages/details/result-details.vue"),
            children: [
              {
                path: "/result_details/:mid/:csid/:mcid?/:index",
                name: "match_result",
                component: () => import("../pages/details/components/result-fat-tab.vue")
              }
            ]
          },
          { 
            path: '/result/:mid/:csid/:mcid?',
            name: "result",
            redirect: { name: 'result_details' }
          },
        //   // 虚拟赛事详情页
          {
            path: "/virtual_sports_details",
            name: "virtual_sports_details",
            component: () => import("src/base-h5/vr/pages/virtual/virtual_sports_details.vue"),
            children: [
              {
                path: "virtual_sports_category/:id?",
                name: "virtual_sports_category",
                component: () => import("../pages/details/children/virtual-sports-category.vue")
              },
            ]
          },
          //活动页面
          {
            path: "/activity",
            name: "activity",
            component: () => import("../pages/activity/index.vue"),
          },
      ],
    },
    {
      path: '/:catchAll(.*)*',
      redirect: {
        name: 'matchList'
      },
      
    }
  ],
});

export default router;
