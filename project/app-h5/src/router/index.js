import { createRouter, createWebHashHistory } from "vue-router";
import { MenuData } from "src/output";
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
              preload: true,
              keepAlive: true // 需要缓存
            },
          },
          {
            path: "/handicap",
            name: "handicapTutorial",
            component: () => import("../pages/handicap-tutorial/index.vue"),
            meta: {
              preload: true,
              keepAlive: true // 需要缓存
            },
          },
          // 规则说明
          {
            path: "/rules",
            name: "rules",
            component: () => import("../pages/handicap-tutorial/index.vue"),
            meta: {
              preload: true,
              keepAlive: true // 需要缓存
            },
          },
          {
            path: "/matchResults",
            name: "matchResults",
            component: () => import("../pages/match-results/index.vue"),
            meta: {
              preload: true,
              keepAlive: true // 需要缓存
            },
          },
          // {
          //   path: "/home",
          //   name: "home",
          //   component: () => import("../pages/home/index.vue")
          // },
          // {
          //   path: "/activity_task",
          //   name: "activity_task",
          //   component: () => import("../activity-page/activity-task/index.vue")
          // },
        {
          path: "/virtual",  // vr体育
          name: "virtual_sports",
          component: () => import("src/base-h5/vr/pages/virtual/virtual.vue"),
          meta: {
            preload: true,
          },
        },
        {
          path: "/collect", // 收藏
          name: "collect",
          component: () => import("../pages/collect/index.vue"),
          meta: {
            preload: true,
          },
        },
        {
          path: "/menu",
          name: "menu",
          component: () => import("../pages/menu/index.vue"),
          meta: {
            preload: true,
          },
        },
        {
          path: "/notice",
          name: "notice",
          component: () => import("../pages/notice/index.vue"),
          meta: {
            preload: true,
          },
        },
       // 切换语言
        {
          path: "/language_switch",
          name: "language_switch",
          component: () => import( "../pages/language-switch/index.vue" ),
          meta: {
            preload: true,
          },
        },
        {
          path: "/rule_description",
          name: "rule_description",
          component: () => import( "../pages/rule-description/description-main.vue" ),
          meta: {
            preload: true,
          },
        },
          // {
          //   path: '/category_loading/:mid',
          //   name: 'category_loading',
          //   component: () => import("。。/pages/details/category-loading.vue")
          // },
          // 常规赛事和电竞赛事详情页,赛事id必传，玩法集id可选
        {
          path: "/details/:mid/:csid/:tid/:mcid?",
          name: "category",
          component: () => import("../pages/details/details.vue"),
          meta: {
            preload: true,
          },
        },
          // 赛果详情页
          {
            path: "/result_details/:mid/:csid/:mcid?/:index?",
            name: "result_details",
            component: () => import("../pages/details/result-details.vue"),
            meta: {
              preload: true,
            },
            children: [
              {
                path: "/result_details/:mid/:csid/:mcid?/:index?",
                name: "match_result",
                component: () => import("../pages/details/components/result-fat-tab.vue")
              }
            ]
          },
          { 
            path: '/result/:mid/:csid/:mcid?',
            name: "result",
            redirect: { name: 'result_details' },
            meta: {
              preload: true,
            },
          },
        //   // 虚拟赛事详情页
          {
            path: "/virtual_sports_details",
            name: "virtual_sports_details",
            component: () => import("src/base-h5/vr/pages/virtual/virtual-sports-details.vue"),
            meta: {
              preload: true,
            },
          },
          //活动页面
          {
            path: "/activity",
            name: "activity",
            component: () => import("../pages/activity/index.vue"),
            meta: {
              preload: true,
            },
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
/**
 * 路由切换清除默认球种
 */
router.afterEach((to, from) => {
  if(from.name=="virtual_sports" && to.name == "matchList"){
    MenuData.set_top_menu_title({});//设置菜单
 }
  if(to.name == "virtual_sports"){
    MenuData.set_current_lv1_menu(300);//设置菜单
  }
})
export default router;
