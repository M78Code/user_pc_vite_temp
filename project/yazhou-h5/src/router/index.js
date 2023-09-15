import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: {
        name: 'home'
      },
      name: "main",
      component: () => import("project_path/src/layouts/MainLayout.vue"),
      children: [
          {
            path: "/match",
            name: "matchList",
            component: () => import("project_path/src/pages/match-list/index.vue"),
            meta: {
              keepAlive: true // 需要缓存
            },
          },
          {
            path: "/home",
            name: "home",
            component: () => import("project_path/src/pages/home/home-index.vue")
          },
          {
            path: "/activity_task",
            name: "activity_task",
            component: () => import("project_path/src/pages/activity-page/activity-task/index.vue")
          },
        {
          path: "/virtual",
          name: "virtual_sports",
          component: () => import("project_path/src/pages/virtual/virtual.vue"),
        },
        {
          path: "/menu",
          name: "menu",
          component: () => import("project_path/src/pages/menu/index.vue"),
        },
        {
          path: "/notice",
          name: "notice",
          component: () => import("project_path/src/pages/notice/index.vue"),
        },
        // 注单历史---临时
        {
          path: "/cathectic",
          name: "cathectic",
          component: () => import("project_path/src/pages/cathectic/index.vue"),
        },
        // 赛事分析---临时
        {
          path: "/match_analysis",
          name: "match_analysis",
          component: () => import("project_path/src/pages/details/analysis-matches/index.vue"),
        },
        {
          path: "/rule_description/:name",
          name: "rule_description",
          component: () =>
            import(
              "project_path/src/pages/rule-description/description-main.vue"
            ),
        },
        //   {
        //     path: '/category_loading/:mid',
        //     name: 'category_loading',
        //     component: () => import("project_path/pages/details/category-loading.vue")
        //   },
        //   // 常规赛事和电竞赛事详情页,赛事id必传，玩法集id可选
        {
          path: "/details/:mid/:mcid?/:csid?",
          name: "category",
          component: () => import("project_path/src/pages/details/details.vue"),
          children: [
            {
              path: "category/:mid?/:id?",
              name: "category",
              component: () =>
                import("project_path/src/pages/details/children/category.vue"),
            },
          ],
        },
        //   // 赛果详情页
        //   {
        //     path: "/result_details/:mid",
        //     name: "result_details",
        //     component: () => import("project_path/pages/details/result_details.vue"),
        //     children: [
        //       {
        //         path: "/result_details/:mid/:index",
        //         name: "match_result",
        //         component: () => import("project_path/pages/details/components/result_fat_tab.vue")
        //       }
        //     ]
        //   },
        //   // 虚拟赛事详情页
        //   {
        //     path: "/virtual_sports_details",
        //     name: "virtual_sports_details",
        //     component: () => import("project_path/pages/details/virtual_sports_details.vue"),
        //     children: [
        //       {
        //         path: "virtual_sports_category/:id",
        //         name: "virtual_sports_category",
        //         component: () => import("project_path/pages/details/children/virtual_sports_category.vue")
        //       },
        //     ]
        //   },
      ],
    },
    // {
    //   path: "/router",
    //   name: "router_url",
    //   component: () => import("project_path/src/layouts/router.vue"),
    // }
  ],
});

export default router;
