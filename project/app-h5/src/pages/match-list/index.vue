<!--
 * @Description: 赛事列表页用于展示滚球、今日、早盘、串关、冠军等赛事
-->
<template>
  <layoutTop />
  <!--赛事列表-->
  <div class="match-list-page"
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
    <MatchContainer />
    <!-- 回到顶部按钮组件 -->
    <!-- <scroll-top v-show="list_scroll_top > 0" ref="scroll_top" :list_scroll_top="list_scroll_top" @back-top="back_top" /> -->
  </div>
</template>
<script setup>
import { computed, onUnmounted, onMounted, watch, onDeactivated, ref } from "vue";
import { useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/index.js"
import lodash from "lodash";
// import store from "src/store-redux/index.js";
import tiaozhuanPanel from "src/base-h5/components/match-list/components/tiaozhuan-panel.vue";    //  跳转banner图和猜你喜欢
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import layoutTop from "../../layouts/top.vue"
import scrollTop from "src/base-h5/components/common/record-scroll/scroll-top.vue";
import BaseData from 'src/core/base-data/base-data.js'
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import { MenuData, score_switch_handle,  MatchDataWarehouse_H5_List_Common as MatchDataBaseH5} from "src/output/index.js";
import {pre_load_video  } from "src/core/pre-load/module/pre-load-video.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import * as ws_message_listener from "src/core/utils/common/module/ws-message.js";;  
import { menu_type, menu_lv2, is_hot, is_detail, is_zaopan, is_jinzu, is_esports, is_kemp, is_collect } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
// import matchListCardFold from 'src/core/match-list-h5/match-card/match-list-card-fold.js'
import  GATAG  from "src/core/http/gtag-tag.js";
const route = useRoute();
// const store_state = store.getState();
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

let timer = null
let message_fun = null

onMounted(() => {
  // get_page_match_data()

  // 接口请求防抖

  // 增加监听接受返回的监听函数
  message_fun = ws_message_listener.addWsMessageListener((cmd, data) => {
    if (['C101', 'C102', 'C104', 'C901'].includes(cmd)) {
      MatchMeta.handle_remove_match(data)
    } else {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        MatchMeta.handle_ws_directive({ cmd, data })
        clearTimeout(null)
        timer = null
      }, 1500)
    }
  })

  // 初始化赛事列表操作工具类
  if (standard_edition.value == 2) {
    newer_standard_changing.value = true;
  } else {
    MatchListCard.sliding_can_trigger_process_distance = 500;
  }
  // 记录埋点，进入列表页
  GATAG.gtag_view_send("H5_match", "/match");
  // 详情精选赛事页需清空map折叠状态
  // store.dispatch({ type: 'topMenuReducer/set_collapse_map_match', payload: {} })
  // 事件初始化
  event_init();
});

// 获取页面所需数据
const get_page_match_data = () => {
  if (!MenuData.is_collect()) {
    // 非收藏页
    if (MenuData.is_esports()) {
      // 电竞赛事
      MatchMeta.get_esports_match()
    } else {
      if(MenuData.search_tab_index){
        MatchMeta.filter_hot_match_by_tid(MenuData.search_tab_i_tid)
      }else{
        //如果有时间要传时间的
        MatchMeta.set_origin_match_data({md:MenuData.current_lv_3_menu?.field1})
      }
    }
  } else {
    // 收藏页
    if (MenuData.is_esports()) {
      // 电竞收藏
      MatchMeta.get_esports_collect_match()
    } else { 
      // 常规收藏
      MatchMeta.get_collect_match()
    }
  }
}

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

const calc_show = computed(() => {
  return  menu_type.value == 1 && !is_collect.value && !match_is_empty.value && route.name != "home" && is_detail.value
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
  // pre_load_video.load_video_resources(store_state.get_uid, "is_details_page");
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
 * @description 元数据请求回来 初始化赛事加载
 */
const init_match_callback = () => {
  if (route.name !== 'matchList') return
  MatchMeta.set_origin_match_data()
}

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
  // store.dispatch({ type: 'topMenuReducer/set_last_time_sub_menu_type', payload: '' })
  off_listeners();
};

// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, lodash.debounce((v) => {
      MatchMeta.footer_event(v)
    }, 500)).off,
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
  message_fun&&message_fun()
  destroy_handle();
  MatchDataBaseH5.clear()
});

</script>
<style scoped lang="scss">
  
/* ************** 赛事列表包装器 **************** -S */
.match-list-page {
  opacity: 1;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  position: relative;
  flex: 10;
  transition: transform 0.2s;
  .match-list-container{
    height: 100%;
  }
  background: var(--q-gb-bg-c-21) !important;
  .animation{
    animation: my-animation 0.3s ease-in
  }
  &.no-padding-bottom {
    padding-bottom: 0;
  }

  &.mini_x {
    padding-top: 0.95rem;
  }

  &.mini_s {
    padding-top: 1.3rem;
  }

  .gap{
    height: .41rem; // 因该为0.4 多设一个像素 0.41
    width: 100%;
    // 缝隙 专门用于解决遮罩和底部的间隙问题
   // background-image: var(--q-color-com-img-bg-2);
    background: var(--q-color-page-bg-color-2);
    &.zaopan{
      background: var(--q-color-page-bg-color-45);
    }

  }

  &.show-status {
    padding-top:.94rem;
  }

  &.zaopan {
    // padding-top:1.3rem;
  }
  // &.esport {
  //   padding-top: 1.4rem;
  // }

  &.guanjun {
    padding-top: 5px;
  }

  &.level_four_menu {
    padding-top: 1.38rem;
  }

  &.jingzu {
    padding-top: 0.4rem;
  }

  &.detail_match_list {
    padding-top: 0;
    padding-bottom: 0;
    .refresh-container{
      padding-top: 0;
    }
  }
  .cover-loading {
    width: 0.4rem;
    display: block;
    position: fixed;
    left: 50%;
    z-index: 30;
    justify-content: center;
    align-items: flex-start;
    margin-left: -0.2rem;
    margin-top: 1.68rem;
  }

  .loading-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 502;

    &.dark {
      background-color: transparent;
    }
  }
  .loading-more-container {
    width: 100%;
    height: 1.81rem;
    padding: 0.88rem 0 0.6rem 0;
    text-align: center;
    //bottom: -2rem;
    //position: absolute;
    //left: 0;
    &.home_hot{
      position: unset;
      bottom: unset;
    }
  }
}

@keyframes my-animation {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  50% {
    transform: translate3d(50%, 0, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
}
</style>
