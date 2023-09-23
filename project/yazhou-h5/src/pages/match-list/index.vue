<!--
 * @Description: 赛事列表页用于展示滚球、今日、早盘、串关、冠军等赛事
-->
<template>
  <div class="match-main no-padding-bottom" :style="page_style" ref="match_main">
    <!--赛事列表-->
    <div class="match-list-container" ref="match_list_container" :class="{
      zaopan: [4, 11, 28, 3000].includes(+MenuData.current_menu) && invok_source != 'home_hot_page_schedule',
      guanjun: [100].includes(+MenuData.current_menu),
      level_four_menu: MenuData.current_menu == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(get_curr_sub_menu_type),
      detail_match_list: ['detail_match_list', 'home_hot_page_schedule', ].includes(invok_source),
      jingzu: MenuData.current_menu == 30,
      jinri: MenuData.current_menu == 3,
      esport: 3000 == MenuData.current_menu,
    }" @scroll="wrapper_scroll_handler">
      <!--缝隙 不通层级 遮罩 存在渲染偏差， 边界 双线 或者 侵蚀问题-->
      <div class="gap" v-if="on_match && MenuData.current_menu != 3000"
        :class="{ zaopan: [4, 11, 28, 3000].includes(+MenuData.current_menu) }" />
      <!-- 跳转到其他场馆的banner图 和猜你喜欢-->
      <tiaozhuan-panel v-if="calc_show"></tiaozhuan-panel>
      <!-- 列表骨架屏 -->
      <!-- <SList v-if="show_skeleton_screen" :loading_body="true" /> -->
      <!-- 列表页主内容 -->
      <match-list ref="match_list" :matchCtr="matchCtr" :menu_type="MenuData.current_menu"
        :data_get_empty="match_is_empty" :source="invok_source ? invok_source : 'match_main'"
        :window_scrolly="window_scrolly" :match_list_wrapper_height="match_list_wrapper_height"
        @change_favorite_state="change_favorite_state">
        <!--        @unfold_league="unfold_league_handle"-->
      </match-list>
      <!-- 到底了容器原加载更多容器-->
      <div class="loading-more-container" v-if="!match_is_empty && lodash.size(matchCtr.match_list_data_sources) > 3"
        :class="{ home_hot: invok_source == 'home_hot_page_schedule' }">
        <div style="color:#AAAEB8;font-size:.12rem;">
          {{ $t("scroll_wrapper.is_footer") }}
        </div>
      </div>

      <!-- 回到顶部按钮组件 -->
      <scroll-top v-show="!get_is_show_menu && list_scroll_top > 0" ref="scroll_top" :list_scroll_top="list_scroll_top"
        @back-top="back_top" />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { i18n_t } from "src/core/index.js";
import store from "src/store-redux/index.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 由首页进入，就不在此处初始化
      if (from.name !== "home") {
        vm.event_init();
      }
      let match_total = vm.matchCtr && vm.matchCtr.list.length;

      if (
        !vm.get_details_changing_favorite && //不是详情页更改过赛事收藏到了列表也就不用重新拉数据r
        match_total &&
        ["match_result", "virtual_sports"].includes(from.name)
      ) {
        // 详情， 赛果，虚拟体育返回到列表也的时候不更新数据，保持上次的数据r
        if (["virtual_sports"].includes(from.name)) {
          // vm.set_current_esport_csid(vm.prev_export_csid);

          //新手版或专业版在其他页面被改变,需要重新计算列表赛事dom 赛事列表是专业版，跳到虚拟体育被手动改新手版rn 重新计算dom r
          if (vm.standard_edition_type != vm.newer_standard_edition.value) {
            MatchListCard.run_process_when_need_recompute_container_list_when_first_load_list();
            vm.standard_edition_type = vm.newer_standard_edition.value;
          }
        }
        //赛果精选赛事列表与赛事列表是同一个组件,所以滚动逻辑有影响
        if (["category", "match_result"].includes(from.name)) {
          MatchListCard.run_process_when_need_recompute_container_list_when_first_load_list();
        }
        // vm.set_global_is_back_match_list(Math.random())
        return;
      }
      //详情页更改过赛事收藏 列表需重置到0
      // vm.set_details_changing_favorite(0);
      //当前列表也重置到联赛折叠状态r
      store.dispatch({
        type: "matchReducer/set_collapse_map_match",
        payload: {},
      });

      //次要玩法折叠状态置空
      store.dispatch({
        type: "matchReducer/set_secondary_unfold_map",
        payload: {},
      });
      let timer_super7 = null;
      clearTimeout(vm.timer_super7);
      timer_super7 = setTimeout(() => {
        next({ query: {} }); // 去掉其他传过来的当前路由参数 还在当前页刷新一下r
        timer_super7 = null;
        clearTimeout(timer_super7);
      }, 200);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (!["category", "match_result", "virtual_sports"].includes(to.name)) {
      // destroy_handle();
      //TODO:
    }
    next();
  },
});
</script>
<script setup>
import { computed, onBeforeMount, onUnmounted, onMounted, watch, onDeactivated, onActivated, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import lodash from "lodash";
import store from "src/store-redux/index.js";

// import use_router_scroll from 'src/core/match-list-h5/use-hooks/router-scroll.js'
// import use_websocket_store from 'src/core/match-list-h5/websocket/skt_data_list.js'
import tiaozhuanPanel from "./components/tiaozhuan-panel.vue";    //  跳转banner图和猜你喜欢
import MatchCtrClass from "src/core/match-list-h5/match-class/match-ctr.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import matchList from "./components/match-list.vue";
import PageSourceData from "src/core/page-source/page-source.js";
import SList from "project_path/src/components/skeleton/skeleton-list.vue"   // 赛事列表骨架屏
import scrollTop from "project_path/src/components/common/record-scroll/scroll-top.vue";
import { compute_css_variables } from "src/core/css-var/index.js"
import { MenuData, score_switch_handle, utils } from "src/core/index.js";
// import matchListCardFold from 'src/core/match-list-h5/match-card/match-list-card-fold.js'

import 'project_path/src/css/pages/match-main.scss'

const props = defineProps({
  invok_source: String,
  wrapper_scroll_top: Number,
});

const route = useRoute();
const router = useRouter();
const store_state = store.getState();
// const websocket_store = use_websocket_store()

const enter_time = ref("");
const match_main = ref(null);
const match_list = ref(null);
const scroll_top = ref(null);
const page_style = ref(null);
const match_list_container = ref(null);
const emitters = ref({});
const match_list_wrapper_height = 0
const ws_invoke_key = ref("match_main");
// 获取赛事列表接口超时setTimeout 6000
const requesting_timeout = ref(null);
// 赛事列表无数据
const match_is_empty = ref(false);
// 赛事操作工具类
const matchCtr = ref(MatchCtrClass);
// 赛事列表接口请求中提示
const is_data_requesting = ref(true);
//窗口向上滚动距离
const window_scrolly = ref(0);
//正在切换新版与标准版
const newer_standard_changing = ref(false);
//投注栏弹层显示非0否则0
const local_bet_status = ref(0);
//离开本页时的电竞id
const prev_export_csid = ref("");
//新手版1专业版2,本地组件存储
const standard_edition_type = ref(0);
// 赛事列表滑动高度
const list_scroll_top = ref(0);

const timer_super6 = ref(null);
const timer_super9 = ref(null);
const subscription_timer1 = ref(null);

//新手版标准版 1 2
const newer_standard_edition = ref(PageSourceData.newer_standard_edition);

const get_uid = ref(store_state.get_uid);

const get_bet_status = ref(store_state.get_bet_status);
// 显示收藏弹窗
const show_favorite_list = ref(store_state.show_favorite_list);
// 显示筛选頁面
const get_show_match_filter = ref(store_state.get_show_match_filter);

// 详情页的数据
const get_detail_data = ref(store_state.get_detail_data);
// 改变了收藏状态
const get_details_changing_favorite = ref(store_state.get_details_changing_favorite);
// 右侧设置菜单显示时 , 不显示骨架屏
const get_is_show_menu = ref(store_state.get_is_show_menu);
// 次要玩法展开映射
const get_secondary_unfold_map = ref(store_state.get_secondary_unfold_map);
const get_list_scroll_top = ref(store_state.get_list_scroll_top);
const get_preload_animation_url = ref(store_state.get_preload_animation_url);

onBeforeMount(() => {
  // init_router_info()
  // 进入页面时记录时间戳
  enter_time.value = Date.now();
});

onMounted(() => {
  page_style.value = compute_css_variables({ category: 'component', module: 'match' })

  if (props.invok_source) {
    ws_invoke_key.value = props.invok_source;
  }
  // 初始化赛事列表操作工具类
  standard_edition_type.value = newer_standard_edition.value;
  if (newer_standard_edition.value == 2) {
    newer_standard_changing.value = true;
  } else {
    MatchListCard.sliding_can_trigger_process_distance = 500;
  }
  // 记录埋点，进入列表页
  utils.gtag_view_send("H5_match", "/match");
  // 详情精选赛事页需清空map折叠状态
  store.dispatch({ type: 'topMenuReducer/set_collapse_map_match', payload: {} })
  // 事件初始化
  event_init();
});

// 详情若无热门推荐赛事，则隐藏相应内容
watch(() => match_is_empty.value, () => {
  if (props.invok_source === "detail_match_list" && is_empty) {
    useMittEmit(MITT_TYPES.EMIT_HIDE_DETAIL_MATCH_LIST, true);
  }
}
);

// 早盘时，并且是 足球时，执行下边操作
watch(() => MenuData.current_menu, () => {
  if (MenuData.current_menu == 4 && val == "40303") {
    clearTimeout(subscription_timer1.value);
    subscription_timer1.value = setTimeout(() => {
      // 订阅新赛事列表
      subscription();
    }, 3000);
  }
},
  { deep: true }
);

// 罚牌说明展开后会跟随列表滑动，且切换页面再次进入依旧显示在列表页
watch(() => props.wrapper_scroll_top, () => {
  window_scrolly.value = c;
}
);

// 其他页改变取消收藏, 如果当前为收藏模式则移除该赛事
// watch(() => get_match_id_bet_success, () => {
//   if (show_favorite_list) {
//     return
//   }
//   if(value){
//     let mid = value.split('-')[0];
//     let is_collect = value.split('-')[1];
//     let found_index = lodash.findIndex(matchCtr.value.list,{mid});

//     if(found_index > -1){
//       let param = {
//         index: found_index,
//         item: "mf",
//         bool: is_collect == 1,
//         number: is_collect == 1 ? 1 : -1
//       };
//       change_favorite_state(param);
//     }
//   }
// })

// 菜单类型变化时，如果是收藏则以动画方式显示或隐藏页面
watch(() => MenuData.current_menu, () => {
  // 切换一级菜单时记录最新时间戳
  enter_time.value = Date.now();
  // 切换一级菜单时 goto_detail_matchid置为空
  // store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: '' })
  // matchCtr.value.clearData();
}
);

// 筛选过滤弹层消失
watch(() => get_show_match_filter.value, () => {
  if (!flag) {
    // store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: '' })
    subscription();
  }
}
);

// 页脚子菜单
watch(() => MenuData.footer_sub_menu_id, () => {
  if (
    (MenuData.prev_footer_sub_menu_id != curr && curr == 114) ||
    (MenuData.prev_footer_sub_menu_id != curr &&
      MenuData.prev_footer_sub_menu_id == 114)
  ) {
    matchCtr.value.match_list_data_sources.forEach((item) => {
      score_switch_handle(item);
    });
    matchCtr.value.list.forEach((item) => {
      score_switch_handle(item);
    });
  }
  MenuData.prev_footer_sub_menu_id = curr;
}
);

// 新手版标准版切换
watch(() => newer_standard_edition.value, () => {
  if (MenuData.current_menu == 900) {
    //虚拟体育
    return;
  }
  // 如果是简版
  if (n == 1) {
    MatchListCard.sliding_can_trigger_process_distance = 500;
  }
  standard_edition_type.value = newer_standard_edition.value;
  run_process_when_need_recompute_container_list_when_scroll(false, {
    update_type: "standard_simple_change",
  });
}
);

// 投注栏弹层显示非0否则0
watch(() => get_bet_status.value, () => {
  if (c_status == 0) {
    const has_pre = lodash.findKey(BetData.bet_obj, function (o) {
      return o.show_pre;
    });
    if (has_pre) {
      //当投注框收起时，清空预约相关信息
      let temp_bet_obj = lodash.cloneDeep(BetData.bet_obj);
      temp_bet_obj[has_pre].show_pre = false;
      delete temp_bet_obj[has_pre].pre_odds;
      delete temp_bet_obj[has_pre].pre_market_value;
      delete temp_bet_obj[has_pre].min_odds;
      // store.dispatch({ type: 'matchReducer/set_pre_market_data',  payload: [] })
      set_bet_obj(temp_bet_obj);
    }
    clearTimeout(timer_super6.value);
    timer_super6.value = setTimeout(() => {
      local_bet_status.value = c_status;
    }, 400);
  } else {
    local_bet_status.value = c_status;
  }
}
);

// 筛选过滤弹层消失
watch(() => get_show_match_filter, () => {
  // 切换球种时，记录最新时间戳
  enter_time.value = Date.now();
  // 切换球种时 goto_detail_matchid置为空
  store.dispatch({ type: 'detailReducer/set_goto_detail_matchid', payload: '1111' })
  // 切换球种时 清空赛种折叠状态
  store.dispatch({ type: 'topMenuReducer/set_collapse_csid_map', payload: {} })
}
);

// 筛选过滤弹层消失
watch(
  () => matchCtr.value,
  (match_list) => {
    // 进入列表后，若preload_animation_url为未缓存状态，则执行动画资源预加载逻辑
    if (!get_preload_animation_url && match_list.length) {
      // 通过遍历列表，查找动画状态mvs > 0（可播放）的赛事mid，然后获取相应动画加载资源
      for (let i = 0, len = match_list.length; i < len; i++) {
        if (match_list[i].mvs > 0) {
          const params = {
            mid: match_list[i].mid,
            type: "Animation",
          };
          send_gcuuid = uid();
          params.gcuuid = send_gcuuid;
          // 预加载动画所需资源文件
          api_common.videoAnimationUrl(params).then((res) => {
            const { data } = res || {};
            if (res && send_gcuuid != res.gcuuid) return;
            if (!lodash.get(data, "animationUrl")) {
              return;
            }
            let animationUrl = "";
            //足篮棒网使用3.0动画  其他使用2.0
            if ([1, 2, 3, 5].includes(+match_list[i].csid)) {
              let animation3Url = data.animation3Url || [];
              animation3Url.forEach((item) => {
                if (item.styleName.indexOf("day") >= 0) {
                  animationUrl = item.path;
                }
              });
            }
            animationUrl = animationUrl || data.animationUrl;
            data.animation_src = animationUrl.replace(/https?:/, ""); // 动画
            data.video_src = "";
            data.referUrl =
              data.referUrl && data.referUrl.replace(/http:|https:/, ""); // 视频
            data.referUrl = `${location.protocol}${data.referUrl}`;

            useMittEmit(MITT_TYPES.EMIT_SET_PRE_VIDEO_SRC, data);
            store.dispatch({ type: 'videoReducer/set_preload_animation_url', payload: true })
          });
          // 获取相应动画加载资源后跳出循环
          break;
        }
      }
    }
  },
  { deep: true }
);

// TODO: 其他模块得 store  待添加
// 待处理： window.vue.scroll_list_wrapper_by
// mixins: [ main_menu_mixin,websocket_data, constant, msc_bw3, match_list_wrap_mixin,match_main_mixin, betting,router_scroll_y_mixin],

const calc_show = computed(() => {
  return (
    MenuData.current_menu == 1 &&
    !show_favorite_list &&
    !match_is_empty.value &&
    route.name != "home" &&
    props.invok_source != "detail_match_list"
  );
});

const on_match = computed(() => {
  return window.location.hash.includes("match");
});

// 显示骨架屏
const show_skeleton_screen = computed(() => {
  let r = true;
  // 详情页，首页
  let special_source = ["detail_match_list", "home_hot_page_schedule"].includes(
    props.invok_source
  );
  r = is_data_requesting.value && !special_source;
  return r;
});

const back_top = () => {
  match_list_container.value && match_list_container.value.scrollTo(0, 0);
};
/**
 * @description:  事件初始化
 */
const event_init = () => {
  // 详情页的视频预加载
  utils.load_video_resources(get_uid, "is_details_page");
  // 不让浏览器记住上次的滚动位置
  if ("scrollRestoration" in History) {
    history.scrollRestoration = "manual";
  }
  // 移除相关事件监听
  off_listeners();
  // 绑定相关事件监听
  on_listeners();
  //获取列表页赛事数据
  match_detail_m_list_init();
  // 图标出错与mid映射，初始化为空
  store.dispatch({ type: 'matchReducer/set_img_error_map_mid', payload: {} })
  // window.vue.scroll_list_wrapper_by = use_router_scroll().scroll_list_wrapper_by
  // 去除参数
  if (!location.search.includes("keep_url")) {
    history.replaceState(null, "", `${location.pathname}${location.hash}`);
  }
  // set_hide_skeleton_screen(true)
};
/**
 * @Description 次要玩法展开加载数据
 * @param {Object} match 赛事
 * @param {String} key 指定的hps
 */
const special_hps_load_handle = (match, key) => {
  if (["category"].includes(route.name)) {
    return;
  }
  if (matchCtr.value.mid_obj[match.mid] && match[key] && match[key].length) {
    matchCtr.value.mid_obj[match.mid][key] = match[key];
    matchCtr.value.addMatchInfo(match);
    // websocket_store.SCMD_SPECIAL_C8(1,'list',key,match);
  }
};
const match_detail_m_list_init = () => {
  // // 赛果详情页的列表，数据请求
  // if(['detail_match_list'].includes(props.invok_source)){
  //   // 列表页全局获取 请求参数
  //   MatchPage.get_match_data_list();
  // } else if([1,3,30,100].includes(MenuData.current_menu)){
  //   MatchPage.get_match_data_list()
  // }
  // TODO: 逻辑待添加
  MatchPage.get_match_data_list();
};
/**
 * @description: 赛事列表为空通知事件函数
 */
const upd_match_is_empty = (obj) => {
  // 当是赛果菜单,三级菜单数据没有时,发送列表赛事数据为空消息,收到消息后页面显示为空页面
  if(lodash.get(obj,'type') == 'result' && lodash.get(obj,'event.cmd') == 'list_empty'){
    match_is_empty.value = true;
  }
}
const destroy_handle = () => {
  // websocket_store.sendSocketCloseCmd();
  MatchPage.del();
  matchCtr.value.init();
  store.dispatch({ type: 'topMenuReducer/set_last_time_sub_menu_type', payload: '' })

  clear_timer();
  off_listeners();
};

const unsubscribe = store.subscribe(() => {
  update_state();
});
const update_state = () => {
  const new_state = store.getState();
  get_uid.value = new_state.get_uid;
  get_bet_status.value = new_state.get_bet_status;
  show_favorite_list.value = new_state.show_favorite_list;
  get_show_match_filter.value = new_state.get_show_match_filter;
  get_detail_data.value = new_state.get_detail_data;
  get_details_changing_favorite.value = new_state.get_details_changing_favorite;
  get_is_show_menu.value = new_state.get_is_show_menu;
  get_secondary_unfold_map.value = new_state.get_secondary_unfold_map;
  get_list_scroll_top.value = new_state.get_list_scroll_top;
  get_preload_animation_url.value = new_state.get_preload_animation_url;
};
// 批量清除定时器
const clear_timer = () => {
  const timer_arr = [
    timer_super6.value,
    subscription_timer1.value,
    timer_super9.value,
  ];

  for (let timer of timer_arr) {
    clearTimeout(timer);
    timer = null;
  }
};
// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, () => MatchPage.footer_event).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_MAIN_MENU_CHANGE, () => MatchPage.main_menu_change()).off,
    emitter_3: useMittOn(MITT_TYPES.EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE, () => MatchPage.before_load_third_menu_handle).off,
    emitter_4: useMittOn(MITT_TYPES.EMIT_SPECIAL_HPS_LOADED, special_hps_load_handle).off,
    emitter_5: useMittOn(MITT_TYPES.EMIT_COUNTING_DOWN_START_ENDED, () => MatchPage.counting_down_start_ended_on).off,
    emitter_6: useMittOn(MITT_TYPES.EMIT_BET_ODD_SYNCHRONIZE, () => MatchPage.bet_odd_synchronize_handle).off,
    emitter_7: useMittOn(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING, () => MatchListCard.match_list_scroll_handle).off,
    emitter_8: useMittOn(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, MatchListCard.secondary_play_unfold_change_handle).off,
    emitter_9: useMittOn(MITT_TYPES.EMIT_TAB_HOT_CHANGING, () => MatchListCard.tab_changing_handle).off,
    emitter_10: useMittOn(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, () => upd_match_is_empty).off,

  };
};
// 移除相关事件监听
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x());
};

onActivated(() => {
  enter_time.value = Date.now();
});

onDeactivated(() => {
  destroy_handle();
  matchCtr.value.destroy();
});

onUnmounted(() => {
  destroy_handle();
  unsubscribe();
  matchCtr.value.destroy();
});

defineExpose({
  event_init,
  destroy_handle,
  newer_standard_edition
});
</script>
<style scoped lang="scss">
@import "./styles//index.scss";
</style>