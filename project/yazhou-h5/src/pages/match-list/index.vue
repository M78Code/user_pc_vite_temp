<!--
 * @Description: 赛事列表页用于展示滚球、今日、早盘、串关、冠军等赛事
-->
<template>
  <!--赛事列表-->
  <div class="match-list-page"
    ref="match_list_page" 
    @scroll="wrapper_scroll_handler" 
    :class="{
      guanjun: is_kemp,
      jingzu: is_jinzu,
      esport: is_esports,
      animation: animation,
      detail_match_list: is_hot || is_detail,
      zaopan: [3, 11, 28, 3000].includes(menu_type) && !is_hot,
      level_four_menu: menu_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(menu_lv2.mi),
    }" >
    <!--缝隙 不通层级 遮罩 存在渲染偏差， 边界 双线 或者 侵蚀问题-->
    <!-- <div class="gap" v-if="on_match && menu_type != 3000" :class="{ zaopan: [4, 11, 28, 3000].includes(menu_type) }" /> -->
    <!-- 跳转到其他场馆的banner图 和猜你喜欢-->
    <tiaozhuan-panel v-if="calc_show"></tiaozhuan-panel>
    <!-- 列表骨架屏 -->
    <!-- <SList v-if="show_skeleton_screen" :loading_body="true" /> -->
    <!-- 赛事列表 -->
    <match-container />
    <!-- 回到顶部按钮组件 -->
    <scroll-top v-show="!get_is_show_menu && list_scroll_top > 0" ref="scroll_top" :list_scroll_top="list_scroll_top" @back-top="back_top" />
  </div>
</template>
<script setup>
import { computed, onUnmounted, onMounted, watch, onDeactivated, ref } from "vue";
import { useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import lodash from "lodash";
import store from "src/store-redux/index.js";
import tiaozhuanPanel from "src/base-h5/components/match-list/components/tiaozhuan-panel.vue";    //  跳转banner图和猜你喜欢
import matchContainer from "src/base-h5/components/match-list/index.vue";
 
import scrollTop from "src/base-h5/components/common/record-scroll/scroll-top.vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 ,MenuData, score_switch_handle} from "src/output/index.js"
import {pre_load_video  } from "src/core/pre-load/module/pre-load-video.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import { menu_type, menu_lv2, is_hot, is_detail, is_zaopan, is_jinzu, is_esports, is_kemp } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
// import matchListCardFold from 'src/core/match-list-h5/match-card/match-list-card-fold.js'
import {  gtag_view_send} from "src/core/http/gtag-tag.js";
const route = useRoute();
const store_state = store.getState();
// const websocket_store = use_websocket_store()

const match_main = ref(null);
const scroll_top = ref(null);
const match_list_page = ref(null);
const emitters = ref({});
const animation = ref(false);
const match_is_empty = ref(false);
// 赛事操作工具类
const matchCtr = ref(MatchDataBaseH5);
// 赛事列表接口请求中提示
const is_data_requesting = ref(true);
//正在切换新版与标准版
const newer_standard_changing = ref(false);
//投注栏弹层显示非0否则0
const local_bet_status = ref(0);
// 赛事列表滑动高度
const list_scroll_top = ref(0);
const timer_super6 = ref(null);
const subscription_timer1 = ref(null);

// 显示收藏弹窗
const show_favorite_list = ref(store_state.show_favorite_list);

// 右侧设置菜单显示时 , 不显示骨架屏
const get_is_show_menu = ref(store_state.get_is_show_menu);
const get_preload_animation_url = ref(store_state.get_preload_animation_url);

onMounted(() => {
  // 初始化赛事列表操作工具类
  if (standard_edition.value == 2) {
    newer_standard_changing.value = true;
  } else {
    MatchListCard.sliding_can_trigger_process_distance = 500;
  }
  // 记录埋点，进入列表页
  gtag_view_send("H5_match", "/match");
  // 详情精选赛事页需清空map折叠状态
  store.dispatch({ type: 'topMenuReducer/set_collapse_map_match', payload: {} })
  // 事件初始化
  event_init();
});

// 页脚子菜单
watch(() => MenuData.footer_sub_menu_id, () => {
  const prev_footer_sub_menu_id = lodash.get(MenuData, 'prev_footer_sub_menu_id')
  if ( (prev_footer_sub_menu_id != curr && curr == 114) || (prev_footer_sub_menu_id != curr && prev_footer_sub_menu_id == 114) ) {
    matchCtr.value.list.forEach((item) => {
      score_switch_handle(item);
    });
  }
  MenuData.prev_footer_sub_menu_id = curr;
}
);

// 新手版标准版切换
watch(() => standard_edition.value, (n) => {
  // 虚拟体育
  if (menu_type.value == 900) return
  // 如果是简版
  if (n == 1) {
    MatchListCard.sliding_can_trigger_process_distance = 500;
  }
  run_process_when_need_recompute_container_list_when_scroll(false, { update_type: "standard_simple_change", });
}
);

const calc_show = computed(() => {
  return  menu_type.value == 1 && !show_favorite_list && !match_is_empty.value && route.name != "home" && is_detail.value
});

const on_match = computed(() => {
  return window.location.hash.includes("match");
});

// 显示骨架屏
const show_skeleton_screen = computed(() => {
  return is_data_requesting.value && !(is_hot.value || is_detail.value);
});

// 回到顶部
const back_top = () => {
  match_list_page.value?.scrollTo(0, 0);
};
/**
 * @description:  事件初始化
 */
const event_init = () => {
  // 详情页的视频预加载
  pre_load_video.load_video_resources(store_state.get_uid, "is_details_page");
  // 不让浏览器记住上次的滚动位置
  if ("scrollRestoration" in History) {
    history.scrollRestoration = "manual";
  }
  // 移除相关事件监听
  off_listeners();
  // 绑定相关事件监听
  on_listeners();
  // 图标出错与mid映射，初始化为空
  // store.dispatch({ type: 'matchReducer/set_img_error_map_mid', payload: {} })
  // window.vue.scroll_list_wrapper_by = use_router_scroll().scroll_list_wrapper_by
  // 去除参数
  if (!location.search.includes("keep_url")) {
    history.replaceState(window.history.state, "", `${location.pathname}${location.hash}`);
  }
  // set_hide_skeleton_screen(true)
};

/**
 * @description 综合菜单切换页面卡顿效果
 */
const handle_menu_change = () => {
  animation.value = true
  let timer = setTimeout(() => {
    animation.value = false
    clearTimeout(timer)
    timer = null
  }, 500)
}


const destroy_handle = () => {
  // websocket_store.sendSocketCloseCmd();
  matchCtr.value.init();
  store.dispatch({ type: 'topMenuReducer/set_last_time_sub_menu_type', payload: '' })
  off_listeners();
};

const unsubscribe = store.subscribe(() => {
  update_state();
});
const update_state = () => {
  const new_state = store.getState();
  show_favorite_list.value = new_state.show_favorite_list;
  get_is_show_menu.value = new_state.get_is_show_menu;
  get_preload_animation_url.value = new_state.get_preload_animation_url;
};

// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD,(v)=> MatchPage.footer_event(v)).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_MAIN_MENU_CHANGE, (v)=>MatchPage.main_menu_change(v)).off,
    emitter_7: useMittOn(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING, (v)=> MatchListCard.match_list_scroll_handle(v)).off,
    // emitter_11: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, init_match_callback).off,
    emitter_12: useMittOn(MITT_TYPES.EMIT_MENU_ANIMATION, handle_menu_change).off,
  };
};
// 移除相关事件监听
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x());
};

onDeactivated(() => {
  destroy_handle();
  MatchDataBaseH5.clear()
});

onUnmounted(() => {
  destroy_handle();
  unsubscribe();
  MatchDataBaseH5.clear()
});

</script>
<style scoped lang="scss">
  @import "./index.scss";
</style>
