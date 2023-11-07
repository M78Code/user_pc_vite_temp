/*
 * @Author: rise
 * @Date: 2023-11-03 16:37:52
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @LastEditTime: 2023-11-07 19:21:14
 * @Description:  
 */
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
      component: () => import("../layouts/index.vue"),
      children: [
          // {
          //   path: "/inPlay",
          //   name: "inPlay",
          //   component: () => import("../pages/in-pay/index.vue"),
          //   meta: {
          //     keepAlive: true // 需要缓存
          //   },
          // },
          {
            path: "/match",
            name: "matchList",
            component: () => import("../pages/match-page/index.vue"),
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
            component: () => import("../pages/match-page/index.vue"),
          },
          // {
          //   path: "/activity_task",
          //   name: "activity_task",
          //   component: () => import("../activity-page/activity-task/index.vue")
          // },
        {
          path: "/virtual",  // vr体育
          name: "virtual_sports",
          component: () => import("../pages/virtual/index.vue"),
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
          path: "/details/:mid/:mcid?/:csid?",
          name: "category",
          component: () => import("../pages/detailnew/index.vue"),
          // children: [
          //   {
          //     path: "category/:id?",
          //     name: "category",
          //     component: () =>
          //       import("../pages/details/children/category.vue"),
          //   },
          // ],
        },
          // 赛果详情页
          {
            path: "/result_details",
            name: "result_details",
            component: () => import("../pages/details/result-details.vue"),
            children: [
              {
                path: "/result_details/:index",
                name: "match_result",
                component: () => import("../pages/details/components/result-fat-tab.vue")
              }
            ]
          },
        //   // 虚拟赛事详情页
          {
            path: "/virtual_sports_details",
            name: "virtual_sports_details",
            component: () => import("../pages/details/virtual-sports-details.vue"),
            children: [
              {
                path: "virtual_sports_category/:id?",
                name: "virtual_sports_category",
                component: () => import("../pages/details/children/virtual-sports-category.vue")
              },
            ]
          },
          // 投注列表
          {
            path: "/betting_history",
            name: "betting_history",
            component: () => import("../pages/cathectic/index.vue"),
          },
          // 个人中心
          {
            path: "/personal",
            name: "personal",
            component: () => import("../pages/personal/index.vue"),
            meta: {
              keepAlive: true // 需要缓存
            },
          },
          //规则
          {
            path: "/rules",
            name: "/rules",
            component: () => import("../pages/rules/rules.vue"),
            meta: {
              keepAlive: true // 需要缓存
            },
          },
          //公告
          {
            path: "/announcement",
            name: "/announcement",
            component: () => import("../pages/personal/announcement.vue"),
            meta: {
              keepAlive: true // 需要缓存
            },
          }
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
