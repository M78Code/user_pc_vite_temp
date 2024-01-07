import { createRouter, createWebHashHistory } from "vue-router";
import { MenuData , LocalStorage} from "src/output";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: {
        name: "home",
      },
      name: "main",
      component: () => import("../layouts/index.vue"),
      children: [
        {
          path: "/inPlay",
          name: "inPlay",
          component: () => import("../pages/in-play/index.vue"),
          meta: {
            keepAlive: true, // 需要缓存
          },
        },
        {
          path: "/champion",
          name: "champion",
          component: () => import("../pages/champion/index.vue"),
          meta: {
            keepAlive: true, // 需要缓存
          },
        },
        {
          path: "/match",
          name: "matchList",
          component: () => import("../pages/match-page/index.vue"),
          meta: {
            keepAlive: true, // 需要缓存
          },
        },
        {
          path: "/handicap",
          name: "handicapTutorial",
          component: () => import("../pages/handicap-tutorial/index.vue"),
          meta: {
            keepAlive: true, // 需要缓存
          },
        },
        {
          path: "/matchResults",
          name: "matchResults",
          component: () => import("../pages/match-results/index.vue"),
          meta: {
            keepAlive: true, // 需要缓存
          },
        },
        {
          path: "/home",
          name: "home",
          component: () => import("../pages/home/index.vue"),
        },
        // {
        //   path: "/activity_task",
        //   name: "activity_task",
        //   component: () => import("../activity-page/activity-task/index.vue")
        // },
        {
          path: "/virtual", // vr体育
          name: "virtual_sports",
          component: () => import("../pages/vr/pages/virtual/virtual.vue"),
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
            import("../pages/rule-description/description-main.vue"),
        },
        // {
        //   path: '/category_loading/:mid',
        //   name: 'category_loading',
        //   component: () => import("。。/pages/details/category-loading.vue")
        // },
        // 常规赛事和电竞赛事详情页,赛事id必传，玩法集id可选, 添加tid(联赛id)用于服务联赛筛选功能
        {
          path: "/details/:mid/:csid/:tid?/:mcid?",
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
        {
          path: "/result/:mid/:tid/:csid?/:mcid?",
          name: "result",
          component: () => import("../pages/detailnew/result/index.vue"),
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
            keepAlive: true, // 需要缓存
          },
        },
        //规则
        {
          path: "/rules",
          name: "rules",
          component: () => import("../pages/rules/rules.vue"),
          meta: {
            keepAlive: true, // 需要缓存
          },
        },
        //公告
        {
          path: "/announcement",
          name: "announcement",
          component: () => import("../pages/personal/announcement.vue"),
          meta: {
            keepAlive: true // 需要缓存
          },
        },
      ],
    },
    //搜索
    {
      path: "/search",
      name: "search",
      component: () => import("../pages/search/index.vue"),
      meta: {
        keepAlive: true, // 需要缓存
      },
    },
    {
      path: "/:catchAll(.*)*",
      redirect: {
        name: "matchList",
      },
    },
  ],
});
/**
 * 不清除menuid路由
 */
const detailsName = ['category','result','personal'];
/**
 * 路由切换清除默认球种
 */
router.beforeEach((to, from, next) => {
    if(!!to.name && !!from.name && to.name !== from.name && to.name !== "matchList" && !detailsName.includes(to.name) && !detailsName.includes(from.name)){
        LocalStorage.remove("menu_h5");
        MenuData.clear_menu_id();
    }
    next()
})

export default router;
